import { isCreateApiBackendResult } from "../lib/prompts/create_api_backend_prompt";
import { isCreateApiResult } from "../lib/prompts/create_api_prompt";
import { isGeneralComponentResponse } from "../lib/prompts/create_gen_component_prompt";
import { isCreateTypeResponse } from "../lib/prompts/create_type_prompt";
import { isFileEditorResult } from "../lib/prompts/file_editor_prompt";
import { isGuidedEditResult } from "../lib/prompts/guided_edit_prompt";
import type { GuardValidations } from "../lib/types";
import { processTextWithCodeBlock } from "./util";

export function parseChatAttempt<T>(attempt: string): { supportingText: string, message: T } {
  const aiRefusalError = /(?:ai(?:\s|-)?language(?:\s|-)?model|i(?:'?m| am))(?:[^.]*?)(?:can(?:'?t| not)|unable to)(?:[^.]*?)(?:perform|do|create|provide)/i;
  if (aiRefusalError.test(attempt)) {
    throw new Error('AI Refusal');
  }

  const isAbstractWrap = attempt.includes('&&&') && attempt.includes('@@@');
  const isBacktickWrap = attempt.includes('```');

  if (isAbstractWrap || isBacktickWrap) {
    let innerBlockText = '';
    let supportingText = '';
    if (isBacktickWrap) { 
      const processedText = processTextWithCodeBlock(attempt);
      innerBlockText = processedText.codeBlock;
      supportingText = processedText.supportingText;
    } else {
      const outerBlockStart = attempt.indexOf('&&&') + 3;
      const outerBlockEnd = attempt.lastIndexOf('&&&');
      const pretextEnd = attempt.indexOf('@@@');
      const innerBlockStart = pretextEnd + 3;
      const innerBlockEnd = attempt.lastIndexOf('@@@');
      const postTextStart = innerBlockEnd + 3;
      innerBlockText = attempt.slice(innerBlockStart, innerBlockEnd);

      const pretext = attempt.slice(outerBlockStart, pretextEnd);
      const posttext = attempt.slice(postTextStart, outerBlockEnd);
      supportingText = pretext + '\n' + posttext;

      console.log({
        ABSTRACTMATCHFOUND: true,
        outerBlockStart,
        outerBlockEnd,
        pretextEnd,
        innerBlockStart,
        innerBlockEnd,
        postTextStart
      });
    }

    console.log({ supportingText, innerBlockText })

    if (!innerBlockText.length) {
      throw new Error('cannot parse Block structure is not valid.');
    }
  
    try {
      if (innerBlockText.startsWith('{') || innerBlockText.startsWith('[')) {
        JSON.parse(innerBlockText);
      }
    } catch (error) {
      const err = error as Error;
      throw new Error('cannot parse json.' + err.message)
    }
  
    const result = validateTypedResponse<T>(innerBlockText);
  
    return { message: result, supportingText };

  }

  const result = validateTypedResponse<T>(attempt);

  return { message: result, supportingText: '' };
}

export let responseValidators = [
  isFileEditorResult,
  isGuidedEditResult,
  isCreateTypeResponse,
  isCreateApiResult,
  isCreateApiBackendResult,
  isGeneralComponentResponse
];

export function injectResponseValidators(validators: ((obj: GuardValidations) => boolean)[]): void {
  responseValidators = responseValidators.concat(validators);
}

export function validateTypedResponse<T>(response: string): T {
  if (!response) {
    throw new Error('empty response');
  }

  try {
    let body: GuardValidations = response;

    try {
      body = JSON.parse(response);
    } catch (error) {}
    
    for (const tg of responseValidators) {
      if (body && tg(body)) {
        return body as T;
      }
      console.log('Guard function:', tg.name, 'Result:', tg(body));
    }
  } catch (error) { }

  throw new Error('bad chat format');
}