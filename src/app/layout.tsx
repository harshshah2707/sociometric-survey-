import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "Workplace Interaction & Relationship Mapping Survey",
    description:
        "A sociometric survey tool for mapping workplace interaction patterns, communication networks, trust relationships, and organizational dynamics.",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className="min-h-screen bg-parchment-50">
                <header className="border-b border-parchment-300/50 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
                        <a href="/" className="flex items-center gap-3 group">
                            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-academic-600 to-academic-800 flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                                <svg
                                    className="w-5 h-5 text-white"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={2}
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5"
                                    />
                                </svg>
                            </div>
                            <div>
                                <h1 className="text-sm font-semibold text-academic-800 tracking-tight leading-tight font-serif">
                                    Workplace Interaction &amp; Relationship
                                </h1>
                                <p className="text-xs text-academic-400 leading-tight">
                                    Mapping Survey
                                </p>
                            </div>
                        </a>
                        <nav className="flex items-center gap-4">
                            <a
                                href="/survey"
                                className="text-sm font-medium text-academic-500 hover:text-academic-700 transition-colors"
                            >
                                Survey
                            </a>
                            <a
                                href="/visualize"
                                className="text-sm font-medium text-academic-500 hover:text-academic-700 transition-colors"
                            >
                                Visualize
                            </a>
                        </nav>
                    </div>
                </header>
                <main>{children}</main>
            </body>
        </html>
    );
}
