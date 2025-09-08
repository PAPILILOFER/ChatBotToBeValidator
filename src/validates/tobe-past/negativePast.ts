interface ValidationResult {
  isValid: boolean;
  message: string;
  errors: string[];
}

export function validateNegativePast(sentence: string): ValidationResult {
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

  if  (!/\.$/.test(cleanSentence)) {
    errors.push("Sentence should end with a period (.)");
    isValid = false;
  }

  if (!/^[A-Z]/.test(cleanSentence)) {
    errors.push("Sentences should begin with a capital letter.");
    isValid = false;
  }

  const patterns = [   
    /^(I|He|She|It|This|That) (wasn't|was not) [A-Za-z ]+\.$/,
    /^(We|You|They|These|Those) (weren't|were not) [A-Za-z ]+\.$/,
    /^[A-Z][a-z]+ (wasn't|weren't|was not|were not) [A-Za-z ]+\.$/,
    /^The [a-z]+ (wasn't|weren't|was not|were not) [A-Za-z ]+\.$/,
  ];

  const matchesPattern = patterns.some(pattern => pattern.test(cleanSentence));
  
  if (!matchesPattern) {
    errors.push("Sentence structure should be: Subject + wasn't/weren't/was not/were not + complement");
    isValid = false;
  }

  if (!/ (wasn't|weren't|was not|were not) /.test(cleanSentence)) {
    errors.push("Use 'wasn't', 'weren't', 'was not', or 'were not' for negative past tense, separated by spaces (not 'am not', 'is not', 'are not', or joined words like 'Iwasn't').");
    isValid = false;
  }

  const hasWasnt = / (wasn't|was not) /.test(cleanSentence);
  const hasWerent = / (weren't|were not) /.test(cleanSentence);
  
  if (hasWasnt && hasWerent) {
    errors.push("Use either 'wasn't/was not' or 'weren't/were not', not both");
    isValid = false;
  }

  if (hasWasnt) {
    if (/^(We|You|They|These|Those) (wasn't|was not) /.test(cleanSentence)) {
      errors.push("'We', 'You', 'They' should use 'weren't' or 'were not', not 'wasn't' or 'was not'");
      isValid = false;
    }
  }

  if (hasWerent) {
    if (/^(I|He|She|It|This|That) (weren't|were not) /.test(cleanSentence)) {
      errors.push("'I', 'He', 'She', 'It' should use 'wasn't' or 'was not', not 'weren't' or 'were not'");
      isValid = false;
    }
  }

  const theMatch = cleanSentence.match(/^The ([a-z]+) (wasn't|weren't|was not|were not) /);
  if (theMatch) {
    const noun = theMatch[1];
    const verb = theMatch[2];
    const isPlural = /^[a-z]+s$/.test(noun);

    if (isPlural && (verb === "wasn't" || verb === "was not")) {
      errors.push(`'The ${noun}' is plural, so use 'weren't' or 'were not', not 'wasn't' or 'was not'`);
      isValid = false;
    }
    if (!isPlural && (verb === "weren't" || verb === "were not")) {
      errors.push(`'The ${noun}' is singular, so use 'wasn't' or 'was not', not 'weren't' or 'were not'`);
      isValid = false;
    }
  }

  let message = "";
  if (isValid) {
    message = "✅ Excellent! Your sentence is correct. It follows the pattern: Subject + wasn't/weren't/was not/were not + complement";
  } else {
    message = "❌ Please correct the following errors:\n" + errors.map(error => `• ${error}`).join('\n');
  }

  return {
    isValid,
    message,
    errors
  };
}
