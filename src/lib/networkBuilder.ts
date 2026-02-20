/**
 * Network Builder — Constructs sociometric graph data from survey responses.
 * Used by the /visualize route to build React Flow compatible nodes & edges.
 */

export interface NetworkNode {
    id: string;
    label: string;
    inDegree: number;
    outDegree: number;
    totalDegree: number;
}

export interface NetworkEdge {
    id: string;
    source: string;
    target: string;
    type: EdgeType;
    weight: number;
}

export type EdgeType =
    | "communication"
    | "advice"
    | "trust"
    | "avoidance"
    | "conflict";

export interface NetworkAnalytics {
    nodeCount: number;
    edgeCount: number;
    density: number;
    reciprocity: number;
    inDegreeCentrality: Record<string, number>;
    outDegreeCentrality: Record<string, number>;
    cliques: string[][];
}

export interface NetworkData {
    nodes: NetworkNode[];
    edges: NetworkEdge[];
    analytics: NetworkAnalytics;
}

/**
 * Parse flat sheet rows back into relationship data.
 * The header row tells us which column is which.
 */
export function buildNetworkFromSheetData(rows: string[][]): NetworkData {
    if (rows.length < 2) {
        return {
            nodes: [],
            edges: [],
            analytics: {
                nodeCount: 0,
                edgeCount: 0,
                density: 0,
                reciprocity: 0,
                inDegreeCentrality: {},
                outDegreeCentrality: {},
                cliques: [],
            },
        };
    }

    const headers = rows[0];
    const dataRows = rows.slice(1);

    const nodesMap = new Map<string, NetworkNode>();
    const edges: NetworkEdge[] = [];

    // Helper: ensure a node exists
    function ensureNode(name: string) {
        const id = name.trim().toLowerCase();
        if (!id) return;
        if (!nodesMap.has(id)) {
            nodesMap.set(id, {
                id,
                label: name.trim(),
                inDegree: 0,
                outDegree: 0,
                totalDegree: 0,
            });
        }
    }

    // Helper: add an edge
    function addEdge(source: string, target: string, type: EdgeType, weight: number) {
        const srcId = source.trim().toLowerCase();
        const tgtId = target.trim().toLowerCase();
        if (!srcId || !tgtId || srcId === tgtId) return;

        ensureNode(source);
        ensureNode(target);

        const edgeId = `${srcId}-${tgtId}-${type}`;
        // Check for duplicate
        if (edges.find((e) => e.id === edgeId)) return;

        edges.push({ id: edgeId, source: srcId, target: tgtId, type, weight });

        const srcNode = nodesMap.get(srcId)!;
        const tgtNode = nodesMap.get(tgtId)!;
        srcNode.outDegree++;
        srcNode.totalDegree++;
        tgtNode.inDegree++;
        tgtNode.totalDegree++;
    }

    // Column index finder
    function colIndex(partialHeader: string): number {
        return headers.findIndex(
            (h) => h && h.toLowerCase().includes(partialHeader.toLowerCase())
        );
    }

    // Parse each response row
    for (const row of dataRows) {
        const respondentCol = colIndex("name");
        const respondent = respondentCol >= 0 ? row[respondentCol] : "";
        if (!respondent) continue;
        ensureNode(respondent);

        // Communication edges
        const commCol = colIndex("communicated");
        if (commCol >= 0 && row[commCol]) {
            row[commCol].split(",").forEach((name) => {
                addEdge(respondent, name.trim(), "communication", 1);
            });
        }

        // Advice edges
        const advCol = colIndex("seek_advice_from");
        if (advCol >= 0 && row[advCol]) {
            row[advCol].split(",").forEach((name) => {
                addEdge(respondent, name.trim(), "advice", 1);
            });
        }

        const advFromYouCol = colIndex("who_seek_advice_from_you");
        if (advFromYouCol >= 0 && row[advFromYouCol]) {
            row[advFromYouCol].split(",").forEach((name) => {
                addEdge(name.trim(), respondent, "advice", 1);
            });
        }

        // Trust edges
        const trustCol = colIndex("trust_with_sensitive");
        if (trustCol >= 0 && row[trustCol]) {
            row[trustCol].split(",").forEach((name) => {
                addEdge(respondent, name.trim(), "trust", 1);
            });
        }

        // Avoidance edges
        const avoidCol = colIndex("avoid_interacting");
        if (avoidCol >= 0 && row[avoidCol]) {
            row[avoidCol].split(",").forEach((name) => {
                addEdge(respondent, name.trim(), "avoidance", 1);
            });
        }

        // Conflict edges
        const conflictCol = colIndex("frequent_disagreement");
        if (conflictCol >= 0 && row[conflictCol]) {
            row[conflictCol].split(",").forEach((name) => {
                addEdge(respondent, name.trim(), "conflict", 1);
            });
        }

        // Weight enhancement from relationship strength columns
        const freqCol = colIndex("freq_");
        const impCol = colIndex("importance_");
        const trustLvlCol = colIndex("trust_level_");
        if (freqCol >= 0 || impCol >= 0 || trustLvlCol >= 0) {
            // Find all relationship strength columns
            headers.forEach((h, idx) => {
                if (!h) return;
                const lh = h.toLowerCase();
                let personName = "";
                let weightBonus = 0;

                if (lh.startsWith("freq_")) {
                    personName = h.substring(5);
                    const val = parseFloat(row[idx] || "0");
                    weightBonus = val;
                } else if (lh.startsWith("importance_")) {
                    personName = h.substring(11);
                    const val = parseFloat(row[idx] || "0");
                    weightBonus = val;
                } else if (lh.startsWith("trust_level_")) {
                    personName = h.substring(12);
                    const val = parseFloat(row[idx] || "0");
                    weightBonus = val;
                }

                if (personName && weightBonus > 0) {
                    // Find existing edges from respondent to this person and increase weight
                    const srcId = respondent.trim().toLowerCase();
                    const tgtId = personName.trim().toLowerCase();
                    edges.forEach((e) => {
                        if (e.source === srcId && e.target === tgtId) {
                            e.weight += weightBonus * 0.2;
                        }
                    });
                }
            });
        }
    }

    const nodes = Array.from(nodesMap.values());
    const analytics = computeAnalytics(nodes, edges);

    return { nodes, edges, analytics };
}

/** Compute network analytics */
function computeAnalytics(
    nodes: NetworkNode[],
    edges: NetworkEdge[]
): NetworkAnalytics {
    const n = nodes.length;
    const maxPossibleEdges = n * (n - 1);

    // Density
    const density = maxPossibleEdges > 0 ? edges.length / maxPossibleEdges : 0;

    // Reciprocity: fraction of edges that are reciprocated
    let reciprocatedCount = 0;
    for (const edge of edges) {
        const reciprocal = edges.find(
            (e) => e.source === edge.target && e.target === edge.source && e.type === edge.type
        );
        if (reciprocal) reciprocatedCount++;
    }
    const reciprocity = edges.length > 0 ? reciprocatedCount / edges.length : 0;

    // Centrality
    const inDegreeCentrality: Record<string, number> = {};
    const outDegreeCentrality: Record<string, number> = {};
    const maxDeg = n - 1 || 1;

    for (const node of nodes) {
        inDegreeCentrality[node.id] = node.inDegree / maxDeg;
        outDegreeCentrality[node.id] = node.outDegree / maxDeg;
    }

    // Simple triangle (clique) detection
    const cliques: string[][] = [];
    const adjacency = new Map<string, Set<string>>();
    for (const edge of edges) {
        if (edge.type === "avoidance" || edge.type === "conflict") continue;
        if (!adjacency.has(edge.source)) adjacency.set(edge.source, new Set());
        if (!adjacency.has(edge.target)) adjacency.set(edge.target, new Set());
        adjacency.get(edge.source)!.add(edge.target);
        adjacency.get(edge.target)!.add(edge.source);
    }

    const nodeIds = nodes.map((n) => n.id);
    for (let i = 0; i < nodeIds.length; i++) {
        for (let j = i + 1; j < nodeIds.length; j++) {
            for (let k = j + 1; k < nodeIds.length; k++) {
                const a = nodeIds[i], b = nodeIds[j], c = nodeIds[k];
                const aNeighbors = adjacency.get(a) || new Set();
                const bNeighbors = adjacency.get(b) || new Set();
                const cNeighbors = adjacency.get(c) || new Set();

                if (
                    aNeighbors.has(b) &&
                    aNeighbors.has(c) &&
                    bNeighbors.has(a) &&
                    bNeighbors.has(c) &&
                    cNeighbors.has(a) &&
                    cNeighbors.has(b)
                ) {
                    cliques.push([
                        nodes.find((n) => n.id === a)?.label || a,
                        nodes.find((n) => n.id === b)?.label || b,
                        nodes.find((n) => n.id === c)?.label || c,
                    ]);
                }
            }
        }
    }

    return {
        nodeCount: n,
        edgeCount: edges.length,
        density: Math.round(density * 1000) / 1000,
        reciprocity: Math.round(reciprocity * 1000) / 1000,
        inDegreeCentrality,
        outDegreeCentrality,
        cliques,
    };
}

/** Edge type → color map */
export const EDGE_COLORS: Record<EdgeType, string> = {
    communication: "#4a90d9",
    advice: "#27ae60",
    trust: "#8e44ad",
    avoidance: "#c0392b",
    conflict: "#e67e22",
};

/** Edge type → label map */
export const EDGE_LABELS: Record<EdgeType, string> = {
    communication: "Communication",
    advice: "Advice",
    trust: "Trust",
    avoidance: "Avoidance",
    conflict: "Conflict",
};
