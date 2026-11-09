export interface AnalysisInput {
  candidateName: string;
  jobDescription: string;
  resume: string;
}

export interface AIEvaluationResult {
  matchScore: number;
  matchingSkills: [string, string, string, string, string];
  skillGaps: [string, string, string];
  interviewQuestions: [string, string, string];
}

export interface AnalysisSummary {
  id: string;
  candidateName: string;
  matchScore: number;
  createdAt: string;
}

export interface AnalysisDetail extends AnalysisSummary {
  jobDescription: string;
  resume: string;
  matchingSkills: string[];
  skillGaps: string[];
  interviewQuestions: string[];
}

export interface ApiErrorResponse {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

