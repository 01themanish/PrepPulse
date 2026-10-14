import React from 'react';
import { Filter, CheckCircle2, XCircle, HelpCircle, Layers, ChevronsUpDown } from 'lucide-react';

export default function ResultFilters({
  activeFilter,
  onChangeFilter,
  counts,
  allExpanded,
  onToggleExpandAll,
}) {
  const filters = [
    { id: 'all', label: 'All Questions', count: counts.all, icon: Layers },
    { id: 'correct', label: 'Correct', count: counts.correct, icon: CheckCircle2, color: 'text-emerald-600' },
    { id: 'incorrect', label: 'Incorrect', count: counts.incorrect, icon: XCircle, color: 'text-rose-600' },
    { id: 'unanswered', label: 'Unanswered', count: counts.unanswered, icon: HelpCircle, color: 'text-slate-500' },
  ];

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 py-2 border-b border-slate-200 dark:border-slate-800">
      
      {/* Filter Tabs */}
      <div className="flex items-center flex-wrap gap-2">
        {filters.map((f) => {
          const Icon = f.icon;
          const isActive = activeFilter === f.id;

          return (
            <button
              key={f.id}
              type="button"
              onClick={() => onChangeFilter(f.id)}
              className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                isActive
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : f.color || 'text-slate-500'}`} />
              <span>{f.label}</span>
              <span
                className={`ml-1 px-1.5 py-0.2 rounded-full text-[10px] ${
                  isActive
                    ? 'bg-white/20 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                {f.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Expand / Collapse All Toggle */}
      <button
        type="button"
        onClick={onToggleExpandAll}
        className="inline-flex items-center space-x-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 self-start sm:self-auto"
      >
        <ChevronsUpDown className="w-3.5 h-3.5" />
        <span>{allExpanded ? 'Collapse All Explanations' : 'Expand All Explanations'}</span>
      </button>

    </div>
  );
}
