import { useNotifications } from "@/context/NotificationContext";
import { API_BASE_URL, getAuthToken } from "@/services/api";
import { SSEMessage } from "@/services/sse";
import { useQueryClient } from "@tanstack/react-query";
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { AppState } from "react-native";
import EventSource from "react-native-sse";
import { usePathname } from "expo-router";

export type SSEStatus = "disconnected" | "connecting" | "connected";

export interface SSEEventWrapper {
  event: SSEMessage;
  timestamp: number;
}

interface SSEContextType {
  status: SSEStatus;
  streamingText: string;
  isTyping: boolean;
  setStreamingText: React.Dispatch<React.SetStateAction<string>>;
  setIsTyping: React.Dispatch<React.SetStateAction<boolean>>;
  lastEvent: SSEEventWrapper | null;
}

const SSEContext = createContext<SSEContextType>({
  status: "disconnected",
  streamingText: "",
  isTyping: false,
  setStreamingText: () => {},
  setIsTyping: () => {},
  lastEvent: null,
});

// Helper to sanitize developer-facing errors for user notifications
function cleanError(err: string): string {
  if (!err) return "Something went wrong.";
  const lower = err.toLowerCase();
  if (lower.includes("qdrant") || lower.includes("apierror") || lower.includes("not found")) {
    return "Could not connect to the database. Please try re-indexing again.";
  }
  if (lower.includes("compatibility") || lower.includes("server version")) {
    return "Service version mismatch. Please try again.";
  }
  if (lower.includes("pdf") || lower.includes("extract") || lower.includes("parse")) {
    return "Failed to parse document content. Please ensure the file is valid and readable.";
  }
  
  // Strip out hex IDs, job IDs, URLs, and clean trailing colons
  return err
    .replace(/[a-f0-9]{24}/ig, "")
    .replace(/job\s+\d+/ig, "")
    .replace(/https?:\/\/\S+/g, "server")
    .replace(/:\s*$/, "")
    .trim() || "An error occurred during processing.";
}

interface JobConfig {
  displayName: string;
  screenName: string;
}

const JOB_CONFIGS: Record<string, JobConfig> = {
  sources: { displayName: "Source Indexing", screenName: "sources" },
  podcast: { displayName: "AI Podcast Summary", screenName: "podcast" },
  roadmap: { displayName: "Syllabus Roadmap", screenName: "roadmap" },
  mindmap: { displayName: "Interactive Mind Map", screenName: "mindmap" },
};

export const SSEProvider: React.FC<{
  notebookId: string;
  children: React.ReactNode;
}> = ({ notebookId, children }) => {
  const [status, setStatus] = useState<SSEStatus>("disconnected");
  const [streamingText, setStreamingText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [lastEvent, setLastEvent] = useState<SSEEventWrapper | null>(null);
  const queryClient = useQueryClient();
  const esRef = useRef<EventSource<any> | null>(null);

  const { sendLocalNotification } = useNotifications();
  const activeJobs = useRef<Set<string>>(new Set());
  const notifiedJobs = useRef<Set<string>>(new Set());
  const pathname = usePathname();

  // Helper to map route to generic screen category
  const getActiveScreen = (path: string) => {
    if (!path) return "chat";
    const jobKey = Object.keys(JOB_CONFIGS).find((key) =>
      path.endsWith("/" + JOB_CONFIGS[key].screenName),
    );
    if (jobKey) return jobKey;
    if (path.endsWith("/quiz")) return "quiz";
    if (path.endsWith("/flashcard")) return "flashcard";
    return "chat";
  };

  // Route-aware AppState change listener for background notifications
  useEffect(() => {
    const handleAppStateChange = (nextAppState: string) => {
      if (nextAppState === "background" && notebookId) {
        const currentScreen = getActiveScreen(pathname);

        // Find running jobs that are permitted to notify on the current screen and haven't notified yet
        const jobsToNotify = Array.from(activeJobs.current).filter((job) => {
          if (notifiedJobs.current.has(job)) return false;

          const config = JOB_CONFIGS[job];
          const isOwnScreen = config && currentScreen === config.screenName;

          return currentScreen === "chat" || isOwnScreen;
        });

        if (jobsToNotify.length > 0) {
          const runningJobNames = jobsToNotify.map(
            (job) => JOB_CONFIGS[job]?.displayName || job,
          );

          const primaryJob = jobsToNotify[0];
          const targetScreen = JOB_CONFIGS[primaryJob]?.screenName || primaryJob;

          // Mark jobs as notified for this run
          jobsToNotify.forEach((job) => notifiedJobs.current.add(job));

          sendLocalNotification(
            "Processing Study Materials",
            `Mindly is compiling: ${runningJobNames.join(", ")}. We will notify you when it's ready!`,
            { notebookId, screen: targetScreen },
          );
        }
      }
    };

    const appStateSub = AppState.addEventListener(
      "change",
      handleAppStateChange,
    );
    return () => appStateSub.remove();
  }, [notebookId, pathname, sendLocalNotification]);



  useEffect(() => {
    if (!notebookId) return;

    const token = getAuthToken();
    const url = `${API_BASE_URL}/api/notebooks/${notebookId}/sse`;
    const options: any = {
      headers: {
        Accept: "text/event-stream",
      },
      withCredentials: true,
    };

    if (token) {
      options.headers.Authorization = `Bearer ${token}`;
    }

    setStatus("connecting");
    const es = new EventSource<any>(url, options);
    esRef.current = es;

    es.addEventListener("open", () => {
      setStatus("connected");
    });

    es.addEventListener("message", (event) => {
      try {
        if (!event.data) return;
        const parsed = JSON.parse(event.data) as any;

        // Ignore keep-alive ping and initial connection events for state updates
        if (parsed.type === "ping" || parsed.type === "connected") return;

        console.log(
          `⚡ [FRONTEND SSE] Received event: ${parsed.type} at: ${new Date().toISOString()}`,
        );
        setLastEvent({ event: parsed, timestamp: Date.now() });

        switch (parsed.type) {
          case "query:chunk":
            setIsTyping(true);
            setStreamingText((prev) => prev + (parsed.text || ""));
            break;

          case "query:complete":
            setIsTyping(false);
            setStreamingText("");
            queryClient.invalidateQueries({
              queryKey: ["messages", notebookId],
            });
            break;

          case "roadmap:progress":
            activeJobs.current.add("roadmap");
            notifiedJobs.current.delete("roadmap");
            queryClient.setQueryData(
              ["roadmap:progress", notebookId],
              parsed.message,
            );
            break;

          case "roadmap:complete":
            activeJobs.current.delete("roadmap");
            notifiedJobs.current.delete("roadmap");
            sendLocalNotification(
              "Roadmap Generated! 🗺️",
              "Your personalized learning roadmap timeline is ready.",
              { notebookId, screen: "roadmap" },
            );
            queryClient.invalidateQueries({
              queryKey: ["roadmap", notebookId],
            });
            break;

          case "roadmap:failed":
            activeJobs.current.delete("roadmap");
            notifiedJobs.current.delete("roadmap");
            sendLocalNotification(
              "Roadmap Generation Failed ❌",
              cleanError(parsed.error) || "Failed to generate roadmap syllabus",
              { notebookId, screen: "roadmap" },
            );
            break;

          case "podcast:progress":
            activeJobs.current.add("podcast");
            notifiedJobs.current.delete("podcast");
            break;

          case "podcast:complete":
            activeJobs.current.delete("podcast");
            notifiedJobs.current.delete("podcast");
            sendLocalNotification(
              "Podcast Synthesized! 🎙️",
              "Your AI host overview discussion audio is ready to stream.",
              { notebookId, screen: "podcast" },
            );
            queryClient.invalidateQueries({
              queryKey: ["podcast", notebookId],
            });
            break;

          case "podcast:failed":
            activeJobs.current.delete("podcast");
            notifiedJobs.current.delete("podcast");
            sendLocalNotification(
              "Podcast Synthesis Failed ❌",
              cleanError(parsed.error) || "Failed to generate podcast audio discussion",
              { notebookId, screen: "podcast" },
            );
            break;

          case "mindmap:progress":
            activeJobs.current.add("mindmap");
            notifiedJobs.current.delete("mindmap");
            break;

          case "mindmap:complete":
            activeJobs.current.delete("mindmap");
            notifiedJobs.current.delete("mindmap");
            sendLocalNotification(
              "Mind Map Created! 🧠",
              "Your interactive concept mind map is ready to explore.",
              { notebookId, screen: "mindmap" },
            );
            queryClient.invalidateQueries({
              queryKey: ["mindmap", notebookId],
            });
            break;

          case "mindmap:failed":
            activeJobs.current.delete("mindmap");
            notifiedJobs.current.delete("mindmap");
            sendLocalNotification(
              "Mind Map Generation Failed ❌",
              cleanError(parsed.error) || "Failed to compile concept map",
              { notebookId, screen: "mindmap" },
            );
            break;

          case "indexing:start":
            activeJobs.current.add("sources");
            notifiedJobs.current.delete("sources");
            queryClient.invalidateQueries({
              queryKey: ["sources", notebookId],
            });
            queryClient.invalidateQueries({
              queryKey: ["notebook", notebookId],
            });
            break;

          case "indexing:complete":
            activeJobs.current.delete("sources");
            notifiedJobs.current.delete("sources");
            sendLocalNotification(
              "Source Indexed! 📄",
              `"${parsed.sourceName || "Your document"}" has been successfully synced and is ready to study.`,
              { notebookId, screen: "sources" },
            );
            queryClient.invalidateQueries({
              queryKey: ["sources", notebookId],
            });
            queryClient.invalidateQueries({
              queryKey: ["notebook", notebookId],
            });
            break;

          case "indexing:failed":
            activeJobs.current.delete("sources");
            notifiedJobs.current.delete("sources");
            sendLocalNotification(
              "Ingestion Failed ❌",
              `Failed to index "${parsed.sourceName || "your document"}": ${cleanError(parsed.error)}.`,
              { notebookId, screen: "sources" },
            );
            queryClient.invalidateQueries({
              queryKey: ["sources", notebookId],
            });
            queryClient.invalidateQueries({
              queryKey: ["notebook", notebookId],
            });
            break;
        }
      } catch (err) {
        // Ignore JSON parse errors for incomplete chunks
      }
    });

    es.addEventListener("error", (event: any) => {
      console.log(
        "🔌 [SSE] Connection dropped/disconnected:",
        event.message || event.detail || event,
      );
      setStatus("disconnected");
    });

    return () => {
      es.close();
      esRef.current = null;
      setStatus("disconnected");
    };
  }, [notebookId, queryClient, sendLocalNotification]);

  return (
    <SSEContext.Provider
      value={{
        status,
        streamingText,
        isTyping,
        setStreamingText,
        setIsTyping,
        lastEvent,
      }}
    >
      {children}
    </SSEContext.Provider>
  );
};

export const useSSE = () => useContext(SSEContext);
