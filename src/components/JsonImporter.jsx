import React, { useState, useRef } from 'react';
import { 
  FileJson, 
  Upload, 
  CheckCircle2, 
  AlertTriangle, 
  Play, 
  Copy, 
  Check, 
  Sparkles, 
  FileCheck, 
  Info,
  Clock,
  Layers,
  Award,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  HelpCircle,
  ArrowRight
} from 'lucide-react';
import { validateQuestionsJson } from '../utils/validateQuestions';
import { SAMPLE_TEST_JS, SAMPLE_TEST_DSA } from '../data/sampleTests';

export default function JsonImporter({ onStartTest, importedData, setImportedData, promptText }) {
  const [jsonText, setJsonText] = useState('');
  const [validationResult, setValidationResult] = useState(null);
  const [showExample, setShowExample] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [fileError, setFileError] = useState('');
  const [promptCopied, setPromptCopied] = useState(false);
  const [correctedCopied, setCorrectedCopied] = useState(false);

  const fileInputRef = useRef(null);

  const handleCopyCorrectedJson = async () => {
    if (!validationResult?.normalizedJson) return;
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(validationResult.normalizedJson);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = validationResult.normalizedJson;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCorrectedCopied(true);
      setTimeout(() => setCorrectedCopied(false), 2500);
    } catch (err) {
      console.error('Failed to copy corrected JSON', err);
    }
  };

  // Runs validation on given string or current jsonText
  const handleValidate = (textToValidate = jsonText) => {
    setFileError('');
    const result = validateQuestionsJson(textToValidate);
    setValidationResult(result);
    if (result.isValid && result.data) {
      setImportedData(result.data);
    } else {
      setImportedData(null);
    }
    return result;
  };

  const handleCopyPrompt = async () => {
    if (!promptText) return;
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
      setPromptCopied(true);
      setTimeout(() => setPromptCopied(false), 2500);
    } catch (err) {
      console.error('Failed to copy prompt', err);
    }
  };

  const handleFileUpload = (file) => {
    setFileError('');
    if (!file) return;

    if (!file.name.endsWith('.json') && file.type !== 'application/json') {
      setFileError('Please select a valid .json file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target.result;
        setJsonText(content);
        handleValidate(content);
      } catch (err) {
        setFileError(`Failed to read file: ${err.message}`);
      }
    };
    reader.onerror = () => {
      setFileError('Error reading file from disk.');
    };
    reader.readAsText(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleLoadSample = (sampleData) => {
    const formatted = JSON.stringify(sampleData, null, 2);
    setJsonText(formatted);
    handleValidate(formatted);
  };

  const handleClear = () => {
    setJsonText('');
    setValidationResult(null);
    setImportedData(null);
    setFileError('');
    setCorrectedCopied(false);
  };

  return (
    <div id="import-section" className="max-w-4xl mx-auto space-y-6">
      
      {/* Card Header & Controls */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-soft-lg space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-slate-800/80">
          <div>
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded-xl bg-indigo-600 text-white shadow-sm">
                <FileJson className="w-5 h-5" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                Import Your Questions
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Paste the AI-generated JSON response or upload a saved questions file.
            </p>
          </div>

          {/* Quick Actions: Copy Prompt & Sample Tests */}
          <div className="flex items-center flex-wrap gap-2">
            {promptText && (
              <button
                type="button"
                onClick={handleCopyPrompt}
                className={`inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all border ${
                  promptCopied
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                    : 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100'
                }`}
                title="Copy current AI prompt to clipboard"
              >
                {promptCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{promptCopied ? 'Prompt Copied!' : 'Copy Prompt'}</span>
              </button>
            )}

            <span className="text-xs font-medium text-slate-400 hidden sm:inline">
              Sample:
            </span>
            <button
              type="button"
              onClick={() => handleLoadSample(SAMPLE_TEST_JS)}
              className="px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              JS Test
            </button>
            <button
              type="button"
              onClick={() => handleLoadSample(SAMPLE_TEST_DSA)}
              className="px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              DSA Test
            </button>
          </div>
        </div>

        {/* Clear Instructions Banner */}
        <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50 flex items-start space-x-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
          <Info className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mt-0.5 flex-shrink-0" />
          <div className="space-y-1">
            <strong className="text-slate-900 dark:text-white font-semibold block">
              Instructions:
            </strong>
            <ol className="list-decimal list-inside space-y-0.5 text-slate-600 dark:text-slate-300">
              <li>Copy the AI prompt generated from the configuration above.</li>
              <li>Paste the prompt into <strong>ChatGPT</strong> (or Claude / Gemini) and submit.</li>
              <li>Copy the returned JSON and paste it into the textarea below.</li>
              <li>Click <strong>Validate JSON</strong> and then <strong>Start Test</strong>.</li>
            </ol>
          </div>
        </div>

        {/* Drag and Drop / Textarea Zone */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`relative rounded-2xl border-2 transition-all ${
            isDragging
              ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/30'
              : 'border-slate-200 dark:border-slate-800'
          }`}
        >
          <textarea
            rows="10"
            value={jsonText}
            onChange={(e) => {
              setJsonText(e.target.value);
              if (validationResult) setValidationResult(null);
              if (correctedCopied) setCorrectedCopied(false);
            }}
            placeholder={`{\n  "title": "JavaScript MCQ Test",\n  "topic": "JavaScript",\n  "difficulty": "Medium",\n  "totalQuestions": 5,\n  "timePerQuestionMinutes": 1,\n  "totalDurationMinutes": 5,\n  "marksPerCorrectAnswer": 1,\n  "negativeMarking": {\n    "enabled": true,\n    "penaltyPerIncorrectAnswer": 0.25\n  },\n  "questions": [\n    {\n      "id": 1,\n      "question": "Question text",\n      "options": [\n        { "id": "A", "text": "Option A" },\n        { "id": "B", "text": "Option B" },\n        { "id": "C", "text": "Option C" },\n        { "id": "D", "text": "Option D" }\n      ],\n      "correctAnswer": "B",\n      "explanation": "Explanation of the correct answer."\n    }\n  ]\n}`}
            className="w-full p-4 rounded-2xl font-mono text-xs sm:text-sm bg-slate-50/60 dark:bg-slate-950/60 text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed resize-y"
          />

          {isDragging && (
            <div className="absolute inset-0 bg-indigo-600/10 backdrop-blur-xs flex items-center justify-center rounded-2xl border-2 border-dashed border-indigo-600 text-indigo-700 dark:text-indigo-300 font-semibold text-sm">
              Drop JSON file here to load questions
            </div>
          )}
        </div>

        {fileError && (
          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-xs text-rose-700 dark:text-rose-300 flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            <span>{fileError}</span>
          </div>
        )}

        {/* Buttons Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          
          {/* Left actions: File Upload & Clear */}
          <div className="flex items-center space-x-2">
            <input
              type="file"
              ref={fileInputRef}
              accept=".json,application/json"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFileUpload(e.target.files[0]);
                }
              }}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl transition-colors border border-slate-200 dark:border-slate-700"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload JSON File</span>
            </button>

            {jsonText && (
              <button
                type="button"
                onClick={handleClear}
                className="px-3 py-2 text-xs font-medium text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
              >
                Clear
              </button>
            )}
          </div>

          {/* Right actions: Validate & Load */}
          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => handleValidate()}
              className="flex-1 sm:flex-none inline-flex items-center justify-center space-x-1.5 px-4 py-2.5 text-xs sm:text-sm font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900 rounded-xl transition-all border border-indigo-200 dark:border-indigo-800"
            >
              <FileCheck className="w-4 h-4" />
              <span>Validate JSON</span>
            </button>

            <button
              type="button"
              disabled={!validationResult?.isValid}
              onClick={() => {
                if (validationResult?.isValid && validationResult.data) {
                  onStartTest(validationResult.data);
                }
              }}
              className={`flex-1 sm:flex-none inline-flex items-center justify-center space-x-2 px-5 py-2.5 text-xs sm:text-sm font-bold text-white rounded-xl shadow-md transition-all ${
                validationResult?.isValid
                  ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/25 cursor-pointer scale-100 hover:scale-[1.02]'
                  : 'bg-slate-300 dark:bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Start Test</span>
            </button>
          </div>
        </div>

        {/* Validation Results Display */}
        {validationResult && (
          <div className="space-y-4 pt-2">
            {validationResult.isValid ? (
              <div className="p-5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="p-1.5 rounded-full bg-emerald-600 text-white">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-emerald-900 dark:text-emerald-200">
                      Validation Successful! All questions are ready.
                    </h3>
                    <p className="text-xs text-emerald-700 dark:text-emerald-400">
                      Found {validationResult.data?.questions?.length} questions with verified 4-option sets and single correct answers.
                    </p>
                  </div>
                </div>

                {/* Test Preview Card */}
                <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-emerald-200/80 dark:border-emerald-900/40 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block">Test Title</span>
                    <strong className="text-slate-900 dark:text-white font-semibold line-clamp-1">
                      {validationResult.data?.title}
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block">Topic / Domain</span>
                    <strong className="text-indigo-600 dark:text-indigo-400 font-semibold line-clamp-1">
                      {validationResult.data?.topic}
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block">Questions & Duration</span>
                    <strong className="text-slate-900 dark:text-white font-semibold">
                      {validationResult.data?.questions?.length} Qs • {validationResult.data?.totalDurationMinutes} mins
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block">Negative Marking</span>
                    <strong className="text-slate-900 dark:text-white font-semibold">
                      {validationResult.data?.negativeMarking?.enabled 
                        ? `Yes (-${validationResult.data?.negativeMarking?.penaltyPerIncorrectAnswer})` 
                        : 'Disabled'}
                    </strong>
                  </div>
                </div>

                {/* Curly Quotes Normalization Callout & Copy Button */}
                {validationResult.wasNormalized && validationResult.normalizedJson && (
                  <div className="p-4 rounded-xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs">
                    <div className="flex items-start sm:items-center space-x-2 text-amber-900 dark:text-amber-200">
                      <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5 sm:mt-0" />
                      <span>
                        Curly quotation marks were detected and safely normalized to standard JSON double quotes.
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={handleCopyCorrectedJson}
                      className={`inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all border flex-shrink-0 cursor-pointer ${
                        correctedCopied
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                          : 'bg-white dark:bg-slate-800 text-amber-900 dark:text-amber-200 border-amber-300 dark:border-amber-700 hover:bg-amber-100 dark:hover:bg-slate-700 shadow-sm'
                      }`}
                      title="Copy corrected standard JSON to clipboard"
                    >
                      {correctedCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{correctedCopied ? 'Corrected JSON Copied!' : 'Copy Corrected JSON'}</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-5 rounded-2xl bg-rose-50/80 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="p-1.5 rounded-full bg-rose-600 text-white">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-rose-900 dark:text-rose-200">
                      JSON Validation Failed ({validationResult.errors.length} error{validationResult.errors.length > 1 ? 's' : ''})
                    </h3>
                    <p className="text-xs text-rose-700 dark:text-rose-400">
                      Please review the parsing or schema issues below and correct your JSON.
                    </p>
                  </div>
                </div>

                <div className="max-h-48 overflow-y-auto space-y-1.5 p-3 rounded-xl bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-900/40 font-mono text-xs text-rose-600 dark:text-rose-400">
                  {validationResult.errors.map((err, i) => (
                    <div key={i} className="flex items-start space-x-2">
                      <span className="text-rose-400 select-none">•</span>
                      <span>{err}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Collapsible Example Schema Details */}
        <div className="pt-2 border-t border-slate-200/80 dark:border-slate-800/80">
          <button
            type="button"
            onClick={() => setShowExample(!showExample)}
            className="flex items-center justify-between w-full text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            <span className="flex items-center space-x-1.5">
              <Info className="w-3.5 h-3.5 text-indigo-500" />
              <span>Need help? View Required JSON Schema</span>
            </span>
            {showExample ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showExample && (
            <div className="mt-3 p-4 rounded-xl bg-slate-100 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 space-y-2">
              <p>
                Each question in the <code className="text-indigo-600 dark:text-indigo-400 font-bold">questions</code> array must have:
              </p>
              <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-400">
                <li><code className="text-slate-800 dark:text-slate-200">id</code>: Unique identifier (1, 2, 3...)</li>
                <li><code className="text-slate-800 dark:text-slate-200">question</code>: Question text statement</li>
                <li><code className="text-slate-800 dark:text-slate-200">options</code>: Exactly 4 objects with <code className="text-slate-800 dark:text-slate-200">id</code> ("A", "B", "C", "D") and <code className="text-slate-800 dark:text-slate-200">text</code></li>
                <li><code className="text-slate-800 dark:text-slate-200">correctAnswer</code>: Exactly matches one of the option IDs ("A", "B", "C", or "D")</li>
                <li><code className="text-slate-800 dark:text-slate-200">explanation</code>: Pedagogical rationale for the answer</li>
              </ul>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
