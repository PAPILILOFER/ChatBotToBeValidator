interface ValidationResult {
  isValid: boolean;
  message: string;
  errors: string[];
}

export function validateInterrogativePast(sentence: string): ValidationResult {
  const errors: string[] = [];
  let isValid = true;

  const cleanSentence = sentence.trim();

  if (!cleanSentence) {
    return {
      isValid: false,
      message: "❌ Please write a sentence.",
      errors: ["Empty sentence"],
    };
  }


  if (!/\?$/.test(cleanSentence)) {
    errors.push("Sentence should end with a question mark (?)");
    isValid = false;
  }

  if (!/^(Was|Were)\b/i.test(cleanSentence)) {
    errors.push("Interrogative sentences in past tense must start with 'Was' or 'Were'");
    isValid = false;
  }

 const patterns = [
  /^Was\s+(I|he|she|it|[A-Z][a-z]+)\s+.+\?$/i,
  /^Were\s+(we|you|they|[A-Z][a-z]+s?)\s+.+\?$/i,
];

const matchesPattern = patterns.some((regex) => regex.test(cleanSentence));


  if (!matchesPattern) {
    errors.push("Sentence structure should be: Was/Were + Subject + Complement + ?");
    isValid = false;
  }


  const subjectMatch = cleanSentence.match(/^(Was|Were)\s+(\w+)/i);
  if (subjectMatch) {
    const verb = subjectMatch[1];
    const subject = subjectMatch[2];

    if (verb.toLowerCase() === "was" && ["We", "You", "They"].includes(subject)) {
      errors.push(`'${subject}' should use 'Were', not 'Was'`);
      isValid = false;
    }

    if (verb.toLowerCase() === "were" && ["I", "He", "She", "It"].includes(subject)) {
      errors.push(`'${subject}' should use 'Was', not 'Were'`);
      isValid = false;
    }
  }

  if (/\bwas\b/i.test(cleanSentence) && /\bwere\b/i.test(cleanSentence)) {
    errors.push("Use either 'Was' or 'Were', not both");
    isValid = false;
  }

  let message = "";         
  if (isValid) {
    message = "✅ Excellent! Your interrogative sentence is correct. It follows the pattern: Was/Were + Subject + Complement + ?";
  } else {
    message = "❌ Please correct the following errors:\n" + errors.map(e => `• ${e}`).join("\n");
  }

  return { isValid, message, errors };
}
