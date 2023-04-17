import { ChatResponse, CompletionResponse, isCompletionRequest, ModerationResponse, OpenAIResults, UseAIResponses } from '../types';
import { parseChatAttempt } from '../chat_parser';
import { IPrompts } from '../prompts';
import { buildOpenAIRequest, performRequest } from '../request';
import { logAiResult } from '../stats';
import { getConfig } from '../config';

export async function useAi<T = undefined>(promptType?: IPrompts, ...prompts: string[]): Promise<UseAIResponses<T>> {
  
  const config = getConfig();
  const retries = parseInt(config.ai.retries, 10);
  
  let failures: string[] = [];

  const [builtRequest, promptTemplate] = buildOpenAIRequest(prompts, promptType);

  console.log({
    OUTGOING_REQUEST: builtRequest
  });

  const aiResponse: OpenAIResults = {
    timestamp: new Date(),
    successful: true,
    failures,
    promptTemplate,
    promptType: (!promptType ? 'moderation' : promptType) as IPrompts
  }

  const responseTry = await performRequest(builtRequest);

  try {

    if ('undefined' === typeof responseTry) {
      const noChoices = 'Open AI returned no choices.'
      failures.push(noChoices);
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

    async function resolveAttempt(attempt: string): Promise<ChatResponse<T>> {
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
        if (failures.length < retries && err.message.startsWith('cannot parse')) {
          const repeatedAttempt = await performRequest(builtRequest);

          if ('string' !== typeof repeatedAttempt) {
            const imparsable = 'Received imparsable resolution during retry.';
            failures.push(imparsable);
            throw new Error(imparsable);
          }

          return await resolveAttempt(repeatedAttempt);
        }

        const resolveIssue = 'Critical chat parse error or could not resolve a valid response after ' + retries + ' attempts. ' + (err.message ? 'Parsing error: ' + err.message : '');
        failures.push(resolveIssue);
        throw new Error(resolveIssue);
      }
    }

    return await resolveAttempt(responseTry) as UseAIResponses<T>;
  } catch (error) {
    const err = error as Error;
    aiResponse.successful = false;
    logAiResult({ ...aiResponse, prompts, message: undefined, model: builtRequest.model });
    throw new Error('General use AI failure!\nStack: ' + err.stack);
  }
}
