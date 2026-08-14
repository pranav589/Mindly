export interface Message {
  id: string;
  sender: "user" | "ai";
  text: string;
  citations?: any[];
}

export interface CitationData {
  id: string | number;
  sourceName: string;
  page: string;
  context: string;
  highlightedText: string;
}
