import React from 'react';

interface ScoreBadgeProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
}

export const ScoreBadge: React.FC<ScoreBadgeProps> = ({ score, size = 'md' }) => {
  let colorClasses = 'bg-emerald-100 text-emerald-800 border-emerald-300';
  let label = 'Strong Match';

  if (score < 50) {
    colorClasses = 'bg-rose-100 text-rose-800 border-rose-300';
    label = 'Low Match';
  } else if (score < 75) {
    colorClasses = 'bg-amber-100 text-amber-800 border-amber-300';
    label = 'Moderate Match';
  }

  if (size === 'lg') {
    return (
      <div className={`flex flex-col items-center justify-center p-6 rounded-2xl border-2 ${colorClasses}`}>
        <span className="text-5xl font-black tracking-tight">{score}</span>
        <span className="text-xs uppercase font-bold tracking-wider mt-1 opacity-80">out of 100</span>
        <span className="text-sm font-semibold mt-2 px-3 py-1 rounded-full bg-white/60 border border-current">
          {label}
        </span>
      </div>
    );
  }

  if (size === 'sm') {
    return (
      <span
        className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold border ${colorClasses}`}
      >
        {score} / 100
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold border ${colorClasses}`}
    >
      <span className="font-bold">{score}</span>
      <span className="opacity-70 text-xs">/100</span>
      <span className="text-xs ml-1 opacity-90">({label})</span>
    </span>
  );
};

