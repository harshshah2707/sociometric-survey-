"use client";

/**
 * /visualize page — Fetches survey data from Google Sheets, builds network, renders sociogram.
 */
import { useEffect, useState } from "react";
import { buildNetworkFromSheetData, NetworkData } from "@/lib/networkBuilder";
import SociogramGraph from "@/components/graph/SociogramGraph";
import AnalyticsPanel from "@/components/graph/AnalyticsPanel";

export default function VisualizePage() {
    const [networkData, setNetworkData] = useState<NetworkData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await fetch("/api/responses");
                const json = await res.json();

                if (json.success && json.data) {
                    const network = buildNetworkFromSheetData(json.data);
                    setNetworkData(network);
                } else {
                    setError(json.message || "Failed to load data.");
                }
            } catch {
                setError("Network error. Could not fetch survey data.");
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, []);

    return (
        <div className="py-6 px-4 sm:px-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl font-serif font-bold text-academic-800 mb-1">
                        Sociogram Visualization
                    </h1>
                    <p className="text-sm text-academic-400">
                        Interactive network graph of workplace interactions and relationships.
                        Drag nodes to rearrange. Use controls to filter and highlight.
                    </p>
                </div>

                {/* Loading */}
                {loading && (
                    <div className="flex items-center justify-center h-[400px]">
                        <div className="text-center">
                            <div className="w-10 h-10 border-4 border-academic-200 border-t-academic-600 rounded-full animate-spin mx-auto mb-3" />
                            <p className="text-sm text-academic-500">
                                Loading survey responses...
                            </p>
                        </div>
                    </div>
                )}

                {/* Error */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                        <p className="text-sm text-red-700 mb-2">{error}</p>
                        <p className="text-xs text-red-500">
                            Make sure your Google Sheets API credentials are configured in the
                            .env file.
                        </p>
                    </div>
                )}

                {/* Content */}
                {!loading && !error && networkData && (
                    <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
                        {/* Graph */}
                        <div>
                            <SociogramGraph networkData={networkData} />
                        </div>

                        {/* Analytics Side Panel */}
                        <div className="order-first lg:order-last">
                            <AnalyticsPanel analytics={networkData.analytics} />
                        </div>
                    </div>
                )}

                {/* No data state */}
                {!loading && !error && networkData && networkData.nodes.length === 0 && (
                    <div className="bg-parchment-50 border border-parchment-300 rounded-xl p-8 text-center mt-6">
                        <svg
                            className="w-12 h-12 text-academic-300 mx-auto mb-3"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125"
                            />
                        </svg>
                        <p className="text-sm text-academic-500 mb-1">
                            No survey responses found.
                        </p>
                        <p className="text-xs text-academic-400">
                            <a
                                href="/survey"
                                className="text-insight-blue hover:underline"
                            >
                                Submit a survey
                            </a>{" "}
                            to generate the sociogram.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
