import { useState } from 'react';
import { Navbar } from './components/Navbar';
import { NewAnalysisPage } from './pages/NewAnalysisPage';
import { ReportPage } from './pages/ReportPage';
import { HistoryPage } from './pages/HistoryPage';
import { AnalysisDetail, AnalysisResponse } from './types';

export function App() {
  const [activeTab, setActiveTab] = useState<'new' | 'history' | 'report'>('new');
  const [currentReport, setCurrentReport] = useState<AnalysisDetail | null>(null);

  const handleAnalysisSuccess = (analysis: AnalysisResponse) => {
    const fullDetail: AnalysisDetail = {
      ...analysis,
      jobDescription: '',
      resume: '',
    };
    setCurrentReport(fullDetail);
    setActiveTab('report');
  };

  const handleSelectHistoryAnalysis = (analysis: AnalysisDetail) => {
    setCurrentReport(analysis);
    setActiveTab('report');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        hasCurrentReport={currentReport !== null}
      />

      <main className="flex-1 pb-16">
        {activeTab === 'new' && (
          <NewAnalysisPage onAnalysisSuccess={handleAnalysisSuccess} />
        )}

        {activeTab === 'report' && currentReport && (
          <ReportPage
            analysis={currentReport}
            onBackToNew={() => setActiveTab('new')}
            onGoToHistory={() => setActiveTab('history')}
          />
        )}

        {activeTab === 'history' && (
          <HistoryPage
            onSelectAnalysis={handleSelectHistoryAnalysis}
            onGoToNew={() => setActiveTab('new')}
          />
        )}
      </main>

      <footer className="border-t border-slate-200 py-6 bg-white text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Resume Screener Assistant &copy; {new Date().getFullYear()} — Internal HR Evaluation Tool</span>
          <span className="text-slate-400">Decision-Support System • OpenRouter Nemotron 3.5</span>
        </div>
      </footer>
    </div>
  );
}

export default App;
