import React from 'react';
import { ShieldCheck, Zap, Flame, Shuffle } from 'lucide-react';

const DIFFICULTIES = [
  {
    id: 'Easy',
    label: 'Easy',
    tagline: 'Foundations & Concepts',
    desc: 'Basic definitions, syntax, and foundational principles.',
    icon: ShieldCheck,
    color: 'emerald',
    badge: 'Beginner',
  },
  {
    id: 'Medium',
    label: 'Medium',
    tagline: 'Standard Exam Level',
    desc: 'Conceptual application, reasoning, and typical interview questions.',
    icon: Zap,
    color: 'indigo',
    badge: 'Popular',
  },
  {
    id: 'Hard',
    label: 'Hard',
    tagline: 'Advanced & Edge Cases',
    desc: 'Deep architecture, edge cases, tricky outputs, and optimization.',
    icon: Flame,
    color: 'rose',
    badge: 'Advanced',
  },
  {
    id: 'Mixed',
    label: 'Mixed',
    tagline: 'Balanced Distribution',
    desc: 'A realistic blend of Easy (~30%), Medium (~40%), and Hard (~30%).',
    icon: Shuffle,
    color: 'purple',
    badge: 'Comprehensive',
  },
];

export default function DifficultySelector({ value, onChange }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="block text-sm font-semibold text-slate-900 dark:text-slate-100">
          Difficulty Level <span className="text-rose-500">*</span>
        </label>
        <span className="text-xs text-slate-500 dark:text-slate-400">
          Selected: <strong className="text-indigo-600 dark:text-indigo-400">{value}</strong>
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {DIFFICULTIES.map((diff) => {
          const Icon = diff.icon;
          const isSelected = value === diff.id;

          return (
            <button
              key={diff.id}
              type="button"
              onClick={() => onChange(diff.id)}
              className={`relative text-left p-3.5 rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 ${
                isSelected
                  ? 'border-indigo-600 dark:border-indigo-500 bg-indigo-50/60 dark:bg-indigo-950/40 shadow-sm ring-1 ring-indigo-500'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50/50 dark:hover:bg-slate-800/50'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div
                  className={`p-2 rounded-lg ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                    isSelected
                      ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200 font-bold'
                      : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                  }`}
                >
                  {diff.badge}
                </span>
              </div>

              <div className="text-sm font-bold text-slate-900 dark:text-white">
                {diff.label}
              </div>
              <div className="text-xs font-medium text-indigo-600 dark:text-indigo-400 mt-0.5">
                {diff.tagline}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                {diff.desc}
              </p>

              {isSelected && (
                <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-indigo-600 dark:bg-indigo-400 ring-4 ring-indigo-100 dark:ring-indigo-950"></div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
