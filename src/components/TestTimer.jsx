import React from 'react';
import { Clock, AlertTriangle } from 'lucide-react';

export default function TestTimer({ formattedTime, isLowTime, isTimeUp }) {
  return (
    <div
      className={`inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-xl border transition-all duration-300 font-mono ${
        isLowTime
          ? 'border-rose-500 bg-rose-50 dark:bg-rose-950/70 text-rose-600 dark:text-rose-400 font-bold animate-timer-urgency shadow-md shadow-rose-500/20'
          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 shadow-sm'
      }`}
    >
      {isLowTime ? (
        <AlertTriangle className="w-4 h-4 text-rose-500 animate-pulse" />
      ) : (
        <Clock className="w-4 h-4 text-indigo-500" />
      )}
      <div className="flex flex-col">
        <span className="text-sm sm:text-base tracking-wider font-bold">
          {formattedTime}
        </span>
      </div>
      {isLowTime && (
        <span className="text-[10px] uppercase font-sans font-extrabold text-rose-500 tracking-wider hidden sm:inline-block">
          Low Time!
        </span>
      )}
    </div>
  );
}
