import {
  NewAnalysisRequest,
  AnalysisResponse,
  AnalysisSummary,
  AnalysisDetail,
  ApiError,
} from '../types';

const API_BASE = '/api';

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let errorMsg = `Server error (${res.status})`;
    try {
      const errorData: ApiError = await res.json();
      if (errorData?.error?.message) {
        errorMsg = errorData.error.message;
        if (errorData.error.details && errorData.error.details.length > 0) {
          const detailStrings = errorData.error.details.map((d) => `${d.field}: ${d.message}`);
          errorMsg = `${errorMsg} (${detailStrings.join(', ')})`;
        }
      }
    } catch {
      // Use fallback errorMsg
    }
    throw new Error(errorMsg);
  }
  return res.json() as Promise<T>;
}

export async function createAnalysis(data: NewAnalysisRequest): Promise<AnalysisResponse> {
  const res = await fetch(`${API_BASE}/analyses`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse<AnalysisResponse>(res);
}

export async function getAnalyses(params?: {
  search?: string;
  minScore?: number;
  maxScore?: number;
}): Promise<AnalysisSummary[]> {
  const query = new URLSearchParams();
  if (params?.search && params.search.trim().length > 0) {
    query.set('search', params.search.trim());
  }
  if (params?.minScore !== undefined && !isNaN(params.minScore)) {
    query.set('minScore', params.minScore.toString());
  }
  if (params?.maxScore !== undefined && !isNaN(params.maxScore)) {
    query.set('maxScore', params.maxScore.toString());
  }

  const url = `${API_BASE}/analyses${query.toString() ? `?${query.toString()}` : ''}`;
  const res = await fetch(url);
  return handleResponse<AnalysisSummary[]>(res);
}

export async function getAnalysisById(id: string): Promise<AnalysisDetail> {
  const res = await fetch(`${API_BASE}/analyses/${encodeURIComponent(id)}`);
  return handleResponse<AnalysisDetail>(res);
}

