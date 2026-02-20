"use client";

/**
 * Section 4 — Negative / Avoidance Network
 */
import type { NegativeNetwork } from "@/types/survey";
import NameInput from "./NameInput";

interface Section4Props {
    data: NegativeNetwork;
    onChange: (data: NegativeNetwork) => void;
    currentUser: string;
}

export default function Section4({ data, onChange, currentUser }: Section4Props) {
    function update(field: keyof NegativeNetwork, value: string[]) {
        onChange({ ...data, [field]: value });
    }

    return (
        <div className="section-enter space-y-2">
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-amber-800">
                    <strong>Note:</strong> This section asks about challenging workplace
                    relationships. Your responses are confidential and used only for
                    organizational research purposes. Honest answers help improve
                    workplace dynamics.
                </p>
            </div>

            <NameInput
                label="Who do you tend to avoid interacting with?"
                description="People you consciously minimize contact with at work."
                value={data.avoidInteractingWith}
                onChange={(v) => update("avoidInteractingWith", v)}
                currentUser={currentUser}
            />

            <NameInput
                label="Who makes your job harder?"
                description="People whose actions or behaviors create obstacles for your work."
                value={data.makesJobHarder}
                onChange={(v) => update("makesJobHarder", v)}
                currentUser={currentUser}
            />

            <NameInput
                label="Who do you have frequent disagreements with?"
                description="People you often find yourself in conflict or tension with."
                value={data.frequentDisagreement}
                onChange={(v) => update("frequentDisagreement", v)}
                currentUser={currentUser}
            />
        </div>
    );
}
