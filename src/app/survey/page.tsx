"use client";

/**
 * /survey page — Survey form with confirmation state.
 */
import { useState } from "react";
import SurveyForm from "@/components/form/SurveyForm";

export default function SurveyPage() {
    const [submitted, setSubmitted] = useState(false);

    if (submitted) {
        return (
            <div className="min-h-[calc(100vh-60px)] flex items-center justify-center px-4">
                <div className="max-w-md text-center animate-fade-in">
                    <div className="mx-auto w-16 h-16 mb-6 rounded-full bg-insight-green/10 flex items-center justify-center">
                        <svg
                            className="w-8 h-8 text-insight-green"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-serif font-bold text-academic-800 mb-3">
                        Survey Submitted!
                    </h1>
                    <p className="text-sm text-academic-500 mb-8">
                        Thank you for completing the Workplace Interaction &amp; Relationship
                        Mapping Survey. Your response has been recorded and will be used
                        for organizational research.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <a
                            href="/visualize"
                            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-academic-700 text-white rounded-lg text-sm font-medium hover:bg-academic-800 transition-colors"
                        >
                            View Sociogram
                        </a>
                        <button
                            onClick={() => setSubmitted(false)}
                            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 border border-academic-200 text-academic-600 rounded-lg text-sm font-medium hover:border-academic-400 transition-colors"
                        >
                            Submit Another Response
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="py-8 px-4 sm:px-6">
            <div className="max-w-3xl mx-auto mb-6">
                <h1 className="text-2xl font-serif font-bold text-academic-800 mb-1">
                    Workplace Interaction Survey
                </h1>
                <p className="text-sm text-academic-400">
                    Complete all sections below. Your progress is auto-saved locally.
                </p>
            </div>
            <SurveyForm onSubmitSuccess={() => setSubmitted(true)} />
        </div>
    );
}
