import React, { useState } from 'react';
import {
  Sparkles,
  Loader2,
  AlertCircle,
  FileText,
  User,
  Briefcase,
  RefreshCw,
  KeyRound,
} from 'lucide-react';
import { createAnalysis } from '../services/api';
import { AnalysisResponse } from '../types';

interface NewAnalysisPageProps {
  onAnalysisSuccess: (analysis: AnalysisResponse) => void;
}

const SAMPLE_JOB_DESCRIPTION = `Senior Full Stack Engineer (React & Node.js)
Location: Remote

Responsibilities:
- Architect and develop performant, accessible web applications using React, TypeScript, and modern CSS frameworks (Tailwind).
- Design and implement secure, RESTful microservices and backend APIs in Node.js / Express.
- Manage relational database schemas and queries using PostgreSQL / SQLite and ORMs like Prisma.
- Implement automated testing suites with Jest and integration testing tools.
- Collaborate with cross-functional product, UX, and AI teams to deliver high-impact user experiences.

Requirements:
- 4+ years of professional full-stack development experience.
- Strong proficiency in TypeScript, React, and Node.js.
- Hands-on experience with SQL databases and ORM tools (Prisma, TypeORM, or Sequelize).
- Solid understanding of API security, CORS, and authentication patterns.
- Familiarity with Docker, CI/CD pipelines, and cloud deployment (AWS or GCP).
- Excellent communication and collaboration skills.`;

const SAMPLE_RESUME = `Sarah Chen
Senior Software Engineer
Email: sarah.chen@example.com | GitHub: github.com/sarahchen

Summary:
Full-stack software developer with 5 years of industry experience building scalable web applications and developer tools. Passionate about clean TypeScript code, frontend performance, and reliable backend services.

Technical Skills:
- Languages: TypeScript, JavaScript, Python, SQL
- Frontend: React, Vite, Next.js, Redux, Tailwind CSS, HTML5/CSS3
- Backend: Node.js, Express, REST APIs, Prisma ORM, SQLite, PostgreSQL
- Testing: Jest, React Testing Library, Supertest, Cypress
- DevOps & Tools: Git, GitHub Actions, Docker, Linux

Professional Experience:
Senior Frontend & Full Stack Developer | CloudScale Solutions (2022 - Present)
- Led frontend redesign of flagship analytics portal using React, TypeScript, and Tailwind CSS, improving Lighthouse performance score from 68 to 94.
- Built 15+ backend endpoints in Node.js and Express with Prisma ORM, handling over 2M requests weekly.
- Introduced automated integration testing using Jest and Supertest, raising test coverage from 45% to 82%.

Software Engineer | DevPulse Technologies (2019 - 2022)
- Developed responsive web interfaces in React and state management flows with Redux Toolkit.
- Built RESTful microservices in Node.js for client data synchronization.
- Created relational database migrations in PostgreSQL.

Education:
B.S. in Computer Science, University of Washington (2019)`;

export const NewAnalysisPage: React.FC<NewAnalysisPageProps> = ({ onAnalysisSuccess }) => {
  const [candidateName, setCandidateName] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [resume, setResume] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});

  const validate = (): boolean => {
    const errors: { [key: string]: string } = {};

    if (!candidateName.trim()) {
      errors.candidateName = 'Candidate name is required.';
    } else if (candidateName.trim().length > 200) {
      errors.candidateName = 'Candidate name cannot exceed 200 characters.';
    }

    if (!jobDescription.trim()) {
      errors.jobDescription = 'Job description is required.';
    } else if (jobDescription.trim().length < 10) {
      errors.jobDescription = 'Job description must be at least 10 characters long.';
    } else if (jobDescription.length > 50000) {
      errors.jobDescription = 'Job description exceeds maximum limit of 50,000 characters.';
    }

    if (!resume.trim()) {
      errors.resume = 'Resume text is required.';
    } else if (resume.trim().length < 10) {
      errors.resume = 'Resume must be at least 10 characters long.';
    } else if (resume.length > 50000) {
      errors.resume = 'Resume exceeds maximum limit of 50,000 characters.';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleLoadSample = () => {
    setCandidateName('Sarah Chen');
    setJobDescription(SAMPLE_JOB_DESCRIPTION);
    setResume(SAMPLE_RESUME);
    setFieldErrors({});
    setErrorMessage(null);
  };

  const handleClear = () => {
    setCandidateName('');
    setJobDescription('');
    setResume('');
    setFieldErrors({});
    setErrorMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!validate()) {
      return;
    }

    setIsLoading(true);

    try {
      const result = await createAnalysis({
        candidateName: candidateName.trim(),
        jobDescription: jobDescription.trim(),
        resume: resume.trim(),
      });
      onAnalysisSuccess(result);
    } catch (err: unknown) {
      console.error('Analysis submission failed:', err);
      setErrorMessage(
        err instanceof Error
          ? err.message
          : 'An unexpected error occurred during analysis. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            New Candidate Screening
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Compare candidate resume against the job description using AI to generate a match score,
            skills breakdown, and interview questions.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleLoadSample}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg border border-indigo-200 transition-colors disabled:opacity-50"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Load Sample Candidate
          </button>
          <button
            type="button"
            onClick={handleClear}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors disabled:opacity-50"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Clear
          </button>
        </div>
      </div>

      {errorMessage && (
        <div className="mb-6 p-5 bg-rose-50 border border-rose-200 rounded-2xl flex flex-col gap-3 text-rose-900">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-rose-600" />
            <div className="flex-1 text-sm">
              <p className="font-bold text-rose-900">Analysis Request Failed</p>
              <p className="mt-1 text-rose-800 leading-relaxed">{errorMessage}</p>
            </div>
          </div>

          <div className="ml-8 p-3 rounded-xl bg-white/80 border border-rose-200/80 text-xs text-rose-900 space-y-1">
            <p className="font-semibold flex items-center gap-1.5 text-rose-950">
              <KeyRound className="w-4 h-4 text-rose-600" />
              Troubleshooting OpenRouter / API configuration:
            </p>
            <p className="text-rose-800">
              Verify your API key and model in <code className="px-1.5 py-0.5 rounded bg-slate-100 font-mono text-slate-800 font-bold">server/.env</code>. You can obtain a free OpenRouter key from <a href="https://openrouter.ai/keys" target="_blank" rel="noreferrer" className="underline font-semibold text-indigo-700">openrouter.ai/keys</a>.
            </p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8 space-y-6">
        {/* Candidate Name */}
        <div>
          <label htmlFor="candidateName" className="block text-sm font-semibold text-slate-800 mb-1 flex items-center gap-1.5">
            <User className="w-4 h-4 text-slate-500" />
            Candidate Full Name <span className="text-rose-500">*</span>
          </label>
          <input
            id="candidateName"
            type="text"
            value={candidateName}
            onChange={(e) => {
              setCandidateName(e.target.value);
              if (fieldErrors.candidateName) {
                setFieldErrors((prev) => ({ ...prev, candidateName: '' }));
              }
            }}
            placeholder="e.g. Jane Doe"
            disabled={isLoading}
            className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-colors focus:outline-none focus:ring-2 ${
              fieldErrors.candidateName
                ? 'border-rose-300 focus:ring-rose-500 bg-rose-50/30'
                : 'border-slate-300 focus:ring-indigo-500 focus:border-indigo-500'
            }`}
          />
          {fieldErrors.candidateName && (
            <p className="mt-1 text-xs text-rose-600 font-medium">{fieldErrors.candidateName}</p>
          )}
        </div>

        {/* Job Description */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label htmlFor="jobDescription" className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
              <Briefcase className="w-4 h-4 text-slate-500" />
              Job Description <span className="text-rose-500">*</span>
            </label>
            <span className="text-xs text-slate-400">
              {jobDescription.length.toLocaleString()} / 50,000 chars
            </span>
          </div>
          <textarea
            id="jobDescription"
            rows={7}
            value={jobDescription}
            onChange={(e) => {
              setJobDescription(e.target.value);
              if (fieldErrors.jobDescription) {
                setFieldErrors((prev) => ({ ...prev, jobDescription: '' }));
              }
            }}
            placeholder="Paste the target job description, requirements, and responsibilities here..."
            disabled={isLoading}
            className={`w-full px-4 py-3 rounded-xl border text-sm font-mono text-xs sm:text-sm leading-relaxed transition-colors focus:outline-none focus:ring-2 ${
              fieldErrors.jobDescription
                ? 'border-rose-300 focus:ring-rose-500 bg-rose-50/30'
                : 'border-slate-300 focus:ring-indigo-500 focus:border-indigo-500'
            }`}
          />
          {fieldErrors.jobDescription && (
            <p className="mt-1 text-xs text-rose-600 font-medium">{fieldErrors.jobDescription}</p>
          )}
        </div>

        {/* Resume */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label htmlFor="resume" className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-slate-500" />
              Candidate Resume Text <span className="text-rose-500">*</span>
            </label>
            <span className="text-xs text-slate-400">
              {resume.length.toLocaleString()} / 50,000 chars
            </span>
          </div>
          <textarea
            id="resume"
            rows={10}
            value={resume}
            onChange={(e) => {
              setResume(e.target.value);
              if (fieldErrors.resume) {
                setFieldErrors((prev) => ({ ...prev, resume: '' }));
              }
            }}
            placeholder="Paste candidate's resume, work history, skills, and educational qualifications here..."
            disabled={isLoading}
            className={`w-full px-4 py-3 rounded-xl border text-sm font-mono text-xs sm:text-sm leading-relaxed transition-colors focus:outline-none focus:ring-2 ${
              fieldErrors.resume
                ? 'border-rose-300 focus:ring-rose-500 bg-rose-50/30'
                : 'border-slate-300 focus:ring-indigo-500 focus:border-indigo-500'
            }`}
          />
          {fieldErrors.resume && (
            <p className="mt-1 text-xs text-rose-600 font-medium">{fieldErrors.resume}</p>
          )}
        </div>

        {/* Action Button & Instructions */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500">
            Analysis evaluates candidate qualifications strictly against requirements. No automated hiring decision is made.
          </p>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Screening Candidate with AI...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Analyze Candidate</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
