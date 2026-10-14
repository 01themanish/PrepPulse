import React from 'react';
import { AlertCircle, CheckCircle2, XCircle, HelpCircle } from 'lucide-react';

export default function NegativeMarkingSettings({
  enabled,
  onToggleEnabled,
  penalty,
  onChangePenalty,
  marksPerCorrect,
}) {
  const handlePenaltyChange = (e) => {
    const val = parseFloat(e.target.value);
    if (isNaN(val)) {
      onChangePenalty(0);
    } else {
      onChangePenalty(Math.max(0, val));
    }
  };

  return (
    <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 shadow-sm transition-colors">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Negative Marking
            </h3>
            <span
              className={`px-2 py-0.5 text-xs font-semibold rounded-full border ${
                enabled
                  ? 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-900'
                  : 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'
              }`}
            >
              {enabled ? 'Active Penalty' : 'Disabled'}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Penalize guessing by deducting marks for every incorrect answer.
          </p>
        </div>

        {/* Toggle Switch */}
        <button
          type="button"
          role="switch"
          aria-checked={enabled}
          onClick={() => onToggleEnabled(!enabled)}
          className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 dark:focus:ring-offset-slate-900 ${
            enabled ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'
          }`}
        >
          <span
            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
              enabled ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
      </div>

      {/* Penalty Input section */}
      {enabled && (
        <div className="mt-4 pt-4 border-t border-slate-200/80 dark:border-slate-800/80 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Penalty per Incorrect Answer (Marks)
            </label>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Standard competitive exam penalty is 0.25 (1/4th) or 0.33 (1/3rd).
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <div className="relative w-32">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-rose-500 font-bold text-sm">
                -
              </span>
              <input
                type="number"
                min="0"
                max={marksPerCorrect}
                step="0.05"
                value={penalty}
                onChange={handlePenaltyChange}
                className="w-full pl-7 pr-3 py-1.5 text-sm font-semibold rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            {/* Quick presets */}
            <div className="flex space-x-1">
              {[0.25, 0.33, 0.5].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => onChangePenalty(preset)}
                  className={`px-2 py-1 text-xs rounded font-medium border ${
                    penalty === preset
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                  }`}
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Scoring Rules Explanation Banner */}
      <div className="mt-4 p-3 rounded-xl bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex items-start space-x-3 text-xs">
        <HelpCircle className="w-4 h-4 text-indigo-500 mt-0.5 flex-shrink-0" />
        <div className="text-slate-600 dark:text-slate-300 leading-relaxed">
          <span className="font-semibold text-slate-800 dark:text-slate-200">Scoring Scheme Applied: </span>
          Correct Answer: <strong className="text-emerald-600 dark:text-emerald-400">+{marksPerCorrect} mark</strong>
          {' • '}
          Incorrect Answer: <strong className="text-rose-600 dark:text-rose-400">
            {enabled ? `-${penalty} mark` : '0 marks (no penalty)'}
          </strong>
          {' • '}
          Unanswered: <strong className="text-slate-500">0 marks</strong>.
        </div>
      </div>
    </div>
  );
}
