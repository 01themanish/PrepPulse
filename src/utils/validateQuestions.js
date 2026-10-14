/**
 * JSON Parsing and Validation Utility
 * Safely parses and validates MCQ question data against the expected schema.
 * Rejects invalid or malformed data without crashing or silently altering content.
 */

/**
 * Normalizes curly quotation marks used as JSON structural delimiters
 * into standard ASCII double quotes (") without corrupting apostrophes
 * or quotation marks inside question text, strings, and JavaScript code examples.
 */
export function normalizeCurlyQuotes(raw) {
  if (typeof raw !== 'string') return { normalized: raw, wasNormalized: false, hasCurlyQuotes: false };

  // If already parses cleanly with JSON.parse, no normalization needed
  try {
    JSON.parse(raw);
    return { normalized: raw, wasNormalized: false, hasCurlyQuotes: false };
  } catch (e) {
    // Continue with normalization attempt
  }

  const hasCurlyQuotes = /[\u201C\u201D\u201E\u00AB\u00BB\u2018\u2019]/.test(raw);
  if (!hasCurlyQuotes) {
    return { normalized: raw, wasNormalized: false, hasCurlyQuotes: false };
  }

  let result = '';
  let i = 0;
  const len = raw.length;

  function isDoubleQuoteLike(ch) {
    return ch === '"' || ch === '\u201C' || ch === '\u201D' || ch === '\u201E' || ch === '\u00AB' || ch === '\u00BB';
  }

  function isQuote(ch) {
    return isDoubleQuoteLike(ch) || ch === "'" || ch === '\u2018' || ch === '\u2019';
  }

  while (i < len) {
    const ch = raw[i];

    // Structural tokens outside strings
    if (ch === '{' || ch === '}' || ch === '[' || ch === ']' || ch === ':' || ch === ',') {
      result += ch;
      i++;
      continue;
    }

    if (/\s/.test(ch)) {
      result += ch;
      i++;
      continue;
    }

    // Number, boolean, null literals
    const literalMatch = raw.slice(i).match(/^(true|false|null|-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)/);
    if (literalMatch && !isQuote(ch)) {
      result += literalMatch[1];
      i += literalMatch[1].length;
      continue;
    }

    // A quote starting a key or string value
    if (isQuote(ch)) {
      const openQuote = ch;
      const isDbl = isDoubleQuoteLike(openQuote);
      let j = i + 1;
      let foundClose = -1;

      while (j < len) {
        if (raw[j] === '\\') {
          j += 2;
          continue;
        }

        const cand = raw[j];
        const candIsMatching = isDbl
          ? isDoubleQuoteLike(cand)
          : (cand === "'" || cand === '\u2018' || cand === '\u2019');

        if (candIsMatching) {
          const rest = raw.slice(j + 1).trimStart();

          // Case 1: Key in object (followed by colon)
          if (rest.startsWith(':')) {
            foundClose = j;
            break;
          }

          // Case 2: Value in object/array (followed by comma then next item, or closing bracket/brace)
          const validNextTokenPattern = /^(?:,\s*(?:[\u201C"\u201D\u201E\u00AB\u00BB'‘][a-zA-Z0-9_$]+[\u201D"\u201C\u201E\u00AB\u00BB'’]\s*:|[\{\}\[\]]|true|false|null|-?\d|[\u201C"\u201D\u201E\u00AB\u00BB'‘])|[\}\]])/;
          if (validNextTokenPattern.test(rest)) {
            foundClose = j;
            break;
          }
        }
        j++;
      }

      if (foundClose !== -1) {
        const innerContent = raw.slice(i + 1, foundClose);
        let escapedInner = '';
        for (let k = 0; k < innerContent.length; k++) {
          if (innerContent[k] === '\\') {
            const nextCh = k + 1 < innerContent.length ? innerContent[k + 1] : '';
            if (nextCh === '\u201C' || nextCh === '\u201D' || nextCh === '\u201E') {
              escapedInner += '\\"';
              k++;
            } else if (nextCh === '\u2018' || nextCh === '\u2019' || nextCh === "'") {
              escapedInner += nextCh;
              k++;
            } else {
              escapedInner += '\\' + nextCh;
              k++;
            }
          } else if (innerContent[k] === '"') {
            escapedInner += '\\"';
          } else {
            escapedInner += innerContent[k];
          }
        }

        result += '"' + escapedInner + '"';
        i = foundClose + 1;
        continue;
      } else {
        // If no safe closing quote was found, append as-is and continue
        result += ch;
        i++;
        continue;
      }
    }

    result += ch;
    i++;
  }

  return {
    normalized: result,
    wasNormalized: result !== raw,
    hasCurlyQuotes: true,
  };
}

export function parseAndExtractJson(rawInput) {
  if (!rawInput || (typeof rawInput === 'string' && !rawInput.trim())) {
    return {
      success: false,
      data: null,
      error: 'Input is empty. Please paste your JSON questions or upload a .json file.',
      normalizedJson: null,
      wasNormalized: false,
      hasCurlyQuotes: false,
    };
  }

  // If already parsed object
  if (typeof rawInput === 'object' && rawInput !== null) {
    return {
      success: true,
      data: rawInput,
      error: null,
      normalizedJson: null,
      wasNormalized: false,
      hasCurlyQuotes: false,
    };
  }

  const trimmed = String(rawInput).trim();

  // Support JSON wrapped in a single Markdown code block
  const codeBlockMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  const textToParse = codeBlockMatch && codeBlockMatch[1] ? codeBlockMatch[1].trim() : trimmed;
  const isInsideMarkdown = Boolean(codeBlockMatch);

  // 1. Try parsing directly
  try {
    const directParsed = JSON.parse(textToParse);
    return {
      success: true,
      data: directParsed,
      error: null,
      normalizedJson: null,
      wasNormalized: false,
      hasCurlyQuotes: false,
    };
  } catch (directErr) {
    // 2. If direct parsing fails, check if curly quotation marks are present
    const hasCurlyQuotes = /[\u201C\u201D\u201E\u00AB\u00BB\u2018\u2019]/.test(textToParse);

    if (hasCurlyQuotes) {
      const { normalized, wasNormalized } = normalizeCurlyQuotes(textToParse);
      if (wasNormalized) {
        try {
          const normalizedParsed = JSON.parse(normalized);
          return {
            success: true,
            data: normalizedParsed,
            error: null,
            normalizedJson: normalized,
            wasNormalized: true,
            hasCurlyQuotes: true,
          };
        } catch (normErr) {
          const prefix = isInsideMarkdown ? 'Invalid JSON inside Markdown block' : 'Invalid JSON syntax';
          return {
            success: false,
            data: null,
            error: `${prefix}: ${normErr.message}. Note: Curly quotation marks (“ ” or ‘ ’) were detected. Standard ASCII double quotes (") are required for valid JSON.`,
            normalizedJson: null,
            wasNormalized: false,
            hasCurlyQuotes: true,
          };
        }
      }
    }

    if (isInsideMarkdown) {
      return {
        success: false,
        data: null,
        error: `Invalid JSON inside Markdown block: ${directErr.message}`,
        normalizedJson: null,
        wasNormalized: false,
        hasCurlyQuotes: false,
      };
    }

    return {
      success: false,
      data: null,
      error: `Invalid JSON syntax: ${directErr.message}. Ensure there are no extra text, unescaped quotes, or missing brackets.`,
      normalizedJson: null,
      wasNormalized: false,
      hasCurlyQuotes: false,
    };
  }
}

export function validateQuestionsJson(rawInput) {
  const errors = [];

  // Parse JSON
  const parseResult = parseAndExtractJson(rawInput);
  const { success, data: parsed, error: parseError } = parseResult;
  if (!success || !parsed) {
    return {
      isValid: false,
      data: null,
      errors: [parseError || 'Could not parse JSON input.'],
      normalizedJson: parseResult?.normalizedJson || null,
      wasNormalized: Boolean(parseResult?.wasNormalized),
      hasCurlyQuotes: Boolean(parseResult?.hasCurlyQuotes),
    };
  }

  // Root must be an object and not an array
  if (typeof parsed !== 'object' || Array.isArray(parsed) || parsed === null) {
    return {
      isValid: false,
      data: null,
      errors: ['Root JSON structure must be an object (e.g. { "title": "...", "questions": [...] }). Received an array or primitive.'],
    };
  }

  // Validate root required fields
  if (typeof parsed.title !== 'string' || !parsed.title.trim()) {
    errors.push('Missing or invalid root field "title". Must be a non-empty string.');
  }

  if (typeof parsed.topic !== 'string' || !parsed.topic.trim()) {
    errors.push('Missing or invalid root field "topic". Must be a non-empty string.');
  }

  if (typeof parsed.difficulty !== 'string' || !parsed.difficulty.trim()) {
    errors.push('Missing or invalid root field "difficulty". Must be a non-empty string (e.g. "Easy", "Medium", "Hard", "Mixed").');
  }

  if (typeof parsed.totalQuestions !== 'number' || !Number.isInteger(parsed.totalQuestions) || parsed.totalQuestions <= 0) {
    errors.push('Missing or invalid root field "totalQuestions". Must be a positive integer.');
  }

  if (typeof parsed.timePerQuestionMinutes !== 'number' || isNaN(parsed.timePerQuestionMinutes) || parsed.timePerQuestionMinutes <= 0) {
    errors.push('Missing or invalid root field "timePerQuestionMinutes". Must be a positive number.');
  }

  if (typeof parsed.totalDurationMinutes !== 'number' || isNaN(parsed.totalDurationMinutes) || parsed.totalDurationMinutes <= 0) {
    errors.push('Missing or invalid root field "totalDurationMinutes". Must be a positive number.');
  }

  if (typeof parsed.marksPerCorrectAnswer !== 'number' || isNaN(parsed.marksPerCorrectAnswer) || parsed.marksPerCorrectAnswer <= 0) {
    errors.push('Missing or invalid root field "marksPerCorrectAnswer". Must be a positive number.');
  }

  // Validate negativeMarking settings
  if (!parsed.negativeMarking || typeof parsed.negativeMarking !== 'object' || Array.isArray(parsed.negativeMarking)) {
    errors.push('Missing or invalid root field "negativeMarking". Must be an object with "enabled" and "penaltyPerIncorrectAnswer".');
  } else {
    if (typeof parsed.negativeMarking.enabled !== 'boolean') {
      errors.push('"negativeMarking.enabled" must be a boolean (true or false).');
    }
    if (
      typeof parsed.negativeMarking.penaltyPerIncorrectAnswer !== 'number' ||
      isNaN(parsed.negativeMarking.penaltyPerIncorrectAnswer) ||
      parsed.negativeMarking.penaltyPerIncorrectAnswer < 0
    ) {
      errors.push('"negativeMarking.penaltyPerIncorrectAnswer" must be a non-negative number (0 or greater).');
    }
  }

  // Validate questions array
  if (!Array.isArray(parsed.questions)) {
    errors.push('Missing or invalid "questions" property. Must be an array of question objects.');
    return {
      isValid: false,
      data: null,
      errors,
    };
  }

  if (parsed.questions.length === 0) {
    errors.push('The "questions" array is empty. At least one question is required.');
  }

  // Validate count consistency
  if (typeof parsed.totalQuestions === 'number' && parsed.questions.length !== parsed.totalQuestions) {
    errors.push(
      `"totalQuestions" specifies ${parsed.totalQuestions} question(s), but the "questions" array contains ${parsed.questions.length} question(s).`
    );
  }

  // Validate each question
  const seenQuestionIds = new Set();

  parsed.questions.forEach((q, idx) => {
    const qLabel = `Question #${idx + 1}`;

    if (!q || typeof q !== 'object' || Array.isArray(q)) {
      errors.push(`${qLabel} is not a valid object.`);
      return;
    }

    // ID validation
    if (q.id === undefined || q.id === null || String(q.id).trim() === '') {
      errors.push(`${qLabel} is missing an "id" field.`);
    } else {
      const idKey = String(q.id);
      if (seenQuestionIds.has(idKey)) {
        errors.push(`${qLabel} has duplicate ID "${q.id}". Every question ID must be unique.`);
      }
      seenQuestionIds.add(idKey);
    }

    // Question statement validation
    if (typeof q.question !== 'string' || !q.question.trim()) {
      errors.push(`${qLabel} has missing or empty "question" text.`);
    }

    // Options validation
    if (!Array.isArray(q.options)) {
      errors.push(`${qLabel} "options" property must be an array.`);
      return;
    }

    if (q.options.length !== 4) {
      errors.push(`${qLabel} must have exactly 4 options. Found ${q.options.length}.`);
    }

    const seenOptionIds = new Set();
    const validOptionIds = [];

    q.options.forEach((opt, optIdx) => {
      const optLabel = `${qLabel} Option #${optIdx + 1}`;

      if (!opt || typeof opt !== 'object' || Array.isArray(opt)) {
        errors.push(`${optLabel} is not a valid option object.`);
        return;
      }

      if (typeof opt.id !== 'string' || !opt.id.trim()) {
        errors.push(`${optLabel} is missing an "id" string (e.g. "A", "B", "C", "D").`);
      } else {
        const normOptId = opt.id.trim().toUpperCase();
        if (seenOptionIds.has(normOptId)) {
          errors.push(`${qLabel} has duplicate option ID "${opt.id}". Option IDs within a question must be unique.`);
        }
        seenOptionIds.add(normOptId);
        validOptionIds.push(normOptId);
      }

      if (opt.text === undefined || opt.text === null || String(opt.text).trim() === '') {
        errors.push(`${optLabel} has empty or missing "text".`);
      }
    });

    // Correct Answer validation
    if (typeof q.correctAnswer !== 'string' || !q.correctAnswer.trim()) {
      errors.push(`${qLabel} is missing a "correctAnswer" identifier.`);
    } else {
      const normCorrect = q.correctAnswer.trim().toUpperCase();
      if (!validOptionIds.includes(normCorrect)) {
        errors.push(
          `${qLabel} "correctAnswer" ("${q.correctAnswer}") does not match any of its option IDs (${validOptionIds.join(', ') || 'none'}).`
        );
      }
    }

    // Explanation validation
    if (typeof q.explanation !== 'string' || !q.explanation.trim()) {
      errors.push(`${qLabel} is missing a required "explanation" string.`);
    }
  });

  return {
    isValid: errors.length === 0,
    data: errors.length === 0 ? parsed : null,
    errors,
    normalizedJson: parseResult?.normalizedJson || null,
    wasNormalized: Boolean(parseResult?.wasNormalized),
    hasCurlyQuotes: Boolean(parseResult?.hasCurlyQuotes),
  };
}
