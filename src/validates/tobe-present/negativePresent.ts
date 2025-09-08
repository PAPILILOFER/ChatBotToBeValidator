interface ValidationResult {
    isValid: boolean;
    message: string;
    errors: string[];
  }
  
  export function validateNegativePresent(sentence: string): ValidationResult {
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
      /^I am not [A-Za-z ]+\.$/,
      /^(He|She|It|This|That)( [A-Za-z]+)? is (isn't|not) [A-Za-z ]+\.$/,
      /^(We|You|They|These|Those) (are not|aren't) [A-Za-z ]+\.$/,
      /^[A-Z][a-z]+ (is not|isn't|aren't|are not) [A-Za-z ]+\.$/,
      /^The [a-z]+ (is not|isn't|are not|aren't) [A-Za-z ]+\.$/,
    ];
  
    const matchesPattern = patterns.some((pattern) => pattern.test(cleanSentence));
    if (!matchesPattern) {
      errors.push("Sentence structure should be: Subject + am/is/are + not + complement");
      isValid = false;
    }
  
    const hasAmNot = / am not /.test(cleanSentence);
    const hasIsNot = / is not /.test(cleanSentence);
    const hasAreNot = / (are not|aren't) /.test(cleanSentence);
  
    const verbCount = [hasAmNot, hasIsNot, hasAreNot].filter(Boolean).length;
    if (verbCount > 1) {
      errors.push("Use only one negative verb: 'am not', 'is not', or 'are not'");
      isValid = false;
    }

    if (hasAmNot && !/^I am not /.test(cleanSentence)) {
      errors.push("Only 'I' can use 'am not'");
      isValid = false;
    }
  
    if (hasIsNot) {
      if (/^(We|You|They|These|Those) is not /.test(cleanSentence)) {
        errors.push("'We', 'You', 'They' should use 'are not' or 'aren't', not 'is not'");
        isValid = false;
      }
      if (/^I is not /.test(cleanSentence)) {
        errors.push("'I' should use 'am not', not 'is not'");
        isValid = false;
      }
    }
  
    if (hasAreNot) {
      if (/^(I|He|She|It|This|That) (are not|aren't) /.test(cleanSentence)) {
        errors.push("'I', 'He', 'She', 'It' should use 'am not' or 'is not', not 'are not/aren't'");
        isValid = false;
      }
    }
  
    const theMatch = cleanSentence.match(/^The ([a-z]+) (is not|are not|aren't) /);
    if (theMatch) {
      const noun = theMatch[1];
      const verb = theMatch[2];
      const isPlural = /^[a-z]+s$/.test(noun);
  
      if (isPlural && (verb === "is not")) {
        errors.push(`'The ${noun}' is plural, so use 'are not' or 'aren't', not 'is not'`);
        isValid = false;
      }
      if (!isPlural && (verb === "are not" || verb === "aren't")) {
        errors.push(`'The ${noun}' is singular, so use 'is not', not 'are not' or 'aren't'`);
        isValid = false;
      }
    }
  
    let message = "";
    if (isValid) {
      message = "✅ Excellent! Your sentence is correct. It follows the pattern: Subject + am/is/are + not + complement";
    } else {
      message = "❌ Please correct the following errors:\n" + errors.map(e => `• ${e}`).join("\n");
    }
  
    return { isValid, message, errors };
  }