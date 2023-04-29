import { parseChatAttempt } from '../parser';
import { IPrompts } from '../../lib/prompts';
import { buildOpenAIRequest, performRequest } from '../request';
import { logAiResult } from '../stats';
import { getConfig } from '../config';
import type { ChatResponse, CompletionResponse, ModerationResponse, OpenAIResults, UseAIResponses } from '../../lib/types';
import { isCompletionRequest } from '../util';

export async function useAi<T = undefined>(promptType?: IPrompts, ...prompts: string[]): Promise<UseAIResponses<T>> {
  
  const config = getConfig();
  const retries = parseInt(config.ai.retries, 10);

  const [builtRequest, promptTemplate] = buildOpenAIRequest(prompts, promptType);

  const aiResponse: OpenAIResults = {
    timestamp: new Date(),
    successful: true,
    failures: [],
    rawResponses: [],
    promptTemplate,
    promptType: (!promptType ? 'moderation' : promptType) as IPrompts
  }

  const responseTry = await performRequest(builtRequest);

  aiResponse.rawResponses.push(responseTry);

  try {

    if ('undefined' === typeof responseTry) {
      const noChoices = 'Open AI returned no choices.'
      aiResponse.failures.push(noChoices);
      throw new Error(noChoices);
    }

    if ('boolean' === typeof responseTry) {
      const moderationResponse: ModerationResponse = { ...aiResponse, flagged: responseTry };
      console.log('MODERATION RESPONSE :==: ', moderationResponse)
      logAiResult<T>({ ...moderationResponse, prompts, model: builtRequest.model });
      return moderationResponse as UseAIResponses<T>;
    }

    if (isCompletionRequest(builtRequest)) {
      const completionResponse: CompletionResponse = {
        ...aiResponse,
        message: responseTry
      };
      console.log('COMPLETION RESPONSE :==: ', completionResponse)
      logAiResult<T>({ ...completionResponse, prompts, model: builtRequest.model });
      return completionResponse as UseAIResponses<T>;
    }

    async function resolveAttempt(attempt: string, retriesRemaining: number): Promise<ChatResponse<T>> {
      try {
        const { supportingText, message } = parseChatAttempt<T>(attempt);

        const chatResponse = {
          ...aiResponse,
          supportingText,
          message
        };
        logAiResult<T>({ ...chatResponse, prompts, model: builtRequest.model });
        console.log('CHAT RESPONSE :==: ', chatResponse)
        return chatResponse;
      } catch (error) {
        const err = error as Error;
        if (retriesRemaining > 0 && err.message.startsWith('cannot parse')) {
          const repeatedAttempt = await performRequest(builtRequest);

          aiResponse.rawResponses.push(repeatedAttempt);

          if ('string' !== typeof repeatedAttempt) {
            const imparsable = 'Received imparsable resolution during retry.';
            aiResponse.failures.push(imparsable);
            throw new Error(imparsable);
          }

          return await resolveAttempt(repeatedAttempt, retriesRemaining - 1);
        }

        const resolveIssue = 'Critical chat parse error or could not resolve a valid response after ' + retries + ' attempts. ' + (err.message ? 'Parsing error: ' + err.message : '');
        aiResponse.failures.push(resolveIssue);
        throw new Error(resolveIssue);
      }
    }

    return await resolveAttempt(responseTry, retries) as UseAIResponses<T>;
  } catch (error) {
    const err = error as Error;
    aiResponse.successful = false;
    logAiResult({ ...aiResponse, prompts, message: undefined, model: builtRequest.model });
    throw new Error('General use AI failure!\nStack: ' + err.stack);
  }
}
