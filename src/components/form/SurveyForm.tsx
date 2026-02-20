"use client";

/**
 * SurveyForm — Main survey orchestrator.
 * Manages all 8 sections with navigation, autosave, and submission.
 */
import { useState, useEffect, useCallback, useMemo } from "react";
import { SurveyData, createEmptySurvey, SECTION_LABELS, PREDEFINED_NAMES } from "@/types/survey";
import ProgressBar from "./ProgressBar";
import Section1 from "./Section1";
import Section2 from "./Section2";
import Section3 from "./Section3";
import Section4 from "./Section4";
import Section5 from "./Section5";
import Section6 from "./Section6";
import Section7 from "./Section7";
import Section8 from "./Section8";

const STORAGE_KEY = "sociometric_survey_draft";
const TOTAL_SECTIONS = SECTION_LABELS.length;

interface SurveyFormProps {
    onSubmitSuccess: () => void;
}

export default function SurveyForm({ onSubmitSuccess }: SurveyFormProps) {
    const [data, setData] = useState<SurveyData>(createEmptySurvey);
    const [currentSection, setCurrentSection] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState("");
    const [autosaveStatus, setAutosaveStatus] = useState<"saved" | "saving" | "">(
        ""
    );

    // Load draft from localStorage on mount
    useEffect(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                const parsed = JSON.parse(saved);
                setData(parsed);
            }
        } catch {
            // Ignore parse errors
        }
    }, []);

    // Autosave to localStorage on data change (debounced)
    useEffect(() => {
        setAutosaveStatus("saving");
        const timer = setTimeout(() => {
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
                setAutosaveStatus("saved");
            } catch {
                // Storage full, ignore
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [data]);

    // Warn before leaving with unsaved data
    useEffect(() => {
        function handleBeforeUnload(e: BeforeUnloadEvent) {
            if (data.participantInfo.name || data.participantInfo.employeeId) {
                e.preventDefault();
            }
        }
        window.addEventListener("beforeunload", handleBeforeUnload);
        return () => window.removeEventListener("beforeunload", handleBeforeUnload);
    }, [data]);

    // Collect all available names (everyone except the current user) for the grids
    const allAvailableNames = useMemo(() => {
        const currentUser = data.participantInfo.name;
        return PREDEFINED_NAMES.filter(name => name !== currentUser).sort();
    }, [data.participantInfo.name]);

    const goNext = useCallback(() => {
        if (currentSection < TOTAL_SECTIONS - 1) {
            setCurrentSection((s) => s + 1);
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    }, [currentSection]);

    const goPrev = useCallback(() => {
        if (currentSection > 0) {
            setCurrentSection((s) => s - 1);
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    }, [currentSection]);

    async function handleSubmit() {
        // Basic validation
        if (!data.participantInfo.name.trim() || !data.participantInfo.employeeId.trim()) {
            setSubmitError("Please fill in your Name and Employee ID (Section 1).");
            return;
        }

        setIsSubmitting(true);
        setSubmitError("");

        try {
            const response = await fetch("/api/submit", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (result.success) {
                localStorage.removeItem(STORAGE_KEY);
                onSubmitSuccess();
            } else {
                setSubmitError(result.message || "Submission failed. Please try again.");
            }
        } catch {
            setSubmitError("Network error. Please check your connection and try again.");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="max-w-3xl mx-auto">
            <ProgressBar
                currentSection={currentSection}
                totalSections={TOTAL_SECTIONS}
            />

            {/* Autosave indicator */}
            <div className="flex justify-end mb-4">
                {autosaveStatus === "saved" && (
                    <span className="text-xs text-insight-green flex items-center gap-1">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                            />
                        </svg>
                        Draft saved
                    </span>
                )}
                {autosaveStatus === "saving" && (
                    <span className="text-xs text-academic-400 animate-pulse-soft">
                        Saving...
                    </span>
                )}
            </div>

            {/* Section content */}
            <div className="bg-white border border-parchment-300 rounded-xl p-6 sm:p-8 shadow-sm card-grain">
                {currentSection === 0 && (
                    <Section1
                        data={data.participantInfo}
                        onChange={(d) => setData({ ...data, participantInfo: d })}
                    />
                )}
                {currentSection === 1 && (
                    <Section2
                        data={data.workCommunication}
                        onChange={(d) => setData({ ...data, workCommunication: d })}
                        currentUser={data.participantInfo.name}
                    />
                )}
                {currentSection === 2 && (
                    <Section3
                        data={data.socialTrust}
                        onChange={(d) => setData({ ...data, socialTrust: d })}
                        currentUser={data.participantInfo.name}
                    />
                )}
                {currentSection === 3 && (
                    <Section4
                        data={data.negativeNetwork}
                        onChange={(d) => setData({ ...data, negativeNetwork: d })}
                        currentUser={data.participantInfo.name}
                    />
                )}
                {currentSection === 4 && (
                    <Section5
                        data={data.relationshipStrength}
                        onChange={(d) => setData({ ...data, relationshipStrength: d })}
                        allMentionedNames={allAvailableNames}
                    />
                )}
                {currentSection === 5 && (
                    <Section6
                        data={data.perceptionNetwork}
                        onChange={(d) => setData({ ...data, perceptionNetwork: d })}
                        allMentionedNames={allAvailableNames}
                    />
                )}
                {currentSection === 6 && (
                    <Section7
                        data={data.cliqueMapping}
                        onChange={(d) => setData({ ...data, cliqueMapping: d })}
                        currentUser={data.participantInfo.name}
                    />
                )}
                {currentSection === 7 && (
                    <Section8
                        data={data.comments}
                        onChange={(d) => setData({ ...data, comments: d })}
                    />
                )}
            </div>

            {/* Error */}
            {submitError && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                    {submitError}
                </div>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between mt-6 mb-12">
                <button
                    type="button"
                    onClick={goPrev}
                    disabled={currentSection === 0}
                    className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed text-academic-600 hover:bg-academic-50 border border-academic-200"
                >
                    <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15.75 19.5L8.25 12l7.5-7.5"
                        />
                    </svg>
                    Previous
                </button>

                {currentSection < TOTAL_SECTIONS - 1 ? (
                    <button
                        type="button"
                        onClick={goNext}
                        className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-lg transition-all bg-academic-700 text-white hover:bg-academic-800 shadow-sm"
                    >
                        Next
                        <svg
                            className="w-4 h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M8.25 4.5l7.5 7.5-7.5 7.5"
                            />
                        </svg>
                    </button>
                ) : (
                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="flex items-center gap-2 px-6 py-2.5 text-sm font-medium rounded-lg transition-all bg-insight-green text-white hover:bg-green-600 shadow-sm disabled:opacity-60 disabled:cursor-wait"
                    >
                        {isSubmitting ? (
                            <>
                                <svg
                                    className="w-4 h-4 animate-spin"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    />
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                                    />
                                </svg>
                                Submitting...
                            </>
                        ) : (
                            <>
                                Submit Survey
                                <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={2}
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M4.5 12.75l6 6 9-13.5"
                                    />
                                </svg>
                            </>
                        )}
                    </button>
                )}
            </div>
        </div>
    );
}
