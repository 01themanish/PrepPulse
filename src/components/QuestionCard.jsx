import React from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Bookmark, 
  RotateCcw, 
  Send, 
  HelpCircle,
  Check
} from 'lucide-react';

export default function QuestionCard({
  question,
  currentIndex,
  totalQuestions,
  selectedAnswer,
  isMarkedForReview,
  onSelectAnswer,
  onClearAnswer,
  onToggleMarkForReview,
  onPrev,
  onNext,
  onSubmit,
}) {
  if (!question) return null;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-soft-lg flex flex-col justify-between min-h-[500px]">
      
      {/* Top Question Info & Action Badges */}
      <div className="space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 rounded-xl text-xs font-extrabold bg-indigo-600 text-white shadow-sm">
              Q{currentIndex + 1}
            </span>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Question {currentIndex + 1} of {totalQuestions}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            {isMarkedForReview && (
              <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                <Bookmark className="w-3 h-3 fill-current" />
                <span>Marked for Review</span>
              </span>
            )}
          </div>
        </div>

        {/* Question Text */}
        <div className="text-slate-900 dark:text-white text-base sm:text-lg lg:text-xl font-semibold leading-relaxed tracking-tight">
          {question.question}
        </div>

        {/* 4 Answer Options */}
        <div className="space-y-3 pt-2">
          {question.options.map((option) => {
            const isSelected = selectedAnswer === option.id;

            return (
              <button
                key={option.id}
                type="button"
                onClick={() => onSelectAnswer(option.id)}
                className={`w-full text-left p-4 rounded-2xl border-2 transition-all duration-200 flex items-start space-x-3.5 group focus:outline-none focus:ring-2 focus:ring-indigo-500/50 ${
                  isSelected
                    ? 'border-indigo-600 dark:border-indigo-500 bg-indigo-50/70 dark:bg-indigo-950/40 shadow-sm ring-1 ring-indigo-500'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50/60 dark:hover:bg-slate-800/50'
                }`}
              >
                {/* Option Identifier Badge (A, B, C, D) */}
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold transition-colors flex-shrink-0 mt-0.5 ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 group-hover:bg-slate-200 dark:group-hover:bg-slate-700'
                  }`}
                >
                  {isSelected ? <Check className="w-4 h-4 stroke-[3]" /> : option.id}
                </div>

                {/* Option Text */}
                <div className="flex-1 text-sm sm:text-base font-medium text-slate-800 dark:text-slate-200 leading-snug">
                  {option.text}
                </div>

                {/* Radio Indicator */}
                <div className="mt-1">
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-600'
                        : 'border-slate-300 dark:border-slate-700 group-hover:border-slate-400'
                    }`}
                  >
                    {isSelected && <div className="w-2 h-2 rounded-full bg-white"></div>}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Action Controls */}
      <div className="pt-8 mt-8 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Left actions: Clear Answer & Mark for Review */}
        <div className="flex items-center space-x-2 w-full sm:w-auto justify-between sm:justify-start">
          <button
            type="button"
            disabled={!selectedAnswer}
            onClick={onClearAnswer}
            className={`inline-flex items-center space-x-1.5 px-3 py-2 text-xs font-semibold rounded-xl border transition-colors ${
              selectedAnswer
                ? 'text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'
                : 'text-slate-300 dark:text-slate-700 border-transparent cursor-not-allowed'
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Clear Answer</span>
          </button>

          <button
            type="button"
            onClick={onToggleMarkForReview}
            className={`inline-flex items-center space-x-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl border transition-all ${
              isMarkedForReview
                ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                : 'text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/60 border-purple-200 dark:border-purple-800 hover:bg-purple-100 dark:hover:bg-purple-900'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isMarkedForReview ? 'fill-current' : ''}`} />
            <span>{isMarkedForReview ? 'Unmark Review' : 'Mark for Review'}</span>
          </button>
        </div>

        {/* Right actions: Previous, Next / Submit */}
        <div className="flex items-center space-x-3 w-full sm:w-auto justify-between sm:justify-end">
          <button
            type="button"
            disabled={currentIndex === 0}
            onClick={onPrev}
            className={`inline-flex items-center space-x-1 px-4 py-2 text-sm font-semibold rounded-xl border transition-colors ${
              currentIndex > 0
                ? 'text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700'
                : 'text-slate-300 dark:text-slate-700 border-transparent cursor-not-allowed'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          {currentIndex < totalQuestions - 1 ? (
            <button
              type="button"
              onClick={onNext}
              className="inline-flex items-center space-x-1.5 px-5 py-2 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md shadow-indigo-500/20 transition-all"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={onSubmit}
              className="inline-flex items-center space-x-1.5 px-5 py-2 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md shadow-emerald-600/20 transition-all"
            >
              <span>Review & Submit</span>
              <Send className="w-4 h-4" />
            </button>
          )}
        </div>

      </div>

    </div>
  );
}
