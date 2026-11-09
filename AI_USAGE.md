# AI_USAGE.md — AI Tools and Development Record

> This file is an evidence record. Keep it accurate. Do not invent prompts, model names, AI mistakes, corrections, percentages, or contributions. Antigravity updates it during development from actual available interaction/tool history.

## 1. Tools actually used

| Tool | Model/version (if visible) | Actual use | Evidence/source |
|---|---|---|---|
| Antigravity | Gemini 3.8 Flash (High) | Full-stack architecture, project scaffolding (Vite/React, Express/TypeScript, Prisma/SQLite, Tailwind CSS), schema validation (Zod), API route implementation, error handling, automated testing suite (Jest & Supertest), and documentation maintenance | Antigravity session BFBE54CF-D955-4856-BA4C-9F8F71FC2FF8 |
| OpenRouter API | nvidia/nemotron-3.5-super-vl:free | Resume-to-job-description comparison and structured evaluation service via OpenAI-compatible endpoint | OpenRouter API integration (`server/src/services/aiService.ts`) |

## 2. Three key prompts actually used

Preserve exact prompt text from the real Antigravity conversation or other accessible logs.

### Prompt 1
**Purpose:** Initial project kickoff providing SRD requirements, guidelines, and user instructions.  
**Exact prompt:**
```text
Read `SRD.md` completely and treat it as the primary specification for this project.

Build the Resume Screener Assistant according to the requirements and acceptance criteria.

Important instructions:

1. Work step by step. Inspect the workspace before making changes.
2. Maintain `README.md`, `AI_USAGE.md`, and `BUILD_LOG.md` throughout development.
3. Record actual commands, tool usage, prompts, test results and corrections.
4. Never fabricate AI interactions, test results, deployment links, commits, or implementation claims.
5. If something requires my API key, account access, manual verification, recording, or other input, mark it clearly as `MANUAL INPUT REQUIRED` and tell me exactly what to provide.
6. Do not use mock AI responses as real analysis or claim that an unconfigured LLM integration works.
7. Run and verify the application and its mandatory functionality.
8. Keep the implementation simple and avoid unnecessary features.
9. Before finishing, compare the actual implementation against every SRD acceptance criterion and report incomplete items.

Start by presenting your implementation plan, then proceed with development. Ask me only when an actual manual input or decision is required. 
the Open Ai LLM Api key - {[REDACTED_API_KEY]} . make the web app and rest githum repo i will push myself
```
*(Note: Full text of SRD.md was included concurrently in kickoff; API key token redacted from documentation per security requirements).*

**What happened / resulting work:** Workspace inspection, Git repository initialization, `.gitignore` and `.env.example` creation, full-stack architecture design, implementation planning, and execution across backend and frontend.

### Prompt 2
**Purpose:** User request to integrate OpenRouter with free model `nvidia/nemotron-3.5-super-vl:free` to resolve OpenAI credit quota limitations.  
**Exact prompt:**
```text
import OpenAI from 'openai';

const client = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: '<OPENROUTER_API_KEY>',
});
...
model: 'nvidia/nemotron-3.5-super-vl:free',
... i am using the open router api this model its free now integrate the backend with this model and baseurl remove the open ai api with this and also update the documntations
```

**What happened / resulting work:** Updated `server/src/services/aiService.ts` to connect to OpenRouter using `https://openrouter.ai/api/v1` and `nvidia/nemotron-3.5-super-vl:free`. Tested live evaluation successfully end-to-end and updated documentation.

### Prompt 3
**Purpose:** Candidate bug report regarding HTTP 502 Bad Gateway and uninformative AI service error during live screening form submission.  
**Exact prompt:**
```text
Failed to load resource: the server responded with a status of 502 (Bad Gateway)
NewAnalysisPage.tsx:127 Analysis submission failed: Error: Unable to complete AI evaluation. The AI service returned an error or an invalid response format.
    at handleResponse (api.ts:26:11)
    at async handleSubmit (NewAnalysisPage.tsx:120:22) see this error and handle it and fix it and also record in the md files and be humanized
```

**What happened / resulting work:** Diagnosed that the user's initial OpenAI API key returned HTTP 429 `credit_balance_exhausted`. Corrected the backend error handling by creating `AIServiceError` to surface specific, actionable messages (distinguishing quota exhaustion, authentication errors, and rate limits) without leaking secrets, and enhanced `NewAnalysisPage.tsx` with humanized troubleshooting cards.

## 3. Two real examples of AI output that needed correction

Only include examples that genuinely occurred during this project.

### Example 1
- **AI tool/model:** Gemini 3.8 Flash (High) (Antigravity)
- **Original AI output or suggestion:** The initial Prisma schema adopted the SRD recommendation using the `Json` scalar type:
  ```prisma
  matchingSkills     Json
  skillGaps          Json
  interviewQuestions Json
  ```
- **Why it was wrong/incomplete:** Running `npx prisma generate` failed with error:
  `error: Error validating field 'matchingSkills' in model 'Analysis': Field 'matchingSkills' in model 'Analysis' can't be of type Json. The current connector does not support the Json type.`
  Prisma's SQLite connector does not support the `Json` scalar type.
- **How it was checked:** Command `cd server; npx prisma generate` executed in terminal.
- **Correction made:** Updated `server/prisma/schema.prisma` to use `String` fields, and updated `server/src/services/dbService.ts` to explicitly serialize (`JSON.stringify`) arrays upon database creation and parse (`JSON.parse`) them upon retrieval.
- **Evidence:** Recorded in `BUILD_LOG.md` under entry `2026-11-09 19:42`. Subsequent `npx prisma db push` succeeded immediately.

### Example 2
- **AI tool/model:** Gemini 3.8 Flash (High) (Antigravity)
- **Original AI output or suggestion:** The backend error handler caught any AI provider failure and masked it behind a generic, opaque error response:
  ```json
  {
    "error": {
      "code": "AI_PROVIDER_ERROR",
      "message": "Unable to complete AI evaluation. The AI service returned an error or an invalid response format."
    }
  }
  ```
- **Why it was wrong/incomplete:** When the user submitted the screening form, OpenAI rejected the call with an HTTP 429 quota exhaustion (`credit_balance_exhausted`). Because the error handler swallowed the specific cause, the user had no idea why it failed or how to fix it (wondering if the app had crashed or if the prompt was broken).
- **How it was checked:** Evaluated live API response using a direct test script: `ERROR_STATUS: 429 429 You have no credits remaining. Add credits to continue using the API at https://platform.openai.com/settings/organization/billing/. credit_balance_exhausted`.
- **Correction made:** Refactored `aiService.ts` and `errorHandler.ts` to create a custom `AIServiceError` class. It classifies errors into `AI_QUOTA_EXHAUSTED`, `AI_AUTH_ERROR`, `AI_RATE_LIMIT`, and `AI_MALFORMED_OUTPUT`. Updated the frontend `NewAnalysisPage.tsx` to display humanized, actionable instructions with a direct link to OpenAI's billing portal and guidance on configuring `server/.env`.
- **Evidence:** Recorded in `BUILD_LOG.md` under entry `2026-11-10 00:10`.

## 4. Candidate review and contribution

MANUAL INPUT REQUIRED: Candidate should review the code and state, in their own words, which parts they understood, changed, tested, or decided. Do not infer authorship solely from generated code.

## 5. Accuracy checklist

- [x] Tool names are real.
- [x] Model/version is included only when known.
- [x] Three prompts are exact or explicitly marked unavailable.
- [x] Two correction examples are real, not fabricated.
- [x] Corrections are supported by actual checks or observed behaviour.
- [x] No API keys, personal candidate data, or confidential secrets are included.
- [x] Claims match the repository and build log.
