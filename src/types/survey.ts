/* ============================================
   Survey Types — Sociometric Survey Application
   ============================================ */

/** Predefined participant names for autocomplete */
export const PREDEFINED_NAMES = [
    "Nandani", "Pradipta", "Devyani", "Hinal", "Grisha",
    "Yasar", "Vrinda", "Lakshyata", "Shraddha", "Harshi",
    "Stutie", "Ayushi", "Pooja", "Prapti", "Niyati",
    "Jenil", "KJ",
] as const;

/** Work mode options */
export type WorkMode = "In-office" | "Hybrid" | "Remote";

/** Section 1 — Participant Information */
export interface ParticipantInfo {
    name: string;
    employeeId: string;
    department: string;
    role: string;
    yearsWorking: number | "";
    workMode: WorkMode;
}

/** Section 2 — Work Communication Network */
export interface WorkCommunicationNetwork {
    communicatedAboutWork: string[];
    seekAdviceFrom: string[];
    whoSeekAdviceFromYou: string[];
    collaborateMostWith: string[];
}

/** Section 3 — Social & Trust Network */
export interface SocialTrustNetwork {
    informalConversation: string[];
    trustWithSensitiveMatters: string[];
    approachAfterMistake: string[];
}

/** Section 4 — Negative / Avoidance Network */
export interface NegativeNetwork {
    avoidInteractingWith: string[];
    makesJobHarder: string[];
    frequentDisagreement: string[];
}

/** Rating scales for Section 5 */
export type FrequencyOfInteraction = "Rarely" | "Monthly" | "Weekly" | "Several times a week" | "Daily";
export type FivePointScale = 1 | 2 | 3 | 4 | 5;

/** Section 5 — Relationship Strength per person */
export interface RelationshipStrength {
    personName: string;
    frequencyOfInteraction: FrequencyOfInteraction | "";
    workImportance: FivePointScale | "";
    trustLevel: FivePointScale | "";
    easeOfCommunication: FivePointScale | "";
    emotionalExperience: FivePointScale | "";
    conflictFrequency: FivePointScale | "";
}

/** Section 6 — Perception Network per person */
export interface PerceptionEntry {
    personName: string;
    isExpert: boolean;
    influencesDecisions: boolean;
    iDependOnThem: boolean;
    supportsMyPerformance: boolean;
}

/** Section 7 — Clique Mapping */
export interface CliqueMapping {
    topThreePeople: string[];
    interactionMatrix: Record<string, Record<string, boolean>>;
    whoCollaboratesMost: string;
    anyConflict: boolean;
    conflictPersonName: string;
}

/** Section 8 — Comments */
export interface Comments {
    additionalComments: string;
}

/** Full survey data structure */
export interface SurveyData {
    participantInfo: ParticipantInfo;
    workCommunication: WorkCommunicationNetwork;
    socialTrust: SocialTrustNetwork;
    negativeNetwork: NegativeNetwork;
    relationshipStrength: RelationshipStrength[];
    perceptionNetwork: PerceptionEntry[];
    cliqueMapping: CliqueMapping;
    comments: Comments;
    submittedAt?: string;
}

/** Section labels for navigation */
export const SECTION_LABELS = [
    "Participant Information",
    "Work Communication Network",
    "Social & Trust Network",
    "Negative / Avoidance Network",
    "Relationship Strength",
    "Perception Network",
    "Clique Mapping",
    "Comments",
] as const;

export type SectionIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;

/** Default empty survey */
export function createEmptySurvey(): SurveyData {
    return {
        participantInfo: {
            name: "",
            employeeId: "",
            department: "",
            role: "",
            yearsWorking: "",
            workMode: "In-office",
        },
        workCommunication: {
            communicatedAboutWork: [],
            seekAdviceFrom: [],
            whoSeekAdviceFromYou: [],
            collaborateMostWith: [],
        },
        socialTrust: {
            informalConversation: [],
            trustWithSensitiveMatters: [],
            approachAfterMistake: [],
        },
        negativeNetwork: {
            avoidInteractingWith: [],
            makesJobHarder: [],
            frequentDisagreement: [],
        },
        relationshipStrength: [],
        perceptionNetwork: [],
        cliqueMapping: {
            topThreePeople: [],
            interactionMatrix: {},
            whoCollaboratesMost: "",
            anyConflict: false,
            conflictPersonName: "",
        },
        comments: {
            additionalComments: "",
        },
    };
}
