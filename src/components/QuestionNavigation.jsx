import React, { useState } from 'react';
import { 
  Check, 
  Bookmark, 
  HelpCircle, 
  Eye, 
  CheckCircle2, 
  CircleDot, 
  ChevronDown, 
  ChevronUp,
  LayoutGrid
} from 'lucide-react';

export default function QuestionNavigation({
  totalQuestions,
  currentIndex,
  userAnswers,
  markedForReview,
  visitedQuestions,
  onSelectQuestion,
}) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Helper to determine status of question i (0-indexed)
  const getQuestionStatus = (index, qId) => {
    const isAnswered = userAnswers[qId] !== undefined && userAnswers[qId] !== null && userAnswers[qId] !== '';
    const isMarked = markedForReview.has(qId);
    const isVisited = visitedQuestions.has(index);

    if (isAnswered && isMarked) return 'answered-marked';
    if (isMarked) return 'marked';
    if (isAnswered) return 'answered';
    if (isVisited) return 'visited-unanswered';
    return 'not-visited';
  };

  // Summary counts
  let answeredCount = 0;
  let markedCount = 0;
  let visitedUnansweredCount = 0;
  let notVisitedCount = 0;

  for (let i = 0; i < totalQuestions; i++) {
    const qId = i + 1; // Assuming 1-based IDs or passed question list
    const status = getQuestionStatus(i, qId);
    if (status === 'answered' || status === 'answered-marked') answeredCount++;
    if (status === 'marked' || status === 'answered-marked') markedCount++;
    if (status === 'visited-unanswered') visitedUnansweredCount++;
    if (status === 'not-visited') notVisitedCount++;
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 shadow-soft-lg space-y-5">
      
      {/* Panel Header & Mobile toggle */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
            <LayoutGrid className="w-4 h-4" />
          </div>
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">
            Question Palette
          </h2>
        </div>

        {/* Mobile Toggle Button */}
        <button
          type="button"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="lg:hidden p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          {isMobileOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Content (always open on desktop, collapsible on mobile) */}
      <div className={`space-y-5 ${isMobileOpen ? 'block' : 'hidden lg:block'}`}>
        
        {/* Numbered Questions Grid */}
        <div className="grid grid-cols-5 sm:grid-cols-6 lg:grid-cols-5 gap-2 max-h-72 overflow-y-auto p-1">
          {Array.from({ length: totalQuestions }).map((_, i) => {
            const qNum = i + 1;
            const isCurrent = currentIndex === i;
            const status = getQuestionStatus(i, qNum);

            let statusStyles = '';
            let indicator = null;

            switch (status) {
              case 'answered':
                statusStyles = 'bg-emerald-600 text-white border-emerald-600 shadow-sm';
                indicator = <Check className="w-2.5 h-2.5 absolute top-0.5 right-0.5 stroke-[3]" />;
                break;
              case 'marked':
                statusStyles = 'bg-purple-600 text-white border-purple-600 shadow-sm';
                indicator = <Bookmark className="w-2.5 h-2.5 absolute top-0.5 right-0.5 fill-current" />;
                break;
              case 'answered-marked':
                statusStyles = 'bg-purple-700 text-white border-purple-700 shadow-sm ring-2 ring-emerald-400';
                indicator = (
                  <span className="absolute top-0.5 right-0.5 w-2 h-2 rounded-full bg-emerald-400 ring-1 ring-white"></span>
                );
                break;
              case 'visited-unanswered':
                statusStyles = 'bg-amber-50 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-300 dark:border-amber-700';
                indicator = (
                  <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                );
                break;
              default: // not-visited
                statusStyles = 'bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-slate-300';
                break;
            }

            return (
              <button
                key={i}
                type="button"
                onClick={() => onSelectQuestion(i)}
                className={`relative h-10 rounded-xl font-bold text-xs border transition-all flex items-center justify-center focus:outline-none ${statusStyles} ${
                  isCurrent ? 'ring-2 ring-indigo-500 ring-offset-2 dark:ring-offset-slate-900 scale-105 z-10' : ''
                }`}
                title={`Question ${qNum}: ${status.replace('-', ' ')}`}
              >
                <span>{qNum}</span>
                {indicator}
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2 text-xs">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">
            Status Legend
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2 text-slate-600 dark:text-slate-300">
            <div className="flex items-center space-x-2">
              <span className="w-3.5 h-3.5 rounded bg-emerald-600 flex-shrink-0 flex items-center justify-center text-white">
                <Check className="w-2.5 h-2.5" />
              </span>
              <span>Answered</span>
            </div>

            <div className="flex items-center space-x-2">
              <span className="w-3.5 h-3.5 rounded bg-purple-600 flex-shrink-0 flex items-center justify-center text-white">
                <Bookmark className="w-2.5 h-2.5 fill-current" />
              </span>
              <span>Marked for Review</span>
            </div>

            <div className="flex items-center space-x-2">
              <span className="w-3.5 h-3.5 rounded bg-purple-700 ring-1 ring-emerald-400 flex-shrink-0"></span>
              <span>Answered & Marked</span>
            </div>

            <div className="flex items-center space-x-2">
              <span className="w-3.5 h-3.5 rounded bg-amber-100 dark:bg-amber-950 border border-amber-300 flex-shrink-0"></span>
              <span>Visited (Unanswered)</span>
            </div>

            <div className="flex items-center space-x-2">
              <span className="w-3.5 h-3.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 flex-shrink-0"></span>
              <span>Not Visited</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
