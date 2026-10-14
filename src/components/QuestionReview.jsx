import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  Lightbulb, 
  ArrowUp,
  Check,
  X
} from 'lucide-react';
import ResultFilters from './ResultFilters';

export default function QuestionReview({
  questionBreakdown = [],
  activeFilter = 'all',
  onChangeFilter,
}) {
  const [expandedMap, setExpandedMap] = useState({});
  const [allExpanded, setAllExpanded] = useState(true);

  // Initialize all explanations expanded by default
  useEffect(() => {
    const initial = {};
    questionBreakdown.forEach((q) => {
      initial[q.id] = true;
    });
    setExpandedMap(initial);
  }, [questionBreakdown]);

  const toggleExpand = (id) => {
    setExpandedMap((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleToggleExpandAll = () => {
    const nextState = !allExpanded;
    setAllExpanded(nextState);
    const updated = {};
    questionBreakdown.forEach((q) => {
      updated[q.id] = nextState;
    });
    setExpandedMap(updated);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Filter questions
  const filteredQuestions = questionBreakdown.filter((q) => {
    if (activeFilter === 'correct') return q.isCorrect;
    if (activeFilter === 'incorrect') return q.isIncorrect;
    if (activeFilter === 'unanswered') return q.isUnanswered;
    return true;
  });

  const counts = {
    all: questionBreakdown.length,
    correct: questionBreakdown.filter((q) => q.isCorrect).length,
    incorrect: questionBreakdown.filter((q) => q.isIncorrect).length,
    unanswered: questionBreakdown.filter((q) => q.isUnanswered).length,
  };

  return (
    <div id="review-section" className="space-y-6">
      
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            Question-by-Question Review
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Analyze your answers, understand mistakes, and review explanations.
          </p>
        </div>

        <button
          type="button"
          onClick={scrollToTop}
          className="inline-flex items-center space-x-1 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 self-start sm:self-auto"
        >
          <ArrowUp className="w-3.5 h-3.5" />
          <span>Back to Top</span>
        </button>
      </div>

      {/* Filter Tabs & Expand Toggle */}
      <ResultFilters
        activeFilter={activeFilter}
        onChangeFilter={onChangeFilter}
        counts={counts}
        allExpanded={allExpanded}
        onToggleExpandAll={handleToggleExpandAll}
      />

      {/* Question Cards List */}
      <div className="space-y-6">
        {filteredQuestions.length === 0 ? (
          <div className="p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-center text-slate-500 dark:text-slate-400">
            No questions found in this category.
          </div>
        ) : (
          filteredQuestions.map((q) => {
            const isExpanded = Boolean(expandedMap[q.id]);
            const normCorrect = String(q.correctAnswer).trim().toUpperCase();
            const normSelected = q.selectedAnswerId ? String(q.selectedAnswerId).trim().toUpperCase() : null;

            let cardBorder = 'border-slate-200 dark:border-slate-800';
            let statusBadge = null;

            if (q.isCorrect) {
              cardBorder = 'border-emerald-200 dark:border-emerald-900/60';
              statusBadge = (
                <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Correct (+{q.marksAwarded})</span>
                </div>
              );
            } else if (q.isIncorrect) {
              cardBorder = 'border-rose-200 dark:border-rose-900/60';
              statusBadge = (
                <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
                  <XCircle className="w-3.5 h-3.5" />
                  <span>Incorrect ({q.marksAwarded} marks)</span>
                </div>
              );
            } else {
              cardBorder = 'border-slate-200 dark:border-slate-700';
              statusBadge = (
                <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>Not Attempted (0 marks)</span>
                </div>
              );
            }

            return (
              <div
                key={q.id}
                className={`bg-white dark:bg-slate-900 rounded-3xl border ${cardBorder} p-6 sm:p-7 shadow-soft space-y-6 transition-all`}
              >
                
                {/* Header: Question # and Status Badge */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center space-x-3">
                    <span className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center justify-center">
                      Q{q.index}
                    </span>
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                      Question {q.index} of {questionBreakdown.length}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    {statusBadge}
                  </div>
                </div>

                {/* Question Statement */}
                <div className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-relaxed">
                  {q.question}
                </div>

                {/* 4 Options Grid */}
                <div className="space-y-2.5">
                  {q.options.map((opt) => {
                    const optIdNorm = String(opt.id).trim().toUpperCase();
                    const isOptionCorrect = optIdNorm === normCorrect;
                    const isOptionSelected = optIdNorm === normSelected;

                    let optStyle = 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300';
                    let badge = null;

                    if (isOptionCorrect && isOptionSelected) {
                      // User selected correct answer
                      optStyle = 'border-emerald-500 bg-emerald-50/80 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-100 ring-1 ring-emerald-500';
                      badge = (
                        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-600 text-white">
                          <Check className="w-3 h-3 stroke-[3]" />
                          <span>Your Correct Answer</span>
                        </span>
                      );
                    } else if (isOptionCorrect && !isOptionSelected) {
                      // Correct answer that user missed
                      optStyle = 'border-emerald-500/80 bg-emerald-50/40 dark:bg-emerald-950/20 text-emerald-900 dark:text-emerald-100';
                      badge = (
                        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-700">
                          <Check className="w-3 h-3" />
                          <span>Correct Answer</span>
                        </span>
                      );
                    } else if (isOptionSelected && !isOptionCorrect) {
                      // User selected incorrect answer
                      optStyle = 'border-rose-500 bg-rose-50/80 dark:bg-rose-950/40 text-rose-900 dark:text-rose-100 ring-1 ring-rose-500';
                      badge = (
                        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-rose-600 text-white">
                          <X className="w-3 h-3 stroke-[3]" />
                          <span>Your Selection (Incorrect)</span>
                        </span>
                      );
                    }

                    return (
                      <div
                        key={opt.id}
                        className={`p-3.5 sm:p-4 rounded-2xl border-2 flex items-start justify-between space-x-3 transition-colors ${optStyle}`}
                      >
                        <div className="flex items-start space-x-3 flex-1">
                          <span className={`w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5 ${
                            isOptionCorrect
                              ? 'bg-emerald-600 text-white'
                              : isOptionSelected
                              ? 'bg-rose-600 text-white'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                          }`}>
                            {opt.id}
                          </span>
                          <span className="text-sm font-medium leading-relaxed">
                            {opt.text}
                          </span>
                        </div>

                        {badge && (
                          <div className="flex-shrink-0 self-center">
                            {badge}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Explanation Section */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => toggleExpand(q.id)}
                    className="flex items-center justify-between w-full py-1 text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                  >
                    <span className="flex items-center space-x-1.5">
                      <Lightbulb className="w-4 h-4 text-amber-500" />
                      <span>Explanation & Insights</span>
                    </span>
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>

                  {isExpanded && (
                    <div className="mt-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed space-y-1">
                      <strong className="text-slate-900 dark:text-white font-semibold block">
                        Why Option {q.correctAnswer} is correct:
                      </strong>
                      <p>{q.explanation}</p>
                    </div>
                  )}
                </div>

              </div>
            );
          })
        )}
      </div>

      {/* Floating Scroll to Top button */}
      <div className="flex justify-center pt-6 no-print">
        <button
          type="button"
          onClick={scrollToTop}
          className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
        >
          <ArrowUp className="w-4 h-4" />
          <span>Back to Top of Results</span>
        </button>
      </div>

    </div>
  );
}
