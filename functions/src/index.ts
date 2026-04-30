import { GoogleGenAI } from "@google/genai";
import { initializeApp } from "firebase-admin/app";
import { FieldValue, getFirestore } from "firebase-admin/firestore";
import { HttpsError, onCall } from "firebase-functions/https";
import { defineSecret } from "firebase-functions/params";
import PDFDocument from "pdfkit";
import { z } from "zod";

initializeApp();

const RESEND_API_KEY = defineSecret("RESEND_API_KEY");
const GEMINI_API_KEY = defineSecret("GEMINI_API_KEY");
const FIRESTORE_DATABASE_ID =
  process.env.FIRESTORE_DATABASE_ID ?? "ai-studio-670aaabe-4bc0-4524-9b39-588e755821ca";
const REPORT_FROM_EMAIL =
  process.env.REPORT_FROM_EMAIL ?? "Business Transformation <onboarding@resend.dev>";
const REPORT_BCC_EMAIL = process.env.REPORT_BCC_EMAIL ?? "deamjad@gmail.com";
const REPORT_SUBJECT = "Personalized Assessment Report from Business Transformation Limited";
const REPORT_VERSION = "visual-ai-v1";
const DEFAULT_AI_MODEL = process.env.AI_MODEL ?? "gemini-2.5-flash";

const COLORS = {
  navy: "#0B2E5E",
  blue: "#0F3EA8",
  sky: "#DCEAFE",
  ink: "#111827",
  muted: "#64748B",
  line: "#D8DEE9",
  soft: "#F4F7FB",
  green: "#15803D",
  amber: "#B45309",
  red: "#B91C1C",
  white: "#FFFFFF",
};

const DIMENSIONS = [
  "strategyLeadership",
  "governanceOperatingModel",
  "processesExecution",
  "technologyData",
  "peopleCapabilities",
  "customerInnovationGrowth",
] as const;

type Dimension = (typeof DIMENSIONS)[number];
type SurveyVersion = "smb" | "enterprise";
type AiStatus = "generated" | "fallback" | "failed";

const dimensionLabels: Record<Dimension, string> = {
  strategyLeadership: "Strategy & Leadership",
  governanceOperatingModel: "Governance & Operating Model",
  processesExecution: "Processes & Execution",
  technologyData: "Technology & Data",
  peopleCapabilities: "People & Capabilities",
  customerInnovationGrowth: "Customer, Innovation & Growth",
};

const surveyQuestions: Record<SurveyVersion, Array<{ id: string; dimension: Dimension }>> = {
  smb: [
    { id: "SMB_Q1", dimension: "strategyLeadership" },
    { id: "SMB_Q2", dimension: "strategyLeadership" },
    { id: "SMB_Q3", dimension: "strategyLeadership" },
    { id: "SMB_Q4", dimension: "governanceOperatingModel" },
    { id: "SMB_Q5", dimension: "governanceOperatingModel" },
    { id: "SMB_Q6", dimension: "governanceOperatingModel" },
    { id: "SMB_Q7", dimension: "processesExecution" },
    { id: "SMB_Q8", dimension: "processesExecution" },
    { id: "SMB_Q9", dimension: "processesExecution" },
    { id: "SMB_Q10", dimension: "technologyData" },
    { id: "SMB_Q11", dimension: "technologyData" },
    { id: "SMB_Q12", dimension: "technologyData" },
    { id: "SMB_Q13", dimension: "peopleCapabilities" },
    { id: "SMB_Q14", dimension: "peopleCapabilities" },
    { id: "SMB_Q15", dimension: "peopleCapabilities" },
    { id: "SMB_Q16", dimension: "customerInnovationGrowth" },
    { id: "SMB_Q17", dimension: "customerInnovationGrowth" },
    { id: "SMB_Q18", dimension: "customerInnovationGrowth" },
  ],
  enterprise: [
    { id: "ENT_Q1", dimension: "strategyLeadership" },
    { id: "ENT_Q2", dimension: "strategyLeadership" },
    { id: "ENT_Q3", dimension: "strategyLeadership" },
    { id: "ENT_Q4", dimension: "strategyLeadership" },
    { id: "ENT_Q5", dimension: "strategyLeadership" },
    { id: "ENT_Q6", dimension: "governanceOperatingModel" },
    { id: "ENT_Q7", dimension: "governanceOperatingModel" },
    { id: "ENT_Q8", dimension: "governanceOperatingModel" },
    { id: "ENT_Q9", dimension: "governanceOperatingModel" },
    { id: "ENT_Q10", dimension: "governanceOperatingModel" },
    { id: "ENT_Q11", dimension: "processesExecution" },
    { id: "ENT_Q12", dimension: "processesExecution" },
    { id: "ENT_Q13", dimension: "processesExecution" },
    { id: "ENT_Q14", dimension: "processesExecution" },
    { id: "ENT_Q15", dimension: "processesExecution" },
    { id: "ENT_Q16", dimension: "technologyData" },
    { id: "ENT_Q17", dimension: "technologyData" },
    { id: "ENT_Q18", dimension: "technologyData" },
    { id: "ENT_Q19", dimension: "technologyData" },
    { id: "ENT_Q20", dimension: "technologyData" },
    { id: "ENT_Q21", dimension: "peopleCapabilities" },
    { id: "ENT_Q22", dimension: "peopleCapabilities" },
    { id: "ENT_Q23", dimension: "peopleCapabilities" },
    { id: "ENT_Q24", dimension: "peopleCapabilities" },
    { id: "ENT_Q25", dimension: "peopleCapabilities" },
    { id: "ENT_Q26", dimension: "customerInnovationGrowth" },
    { id: "ENT_Q27", dimension: "customerInnovationGrowth" },
    { id: "ENT_Q28", dimension: "customerInnovationGrowth" },
    { id: "ENT_Q29", dimension: "customerInnovationGrowth" },
    { id: "ENT_Q30", dimension: "customerInnovationGrowth" },
  ],
};

const respondentSchema = z.object({
  firstName: z.string().trim().min(1),
  lastName: z.string().trim().min(1),
  workEmail: z.string().trim().email(),
  companyName: z.string().trim().min(1),
  jobTitle: z.string().trim().min(1),
  industry: z.string().trim().min(1),
  employeeCountBand: z.string().trim().min(1),
  phoneCountryCode: z.string().trim().optional(),
  phone: z.string().trim().optional(),
  mainChallenge: z.string().trim().optional(),
  consent: z.literal(true),
  honeypot: z.string().max(0).optional(),
});

const submissionSchema = z.object({
  surveyVersion: z.enum(["smb", "enterprise"]),
  respondent: respondentSchema,
  answers: z.record(z.string(), z.number().int().min(1).max(5)),
  utmParams: z.record(z.string(), z.string()).default({}),
  referrer: z.string().default(""),
  userAgent: z.string().default(""),
});

const aiDimensionAnalysisSchema = z.object({
  dimension: z.enum(DIMENSIONS),
  score: z.number().min(1).max(5),
  insight: z.string().trim().min(20),
  implication: z.string().trim().min(20),
});

const aiRoadmapItemSchema = z.object({
  phase: z.enum(["30 days", "60 days", "90 days"]),
  focus: z.string().trim().min(10),
  actions: z.array(z.string().trim().min(8)).min(2).max(4),
});

const aiAssessmentReportSchema = z.object({
  executiveSummary: z.string().trim().min(60),
  businessDiagnosis: z.string().trim().min(60),
  dimensionAnalysis: z.array(aiDimensionAnalysisSchema).length(DIMENSIONS.length),
  keyRisks: z.array(z.string().trim().min(10)).min(3).max(5),
  opportunities: z.array(z.string().trim().min(10)).min(3).max(5),
  topPriorities: z.array(z.string().trim().min(10)).min(3).max(5),
  roadmap: z.array(aiRoadmapItemSchema).length(3),
  closingInsight: z.string().trim().min(30),
});

const aiResponseJsonSchema = {
  type: "object",
  additionalProperties: false,
  required: [
    "executiveSummary",
    "businessDiagnosis",
    "dimensionAnalysis",
    "keyRisks",
    "opportunities",
    "topPriorities",
    "roadmap",
    "closingInsight",
  ],
  properties: {
    executiveSummary: { type: "string" },
    businessDiagnosis: { type: "string" },
    dimensionAnalysis: {
      type: "array",
      minItems: 6,
      maxItems: 6,
      items: {
        type: "object",
        additionalProperties: false,
        required: ["dimension", "score", "insight", "implication"],
        properties: {
          dimension: { type: "string", enum: DIMENSIONS },
          score: { type: "number" },
          insight: { type: "string" },
          implication: { type: "string" },
        },
      },
    },
    keyRisks: { type: "array", minItems: 3, maxItems: 5, items: { type: "string" } },
    opportunities: { type: "array", minItems: 3, maxItems: 5, items: { type: "string" } },
    topPriorities: { type: "array", minItems: 3, maxItems: 5, items: { type: "string" } },
    roadmap: {
      type: "array",
      minItems: 3,
      maxItems: 3,
      items: {
        type: "object",
        additionalProperties: false,
        required: ["phase", "focus", "actions"],
        properties: {
          phase: { type: "string", enum: ["30 days", "60 days", "90 days"] },
          focus: { type: "string" },
          actions: { type: "array", minItems: 2, maxItems: 4, items: { type: "string" } },
        },
      },
    },
    closingInsight: { type: "string" },
  },
};

type SubmissionPayload = z.infer<typeof submissionSchema>;
type AiAssessmentReport = z.infer<typeof aiAssessmentReportSchema>;

interface ScoreSummary {
  overallScore: number;
  dimensionScores: Record<Dimension, number>;
  bottlenecks: Dimension[];
}

interface ReportSummary {
  summary: string;
  recommendations: string[];
}

interface AiReportResult {
  status: AiStatus;
  report: AiAssessmentReport;
  model: string;
  error?: string;
}

function roundScore(value: number) {
  return Math.round(value * 10) / 10;
}

function scoreAssessment(payload: SubmissionPayload): ScoreSummary {
  const questions = surveyQuestions[payload.surveyVersion];
  const dimensionScores = Object.fromEntries(
    DIMENSIONS.map((dimension) => {
      const values = questions
        .filter((question) => question.dimension === dimension)
        .map((question) => payload.answers[question.id])
        .filter((value): value is number => typeof value === "number");

      if (values.length === 0) {
        throw new HttpsError("invalid-argument", `Missing answers for ${dimension}.`);
      }

      const average = values.reduce((total, value) => total + value, 0) / values.length;
      return [dimension, roundScore(average)];
    }),
  ) as Record<Dimension, number>;

  const missingAnswer = questions.find((question) => payload.answers[question.id] === undefined);
  if (missingAnswer) {
    throw new HttpsError("invalid-argument", `Missing answer for ${missingAnswer.id}.`);
  }

  const overallScore =
    Object.values(dimensionScores).reduce((total, score) => total + score, 0) /
    DIMENSIONS.length;
  const lowestScore = Math.min(...Object.values(dimensionScores));
  const bottlenecks = DIMENSIONS.filter((dimension) => dimensionScores[dimension] === lowestScore);

  return {
    overallScore: roundScore(overallScore),
    dimensionScores,
    bottlenecks,
  };
}

function maturityBand(score: number) {
  if (score >= 4.2) return "advanced";
  if (score >= 3.2) return "developing";
  return "foundational";
}

function maturityBandLabel(score: number) {
  const band = maturityBand(score);
  if (band === "advanced") return "Advanced maturity";
  if (band === "developing") return "Developing maturity";
  return "Foundational maturity";
}

function scoreColor(score: number) {
  if (score >= 4.2) return COLORS.green;
  if (score >= 3.2) return COLORS.blue;
  if (score >= 2.3) return COLORS.amber;
  return COLORS.red;
}

function buildReportSummary(payload: SubmissionPayload, scoreSummary: ScoreSummary): ReportSummary {
  const band = maturityBand(scoreSummary.overallScore);
  const companyName = payload.respondent.companyName;
  const bottleneckLabels = scoreSummary.bottlenecks
    .map((dimension) => dimensionLabels[dimension])
    .join(", ");

  const summaryByBand: Record<string, string> = {
    advanced: `${companyName} shows strong organizational maturity with clear foundations for sustained execution and scale.`,
    developing: `${companyName} has useful maturity foundations in place, with clear opportunities to improve consistency and operating rhythm.`,
    foundational: `${companyName} appears to be in an early maturity stage, where a sharper operating cadence and clearer ownership can create fast gains.`,
  };

  const recommendations = [
    `Prioritize the lowest-scoring area first: ${bottleneckLabels}.`,
    "Clarify ownership, decision rights, and the next 90-day execution priorities.",
    "Create a simple review cadence that tracks measurable outcomes and blockers.",
    payload.surveyVersion === "enterprise"
      ? "Use cross-functional governance to manage dependencies and transformation risks at scale."
      : "Keep the improvement roadmap practical, lightweight, and focused on the highest-impact growth constraints.",
  ];

  if (payload.respondent.mainChallenge) {
    recommendations.push(
      `Use the stated challenge as the starting point for the first improvement sprint: ${payload.respondent.mainChallenge}.`,
    );
  }

  return {
    summary: summaryByBand[band],
    recommendations,
  };
}

function getAnswerPatterns(payload: SubmissionPayload) {
  const questions = surveyQuestions[payload.surveyVersion];
  return Object.fromEntries(
    DIMENSIONS.map((dimension) => {
      const values = questions
        .filter((question) => question.dimension === dimension)
        .map((question) => payload.answers[question.id])
        .filter((value): value is number => typeof value === "number");

      return [
        dimension,
        {
          min: Math.min(...values),
          max: Math.max(...values),
          lowResponses: values.filter((value) => value <= 2).length,
          neutralResponses: values.filter((value) => value === 3).length,
          strongResponses: values.filter((value) => value >= 4).length,
        },
      ];
    }),
  );
}

function getRankedDimensions(scoreSummary: ScoreSummary, direction: "strongest" | "weakest") {
  return [...DIMENSIONS]
    .sort((left, right) =>
      direction === "strongest"
        ? scoreSummary.dimensionScores[right] - scoreSummary.dimensionScores[left]
        : scoreSummary.dimensionScores[left] - scoreSummary.dimensionScores[right],
    )
    .map((dimension) => ({
      dimension,
      label: dimensionLabels[dimension],
      score: scoreSummary.dimensionScores[dimension],
    }));
}

function getScoreRange(scoreSummary: ScoreSummary) {
  const scores = Object.values(scoreSummary.dimensionScores);
  const highestScore = Math.max(...scores);
  const lowestScore = Math.min(...scores);

  return {
    lowestScore,
    highestScore,
    spread: roundScore(highestScore - lowestScore),
  };
}

function getProfileBalance(scoreSummary: ScoreSummary) {
  const { spread } = getScoreRange(scoreSummary);

  if (spread >= 1.5) return "uneven";
  if (spread >= 0.8) return "moderately balanced";
  return "balanced";
}

function getQuestionLevelResponses(payload: SubmissionPayload) {
  return surveyQuestions[payload.surveyVersion].map((question) => ({
    questionId: question.id,
    dimension: question.dimension,
    dimensionLabel: dimensionLabels[question.dimension],
    response: payload.answers[question.id],
  }));
}

function buildSanitizedAssessmentContext(
  payload: SubmissionPayload,
  scoreSummary: ScoreSummary,
) {
  return {
    assessmentVersion: payload.surveyVersion,
    surveyVersion: payload.surveyVersion,
    respondentRole: payload.respondent.jobTitle,
    industry: payload.respondent.industry,
    employeeCountBand: payload.respondent.employeeCountBand,
    statedMainChallenge: payload.respondent.mainChallenge ?? "",
    maturityLevel: maturityBand(scoreSummary.overallScore),
    maturityLabel: maturityBandLabel(scoreSummary.overallScore),
    maturityModelThresholds: {
      foundational: "overallScore below 3.2",
      developing: "overallScore from 3.2 to below 4.2",
      advanced: "overallScore 4.2 and above",
    },
    overallScore: scoreSummary.overallScore,
    dimensionScores: scoreSummary.dimensionScores,
    strongestDimensions: getRankedDimensions(scoreSummary, "strongest").slice(0, 3),
    weakestDimensions: getRankedDimensions(scoreSummary, "weakest").slice(0, 3),
    bottlenecks: scoreSummary.bottlenecks.map((dimension) => ({
      dimension,
      label: dimensionLabels[dimension],
      score: scoreSummary.dimensionScores[dimension],
    })),
    scoreRange: getScoreRange(scoreSummary),
    profileBalance: getProfileBalance(scoreSummary),
    dimensionLabels,
    answerPatterns: getAnswerPatterns(payload),
    questionLevelResponses: getQuestionLevelResponses(payload),
  };
}

function buildFallbackAiReport(
  payload: SubmissionPayload,
  scoreSummary: ScoreSummary,
  reportSummary: ReportSummary,
): AiAssessmentReport {
  const companyName = payload.respondent.companyName;
  const bottleneckLabels = scoreSummary.bottlenecks.map((dimension) => dimensionLabels[dimension]);
  const bandLabel = maturityBandLabel(scoreSummary.overallScore).toLowerCase();

  return {
    executiveSummary: `${companyName} completed the Organizational Maturity Assessment and achieved an overall score of ${scoreSummary.overallScore} out of 5, placing the organization in the ${bandLabel} range. ${reportSummary.summary}`,
    businessDiagnosis: `The results suggest that the business has a practical opportunity to improve execution consistency by focusing on the lowest-scoring capabilities first. The primary bottleneck area is ${bottleneckLabels.join(", ")}, which may be limiting pace, accountability, or the ability to scale improvement across the organization.`,
    dimensionAnalysis: DIMENSIONS.map((dimension) => ({
      dimension,
      score: scoreSummary.dimensionScores[dimension],
      insight: `${dimensionLabels[dimension]} scored ${scoreSummary.dimensionScores[dimension]} out of 5, indicating ${
        scoreSummary.bottlenecks.includes(dimension)
          ? "a priority area for near-term management attention."
          : "a capability area that should be maintained while the weakest areas are strengthened."
      }`,
      implication: scoreSummary.bottlenecks.includes(dimension)
        ? "If this area is not addressed, improvement initiatives may continue to face recurring friction, unclear ownership, or inconsistent follow-through."
        : "This area can support the improvement roadmap by providing stability while leadership focuses on the most constrained dimensions.",
    })),
    keyRisks: [
      "Improvement efforts may become fragmented if ownership and decision rights are not clarified.",
      "The lowest-scoring dimensions may continue to slow execution if they are treated as symptoms rather than operating constraints.",
      "Progress may be difficult to sustain without a simple review cadence and measurable 90-day priorities.",
    ],
    opportunities: [
      `Use ${bottleneckLabels[0]} as the first focused improvement sprint.`,
      "Turn the assessment results into a short leadership conversation about priorities, accountability, and cadence.",
      "Create a practical roadmap that links operating improvements to measurable business outcomes.",
    ],
    topPriorities: reportSummary.recommendations.slice(0, 4),
    roadmap: [
      {
        phase: "30 days",
        focus: "Align leadership on the highest-impact constraint.",
        actions: [
          "Review assessment results with the leadership team.",
          "Select one bottleneck dimension as the first improvement sprint.",
          "Define owners, success measures, and immediate blockers.",
        ],
      },
      {
        phase: "60 days",
        focus: "Create repeatable operating rhythm.",
        actions: [
          "Introduce a simple weekly or biweekly progress cadence.",
          "Track actions, decisions, blockers, and measurable outcomes.",
          "Adjust priorities based on evidence from the first sprint.",
        ],
      },
      {
        phase: "90 days",
        focus: "Scale what works and prepare the next improvement wave.",
        actions: [
          "Document lessons learned and repeatable practices.",
          "Extend the approach to the next bottleneck dimension.",
          "Agree the next 90-day transformation priorities.",
        ],
      },
    ],
    closingInsight:
      "The assessment is a starting point for focused action. The strongest next step is to convert the findings into a practical, time-bound improvement agenda.",
  };
}

function extractJsonObject(text: string) {
  const trimmed = text.trim();
  if (trimmed.startsWith("{") && trimmed.endsWith("}")) return trimmed;

  const start = trimmed.indexOf("{");
  const end = trimmed.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) {
    throw new Error("Gemini did not return a JSON object.");
  }

  return trimmed.slice(start, end + 1);
}

async function generateAiInsight(params: {
  apiKey: string;
  payload: SubmissionPayload;
  scoreSummary: ScoreSummary;
  reportSummary: ReportSummary;
}): Promise<AiReportResult> {
  const model = DEFAULT_AI_MODEL;

  try {
    if (!params.apiKey) {
      throw new Error("GEMINI_API_KEY is not configured.");
    }

    const ai = new GoogleGenAI({ apiKey: params.apiKey });
    const sanitizedContext = buildSanitizedAssessmentContext(params.payload, params.scoreSummary);
    const prompt = [
      "You are a senior business transformation consultant writing for Business Transformation.",
      "Business Transformation helps organizations improve strategy building, strategy execution, OKRs, operating discipline, agile delivery, operational excellence, data foundations for AI, and AI adoption/change.",
      "",
      "Create a concise, executive-ready organizational maturity assessment report from the structured assessment data below.",
      "",
      "The report should help a prospective client understand:",
      "1. their current organizational maturity level,",
      "2. what their results likely mean operationally,",
      "3. what strengths they can build on,",
      "4. what gaps may be limiting execution, growth, or scale,",
      "5. what practical options they have,",
      "6. what leadership actions they should consider next.",
      "",
      "Audience: a business leader, founder, executive, or senior manager who wants practical clarity, not a generic diagnostic.",
      "",
      "Tone: confident, direct, commercially practical, supportive, and executive-friendly.",
      "Use plain business language. Avoid hype, academic language, and vague transformation buzzwords.",
      "",
      "Rules:",
      "- Do not invent facts, financial data, headcount details, market claims, technologies, competitors, systems, industries, or scores.",
      "- Scores are deterministic and must be repeated exactly as provided.",
      "- Do not recalculate scores.",
      "- Do not claim benchmarks or peer comparisons unless they are explicitly provided.",
      "- Use the stated main challenge when present, but treat it as the respondent's perspective rather than a verified fact.",
      "- If the main challenge aligns with weak dimensions, explain the connection.",
      "- If the main challenge does not align with weak dimensions, mention that the assessment suggests additional areas to explore.",
      "- Do not overstate certainty. Use language such as 'suggests', 'may indicate', and 'is likely to'.",
      "",
      "Interpretation guidance:",
      "- Do more than summarize scores.",
      "- Identify the maturity pattern across dimensions.",
      "- Explain what is probably working well.",
      "- Explain what is probably creating friction or limiting maturity.",
      "- Connect weak dimensions to likely operational consequences.",
      "- Connect strong dimensions to practical advantages.",
      "- If the profile is uneven, explain why uneven maturity can create execution friction.",
      "",
      "Recommendation guidance:",
      "- Give practical leadership actions, not generic advice.",
      "- Prioritize the weakest dimensions while considering the full profile.",
      "- Include realistic options the client could pursue next.",
      "- Recommended options may include strategy clarification, OKR implementation, governance routines, operating model improvement, process discipline, agile delivery, operational excellence, data readiness, or AI adoption readiness.",
      "- Make the roadmap realistic for a 30/60/90 day leadership cadence.",
      "- Actions should be short, specific, and immediately understandable.",
      "",
      "Schema mapping:",
      "- Use executiveSummary for the overall maturity summary.",
      "- Use businessDiagnosis for the overall interpretation.",
      "- Use dimensionAnalysis for dimension-level insights and implications.",
      "- Use opportunities for practical strengths and options the client can build on.",
      "- Use topPriorities for improvement priorities.",
      "- Use roadmap for the 30/60/90 day leadership cadence.",
      "- Use closingInsight for a helpful, non-pushy consultation message.",
      "- Do not add fields that are not in the schema.",
      "",
      "Length control:",
      "- Executive summary: 3 to 5 sentences.",
      "- Overall interpretation: 3 to 5 sentences.",
      "- Dimension insights: 1 to 2 concise sentences each.",
      "- Strengths: maximum 3 items.",
      "- Improvement priorities: maximum 3 items.",
      "- Recommended options: 2 to 4 options.",
      "- Action items: short imperative statements.",
      "- Consultation message: 2 to 3 sentences, helpful and non-pushy.",
      "",
      "Return only valid JSON that matches the provided schema.",
      "Do not include markdown, commentary, code fences, or text outside the JSON.",
      "",
      JSON.stringify(sanitizedContext, null, 2),
    ].join("\n");

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        temperature: 0.4,
        maxOutputTokens: 3500,
        responseMimeType: "application/json",
        responseJsonSchema: aiResponseJsonSchema,
      },
    });

    const parsedJson = JSON.parse(extractJsonObject(response.text ?? ""));
    const parsedReport = aiAssessmentReportSchema.parse(parsedJson);

    return {
      status: "generated",
      model,
      report: parsedReport,
    };
  } catch (error) {
    return {
      status: "fallback",
      model,
      error: getSafeErrorMessage(error),
      report: buildFallbackAiReport(params.payload, params.scoreSummary, params.reportSummary),
    };
  }
}

function generatePdf(
  payload: SubmissionPayload,
  scoreSummary: ScoreSummary,
  aiReport: AiAssessmentReport,
  aiStatus: AiStatus,
) {
  return new Promise<Buffer>((resolve, reject) => {
    const doc = new PDFDocument({ size: "A4", margin: 42 });
    const chunks: Buffer[] = [];

    doc.on("data", (chunk: Buffer) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    drawCoverPage(doc, payload, scoreSummary, aiStatus);
    doc.addPage();
    drawScoreSnapshot(doc, scoreSummary, aiReport);
    doc.addPage();
    drawInsightPages(doc, scoreSummary, aiReport);
    doc.addPage();
    drawRoadmapAndClose(doc, aiReport);

    doc.end();
  });
}

function pageBounds(doc: PDFKit.PDFDocument) {
  const left = doc.page.margins.left;
  const right = doc.page.width - doc.page.margins.right;
  const top = doc.page.margins.top;
  const bottom = doc.page.height - doc.page.margins.bottom;
  return { left, right, top, bottom, width: right - left };
}

function addFooter(doc: PDFKit.PDFDocument) {
  const { left, right, bottom } = pageBounds(doc);
  doc
    .font("Helvetica")
    .fontSize(8)
    .fillColor(COLORS.muted)
    .text("Business Transformation Limited", left, bottom + 10)
    .text("Personalized Organizational Maturity Report", left, bottom + 10, {
      align: "right",
      width: right - left,
    });
}

function ensureSpace(doc: PDFKit.PDFDocument, neededHeight: number) {
  const { bottom } = pageBounds(doc);
  if (doc.y + neededHeight > bottom) {
    addFooter(doc);
    doc.addPage();
  }
}

function sectionTitle(doc: PDFKit.PDFDocument, title: string) {
  ensureSpace(doc, 46);
  const { left } = pageBounds(doc);
  doc.moveDown(0.4);
  doc
    .rect(left, doc.y + 6, 26, 3)
    .fill(COLORS.blue)
    .fillColor(COLORS.ink)
    .font("Helvetica-Bold")
    .fontSize(15)
    .text(title, left + 34, doc.y, { lineGap: 2 });
  doc.moveDown(0.7);
}

function paragraph(doc: PDFKit.PDFDocument, text: string, options: { fontSize?: number } = {}) {
  ensureSpace(doc, 76);
  const { left, width } = pageBounds(doc);
  doc
    .font("Helvetica")
    .fontSize(options.fontSize ?? 10)
    .fillColor(COLORS.ink)
    .text(text, left, doc.y, {
      width,
      lineGap: 4,
    });
  doc.moveDown(0.6);
}

function bulletList(doc: PDFKit.PDFDocument, items: string[], color = COLORS.blue) {
  const { left, width } = pageBounds(doc);
  items.forEach((item) => {
    ensureSpace(doc, 34);
    const y = doc.y + 4;
    doc.circle(left + 4, y + 3, 3).fill(color);
    doc
      .font("Helvetica")
      .fontSize(9.5)
      .fillColor(COLORS.ink)
      .text(item, left + 16, doc.y, { width: width - 16, lineGap: 3 });
    doc.moveDown(0.45);
  });
}

function drawScoreCard(
  doc: PDFKit.PDFDocument,
  x: number,
  y: number,
  width: number,
  label: string,
  value: string,
  accent: string,
) {
  doc.rect(x, y, width, 78).fill(COLORS.soft);
  doc.rect(x, y, 5, 78).fill(accent);
  doc
    .font("Helvetica")
    .fontSize(8)
    .fillColor(COLORS.muted)
    .text(label.toUpperCase(), x + 16, y + 16, { width: width - 28 });
  doc
    .font("Helvetica-Bold")
    .fontSize(18)
    .fillColor(COLORS.ink)
    .text(value, x + 16, y + 34, { width: width - 28 });
}

function drawScoreBar(
  doc: PDFKit.PDFDocument,
  label: string,
  score: number,
  x: number,
  y: number,
  width: number,
) {
  const barWidth = width - 118;
  const fillWidth = Math.max(8, (score / 5) * barWidth);
  doc
    .font("Helvetica")
    .fontSize(9)
    .fillColor(COLORS.ink)
    .text(label, x, y, { width: 108 });
  doc.rect(x + 114, y + 3, barWidth, 9).fill("#E6ECF5");
  doc.rect(x + 114, y + 3, fillWidth, 9).fill(scoreColor(score));
  doc
    .font("Helvetica-Bold")
    .fontSize(9)
    .fillColor(COLORS.ink)
    .text(`${score.toFixed(1)}/5`, x + 114 + barWidth + 8, y - 1, { width: 48 });
}

function drawCoverPage(
  doc: PDFKit.PDFDocument,
  payload: SubmissionPayload,
  scoreSummary: ScoreSummary,
  aiStatus: AiStatus,
) {
  const { left, top, width } = pageBounds(doc);
  const bandLabel = maturityBandLabel(scoreSummary.overallScore);
  const date = new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date());

  doc.rect(0, 0, doc.page.width, 255).fill(COLORS.navy);
  doc.rect(left, top + 16, 92, 5).fill(COLORS.sky);
  doc
    .font("Helvetica-Bold")
    .fontSize(13)
    .fillColor(COLORS.white)
    .text("BUSINESS TRANSFORMATION LIMITED", left, top + 34, { characterSpacing: 1.5 });
  doc
    .font("Helvetica-Bold")
    .fontSize(30)
    .fillColor(COLORS.white)
    .text("Personalized Organizational Maturity Report", left, top + 88, {
      width: width - 90,
      lineGap: 6,
    });
  doc
    .font("Helvetica")
    .fontSize(11)
    .fillColor("#D8E6FF")
    .text("Executive insight generated from your assessment results", left, top + 184, {
      width: width - 90,
    });

  doc.circle(left + 410, top + 104, 58).fill(COLORS.white);
  doc
    .font("Helvetica-Bold")
    .fontSize(30)
    .fillColor(scoreColor(scoreSummary.overallScore))
    .text(scoreSummary.overallScore.toFixed(1), left + 370, top + 84, {
      width: 80,
      align: "center",
    });
  doc
    .font("Helvetica")
    .fontSize(9)
    .fillColor(COLORS.muted)
    .text("out of 5", left + 370, top + 122, { width: 80, align: "center" });

  doc.y = 315;
  drawScoreCard(doc, left, doc.y, 162, "Prepared for", payload.respondent.companyName, COLORS.blue);
  drawScoreCard(doc, left + 176, doc.y, 162, "Maturity band", bandLabel, scoreColor(scoreSummary.overallScore));
  drawScoreCard(doc, left + 352, doc.y, 162, "Assessment", payload.surveyVersion.toUpperCase(), COLORS.navy);

  doc.y += 112;
  sectionTitle(doc, "Report context");
  paragraph(
    doc,
    `Prepared for ${payload.respondent.firstName} ${payload.respondent.lastName}, ${payload.respondent.jobTitle}, on ${date}. Industry: ${payload.respondent.industry}. Employee count band: ${payload.respondent.employeeCountBand}.`,
  );

  if (payload.respondent.mainChallenge) {
    sectionTitle(doc, "Stated business challenge");
    paragraph(doc, payload.respondent.mainChallenge);
  }

  doc
    .font("Helvetica")
    .fontSize(8.5)
    .fillColor(COLORS.muted)
    .text(
      aiStatus === "generated"
        ? "Insight sections were generated by AI from sanitized assessment data and deterministic scores."
        : "Insight sections use a deterministic fallback because AI insight generation was unavailable.",
      left,
      735,
      { width },
    );
  addFooter(doc);
}

function drawScoreSnapshot(
  doc: PDFKit.PDFDocument,
  scoreSummary: ScoreSummary,
  aiReport: AiAssessmentReport,
) {
  const { left, top, width } = pageBounds(doc);
  doc
    .font("Helvetica-Bold")
    .fontSize(22)
    .fillColor(COLORS.ink)
    .text("Score Snapshot", left, top);
  doc.moveDown(0.8);
  paragraph(doc, aiReport.executiveSummary, { fontSize: 10.5 });

  const scoreY = doc.y + 8;
  drawScoreCard(
    doc,
    left,
    scoreY,
    164,
    "Overall score",
    `${scoreSummary.overallScore.toFixed(1)} / 5`,
    scoreColor(scoreSummary.overallScore),
  );
  drawScoreCard(
    doc,
    left + 178,
    scoreY,
    164,
    "Maturity range",
    maturityBandLabel(scoreSummary.overallScore),
    COLORS.blue,
  );
  drawScoreCard(
    doc,
    left + 356,
    scoreY,
    164,
    "Primary bottlenecks",
    `${scoreSummary.bottlenecks.length}`,
    COLORS.amber,
  );

  doc.y = scoreY + 108;
  sectionTitle(doc, "Dimension dashboard");
  DIMENSIONS.forEach((dimension) => {
    drawScoreBar(
      doc,
      dimensionLabels[dimension],
      scoreSummary.dimensionScores[dimension],
      left,
      doc.y,
      width - 58,
    );
    doc.y += 28;
  });

  sectionTitle(doc, "Primary bottlenecks");
  bulletList(
    doc,
    scoreSummary.bottlenecks.map(
      (dimension) =>
        `${dimensionLabels[dimension]} scored ${scoreSummary.dimensionScores[dimension].toFixed(1)} out of 5 and should be treated as an early improvement focus.`,
    ),
    COLORS.amber,
  );
  addFooter(doc);
}

function drawInsightPages(
  doc: PDFKit.PDFDocument,
  scoreSummary: ScoreSummary,
  aiReport: AiAssessmentReport,
) {
  const { left, top, width } = pageBounds(doc);
  doc
    .font("Helvetica-Bold")
    .fontSize(22)
    .fillColor(COLORS.ink)
    .text("Business Analysis", left, top);
  doc.moveDown(0.8);

  sectionTitle(doc, "What appears to be happening");
  paragraph(doc, aiReport.businessDiagnosis, { fontSize: 10.5 });

  sectionTitle(doc, "Dimension-by-dimension insight");
  aiReport.dimensionAnalysis.forEach((analysis) => {
    ensureSpace(doc, 70);
    const y = doc.y;
    doc.rect(left, y, width, 58).fill(COLORS.soft);
    doc.rect(left, y, 4, 58).fill(scoreColor(scoreSummary.dimensionScores[analysis.dimension]));
    doc
      .font("Helvetica-Bold")
      .fontSize(10)
      .fillColor(COLORS.ink)
      .text(
        `${dimensionLabels[analysis.dimension]} - ${scoreSummary.dimensionScores[
          analysis.dimension
        ].toFixed(1)}/5`,
        left + 14,
        y + 10,
        { width: width - 28 },
      );
    doc
      .font("Helvetica")
      .fontSize(8.8)
      .fillColor(COLORS.ink)
      .text(`${analysis.insight} ${analysis.implication}`, left + 14, y + 27, {
        width: width - 28,
        lineGap: 2,
      });
    doc.y = y + 70;
  });

  sectionTitle(doc, "Key risks");
  bulletList(doc, aiReport.keyRisks, COLORS.red);

  sectionTitle(doc, "Improvement opportunities");
  bulletList(doc, aiReport.opportunities, COLORS.green);
  addFooter(doc);
}

function drawRoadmapAndClose(doc: PDFKit.PDFDocument, aiReport: AiAssessmentReport) {
  const { left, top, width } = pageBounds(doc);
  doc
    .font("Helvetica-Bold")
    .fontSize(22)
    .fillColor(COLORS.ink)
    .text("Recommended Action Plan", left, top);
  doc.moveDown(0.8);

  sectionTitle(doc, "Top priorities");
  bulletList(doc, aiReport.topPriorities, COLORS.blue);

  sectionTitle(doc, "30/60/90-day roadmap");
  aiReport.roadmap.forEach((item) => {
    ensureSpace(doc, 118);
    const y = doc.y;
    doc.rect(left, y, width, 98).fill(COLORS.soft);
    doc.rect(left, y, 70, 98).fill(COLORS.navy);
    doc
      .font("Helvetica-Bold")
      .fontSize(13)
      .fillColor(COLORS.white)
      .text(item.phase, left + 10, y + 38, { width: 50, align: "center" });
    doc
      .font("Helvetica-Bold")
      .fontSize(11)
      .fillColor(COLORS.ink)
      .text(item.focus, left + 84, y + 12, { width: width - 100 });
    doc
      .font("Helvetica")
      .fontSize(8.8)
      .fillColor(COLORS.ink)
      .text(item.actions.map((action) => `- ${action}`).join("\n"), left + 84, y + 33, {
        width: width - 100,
        lineGap: 3,
      });
    doc.y = y + 114;
  });

  sectionTitle(doc, "Closing insight");
  paragraph(doc, aiReport.closingInsight, { fontSize: 10.5 });

  ensureSpace(doc, 90);
  doc.rect(left, doc.y + 6, width, 72).fill(COLORS.navy);
  doc
    .font("Helvetica-Bold")
    .fontSize(14)
    .fillColor(COLORS.white)
    .text("Ready to turn this assessment into an execution roadmap?", left + 22, doc.y + 24, {
      width: width - 44,
    });
  doc
    .font("Helvetica")
    .fontSize(9.5)
    .fillColor("#D8E6FF")
    .text("Business Transformation Limited can help prioritize the next sprint and build the operating rhythm to deliver it.", left + 22, doc.y + 45, {
      width: width - 44,
    });
  addFooter(doc);
}

function getSafeErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  return "Unknown delivery error";
}

async function sendReportEmail(params: {
  apiKey: string;
  to: string;
  firstName: string;
  pdf: Buffer;
}) {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${params.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: REPORT_FROM_EMAIL,
      to: [params.to],
      bcc: [REPORT_BCC_EMAIL],
      subject: REPORT_SUBJECT,
      html: `<p>Dear ${params.firstName},</p><p>Thank you for completing the Organizational Maturity Assessment. Your personalized visual report is attached as a PDF.</p><p>Regards,<br/>Business Transformation Limited</p>`,
      text: `Dear ${params.firstName},\n\nThank you for completing the Organizational Maturity Assessment. Your personalized visual report is attached as a PDF.\n\nRegards,\nBusiness Transformation Limited`,
      attachments: [
        {
          filename: "personalized-assessment-report.pdf",
          content: params.pdf.toString("base64"),
        },
      ],
    }),
  });

  const result = (await response.json()) as {
    id?: string;
    message?: string;
    error?: string | { message?: string };
  };

  if (!response.ok) {
    const message =
      typeof result.error === "string"
        ? result.error
        : result.error?.message ?? result.message ?? "Resend email request failed.";
    throw new Error(message);
  }

  return result.id ?? null;
}

export const submitAssessment = onCall(
  {
    secrets: [RESEND_API_KEY, GEMINI_API_KEY],
    region: "us-central1",
  },
  async (request) => {
    const parsed = submissionSchema.safeParse(request.data);
    if (!parsed.success) {
      throw new HttpsError("invalid-argument", "Invalid assessment submission.");
    }

    const payload = parsed.data;
    if (payload.respondent.honeypot) {
      throw new HttpsError("invalid-argument", "Invalid assessment submission.");
    }

    const db = getFirestore(FIRESTORE_DATABASE_ID);
    const docRef = db.collection("assessmentSubmissions").doc();
    const now = FieldValue.serverTimestamp();
    const scoreSummary = scoreAssessment(payload);
    const reportSummary = buildReportSummary(payload, scoreSummary);

    await docRef.set({
      createdAt: now,
      updatedAt: now,
      surveyVersion: payload.surveyVersion,
      companySizeBand: payload.respondent.employeeCountBand,
      respondent: {
        firstName: payload.respondent.firstName,
        lastName: payload.respondent.lastName,
        workEmail: payload.respondent.workEmail,
        companyName: payload.respondent.companyName,
        jobTitle: payload.respondent.jobTitle,
        phoneCountryCode: payload.respondent.phoneCountryCode ?? "",
        phone: payload.respondent.phone ?? "",
        industry: payload.respondent.industry,
        employeeCountBand: payload.respondent.employeeCountBand,
        mainChallenge: payload.respondent.mainChallenge ?? "",
        consent: payload.respondent.consent,
      },
      answers: payload.answers,
      utmParams: payload.utmParams,
      referrer: payload.referrer,
      userAgent: payload.userAgent,
      emailStatus: "pending",
      scoreSummary,
      reportSummary,
      reportVersion: REPORT_VERSION,
    });

    try {
      const aiResult = await generateAiInsight({
        apiKey: GEMINI_API_KEY.value(),
        payload,
        scoreSummary,
        reportSummary,
      });

      await docRef.update({
        updatedAt: FieldValue.serverTimestamp(),
        aiStatus: aiResult.status,
        aiModel: aiResult.model,
        aiGeneratedAt: FieldValue.serverTimestamp(),
        aiError: aiResult.error ?? null,
        aiReport: aiResult.report,
        reportVersion: REPORT_VERSION,
      });

      const pdf = await generatePdf(payload, scoreSummary, aiResult.report, aiResult.status);
      const emailMessageId = await sendReportEmail({
        apiKey: RESEND_API_KEY.value(),
        to: payload.respondent.workEmail,
        firstName: payload.respondent.firstName,
        pdf,
      });

      await docRef.update({
        updatedAt: FieldValue.serverTimestamp(),
        emailStatus: "sent",
        emailProviderMessageId: emailMessageId,
        sentAt: FieldValue.serverTimestamp(),
      });

      return {
        submissionId: docRef.id,
        status: "sent",
      };
    } catch (error) {
      await docRef.update({
        updatedAt: FieldValue.serverTimestamp(),
        emailStatus: "failed",
        emailError: getSafeErrorMessage(error),
      });

      throw new HttpsError(
        "internal",
        "Assessment saved, but the report email could not be sent.",
      );
    }
  },
);
