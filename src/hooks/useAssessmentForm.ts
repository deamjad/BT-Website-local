import { useState, useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { respondentSchema, RespondentFormData } from "../lib/assessmentValidation";
import { SURVEY_CONFIG } from "../types/surveyDefinitions";
import { db } from "../lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { AssessmentSubmission } from "../types/assessment";

const STORAGE_KEY = "btransform_assessment_draft_v2";
const ENTERPRISE_BANDS = new Set(["501–2000", "2001+"]);
const SMB_BANDS = new Set(["1–50", "51–200", "201–500"]);

const getUtmParams = () => {
  if (typeof window === "undefined") {
    return {};
  }

  const searchParams = new URLSearchParams(window.location.search);
  const utmEntries = Array.from(searchParams.entries()).filter(([key]) =>
    key.startsWith("utm_"),
  );

  return Object.fromEntries(utmEntries);
};

export function useAssessmentForm() {
  const [step, setStep] = useState(0);
  const [version, setVersion] = useState<"smb" | "enterprise">("smb");
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<RespondentFormData>({
    resolver: zodResolver(respondentSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      workEmail: "",
      companyName: "",
      jobTitle: "",
      industry: "",
      employeeCountBand: "",
      phone: "",
      mainChallenge: "",
      consent: false,
      honeypot: "",
    },
  });

  const employeeCount = useWatch({
    control: form.control,
    name: "employeeCountBand",
  });
  const respondentValues = useWatch({ control: form.control });

  const survey = SURVEY_CONFIG[version];
  const dimensions = survey.dimensions;
  const leadCaptureStep = dimensions.length + 1;
  const successStep = dimensions.length + 2;
  const totalSteps = successStep;
  const progressStep = Math.min(step + 1, totalSteps);

  // Auto-switch version based on employee count
  useEffect(() => {
    if (ENTERPRISE_BANDS.has(employeeCount)) {
      setVersion("enterprise");
    } else if (SMB_BANDS.has(employeeCount)) {
      setVersion("smb");
    }
  }, [employeeCount]);

  // Load draft
  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const {
          step: savedStep,
          version: savedVersion,
          answers: savedAnswers,
          respondent,
        } = JSON.parse(saved);
        const safeVersion =
          savedVersion === "enterprise" ? "enterprise" : "smb";

        setStep(
          Number.isInteger(savedStep)
            ? Math.min(Math.max(savedStep, 0), successStep - 1)
            : 0,
        );
        setVersion(safeVersion);
        setAnswers(
          savedAnswers && typeof savedAnswers === "object" ? savedAnswers : {},
        );
        form.reset(respondent);
      } catch (e) {
        console.error("Failed to load draft", e);
      }
    }
  }, [form, successStep]);

  // Save draft
  useEffect(() => {
    if (step < successStep) {
      const draft = {
        step,
        version,
        answers,
        respondent: respondentValues,
      };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
    }
  }, [step, version, answers, respondentValues, successStep]);

  const nextStep = () => setStep((s) => Math.min(s + 1, successStep));
  const prevStep = () => setStep((s) => Math.max(s - 1, 0));

  const handleAnswer = (questionId: string, value: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const submitAssessment = async (data: RespondentFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const submission: AssessmentSubmission = {
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        surveyVersion: version,
        companySizeBand: data.employeeCountBand,
        respondent: {
          firstName: data.firstName,
          lastName: data.lastName,
          workEmail: data.workEmail,
          companyName: data.companyName,
          jobTitle: data.jobTitle,
          phone: data.phone,
          industry: data.industry,
          employeeCountBand: data.employeeCountBand,
          mainChallenge: data.mainChallenge,
          consent: data.consent,
        },
        answers,
        utmParams: getUtmParams(),
        referrer: document.referrer,
        userAgent: navigator.userAgent,
        emailStatus: "pending",
        scoreSummary: null,
        aiReport: null,
      };

      await addDoc(collection(db, "assessmentSubmissions"), submission);
      
      window.localStorage.removeItem(STORAGE_KEY);
      setStep(successStep);
    } catch (err) {
      console.error("Submission error", err);
      setError("Failed to submit assessment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    step,
    setStep,
    version,
    setVersion,
    answers,
    handleAnswer,
    form,
    isSubmitting,
    error,
    nextStep,
    prevStep,
    submitAssessment,
    survey,
    dimensions,
    totalSteps,
    leadCaptureStep,
    successStep,
    progressStep,
  };
}
