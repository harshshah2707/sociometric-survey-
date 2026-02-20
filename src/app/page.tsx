export default function HomePage() {
    return (
        <div className="min-h-[calc(100vh-60px)] flex flex-col items-center justify-center px-4">
            <div className="max-w-2xl text-center animate-fade-in">
                {/* Decorative icon */}
                <div className="mx-auto w-20 h-20 mb-8 rounded-2xl bg-gradient-to-br from-academic-600 to-insight-purple flex items-center justify-center shadow-lg">
                    <svg
                        className="w-10 h-10 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5"
                        />
                    </svg>
                </div>

                <h1 className="text-3xl sm:text-4xl font-serif font-bold text-academic-900 mb-4 leading-tight">
                    Workplace Interaction &amp;
                    <br />
                    Relationship Mapping Survey
                </h1>

                <p className="text-lg text-academic-500 mb-2 max-w-xl mx-auto">
                    A sociometric research tool for understanding workplace dynamics,
                    communication patterns, and interpersonal relationships.
                </p>

                <p className="text-sm text-academic-400 mb-10">
                    Your responses are confidential and used for organizational research
                    purposes only.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <a
                        href="/survey"
                        className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-academic-700 text-white rounded-xl font-medium text-sm hover:bg-academic-800 transition-all shadow-sm hover:shadow-md active:scale-[0.98]"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                        </svg>
                        Begin Survey
                    </a>
                    <a
                        href="/visualize"
                        className="inline-flex items-center justify-center gap-2 px-8 py-3.5 border-2 border-academic-200 text-academic-600 rounded-xl font-medium text-sm hover:border-academic-400 hover:text-academic-700 transition-all active:scale-[0.98]"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                        </svg>
                        View Sociogram
                    </a>
                </div>

                <div className="mt-16 grid grid-cols-3 gap-6 text-center">
                    <div className="p-4">
                        <div className="text-2xl font-bold text-academic-700 font-mono">8</div>
                        <div className="text-xs text-academic-400 mt-1">Survey Sections</div>
                    </div>
                    <div className="p-4">
                        <div className="text-2xl font-bold text-insight-purple font-mono">5</div>
                        <div className="text-xs text-academic-400 mt-1">Network Types</div>
                    </div>
                    <div className="p-4">
                        <div className="text-2xl font-bold text-insight-green font-mono">6</div>
                        <div className="text-xs text-academic-400 mt-1">Rating Scales</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
