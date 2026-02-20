"use client";

/**
 * Section 6 — Perception Network
 * Checkbox grid for each mentioned person: expert, influences, depend, supports.
 */
import type { PerceptionEntry } from "@/types/survey";

interface Section6Props {
    data: PerceptionEntry[];
    onChange: (data: PerceptionEntry[]) => void;
    allMentionedNames: string[];
}

const PERCEPTION_FIELDS = [
    { key: "isExpert" as const, label: "Is an expert" },
    { key: "influencesDecisions" as const, label: "Influences decisions" },
    { key: "iDependOnThem" as const, label: "I depend on them" },
    { key: "supportsMyPerformance" as const, label: "Supports my performance" },
];

export default function Section6({
    data,
    onChange,
    allMentionedNames,
}: Section6Props) {
    function getOrCreate(personName: string): PerceptionEntry {
        const existing = data.find((d) => d.personName === personName);
        if (existing) return existing;
        return {
            personName,
            isExpert: false,
            influencesDecisions: false,
            iDependOnThem: false,
            supportsMyPerformance: false,
        };
    }

    function toggle(
        personName: string,
        field: keyof Omit<PerceptionEntry, "personName">
    ) {
        const updated = allMentionedNames.map((name) => {
            const current = getOrCreate(name);
            if (name === personName) {
                return { ...current, [field]: !current[field] };
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
                        No names have been mentioned in previous sections. Please go back
                        and add colleague names.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="section-enter">
            <p className="text-sm text-academic-500 mb-6">
                For each person listed below, indicate whether the statement applies
                (Yes / No).
            </p>

            <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                    <thead>
                        <tr>
                            <th className="text-left py-2 px-3 bg-parchment-100 border border-parchment-300 font-medium text-academic-600 min-w-[120px]">
                                Person
                            </th>
                            {PERCEPTION_FIELDS.map((f) => (
                                <th
                                    key={f.key}
                                    className="py-2 px-3 bg-parchment-100 border border-parchment-300 font-medium text-academic-600 text-center text-xs min-w-[100px]"
                                >
                                    {f.label}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {allMentionedNames.map((name) => {
                            const entry = getOrCreate(name);
                            return (
                                <tr key={name}>
                                    <td className="py-2 px-3 border border-parchment-300 font-medium text-academic-700 bg-white">
                                        {name}
                                    </td>
                                    {PERCEPTION_FIELDS.map((f) => (
                                        <td
                                            key={f.key}
                                            className="py-2 px-3 border border-parchment-300 text-center"
                                        >
                                            <label className="inline-flex items-center gap-1.5 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={entry[f.key]}
                                                    onChange={() => toggle(name, f.key)}
                                                    className="rounded"
                                                />
                                                <span className="text-xs text-academic-500">
                                                    {entry[f.key] ? "Yes" : "No"}
                                                </span>
                                            </label>
                                        </td>
                                    ))}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
