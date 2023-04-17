import { GuidedEditResponse } from '../src/prompts';
import { setupChatResponse, setupCommonMocks } from './testHelpers';
setupChatResponse('')
setupCommonMocks();

import { parseChatAttempt } from '../src/chat_parser';

describe('parseChatAttempt', () => {

  test('should throw AI Refusal error', () => {
    const attempt = "I'm an AI language model and I can't perform this task.";
    expect(() => parseChatAttempt(attempt)).toThrowError('AI Refusal');
  });

  test('should return throw on non typed chat completion response', () => {
    const attempt = "This is a normal response.";
    expect(() => parseChatAttempt(attempt)).toThrowError();
  });

  test('should throw Block structure is not valid error', () => {
    const attempt = "&&&Some text@@@&&&";
    expect(() => parseChatAttempt(attempt)).toThrowError('Block structure is not valid.');
  });

  test('should throw cannot parse json error', () => {
    const attempt = "&&&Some text@@@{invalid json}@@@Some other text&&&";
    expect(() => parseChatAttempt(attempt)).toThrowError(/cannot parse json./);
  });

  test('should return parsed json and supporting text when using a type', () => {
    const attempt = '&&&In this edit, we fixed...@@@[{"statement_7": "some changes"}]@@@Some other information about these changes&&&';
    const expectedResult = {
      message: [{ "statement_7": "some changes" }],
      supportingText: "In this edit, we fixed...\nSome other information about these changes"
    };
    expect(parseChatAttempt<GuidedEditResponse>(attempt)).toEqual(expectedResult);
  });
  
  test('should throw bad chat format error', () => {
    const attempt = '&&&Some text@@@{"unknown": "value"}@@@Some other text&&&';
    expect(() => parseChatAttempt(attempt)).toThrowError('bad chat format');
  });

});