import { isCreateApiResult, isGuidedEditResult } from "./prompts";
import { GuardValidations } from "./types";

export function parseChatAttempt<T>(attempt: string): { supportingText: string, message: T } {
  const aiRefusalError = /(?:ai(?:\s|-)?language(?:\s|-)?model|i(?:'?m| am))(?:[^.]*?)(?:can(?:'?t| not)|unable to)(?:[^.]*?)(?:perform|do|create|provide)/i;
  if (aiRefusalError.test(attempt)) {
    throw new Error('AI Refusal');
  }

  if (attempt.indexOf('&&&') > -1 && attempt.indexOf('@@@') > -1) {

    const outerBlockStart = attempt.indexOf('&&&') + 3;
    const outerBlockEnd = attempt.lastIndexOf('&&&');
    const pretextEnd = attempt.indexOf('@@@');
    const innerBlockStart = pretextEnd + 3;
    const innerBlockEnd = attempt.lastIndexOf('@@@');
    const posttextStart = innerBlockEnd + 3;
    const innerBlockText = attempt.slice(innerBlockStart, innerBlockEnd);
  
    if (!innerBlockText.length) {
      throw new Error('Block structure is not valid.');
    }
  
    try {
      JSON.parse(innerBlockText)
    } catch (error) {
      const err = error as Error;
      throw new Error('cannot parse json.' + err.message)
    }
  
    const pretext = attempt.slice(outerBlockStart, pretextEnd);
    const posttext = attempt.slice(posttextStart, outerBlockEnd);
    const supportingText = pretext + '\n' + posttext;
  
    const result = validateTypedResponse<T>(innerBlockText)
  
    return { message: result, supportingText };

  }

  const result = validateTypedResponse<T>(attempt);

  return { message: result, supportingText: '' };
}

const responseTypeGuards = [
  isGuidedEditResult,
  isCreateApiResult
];

function validateTypedResponse<T>(response: string): T {
  if (!response) {
    throw new Error('empty response');
  }

  try {
    let body: GuardValidations = response;

    try {
      body = JSON.parse(response);
    } catch (error) {}
    
    for (const tg of responseTypeGuards) {
      if (body && tg(body)) {
        return body as T;
      }
    }
  } catch (error) { }

  throw new Error('bad chat format');
}