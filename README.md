# Business Transformation Website

Public website for Business Transformation Limited, including the Organizational Maturity Assessment and the backend workflow that stores submissions, generates a personalized visual PDF report, and emails it to the prospective client.

## What This App Includes

- React 19 + Vite frontend with English/Arabic content.
- Public pages for Home, Services, Training, About, Contact, and Assessment.
- Firebase callable Function `submitAssessment` for secure assessment processing.
- Firestore persistence in the `assessmentSubmissions` collection.
- Server-side scoring across six business maturity dimensions.
- Gemini-powered executive insight generation using sanitized assessment data.
- Visual PDF report generation with PDFKit.
- Resend email delivery with the report attached as a PDF and `deamjad@gmail.com` BCC'd.
- GitHub Actions static build deployment to the `deploy` branch for Hostinger.

## Project Structure

```text
src/                 Frontend React app
src/pages/           Route-level pages
src/hooks/           Assessment form state and submission flow
src/types/           Assessment data models and survey definitions
functions/           Firebase Functions backend
public/              Static assets copied into the Vite build
.github/workflows/   GitHub Actions deployment workflow
```

## Local Setup

Prerequisites:

- Node.js 20 or later
- npm
- Firebase CLI access for backend deployment
- GitHub CLI access for pushing to the repository

Install dependencies:

```bash
npm install
npm --prefix functions install
```

Create a local `.env` file from `.env.example` and fill in local-only values:

```bash
cp .env.example .env
```

Important: `.env` is ignored by Git. Do not commit API keys or secrets.

Run the frontend locally:

```bash
npm run dev
```

Build the frontend:

```bash
npm run build
```

Run TypeScript checks:

```bash
npm run lint
npm run functions:build
```

## Required Configuration

Frontend Firebase config lives in `src/lib/firebase.ts`.

Firebase project:

```text
gen-lang-client-0571835802
```

Firestore database:

```text
ai-studio-670aaabe-4bc0-4524-9b39-588e755821ca
```

Firebase Functions secrets:

```bash
npx firebase-tools functions:secrets:set RESEND_API_KEY --project gen-lang-client-0571835802
npx firebase-tools functions:secrets:set GEMINI_API_KEY --project gen-lang-client-0571835802
```

Runtime/env settings:

- `AI_MODEL`: defaults to `gemini-2.5-flash`
- `REPORT_FROM_EMAIL`: verified Resend sender, for example `Business Transformation <reports@btransform.biz>`
- `REPORT_BCC_EMAIL`: defaults to `deamjad@gmail.com`
- `FIRESTORE_DATABASE_ID`: defaults to `ai-studio-670aaabe-4bc0-4524-9b39-588e755821ca`

## Assessment Workflow

1. Visitor completes `/organizational-maturity-assessment`.
2. Frontend validates the form and calls Firebase callable Function `submitAssessment`.
3. Function validates the payload again server-side.
4. Function stores the submission in Firestore with `emailStatus: "pending"`.
5. Function calculates deterministic scores and bottleneck dimensions.
6. Function sends sanitized assessment context to Gemini for executive insight generation.
7. If Gemini fails, the Function creates a deterministic fallback insight report.
8. Function generates a branded visual PDF report server-side.
9. Function emails the PDF to the respondent through Resend and BCCs `deamjad@gmail.com`.
10. Function updates Firestore with email and AI/report metadata.

The email subject is fixed:

```text
Personalized Assessment Report from Business Transformation Limited
```

## Deployment

### Static Website

Pushes to `main` trigger `.github/workflows/deploy.yml`.

The workflow:

1. Installs frontend dependencies.
2. Runs `npm run build`.
3. Publishes the generated `dist` folder to the `deploy` branch.

Hostinger is configured to pull the `deploy` branch into the hosting space for `btransform.biz`.

### Firebase Functions

Deploy the backend separately:

```bash
npx firebase-tools deploy --only functions --project gen-lang-client-0571835802
```

Current Function:

```text
submitAssessment
Region: us-central1
Runtime: nodejs20
Trigger: callable
```

Note: Firebase has warned that Node.js 20 runtime support is being deprecated, so the Functions runtime should be upgraded in a follow-up maintenance task.

## Useful Commands

```bash
npm run dev
npm run build
npm run lint
npm run functions:build
npx firebase-tools functions:list --project gen-lang-client-0571835802
npx firebase-tools functions:log --only submitAssessment --project gen-lang-client-0571835802 --lines 30
git push origin main
gh run list --limit 5
```

## Security Notes

- Never expose `RESEND_API_KEY` or `GEMINI_API_KEY` in frontend code.
- Keep `.env` local only.
- Assessment email delivery must stay server-side.
- Gemini receives sanitized business assessment context only, not email addresses or phone numbers.
- Firestore should remain locked down so public clients cannot create arbitrary report/email records.
