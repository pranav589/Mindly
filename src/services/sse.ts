import EventSource from "react-native-sse";
import { API_BASE_URL, getAuthToken } from "./api";
 
export interface SSEMessage {
  type:
    | "ping"
    | "connected"
    | "query:chunk"
    | "query:complete"
    | "roadmap:progress"
    | "roadmap:complete"
    | "podcast:complete"
    | "mindmap:complete"
    | "notifications:updated"
    | "indexing:start"
    | "indexing:complete"
    | "indexing:failed";
  text?: string; // For chunk
  messageId?: string; // For complete
  content?: string; // For complete
  sources?: any[]; // For complete
  message?: string; // For progress
  roadmap?: any;
  podcast?: any;
  mindMap?: any;
  audioUrl?: string;
  script?: any[];
}
 
export function subscribeToNotebookSSE(
  notebookId: string,
  onMessage: (event: SSEMessage) => void
) {
  const url = `${API_BASE_URL}/api/notebooks/${notebookId}/sse`;
  const token = getAuthToken();
 
  const options: any = {
    headers: {
      Accept: "text/event-stream",
    },
  };
 
  if (token) {
    options.headers.Authorization = `Bearer ${token}`;
  }
 
  const es = new EventSource<any>(url, options);
 
  es.addEventListener("message", (event) => {
    try {
      if (event.data) {
        const parsed = JSON.parse(event.data) as SSEMessage;
        onMessage(parsed);
      }
    } catch (e) {
      // Ignore incomplete or unparseable JSON
    }
  });
 
  es.addEventListener("error", (event: any) => {
    console.error("SSE Connection error:", event.message || event.detail || event);
  });
 
  return () => {
    es.close();
  };
}
