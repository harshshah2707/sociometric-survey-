"use client";

/**
 * Section 1 — Participant Information
 */
import type { ParticipantInfo, WorkMode } from "@/types/survey";
import { PREDEFINED_NAMES } from "@/types/survey";

interface Section1Props {
    data: ParticipantInfo;
    onChange: (data: ParticipantInfo) => void;
}

export default function Section1({ data, onChange }: Section1Props) {
    function update(field: keyof ParticipantInfo, value: string | number | WorkMode) {
        onChange({ ...data, [field]: value });
    }

    return (
        <div className="section-enter space-y-5">
            <p className="text-sm text-academic-500 mb-6">
                Please provide your basic workplace information. Fields marked with{" "}
                <span className="text-red-500">*</span> are required.
            </p>

            {/* Name */}
            <div>
                <label className="block text-sm font-medium text-academic-700 mb-1">
                    Full Name <span className="text-red-500">*</span>
                </label>
                <select
                    value={data.name}
                    onChange={(e) => update("name", e.target.value)}
                    className="w-full px-4 py-2.5 border border-parchment-400 rounded-lg bg-white text-sm"
                    required
                >
                    <option value="" disabled>Select your name...</option>
                    {PREDEFINED_NAMES.map((name) => (
                        <option key={name} value={name}>
                            {name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Employee ID */}
            <div>
                <label className="block text-sm font-medium text-academic-700 mb-1">
                    Employee ID <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    value={data.employeeId}
                    onChange={(e) => update("employeeId", e.target.value)}
                    placeholder="e.g., EMP-001"
                    className="w-full px-4 py-2.5 border border-parchment-400 rounded-lg bg-white text-sm"
                    required
                />
            </div>

            {/* Department */}
            <div>
                <label className="block text-sm font-medium text-academic-700 mb-1">
                    Department
                </label>
                <input
                    type="text"
                    value={data.department}
                    onChange={(e) => update("department", e.target.value)}
                    placeholder="e.g., Human Resources"
                    className="w-full px-4 py-2.5 border border-parchment-400 rounded-lg bg-white text-sm"
                />
            </div>

            {/* Role */}
            <div>
                <label className="block text-sm font-medium text-academic-700 mb-1">
                    Role / Position
                </label>
                <input
                    type="text"
                    value={data.role}
                    onChange={(e) => update("role", e.target.value)}
                    placeholder="e.g., Senior Analyst"
                    className="w-full px-4 py-2.5 border border-parchment-400 rounded-lg bg-white text-sm"
                />
            </div>

            {/* Years Working */}
            <div>
                <label className="block text-sm font-medium text-academic-700 mb-1">
                    Years Working at Organization
                </label>
                <input
                    type="number"
                    min={0}
                    max={50}
                    value={data.yearsWorking}
                    onChange={(e) =>
                        update("yearsWorking", e.target.value ? Number(e.target.value) : "")
                    }
                    placeholder="e.g., 3"
                    className="w-full px-4 py-2.5 border border-parchment-400 rounded-lg bg-white text-sm"
                />
            </div>

            {/* Work Mode */}
            <div>
                <label className="block text-sm font-medium text-academic-700 mb-2">
                    Primarily Work Mode
                </label>
                <div className="flex flex-col sm:flex-row gap-3">
                    {(["In-office", "Hybrid", "Remote"] as WorkMode[]).map((mode) => (
                        <label
                            key={mode}
                            className={`flex items-center gap-3 px-4 py-3 border rounded-lg cursor-pointer transition-all ${data.workMode === mode
                                ? "border-academic-500 bg-academic-50 shadow-sm"
                                : "border-parchment-300 hover:border-parchment-400"
                                }`}
                        >
                            <input
                                type="radio"
                                name="workMode"
                                value={mode}
                                checked={data.workMode === mode}
                                onChange={() => update("workMode", mode)}
                            />
                            <span className="text-sm text-academic-700">{mode}</span>
                        </label>
                    ))}
                </div>
            </div>
        </div>
    );
}
