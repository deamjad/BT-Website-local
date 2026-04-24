import type { FieldValue, Timestamp } from "firebase/firestore";

export type Dimension =
  | "strategyLeadership"
  | "governanceOperatingModel"
  | "processesExecution"
  | "technologyData"
  | "peopleCapabilities"
  | "customerInnovationGrowth";

export interface Question {
  id: string;
  text: string;
  dimension: Dimension;
}

export interface SurveyDefinition {
  key: "smb" | "enterprise";
  title: string;
  estimatedMinutes: string;
  description: string;
  dimensions: Dimension[];
  questions: Question[];
}

export interface RespondentInfo {
  firstName: string;
  lastName: string;
  workEmail: string;
  companyName: string;
  jobTitle: string;
  phoneCountryCode?: string;
  phone?: string;
  industry: string;
  employeeCountBand: string;
  mainChallenge?: string;
  consent: boolean;
}

export interface AssessmentScoreSummary {
  overallScore: number;
  dimensionScores: Record<Dimension, number>;
  bottlenecks: Dimension[];
}

export interface AssessmentReport {
  summary: string;
  recommendations: string[];
}

export type FirestoreDateValue = Date | Timestamp | FieldValue;

export interface AssessmentSubmission {
  id?: string;
  createdAt: FirestoreDateValue;
  updatedAt: FirestoreDateValue;
  surveyVersion: "smb" | "enterprise";
  companySizeBand: string;
  respondent: RespondentInfo;
  answers: Record<string, number>;
  utmParams: Record<string, string>;
  referrer: string;
  userAgent: string;
  emailStatus: "pending" | "sent" | "failed";
  emailProviderMessageId?: string | null;
  emailError?: string;
  sentAt?: FirestoreDateValue;
  scoreSummary: AssessmentScoreSummary | null;
  reportSummary?: AssessmentReport | null;
  aiReport?: AssessmentReport | null;
}
