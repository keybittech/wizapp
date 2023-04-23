import { ChatCompletionRequestMessage } from "openai";
import { generateExample, getSuggestionPrompt } from "../util.js";

export const suggestRolePrompt = `${getSuggestionPrompt('role names for a group named ${prompt1} which is interested in ${prompt2}')}
${generateExample('role names for a group named writing center which is interested in consulting on writing', 'Tutor|Student|Advisor|Administrator|Consultant')}
${generateExample('role names for a group named city maintenance department which is interested in maintaining the facilities in the city', 'Dispatcher|Engineer|Administrator|Technician|Manager')}`;

export const suggestRoleMessages: ChatCompletionRequestMessage[] = [
  { role: 'system', content: 'I, DelimitedOptions, will provide 5 options delimited by |.' },
  { role: 'assistant', content: `Simply provide your desired prompt, and I\'ll fill in the result!
  Here are some examples: ${suggestRolePrompt}
  Provide the following text "Prompt: <some prompt> Result:" and I will complete the result.` },
  { role: 'user', content: generateExample('role names for a group named "${prompt1}" which is interested in ${prompt2}') }
];