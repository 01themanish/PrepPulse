/**
 * Result Calculation Utility
 * Accurately scores tests based on user answers and negative marking rules.
 */

export function calculateResults({
  questions = [],
  userAnswers = {},
  marksPerCorrectAnswer = 1,
  negativeMarking = { enabled: true, penaltyPerIncorrectAnswer: 0.25 },
  totalDurationSeconds = 0,
  timeRemainingSeconds = 0,
}) {
  const marksPerCorrect = Number(marksPerCorrectAnswer) || 1;
  const isNegativeEnabled = Boolean(negativeMarking?.enabled);
  const penalty = isNegativeEnabled ? Number(negativeMarking?.penaltyPerIncorrectAnswer || 0) : 0;

  let correctCount = 0;
  let incorrectCount = 0;
  let unansweredCount = 0;
  let totalScoreRaw = 0;

  const questionBreakdown = questions.map((q, index) => {
    const selectedAnswerId = userAnswers[q.id];
    const isUnanswered = selectedAnswerId === undefined || selectedAnswerId === null || selectedAnswerId === '';
    
    // Normalize option IDs for comparison
    const normCorrect = String(q.correctAnswer).trim().toUpperCase();
    const normSelected = !isUnanswered ? String(selectedAnswerId).trim().toUpperCase() : null;
    const isCorrect = !isUnanswered && normSelected === normCorrect;
    const isIncorrect = !isUnanswered && !isCorrect;

    let marksAwarded = 0;
    let status = 'unanswered';

    if (isCorrect) {
      status = 'correct';
      marksAwarded = marksPerCorrect;
      correctCount++;
      totalScoreRaw += marksPerCorrect;
    } else if (isIncorrect) {
      status = 'incorrect';
      marksAwarded = -penalty;
      incorrectCount++;
      totalScoreRaw -= penalty;
    } else {
      status = 'unanswered';
      marksAwarded = 0;
      unansweredCount++;
    }

    return {
      index: index + 1,
      id: q.id,
      question: q.question,
      options: q.options,
      correctAnswer: q.correctAnswer,
      selectedAnswerId: selectedAnswerId || null,
      isCorrect,
      isIncorrect,
      isUnanswered,
      marksAwarded: Number(marksAwarded.toFixed(2)),
      explanation: q.explanation || 'No explanation available.',
      status, // 'correct' | 'incorrect' | 'unanswered'
    };
  });

  const totalQuestions = questions.length;
  const attemptedCount = correctCount + incorrectCount;
  const maxPossibleMarks = Number((totalQuestions * marksPerCorrect).toFixed(2));
  const finalScore = Number(totalScoreRaw.toFixed(2));

  // Percentage based on max possible marks
  const percentage = maxPossibleMarks > 0 
    ? Number(((finalScore / maxPossibleMarks) * 100).toFixed(2))
    : 0;

  // Accuracy: correct answers / attempted answers
  const accuracy = attemptedCount > 0 
    ? Number(((correctCount / attemptedCount) * 100).toFixed(1))
    : null; // Displayed as 'N/A' when null

  const safeTotalDuration = Math.max(0, totalDurationSeconds);
  const safeTimeRemaining = Math.max(0, Math.min(safeTotalDuration, timeRemainingSeconds));
  const timeTakenSeconds = Math.max(0, safeTotalDuration - safeTimeRemaining);

  return {
    totalQuestions,
    correctCount,
    incorrectCount,
    unansweredCount,
    attemptedCount,
    marksPerCorrectAnswer: marksPerCorrect,
    negativeMarkingEnabled: isNegativeEnabled,
    penaltyPerIncorrectAnswer: penalty,
    finalScore,
    maxPossibleMarks,
    percentage,
    accuracy,
    timeTakenSeconds,
    timeRemainingSeconds: safeTimeRemaining,
    questionBreakdown,
  };
}
