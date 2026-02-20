"use client";

/**
 * Section 7 — Clique Mapping
 * Choose top 3 people, boolean interaction matrix, collaboration & conflict.
 */
import type { CliqueMapping } from "@/types/survey";
import NameInput from "./NameInput";

interface Section7Props {
    data: CliqueMapping;
    onChange: (data: CliqueMapping) => void;
    currentUser: string;
}

export default function Section7({ data, onChange, currentUser }: Section7Props) {
    function updateField<K extends keyof CliqueMapping>(
        field: K,
        value: CliqueMapping[K]
    ) {
        onChange({ ...data, [field]: value });
    }

    // When top 3 changes, rebuild interaction matrix
    function handleTopThreeChange(names: string[]) {
        const matrix: Record<string, Record<string, boolean>> = {};
        for (const a of names) {
            matrix[a] = {};
            for (const b of names) {
                if (a !== b) {
                    matrix[a][b] =
                        data.interactionMatrix[a]?.[b] ?? false;
                }
            }
        }
        onChange({ ...data, topThreePeople: names, interactionMatrix: matrix });
    }

    function toggleMatrix(a: string, b: string) {
        const matrix = { ...data.interactionMatrix };
        if (!matrix[a]) matrix[a] = {};
        matrix[a][b] = !matrix[a][b];
        onChange({ ...data, interactionMatrix: matrix });
    }

    const top3 = data.topThreePeople;

    return (
        <div className="section-enter space-y-6">
            <p className="text-sm text-academic-500 mb-4">
                Identify the 3 people you interact with most closely as a group (clique).
            </p>

            <NameInput
                label="Choose your top 3 closest colleagues"
                value={top3}
                onChange={handleTopThreeChange}
                max={3}
                currentUser={currentUser}
            />

            {/* Interaction Matrix */}
            {top3.length >= 2 && (
                <div>
                    <h3 className="text-sm font-semibold text-academic-700 mb-3">
                        Do these people interact with each other?
                    </h3>
                    <div className="overflow-x-auto">
                        <table className="text-sm border-collapse">
                            <thead>
                                <tr>
                                    <th className="py-2 px-3 bg-parchment-100 border border-parchment-300 text-academic-600 font-medium">
                                        ↓ interacts with →
                                    </th>
                                    {top3.map((name) => (
                                        <th
                                            key={name}
                                            className="py-2 px-3 bg-parchment-100 border border-parchment-300 text-academic-600 font-medium text-center"
                                        >
                                            {name}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {top3.map((a) => (
                                    <tr key={a}>
                                        <td className="py-2 px-3 border border-parchment-300 font-medium text-academic-700 bg-white">
                                            {a}
                                        </td>
                                        {top3.map((b) => (
                                            <td
                                                key={b}
                                                className="py-2 px-3 border border-parchment-300 text-center"
                                            >
                                                {a === b ? (
                                                    <span className="text-academic-300">—</span>
                                                ) : (
                                                    <button
                                                        type="button"
                                                        onClick={() => toggleMatrix(a, b)}
                                                        className={`w-8 h-8 rounded-md text-xs font-medium transition-all ${data.interactionMatrix[a]?.[b]
                                                            ? "bg-insight-green text-white"
                                                            : "bg-parchment-200 text-academic-400 hover:bg-parchment-300"
                                                            }`}
                                                    >
                                                        {data.interactionMatrix[a]?.[b] ? "Yes" : "No"}
                                                    </button>
                                                )}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Who collaborates most */}
            <div>
                <label className="block text-sm font-medium text-academic-700 mb-1">
                    Among these people, who collaborates the most?
                </label>
                <input
                    type="text"
                    value={data.whoCollaboratesMost}
                    onChange={(e) => updateField("whoCollaboratesMost", e.target.value)}
                    placeholder="Type a name"
                    className="w-full px-4 py-2.5 border border-parchment-400 rounded-lg bg-white text-sm"
                />
            </div>

            {/* Conflict */}
            <div>
                <label className="block text-sm font-medium text-academic-700 mb-2">
                    Is there any conflict within this group?
                </label>
                <div className="flex gap-4 mb-3">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="radio"
                            name="anyConflict"
                            checked={data.anyConflict}
                            onChange={() => updateField("anyConflict", true)}
                        />
                        <span className="text-sm text-academic-600">Yes</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="radio"
                            name="anyConflict"
                            checked={!data.anyConflict}
                            onChange={() => updateField("anyConflict", false)}
                        />
                        <span className="text-sm text-academic-600">No</span>
                    </label>
                </div>

                {data.anyConflict && (
                    <div className="ml-4">
                        <label className="block text-sm font-medium text-academic-600 mb-1">
                            Who is involved in the conflict? (optional)
                        </label>
                        <input
                            type="text"
                            value={data.conflictPersonName}
                            onChange={(e) =>
                                updateField("conflictPersonName", e.target.value)
                            }
                            placeholder="Name(s)"
                            className="w-full px-4 py-2.5 border border-parchment-400 rounded-lg bg-white text-sm"
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
