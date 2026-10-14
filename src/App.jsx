import React, { useState, useEffect, useRef, useCallback } from 'react';
import Header from './components/Header';
import TestConfiguration from './components/TestConfiguration';
import GeneratedPromptSection from './components/GeneratedPromptSection';
import PromptGeneratorModal from './components/PromptGeneratorModal';
import JsonImporter from './components/JsonImporter';
import TestHeader from './components/TestHeader';
import QuestionCard from './components/QuestionCard';
import QuestionNavigation from './components/QuestionNavigation';
import SubmitConfirmationModal from './components/SubmitConfirmationModal';
import ResultSummary from './components/ResultSummary';
import QuestionReview from './components/QuestionReview';
import { useTestTimer } from './hooks/useTestTimer';
import { calculateResults } from './utils/calculateResults';

export default function App() {
  // App mode: 'config' | 'test' | 'results'
  const [appMode, setAppMode] = useState('config');

  // Test configuration & generated prompt
  const [currentPrompt, setCurrentPrompt] = useState('');
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [isPromptModalOpen, setIsPromptModalOpen] = useState(false);
  const [lastConfig, setLastConfig] = useState(null);

  // Ref for scrolling to the generated prompt section
  const promptSectionRef = useRef(null);

  // Automatically scroll to the generated prompt section when rendered
  useEffect(() => {
    if (generatedPrompt) {
      promptSectionRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  }, [generatedPrompt]);

  // Imported test data
  const [testData, setTestData] = useState(null);

  // Test taking state
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({}); // { [qId]: optionId }
  const [markedForReview, setMarkedForReview] = useState(new Set());
  const [visitedQuestions, setVisitedQuestions] = useState(new Set([0]));
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [targetEndTime, setTargetEndTime] = useState(null);

  // Results state
  const [resultsData, setResultsData] = useState(null);
  const [activeResultFilter, setActiveResultFilter] = useState('all');

  // Lock to prevent duplicate submissions
  const isSubmittingRef = useRef(false);

  // Restore active test from LocalStorage on mount
  useEffect(() => {
    try {
      const savedSession = localStorage.getItem('preppulse_active_test_session');
      if (savedSession) {
        const parsed = JSON.parse(savedSession);
        if (parsed?.testData && parsed?.targetEndTime) {
          const now = Date.now();
          if (parsed.targetEndTime > now) {
            // Restore active ongoing test
            setTestData(parsed.testData);
            setUserAnswers(parsed.userAnswers || {});
            setMarkedForReview(new Set(parsed.markedForReview || []));
            setVisitedQuestions(new Set(parsed.visitedQuestions || [0]));
            setCurrentIndex(parsed.currentIndex || 0);
            setTargetEndTime(parsed.targetEndTime);
            setAppMode('test');
          } else {
            // Timer expired while away, submit and calculate
            const remaining = 0;
            const res = calculateResults({
              questions: parsed.testData.questions,
              userAnswers: parsed.userAnswers || {},
              marksPerCorrectAnswer: parsed.testData.marksPerCorrectAnswer,
              negativeMarking: parsed.testData.negativeMarking,
              totalDurationSeconds: (parsed.testData.totalDurationMinutes || 5) * 60,
              timeRemainingSeconds: 0,
            });
            setTestData(parsed.testData);
            setResultsData(res);
            setAppMode('results');
            localStorage.removeItem('preppulse_active_test_session');
          }
        }
      }
    } catch (e) {
      console.warn('Could not restore test session', e);
    }
  }, []);

  // Persist active test state during 'test' mode
  useEffect(() => {
    if (appMode === 'test' && testData && targetEndTime) {
      try {
        const payload = {
          testData,
          userAnswers,
          markedForReview: Array.from(markedForReview),
          visitedQuestions: Array.from(visitedQuestions),
          currentIndex,
          targetEndTime,
        };
        localStorage.setItem('preppulse_active_test_session', JSON.stringify(payload));
      } catch (e) {
        console.warn('Failed to save test progress to LocalStorage', e);
      }
    } else if (appMode !== 'test') {
      localStorage.removeItem('preppulse_active_test_session');
    }
  }, [appMode, testData, userAnswers, markedForReview, visitedQuestions, currentIndex, targetEndTime]);

  // Unsaved progress warning on browser reload/close during active test
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (appMode === 'test') {
        e.preventDefault();
        e.returnValue = 'You have an active test in progress. Are you sure you want to leave?';
        return e.returnValue;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [appMode]);

  // Submit test handler
  const handleFinalSubmit = useCallback(() => {
    if (isSubmittingRef.current || !testData) return;
    isSubmittingRef.current = true;

    setIsSubmitModalOpen(false);

    // Calculate score & results
    const totalDurationSeconds = (testData.totalDurationMinutes || 5) * 60;
    const now = Date.now();
    const remainingSeconds = targetEndTime ? Math.max(0, Math.ceil((targetEndTime - now) / 1000)) : 0;

    const results = calculateResults({
      questions: testData.questions,
      userAnswers,
      marksPerCorrectAnswer: testData.marksPerCorrectAnswer,
      negativeMarking: testData.negativeMarking,
      totalDurationSeconds,
      timeRemainingSeconds: remainingSeconds,
    });

    setResultsData(results);
    setAppMode('results');
    localStorage.removeItem('preppulse_active_test_session');

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });

    setTimeout(() => {
      isSubmittingRef.current = false;
    }, 500);
  }, [testData, userAnswers, targetEndTime]);

  // Timer setup with custom hook
  const totalSeconds = (testData?.totalDurationMinutes || 5) * 60;
  const {
    secondsRemaining,
    formattedTime,
    isLowTime,
    isTimeUp,
  } = useTestTimer({
    totalSeconds,
    targetEndTime,
    isRunning: appMode === 'test',
    onTimeUp: handleFinalSubmit,
  });

  // Handle prompt generation from config
  const handleGeneratePrompt = ({ config, promptText }) => {
    setLastConfig(config);
    setCurrentPrompt(promptText);
    setGeneratedPrompt(promptText);
  };

  // Scroll smoothly to import section
  const handleProceedToImport = () => {
    const el = document.getElementById('import-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Start test with validated questions
  const handleStartTest = (validatedData) => {
    setTestData(validatedData);
    setUserAnswers({});
    setMarkedForReview(new Set());
    setVisitedQuestions(new Set([0]));
    setCurrentIndex(0);

    const durationMinutes = validatedData.totalDurationMinutes || (validatedData.questions.length * (validatedData.timePerQuestionMinutes || 1));
    const durationMs = durationMinutes * 60 * 1000;
    const end = Date.now() + durationMs;

    setTargetEndTime(end);
    isSubmittingRef.current = false;
    setAppMode('test');

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Question navigation actions
  const handleSelectQuestion = (index) => {
    setCurrentIndex(index);
    setVisitedQuestions((prev) => new Set([...prev, index]));
  };

  const handleNext = () => {
    if (!testData) return;
    if (currentIndex < testData.questions.length - 1) {
      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);
      setVisitedQuestions((prev) => new Set([...prev, nextIdx]));
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  // Answer selection
  const handleSelectAnswer = (optionId) => {
    if (!testData) return;
    const currentQ = testData.questions[currentIndex];
    setUserAnswers((prev) => ({
      ...prev,
      [currentQ.id]: optionId,
    }));
  };

  // Clear answer
  const handleClearAnswer = () => {
    if (!testData) return;
    const currentQ = testData.questions[currentIndex];
    setUserAnswers((prev) => {
      const next = { ...prev };
      delete next[currentQ.id];
      return next;
    });
  };

  // Mark for review toggle
  const handleToggleMarkForReview = () => {
    if (!testData) return;
    const currentQ = testData.questions[currentIndex];
    setMarkedForReview((prev) => {
      const next = new Set(prev);
      if (next.has(currentQ.id)) {
        next.delete(currentQ.id);
      } else {
        next.add(currentQ.id);
      }
      return next;
    });
  };

  // Retake same test
  const handleRetakeTest = () => {
    if (!testData) return;
    handleStartTest(testData);
  };

  // Exit back to config
  const handleExitToHome = () => {
    if (appMode === 'test') {
      const confirmExit = window.confirm(
        'Are you sure you want to exit? Your current test progress will be lost.'
      );
      if (!confirmExit) return;
    }
    setAppMode('config');
    localStorage.removeItem('preppulse_active_test_session');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Question review filtering jump
  const handleReviewIncorrect = () => {
    setActiveResultFilter('incorrect');
    const el = document.getElementById('review-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Calculation for header & palette counts
  const totalQuestionsCount = testData?.questions?.length || 0;
  const answeredCount = Object.keys(userAnswers).filter((k) => userAnswers[k] !== undefined && userAnswers[k] !== null && userAnswers[k] !== '').length;
  const unansweredCount = Math.max(0, totalQuestionsCount - answeredCount);
  const currentQuestion = testData?.questions?.[currentIndex];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-200">
      
      {/* Universal Header */}
      <Header
        appMode={appMode}
        onExitToHome={handleExitToHome}
      />

      {/* Main Content Areas */}
      <main className="flex-1 pb-16">
        
        {/* MODE 1: CONFIGURATION & IMPORT */}
        {appMode === 'config' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12 animate-fadeIn">
            <TestConfiguration
              initialConfig={lastConfig}
              onGeneratePrompt={handleGeneratePrompt}
            />

            {generatedPrompt && (
              <GeneratedPromptSection
                ref={promptSectionRef}
                promptText={generatedPrompt}
                onOpenModal={() => setIsPromptModalOpen(true)}
                onDismiss={() => setGeneratedPrompt('')}
                onProceedToImport={handleProceedToImport}
              />
            )}

            <JsonImporter
              importedData={testData}
              setImportedData={setTestData}
              onStartTest={handleStartTest}
              promptText={generatedPrompt}
            />
          </div>
        )}

        {/* MODE 2: ACTIVE TEST TAKING */}
        {appMode === 'test' && testData && (
          <div className="animate-fadeIn">
            {/* Sticky Exam Sub-Header */}
            <TestHeader
              title={testData.title}
              topic={testData.topic}
              difficulty={testData.difficulty}
              currentIndex={currentIndex}
              totalQuestions={totalQuestionsCount}
              answeredCount={answeredCount}
              unansweredCount={unansweredCount}
              markedCount={markedForReview.size}
              formattedTime={formattedTime}
              isLowTime={isLowTime}
              isTimeUp={isTimeUp}
              onSubmitClick={() => setIsSubmitModalOpen(true)}
            />

            {/* Test Workspace Layout: Question Area + Navigation Palette */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
                
                {/* Left (8 cols): Question Card */}
                <div className="lg:col-span-8 order-1">
                  <QuestionCard
                    question={currentQuestion}
                    currentIndex={currentIndex}
                    totalQuestions={totalQuestionsCount}
                    selectedAnswer={currentQuestion ? userAnswers[currentQuestion.id] : null}
                    isMarkedForReview={currentQuestion ? markedForReview.has(currentQuestion.id) : false}
                    onSelectAnswer={handleSelectAnswer}
                    onClearAnswer={handleClearAnswer}
                    onToggleMarkForReview={handleToggleMarkForReview}
                    onPrev={handlePrev}
                    onNext={handleNext}
                    onSubmit={() => setIsSubmitModalOpen(true)}
                  />
                </div>

                {/* Right (4 cols): Navigation Palette */}
                <div className="lg:col-span-4 order-2 lg:sticky lg:top-36">
                  <QuestionNavigation
                    totalQuestions={totalQuestionsCount}
                    currentIndex={currentIndex}
                    userAnswers={userAnswers}
                    markedForReview={markedForReview}
                    visitedQuestions={visitedQuestions}
                    onSelectQuestion={handleSelectQuestion}
                  />
                </div>

              </div>
            </div>
          </div>
        )}

        {/* MODE 3: RESULTS & EXPLANATIONS */}
        {appMode === 'results' && resultsData && testData && (
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10 animate-fadeIn">
            <ResultSummary
              results={resultsData}
              testTitle={testData.title}
              testTopic={testData.topic}
              onRetakeTest={handleRetakeTest}
              onCreateNewTest={handleExitToHome}
              onReviewIncorrect={handleReviewIncorrect}
            />

            <QuestionReview
              questionBreakdown={resultsData.questionBreakdown}
              activeFilter={activeResultFilter}
              onChangeFilter={setActiveResultFilter}
            />
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-200 dark:border-slate-800 py-6 text-center text-xs text-slate-500 dark:text-slate-400 no-print">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-slate-700 dark:text-slate-300">PrepPulse MCQ Platform</span>
            <span>•</span>
            <span>Frontend Single Page Application</span>
          </div>
          <div>
            <span>Pure React + Tailwind CSS • Configurable Negative Marking • AI-Ready Schema</span>
          </div>
        </div>
      </footer>

      {/* AI Prompt Modal */}
      <PromptGeneratorModal
        isOpen={isPromptModalOpen}
        onClose={() => setIsPromptModalOpen(false)}
        promptText={currentPrompt}
        onProceedToImport={handleProceedToImport}
      />

      {/* Submit Test Confirmation Modal */}
      <SubmitConfirmationModal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        onConfirm={handleFinalSubmit}
        totalQuestions={totalQuestionsCount}
        answeredCount={answeredCount}
        unansweredCount={unansweredCount}
        markedCount={markedForReview.size}
        formattedTimeRemaining={formattedTime}
      />

    </div>
  );
}
