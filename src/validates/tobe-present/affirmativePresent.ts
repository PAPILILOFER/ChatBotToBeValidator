interface ValidationResult {
  isValid: boolean;
  message: string;
  errors: string[];
}

export function validateAffirmativePresent(sentence: string): ValidationResult {
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
    /^I am [A-Za-z ]+\.$/,
    /^(He|She|It|This|That)( [A-Za-z]+)? is [A-Za-z ]+\.$/,
    /^(We|You|They|These|Those) are [A-Za-z ]+\.$/,
    /^[A-Z][a-z]+ is [A-Za-z ]+\.$/,
    /^The [a-z]+ (is|are) [A-Za-z ]+\.$/,
  ];

  const matchesPattern = patterns.some(pattern => pattern.test(cleanSentence));

  if (!matchesPattern) {
    errors.push("Sentence structure should be: Subject + am/is/are + complement");
    isValid = false;
  }

  if (!/ (am|is|are) /.test(cleanSentence)) {
    errors.push("Use 'am', 'is', or 'are' for present tense, separated by spaces (not 'was', 'were', or joined words like 'Iam').");
    isValid = false;
  }

  const hasAm = / am /.test(cleanSentence);
  const hasIs = / is /.test(cleanSentence);
  const hasAre = / are /.test(cleanSentence);

  const verbCount = [hasAm, hasIs, hasAre].filter(Boolean).length;
  if (verbCount > 1) {
    errors.push("Use only one verb: 'am', 'is', or 'are'");
    isValid = false;
  }

  if (hasAm) {
    if (!/^I am /.test(cleanSentence)) {
      errors.push("Only 'I' can use 'am'");
      isValid = false;
    }
  }

  if (hasIs) {
    if (/^(We|You|They|These|Those) is /.test(cleanSentence)) {
      errors.push("'We', 'You', 'They' should use 'are', not 'is'");
      isValid = false;
    }
    if (/^I is /.test(cleanSentence)) {
      errors.push("'I' should use 'am', not 'is'");
      isValid = false;
    }
  }

  if (hasAre) {
    if (/^(I|He|She|It|This|That) are /.test(cleanSentence)) {
      errors.push("'I', 'He', 'She', 'It' should use 'am' or 'is', not 'are'");
      isValid = false;
    }
  }

  if (/ (was|were) /.test(cleanSentence)) {
    errors.push("This sentence is in past tense, not present. Use 'am', 'is', or 'are' for present tense.");
    isValid = false;
  }

  if (/ (am not|is not|are not|am't|isn't|aren't) /.test(cleanSentence)) {
    errors.push("This sentence is negative, not affirmative. Remove 'not' for affirmative present tense.");
    isValid = false;
  }

  const theMatch = cleanSentence.match(/^The ([a-z]+) (is|are) /);
  if (theMatch) {
    const noun = theMatch[1];
    const verb = theMatch[2];
    const isPlural = /^[a-z]+s$/.test(noun);

    if (isPlural && verb === "is") {
      errors.push(`'The ${noun}' is plural, so use 'are', not 'is'`);
      isValid = false;
    }
    if (!isPlural && verb === "are") {
      errors.push(`'The ${noun}' is singular, so use 'is', not 'are'`);
      isValid = false;
    }
  }

  let message = "";
  if (isValid) {
    message = "✅ Excellent! Your sentence is correct. It follows the pattern: Subject + am/is/are + complement";
  } else {
    message = "❌ Please correct the following errors:\n" + errors.map(error => `• ${error}`).join('\n');
  }

  return {
    isValid,
    message,
    errors
  };
}
