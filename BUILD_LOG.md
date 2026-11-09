# BUILD_LOG.md

Antigravity: append entries as work happens. Use actual local date/time and actual command output. Do not backfill invented activity.

## Entries

### 2026-11-09 19:30 (local time)
- **Task:** Initial workspace inspection, environment verification, git repository initialization, and security configuration (.gitignore, .env.example).
- **Files changed:** `SRD.md`, `.gitignore`, `.env.example`, `BUILD_LOG.md`
- **Commands run:**
  - `dir` -> returned empty directory.
  - `Get-ChildItem -Force` -> verified empty workspace.
  - `Get-Location` -> `D:\SynthWeb`
  - `node -v; npm -v; git --version` -> Node `v22.23.1`, npm `11.18.0`, git `2.55.0.windows.5`.
  - `git init` -> Initialized empty Git repository in D:/SynthWeb/.git/
  - `git status` -> On branch master, untracked: `.env.example`, `.gitignore`, `SRD.md`.
- **Observed result:** Workspace is clean, required runtimes (Node 22, npm 11, git) are available, repository initialized.
- **Issue found:** None.
- **Correction:** None needed.
- **Tests run and outcome:** Environment sanity checks passed.
- **Remaining work:** Write AI_USAGE.md and initial README.md, present implementation plan, set up server (Express, TypeScript, Prisma SQLite, Zod, OpenAI integration), set up client (React, Vite, Tailwind CSS, Lucide React), implement and test all acceptance criteria.

### 2026-11-09 19:35 (local time)
- **Task:** Project scaffolding and server initialization.
- **Files changed:** `package.json`, `server/package.json`, `server/tsconfig.json`, `server/jest.config.js`, `server/prisma/schema.prisma`, `server/.env`, `server/.env.example`.
- **Commands run:**
  - `New-Item -ItemType Directory -Force -Path server, client`
  - `git status --ignored` -> Confirmed `server/.env` is ignored by git.
  - `cd server; npm install` (Standard sandbox mode) -> Halted due to lack of network access in sandbox mode.
  - `manage_task kill task-54` -> Terminated sandbox install task.
  - `cd server; npm install` (BypassSandbox: true) -> Completed successfully, 444 packages installed.
- **Observed result:** Server dependencies installed cleanly.
- **Issue found:** Standard sandbox mode does not have network access required for `npm install`.
- **Correction:** Ran `npm install` with unsandboxed execution to reach `registry.npmjs.org`.
- **Tests run and outcome:** Dependency installation verified.
- **Remaining work:** Generate Prisma client, build schemas, implement server logic, build frontend.

### 2026-11-09 19:42 (local time)
- **Task:** Prisma Schema Generation and SQLite Connector Alignment.
- **Files changed:** `server/prisma/schema.prisma`, `server/src/services/dbService.ts`.
- **Commands run:**
  - `cd server; npx prisma generate` -> Failed with error: `error: Error validating field 'matchingSkills' in model 'Analysis': Field 'matchingSkills' in model 'Analysis' can't be of type Json. The current connector does not support the Json type.`
- **Observed result:** Prisma's SQLite connector does not support the `Json` scalar type, despite SRD template suggestion.
- **Issue found:** `Json` scalar type is unsupported by the SQLite connector in Prisma schema.
- **Correction:** Updated schema fields `matchingSkills`, `skillGaps`, and `interviewQuestions` to `String` (storing serialized JSON arrays) and implemented explicit `JSON.stringify` on create and `JSON.parse` on retrieval in `dbService.ts`.
- **Commands run (after fix):**
  - `cd server; npx prisma db push` -> Succeeded! Created `dev.db` and generated Prisma Client v5.22.0.
  - `cd server; npx tsc --noEmit` -> Zero TypeScript compiler errors.
- **Tests run and outcome:** Prisma client generated, SQLite database schema synced.
- **Remaining work:** Frontend scaffolding, automated tests, end-to-end verification.

### 2026-11-09 20:01 (local time)
- **Task:** Backend Unit and Integration Testing.
- **Files changed:** `server/src/schemas/analysisSchemas.test.ts`, `server/src/routes/analysisRoutes.test.ts`.
- **Commands run:**
  - `cd server; npm test` (Sandboxed) -> Schema unit tests passed (17 tests). Route integration tests failed with `connect EACCES 127.0.0.1` due to sandbox socket binding restrictions on Windows.
  - `cd server; npm test` (BypassSandbox: true) -> All 25 tests passed across 2 suites.
- **Observed result:** Zod validation correctly enforces all schema rules (score range 0-100, exactly 5 skills, 3 gaps, 3 questions, input length boundaries); API endpoints correctly handle 400 validation errors, 404 not found, and 200 health check.
- **Issue found:** Supertest ephemeral socket binding requires unsandboxed loopback permissions.
- **Correction:** Ran tests with socket permissions.
- **Tests run and outcome:** 25/25 automated tests passed.
- **Remaining work:** Frontend components, database persistence tests, live AI test.

### 2026-11-09 20:12 (local time)
- **Task:** Frontend implementation, build verification, and database persistence testing.
- **Files changed:**
  - `client/package.json`, `client/vite.config.ts`, `client/tailwind.config.js`, `client/postcss.config.js`, `client/tsconfig.json`, `client/index.html`
  - `client/src/types/index.ts`, `client/src/services/api.ts`, `client/src/index.css`, `client/src/components/ScoreBadge.tsx`, `client/src/components/Navbar.tsx`
  - `client/src/pages/NewAnalysisPage.tsx`, `client/src/pages/ReportPage.tsx`, `client/src/pages/HistoryPage.tsx`, `client/src/App.tsx`, `client/src/main.tsx`
  - `server/src/services/dbService.test.ts`
- **Commands run:**
  - `cd client; npm install` -> Succeeded in 15s.
  - `cd client; npm run build` -> Vite production build succeeded in 5.93s (`dist/index.html`, CSS, and JS bundle generated).
  - `cd server; npm run build` -> TypeScript build succeeded with zero errors.
  - `cd server; npm test` -> Ran all 3 backend test suites (dbService.test.ts, analysisRoutes.test.ts, analysisSchemas.test.ts).
- **Observed result:**
  - 28/28 tests passed across 3 test suites.
  - Frontend production build succeeded.
  - Backend production build succeeded.
- **Remaining work:** User verification and testing.

### 2026-11-10 00:10 (local time)
- **Task:** Diagnosis and resolution of HTTP 502 Bad Gateway reported during user testing.
- **Reported error:** `Failed to load resource: the server responded with a status of 502 (Bad Gateway)` -> `Analysis submission failed: Error: Unable to complete AI evaluation. The AI service returned an error or an invalid response format.`
- **Investigation & Command run:**
  - Executed diagnostic script testing the user's active API key:
    `cd server; node -e "require('dotenv').config(); const OpenAI = require('openai'); const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY }); client.chat.completions.create({ model: 'gpt-4o-mini', messages: [{role: 'user', content: 'Say hello'}] }).then(res => console.log('SUCCESS:', res.choices[0].message.content)).catch(err => console.error('ERROR_STATUS:', err.status, err.message, err.code));"`
  - **Output:** `ERROR_STATUS: 429 429 You have no credits remaining. Add credits to continue using the API at https://platform.openai.com/settings/organization/billing/. credit_balance_exhausted`
- **Root cause:**
  1. The OpenAI account associated with the configured API key had a credit balance of $0.00 (`credit_balance_exhausted`).
  2. `server/src/middleware/errorHandler.ts` caught any `AI_PROVIDER_ERROR` and replaced it with a generic, unhelpful message.
- **Fix applied:**
  - Added `AIServiceError` with structured classification (`AI_QUOTA_EXHAUSTED`, `AI_AUTH_ERROR`, etc.).
  - Enhanced `NewAnalysisPage.tsx` with humanized troubleshooting cards.

### 2026-11-10 00:40 (local time)
- **Task:** Transition AI backend to OpenRouter with free model `nvidia/nemotron-3.5-super-vl:free`.
- **User instruction:** Switch provider to OpenRouter with base URL `https://openrouter.ai/api/v1` and free model `nvidia/nemotron-3.5-super-vl:free`.
- **Files changed:**
  - `server/.env`: Configured `OPENROUTER_API_KEY`, `OPENROUTER_BASE_URL="https://openrouter.ai/api/v1"`, and `OPENROUTER_MODEL="nvidia/nemotron-3.5-super-vl:free"`.
  - `server/.env.example` & `.env.example`: Updated to document OpenRouter environment variables.
  - `server/src/services/aiService.ts`: Refactored to pass OpenRouter base URL, default headers (`HTTP-Referer`, `X-Title`), and clean markdown-wrapped JSON outputs.
  - `client/src/components/Navbar.tsx` & `client/src/App.tsx`: Updated branding to OpenRouter Nemotron 3.5.
  - `client/src/pages/NewAnalysisPage.tsx`: Updated error troubleshooting text to point to OpenRouter.
  - `README.md` & `AI_USAGE.md`: Updated architecture, technology stack, and logs.
- **Commands run:**
  - Tested OpenRouter completion with `nvidia/nemotron-3.5-super-vl:free` -> Returned structured JSON with match score, 5 skills, 3 gaps, and 3 interview questions.
  - Verified `aiService.evaluateResume` with sample candidate -> Returned valid evaluation verified by Zod schema.
  - `npm run build`: Succeeded with zero errors for both client and server.
  - `cd server; npm test`: All 28 automated tests passed across all 3 test suites.
- **Observed result:** Live screening functionality fully verified with free OpenRouter model `nvidia/nemotron-3.5-super-vl:free`.
