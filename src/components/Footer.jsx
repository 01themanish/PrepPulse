import React from 'react';
import { Heart } from 'lucide-react';

/**
 * Clean, modern, and responsive Footer component for PrepPulse.
 * Displays "Made with ❤️ by Manish" with primary purple branding for Manish,
 * full light/dark mode support, and seamless sticky bottom placement.
 */
export default function Footer({ className = '' }) {
  return (
    <footer
      className={`w-full border-t border-slate-200/80 dark:border-slate-800/80 bg-white/50 dark:bg-slate-900/40 backdrop-blur-sm py-6 text-center text-sm text-slate-500 dark:text-slate-400 transition-colors no-print ${className}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <p className="flex items-center justify-center flex-wrap text-sm text-slate-500 dark:text-slate-400">
          <span>Made with</span>{' '}
          <span
            className="inline-flex items-center justify-center text-rose-500 mx-1.5 transition-transform duration-200 hover:scale-125 cursor-default"
            title="love"
            aria-label="love"
          >
            <Heart className="w-4 h-4 fill-rose-500 text-rose-500" aria-hidden="true" />
            <span className="sr-only">❤️</span>
          </span>{' '}
          <span>by</span>{' '}
          <span className="ml-1 font-semibold text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors">
            Manish
          </span>
        </p>
      </div>
    </footer>
  );
}
