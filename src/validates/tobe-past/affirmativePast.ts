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

  if  (!/\.$/.test(cleanSentence)) {
    errors.push("Sentence should end with a period (.)");
    isValid = false;
  }


  if (!/^[A-Z]/.test(cleanSentence)) {
    errors.push("Sentences should begin with a capital letter.");
    isValid = false;
  }

  // Patrones para oraciones afirmativas en pasado
  const patterns = [
    // I was + complement
    /^I\s+was\s+[^.!?]+\.$/i,
    
    // He/She/It was + complement
    /^(He|She|It)\s+was\s+[^.!?]+\.$/i,
    
    // We/You/They were + complement
    /^(We|You|They)\s+were\s+[^.!?]+\.$/i,
    
    // Nombres propios + was/were + complement
    /^[A-Z][a-z]+\s+(was|were)\s+[^.!?]+\.$/,
    
    // The + sustantivo + was/were + complement
    /^The\s+[a-z]+\s+(was|were)\s+[^.!?]+\.$/i,
    
    // A/An + sustantivo + was/were + complement
    /^[Aa]n?\s+[a-z]+\s+(was|were)\s+[^.!?]+\.$/i
  ];

  // Verificar si coincide con algún patrón
  const matchesPattern = patterns.some(pattern => pattern.test(cleanSentence));
  
  if (!matchesPattern) {
    errors.push("Sentence structure should be: Subject + was/were + complement");
    isValid = false;
  }

  // Verificar que use was/were (pasado)
  if (!/\b(was|were)\b/i.test(cleanSentence)) {
    errors.push("Use 'was' or 'were' for past tense (not 'am', 'is', 'are')");
    isValid = false;
  }

  // Verificar concordancia
  const hasWas = /\bwas\b/i.test(cleanSentence);
  const hasWere = /\bwere\b/i.test(cleanSentence);
  
  if (hasWas && hasWere) {
    errors.push("Use either 'was' or 'were', not both");
    isValid = false;
  }

  if (hasWas) {
    // was debe usarse con I, he, she, it, nombres singulares
    const subject = cleanSentence.match(/^([A-Z][a-z]+)/)?.[1] || '';
    if (['We', 'You', 'They'].includes(subject)) {
      errors.push("'We', 'You', 'They' should use 'were', not 'was'");
      isValid = false;
    }
  }

  if (hasWere) {
    // were debe usarse con we, you, they, nombres plurales
    const subject = cleanSentence.match(/^([A-Z][a-z]+)/)?.[1] || '';
    if (['I', 'He', 'She', 'It'].includes(subject)) {
      errors.push("'I', 'He', 'She', 'It' should use 'was', not 'were'");
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
