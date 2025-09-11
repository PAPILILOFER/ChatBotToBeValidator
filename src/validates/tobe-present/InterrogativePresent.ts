interface ValidationResult {
  isValid: boolean;
  message: string;
  errors: string[];
}

export function validateInterrogativePresent(sentence: string): ValidationResult {
  const errors: string[] = [];
  let isValid = true;

  const cleanSentence = sentence.trim();

  if (!cleanSentence) {
    return {
      isValid: false,
      message: "❌ Please write a sentence.",
      errors: ["Empty sentence"]
    };
  }

  if (!/\?$/.test(cleanSentence)) {
    errors.push("Interrogative sentence should end with a question mark (?)");
    isValid = false;
  }

  if (!/^[A-Z]/.test(cleanSentence)) {
    errors.push("Sentences should begin with a capital letter.");
    isValid = false;
  }

  const patterns = [
    /^Am I [A-Za-z ]+\?$/,
    /^Is (he|she|it|this|that|[A-Z][a-z]+)( [A-Za-z]+)? [A-Za-z ]+\?$/,
    /^Are (we|you|they|these|those|[A-Z][a-z]+( [A-Za-z]+)?) [A-Za-z ]+\?$/,
    /^(What|Where|When|Why|How|Who) (am|is|are) [A-Za-z ]+\?$/,
    /^How (old|tall|much|many) (am|is|are) [A-Za-z ]+\?$/
  ];

  const matchesPattern = patterns.some(pattern => pattern.test(cleanSentence));

  if (!matchesPattern) {
    errors.push("Interrogative sentence structure should be: Am/Is/Are + subject + complement? or Question word + am/is/are + subject + complement?");
    isValid = false;
  }

  if (!/(am|is|are)/.test(cleanSentence)) {
    errors.push("Use 'am', 'is', or 'are' for present tense interrogative.");
    isValid = false;
  }

  const hasAm = /am/.test(cleanSentence);
  const hasIs = /is/.test(cleanSentence);
  const hasAre = /are/.test(cleanSentence);

  const verbCount = [hasAm, hasIs, hasAre].filter(Boolean).length;
  if (verbCount > 1) {
    errors.push("Use only one verb: 'am', 'is', or 'are'");
    isValid = false;
  }

  if (hasAm && !/^Am I/.test(cleanSentence)) {
    errors.push("Only 'I' can use 'Am' in interrogative form (use 'Am I ...?').");
    isValid = false;
  }

  if (hasIs) {
    if (/^Is (we|you|they|these|those)/.test(cleanSentence)) {
      errors.push("'We', 'You', 'They' should use 'Are', not 'Is'.");
      isValid = false;
    }
    if (/^Is I/.test(cleanSentence)) {
      errors.push("'I' should use 'Am', not 'Is'.");
      isValid = false;
    }
  }

  if (hasAre) {
    if (/^Are (he|she|it|this|that|I)/.test(cleanSentence)) {
      errors.push("'He', 'She', 'It', 'I' should not use 'Are' — use 'Is' or 'Am'.");
      isValid = false;
    }
  }

  if (/(was|were)/.test(cleanSentence)) {
    errors.push("This sentence is in past tense, not present. Use 'am', 'is', or 'are' for present tense interrogative.");
    isValid = false;
  }

  if (/(am not|is not|are not|am't|isn't|aren't)/.test(cleanSentence)) {
    errors.push("This sentence seems negative. For simple present interrogative remove 'not' (or use the correct negative question form).");
    isValid = false;
  }

  const theMatch = cleanSentence.match(/^(Is|Are) the ([a-z]+) /);
  if (theMatch) {
    const verb = theMatch[1];
    const noun = theMatch[2];
    const isPlural = /^[a-z]+s$/.test(noun);
    if (isPlural && verb === "is") {
      errors.push(`'The ${noun}' is plural, so use 'Are', not 'Is'`);
      isValid = false;
    }
    if (!isPlural && verb === "are") {
      errors.push(`'The ${noun}' is singular, so use 'Is', not 'Are'`);
      isValid = false;
    }
  }

  let message = "";
  if (isValid) {
    message = "✅ Excellent! Your interrogative sentence is correct. It follows the pattern: Am/Is/Are + subject + complement?";
  } else {
    message = "❌ Please correct the following errors:\n" + errors.map(error => `• ${error}`).join('\n');
  }

  return {
    isValid,
    message,
    errors
  };
}
