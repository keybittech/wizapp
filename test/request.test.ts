import { openai, setupChatResponse, setupCompletionResponse, setupModerationResponse, setupCommonMocks } from './testHelpers';

setupChatResponse('&&&Some text@@@[{ "statement_0": "some code " }]@@@Some other text&&&');
setupCompletionResponse('test completion response');
setupModerationResponse(false);
setupCommonMocks();

import { buildOpenAIRequest, performRequest, openAIRequestOptions, chatModel } from '../src/server/request';
import { CreateModerationRequest, CreateChatCompletionRequest, CreateCompletionRequest } from 'openai';
import { IPrompts } from '../src/lib/prompts';
import { isChatRequest } from '../src/server/util';

describe('buildOpenAIRequest', () => {
  test('should return moderation request when promptType is not provided', () => {
    const prompts = ['test'];
    const [result] = buildOpenAIRequest(prompts);
    const expected: CreateModerationRequest = {
      input: prompts[0],
    };
    expect(result).toEqual(expected);
  });

  test('should return chat request when promptType is provided and a chat request is expected', () => {
    const prompts = ['test'];
    const [result] = buildOpenAIRequest(prompts, IPrompts.CREATE_API);
    expect(isChatRequest(result)).toBeTruthy();
  });
});

describe('performRequest', () => {
  const chatRequest: CreateChatCompletionRequest = {
    model: chatModel,
    messages: [{ role: 'system', content: 'test' }],
  };
  const completionRequest: CreateCompletionRequest = {
    model: chatModel,
    prompt: 'test'
  };
  const moderationRequest: CreateModerationRequest = {
    input: 'test'
  };

  test('should call createChatCompletion for chat requests', async () => {
    await performRequest(chatRequest);
    expect(openai.createChatCompletion).toHaveBeenCalledWith(chatRequest, openAIRequestOptions);
  });

  test('should call createCompletion for completion requests', async () => {
    await performRequest(completionRequest);
    expect(openai.createCompletion).toHaveBeenCalledWith(completionRequest, openAIRequestOptions);
  });

  test('should call createModeration for moderation requests', async () => {
    await performRequest(moderationRequest);
    expect(openai.createModeration).toHaveBeenCalledWith(moderationRequest, openAIRequestOptions);
  });

  test('should return chat response for chat requests', async () => {
    const response = await performRequest(chatRequest);
    expect(response).toEqual('&&&Some text@@@[{ "statement_0": "some code " }]@@@Some other text&&&');
  });

  test('should return completion response for completion requests', async () => {
    const response = await performRequest(completionRequest);
    expect(response).toEqual('test completion response');
  });

  test('should return moderation response for moderation requests', async () => {
    const response = await performRequest(moderationRequest);
    expect(response).toEqual(false);
  });
});
