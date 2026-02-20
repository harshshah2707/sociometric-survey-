"use client";

/**
 * Section 3 — Social & Trust Network
 */
import type { SocialTrustNetwork } from "@/types/survey";
import NameInput from "./NameInput";

interface Section3Props {
    data: SocialTrustNetwork;
    onChange: (data: SocialTrustNetwork) => void;
    currentUser: string;
}

export default function Section3({ data, onChange, currentUser }: Section3Props) {
    function update(field: keyof SocialTrustNetwork, value: string[]) {
        onChange({ ...data, [field]: value });
    }

    return (
        <div className="section-enter space-y-2">
            <p className="text-sm text-academic-500 mb-6">
                These questions map your informal and trust-based workplace relationships.
            </p>

            <NameInput
                label="Who do you have informal conversations with?"
                description="People you chat with about non-work topics (lunch, hobbies, personal life)."
                value={data.informalConversation}
                onChange={(v) => update("informalConversation", v)}
                currentUser={currentUser}
            />

            <NameInput
                label="Who do you trust with sensitive work matters?"
                description="People you feel comfortable sharing confidential or delicate information with."
                value={data.trustWithSensitiveMatters}
                onChange={(v) => update("trustWithSensitiveMatters", v)}
                currentUser={currentUser}
            />

            <NameInput
                label="Who would you approach after making a mistake?"
                description="People you'd feel safe going to for support or guidance after an error."
                value={data.approachAfterMistake}
                onChange={(v) => update("approachAfterMistake", v)}
                currentUser={currentUser}
            />
        </div>
    );
}
