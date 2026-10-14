import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  Trophy, 
  RotateCcw, 
  PlusCircle, 
  Copy, 
  Check, 
  Target, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  Printer, 
  ArrowDown, 
  AlertTriangle 
} from 'lucide-react';

export default function ResultSummary({
  results,
  testTitle,
  testTopic,
  onRetakeTest,
  onCreateNewTest,
  onReviewIncorrect,
}) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Fire confetti celebratory burst if percentage >= 60%
    if (results.percentage >= 60) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#6366f1', '#10b981', '#f59e0b', '#ec4899'],
        });
      } catch (e) {
        // Safe fallback
      }
    }
  }, [results.percentage]);

  const handleCopySummary = async () => {
    const summaryText = `📊 ${testTitle} - Test Results
Topic: ${testTopic}
Final Score: ${results.finalScore} / ${results.maxPossibleMarks} marks (${results.percentage}%)
Accuracy: ${results.accuracy !== null ? `${results.accuracy}%` : 'N/A'}
Correct: ${results.correctCount} | Incorrect: ${results.incorrectCount} | Unanswered: ${results.unansweredCount}
Time Taken: ${Math.floor(results.timeTakenSeconds / 60)}m ${results.timeTakenSeconds % 60}s
Assessed on PrepPulse AI Platform`;

    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(summaryText);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = summaryText;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Failed to copy summary', err);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Performance qualitative message
  let gradeMessage = 'Needs Practice';
  let gradeColor = 'text-amber-600 dark:text-amber-400';
  let gradeBg = 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900';

  if (results.percentage >= 85) {
    gradeMessage = 'Mastery / Excellent';
    gradeColor = 'text-emerald-600 dark:text-emerald-400';
    gradeBg = 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900';
  } else if (results.percentage >= 65) {
    gradeMessage = 'Good Performance';
    gradeColor = 'text-indigo-600 dark:text-indigo-400';
    gradeBg = 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-900';
  } else if (results.percentage >= 40) {
    gradeMessage = 'Average / Keep Practicing';
  }

  const formatSecs = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}m ${s < 10 ? '0' : ''}${s}s`;
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-soft-lg space-y-8">
      
      {/* Top Banner: Score & Percentage */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-6 pb-6 border-b border-slate-200/80 dark:border-slate-800/80">
        
        {/* Left: Overall Score Card */}
        <div className="flex items-center space-x-5 text-center sm:text-left">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-xl shadow-indigo-500/25 flex-shrink-0">
            <Trophy className="w-10 h-10 sm:w-12 sm:h-12" />
          </div>

          <div className="space-y-1">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold border mb-1" className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold border ${gradeBg} ${gradeColor}`}>
              <span>{gradeMessage}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Assessment Report
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              {testTitle} • <strong className="text-slate-700 dark:text-slate-300">{testTopic}</strong>
            </p>
          </div>
        </div>

        {/* Right: Big Score Numbers */}
        <div className="flex items-center space-x-6 bg-slate-50 dark:bg-slate-800/60 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
          <div>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 block">
              Marks Obtained
            </span>
            <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
              {results.finalScore}
              <span className="text-lg font-medium text-slate-400 dark:text-slate-500">
                {' '}/ {results.maxPossibleMarks}
              </span>
            </div>
          </div>

          <div className="h-10 w-px bg-slate-200 dark:bg-slate-700"></div>

          <div>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 block">
              Percentage
            </span>
            <div className={`text-3xl sm:text-4xl font-extrabold ${results.percentage >= 50 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
              {results.percentage}%
            </div>
          </div>
        </div>

      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        
        {/* Total Questions */}
        <div className="p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 text-center">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400 block mb-1">
            Total Questions
          </span>
          <span className="text-2xl font-bold text-slate-900 dark:text-white">
            {results.totalQuestions}
          </span>
        </div>

        {/* Correct Count */}
        <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 text-center">
          <div className="flex items-center justify-center space-x-1 text-emerald-600 dark:text-emerald-400 mb-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span className="text-xs font-medium">Correct</span>
          </div>
          <span className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">
            {results.correctCount}
          </span>
        </div>

        {/* Incorrect Count */}
        <div className="p-4 rounded-2xl bg-rose-50/70 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-center">
          <div className="flex items-center justify-center space-x-1 text-rose-600 dark:text-rose-400 mb-1">
            <XCircle className="w-3.5 h-3.5" />
            <span className="text-xs font-medium">Incorrect</span>
          </div>
          <span className="text-2xl font-bold text-rose-700 dark:text-rose-300">
            {results.incorrectCount}
          </span>
        </div>

        {/* Unanswered Count */}
        <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-center">
          <div className="flex items-center justify-center space-x-1 text-slate-500 dark:text-slate-400 mb-1">
            <HelpCircle className="w-3.5 h-3.5" />
            <span className="text-xs font-medium">Unanswered</span>
          </div>
          <span className="text-2xl font-bold text-slate-700 dark:text-slate-300">
            {results.unansweredCount}
          </span>
        </div>

        {/* Accuracy */}
        <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/60 text-center">
          <div className="flex items-center justify-center space-x-1 text-indigo-600 dark:text-indigo-400 mb-1">
            <Target className="w-3.5 h-3.5" />
            <span className="text-xs font-medium">Accuracy</span>
          </div>
          <span className="text-2xl font-bold text-indigo-700 dark:text-indigo-300">
            {results.accuracy !== null ? `${results.accuracy}%` : 'N/A'}
          </span>
        </div>

        {/* Time Taken */}
        <div className="p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 text-center">
          <div className="flex items-center justify-center space-x-1 text-slate-500 dark:text-slate-400 mb-1">
            <Clock className="w-3.5 h-3.5" />
            <span className="text-xs font-medium">Time Taken</span>
          </div>
          <span className="text-2xl font-bold text-slate-900 dark:text-white">
            {formatSecs(results.timeTakenSeconds)}
          </span>
        </div>

      </div>

      {/* Progress Bar of Completion & Score */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>Question Distribution</span>
          <span>
            {results.correctCount} Correct • {results.incorrectCount} Incorrect • {results.unansweredCount} Skipped
          </span>
        </div>
        <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex">
          <div
            style={{ width: `${(results.correctCount / results.totalQuestions) * 100}%` }}
            className="bg-emerald-500 h-full transition-all duration-500"
            title="Correct"
          />
          <div
            style={{ width: `${(results.incorrectCount / results.totalQuestions) * 100}%` }}
            className="bg-rose-500 h-full transition-all duration-500"
            title="Incorrect"
          />
          <div
            style={{ width: `${(results.unansweredCount / results.totalQuestions) * 100}%` }}
            className="bg-slate-300 dark:bg-slate-700 h-full transition-all duration-500"
            title="Unanswered"
          />
        </div>
      </div>

      {/* Negative Marking Summary Callout */}
      {results.negativeMarkingEnabled && results.incorrectCount > 0 && (
        <div className="p-3.5 rounded-xl bg-rose-50/60 dark:bg-rose-950/30 border border-rose-200/80 dark:border-rose-900/40 flex items-center justify-between text-xs text-rose-700 dark:text-rose-300">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-rose-500 flex-shrink-0" />
            <span>
              Negative marking deducted a total penalty of <strong>{(results.incorrectCount * results.penaltyPerIncorrectAnswer).toFixed(2)} marks</strong> ({results.incorrectCount} incorrect × {results.penaltyPerIncorrectAnswer} penalty).
            </span>
          </div>
        </div>
      )}

      {/* Action Buttons Toolbar */}
      <div className="pt-2 flex flex-wrap items-center justify-between gap-3 no-print">
        
        {/* Left actions: Copy & Print */}
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={handleCopySummary}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl transition-colors border border-slate-200 dark:border-slate-700"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied Summary!' : 'Copy Result Summary'}</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl transition-colors border border-slate-200 dark:border-slate-700"
            title="Print or Save as PDF"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Print Report</span>
          </button>
        </div>

        {/* Right actions: Retake & Create New Test */}
        <div className="flex items-center space-x-3 w-full sm:w-auto">
          {results.incorrectCount > 0 && (
            <button
              type="button"
              onClick={onReviewIncorrect}
              className="flex-1 sm:flex-none inline-flex items-center justify-center space-x-1.5 px-4 py-2 text-xs sm:text-sm font-semibold text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 dark:hover:bg-rose-900 rounded-xl transition-colors border border-rose-200 dark:border-rose-900"
            >
              <ArrowDown className="w-3.5 h-3.5" />
              <span>Review Mistakes</span>
            </button>
          )}

          <button
            type="button"
            onClick={onRetakeTest}
            className="flex-1 sm:flex-none inline-flex items-center justify-center space-x-1.5 px-4 py-2 text-xs sm:text-sm font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900 rounded-xl transition-colors border border-indigo-200 dark:border-indigo-800"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Retake Test</span>
          </button>

          <button
            type="button"
            onClick={onCreateNewTest}
            className="flex-1 sm:flex-none inline-flex items-center justify-center space-x-1.5 px-5 py-2 text-xs sm:text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md shadow-indigo-500/20 transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create Another Test</span>
          </button>
        </div>

      </div>

    </div>
  );
}
