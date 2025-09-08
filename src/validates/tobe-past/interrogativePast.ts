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

  const startsWithWas = /^Was /.test(cleanSentence);
  const startsWithWere = /^Were /.test(cleanSentence);
  
  if (!startsWithWas && !startsWithWere) {
    errors.push("Interrogative sentences in past tense must start with 'Was' or 'Were'");
    isValid = false;
  }

  if (startsWithWas && startsWithWere) {
    errors.push("Use either 'Was' or 'Were', not both");
    isValid = false;
  }

  const patterns = [
    /^Was (i|he|she|it|this|that) [A-Za-z ]+ \?$/,
    /^Were (we|you|they|these|those) [A-Za-z ]+ \?$/,
    /^Was [A-Z][a-z]+ [A-Za-z ]+ \?$/,
    /^Were [A-Z][a-z]+ [A-Za-z ]+ \?$/,
    /^Was the [a-z]+ [A-Za-z ]+ \?$/,
    /^Were the [a-z]+ [A-Za-z ]+ \?$/,
  ];

  const matchesPattern = patterns.some((pattern) => pattern.test(cleanSentence));
  
  if (!matchesPattern) {
    if (!/^[A-Z]/.test(cleanSentence)) {
      errors.push("Sentences should begin with a capital letter.");
    }
    errors.push("Sentence structure should be: Was/Were + Subject + Complement + ?");
    isValid = false;
  }

  if (startsWithWas) {
    if (/^Was (we|you|they|these|those) /.test(cleanSentence)) {
      errors.push("'we', 'you', 'they' should use 'Were', not 'Was'");
      isValid = false;
    }
  }

  if (startsWithWere) {
    if (/^Were (i|he|she|it|this|that) /.test(cleanSentence)) {
      errors.push("'i', 'he', 'she', 'it' should use 'Was', not 'Were'");
      isValid = false;
    }
  }

  if (/^Was The /.test(cleanSentence) || /^Were The /.test(cleanSentence)) {
    errors.push("Use 'the' in lowercase, not 'The'");
    isValid = false;
  }

  const theMatch = cleanSentence.match(/^(Was|Were) the ([a-z]+) /);
  if (theMatch) {
    const verb = theMatch[1];
    const noun = theMatch[2];
    const isPlural = /^[a-z]+s$/.test(noun);

    if (verb === "Was" && isPlural) {
      errors.push(`'The ${noun}' is plural, so use 'Were', not 'Was'`);
      isValid = false;
    } else if (verb === "Were" && !isPlural) {
      errors.push(`'The ${noun}' is singular, so use 'Was', not 'Were'`);
      isValid = false;
    }
  }

  let message = "";         
  if (isValid) {
    message = "✅ Excellent! Your interrogative sentence is correct. It follows the pattern: Was/Were + Subject + Complement + ?";
  } else {
    message = "❌ Please correct the following errors:\n" + errors.map(e => `• ${e}`).join("\n");
  }

  return { isValid, message, errors };
}
