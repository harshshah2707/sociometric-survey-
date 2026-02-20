"use client";

/**
 * AnalyticsPanel — Side panel showing network analytics metrics.
 */
import type { NetworkAnalytics } from "@/lib/networkBuilder";

interface AnalyticsPanelProps {
    analytics: NetworkAnalytics;
}

export default function AnalyticsPanel({ analytics }: AnalyticsPanelProps) {
    // Sort centrality to find top actors
    const sortedInDegree = Object.entries(analytics.inDegreeCentrality)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5);

    const sortedOutDegree = Object.entries(analytics.outDegreeCentrality)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5);

    return (
        <div className="bg-white border border-parchment-300 rounded-xl p-5 space-y-6">
            <h3 className="text-lg font-serif font-bold text-academic-800">
                Network Analytics
            </h3>

            {/* Overview Metrics */}
            <div className="grid grid-cols-2 gap-3">
                <MetricCard label="Nodes" value={analytics.nodeCount} />
                <MetricCard label="Edges" value={analytics.edgeCount} />
                <MetricCard label="Density" value={analytics.density.toFixed(3)} />
                <MetricCard
                    label="Reciprocity"
                    value={analytics.reciprocity.toFixed(3)}
                />
            </div>

            {/* In-Degree Centrality */}
            <div>
                <h4 className="text-sm font-semibold text-academic-700 mb-2">
                    In-Degree Centrality
                    <span className="font-normal text-xs text-academic-400 ml-1">
                        (most sought-after)
                    </span>
                </h4>
                {sortedInDegree.length > 0 ? (
                    <ul className="space-y-1.5">
                        {sortedInDegree.map(([name, val]) => (
                            <li key={name} className="flex items-center justify-between">
                                <span className="text-sm text-academic-600 capitalize">
                                    {name}
                                </span>
                                <div className="flex items-center gap-2">
                                    <div className="w-24 h-1.5 bg-parchment-200 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-insight-blue rounded-full"
                                            style={{ width: `${Math.min(val * 100, 100)}%` }}
                                        />
                                    </div>
                                    <span className="text-xs font-mono text-academic-500 w-10 text-right">
                                        {val.toFixed(2)}
                                    </span>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-xs text-academic-400">No data</p>
                )}
            </div>

            {/* Out-Degree Centrality */}
            <div>
                <h4 className="text-sm font-semibold text-academic-700 mb-2">
                    Out-Degree Centrality
                    <span className="font-normal text-xs text-academic-400 ml-1">
                        (most connected)
                    </span>
                </h4>
                {sortedOutDegree.length > 0 ? (
                    <ul className="space-y-1.5">
                        {sortedOutDegree.map(([name, val]) => (
                            <li key={name} className="flex items-center justify-between">
                                <span className="text-sm text-academic-600 capitalize">
                                    {name}
                                </span>
                                <div className="flex items-center gap-2">
                                    <div className="w-24 h-1.5 bg-parchment-200 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-insight-purple rounded-full"
                                            style={{ width: `${Math.min(val * 100, 100)}%` }}
                                        />
                                    </div>
                                    <span className="text-xs font-mono text-academic-500 w-10 text-right">
                                        {val.toFixed(2)}
                                    </span>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-xs text-academic-400">No data</p>
                )}
            </div>

            {/* Cliques */}
            <div>
                <h4 className="text-sm font-semibold text-academic-700 mb-2">
                    Detected Cliques
                    <span className="font-normal text-xs text-academic-400 ml-1">
                        (triangles)
                    </span>
                </h4>
                {analytics.cliques.length > 0 ? (
                    <ul className="space-y-1">
                        {analytics.cliques.slice(0, 10).map((clique, i) => (
                            <li
                                key={i}
                                className="text-xs text-academic-600 bg-parchment-50 border border-parchment-200 rounded-md px-3 py-1.5"
                            >
                                {clique.join(" — ")}
                            </li>
                        ))}
                        {analytics.cliques.length > 10 && (
                            <li className="text-xs text-academic-400">
                                +{analytics.cliques.length - 10} more
                            </li>
                        )}
                    </ul>
                ) : (
                    <p className="text-xs text-academic-400">
                        No triangular cliques detected
                    </p>
                )}
            </div>
        </div>
    );
}

function MetricCard({
    label,
    value,
}: {
    label: string;
    value: string | number;
}) {
    return (
        <div className="bg-parchment-50 border border-parchment-200 rounded-lg p-3 text-center">
            <div className="text-xl font-bold font-mono text-academic-700">
                {value}
            </div>
            <div className="text-xs text-academic-400 mt-0.5">{label}</div>
        </div>
    );
}
