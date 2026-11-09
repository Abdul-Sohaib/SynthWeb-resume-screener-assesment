import React, { useState, useEffect, useCallback } from 'react';
import {
  Search,
  SlidersHorizontal,
  RefreshCw,
  Loader2,
  AlertCircle,
  FileSearch,
  Eye,
  Calendar,
  User,
} from 'lucide-react';
import { getAnalyses, getAnalysisById } from '../services/api';
import { AnalysisSummary, AnalysisDetail } from '../types';
import { ScoreBadge } from '../components/ScoreBadge';

interface HistoryPageProps {
  onSelectAnalysis: (analysis: AnalysisDetail) => void;
  onGoToNew: () => void;
}

export const HistoryPage: React.FC<HistoryPageProps> = ({
  onSelectAnalysis,
  onGoToNew,
}) => {
  const [analyses, setAnalyses] = useState<AnalysisSummary[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [minScore, setMinScore] = useState<string>('');
  const [maxScore, setMaxScore] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingDetailId, setLoadingDetailId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [filterError, setFilterError] = useState<string | null>(null);

  const fetchHistory = useCallback(async () => {
    setFilterError(null);
    setErrorMessage(null);

    // Validate score ranges
    const min = minScore !== '' ? parseInt(minScore, 10) : undefined;
    const max = maxScore !== '' ? parseInt(maxScore, 10) : undefined;

    if (min !== undefined && (isNaN(min) || min < 0 || min > 100)) {
      setFilterError('Min score must be between 0 and 100.');
      return;
    }
    if (max !== undefined && (isNaN(max) || max < 0 || max > 100)) {
      setFilterError('Max score must be between 0 and 100.');
      return;
    }
    if (min !== undefined && max !== undefined && min > max) {
      setFilterError('Min score cannot be greater than Max score.');
      return;
    }

    setIsLoading(true);
    try {
      const data = await getAnalyses({
        search: searchTerm,
        minScore: min,
        maxScore: max,
      });
      setAnalyses(data);
    } catch (err: unknown) {
      console.error('Failed to fetch history:', err);
      setErrorMessage(
        err instanceof Error ? err.message : 'Failed to load historical analyses.'
      );
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm, minScore, maxScore]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setMinScore('');
    setMaxScore('');
    setFilterError(null);
  };

  const handleOpenDetail = async (id: string) => {
    setLoadingDetailId(id);
    try {
      const fullAnalysis = await getAnalysisById(id);
      onSelectAnalysis(fullAnalysis);
    } catch (err: unknown) {
      console.error('Failed to load analysis detail:', err);
      alert(err instanceof Error ? err.message : 'Failed to load analysis report.');
    } finally {
      setLoadingDetailId(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Screening History
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Review and filter previously saved candidate evaluations. Saved reports are retrieved
            directly from the database without re-querying AI.
          </p>
        </div>
        <button
          onClick={fetchHistory}
          disabled={isLoading}
          className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-sm disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
          {/* Candidate Search */}
          <div className="sm:col-span-6 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by candidate name..."
              className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Min Score */}
          <div className="sm:col-span-2">
            <input
              type="number"
              min={0}
              max={100}
              value={minScore}
              onChange={(e) => setMinScore(e.target.value)}
              placeholder="Min Score"
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Max Score */}
          <div className="sm:col-span-2">
            <input
              type="number"
              min={0}
              max={100}
              value={maxScore}
              onChange={(e) => setMaxScore(e.target.value)}
              placeholder="Max Score"
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Reset Action */}
          <div className="sm:col-span-2 flex justify-end">
            <button
              onClick={handleResetFilters}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              Reset
            </button>
          </div>
        </div>

        {filterError && (
          <p className="text-xs text-rose-600 font-medium flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" />
            {filterError}
          </p>
        )}
      </div>

      {/* Error State */}
      {errorMessage && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-3 text-rose-800 text-sm">
          <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-600" />
          <div>
            <p className="font-semibold">Unable to Load History</p>
            <p className="text-rose-700">{errorMessage}</p>
          </div>
        </div>
      )}

      {/* Results Table / List */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {isLoading && analyses.length === 0 ? (
          <div className="py-16 text-center text-slate-500 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
            <p className="text-sm font-medium">Loading saved analyses...</p>
          </div>
        ) : analyses.length === 0 ? (
          <div className="py-16 text-center text-slate-500 flex flex-col items-center justify-center px-4 space-y-3">
            <FileSearch className="w-10 h-10 text-slate-300 stroke-1" />
            <div>
              <p className="text-base font-semibold text-slate-700">No evaluations found</p>
              <p className="text-xs text-slate-500 mt-1 max-w-sm">
                {searchTerm || minScore || maxScore
                  ? 'No evaluations match your search or score filter criteria. Try adjusting your filters.'
                  : 'No candidate analyses have been performed yet. Start your first analysis!'}
              </p>
            </div>
            {!searchTerm && !minScore && !maxScore && (
              <button
                onClick={onGoToNew}
                className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
              >
                Create New Analysis
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 text-xs uppercase font-semibold tracking-wider">
                  <th className="py-3.5 px-6">Candidate Name</th>
                  <th className="py-3.5 px-6">Match Score</th>
                  <th className="py-3.5 px-6">Date Evaluated</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {analyses.map((item) => {
                  const dateStr = new Date(item.createdAt).toLocaleString(undefined, {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  });
                  const isOpening = loadingDetailId === item.id;

                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                      onClick={() => handleOpenDetail(item.id)}
                    >
                      <td className="py-4 px-6 font-semibold text-slate-900 flex items-center gap-2">
                        <User className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                        <span>{item.candidateName}</span>
                      </td>
                      <td className="py-4 px-6">
                        <ScoreBadge score={item.matchScore} size="sm" />
                      </td>
                      <td className="py-4 px-6 text-slate-500 text-xs">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          {dateStr}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenDetail(item.id);
                          }}
                          disabled={isOpening}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 transition-colors disabled:opacity-50"
                        >
                          {isOpening ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            <Eye className="w-3.5 h-3.5" />
                          )}
                          <span>View Report</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

