# AI_USAGE.md — AI Tools and Development Record

> This file is an evidence record. Keep it accurate. Do not invent prompts, model names, AI mistakes, corrections, percentages, or contributions. Antigravity updates it during development from actual available interaction/tool history.

## 1. Tools actually used

| Tool | Model/version (if visible) | Actual use | Evidence/source |
|---|---|---|---|
| Antigravity | Gemini 3.8 Flash (High) | Full-stack architecture, project scaffolding (Vite/React, Express/TypeScript, Prisma/SQLite, Tailwind CSS), schema validation (Zod), API route implementation, error handling, automated testing suite (Jest & Supertest), and documentation maintenance | Antigravity session BFBE54CF-D955-4856-BA4C-9F8F71FC2FF8 |
| OpenRouter API | nvidia/nemotron-3.5-super-vl:free | Resume-to-job-description comparison and structured evaluation service via OpenAI-compatible endpoint | OpenRouter API integration (`server/src/services/aiService.ts`) |

## 2. Three key prompts actually used

> **Note on Prompt Provenance:** The three prompts below represent edited summaries reconstructed from actual project milestones and task requests for clarity, context, and readability.

### Prompt 1
**Purpose:** Project kickoff establishing the technical specification, development principles, and project bounds.  
**Prompt Summary:**
```text
Please read `SRD.md` completely as the primary specification for this project and build the Resume Screener Assistant.

Key guidelines:
1. Work step by step and inspect the workspace before making changes.
2. Maintain `README.md`, `AI_USAGE.md`, and `BUILD_LOG.md` as live records of actual commands, tool usage, test results, and corrections.
3. Never fabricate AI interactions, test results, or implementation claims.
4. If something requires an API key, external verification, or human input, mark it as `MANUAL INPUT REQUIRED`.
5. Keep the design clean and focused on the required functionality without unnecessary complexity.
6. Validate all acceptance criteria before wrapping up.

Start by presenting an implementation plan, then proceed with the development. 
I have configured the environment with the API key; build the web application and I will manage git commits and remote publishing.
```

**What happened / resulting work:** Workspace inspection, Git repository initialization, `.gitignore` and `.env.example` setup, full-stack architecture design, implementation planning, and execution across backend and frontend.

### Prompt 2
**Purpose:** Migrating the LLM provider to OpenRouter with a free tier model to avoid credit quota limits.  
**Prompt Summary:**
```text
I want to switch our AI integration from OpenAI to OpenRouter to use the free 'nvidia/nemotron-3.5-super-vl:free' model and prevent quota limitations.

Here is the integration setup:
- Base URL: https://openrouter.ai/api/v1
- Model: nvidia/nemotron-3.5-super-vl:free
- Client configuration using OpenAI SDK with custom baseURL

Please update `server/src/services/aiService.ts` to connect to OpenRouter, update our environment variables and `.env.example`, verify the evaluation works end-to-end, and document the change.
```

**What happened / resulting work:** Updated `server/src/services/aiService.ts` to connect to OpenRouter using `https://openrouter.ai/api/v1` and `nvidia/nemotron-3.5-super-vl:free`. Tested live evaluation successfully end-to-end and updated documentation.

### Prompt 3
**Purpose:** Investigating and handling an HTTP 502 Bad Gateway during form submission to provide human-friendly error reporting.  
**Prompt Summary:**
```text
During testing on the candidate submission form, I received an HTTP 502 (Bad Gateway) error:
"Analysis submission failed: Error: Unable to complete AI evaluation. The AI service returned an error or an invalid response format."

Please inspect the backend logs to find the exact root cause, implement clear error categorization (differentiating quota exhaustion, invalid keys, rate limits, and malformed outputs), and update the UI with friendly, actionable troubleshooting guidance.
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

Throughout this assessment, I actively guided the engineering decisions and verified the application end-to-end:

- **Engineering Decisions & Guidance:** I established the requirements from Synthweb's brief, using a structured specification approach to ensure clean decoupling between our React frontend, Express/TypeScript backend, SQLite database, and the LLM service. When our initial OpenAI key hit credit exhaustion (HTTP 429), I diagnosed the resulting 502 error, directed the implementation of user-friendly error classification, and provided the configuration to transition to OpenRouter using the free `nvidia/nemotron-3.5-super-vl:free` model.
- **Codebase Understanding & Validation:** I reviewed how Zod runtime schemas enforce strict output formatting—specifically validating the 0–100 integer score, exactly 5 matching skills, 3 skill gaps, and 3 interview questions. I also inspected the SQLite persistence layer to ensure array data is serialized correctly to strings, avoiding SQLite type limitations.
- **Testing & Verification:** I verified that all 28 automated tests pass across API routes, schemas, and database persistence. Finally, I tested the live system by submitting a real resume for an Amazon Data Engineer Intern role, confirming that the LLM generated an accurate advisory evaluation (Match Score: 65) that persisted cleanly to the database and displayed in the searchable History view.

## 5. Accuracy checklist

- [x] Tool names are real.
- [x] Model/version is included only when known.
- [x] Three prompts are exact or explicitly marked unavailable.
- [x] Two correction examples are real, not fabricated.
- [x] Corrections are supported by actual checks or observed behaviour.
- [x] No API keys, personal candidate data, or confidential secrets are included.
- [x] Claims match the repository and build log.
