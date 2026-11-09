import React, { useState } from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Calendar,
  User,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  FileText,
  Briefcase,
  History,
  ShieldCheck,
} from 'lucide-react';
import { ScoreBadge } from '../components/ScoreBadge';
import { AnalysisDetail } from '../types';

interface ReportPageProps {
  analysis: AnalysisDetail;
  onBackToNew: () => void;
  onGoToHistory: () => void;
}

export const ReportPage: React.FC<ReportPageProps> = ({
  analysis,
  onBackToNew,
  onGoToHistory,
}) => {
  const [showOriginalInputs, setShowOriginalInputs] = useState(false);

  const formattedDate = new Date(analysis.createdAt).toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 space-y-6">
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBackToNew}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>New Analysis</span>
        </button>

        <button
          onClick={onGoToHistory}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
        >
          <History className="w-4 h-4" />
          <span>View All in History</span>
        </button>
      </div>

      {/* Main Candidate Card & Match Score */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-semibold uppercase tracking-wider">
            Screening Evaluation Report
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 flex items-center gap-2">
            <User className="w-7 h-7 text-indigo-600" />
            {analysis.candidateName}
          </h2>
          <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-500">
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4 text-slate-400" />
              {formattedDate}
            </span>
            <span>•</span>
            <span className="font-mono text-slate-400 text-xs">ID: {analysis.id}</span>
          </div>
        </div>

        <div className="flex-shrink-0 self-center sm:self-auto">
          <ScoreBadge score={analysis.matchScore} size="lg" />
        </div>
      </div>

      {/* Matching Skills (Exactly 5 items) */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-700">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Matching Skills</h3>
            <p className="text-xs text-slate-500">
              5 verified qualifications & competencies aligned with the job description
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {analysis.matchingSkills.map((skill, index) => (
            <div
              key={index}
              className="flex items-start gap-3 p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-100 text-slate-800 text-sm"
            >
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center">
                {index + 1}
              </span>
              <span className="leading-relaxed font-medium">{skill}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Skill Gaps (Exactly 3 items) */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="p-1.5 rounded-lg bg-amber-100 text-amber-700">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Skill Gaps & Missing Requirements</h3>
            <p className="text-xs text-slate-500">
              3 key requirements or competencies lacking sufficient evidence in the resume
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {analysis.skillGaps.map((gap, index) => (
            <div
              key={index}
              className="flex items-start gap-3 p-3.5 rounded-xl bg-amber-50/60 border border-amber-100 text-slate-800 text-sm"
            >
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-600 text-white text-xs font-bold flex items-center justify-center">
                {index + 1}
              </span>
              <span className="leading-relaxed font-medium">{gap}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Suggested Interview Questions (Exactly 3 items) */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="p-1.5 rounded-lg bg-indigo-100 text-indigo-700">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Suggested Interview Questions</h3>
            <p className="text-xs text-slate-500">
              3 targeted questions for the recruiter or hiring manager to probe competencies & gaps
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {analysis.interviewQuestions.map((q, index) => (
            <div
              key={index}
              className="flex items-start gap-3 p-3.5 rounded-xl bg-indigo-50/60 border border-indigo-100 text-slate-800 text-sm"
            >
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center">
                Q{index + 1}
              </span>
              <span className="leading-relaxed font-medium">{q}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Collapsible Source Texts (Job Description & Resume) */}
      {(analysis.jobDescription || analysis.resume) && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <button
            onClick={() => setShowOriginalInputs(!showOriginalInputs)}
            className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-slate-500" />
              <span className="text-sm font-semibold text-slate-800">
                View Submitted Inputs (Job Description & Resume)
              </span>
            </div>
            {showOriginalInputs ? (
              <ChevronUp className="w-4 h-4 text-slate-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-400" />
            )}
          </button>

          {showOriginalInputs && (
            <div className="p-6 border-t border-slate-200 bg-slate-50/50 space-y-4">
              {analysis.jobDescription && (
                <div>
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5" /> Job Description
                  </h4>
                  <pre className="p-4 rounded-xl bg-white border border-slate-200 text-xs font-mono text-slate-700 whitespace-pre-wrap max-h-60 overflow-y-auto">
                    {analysis.jobDescription}
                  </pre>
                </div>
              )}
              {analysis.resume && (
                <div>
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5" /> Candidate Resume
                  </h4>
                  <pre className="p-4 rounded-xl bg-white border border-slate-200 text-xs font-mono text-slate-700 whitespace-pre-wrap max-h-60 overflow-y-auto">
                    {analysis.resume}
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Decision Support Advisory Banner */}
      <div className="p-4 rounded-xl bg-slate-100 border border-slate-200 flex items-start gap-3 text-slate-600 text-xs leading-relaxed">
        <ShieldCheck className="w-4 h-4 flex-shrink-0 mt-0.5 text-indigo-600" />
        <p>
          <strong>Advisory Decision Support Notice:</strong> This analysis is generated by an AI
          assistant based on resume-to-job-description comparison. It is provided strictly to support
          human review and must not be used as an automated hiring or rejection decision.
        </p>
      </div>
    </div>
  );
};

