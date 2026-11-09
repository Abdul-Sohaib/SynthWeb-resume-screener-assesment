import React from 'react';
import { FileSearch, Sparkles, History, PlusCircle } from 'lucide-react';

interface NavbarProps {
  activeTab: 'new' | 'history' | 'report';
  setActiveTab: (tab: 'new' | 'history' | 'report') => void;
  hasCurrentReport: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  hasCurrentReport,
}) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-600 rounded-lg text-white shadow-sm">
              <FileSearch className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900 leading-tight">
                Resume Screener Assistant
              </h1>
              <p className="text-xs text-slate-500 font-medium flex items-center gap-1">
                <span>Internal HR Evaluation Tool</span>
                <span className="inline-block w-1 h-1 rounded-full bg-slate-300"></span>
                <span className="text-indigo-600 font-semibold flex items-center gap-0.5">
                  <Sparkles className="w-3 h-3 inline" /> AI Powered
                </span>
              </p>
            </div>
          </div>

          <nav className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('new')}
              className={`flex items-center gap-2 px-3.5 py-2 text-sm font-medium rounded-lg transition-colors ${
                activeTab === 'new'
                  ? 'bg-indigo-50 text-indigo-700 font-semibold border border-indigo-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <PlusCircle className="w-4 h-4" />
              <span>New Analysis</span>
            </button>

            {hasCurrentReport && (
              <button
                onClick={() => setActiveTab('report')}
                className={`flex items-center gap-2 px-3.5 py-2 text-sm font-medium rounded-lg transition-colors ${
                  activeTab === 'report'
                    ? 'bg-indigo-50 text-indigo-700 font-semibold border border-indigo-200'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>Current Report</span>
              </button>
            )}

            <button
              onClick={() => setActiveTab('history')}
              className={`flex items-center gap-2 px-3.5 py-2 text-sm font-medium rounded-lg transition-colors ${
                activeTab === 'history'
                  ? 'bg-indigo-50 text-indigo-700 font-semibold border border-indigo-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <History className="w-4 h-4" />
              <span>History</span>
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};

