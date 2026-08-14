import React, { createContext, useContext, useEffect, useState, useRef } from "react";
import EventSource from "react-native-sse";
import { API_BASE_URL, getAuthToken } from "@/services/api";
import { useQueryClient } from "@tanstack/react-query";
import { SSEMessage } from "@/services/sse";

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

export const SSEProvider: React.FC<{ notebookId: string; children: React.ReactNode }> = ({
  notebookId,
  children,
}) => {
  const [status, setStatus] = useState<SSEStatus>("disconnected");
  const [streamingText, setStreamingText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [lastEvent, setLastEvent] = useState<SSEEventWrapper | null>(null);
  const queryClient = useQueryClient();
  const esRef = useRef<EventSource<any> | null>(null);

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
        const parsed = JSON.parse(event.data) as SSEMessage;
        
        // Ignore keep-alive ping and initial connection events for state updates
        if (parsed.type === "ping" || parsed.type === "connected") return;

        console.log(`⚡ [FRONTEND SSE] Received event: ${parsed.type} at: ${new Date().toISOString()}`);
        setLastEvent({ event: parsed, timestamp: Date.now() });

        switch (parsed.type) {
          case "query:chunk":
            setIsTyping(true);
            setStreamingText((prev) => prev + (parsed.text || ""));
            break;

          case "query:complete":
            setIsTyping(false);
            setStreamingText("");
            // Invalidate message history query in the background silently
            queryClient.invalidateQueries({ queryKey: ["messages", notebookId] });
            break;

          case "roadmap:progress":
            // Invalidate/set progress indicator for roadmap
            queryClient.setQueryData(["roadmap:progress", notebookId], parsed.message);
            break;

          case "roadmap:complete":
            queryClient.invalidateQueries({ queryKey: ["roadmap", notebookId] });
            break;

          case "podcast:complete":
            queryClient.invalidateQueries({ queryKey: ["podcast", notebookId] });
            break;

          case "mindmap:complete":
            queryClient.invalidateQueries({ queryKey: ["mindmap", notebookId] });
            break;

          case "indexing:start":
          case "indexing:complete":
          case "indexing:failed":
            queryClient.invalidateQueries({ queryKey: ["sources", notebookId] });
            queryClient.invalidateQueries({ queryKey: ["notebook", notebookId] });
            break;
        }
      } catch (err) {
        // Ignore JSON parse errors for incomplete chunks
      }
    });

    es.addEventListener("error", (event: any) => {
      console.error("SSE Connection error:", event.message || event.detail || event);
      setStatus("disconnected");
    });

    return () => {
      es.close();
      esRef.current = null;
      setStatus("disconnected");
    };
  }, [notebookId, queryClient]);

  return (
    <SSEContext.Provider value={{ status, streamingText, isTyping, setStreamingText, setIsTyping, lastEvent }}>
      {children}
    </SSEContext.Provider>
  );
};

export const useSSE = () => useContext(SSEContext);
