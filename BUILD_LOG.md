# Engineering Build Log — Resume Screener Assistant

A chronological engineering log documenting development milestones, architectural decisions, real debugging sessions, and test outcomes.

---

### Nov 9, 2026 — 19:30 | Project Setup & Repository Initialization
- **Milestone:** Initialized workspace, runtime verification, and security setup.
- **Actions & Commands:**
  - Checked local environment runtimes: Node `v22.23.1`, npm `11.18.0`, Git `2.55.0`.
  - Initialized Git repository (`git init`).
  - Created `.gitignore` to prevent tracking `.env` secrets, `node_modules/`, and SQLite `.db` binaries.
  - Created `.env.example` to document required configuration variables.
- **Outcome:** Clean workspace ready for full-stack scaffolding.

---

### Nov 9, 2026 — 19:35 | Backend Scaffolding & Dependencies
- **Milestone:** Scaffolding the Express and TypeScript backend.
- **Actions & Commands:**
  - Created project structure for `server/` with TypeScript configuration (`tsconfig.json`), Express, Prisma ORM, Zod, and Jest/Supertest.
  - Installed dependencies (`npm install`).
  - Configured initial Prisma schema targeting SQLite (`file:./dev.db`).
- **Outcome:** Core backend foundation and dependencies ready.

---

### Nov 9, 2026 — 19:42 | Database Schema & SQLite Compatibility Fix
- **Milestone:** Database schema synchronization and resolving SQLite data type limits.
- **Issue Encountered:**
  - Running `npx prisma generate` failed with:
    `error: Error validating field 'matchingSkills' in model 'Analysis': Field 'matchingSkills' in model 'Analysis' can't be of type Json. The current connector does not support the Json type.`
  - Prisma's SQLite connector does not support the native `Json` scalar type.
- **Fix Applied:**
  - Changed `matchingSkills`, `skillGaps`, and `interviewQuestions` from `Json` to `String` in `server/prisma/schema.prisma`.
  - In `server/src/services/dbService.ts`, implemented explicit serialization (`JSON.stringify`) when saving records and deserialization (`JSON.parse`) on retrieval.
- **Verification:**
  - Ran `npx prisma db push` — created `dev.db` and generated Prisma Client cleanly.
  - Verified with `npx tsc --noEmit` — zero compilation errors.

---

### Nov 9, 2026 — 20:01 | Schema Validation & API Route Tests
- **Milestone:** Unit and integration testing for validation rules and API contracts.
- **Actions & Commands:**
  - Implemented unit tests for Zod schemas (`analysisSchemas.test.ts`):
    - Strict score bounds (0–100 integer).
    - Exact array lengths (5 skills, 3 gaps, 3 interview questions).
    - Input constraints (max 50,000 characters per field, rejecting whitespace-only inputs).
  - Implemented Supertest route integration tests (`analysisRoutes.test.ts`) covering `/api/health`, `/api/analyses` input validation, and 404 handling.
  - Ran test suite — all 25 initial tests passed.
- **Outcome:** API contracts and data validation enforced defensively before frontend wiring.

---

### Nov 9, 2026 — 20:12 | Frontend Implementation & Client Build
- **Milestone:** Built the React + Vite frontend and verified end-to-end build.
- **Actions & Commands:**
  - Developed the user interface using React, TypeScript, and Tailwind CSS:
    - `NewAnalysisPage.tsx`: Input form with validation, character counters, and a 1-click "Load Sample Candidate" helper.
    - `ReportPage.tsx`: Card-based advisory report displaying the match score badge, skills breakdown, and interview prompts.
    - `HistoryPage.tsx`: Searchable history with real-time candidate name filtering and score range bounds.
  - Added database persistence unit tests (`dbService.test.ts`) covering search queries and score filtering.
  - Ran `npm run build` in `client/` — Vite production build completed in 5.9s.
  - Ran backend test suite (`npm test`) — all 28 automated tests passed across all 3 test suites.
- **Outcome:** Frontend and backend fully integrated and passing all tests.

---

### Nov 10, 2026 — 00:10 | Bug Diagnosis: 502 Bad Gateway / Quota Exhaustion
- **Milestone:** Investigating and resolving live form submission failure.
- **Symptom:**
  - Submitting candidate evaluation returned an HTTP 502:
    `Analysis submission failed: Error: Unable to complete AI evaluation. The AI service returned an error or an invalid response format.`
- **Root Cause Analysis:**
  - Ran a targeted diagnostic script against the AI client:
    The API rejected requests with HTTP 429: `You have no credits remaining. credit_balance_exhausted`.
  - The generic error middleware was intercepting all AI provider failures and returning a vague 502 message without actionable details.
- **Fix Applied:**
  - Built a custom `AIServiceError` class that categorizes errors (`AI_QUOTA_EXHAUSTED`, `AI_AUTH_ERROR`, `AI_RATE_LIMIT`, `AI_MALFORMED_OUTPUT`).
  - Enhanced `NewAnalysisPage.tsx` with user-friendly troubleshooting cards and guidance instead of an opaque alert.

---

### Nov 10, 2026 — 00:40 | Provider Switch: OpenRouter (Nemotron 3.5 Free Tier)
- **Milestone:** Migrated LLM backend to OpenRouter to ensure reliable, free live evaluations.
- **Decision:**
  - To prevent quota exhaustion without requiring paid credits, transitioned to OpenRouter using the free `nvidia/nemotron-3.5-super-vl:free` model.
- **Actions & Commands:**
  - Configured `server/src/services/aiService.ts` to use OpenRouter's OpenAI-compatible endpoint (`https://openrouter.ai/api/v1`) with required routing headers (`HTTP-Referer`, `X-Title`).
  - Updated environment templates (`.env` and `.env.example`).
  - Added robust response cleaning to handle markdown code blocks (` ```json ... ``` `) returned by certain models.
- **Verification:**
  - Tested live analysis end-to-end with an Amazon Data Engineer Intern job description and candidate resume. Received a valid structured assessment (Match Score: 65, 5 skills, 3 gaps, 3 interview questions).
  - Verified persistence to SQLite and display in History.
  - Ran full test suite — all 28 tests passing.

---

### Nov 10, 2026 — 13:45 | Final Pre-Submission Audit & Robustness Hardening
- **Milestone:** Comprehensive pre-submission audit against SynthWeb's 20 core requirements and optional bonuses.
- **Audits & Findings:**
  - Verified end-to-end flow from form submission to SQLite persistence and History retrieval.
  - Identified that LLMs returning text commentary around markdown code blocks (` ```json ... ``` `) could throw a JSON syntax error in `aiService.ts`.
  - Identified that immediate post-submission report viewing omitted `jobDescription` and `resume` in local React state (requiring users to click through History to see submitted texts).
  - Identified missing `vite-env.d.ts` causing TypeScript error TS2339 when checking `import.meta.env.VITE_API_BASE`.
  - Identified untracked `.vercel` build folders.
- **Corrections Applied:**
  - Hardened `parseAndValidate` in `server/src/services/aiService.ts` with regex code block and outer JSON brace extraction before schema validation.
  - Updated `client/src/pages/NewAnalysisPage.tsx` and `client/src/App.tsx` to pass submitted inputs into active report state.
  - Added `client/src/vite-env.d.ts` and configured fallback `API_BASE` (`import.meta.env.VITE_API_BASE || '/api'`).
  - Added `.vercel/` to root `.gitignore`.
- **Verification:**
  - Ran backend test suite (`npm --prefix server test`): all 28 tests across 3 suites passing.
  - Ran server build (`npm --prefix server run build`): compiled cleanly with zero errors.
  - Ran client build (`npm --prefix client run build`): Vite build completed cleanly in 5.2s.
  - Verified Prisma schema validation (`npx prisma validate`): valid.
  - Verified local database (`server/prisma/dev.db`): 28 records preserved, not tracked by Git.
