import { validateAffirmativePast } from "@/validates/tobe-past/affirmativePast";
import { validateInterrogativePast } from "@/validates/tobe-past/interrogativePast";
import { ExtractName } from "@/validates/validatedName";
import { Params } from "react-chatbotify";

const OptionsYesOrNot = ["✔️ Yes", "❌ Not"];
const Options = ["📅 Past", "🕐 Present"];
const OptionsForms = ["✅ Affirmative", "⛔ Negative", "❔ Interrogative"];

//  Función genérica con tense + type
function generateRetryForSentence(
  tense: "past" | "present",
  type: "affirmative" | "interrogative" | "negative"
) {
  return {
    message: "Do you want to try again?",
    options: OptionsYesOrNot,
    chatDisabled: true,
    path: (params: Params) => {
      if (params.userInput.includes("Yes")) {
        return `validate_${tense}_${type}`;
      } else {
        return "end";
      }
    },
  };
}

export const flow = {
  start: {
    message: "👋 Hello! My name is BMO BOT, What's your name?",
    path: "get_name"
  },

  get_name: {
    message: (params: Params) => {
      const name = ExtractName(params.userInput);
      return `Hi ${name}! Nice to meet you!`;
    },
    transition: { duration: 1000 },
    path: "questions",
  },

  questions: {
    message: "I am responsible for validating sentences that use the verb “to be”. Would you like me to help you validate a sentence?",
    options: OptionsYesOrNot,
    chatDisabled: true,
    path: (params: Params) => {
      if (params.userInput.includes('Yes')) {
        return "options_yes";
      } else {
        return "end";
      }
    },
  },

  questions_2: {
    message: "Would you like to validate another sentence?",
    options: OptionsYesOrNot,
    chatDisabled: true,
    path: (params: Params) => {
      if (params.userInput.includes('Yes')) {
        return "options_yes";
      } else {
        return "end";
      }
    },
  },

  // Preguntas de reintento (Past)
  questions_3_affirmative: generateRetryForSentence("past", "affirmative"),
  questions_3_interrogative: generateRetryForSentence("past", "interrogative"),
  questions_3_negative: generateRetryForSentence("past", "negative"),

  //  Preguntas de reintento (Present)
  questions_3_present_affirmative: generateRetryForSentence("present", "affirmative"),
  questions_3_present_interrogative: generateRetryForSentence("present", "interrogative"),
  questions_3_present_negative: generateRetryForSentence("present", "negative"),

  options_yes: {
    transition: { duration: 100 },
    path: "tense_options"
  },

  options_Not: {
    path: "end"
  },

  tense_options: {
    message: "Which tense would you like to use to validate the sentences?",
    options: Options,
    chatDisabled: true,
    path: (params: Params) => {
      if (params.userInput.includes('Past')) {
        return "to_be_past";
      } else {
        return "to_be_present";
      }
    },
  },

  to_be_present: {
    message: "Great! You selected Present tense. Now choose the type of sentence you want to validate:",
    options: OptionsForms,
    chatDisabled: true,
    path: (params: Params) => {
      if (params.userInput.includes('Affirmative')) {
        return "validate_present_affirmative";
      } else if (params.userInput.includes('Negative')) {
        return "validate_present_negative";
      } else if (params.userInput.includes('Interrogative')) {
        return "validate_present_interrogative";
      } else {
        return "to_be_present";
      }
    }
  },

  to_be_past: {
    message: "Great! You selected Past tense. Now choose the type of sentence you want to validate:",
    options: OptionsForms,
    chatDisabled: true,
    path: (params: Params) => {
      if (params.userInput.includes('Affirmative')) {
        return "validate_past_affirmative";
      } else if (params.userInput.includes('Negative')) {
        return "validate_past_negative";
      } else if (params.userInput.includes('Interrogative')) {
        return "validate_past_interrogative";
      } else {
        return "to_be_past";
      }
    }
  },

  // Validadores para Presente
  validate_present_affirmative: {
    message: "present affirmative.",
    chatDisabled: false
  },

  validate_present_negative: {
    message: "present negative",
    chatDisabled: false
  },

  validate_present_interrogative: {
    message: "present interrogative",
    chatDisabled: false
  },

  // Validadores para Pasado
  validate_past_affirmative: {
    message: "Perfect! Now write an affirmative sentence using 'to be' in past tense. For example: 'I was happy' or 'She was a teacher'.",
    chatDisabled: false,
    function: async (params: Params) => {
      const result = validateAffirmativePast(params.userInput);
      if (params.injectMessage) {
        await params.injectMessage(result.message);
      }
    },
    path: (params: Params) => {
      const result = validateAffirmativePast(params.userInput);
      if (result.isValid) {
        return "questions_2";
      } else {
        return "questions_3_affirmative";
      }
    },
  },

  validate_past_negative: {
    message:
      "Perfect! Now write a negative sentence using 'to be' in past tense. For example: 'I was not happy' or 'She was not a teacher'.",
    chatDisabled: false,
    path: () => "questions_3_negative"
  },

  validate_past_interrogative: {
    message:
      "Perfect! Now write an interrogative sentence using 'to be' in past tense. For example: 'Were you happy?' or 'Was she a teacher?'.",
    chatDisabled: false,
    function: async (params: Params) => {
      const result = validateInterrogativePast(params.userInput);
      if (params.injectMessage) {
        await params.injectMessage(result.message);
      }
    },
    path: (params: Params) => {
      const result = validateInterrogativePast(params.userInput);
      if (result.isValid) {
        return "questions_2";
      } else {
        return "questions_3_interrogative";
      }
    },
  },

  end: {
    message: "bye",
    chatDisabled: true,
    transition: { duration: 1000 },
    path:"questions_2",
  }
}
