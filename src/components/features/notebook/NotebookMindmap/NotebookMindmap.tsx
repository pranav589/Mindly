import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";
import BottomSheet from "@/components/BottomSheet";
import { useSSE } from "@/context/SSEContext";
import { apiClient } from "@/services/api";
import { styles } from "./NotebookMindmap.styles";

// ── Types ──────────────────────────────────────────────────────────────────────
interface MindMapNode {
  id: string;
  label: string;
  summary: string;
  description: string;
  keyPoints: string[];
  whyItMatters: string;
  difficulty: "intro" | "intermediate" | "advanced";
  example?: string;
  relatedQuestions: string[];
  sourceId: string;
  sourceName: string;
  sourceType: string;
  sourceLocation: number;
}

interface MindMapEdge {
  id: string;
  source: string;
  target: string;
  label: string;
  type:
    | "prerequisite"
    | "related_to"
    | "part_of"
    | "example_of"
    | "contrasts_with";
}

interface MindMapData {
  nodes: MindMapNode[];
  edges: MindMapEdge[];
}

interface NotebookData {
  _id: string;
  name: string;
  mindMap?: MindMapData;
  mindMapStatus?: "idle" | "generating";
}

// ── Component ──────────────────────────────────────────────────────────────────
export function NotebookMindmap() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const queryClient = useQueryClient();
  const { lastEvent } = useSSE();

  const [selectedNode, setSelectedNode] = useState<MindMapNode | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const { data: notebook, isLoading: isLoadingNotebook } =
    useQuery<NotebookData>({
      queryKey: ["notebook", id],
      queryFn: async () => {
        const res = await apiClient.get<{ notebook: NotebookData }>(
          `/api/notebooks/${id}`,
        );
        return res.data.notebook;
      },
      enabled: !!id,
    });

  const progressText = useSSEProgress(id as string);

  useEffect(() => {
    if (lastEvent?.event?.type === "mindmap:complete") {
      queryClient.invalidateQueries({ queryKey: ["notebook", id] });
    }
  }, [lastEvent, id, queryClient]);

  const generateMindmapMutation = useMutation({
    mutationFn: async () => {
      const res = await apiClient.post(`/api/mindmap`, { notebookId: id });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notebook", id] });
    },
    onError: (err: any) => {
      console.warn("Mindmap generation error:", err?.response?.data?.error || err.message);
      Alert.alert(
        "Error",
        err?.response?.data?.error ?? "Failed to initiate mind map generation.",
      );
    },
  });

  const isGenerating =
    notebook?.mindMapStatus === "generating" ||
    generateMindmapMutation.isPending;

  const handleWebViewMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === "node_click" && data.node) {
        setSelectedNode(data.node);
        setIsSheetOpen(true);
      }
    } catch (err) {
      console.error("Failed to parse message from WebView:", err);
    }
  };

  const containerInsetPadding = { paddingTop: insets.top };

  if (isLoadingNotebook) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#117864" />
        <Text style={styles.loadingText}>Loading notebook details…</Text>
      </View>
    );
  }

  if (isGenerating) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#117864" />
        <Text style={styles.generatingTitle}>Structuring Concept Map</Text>
        <Text style={styles.generatingSubtitle}>
          {progressText ||
            "Analyzing source materials and linking core ideas..."}
        </Text>
      </View>
    );
  }

  if (
    !notebook?.mindMap ||
    !notebook.mindMap.nodes ||
    notebook.mindMap.nodes.length === 0
  ) {
    return (
      <View style={[styles.container, containerInsetPadding]}>
        <StatusBar style="dark" />
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.headerButton}>
            <Ionicons name="arrow-back" size={24} color="#117864" />
          </Pressable>
          <Text style={styles.headerTitle}>Concept Mind Map</Text>
          <View style={styles.headerPlaceholder} />
        </View>

        <View style={styles.centered}>
          <Ionicons name="git-network-outline" size={72} color="#c8d8d5" />
          <Text style={styles.emptyTitle}>No Mind Map Yet</Text>
          <Text style={styles.emptySubtitle}>
            Build an interactive, zoomable network of concepts mapped
            automatically from your notebook sources.
          </Text>
          <Pressable
            onPress={() => {
              generateMindmapMutation.mutate();
              router.replace(`/notebook/${id}` as any);
              Alert.alert(
                "Generating Mind Map",
                "Your interactive mind map is being generated in the background. You'll receive a notification when it's ready!"
              );
            }}
            style={styles.primaryButton}
          >
            <Ionicons name="sparkles-outline" size={18} color="#fff" />
            <Text style={styles.primaryButtonText}>Generate Mind Map</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  const htmlContent = getMindMapHtml(notebook.mindMap);

  return (
    <View style={[styles.container, containerInsetPadding]}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.headerButton}>
          <Ionicons name="arrow-back" size={24} color="#117864" />
        </Pressable>
        <Text style={styles.headerTitle}>Concept Mind Map</Text>
        <Pressable
          onPress={() => {
            Alert.alert(
              "Regenerate Mind Map",
              "This will rebuild your concept layout from current notebook sources. Continue?",
              [
                { text: "Cancel", style: "cancel" },
                {
                  text: "Regenerate",
                  onPress: () => {
                    generateMindmapMutation.mutate();
                    router.replace(`/notebook/${id}` as any);
                    Alert.alert(
                      "Generating Mind Map",
                      "Your interactive mind map is being generated in the background. You'll receive a notification when it's ready!"
                    );
                  },
                },
              ],
            );
          }}
          style={styles.headerButton}
        >
          <Ionicons name="refresh-outline" size={22} color="#117864" />
        </Pressable>
      </View>

      {/* WebView rendering the interactive D3 mindmap */}
      <View style={styles.webviewContainer}>
        <WebView
          originWhitelist={["*"]}
          source={{ html: htmlContent }}
          style={styles.webview}
          onMessage={handleWebViewMessage}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          scalesPageToFit={false}
          scrollEnabled={false}
        />
      </View>

      {/* NODE DETAILS BOTTOM SHEET */}
      <BottomSheet
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        title={selectedNode?.label || "Concept Details"}
      >
        {selectedNode && (
          <View style={styles.sheetContent}>
            {/* Difficulty Badge */}
            <View style={styles.badgeRow}>
              <View
                style={[
                  styles.diffBadge,
                  selectedNode.difficulty === "advanced"
                    ? styles.diffRed
                    : selectedNode.difficulty === "intermediate"
                      ? styles.diffOrange
                      : styles.diffGreen,
                ]}
              >
                <Text
                  style={[
                    styles.diffBadgeText,
                    selectedNode.difficulty === "advanced"
                      ? styles.textRed
                      : selectedNode.difficulty === "intermediate"
                        ? styles.textOrange
                        : styles.textGreen,
                  ]}
                >
                  {selectedNode.difficulty.toUpperCase()}
                </Text>
              </View>
              <View style={styles.sourceTag}>
                <Ionicons
                  name="document-text-outline"
                  size={12}
                  color="#117864"
                />
                <Text style={styles.sourceTagText} numberOfLines={1}>
                  {selectedNode.sourceName}
                </Text>
              </View>
            </View>

            <Text style={styles.nodeDescription}>
              {selectedNode.description}
            </Text>

            {/* Why it matters */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Why It Matters</Text>
              <Text style={styles.sectionText}>
                {selectedNode.whyItMatters}
              </Text>
            </View>

            {/* Key Points */}
            {selectedNode.keyPoints && selectedNode.keyPoints.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionLabel}>Key Takeaways</Text>
                {selectedNode.keyPoints.map((pt, i) => (
                  <View key={i} style={styles.bulletRow}>
                    <Text style={styles.bulletSymbol}>•</Text>
                    <Text style={styles.bulletText}>{pt}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* Example */}
            {selectedNode.example ? (
              <View style={styles.section}>
                <Text style={styles.sectionLabel}>Example</Text>
                <View style={styles.exampleBox}>
                  <Text style={styles.exampleText}>{selectedNode.example}</Text>
                </View>
              </View>
            ) : null}

            {/* Related Questions */}
            {selectedNode.relatedQuestions &&
              selectedNode.relatedQuestions.length > 0 && (
                <View style={styles.section}>
                  <Text style={styles.sectionLabel}>Think About It</Text>
                  {selectedNode.relatedQuestions.map((q, i) => (
                    <Text key={i} style={styles.questionText}>
                      ❓ {q}
                    </Text>
                  ))}
                </View>
              )}

            <Pressable
              onPress={() => setIsSheetOpen(false)}
              style={({ pressed }) => [
                styles.primaryButton,
                styles.sheetDoneButton,
                pressed && styles.pressedOpacity,
              ]}
            >
              <Text style={styles.primaryButtonText}>Done</Text>
            </Pressable>
          </View>
        )}
      </BottomSheet>
    </View>
  );
}

function useSSEProgress(notebookId: string) {
  const queryClient = useQueryClient();
  return (
    queryClient.getQueryData<string>(["mindmap:progress", notebookId]) || ""
  );
}

// Generates the webview interactive layout HTML string
function getMindMapHtml(data: MindMapData): string {
  const serializedNodes = JSON.stringify(data.nodes);
  const serializedEdges = JSON.stringify(data.edges);

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
      <style>
        body, html {
          margin: 0; padding: 0; width: 100%; height: 100%;
          overflow: hidden; background-color: #f8fafa;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        }
        svg {
          width: 100%; height: 100%;
          cursor: grab;
        }
        svg:active {
          cursor: grabbing;
        }
        .node circle {
          stroke-width: 2.5px;
          stroke: #ffffff;
          cursor: pointer;
          transition: r 0.2s cubic-bezier(0.2, 0.8, 0.2, 1);
        }
        .node:hover circle {
          r: 32px !important;
        }
        .node text {
          font-size: 13px;
          font-weight: 700;
          fill: #1f2937;
          text-anchor: middle;
          pointer-events: none;
          paint-order: stroke;
          stroke: #ffffff;
          stroke-width: 4px;
          stroke-linejoin: round;
        }
        .link {
          fill: none;
          stroke: #a2d9ce;
          stroke-opacity: 0.65;
          stroke-width: 2px;
          stroke-dasharray: 4 2;
        }
        .link-label {
          font-size: 9px;
          fill: #7f8c8d;
          text-anchor: middle;
          pointer-events: none;
          paint-order: stroke;
          stroke: #ffffff;
          stroke-width: 2.5px;
        }
      </style>
      <script src="https://d3js.org/d3.v7.min.js"></script>
    </head>
    <body>
      <svg id="mindmap"></svg>
      <script>
        const nodes = ${serializedNodes};
        const edges = ${serializedEdges};
 
        const links = edges.map(e => ({
          id: e.id,
          source: e.source,
          target: e.target,
          label: e.label || ""
        }));
 
        const svg = d3.select("#mindmap");
        const width = window.innerWidth;
        const height = window.innerHeight;
 
        const container = svg.append("g");
 
        const zoom = d3.zoom()
          .scaleExtent([0.3, 3])
          .on("zoom", (event) => {
            container.attr("transform", event.transform);
          });
        svg.call(zoom);
 
        const simulation = d3.forceSimulation(nodes)
          .force("link", d3.forceLink(links).id(d => d.id).distance(140))
          .force("charge", d3.forceManyBody().strength(-300))
          .force("center", d3.forceCenter(width / 2, height / 2))
          .force("collision", d3.forceCollide().radius(60));
 
        const link = container.append("g")
          .selectAll("line")
          .data(links)
          .join("line")
          .attr("class", "link");
 
        const linkText = container.append("g")
          .selectAll("text")
          .data(links)
          .join("text")
          .attr("class", "link-label")
          .text(d => d.label);
 
        const node = container.append("g")
          .selectAll("g")
          .data(nodes)
          .join("g")
          .attr("class", "node")
          .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended))
          .on("click", (event, d) => {
            window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'node_click', node: d }));
          });
 
        const colors = {
          intro: "#117864",
          intermediate: "#f39c12",
          advanced: "#e74c3c"
        };
 
        node.append("circle")
          .attr("r", 25)
          .attr("fill", d => colors[d.difficulty] || "#117864")
          .style("filter", "drop-shadow(0px 4px 6px rgba(0,0,0,0.15))");
 
        node.append("text")
          .attr("y", 40)
          .text(d => d.label);
 
        simulation.on("tick", () => {
          link
            .attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y);
 
          linkText
            .attr("x", d => (d.source.x + d.target.x) / 2)
            .attr("y", d => (d.source.y + d.target.y) / 2 - 5);
 
          node
            .attr("transform", d => \`translate(\${d.x},\${d.y})\`);
        });
 
        function dragstarted(event, d) {
          if (!event.active) simulation.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
        }
        function dragged(event, d) {
          d.fx = event.x;
          d.fy = event.y;
        }
        function dragended(event, d) {
          if (!event.active) simulation.alphaTarget(0);
          d.fx = null;
          d.fy = null;
        }
 
        setTimeout(() => {
          const initialScale = 0.8;
          svg.call(zoom.transform, d3.zoomIdentity.translate(width / 10, height / 10).scale(initialScale));
        }, 150);
      </script>
    </body>
    </html>
  `;
}
