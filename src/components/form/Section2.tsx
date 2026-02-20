"use client";

/**
 * Section 2 — Work Communication Network
 */
import type { WorkCommunicationNetwork } from "@/types/survey";
import NameInput from "./NameInput";

interface Section2Props {
    data: WorkCommunicationNetwork;
    onChange: (data: WorkCommunicationNetwork) => void;
    currentUser: string;
}

export default function Section2({ data, onChange, currentUser }: Section2Props) {
    function update(field: keyof WorkCommunicationNetwork, value: string[]) {
        onChange({ ...data, [field]: value });
    }

    return (
        <div className="section-enter space-y-2">
            <p className="text-sm text-academic-500 mb-6">
                Think about your work-related interactions over the past month.
                For each question, select up to 5 colleagues.
            </p>

            <NameInput
                label="Who have you communicated with about work tasks?"
                description="People you regularly discuss tasks, projects, or deliverables with."
                value={data.communicatedAboutWork}
                onChange={(v) => update("communicatedAboutWork", v)}
                currentUser={currentUser}
            />

            <NameInput
                label="Who do you seek advice or guidance from?"
                description="People whose opinions or expertise you rely on for work decisions."
                value={data.seekAdviceFrom}
                onChange={(v) => update("seekAdviceFrom", v)}
                currentUser={currentUser}
            />

            <NameInput
                label="Who seeks advice or guidance from you?"
                description="People who come to you for help, mentoring, or problem-solving."
                value={data.whoSeekAdviceFromYou}
                onChange={(v) => update("whoSeekAdviceFromYou", v)}
                currentUser={currentUser}
            />

            <NameInput
                label="Who do you collaborate with most?"
                description="People you work most closely with on shared goals."
                value={data.collaborateMostWith}
                onChange={(v) => update("collaborateMostWith", v)}
                currentUser={currentUser}
            />
        </div>
    );
}
