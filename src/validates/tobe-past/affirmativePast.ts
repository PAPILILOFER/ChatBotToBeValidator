interface ValidationResult {
  isValid: boolean;
  message: string;
  errors: string[];
}

export function validateAffirmativePast(sentence: string): ValidationResult {
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

  if (!/\.$/.test(cleanSentence)) {
    errors.push("Sentence should end with a period (.)");
    isValid = false;
  }

  if (!/^[A-Z]/.test(cleanSentence)) {
    errors.push("Sentences should begin with a capital letter.");
    isValid = false;
  }

  const patterns = [
    /^(I|He|She|It|This|That)\ was [A-Za-z ]+\.$/,
    /^(We|You|They|These|Those)\ were [A-Za-z ]+\.$/,
    /^[A-Z][a-z]+ was [A-Za-z ]+\.$/,
    /^The [a-z]+ (was|were) [A-Za-z ]+\.$/,
  ];

  const matchesPattern = patterns.some(pattern => pattern.test(cleanSentence));

  if (!matchesPattern) {
    errors.push("Sentence structure should be: Subject + was/were + complement");
    isValid = false;
  }

  if (!/ (was|were) /.test(cleanSentence)) {
    errors.push("Use 'was' or 'were' for past tense, separated by spaces (not 'am', 'is', 'are', or joined words like 'Iwas').");
    isValid = false;
  }

  const hasWas = / was /.test(cleanSentence);
  const hasWere = / were /.test(cleanSentence);

  if (hasWas && hasWere) {
    errors.push("Use either 'was' or 'were', not both");
    isValid = false;
  }

  if (hasWas) {
    if (/^(We|You|They|These|Those) was /.test(cleanSentence)) {
      errors.push("'We', 'You', 'They' should use 'were', not 'was'");
      isValid = false;
    }
  }

  if (hasWere) {
    if (/^(I|He|She|It|This|That) were /.test(cleanSentence)) {
      errors.push("'I', 'He', 'She', 'It' should use 'was', not 'were'");
      isValid = false;
    }
  }

  if (/ (was|were) not /.test(cleanSentence)) {
    errors.push("This sentence is negative, not affirmative. Remove 'not' for affirmative past tense.");
    isValid = false;
  }

  const theMatch = cleanSentence.match(/^The ([a-z]+) (was|were) /);
  if (theMatch) {
    const noun = theMatch[1];
    const verb = theMatch[2];
    const isPlural = /^[a-z]+s$/.test(noun);

    if (isPlural && verb === "was") {
      errors.push(`'The ${noun}' is plural, so use 'were', not 'was'`);
      isValid = false;
    }
    if (!isPlural && verb === "were") {
      errors.push(`'The ${noun}' is singular, so use 'was', not 'were'`);
      isValid = false;
    }
  }

  let message = "";
  if (isValid) {
    message = "✅ Excellent! Your sentence is correct. It follows the pattern: Subject + was/were + complement";
  } else {
    message = "❌ Please correct the following errors:\n" + errors.map(error => `• ${error}`).join('\n');
  }

  return {
    isValid,
    message,
    errors
  };
}
