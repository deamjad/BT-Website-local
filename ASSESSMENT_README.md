# Organizational Maturity Assessment

This feature allows prospective clients to evaluate their organizational maturity across 6 dimensions.

## Route
- `/organizational-maturity-assessment`

## Implementation Details
- **Survey Config**: Located in `src/types/surveyDefinitions.ts`. It contains the questions and metadata for both SMB and Enterprise versions.
- **Persistence**: Submissions are stored in Firebase Firestore in the `assessmentSubmissions` collection.
- **Data Model**: Defined in `src/types/assessment.ts`.
- **Validation**: Client-side validation using Zod and React Hook Form (`src/lib/assessmentValidation.ts`).
- **State Management**: Custom hook `useAssessmentForm.ts` handles multi-step logic, auto-saving to `localStorage`, and submission to Firestore.

## Next Steps
1. **Scoring Logic**: Implement a cloud function or server-side logic to calculate scores based on the `answers` map.
2. **AI Report Generation**: Integrate with Gemini API to generate personalized insights based on the scores and the "main challenge" provided.
3. **Email Delivery**: Connect to an email service (e.g., SendGrid, Postmark) to deliver the generated report to the respondent's `workEmail`.
4. **Admin Dashboard**: Create a protected route to view and manage submissions.
