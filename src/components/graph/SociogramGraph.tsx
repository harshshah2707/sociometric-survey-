"use client";

/**
 * SociogramGraph — React Flow visualization of the sociometric network.
 * Uses d3-force for layout and supports filtering, highlighting, and labels.
 */
import { useCallback, useEffect, useMemo, useState } from "react";
import ReactFlow, {
    Node,
    Edge,
    Background,
    Controls,
    MiniMap,
    useNodesState,
    useEdgesState,
    MarkerType,
} from "reactflow";
import "reactflow/dist/style.css";
import {
    forceSimulation,
    forceLink,
    forceManyBody,
    forceCenter,
    forceCollide,
    SimulationNodeDatum,
    SimulationLinkDatum,
} from "d3-force";
import {
    NetworkData,
    EdgeType,
    EDGE_COLORS,
    EDGE_LABELS,
} from "@/lib/networkBuilder";

interface SociogramGraphProps {
    networkData: NetworkData;
}

interface D3Node extends SimulationNodeDatum {
    id: string;
}

interface D3Link extends SimulationLinkDatum<D3Node> {
    id: string;
}

type FilterMode = "all" | "positive" | "negative";

const POSITIVE_TYPES: EdgeType[] = ["communication", "advice", "trust"];
const NEGATIVE_TYPES: EdgeType[] = ["avoidance", "conflict"];

export default function SociogramGraph({ networkData }: SociogramGraphProps) {
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const [filterType, setFilterType] = useState<EdgeType | "all">("all");
    const [filterMode, setFilterMode] = useState<FilterMode>("all");
    const [showLabels, setShowLabels] = useState(true);
    const [highlightCentral, setHighlightCentral] = useState(false);
    const [layoutDone, setLayoutDone] = useState(false);

    // Find the most central node
    const centralNodeId = useMemo(() => {
        if (networkData.nodes.length === 0) return "";
        return networkData.nodes.reduce((best, node) =>
            node.totalDegree > best.totalDegree ? node : best
        ).id;
    }, [networkData.nodes]);

    // Apply d3-force layout
    const applyLayout = useCallback(() => {
        if (networkData.nodes.length === 0) return;

        const simNodes: D3Node[] = networkData.nodes.map((n) => ({
            id: n.id,
            x: Math.random() * 800,
            y: Math.random() * 600,
        }));

        const simLinks: D3Link[] = networkData.edges.map((e) => ({
            id: e.id,
            source: e.source,
            target: e.target,
        }));

        const simulation = forceSimulation<D3Node>(simNodes)
            .force(
                "link",
                forceLink<D3Node, D3Link>(simLinks)
                    .id((d) => d.id)
                    .distance(150)
            )
            .force("charge", forceManyBody().strength(-400))
            .force("center", forceCenter(400, 300))
            .force("collide", forceCollide(50))
            .stop();

        // Run simulation synchronously
        for (let i = 0; i < 300; i++) simulation.tick();

        // Convert to React Flow nodes
        const maxDegree = Math.max(
            ...networkData.nodes.map((n) => n.totalDegree),
            1
        );

        const rfNodes: Node[] = simNodes.map((sn) => {
            const networkNode = networkData.nodes.find((n) => n.id === sn.id)!;
            const size = 40 + (networkNode.totalDegree / maxDegree) * 40;
            const isCentral = sn.id === centralNodeId;

            return {
                id: sn.id,
                position: { x: sn.x || 0, y: sn.y || 0 },
                data: {
                    label: showLabels ? networkNode.label : "",
                },
                style: {
                    width: size,
                    height: size,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "11px",
                    fontWeight: 600,
                    fontFamily: "Inter, sans-serif",
                    background:
                        highlightCentral && isCentral
                            ? "linear-gradient(135deg, #e67e22, #c0392b)"
                            : `linear-gradient(135deg, #486581, #334e68)`,
                    color: "white",
                    border:
                        highlightCentral && isCentral
                            ? "3px solid #e67e22"
                            : "2px solid #243b53",
                    boxShadow:
                        highlightCentral && isCentral
                            ? "0 0 16px rgba(230, 126, 34, 0.5)"
                            : "0 2px 8px rgba(0,0,0,0.15)",
                    cursor: "grab",
                    textAlign: "center" as const,
                    padding: "4px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap" as const,
                    lineHeight: "1.2",
                },
                type: "default",
            };
        });

        setNodes(rfNodes);
        setLayoutDone(true);
    }, [networkData, showLabels, highlightCentral, centralNodeId, setNodes]);

    // Apply edge filtering
    useEffect(() => {
        let filteredEdges = networkData.edges;

        // Filter by edge type
        if (filterType !== "all") {
            filteredEdges = filteredEdges.filter((e) => e.type === filterType);
        }

        // Filter by positive/negative mode
        if (filterMode === "positive") {
            filteredEdges = filteredEdges.filter((e) =>
                POSITIVE_TYPES.includes(e.type)
            );
        } else if (filterMode === "negative") {
            filteredEdges = filteredEdges.filter((e) =>
                NEGATIVE_TYPES.includes(e.type)
            );
        }

        const rfEdges: Edge[] = filteredEdges.map((e) => ({
            id: e.id,
            source: e.source,
            target: e.target,
            animated: e.type === "avoidance" || e.type === "conflict",
            style: {
                stroke: EDGE_COLORS[e.type],
                strokeWidth: Math.max(1, Math.min(e.weight, 5)),
                opacity: 0.7,
            },
            markerEnd: {
                type: MarkerType.ArrowClosed,
                color: EDGE_COLORS[e.type],
                width: 16,
                height: 16,
            },
            label: showLabels ? EDGE_LABELS[e.type] : undefined,
            labelStyle: { fontSize: 9, fill: "#627d98" },
        }));

        setEdges(rfEdges);
    }, [networkData.edges, filterType, filterMode, showLabels, setEdges]);

    // Run layout on mount and when data changes
    useEffect(() => {
        applyLayout();
    }, [applyLayout]);

    if (networkData.nodes.length === 0) {
        return (
            <div className="flex items-center justify-center h-[500px] bg-parchment-50 rounded-xl border border-parchment-300">
                <div className="text-center">
                    <p className="text-academic-500 text-sm">
                        No network data available yet.
                    </p>
                    <p className="text-academic-400 text-xs mt-1">
                        Submit survey responses to populate the sociogram.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Controls */}
            <div className="flex flex-wrap gap-3 items-center p-4 bg-white border border-parchment-300 rounded-xl">
                {/* Edge type filter */}
                <div className="flex items-center gap-2">
                    <label className="text-xs font-medium text-academic-600">
                        Relationship:
                    </label>
                    <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value as EdgeType | "all")}
                        className="text-xs px-2 py-1.5 border border-parchment-300 rounded-md bg-white"
                    >
                        <option value="all">All Types</option>
                        <option value="communication">Communication</option>
                        <option value="advice">Advice</option>
                        <option value="trust">Trust</option>
                        <option value="avoidance">Avoidance</option>
                        <option value="conflict">Conflict</option>
                    </select>
                </div>

                {/* Positive/Negative */}
                <div className="flex items-center gap-2">
                    <label className="text-xs font-medium text-academic-600">
                        Show:
                    </label>
                    <select
                        value={filterMode}
                        onChange={(e) => setFilterMode(e.target.value as FilterMode)}
                        className="text-xs px-2 py-1.5 border border-parchment-300 rounded-md bg-white"
                    >
                        <option value="all">All</option>
                        <option value="positive">Positive Only</option>
                        <option value="negative">Negative Only</option>
                    </select>
                </div>

                {/* Toggle Labels */}
                <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={showLabels}
                        onChange={(e) => setShowLabels(e.target.checked)}
                        className="rounded w-3.5 h-3.5"
                    />
                    <span className="text-xs text-academic-600">Labels</span>
                </label>

                {/* Highlight Central */}
                <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={highlightCentral}
                        onChange={(e) => setHighlightCentral(e.target.checked)}
                        className="rounded w-3.5 h-3.5"
                    />
                    <span className="text-xs text-academic-600">Highlight Central</span>
                </label>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-4 px-4">
                {(Object.entries(EDGE_COLORS) as [EdgeType, string][]).map(
                    ([type, color]) => (
                        <div key={type} className="flex items-center gap-1.5">
                            <div
                                className="w-4 h-1 rounded-full"
                                style={{ backgroundColor: color }}
                            />
                            <span className="text-xs text-academic-500 capitalize">
                                {type}
                            </span>
                        </div>
                    )
                )}
            </div>

            {/* Graph */}
            <div
                className="border border-parchment-300 rounded-xl overflow-hidden bg-parchment-50"
                style={{ height: "600px" }}
            >
                {layoutDone && (
                    <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        fitView
                        fitViewOptions={{ padding: 0.2 }}
                        minZoom={0.3}
                        maxZoom={2}
                        attributionPosition="bottom-left"
                    >
                        <Background color="#d9e2ec" gap={24} size={1} />
                        <Controls
                            showInteractive={false}
                            position="top-right"
                            style={{ borderRadius: "8px", border: "1px solid #e2ddd3" }}
                        />
                        <MiniMap
                            nodeColor={() => "#486581"}
                            maskColor="rgba(0,0,0,0.08)"
                            style={{
                                borderRadius: "8px",
                                border: "1px solid #e2ddd3",
                            }}
                        />
                    </ReactFlow>
                )}
            </div>
        </div>
    );
}
