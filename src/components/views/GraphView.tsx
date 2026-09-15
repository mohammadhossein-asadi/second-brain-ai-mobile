import React, { useState, useMemo } from "react";
import { View, Pressable, ScrollView, Text as RNText } from "react-native";
import Svg, { Circle, Line, Text as SvgText } from "react-native-svg";
import {
  Network,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  ExternalLink,
  X,
} from "lucide-react-native";
import { useAppStore } from "../../context/AppContext";
import { T } from "../ui/primitives";

interface Node {
  id: string;
  label: string;
  type: "note" | "project" | "goal";
  x: number;
  y: number;
  radius: number;
  color: string;
  data: any;
}

interface Edge {
  source: string;
  target: string;
}

export const GraphView: React.FC = () => {
  const { notes, projects, goals, setActiveView, setSelectedNoteId, isRTL, t } = useAppStore();

  const [zoom, setZoom] = useState(1);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [filterType, setFilterType] = useState<"all" | "note" | "project" | "goal">("all");

  // Build nodes & edges (same layout math as web)
  const { nodes, edges } = useMemo(() => {
    const rawNodes: Node[] = [];
    const rawEdges: Edge[] = [];

    const centerX = 450;
    const centerY = 300;

    // 1. Projects (Inner circle)
    projects.forEach((p, idx) => {
      const angle = (idx / (projects.length || 1)) * 2 * Math.PI;
      const dist = 140;
      rawNodes.push({
        id: `p-${p.id}`,
        label: p.name,
        type: "project",
        x: centerX + Math.cos(angle) * dist,
        y: centerY + Math.sin(angle) * dist,
        radius: 22,
        color: "#38bdf8", // cyan
        data: p,
      });
    });

    // 2. Goals (Top-left / Top-right clusters)
    goals.forEach((g, idx) => {
      const angle = (idx / (goals.length || 1)) * Math.PI + Math.PI;
      const dist = 240;
      rawNodes.push({
        id: `g-${g.id}`,
        label: g.name,
        type: "goal",
        x: centerX + Math.cos(angle) * dist,
        y: centerY + Math.sin(angle) * dist * 0.7,
        radius: 26,
        color: "#a855f7", // purple
        data: g,
      });

      // Link goal to project if related
      if (projects[idx % projects.length]) {
        rawEdges.push({
          source: `g-${g.id}`,
          target: `p-${projects[idx % projects.length].id}`,
        });
      }
    });

    // 3. Notes (Outer cloud)
    notes.forEach((n, idx) => {
      const angle = (idx / (notes.length || 1)) * 2 * Math.PI + 0.5;
      const dist = 230 + (idx % 3) * 35;
      rawNodes.push({
        id: `n-${n.id}`,
        label: n.title,
        type: "note",
        x: centerX + Math.cos(angle) * dist,
        y: centerY + Math.sin(angle) * dist * 0.9,
        radius: 18,
        color: "#3b82f6", // blue
        data: n,
      });

      // Link notes to projects
      if (projects.length > 0) {
        const targetProj = projects[idx % projects.length];
        rawEdges.push({
          source: `n-${n.id}`,
          target: `p-${targetProj.id}`,
        });
      }
    });

    return { nodes: rawNodes, edges: rawEdges };
  }, [notes, projects, goals]);

  const visibleNodes = nodes.filter((n) => {
    if (filterType !== "all" && n.type !== filterType) return false;
    return true;
  });

  const nodeMap = new Map<string, Node>(nodes.map((n) => [n.id, n]));

  const handleOpenItem = (node: Node) => {
    if (node.type === "note") {
      setSelectedNoteId(node.data.id);
      setActiveView("notes");
    } else if (node.type === "project") {
      setActiveView("projects");
    } else if (node.type === "goal") {
      setActiveView("goals");
    }
  };

  const filterTabs: { id: "all" | "note" | "project" | "goal"; label: string }[] = [
    { id: "all", label: t.views.graph.filterAll },
    { id: "note", label: t.views.graph.filterNotes },
    { id: "project", label: t.views.graph.filterProjects },
    { id: "goal", label: t.views.graph.goalsLegend },
  ];

  return (
    <View className="gap-4 pb-12">
      {/* Controls Bar */}
      <View className="rounded-3xl border border-neutral-800 bg-neutral-900/60 p-5" style={{ gap: 12 }}>
        <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", gap: 12 }}>
          <View className="h-10 w-10 items-center justify-center rounded-2xl border border-neutral-800 bg-neutral-950">
            <Network size={20} color="#60a5fa" />
          </View>
          <View style={{ flex: 1 }}>
            <T style={{ fontSize: 14, fontWeight: "700", color: "#ffffff" }}>{t.views.graph.title}</T>
            <T style={{ fontSize: 12, color: "#a3a3a3", marginTop: 2 }}>{t.views.graph.subtitle}</T>
          </View>
        </View>

        {/* Filter and Zoom controls */}
        <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flex: 1 }}>
            <View style={{ flexDirection: isRTL ? "row-reverse" : "row", gap: 6 }}>
              {filterTabs.map((tab) => (
                <Pressable
                  key={tab.id}
                  onPress={() => setFilterType(tab.id)}
                  style={({ pressed }) => ({
                    borderRadius: 12,
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    minHeight: 36,
                    justifyContent: "center",
                    borderWidth: 1,
                    borderColor: filterType === tab.id ? "#404040" : "#262626",
                    backgroundColor: filterType === tab.id ? "#262626" : "#171717",
                    opacity: pressed ? 0.8 : 1,
                  })}
                >
                  <T
                    style={{
                      fontSize: 12,
                      fontWeight: filterType === tab.id ? "700" : "400",
                      color: filterType === tab.id ? "#60a5fa" : "#a3a3a3",
                    }}
                  >
                    {tab.label}
                  </T>
                </Pressable>
              ))}
            </View>
          </ScrollView>

          <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", gap: 4 }}>
            <Pressable
              onPress={() => setZoom((z) => Math.min(z + 0.2, 2))}
              className="rounded-xl border border-neutral-800 bg-neutral-900 p-2"
            >
              <ZoomIn size={16} color="#a3a3a3" />
            </Pressable>
            <Pressable
              onPress={() => setZoom((z) => Math.max(z - 0.2, 0.6))}
              className="rounded-xl border border-neutral-800 bg-neutral-900 p-2"
            >
              <ZoomOut size={16} color="#a3a3a3" />
            </Pressable>
            <Pressable
              onPress={() => setZoom(1)}
              className="rounded-xl border border-neutral-800 bg-neutral-900 p-2"
            >
              <RotateCcw size={16} color="#a3a3a3" />
            </Pressable>
          </View>
        </View>
      </View>

      {/* Graph Stage */}
      <View
        style={{
          height: 460,
          borderRadius: 24,
          borderWidth: 1,
          borderColor: "#262626",
          backgroundColor: "#0a0a0a",
          overflow: "hidden",
        }}
      >
        {/* Legend */}
        <View
          style={{
            position: "absolute",
            top: 12,
            [isRTL ? "left" : "right"]: 12,
            zIndex: 10,
            borderRadius: 16,
            backgroundColor: "rgba(23,23,23,0.85)",
            padding: 10,
            gap: 6,
            borderWidth: 1,
            borderColor: "#262626",
          }}
        >
          <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", gap: 8 }}>
            <View style={{ height: 10, width: 10, borderRadius: 5, backgroundColor: "#60a5fa" }} />
            <T style={{ fontSize: 11, color: "#d4d4d4" }}>
              {t.views.graph.filterNotes} ({notes.length})
            </T>
          </View>
          <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", gap: 8 }}>
            <View style={{ height: 10, width: 10, borderRadius: 5, backgroundColor: "#22d3ee" }} />
            <T style={{ fontSize: 11, color: "#d4d4d4" }}>
              {t.views.graph.filterProjects} ({projects.length})
            </T>
          </View>
          <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", gap: 8 }}>
            <View style={{ height: 10, width: 10, borderRadius: 5, backgroundColor: "#c084fc" }} />
            <T style={{ fontSize: 11, color: "#d4d4d4" }}>
              {t.views.graph.goalsLegend} ({goals.length})
            </T>
          </View>
        </View>

        {/* SVG Interactive Canvas */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ flex: 1 }}>
          <Svg
            width={900 * zoom}
            height={600 * zoom}
            viewBox={`0 0 900 600`}
            style={{ flex: 1 }}
          >
            {/* Connecting Lines */}
            {edges.map((edge, idx) => {
              const sourceNode = nodeMap.get(edge.source);
              const targetNode = nodeMap.get(edge.target);
              if (!sourceNode || !targetNode) return null;

              return (
                <Line
                  key={`e-${idx}`}
                  x1={sourceNode.x}
                  y1={sourceNode.y}
                  x2={targetNode.x}
                  y2={targetNode.y}
                  stroke="#525252"
                  strokeWidth={1.5}
                  strokeDasharray="4 3"
                  strokeOpacity={0.3}
                />
              );
            })}

            {/* Nodes */}
            {visibleNodes.map((node) => {
              const isSelected = selectedNode?.id === node.id;
              return (
                <React.Fragment key={node.id}>
                  <Circle
                    cx={node.x}
                    cy={node.y}
                    r={node.radius + (isSelected ? 5 : 0)}
                    fill={node.color}
                    fillOpacity={isSelected ? 1 : 0.85}
                    stroke={isSelected ? "#ffffff" : "#171717"}
                    strokeWidth={isSelected ? 3 : 2}
                    onPress={() => setSelectedNode(node)}
                  />
                  <SvgText
                    x={node.x}
                    y={node.y + node.radius + 15}
                    textAnchor="middle"
                    fill="#d4d4d4"
                    fontSize="11"
                  >
                    {node.label.length > 20 ? node.label.slice(0, 20) + "..." : node.label}
                  </SvgText>
                </React.Fragment>
              );
            })}
          </Svg>
        </ScrollView>

        {/* Selected Node Details Drawer */}
        {selectedNode && (
          <View
            style={{
              position: "absolute",
              bottom: 20,
              [isRTL ? "right" : "left"]: 20,
              zIndex: 20,
              width: 280,
              maxWidth: "85%",
              borderRadius: 24,
              borderWidth: 1,
              borderColor: "#262626",
              backgroundColor: "rgba(23,23,23,0.95)",
              padding: 20,
            }}
          >
            <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "flex-start", justifyContent: "space-between" }}>
              <View style={{ flex: 1 }}>
                <View
                  className="self-start rounded-full border px-2.5 py-0.5"
                  style={{
                    backgroundColor: `${selectedNode.color}22`,
                    borderColor: `${selectedNode.color}55`,
                  }}
                >
                  <T style={{ fontSize: 12, fontWeight: "600", color: selectedNode.color }}>
                    {selectedNode.type}
                  </T>
                </View>
                <T style={{ marginTop: 8, fontSize: 13, fontWeight: "700", color: "#ffffff" }}>
                  {selectedNode.label}
                </T>
              </View>
              <Pressable onPress={() => setSelectedNode(null)} className="rounded-xl p-1.5">
                <X size={16} color="#a3a3a3" />
              </Pressable>
            </View>

            <T numberOfLines={3} style={{ marginTop: 10, fontSize: 12, color: "#d4d4d4", lineHeight: 19 }}>
              {selectedNode.data.description || selectedNode.data.content || t.views.graph.nodeDetails}
            </T>

            <View
              style={{
                marginTop: 16,
                paddingTop: 12,
                borderTopWidth: 1,
                borderTopColor: "#262626",
                flexDirection: isRTL ? "row-reverse" : "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <T numberOfLines={1} style={{ fontSize: 11, color: "#737373", flex: 1 }}>
                {selectedNode.id}
              </T>
              <Pressable
                onPress={() => handleOpenItem(selectedNode)}
                style={({ pressed }) => ({
                  flexDirection: isRTL ? "row-reverse" : "row",
                  alignItems: "center",
                  gap: 6,
                  borderRadius: 12,
                  backgroundColor: pressed ? "#3b82f6" : "#2563eb",
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                })}
              >
                <T style={{ fontSize: 12, fontWeight: "700", color: "#ffffff" }}>
                  {t.views.graph.openItem}
                </T>
                <ExternalLink size={14} color="#ffffff" />
              </Pressable>
            </View>
          </View>
        )}
      </View>
    </View>
  );
};
