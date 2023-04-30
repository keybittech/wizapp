import { ChatCompletionRequestMessage } from "openai";
import type { GuardValidations } from "../types";

export const convertPurposeMessages: ChatCompletionRequestMessage[] = [
  { role: 'system', content: 'You respond with a single gerund phrase, 5 to 8 words, which will complete the user\'s sentence. For example, "walking in the sunshine with you".' },
  { role: 'assistant', content: 'Give me an incomplete sentence that I can complete with a gerund phrase. For example, if you said "Our favorite past time is", I might respond "walking in the sunshine with you"' },
  { role: 'user', content: 'An organization named "${prompt1}" is interested in "${prompt2}" and their mission statement is' }
];

export type ConvertPurposeResult = string;

const convertPurposeRegex = /\b[a-z]*ing\b/i;

export function isConvertPurposeResult(obj: GuardValidations): obj is ConvertPurposeResult {
  return 'string' === typeof obj && convertPurposeRegex.test(obj);
}