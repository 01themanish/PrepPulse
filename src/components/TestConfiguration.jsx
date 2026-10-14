import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Clock, 
  HelpCircle, 
  FileText, 
  Layers, 
  Target, 
  BookOpen,
  Award,
  AlertTriangle
} from 'lucide-react';
import DifficultySelector from './DifficultySelector';
import NegativeMarkingSettings from './NegativeMarkingSettings';
import { generatePrompt } from '../utils/generatePrompt';

const POPULAR_TOPICS = [
  'JavaScript',
  'Data Structures & Algorithms',
  'React.js',
  'Cloud Computing (AWS/GCP)',
  'Operating Systems',
  'Computer Networks',
  'Database Management Systems',
  'Python Programming',
  'System Design',
];

export default function TestConfiguration({
  onGeneratePrompt,
  initialConfig,
}) {
  const [topic, setTopic] = useState(initialConfig?.topic || 'JavaScript');
  const [numQuestions, setNumQuestions] = useState(initialConfig?.numQuestions || 10);
  const [timePerQuestion, setTimePerQuestion] = useState(initialConfig?.timePerQuestion || 1);
  const [difficulty, setDifficulty] = useState(initialConfig?.difficulty || 'Medium');
  const [negativeMarkingEnabled, setNegativeMarkingEnabled] = useState(
    initialConfig?.negativeMarkingEnabled !== undefined ? initialConfig.negativeMarkingEnabled : true
  );
  const [penaltyPerIncorrect, setPenaltyPerIncorrect] = useState(
    initialConfig?.penaltyPerIncorrect !== undefined ? initialConfig.penaltyPerIncorrect : 0.25
  );
  const [marksPerCorrect, setMarksPerCorrect] = useState(
    initialConfig?.marksPerCorrect || 1
  );

  const [validationError, setValidationError] = useState('');

  // Total duration in minutes calculated dynamically
  const totalDurationMinutes = Math.max(1, Math.round(Number(numQuestions) * Number(timePerQuestion)));

  const handleNumQuestionsChange = (e) => {
    const val = parseInt(e.target.value, 10);
    if (isNaN(val)) {
      setNumQuestions('');
    } else {
      setNumQuestions(val);
    }
  };

  const handleTimePerQuestionChange = (e) => {
    const val = parseFloat(e.target.value);
    if (isNaN(val)) {
      setTimePerQuestion('');
    } else {
      setTimePerQuestion(Math.max(0.2, val));
    }
  };

  const handleGenerateClick = (e) => {
    e.preventDefault();

    // Field validations
    if (!topic.trim()) {
      setValidationError('Please enter a test topic before generating prompt.');
      return;
    }

    const qCount = parseInt(numQuestions, 10);
    if (isNaN(qCount) || qCount < 1 || qCount > 100) {
      setValidationError('Number of questions must be between 1 and 100.');
      return;
    }

    const timeQ = parseFloat(timePerQuestion);
    if (isNaN(timeQ) || timeQ <= 0) {
      setValidationError('Time per question must be greater than 0 minutes.');
      return;
    }

    const marksCorrect = parseFloat(marksPerCorrect);
    if (isNaN(marksCorrect) || marksCorrect <= 0) {
      setValidationError('Marks for correct answer must be greater than 0.');
      return;
    }

    setValidationError('');

    const config = {
      topic: topic.trim(),
      numQuestions: qCount,
      timePerQuestion: timeQ,
      difficulty,
      marksPerCorrect,
      negativeMarkingEnabled,
      penaltyPerIncorrect: negativeMarkingEnabled ? penaltyPerIncorrect : 0,
      totalDurationMinutes,
    };

    const promptText = generatePrompt(config);
    onGeneratePrompt({ config, promptText });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-xs font-semibold text-indigo-700 dark:text-indigo-300">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Interactive Exam Simulator</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Create Your Own MCQ Test
        </h1>
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Choose your topic, customize your test, and start practicing.
        </p>
      </div>

      {/* Configuration Card Form */}
      <form
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          handleGenerateClick(e);
        }}
        className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 shadow-soft-lg space-y-8"
      >
        
        {/* A. Topic Input */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label htmlFor="topic-input" className="block text-sm font-semibold text-slate-900 dark:text-slate-100">
              Test Topic <span className="text-rose-500">*</span>
            </label>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Any subject, domain, or technology
            </span>
          </div>
          
          <input
            id="topic-input"
            type="text"
            required
            value={topic}
            onChange={(e) => {
              setTopic(e.target.value);
              if (validationError) setValidationError('');
            }}
            placeholder="e.g. JavaScript, System Design, Operating Systems..."
            className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-sm"
          />

          {/* Quick topic suggestion pills */}
          <div className="space-y-1.5">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Popular suggestions:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {POPULAR_TOPICS.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTopic(t)}
                  className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-colors border ${
                    topic === t
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* B & C. Number of Questions & Time Per Question */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-200/80 dark:border-slate-800/80">
          
          {/* B. Number of Questions */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="num-questions" className="block text-sm font-semibold text-slate-900 dark:text-slate-100">
                Number of Questions <span className="text-rose-500">*</span>
              </label>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Range: 1 to 100
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <input
                id="num-questions"
                type="number"
                min="1"
                max="100"
                value={numQuestions}
                onChange={handleNumQuestionsChange}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-base font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
              />
              <div className="flex space-x-1">
                {[5, 10, 15, 20].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setNumQuestions(preset)}
                    className={`px-2.5 py-2 text-xs font-semibold rounded-lg border transition-all ${
                      numQuestions === preset
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Default: 10 questions. AI will generate exactly this quantity.
            </p>
          </div>

          {/* C. Time Per Question */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="time-per-question" className="block text-sm font-semibold text-slate-900 dark:text-slate-100">
                Time Per Question (Minutes) <span className="text-rose-500">*</span>
              </label>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Default: 1 min
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <input
                id="time-per-question"
                type="number"
                min="0.1"
                step="any"
                max="10"
                value={timePerQuestion}
                onChange={handleTimePerQuestionChange}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-base font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
              />
              <div className="flex space-x-1">
                {[1, 1.5, 2].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setTimePerQuestion(preset)}
                    className={`px-2.5 py-2 text-xs font-semibold rounded-lg border transition-all ${
                      timePerQuestion === preset
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {preset}m
                  </button>
                ))}
              </div>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Automatically calculates overall test countdown duration.
            </p>
          </div>

        </div>

        {/* Prominent Total Duration Banner */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-indigo-500/10 border border-indigo-200/80 dark:border-indigo-800/80 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-indigo-600 text-white shadow-sm">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-700 dark:text-indigo-300">
                Calculated Test Duration
              </span>
              <div className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-baseline space-x-2">
                <span>{totalDurationMinutes} Minutes</span>
                <span className="text-xs font-normal text-slate-500 dark:text-slate-400">
                  ({numQuestions || 0} questions × {timePerQuestion || 0} min)
                </span>
              </div>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
            {totalDurationMinutes >= 60 ? `${(totalDurationMinutes / 60).toFixed(1)} Hours` : `${totalDurationMinutes}m Countdown`}
          </span>
        </div>

        {/* D. Difficulty Level */}
        <div className="pt-2">
          <DifficultySelector value={difficulty} onChange={setDifficulty} />
        </div>

        {/* E. Negative Marking Configuration */}
        <div className="pt-2">
          <NegativeMarkingSettings
            enabled={negativeMarkingEnabled}
            onToggleEnabled={setNegativeMarkingEnabled}
            penalty={penaltyPerIncorrect}
            onChangePenalty={setPenaltyPerIncorrect}
            marksPerCorrect={marksPerCorrect}
          />
        </div>

        {/* F. Marks Configuration Section */}
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Marks & Scoring Scheme
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Configure points awarded per question and review maximum test score.
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <label htmlFor="marks-correct" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Marks per Correct Answer:
              </label>
              <input
                id="marks-correct"
                type="number"
                min="0.5"
                step="0.5"
                value={marksPerCorrect}
                onChange={(e) => setMarksPerCorrect(Math.max(0.5, parseFloat(e.target.value) || 1))}
                className="w-20 px-3 py-1.5 text-sm font-semibold rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-center"
              />
            </div>
          </div>

          {/* Live Preview of Scoring Rules */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center text-xs">
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900">
              <span className="text-emerald-800 dark:text-emerald-300 font-medium block">Correct Answer</span>
              <strong className="text-emerald-600 dark:text-emerald-400 text-base font-bold">
                +{marksPerCorrect} mark
              </strong>
            </div>

            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900">
              <span className="text-rose-800 dark:text-rose-300 font-medium block">Incorrect Answer</span>
              <strong className="text-rose-600 dark:text-rose-400 text-base font-bold">
                {negativeMarkingEnabled ? `-${penaltyPerIncorrect} mark` : '0 marks'}
              </strong>
            </div>

            <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <span className="text-slate-600 dark:text-slate-400 font-medium block">Unanswered</span>
              <strong className="text-slate-700 dark:text-slate-300 text-base font-bold">
                0 marks
              </strong>
            </div>
          </div>

          <div className="flex justify-between items-center text-xs text-slate-500 dark:text-slate-400 pt-1">
            <span>Total Maximum Score:</span>
            <strong className="text-sm font-bold text-slate-900 dark:text-white">
              {(Number(numQuestions || 0) * Number(marksPerCorrect || 1)).toFixed(2)} Marks
            </strong>
          </div>
        </div>

        {/* Validation Error Message */}
        {validationError && (
          <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 flex items-center space-x-3 text-rose-700 dark:text-rose-300 text-sm">
            <AlertTriangle className="w-5 h-5 flex-shrink-0 text-rose-600" />
            <span>{validationError}</span>
          </div>
        )}

        {/* G. Create Prompt Button */}
        <div className="pt-2">
          <button
            type="button"
            onClick={handleGenerateClick}
            className="w-full py-4 px-6 rounded-2xl font-bold text-white text-base sm:text-lg bg-gradient-to-r from-indigo-600 via-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg shadow-indigo-500/25 transition-all duration-200 flex items-center justify-center space-x-3 group"
          >
            <Sparkles className="w-5 h-5 transition-transform group-hover:scale-110" />
            <span>Generate AI Prompt</span>
          </button>
          <p className="text-center text-xs text-slate-500 dark:text-slate-400 mt-2">
            Builds a tailored prompt for ChatGPT, Claude, or Gemini to return strictly valid test JSON.
          </p>
        </div>

      </form>
    </div>
  );
}
