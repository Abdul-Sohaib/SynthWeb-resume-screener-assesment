export interface NewAnalysisRequest {
  candidateName: string;
  jobDescription: string;
  resume: string;
}

export interface AnalysisResponse {
  id: string;
  candidateName: string;
  matchScore: number;
  matchingSkills: string[];
  skillGaps: string[];
  interviewQuestions: string[];
  createdAt: string;
}

export interface AnalysisSummary {
  id: string;
  candidateName: string;
  matchScore: number;
  createdAt: string;
}

export interface AnalysisDetail extends AnalysisResponse {
  jobDescription: string;
  resume: string;
}

export interface ApiError {
  error: {
    code: string;
    message: string;
    details?: Array<{ field: string; message: string }>;
  };
}

