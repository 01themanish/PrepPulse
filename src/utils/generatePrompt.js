/**
 * AI Prompt Generator Utility
 * Produces a concise, direct prompt instructing AI models (ChatGPT, Claude, etc.)
 * to output strictly valid JSON matching the application's required schema.
 */

export function generatePrompt({
  topic,
  subtopic = '',
  numQuestions = 10,
  timePerQuestion = 1,
  difficulty = 'Medium',
  marksPerCorrect = 1,
  negativeMarkingEnabled = true,
  penaltyPerIncorrect = 0.25,
}) {
  const count = Number(numQuestions) || 10;
  const timePerQ = Number(timePerQuestion) || 1;
  const totalDuration = count * timePerQ;
  const cleanTopic = topic?.trim() || 'General Knowledge';
  const cleanSubtopic = subtopic?.trim();

  let subtopicLine = '';
  if (cleanSubtopic) {
    subtopicLine = `\nSubtopics: ${cleanSubtopic}`;
  }

  return `Generate ${count} multiple-choice questions on "${cleanTopic}".${subtopicLine}
Difficulty: ${difficulty}

Return valid JSON only.

OUTPUT INSTRUCTIONS:
- Return exactly one valid JSON object.
- Never include introductory text, explanations, or commentary outside the JSON.
- Never wrap the JSON in Markdown code fences (do not use \`\`\` or \`\`\`json).
- Use standard ASCII double quotes (") for every JSON key and string value.
- Never use curly quotation marks (“ ” or ‘ ’) as JSON delimiters.
- Generate exactly ${count} questions in the "questions" array.
- Include four options per question, identified by A, B, C, and D.
- Ensure correctAnswer matches an existing option ID.
- Include an explanation for every question.

JSON SCHEMA:
{
  "title": "${cleanTopic} MCQ Test",
  "topic": "${cleanTopic}",
  "difficulty": "${difficulty}",
  "totalQuestions": ${count},
  "timePerQuestionMinutes": ${timePerQ},
  "totalDurationMinutes": ${totalDuration},
  "marksPerCorrectAnswer": ${Number(marksPerCorrect) || 1},
  "negativeMarking": {
    "enabled": ${Boolean(negativeMarkingEnabled)},
    "penaltyPerIncorrectAnswer": ${negativeMarkingEnabled ? Number(penaltyPerIncorrect) || 0 : 0}
  },
  "questions": [
    {
      "id": 1,
      "question": "Question text",
      "options": [
        { "id": "A", "text": "Option A" },
        { "id": "B", "text": "Option B" },
        { "id": "C", "text": "Option C" },
        { "id": "D", "text": "Option D" }
      ],
      "correctAnswer": "B",
      "explanation": "Explanation of the correct answer."
    }
  ]
}`;
}
