import React, { useState } from 'react';
import { Copy, Check, X, Sparkles, ExternalLink, Download, ArrowRight, Lightbulb } from 'lucide-react';

export default function PromptGeneratorModal({ isOpen, onClose, promptText, onProceedToImport }) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = async () => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(promptText);
      } else {
        // Fallback for older browsers or restricted permissions
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div 
        className="w-full max-w-3xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/40">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Generated AI Prompt
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Copy this prompt and paste it into ChatGPT, Claude, Gemini, or any LLM.
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

        {/* Modal Body */}
        <div className="px-6 py-4 flex-1 overflow-y-auto space-y-4">
          
          {/* Workflow Guide */}
          <div className="p-3.5 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50 flex items-start space-x-3 text-xs text-slate-600 dark:text-slate-300">
            <Lightbulb className="w-4 h-4 text-indigo-600 dark:text-indigo-400 mt-0.5 flex-shrink-0" />
            <div>
              <strong className="text-indigo-950 dark:text-indigo-200 font-semibold block mb-1">
                How to generate questions:
              </strong>
              <ol className="list-decimal list-inside space-y-1 text-slate-600 dark:text-slate-300">
                <li>Click <strong>Copy Prompt</strong> below.</li>
                <li>Open your favorite AI (ChatGPT, Claude, Gemini, DeepSeek, etc.).</li>
                <li>Paste the prompt and press Enter. The AI will output structured JSON.</li>
                <li>Copy the AI's JSON reply and paste it into the <strong>Import Questions</strong> section!</li>
              </ol>
            </div>
          </div>

          {/* Prompt Code Box */}
          <div className="relative rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-950 text-slate-100 overflow-hidden font-mono text-xs">
            <div className="flex items-center justify-between px-4 py-2 border-b border-slate-800 bg-slate-900/90 text-slate-400">
              <span className="font-sans font-medium text-[11px]">Dynamic AI Prompt (Ready to Copy)</span>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={handleDownload}
                  className="inline-flex items-center space-x-1 px-2.5 py-1 text-[11px] rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                  title="Download prompt as .txt"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download .txt</span>
                </button>
                <button
                  type="button"
                  onClick={handleCopy}
                  className={`inline-flex items-center space-x-1 px-3 py-1 text-[11px] font-semibold rounded-lg transition-all shadow-sm ${
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
            </div>

            <pre className="p-4 overflow-x-auto max-h-72 whitespace-pre-wrap leading-relaxed selection:bg-indigo-600 selection:text-white">
              {promptText}
            </pre>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-400">
            {copied && (
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center space-x-1">
                <Check className="w-3.5 h-3.5" />
                <span>Prompt copied to your clipboard successfully!</span>
              </span>
            )}
          </div>

          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800 rounded-xl transition-colors"
            >
              Close
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
                if (onProceedToImport) onProceedToImport();
              }}
              className="flex-1 sm:flex-none inline-flex items-center justify-center space-x-2 px-5 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md shadow-indigo-500/20 transition-all"
            >
              <span>Paste JSON Questions</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
