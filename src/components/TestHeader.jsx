import React from 'react';
import { Send, CheckCircle2, CircleDashed, BookmarkCheck } from 'lucide-react';
import TestTimer from './TestTimer';

export default function TestHeader({
  title,
  topic,
  difficulty,
  currentIndex,
  totalQuestions,
  answeredCount,
  unansweredCount,
  markedCount,
  formattedTime,
  isLowTime,
  isTimeUp,
  onSubmitClick,
}) {
  return (
    <div className="sticky top-16 z-20 w-full border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-sm transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          
          {/* Left: Title, Topic, Difficulty & Current Question # */}
          <div className="flex items-center justify-between sm:justify-start space-x-3">
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white line-clamp-1">
                  {title}
                </h1>
                <span className="px-2 py-0.5 text-[11px] font-bold rounded-full bg-indigo-100 text-indigo-800 dark:bg-indigo-900/60 dark:text-indigo-300">
                  {difficulty}
                </span>
              </div>
              <div className="flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                <span>{topic}</span>
                <span>•</span>
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  Question {currentIndex + 1} of {totalQuestions}
                </span>
              </div>
            </div>
          </div>

          {/* Right: Counts, Timer, and Submit Test Button */}
          <div className="flex items-center justify-between md:justify-end space-x-3 sm:space-x-4">
            
            {/* Live Progress stats */}
            <div className="hidden sm:flex items-center space-x-3 text-xs">
              <div className="flex items-center space-x-1.5 text-emerald-600 dark:text-emerald-400 font-semibold" title="Answered questions">
                <CheckCircle2 className="w-4 h-4" />
                <span>{answeredCount} Answered</span>
              </div>
              <div className="flex items-center space-x-1.5 text-slate-500 dark:text-slate-400" title="Unanswered questions">
                <CircleDashed className="w-4 h-4" />
                <span>{unansweredCount} Left</span>
              </div>
            </div>

            {/* Timer component */}
            <TestTimer
              formattedTime={formattedTime}
              isLowTime={isLowTime}
              isTimeUp={isTimeUp}
            />

            {/* Submit Test Button */}
            <button
              type="button"
              onClick={onSubmitClick}
              className="inline-flex items-center space-x-1.5 px-4 py-2 text-xs sm:text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 rounded-xl shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
            >
              <span>Submit Test</span>
              <Send className="w-3.5 h-3.5" />
            </button>

          </div>

        </div>
      </div>
    </div>
  );
}
