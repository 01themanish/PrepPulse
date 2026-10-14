import { generatePrompt } from './src/utils/generatePrompt.js';
import { validateQuestionsJson, parseAndExtractJson } from './src/utils/validateQuestions.js';
import { calculateResults } from './src/utils/calculateResults.js';
import { SAMPLE_TEST_JS } from './src/data/sampleTests.js';

console.log('=== RUNNING AUTOMATED UNIT TESTS ===\n');
let passed = 0;
let total = 0;

function assert(cond, name) {
  total++;
  if (cond) {
    passed++;
    console.log(`✓ ${name}`);
  } else {
    console.error(`✗ FAILED: ${name}`);
    process.exit(1);
  }
}

// 1. SIMPLIFIED PROMPT GENERATION TESTS
console.log('--- Testing Simplified Prompt Generation ---');
const prompt = generatePrompt({
  topic: 'Cloud Computing',
  subtopic: 'Kubernetes and Docker',
  numQuestions: 5,
  timePerQuestion: 2,
  difficulty: 'Hard',
  marksPerCorrect: 2,
  negativeMarkingEnabled: true,
  penaltyPerIncorrect: 0.5,
});

assert(prompt.includes('Cloud Computing'), 'Prompt contains topic');
assert(prompt.includes('Subtopics: Kubernetes and Docker'), 'Prompt contains subtopic');
assert(prompt.includes('Difficulty: Hard'), 'Prompt contains difficulty');
assert(prompt.includes('"totalQuestions": 5'), 'Prompt contains question count in schema');
assert(prompt.includes('"timePerQuestionMinutes": 2'), 'Prompt contains time per question in schema');
assert(prompt.includes('"totalDurationMinutes": 10'), 'Prompt calculates total duration (5 * 2 = 10)');
assert(prompt.includes('"marksPerCorrectAnswer": 2'), 'Prompt contains marks per correct answer');
assert(prompt.includes('OUTPUT INSTRUCTIONS:'), 'Prompt has concise output instructions');
assert(prompt.includes('Never wrap the JSON in Markdown code fences'), 'Prompt instructs not to use markdown code fences');
assert(prompt.includes('Use standard ASCII double quotes (") for every JSON key and string value.'), 'Prompt instructs to use standard ASCII double quotes');
assert(prompt.includes('Never use curly quotation marks (“ ” or ‘ ’) as JSON delimiters.'), 'Prompt instructs never to use curly quotation marks as delimiters');
assert(prompt.includes('Return valid JSON only.'), 'Prompt instructs to return valid JSON only');
assert(prompt.includes('Include four options per question, identified by A, B, C, and D.'), 'Prompt specifies four options per question (A, B, C, D)');
assert(prompt.includes('Ensure correctAnswer matches an existing option ID.'), 'Prompt instructs correctAnswer must match an option ID');
assert(prompt.includes('Include an explanation for every question.'), 'Prompt instructs explanation for every question');
assert(!prompt.includes('You are an expert examination question paper author'), 'Prompt avoids lengthy preamble');

// 2. JSON EXTRACTION & VALIDATION TESTS
console.log('\n--- Testing JSON Extraction & Validation ---');

// A. Test valid sample directly
const sampleRes = validateQuestionsJson(SAMPLE_TEST_JS);
assert(sampleRes.isValid === true, 'Sample JS test validates cleanly');
assert(sampleRes.data.questions.length === 5, 'Sample JS test has 5 questions');

// B. Test JSON wrapped in Markdown code block (common ChatGPT format)
const markdownWrappedJson = `Here is the generated test:
\`\`\`json
${JSON.stringify(SAMPLE_TEST_JS, null, 2)}
\`\`\`
Hope this helps!`;
const mdRes = validateQuestionsJson(markdownWrappedJson);
assert(mdRes.isValid === true, 'Safely parses JSON wrapped in a Markdown code block');
assert(mdRes.data.topic === 'JavaScript', 'Extracted JSON maintains correct properties');

// C. Test malformed / invalid JSON syntax
const malformedJson = '{\n  "title": "Bad Test",\n  "questions": [';
const malformedRes = validateQuestionsJson(malformedJson);
assert(malformedRes.isValid === false, 'Rejects malformed JSON syntax');
assert(malformedRes.errors[0].includes('Invalid JSON syntax'), 'Provides descriptive syntax error message');

// D. Test empty input
const emptyRes = validateQuestionsJson('   ');
assert(emptyRes.isValid === false, 'Rejects empty input');

// E. Test missing required root fields
const missingTopic = {
  ...SAMPLE_TEST_JS,
  topic: '',
};
const missingTopicRes = validateQuestionsJson(missingTopic);
assert(missingTopicRes.isValid === false, 'Rejects missing root topic');
assert(missingTopicRes.errors.some(e => e.includes('"topic"')), 'Identifies missing topic field');

const missingTitle = {
  ...SAMPLE_TEST_JS,
  title: '',
};
const missingTitleRes = validateQuestionsJson(missingTitle);
assert(missingTitleRes.isValid === false, 'Rejects missing root title');

const missingDifficulty = {
  ...SAMPLE_TEST_JS,
  difficulty: '',
};
const missingDiffRes = validateQuestionsJson(missingDifficulty);
assert(missingDiffRes.isValid === false, 'Rejects missing root difficulty');

// F. Test question count mismatch
const countMismatch = {
  ...SAMPLE_TEST_JS,
  totalQuestions: 10, // actual questions array has 5
};
const mismatchRes = validateQuestionsJson(countMismatch);
assert(mismatchRes.isValid === false, 'Rejects question count mismatch between totalQuestions and questions array');

// G. Test invalid negative marking settings
const invalidNegativeMarking = {
  ...SAMPLE_TEST_JS,
  negativeMarking: {
    enabled: 'yes', // should be boolean
    penaltyPerIncorrectAnswer: -0.5, // should be non-negative
  },
};
const negMarkingRes = validateQuestionsJson(invalidNegativeMarking);
assert(negMarkingRes.isValid === false, 'Rejects invalid negativeMarking structure');

// H. Test missing question fields
const missingQText = {
  ...SAMPLE_TEST_JS,
  questions: [
    {
      ...SAMPLE_TEST_JS.questions[0],
      question: '',
    },
  ],
  totalQuestions: 1,
};
const missingQTextRes = validateQuestionsJson(missingQText);
assert(missingQTextRes.isValid === false, 'Rejects question with empty statement');

// I. Test missing explanation
const missingExpl = {
  ...SAMPLE_TEST_JS,
  questions: [
    {
      ...SAMPLE_TEST_JS.questions[0],
      explanation: '',
    },
  ],
  totalQuestions: 1,
};
const missingExplRes = validateQuestionsJson(missingExpl);
assert(missingExplRes.isValid === false, 'Rejects question with missing explanation');

// J. Test option count != 4
const threeOptions = {
  ...SAMPLE_TEST_JS,
  questions: [
    {
      ...SAMPLE_TEST_JS.questions[0],
      options: [
        { id: 'A', text: '1' },
        { id: 'B', text: '2' },
        { id: 'C', text: '3' },
      ],
    },
  ],
  totalQuestions: 1,
};
const threeOptRes = validateQuestionsJson(threeOptions);
assert(threeOptRes.isValid === false, 'Rejects question with 3 options instead of 4');

// K. Test invalid correctAnswer reference
const badAnswerRef = {
  ...SAMPLE_TEST_JS,
  questions: [
    {
      ...SAMPLE_TEST_JS.questions[0],
      correctAnswer: 'Z',
    },
  ],
  totalQuestions: 1,
};
const badAnswerRes = validateQuestionsJson(badAnswerRef);
assert(badAnswerRes.isValid === false, 'Rejects question when correctAnswer does not match any option ID');

// L. Test duplicate question IDs
const dupQuestionId = {
  ...SAMPLE_TEST_JS,
  questions: [
    { ...SAMPLE_TEST_JS.questions[0], id: 1 },
    { ...SAMPLE_TEST_JS.questions[1], id: 1 },
  ],
  totalQuestions: 2,
};
const dupQRes = validateQuestionsJson(dupQuestionId);
assert(dupQRes.isValid === false, 'Rejects questions with duplicate question IDs');

// M. Test missing commas in invalid JSON syntax
const missingCommaJson = '{\n  "title": "Missing Comma"\n  "topic": "JavaScript"\n}';
const missingCommaRes = validateQuestionsJson(missingCommaJson);
assert(missingCommaRes.isValid === false, 'Rejects invalid JSON with missing comma');
assert(missingCommaRes.errors[0].includes('Invalid JSON syntax'), 'Identifies syntax error on missing comma');

// N. Test ChatGPT output with curly quotation marks
const chatGptCurlyJson = `{
  “title”: “Cloud & Architecture Test”,
  “topic”: “Cloud Computing”,
  “difficulty”: “Medium”,
  “totalQuestions”: 1,
  “timePerQuestionMinutes”: 1,
  “totalDurationMinutes”: 1,
  “marksPerCorrectAnswer”: 1,
  “negativeMarking”: {
    “enabled”: true,
    “penaltyPerIncorrectAnswer”: 0.25
  },
  “questions”: [
    {
      “id”: 1,
      “question”: “What is the primary function of ‘Kubernetes’?”,
      “options”: [
        { “id”: “A”, “text”: “Container orchestration” },
        { “id”: “B”, “text”: “It’s a relational database” },
        { “id”: “C”, “text”: “A programming language” },
        { “id”: “D”, “text”: “None of the above” }
      ],
      “correctAnswer”: “A”,
      “explanation”: “Kubernetes automates deployment, scaling, and management of containerized applications.”
    }
  ]
}`;
const curlyRes = validateQuestionsJson(chatGptCurlyJson);
assert(curlyRes.isValid === true, 'Successfully normalizes and validates JSON with curly quotation marks');
assert(curlyRes.wasNormalized === true, 'Flags that curly quotes were normalized');
assert(typeof curlyRes.normalizedJson === 'string', 'Provides normalized JSON string for copying');
assert(curlyRes.data.questions[0].question.includes('‘Kubernetes’'), 'Preserves single quotes/apostrophes inside question text');
assert(curlyRes.data.questions[0].options[1].text.includes('It’s'), 'Preserves apostrophes inside option text');

// O. Test Markdown code block wrapping JSON with curly quotation marks
const mdCurlyJson = `Here is your requested test:\n\`\`\`json\n${chatGptCurlyJson}\n\`\`\`\nHope this helps!`;
const mdCurlyRes = validateQuestionsJson(mdCurlyJson);
assert(mdCurlyRes.isValid === true, 'Successfully handles Markdown block containing curly quotation marks');
assert(mdCurlyRes.wasNormalized === true, 'Flags normalization for markdown-wrapped curly JSON');

// P. Test question text containing JavaScript code, apostrophes, and escaped newlines
const jsCodeTest = `{
  “title”: “Advanced JavaScript Test”,
  “topic”: “JavaScript”,
  “difficulty”: “Hard”,
  “totalQuestions”: 1,
  “timePerQuestionMinutes”: 2,
  “totalDurationMinutes”: 2,
  “marksPerCorrectAnswer”: 2,
  “negativeMarking”: {
    “enabled”: false,
    “penaltyPerIncorrectAnswer”: 0
  },
  “questions”: [
    {
      “id”: 1,
      “question”: “What will this code print?\\nfunction calculate() {\\n  const message = ‘Antigravity IDE’;\\n  console.log(message + \\” v2.0\\”);\\n}\\ncalculate();\\nIsn’t this closure-safe?”,
      “options”: [
        { “id”: “A”, “text”: “Antigravity IDE v2.0” },
        { “id”: “B”, “text”: “undefined” },
        { “id”: “C”, “text”: “ReferenceError: message isn’t defined” },
        { “id”: “D”, “text”: “None” }
      ],
      “correctAnswer”: “A”,
      “explanation”: “The function logs ‘Antigravity IDE v2.0’. Outer scope isn’t leaked.”
    }
  ]
}`;
const jsCodeRes = validateQuestionsJson(jsCodeTest);
assert(jsCodeRes.isValid === true, 'Parses question text with JS code, apostrophes, and escaped newlines');
assert(jsCodeRes.data.questions[0].question.includes('\n'), 'Preserves escaped newlines in question');
assert(jsCodeRes.data.questions[0].question.includes('const message = ‘Antigravity IDE’;'), 'Preserves JS code and inner quotes');
assert(jsCodeRes.data.questions[0].question.includes("Isn’t"), 'Preserves apostrophes in question text');
assert(jsCodeRes.data.questions[0].options[2].text.includes("isn’t"), 'Preserves apostrophes in option text');
assert(jsCodeRes.data.questions[0].explanation.includes("isn’t"), 'Preserves apostrophes in explanation');

// Q. Test invalid JSON with curly quotes that cannot be parsed
const invalidCurlyJson = `{\n  “title”: “Incomplete Test”,\n  “topic”: “JS”,\n  “questions”: [`;
const invalidCurlyRes = validateQuestionsJson(invalidCurlyJson);
assert(invalidCurlyRes.isValid === false, 'Rejects invalid JSON syntax even when curly quotes present');
assert(invalidCurlyRes.errors[0].includes('Standard ASCII double quotes (") are required'), 'Explains standard ASCII double quotes are required');

// R. Test missing required fields in curly-quoted JSON
const missingFieldCurly = `{
  “title”: “Test”,
  “difficulty”: “Medium”,
  “totalQuestions”: 1,
  “timePerQuestionMinutes”: 1,
  “totalDurationMinutes”: 1,
  “marksPerCorrectAnswer”: 1,
  “negativeMarking”: { “enabled”: false, “penaltyPerIncorrectAnswer”: 0 },
  “questions”: [
    {
      “id”: 1,
      “question”: “Sample question?”,
      “options”: [
        { “id”: “A”, “text”: “1” }, { “id”: “B”, “text”: “2” },
        { “id”: “C”, “text”: “3” }, { “id”: “D”, “text”: “4” }
      ],
      “correctAnswer”: “A”,
      “explanation”: “Sample”
    }
  ]
}`;
const missingFieldRes = validateQuestionsJson(missingFieldCurly);
assert(missingFieldRes.isValid === false, 'Rejects missing required field in curly-quoted JSON');
assert(missingFieldRes.errors.some(e => e.includes('"topic"')), 'Correctly flags missing topic in normalized data');

// S. Test incorrect correctAnswer reference in curly-quoted JSON
const badCorrectAnsCurly = `{
  “title”: “Test”,
  “topic”: “Science”,
  “difficulty”: “Medium”,
  “totalQuestions”: 1,
  “timePerQuestionMinutes”: 1,
  “totalDurationMinutes”: 1,
  “marksPerCorrectAnswer”: 1,
  “negativeMarking”: { “enabled”: false, “penaltyPerIncorrectAnswer”: 0 },
  “questions”: [
    {
      “id”: 1,
      “question”: “Sample question?”,
      “options”: [
        { “id”: “A”, “text”: “1” }, { “id”: “B”, “text”: “2” },
        { “id”: “C”, “text”: “3” }, { “id”: “D”, “text”: “4” }
      ],
      “correctAnswer”: “Z”,
      “explanation”: “Sample”
    }
  ]
}`;
const badCorrectRes = validateQuestionsJson(badCorrectAnsCurly);
assert(badCorrectRes.isValid === false, 'Rejects incorrect correctAnswer in curly-quoted JSON');
assert(badCorrectRes.errors.some(e => e.includes('does not match any of its option IDs')), 'Flags correctAnswer mismatch');

// 3. SCORE CALCULATION TESTS
console.log('\n--- Testing Score Calculation ---');
const mockQuestions = [
  { id: 1, question: 'Q1', options: [], correctAnswer: 'A' },
  { id: 2, question: 'Q2', options: [], correctAnswer: 'B' },
  { id: 3, question: 'Q3', options: [], correctAnswer: 'C' },
  { id: 4, question: 'Q4', options: [], correctAnswer: 'D' },
  { id: 5, question: 'Q5', options: [], correctAnswer: 'A' },
];

const userAns = {
  1: 'A', // correct
  2: 'B', // correct
  3: 'C', // correct
  4: 'A', // incorrect (correct is D)
  // 5 is unanswered
};

const scored = calculateResults({
  questions: mockQuestions,
  userAnswers: userAns,
  marksPerCorrectAnswer: 1,
  negativeMarking: { enabled: true, penaltyPerIncorrectAnswer: 0.25 },
  totalDurationSeconds: 300,
  timeRemainingSeconds: 120,
});

assert(scored.totalQuestions === 5, 'Total questions is 5');
assert(scored.correctCount === 3, 'Correct count is 3');
assert(scored.incorrectCount === 1, 'Incorrect count is 1');
assert(scored.unansweredCount === 1, 'Unanswered count is 1');
assert(scored.finalScore === 2.75, 'Final score is 2.75');
assert(scored.maxPossibleMarks === 5, 'Max possible marks is 5');
assert(scored.percentage === 55, 'Percentage is 55%');
assert(scored.accuracy === 75, 'Accuracy among attempted is 75%');
assert(scored.timeTakenSeconds === 180, 'Time taken is 180s (300 - 120)');

// Test division by zero when no questions attempted
const zeroAttempt = calculateResults({
  questions: mockQuestions,
  userAnswers: {},
  marksPerCorrectAnswer: 1,
  negativeMarking: { enabled: true, penaltyPerIncorrectAnswer: 0.25 },
  totalDurationSeconds: 300,
  timeRemainingSeconds: 300,
});
assert(zeroAttempt.accuracy === null, 'Accuracy is null (displays as N/A) when 0 attempted without NaN/Infinity');
assert(zeroAttempt.finalScore === 0, 'Score is 0 when 0 attempted');
assert(zeroAttempt.percentage === 0, 'Percentage is 0 when 0 attempted');

// Test negative marking disabled
const noNegMarking = calculateResults({
  questions: mockQuestions,
  userAnswers: userAns,
  marksPerCorrectAnswer: 1,
  negativeMarking: { enabled: false, penaltyPerIncorrectAnswer: 0.25 },
  totalDurationSeconds: 300,
  timeRemainingSeconds: 100,
});
assert(noNegMarking.finalScore === 3, 'Final score does not penalize when negative marking is disabled (score = 3)');

console.log(`\n🎉 ALL ${passed} OF ${total} TESTS PASSED SUCCESSFULLY!`);
