"use client";

/**
 * ProgressBar — Shows survey completion progress across sections.
 */
import { SECTION_LABELS } from "@/types/survey";

interface ProgressBarProps {
    currentSection: number;
    totalSections: number;
}

export default function ProgressBar({
    currentSection,
    totalSections,
}: ProgressBarProps) {
    const progress = ((currentSection + 1) / totalSections) * 100;

    return (
        <div className="mb-8">
            {/* Progress bar */}
            <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-academic-500">
                    Section {currentSection + 1} of {totalSections}
                </span>
                <span className="text-xs font-mono text-academic-400">
                    {Math.round(progress)}%
                </span>
            </div>
            <div className="h-2 bg-parchment-200 rounded-full overflow-hidden">
                <div
                    className="progress-fill h-full bg-gradient-to-r from-academic-500 to-insight-blue rounded-full"
                    style={{ width: `${progress}%` }}
                />
            </div>

            {/* Section title */}
            <h2 className="mt-4 text-xl font-serif font-bold text-academic-800">
                {SECTION_LABELS[currentSection]}
            </h2>

            {/* Section dots */}
            <div className="flex gap-1.5 mt-3">
                {Array.from({ length: totalSections }).map((_, i) => (
                    <div
                        key={i}
                        className={`w-2 h-2 rounded-full transition-all ${i < currentSection
                                ? "bg-insight-green"
                                : i === currentSection
                                    ? "bg-academic-600 scale-125"
                                    : "bg-parchment-300"
                            }`}
                    />
                ))}
            </div>
        </div>
    );
}
