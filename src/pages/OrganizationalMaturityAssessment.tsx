import React from "react";
import { Link } from "react-router-dom";
import { useAssessmentForm } from "../hooks/useAssessmentForm";
import { useLanguage } from "../context/LanguageContext";
import { motion, AnimatePresence } from "motion/react";
import { CheckCircle, ArrowRight, ArrowLeft, Loader2, Info } from "lucide-react";

const EMPLOYEE_BANDS = ["1–50", "51–200", "201–500", "501–2000", "2001+"];

export const OrganizationalMaturityAssessment: React.FC = () => {
  const {
    step,
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
  } = useAssessmentForm();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = form;
  const { t, isRtl } = useLanguage();
  const responseScale = [
    { value: 1, label: t("assessment.response1") },
    { value: 2, label: t("assessment.response2") },
    { value: 3, label: t("assessment.response3") },
    { value: 4, label: t("assessment.response4") },
    { value: 5, label: t("assessment.response5") },
  ];
  const industryOptions = [
    { value: "Technology", label: t("assessment.industryTechnology") },
    { value: "Retail", label: t("assessment.industryRetail") },
    { value: "Telecom", label: t("assessment.industryTelecom") },
    { value: "Manufacturing", label: t("assessment.industryManufacturing") },
    { value: "Finance", label: t("assessment.industryFinance") },
    { value: "Healthcare", label: t("assessment.industryHealthcare") },
    { value: "Other", label: t("assessment.industryOther") },
  ];

  const currentDimensionIndex = step - 1;
  const currentDimension = dimensions[currentDimensionIndex];
  const dimensionQuestions = survey.questions.filter(
    (q) => q.dimension === currentDimension
  );

  const isStepComplete = () => {
    if (step === 0) return true;
    if (step >= 1 && step <= dimensions.length) {
      return dimensionQuestions.every((q) => !!answers[q.id]);
    }
    if (step === leadCaptureStep) return true;
    return true;
  };

  const progress = (progressStep / totalSteps) * 100;
  const stepText = t("assessment.stepOf")
    .replace("{current}", String(progressStep))
    .replace("{total}", String(totalSteps));
  const nextLabel = isRtl ? (
    <>
      <ArrowLeft size={20} /> {t("assessment.next")}
    </>
  ) : (
    <>
      {t("assessment.next")} <ArrowRight size={20} />
    </>
  );
  const backLabel = isRtl ? (
    <>
      {t("assessment.back")} <ArrowRight size={20} />
    </>
  ) : (
    <>
      <ArrowLeft size={20} /> {t("assessment.back")}
    </>
  );

  return (
    <div className="min-h-screen bg-white pt-12 pb-24">
      <div className="max-w-4xl mx-auto px-4 md:px-8">
        {step < successStep && (
          <div className="mb-12">
            <div className="flex justify-between items-end mb-4">
              <div>
                <span className="text-xs font-bold tracking-widest uppercase text-swiss-blue">
                  {t("assessment.eyebrow")}
                </span>
                <h1 className="text-3xl md:text-4xl font-bold tracking-tighter mt-1">
                  {survey.title}
                </h1>
              </div>
              <div className="text-right hidden md:block">
                <span className="text-sm font-medium text-swiss-black/50">
                  {stepText}
                </span>
              </div>
            </div>
            <div className="h-1 w-full bg-swiss-gray rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-swiss-blue"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        )}

        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="prose prose-lg max-w-none">
                <p className="text-xl text-swiss-black/70 leading-relaxed">
                  {survey.description}
                </p>
                <div className="bg-swiss-gray/20 p-6 rounded-lg border-l-4 border-swiss-blue my-8">
                  <div className="flex gap-4">
                    <Info className="text-swiss-blue shrink-0" />
                    <div>
                      <h3 className="text-lg font-bold mb-2">
                        {t("assessment.whatYouWillReceive")}
                      </h3>
                      <p className="text-sm text-swiss-black/70">
                        {t("assessment.reportDelivery")}
                      </p>
                      <ul className="text-sm text-swiss-black/70 mt-2 list-disc pl-4">
                        <li>{t("assessment.reportPoint1")}</li>
                        <li>{t("assessment.reportPoint2")}</li>
                        <li>{t("assessment.reportPoint3")}</li>
                      </ul>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-swiss-black/50">
                  {t("assessment.estimatedTime")}: {survey.estimatedMinutes} minutes.
                </p>
              </div>

              <div className="flex flex-col gap-4">
                <label className="text-sm font-bold uppercase tracking-wider">
                  {t("assessment.selectVersion")}
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setVersion("smb")}
                    className={`p-6 text-left border-2 rounded transition-all ${
                      version === "smb"
                        ? "border-swiss-blue bg-swiss-blue/5"
                        : "border-swiss-gray hover:border-swiss-black/20"
                    }`}
                  >
                    <h4 className="font-bold mb-1">{t("assessment.smbTitle")}</h4>
                    <p className="text-xs text-swiss-black/60">
                      {t("assessment.smbDescription")}
                    </p>
                  </button>
                  <button
                    type="button"
                    onClick={() => setVersion("enterprise")}
                    className={`p-6 text-left border-2 rounded transition-all ${
                      version === "enterprise"
                        ? "border-swiss-blue bg-swiss-blue/5"
                        : "border-swiss-gray hover:border-swiss-black/20"
                    }`}
                  >
                    <h4 className="font-bold mb-1">
                      {t("assessment.enterpriseTitle")}
                    </h4>
                    <p className="text-xs text-swiss-black/60">
                      {t("assessment.enterpriseDescription")}
                    </p>
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={nextStep}
                className="w-full md:w-auto px-12 py-4 bg-swiss-blue text-white font-bold rounded hover:bg-swiss-blue/90 transition-colors flex items-center justify-center gap-2"
              >
                {isRtl ? (
                  <>
                    <ArrowLeft size={20} /> {t("assessment.start")}
                  </>
                ) : (
                  <>
                    {t("assessment.start")} <ArrowRight size={20} />
                  </>
                )}
              </button>
            </motion.div>
          )}

          {step >= 1 && step <= dimensions.length && (
            <motion.div
              key={`step-${step}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-12"
            >
              <div>
                <h2 className="text-2xl font-bold tracking-tight mb-2 capitalize">
                  {currentDimension.replace(/([A-Z])/g, " $1")}
                </h2>
                <div className="swiss-divider" />
              </div>

              <div className="space-y-12">
                {dimensionQuestions.map((q) => (
                  <div key={q.id} className="space-y-6">
                    <p className="text-lg font-medium leading-tight">
                      {q.text}
                    </p>
                    <div className="grid grid-cols-5 gap-2">
                      {responseScale.map((s) => (
                        <button
                          key={s.value}
                          type="button"
                          onClick={() => handleAnswer(q.id, s.value)}
                          aria-label={`${q.text} - ${s.label}`}
                          className={`flex flex-col items-center gap-2 p-3 rounded transition-all border ${
                            answers[q.id] === s.value
                              ? "bg-swiss-blue border-swiss-blue text-white"
                              : "bg-white border-swiss-gray hover:border-swiss-black/20"
                          }`}
                        >
                          <span className="text-lg font-bold">{s.value}</span>
                          <span className="text-[10px] text-center leading-tight opacity-70 hidden md:block">
                            {s.label}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-between pt-8">
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-6 py-3 border border-swiss-black/20 font-bold rounded hover:border-swiss-black transition-colors flex items-center gap-2"
                >
                  {backLabel}
                </button>
                <button
                  type="button"
                  onClick={nextStep}
                  disabled={!isStepComplete()}
                  className="px-12 py-3 bg-swiss-blue text-white font-bold rounded hover:bg-swiss-blue/90 transition-colors disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {nextLabel}
                </button>
              </div>
            </motion.div>
          )}

          {step === leadCaptureStep && (
            <motion.div
              key="lead-capture"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-2xl font-bold tracking-tight mb-2">
                  {t("assessment.almostThere")}
                </h2>
                <p className="text-swiss-black/70">
                  {t("assessment.detailsPrompt")}
                </p>
                <div className="swiss-divider mt-4" />
              </div>

              <form onSubmit={handleSubmit((data) => submitAssessment(data))} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-2">{t("assessment.firstName")} *</label>
                    <input
                      {...register("firstName")}
                      autoComplete="given-name"
                      className="w-full p-3 border border-swiss-gray rounded focus:border-swiss-blue outline-none transition-colors"
                    />
                    {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName.message}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-2">{t("assessment.lastName")} *</label>
                    <input
                      {...register("lastName")}
                      autoComplete="family-name"
                      className="w-full p-3 border border-swiss-gray rounded focus:border-swiss-blue outline-none transition-colors"
                    />
                    {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName.message}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-2">{t("assessment.workEmail")} *</label>
                    <input
                      {...register("workEmail")}
                      type="email"
                      autoComplete="email"
                      className="w-full p-3 border border-swiss-gray rounded focus:border-swiss-blue outline-none transition-colors"
                    />
                    {errors.workEmail && <p className="text-red-500 text-xs mt-1">{errors.workEmail.message}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-2">{t("assessment.companyName")} *</label>
                    <input
                      {...register("companyName")}
                      autoComplete="organization"
                      className="w-full p-3 border border-swiss-gray rounded focus:border-swiss-blue outline-none transition-colors"
                    />
                    {errors.companyName && <p className="text-red-500 text-xs mt-1">{errors.companyName.message}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-2">{t("assessment.jobTitle")} *</label>
                    <input
                      {...register("jobTitle")}
                      autoComplete="organization-title"
                      className="w-full p-3 border border-swiss-gray rounded focus:border-swiss-blue outline-none transition-colors"
                    />
                    {errors.jobTitle && <p className="text-red-500 text-xs mt-1">{errors.jobTitle.message}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-2">{t("assessment.industry")} *</label>
                    <select
                      {...register("industry")}
                      className="w-full p-3 border border-swiss-gray rounded focus:border-swiss-blue outline-none transition-colors bg-white"
                    >
                      <option value="">{t("assessment.selectIndustry")}</option>
                      {industryOptions.map((industry) => (
                        <option key={industry.value} value={industry.value}>
                          {industry.label}
                        </option>
                      ))}
                    </select>
                    {errors.industry && <p className="text-red-500 text-xs mt-1">{errors.industry.message}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-2">{t("assessment.employeeCount")} *</label>
                    <select
                      {...register("employeeCountBand")}
                      className="w-full p-3 border border-swiss-gray rounded focus:border-swiss-blue outline-none transition-colors bg-white"
                    >
                      <option value="">{t("assessment.selectSize")}</option>
                      {EMPLOYEE_BANDS.map(band => (
                        <option key={band} value={band}>{band}</option>
                      ))}
                    </select>
                    {errors.employeeCountBand && <p className="text-red-500 text-xs mt-1">{errors.employeeCountBand.message}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-2">{t("assessment.phoneOptional")}</label>
                    <input
                      {...register("phone")}
                      type="tel"
                      autoComplete="tel"
                      className="w-full p-3 border border-swiss-gray rounded focus:border-swiss-blue outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-2">{t("assessment.mainChallenge")}</label>
                  <textarea
                    {...register("mainChallenge")}
                    rows={3}
                    className="w-full p-3 border border-swiss-gray rounded focus:border-swiss-blue outline-none transition-colors"
                    placeholder={t("assessment.challengePlaceholder")}
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="consent"
                      {...register("consent")}
                      className="mt-1"
                    />
                    <label htmlFor="consent" className="text-sm text-swiss-black/70">
                      {t("assessment.consent")}
                    </label>
                  </div>
                  {errors.consent && <p className="text-red-500 text-xs">{errors.consent.message}</p>}
                </div>

                {/* Honeypot */}
                <input type="text" {...register("honeypot")} className="hidden" />

                {error && (
                  <div className="p-4 bg-red-50 text-red-600 text-sm rounded border border-red-100">
                    {error}
                  </div>
                )}

                <div className="flex justify-between pt-8">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="px-6 py-3 border border-swiss-black/20 font-bold rounded hover:border-swiss-black transition-colors flex items-center gap-2"
                  >
                    {backLabel}
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-12 py-3 bg-swiss-blue text-white font-bold rounded hover:bg-swiss-blue/90 transition-colors disabled:opacity-50 flex items-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="animate-spin" size={20} /> {t("assessment.processing")}
                      </>
                    ) : (
                      isRtl ? (
                        <>
                          <ArrowLeft size={20} /> {t("assessment.submit")}
                        </>
                      ) : (
                        <>
                          {t("assessment.submit")} <ArrowRight size={20} />
                        </>
                      )
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {step === successStep && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12 space-y-8"
            >
              <div className="flex justify-center">
                <div className="w-20 h-20 bg-swiss-blue/10 rounded-full flex items-center justify-center text-swiss-blue">
                  <CheckCircle size={48} />
                </div>
              </div>
              <div className="space-y-4">
                <h2 className="text-4xl font-bold tracking-tighter">{t("assessment.submitted")}</h2>
                <p className="text-xl text-swiss-black/70 max-w-2xl mx-auto leading-relaxed">
                  {t("assessment.successPrefix")}{" "}
                  <span className="font-bold text-swiss-black">
                    {watch("workEmail")}
                  </span>
                  {" "}{t("assessment.successSuffix")}
                </p>
              </div>
              <div className="pt-8">
                <Link
                  to="/"
                  className="inline-flex items-center justify-center px-8 py-4 bg-swiss-blue text-white font-bold rounded hover:bg-swiss-blue/90 transition-colors"
                >
                  {t("assessment.returnHome")}
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
