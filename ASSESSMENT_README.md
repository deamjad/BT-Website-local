# Organizational Maturity Assessment

This feature allows prospective clients to evaluate their organizational maturity across 6 dimensions.

## Route
- `/organizational-maturity-assessment`

## Implementation Details
- **Survey Config**: Located in `src/types/surveyDefinitions.ts`. It contains the questions and metadata for both SMB and Enterprise versions.
- **Persistence**: Submissions are stored in Firebase Firestore in the `assessmentSubmissions` collection.
- **Backend Processing**: `functions/src/index.ts` receives submissions, calculates scores, generates Gemini-powered insight from sanitized data, creates a visual PDF report, sends email through Resend, and updates delivery status.
- **Data Model**: Defined in `src/types/assessment.ts`.
- **Validation**: Client-side validation uses Zod and React Hook Form (`src/lib/assessmentValidation.ts`). The Firebase Function validates again server-side.
- **State Management**: Custom hook `useAssessmentForm.ts` handles multi-step logic, auto-saving to `localStorage`, and submission to the Firebase Function.
- **Email Delivery**: The report email is sent to the respondent with `deamjad@gmail.com` BCC'd. The subject is `Personalized Assessment Report from Business Transformation Limited`.
- **AI Insight**: Gemini generates narrative sections such as executive summary, business diagnosis, risks, opportunities, priorities, and a 30/60/90-day roadmap. If Gemini fails, the backend sends a deterministic fallback report.

## Required Runtime Configuration
- `RESEND_API_KEY`: Resend API key, configured as a Firebase Functions secret.
- `GEMINI_API_KEY`: Gemini API key, configured as a Firebase Functions secret.
- `AI_MODEL`: Gemini model name. Defaults to `gemini-2.5-flash`.
- `REPORT_FROM_EMAIL`: Verified Resend sender, for example `Business Transformation <reports@btransform.biz>`.
- `REPORT_BCC_EMAIL`: Internal report copy address. Defaults to `deamjad@gmail.com`.
- `FIRESTORE_DATABASE_ID`: Firestore database ID. Defaults to `ai-studio-670aaabe-4bc0-4524-9b39-588e755821ca`.

## Next Steps
1. **Firestore Rules**: Lock down direct client writes to `assessmentSubmissions` now that submissions go through the backend.
2. **Runtime Upgrade**: Upgrade Firebase Functions from Node.js 20 before runtime decommissioning.
3. **Admin Dashboard**: Create a protected route to view and manage submissions.
4. **Report Storage**: Optionally store generated PDF copies in Cloud Storage for internal retrieval.
