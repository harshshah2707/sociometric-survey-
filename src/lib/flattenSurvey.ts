/**
 * Flatten nested survey JSON into a flat key-value row for Google Sheets.
 */
import type { SurveyData } from "@/types/survey";

/** Generate a flat header row + data row from survey data */
export function flattenSurveyData(data: SurveyData): {
    headers: string[];
    values: string[];
} {
    const headers: string[] = [];
    const values: string[] = [];

    function push(header: string, value: string) {
        headers.push(header);
        values.push(value);
    }

    // Timestamp
    push("submitted_at", data.submittedAt || new Date().toISOString());

    // Section 1: Participant Info
    push("name", data.participantInfo.name);
    push("employee_id", data.participantInfo.employeeId);
    push("department", data.participantInfo.department);
    push("role", data.participantInfo.role);
    push("years_working", String(data.participantInfo.yearsWorking));
    push("work_mode", data.participantInfo.workMode);

    // Section 2: Work Communication
    push("communicated_about_work", data.workCommunication.communicatedAboutWork.join(", "));
    push("seek_advice_from", data.workCommunication.seekAdviceFrom.join(", "));
    push("who_seek_advice_from_you", data.workCommunication.whoSeekAdviceFromYou.join(", "));
    push("collaborate_most_with", data.workCommunication.collaborateMostWith.join(", "));

    // Section 3: Social & Trust
    push("informal_conversation", data.socialTrust.informalConversation.join(", "));
    push("trust_with_sensitive_matters", data.socialTrust.trustWithSensitiveMatters.join(", "));
    push("approach_after_mistake", data.socialTrust.approachAfterMistake.join(", "));

    // Section 4: Negative Network
    push("avoid_interacting_with", data.negativeNetwork.avoidInteractingWith.join(", "));
    push("makes_job_harder", data.negativeNetwork.makesJobHarder.join(", "));
    push("frequent_disagreement", data.negativeNetwork.frequentDisagreement.join(", "));

    // Section 5: Relationship Strength (dynamic columns per person)
    for (const rs of data.relationshipStrength) {
        const person = rs.personName;
        push(`freq_${person}`, String(rs.frequencyOfInteraction));
        push(`importance_${person}`, String(rs.workImportance));
        push(`trust_level_${person}`, String(rs.trustLevel));
        push(`ease_comm_${person}`, String(rs.easeOfCommunication));
        push(`emotional_${person}`, String(rs.emotionalExperience));
        push(`conflict_freq_${person}`, String(rs.conflictFrequency));
    }

    // Section 6: Perception Network (dynamic columns per person)
    for (const pe of data.perceptionNetwork) {
        const person = pe.personName;
        push(`expert_${person}`, pe.isExpert ? "Yes" : "No");
        push(`influences_${person}`, pe.influencesDecisions ? "Yes" : "No");
        push(`depend_${person}`, pe.iDependOnThem ? "Yes" : "No");
        push(`supports_${person}`, pe.supportsMyPerformance ? "Yes" : "No");
    }

    // Section 7: Clique Mapping
    push("top_three_people", data.cliqueMapping.topThreePeople.join(", "));
    push(
        "interaction_matrix",
        JSON.stringify(data.cliqueMapping.interactionMatrix)
    );
    push("who_collaborates_most", data.cliqueMapping.whoCollaboratesMost);
    push("any_conflict", data.cliqueMapping.anyConflict ? "Yes" : "No");
    push("conflict_person_name", data.cliqueMapping.conflictPersonName);

    // Section 8: Comments
    push("additional_comments", data.comments.additionalComments);

    return { headers, values };
}
