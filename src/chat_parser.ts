import { isGuidedEditResult } from "./prompts";

export function parseChatAttempt<T>(attempt: string): { supportingText: string, message: T } {

  const aiRefusalError = /(?:ai language model|i(?:'?m| am))(?:[^.]*?)(?:can(?:'?t| not)|unable to)(?:[^.]*?)(?:perform|do|create|provide)/i;
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
      throw new Error('cannot parse json.' + err.message, { cause: err })
    }
  
    const pretext = attempt.slice(outerBlockStart, pretextEnd);
    const posttext = attempt.slice(posttextStart, outerBlockEnd);
    const supportingText = pretext + '\n' + posttext;
  
    const result = validateTypedResponse<T>(innerBlockText)
  
    return { message: result, supportingText };

  } else {

    return { message: attempt as T, supportingText: 'Generic chat completion response.' };
  }

}

const responseTypeGuards = [isGuidedEditResult];

function validateTypedResponse<T>(response: string): T {
  try {
    const body = JSON.parse(response);
    for (const tg of responseTypeGuards) {
      if (tg(body)) {
        return body as T;
      }
    }
  } catch (error) { }

  throw 'invalid response body: ' + response;
}