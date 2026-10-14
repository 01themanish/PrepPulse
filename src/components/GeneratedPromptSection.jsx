import React, { useState, forwardRef } from 'react';
import { 
  Sparkles, 
  Copy, 
  Check, 
  Download, 
  Maximize2, 
  X, 
  ArrowRight, 
  Lightbulb,
  FileText
} from 'lucide-react';

const GeneratedPromptSection = forwardRef(function GeneratedPromptSection(
  { promptText, onOpenModal, onDismiss, onProceedToImport },
  ref
) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(promptText);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = promptText;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Failed to copy to clipboard', err);
    }
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([promptText], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = 'mcq-ai-prompt.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <section
      ref={ref}
      id="generated-prompt-section"
      tabIndex={-1}
      className="scroll-mt-24 max-w-4xl mx-auto bg-white dark:bg-slate-900 rounded-3xl border-2 border-indigo-200 dark:border-indigo-900/60 p-6 sm:p-8 shadow-soft-lg space-y-6 transition-all animate-fadeIn focus:outline-none"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-slate-800/80">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/25 flex-shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                Generated AI Prompt
              </h2>
              <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                Ready to Copy
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Paste this prompt into ChatGPT, Claude, Gemini, or any LLM to generate your exam questions.
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center flex-wrap gap-2">
          {onOpenModal && (
            <button
              type="button"
              onClick={onOpenModal}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl transition-colors border border-slate-200 dark:border-slate-700"
              title="Open full view modal"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>Fullscreen</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleDownload}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl transition-colors border border-slate-200 dark:border-slate-700"
            title="Download prompt as .txt"
          >
            <Download className="w-3.5 h-3.5" />
            <span>.txt</span>
          </button>

          {onDismiss && (
            <button
              type="button"
              onClick={onDismiss}
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Dismiss prompt section"
              aria-label="Close prompt section"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Guided Steps Callout */}
      <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50 flex items-start space-x-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
        <Lightbulb className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mt-0.5 flex-shrink-0" />
        <div className="space-y-1">
          <strong className="text-slate-900 dark:text-white font-semibold block">
            Next Steps:
          </strong>
          <ol className="list-decimal list-inside space-y-1 text-slate-600 dark:text-slate-300">
            <li>Click <strong>Copy Prompt</strong> below.</li>
            <li>Paste into your AI model (ChatGPT, Claude, Gemini, DeepSeek, etc.) and press enter.</li>
            <li>Copy the AI's returned JSON object.</li>
            <li>Scroll down to <strong>Import Your Questions</strong> and paste the JSON to begin your test!</li>
          </ol>
        </div>
      </div>

      {/* Code Prompt Box */}
      <div className="rounded-2xl border border-slate-800 bg-slate-950 text-slate-100 overflow-hidden font-mono text-xs sm:text-sm shadow-inner">
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-800 bg-slate-900/90 text-slate-400">
          <div className="flex items-center space-x-2">
            <FileText className="w-3.5 h-3.5 text-indigo-400" />
            <span className="font-sans font-medium text-xs">Structured AI Prompt</span>
          </div>
          <button
            type="button"
            onClick={handleCopy}
            className={`inline-flex items-center space-x-1.5 px-3 py-1 text-xs font-semibold rounded-lg transition-all shadow-sm ${
              copied
                ? 'bg-emerald-600 text-white'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Prompt</span>
              </>
            )}
          </button>
        </div>

        <pre className="p-4 sm:p-5 overflow-x-auto max-h-80 whitespace-pre-wrap leading-relaxed selection:bg-indigo-600 selection:text-white">
          {promptText}
        </pre>
      </div>

      {/* Bottom Action Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
        <div className="text-xs text-slate-500 dark:text-slate-400">
          {copied ? (
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center space-x-1">
              <Check className="w-4 h-4" />
              <span>Prompt copied to your clipboard!</span>
            </span>
          ) : (
            <span>Prompt formatted to guarantee valid schema response from AI.</span>
          )}
        </div>

        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <button
            type="button"
            onClick={handleCopy}
            className="flex-1 sm:flex-none inline-flex items-center justify-center space-x-1.5 px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl transition-colors border border-slate-200 dark:border-slate-700"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied to Clipboard' : 'Copy Prompt'}</span>
          </button>

          <button
            type="button"
            onClick={onProceedToImport}
            className="flex-1 sm:flex-none inline-flex items-center justify-center space-x-2 px-5 py-2.5 text-xs sm:text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md shadow-indigo-500/20 transition-all"
          >
            <span>Go to Import Section</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
});

export default GeneratedPromptSection;
