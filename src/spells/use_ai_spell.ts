import { ChatResponse, CompletionResponse, isCompletionRequest, ModerationResponse, OpenAIResults, UseAIResponses } from '../types';
import { parseChatAttempt } from '../chat_parser';
import { IPrompts } from '../prompts';
import { buildOpenAIRequest, performRequest } from '../request';
import { logAiResult } from '../stats';
import { getConfig } from '../config';

export async function useAi<T = undefined>(promptType: IPrompts, ...prompts: string[]): Promise<UseAIResponses<T>> {
  
  const config = getConfig();
  const retries = parseInt(config.ai.retries, 10);
  
  let failures: string[] = [];

  const [builtRequest, promptTemplate] = buildOpenAIRequest(prompts, promptType);

  const aiResponse: OpenAIResults = {
    timestamp: new Date(),
    successful: true,
    failures,
    promptTemplate,
    promptType,
  }
  
  try {

    const responseTry = await performRequest(builtRequest);

    if ('undefined' === typeof responseTry) {
      const noChoices = 'Open AI returned no choices.'
      failures.push(noChoices);
      throw new Error(noChoices);
    }

    if ('boolean' === typeof responseTry) {
      const moderationResponse: ModerationResponse = { ...aiResponse, flagged: responseTry };
      logAiResult<T>({ ...moderationResponse, prompts, model: builtRequest.model });
      return moderationResponse as UseAIResponses<T>;
    }

    if (isCompletionRequest(builtRequest)) {
      const completionResponse: CompletionResponse = {
        ...aiResponse,
        message: responseTry
      };
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
        return chatResponse;
      } catch (error) {
        const err = error as Error;
        failures.push(err.message + ' FAILED ATTEMPT:' + attempt);

        if (failures.length < retries && err.message.startsWith('cannot parse')) {

          console.log('REPEATING ATTEMPT WITH REQUEST: ', JSON.stringify(builtRequest, null, 2))

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
    throw 'General use AI failure: ' + err.message + err.stack + '\n' + JSON.stringify(aiResponse, null, 2);
  }
}
