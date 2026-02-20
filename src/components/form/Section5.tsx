"use client";

/**
 * Section 5 — Relationship Strength (Name Interpreter)
 * Dynamically populated rating grids based on previously mentioned names.
 */
import type { RelationshipStrength, FrequencyOfInteraction, FivePointScale } from "@/types/survey";

interface Section5Props {
    data: RelationshipStrength[];
    onChange: (data: RelationshipStrength[]) => void;
    allMentionedNames: string[];
}

const FREQUENCY_OPTIONS: FrequencyOfInteraction[] = [
    "Rarely",
    "Monthly",
    "Weekly",
    "Several times a week",
    "Daily",
];

const SCALE_LABELS: Record<string, string[]> = {
    workImportance: ["Not important", "Slightly", "Moderate", "Important", "Very important"],
    trustLevel: ["Very low", "Low", "Moderate", "High", "Very high"],
    easeOfCommunication: ["Very difficult", "Difficult", "Moderate", "Easy", "Very easy"],
    emotionalExperience: ["Very draining", "Draining", "Neutral", "Energizing", "Very energizing"],
    conflictFrequency: ["Never", "Rarely", "Sometimes", "Often", "Very often"],
};

export default function Section5({
    data,
    onChange,
    allMentionedNames,
}: Section5Props) {
    // Ensure data array matches allMentionedNames
    function getOrCreate(personName: string): RelationshipStrength {
        const existing = data.find((d) => d.personName === personName);
        if (existing) return existing;
        return {
            personName,
            frequencyOfInteraction: "",
            workImportance: "",
            trustLevel: "",
            easeOfCommunication: "",
            emotionalExperience: "",
            conflictFrequency: "",
        };
    }

    function updatePerson(
        personName: string,
        field: keyof RelationshipStrength,
        value: string | number
    ) {
        const updated = allMentionedNames.map((name) => {
            const current = getOrCreate(name);
            if (name === personName) {
                return { ...current, [field]: value };
            }
            return current;
        });
        onChange(updated);
    }

    if (allMentionedNames.length === 0) {
        return (
            <div className="section-enter">
                <div className="bg-academic-50 border border-academic-200 rounded-lg p-6 text-center">
                    <p className="text-sm text-academic-500">
                        No names have been mentioned in previous sections.
                        Please go back and add colleague names to see rating grids here.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="section-enter space-y-8">
            <p className="text-sm text-academic-500 mb-4">
                Rate your relationship with each person mentioned in previous sections.
                Scroll horizontally on mobile.
            </p>

            {/* Frequency of Interaction */}
            <RatingGrid
                title="Frequency of Interaction"
                names={allMentionedNames}
                options={FREQUENCY_OPTIONS}
                getSelected={(name) => getOrCreate(name).frequencyOfInteraction}
                onSelect={(name, val) => updatePerson(name, "frequencyOfInteraction", val)}
            />

            {/* Five-point scale grids */}
            {(
                [
                    { key: "workImportance" as const, title: "Work Importance" },
                    { key: "trustLevel" as const, title: "Trust Level" },
                    { key: "easeOfCommunication" as const, title: "Ease of Communication" },
                    { key: "emotionalExperience" as const, title: "Emotional Experience" },
                    { key: "conflictFrequency" as const, title: "Conflict Frequency" },
                ] as const
            ).map(({ key, title }) => (
                <ScaleGrid
                    key={key}
                    title={title}
                    names={allMentionedNames}
                    labels={SCALE_LABELS[key]}
                    getSelected={(name) => getOrCreate(name)[key] as FivePointScale | ""}
                    onSelect={(name, val) => updatePerson(name, key, val)}
                />
            ))}
        </div>
    );
}

/* Sub-component: Rating Grid for frequency */
function RatingGrid({
    title,
    names,
    options,
    getSelected,
    onSelect,
}: {
    title: string;
    names: string[];
    options: string[];
    getSelected: (name: string) => string;
    onSelect: (name: string, value: string) => void;
}) {
    return (
        <div>
            <h3 className="text-base font-semibold text-academic-700 mb-3">{title}</h3>
            <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                    <thead>
                        <tr>
                            <th className="text-left py-2 px-3 bg-parchment-100 border border-parchment-300 font-medium text-academic-600 min-w-[120px]">
                                Person
                            </th>
                            {options.map((opt) => (
                                <th
                                    key={opt}
                                    className="py-2 px-2 bg-parchment-100 border border-parchment-300 font-medium text-academic-600 text-center text-xs min-w-[80px]"
                                >
                                    {opt}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {names.map((name) => (
                            <tr key={name}>
                                <td className="py-2 px-3 border border-parchment-300 font-medium text-academic-700 bg-white">
                                    {name}
                                </td>
                                {options.map((opt) => (
                                    <td
                                        key={opt}
                                        className="py-2 px-2 border border-parchment-300 text-center"
                                    >
                                        <button
                                            type="button"
                                            onClick={() => onSelect(name, opt)}
                                            className={`rating-cell w-8 h-8 rounded-md text-xs ${getSelected(name) === opt
                                                    ? "selected"
                                                    : "bg-white hover:bg-academic-50"
                                                }`}
                                        >
                                            {getSelected(name) === opt ? "✓" : "○"}
                                        </button>
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

/* Sub-component: Scale Grid for 1-5 ratings */
function ScaleGrid({
    title,
    names,
    labels,
    getSelected,
    onSelect,
}: {
    title: string;
    names: string[];
    labels: string[];
    getSelected: (name: string) => FivePointScale | "";
    onSelect: (name: string, value: FivePointScale) => void;
}) {
    return (
        <div>
            <h3 className="text-base font-semibold text-academic-700 mb-3">{title}</h3>
            <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                    <thead>
                        <tr>
                            <th className="text-left py-2 px-3 bg-parchment-100 border border-parchment-300 font-medium text-academic-600 min-w-[120px]">
                                Person
                            </th>
                            {labels.map((label, idx) => (
                                <th
                                    key={idx}
                                    className="py-2 px-2 bg-parchment-100 border border-parchment-300 font-medium text-academic-600 text-center text-xs min-w-[80px]"
                                >
                                    {idx + 1} — {label}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {names.map((name) => (
                            <tr key={name}>
                                <td className="py-2 px-3 border border-parchment-300 font-medium text-academic-700 bg-white">
                                    {name}
                                </td>
                                {labels.map((_, idx) => {
                                    const val = (idx + 1) as FivePointScale;
                                    return (
                                        <td
                                            key={idx}
                                            className="py-2 px-2 border border-parchment-300 text-center"
                                        >
                                            <button
                                                type="button"
                                                onClick={() => onSelect(name, val)}
                                                className={`rating-cell w-8 h-8 rounded-md text-xs ${getSelected(name) === val
                                                        ? "selected"
                                                        : "bg-white hover:bg-academic-50"
                                                    }`}
                                            >
                                                {getSelected(name) === val ? val : "○"}
                                            </button>
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
