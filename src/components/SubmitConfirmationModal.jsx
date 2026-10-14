import React from 'react';
import { AlertCircle, CheckCircle2, Bookmark, Clock, X, Send } from 'lucide-react';

export default function SubmitConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  totalQuestions,
  answeredCount,
  unansweredCount,
  markedCount,
  formattedTimeRemaining,
}) {
  if (!isOpen) return null;

  const hasUnanswered = unansweredCount > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div 
        className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden"
        role="dialog"
        aria-modal="true"
      >
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/40">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-indigo-600 text-white shadow-sm">
              <Send className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Submit Examination?
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Please verify your attempt status before finalizing.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Details */}
        <div className="p-6 space-y-5">
          
          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900">
              <div className="flex items-center justify-center space-x-1 text-emerald-600 dark:text-emerald-400 mb-1">
                <CheckCircle2 className="w-4 h-4" />
                <span className="text-xs font-semibold">Answered</span>
              </div>
              <span className="text-2xl font-extrabold text-emerald-700 dark:text-emerald-300">
                {answeredCount}
              </span>
              <span className="text-[11px] text-emerald-600/70 dark:text-emerald-400/70 block">
                of {totalQuestions} questions
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900">
              <div className="flex items-center justify-center space-x-1 text-amber-600 dark:text-amber-400 mb-1">
                <AlertCircle className="w-4 h-4" />
                <span className="text-xs font-semibold">Unanswered</span>
              </div>
              <span className="text-2xl font-extrabold text-amber-700 dark:text-amber-300">
                {unansweredCount}
              </span>
              <span className="text-[11px] text-amber-600/70 dark:text-amber-400/70 block">
                questions remaining
              </span>
            </div>
          </div>

          {/* Time & Marked info */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-600 dark:text-slate-300">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-indigo-500" />
              <span>Time Remaining: <strong className="text-slate-900 dark:text-white font-mono">{formattedTimeRemaining}</strong></span>
            </div>
            {markedCount > 0 && (
              <div className="flex items-center space-x-1 text-purple-600 dark:text-purple-400 font-semibold">
                <Bookmark className="w-3.5 h-3.5 fill-current" />
                <span>{markedCount} Marked for review</span>
              </div>
            )}
          </div>

          {/* Warning banner if questions unanswered */}
          {hasUnanswered && (
            <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 flex items-start space-x-2.5 text-xs text-rose-700 dark:text-rose-300">
              <AlertCircle className="w-4 h-4 text-rose-500 mt-0.5 flex-shrink-0" />
              <span>
                <strong>Warning:</strong> You still have {unansweredCount} unanswered question{unansweredCount > 1 ? 's' : ''}. Unanswered questions receive 0 marks. Once submitted, you cannot change your answers.
              </span>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800 rounded-xl transition-colors"
          >
            Return to Test
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-5 py-2.5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md shadow-indigo-500/20 transition-all flex items-center space-x-1.5"
          >
            <span>Confirm & Submit</span>
            <Send className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}
