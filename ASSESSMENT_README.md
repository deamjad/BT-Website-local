# Organizational Maturity Assessment

This feature allows prospective clients to evaluate their organizational maturity across 6 dimensions.

## Route
- `/organizational-maturity-assessment`

## Implementation Details
- **Survey Config**: Located in `src/types/surveyDefinitions.ts`. It contains the questions and metadata for both SMB and Enterprise versions.
- **Persistence**: Submissions are stored in Firebase Firestore in the `assessmentSubmissions` collection.
- **Backend Processing**: `functions/src/index.ts` receives submissions, calculates scores, generates a PDF report, sends email through Resend, and updates delivery status.
- **Data Model**: Defined in `src/types/assessment.ts`.
- **Validation**: Client-side validation uses Zod and React Hook Form (`src/lib/assessmentValidation.ts`). The Firebase Function validates again server-side.
- **State Management**: Custom hook `useAssessmentForm.ts` handles multi-step logic, auto-saving to `localStorage`, and submission to the Firebase Function.
- **Email Delivery**: The report email is sent to the respondent with `deamjad@gmail.com` BCC'd. The subject is `Personalized Assessment Report from Business Transformation Limited`.

## Required Runtime Configuration
- `RESEND_API_KEY`: Resend API key, configured as a Firebase Functions secret.
- `REPORT_FROM_EMAIL`: Verified Resend sender, for example `Business Transformation <reports@btransform.biz>`.
- `REPORT_BCC_EMAIL`: Internal report copy address. Defaults to `deamjad@gmail.com`.
- `FIRESTORE_DATABASE_ID`: Firestore database ID. Defaults to `ai-studio-670aaabe-4bc0-4524-9b39-588e755821ca`.

## Next Steps
1. **Deploy Functions**: Run `firebase login`, set `RESEND_API_KEY`, then deploy the `submitAssessment` function.
2. **Firestore Rules**: Lock down direct client writes to `assessmentSubmissions` now that submissions go through the backend.
3. **AI Report Generation**: Optionally integrate Gemini API later to generate personalized narrative insights based on scores and the main challenge.
4. **Admin Dashboard**: Create a protected route to view and manage submissions.
