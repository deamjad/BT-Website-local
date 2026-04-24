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

export interface AiDimensionAnalysis {
  dimension: Dimension;
  score: number;
  insight: string;
  implication: string;
}

export interface AiRoadmapItem {
  phase: "30 days" | "60 days" | "90 days";
  focus: string;
  actions: string[];
}

export interface AiAssessmentReport {
  executiveSummary: string;
  businessDiagnosis: string;
  dimensionAnalysis: AiDimensionAnalysis[];
  keyRisks: string[];
  opportunities: string[];
  topPriorities: string[];
  roadmap: AiRoadmapItem[];
  closingInsight: string;
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
  aiStatus?: "generated" | "fallback" | "failed";
  aiModel?: string;
  aiGeneratedAt?: FirestoreDateValue;
  aiError?: string;
  aiReport?: AiAssessmentReport | null;
  reportVersion?: string;
}
