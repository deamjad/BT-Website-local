import { initializeApp } from "firebase-admin/app";
import { FieldValue, getFirestore } from "firebase-admin/firestore";
import { HttpsError, onCall } from "firebase-functions/https";
import { defineSecret } from "firebase-functions/params";
import PDFDocument from "pdfkit";
import { z } from "zod";

initializeApp();

const RESEND_API_KEY = defineSecret("RESEND_API_KEY");
const FIRESTORE_DATABASE_ID =
  process.env.FIRESTORE_DATABASE_ID ?? "ai-studio-670aaabe-4bc0-4524-9b39-588e755821ca";
const REPORT_FROM_EMAIL =
  process.env.REPORT_FROM_EMAIL ?? "Business Transformation <onboarding@resend.dev>";
const REPORT_BCC_EMAIL = process.env.REPORT_BCC_EMAIL ?? "deamjad@gmail.com";
const REPORT_SUBJECT = "Personalized Assessment Report from Business Transformation Limited";

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

type SubmissionPayload = z.infer<typeof submissionSchema>;

interface ScoreSummary {
  overallScore: number;
  dimensionScores: Record<Dimension, number>;
  bottlenecks: Dimension[];
}

interface ReportSummary {
  summary: string;
  recommendations: string[];
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

function generatePdf(
  payload: SubmissionPayload,
  scoreSummary: ScoreSummary,
  reportSummary: ReportSummary,
) {
  return new Promise<Buffer>((resolve, reject) => {
    const doc = new PDFDocument({ size: "A4", margin: 50 });
    const chunks: Buffer[] = [];

    doc.on("data", (chunk: Buffer) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    doc.font("Helvetica-Bold").fontSize(22).text("Business Transformation Limited");
    doc.moveDown(0.4);
    doc.fontSize(18).text("Personalized Organizational Maturity Report");
    doc.moveDown();

    doc.font("Helvetica").fontSize(11);
    doc.text(`Prepared for: ${payload.respondent.firstName} ${payload.respondent.lastName}`);
    doc.text(`Company: ${payload.respondent.companyName}`);
    doc.text(`Assessment version: ${payload.surveyVersion.toUpperCase()}`);
    doc.text(`Overall maturity score: ${scoreSummary.overallScore} / 5`);
    doc.moveDown();

    doc.font("Helvetica-Bold").fontSize(14).text("Executive Summary");
    doc.moveDown(0.4);
    doc.font("Helvetica").fontSize(11).text(reportSummary.summary, { lineGap: 4 });
    doc.moveDown();

    doc.font("Helvetica-Bold").fontSize(14).text("Dimension Scores");
    doc.moveDown(0.4);
    DIMENSIONS.forEach((dimension) => {
      doc
        .font("Helvetica")
        .fontSize(11)
        .text(`${dimensionLabels[dimension]}: ${scoreSummary.dimensionScores[dimension]} / 5`);
    });
    doc.moveDown();

    doc.font("Helvetica-Bold").fontSize(14).text("Primary Bottlenecks");
    doc.moveDown(0.4);
    scoreSummary.bottlenecks.forEach((dimension) => {
      doc.font("Helvetica").fontSize(11).text(`- ${dimensionLabels[dimension]}`);
    });
    doc.moveDown();

    doc.font("Helvetica-Bold").fontSize(14).text("Recommended Next Steps");
    doc.moveDown(0.4);
    reportSummary.recommendations.forEach((recommendation) => {
      doc.font("Helvetica").fontSize(11).text(`- ${recommendation}`, { lineGap: 4 });
    });

    doc.moveDown();
    doc
      .fontSize(9)
      .fillColor("#555555")
      .text("This report is based on the assessment responses submitted online.", {
        align: "left",
      });

    doc.end();
  });
}

function getSafeErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  return "Unknown email delivery error";
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
      html: `<p>Dear ${params.firstName},</p><p>Thank you for completing the Organizational Maturity Assessment. Your personalized report is attached as a PDF.</p><p>Regards,<br/>Business Transformation Limited</p>`,
      text: `Dear ${params.firstName},\n\nThank you for completing the Organizational Maturity Assessment. Your personalized report is attached as a PDF.\n\nRegards,\nBusiness Transformation Limited`,
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
    secrets: [RESEND_API_KEY],
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
    });

    try {
      const pdf = await generatePdf(payload, scoreSummary, reportSummary);
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
