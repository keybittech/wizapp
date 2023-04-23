import { GuidedEditResponse } from '../src/prompts/guided_edit_prompt';
import { setupChatResponse, setupCommonMocks } from './testHelpers';
setupChatResponse('');
setupCommonMocks();

import { parseChatAttempt } from '../src/chat_parser';

describe('parseChatAttempt', () => {

  test('should handle forgotten markdown footer', async () => {
    const badRes = 'Edits conveyed by comment snippets. I edited lines 61, 63, 65, 68, 70, 73, 75, which is 7 total edited lines. Here are the 7 edited lines:\n' +
    '```' +
    '61. /* wizapp removed line content */ {empty space}\n' +
    '63. /* wizapp removed line content */ {empty space}\n' +
    '65.   return chatResponse.data.choices[0]?.message?.content.trim(); /* wizapp removed console log */\n' +
    '68. /* wizapp removed line content */ {empty space}\n' +
    '70.   return completionResponse.data.choices[0].text?.trim(); /* wizapp removed console log */\n' +
    '73. /* wizapp removed line content */ {empty space}\n' +
    '75.   return moderationResponse.data.results[0]?.flagged; /* wizapp removed console log */';
    const expectedResult = {
      message: '61. /* wizapp removed line content */ {empty space}\n' +
      '63. /* wizapp removed line content */ {empty space}\n' +
      '65.   return chatResponse.data.choices[0]?.message?.content.trim(); /* wizapp removed console log */\n' +
      '68. /* wizapp removed line content */ {empty space}\n' +
      '70.   return completionResponse.data.choices[0].text?.trim(); /* wizapp removed console log */\n' +
      '73. /* wizapp removed line content */ {empty space}\n' +
      '75.   return moderationResponse.data.results[0]?.flagged; /* wizapp removed console log */',
      supportingText: "Edits conveyed by comment snippets. I edited lines 61, 63, 65, 68, 70, 73, 75, which is 7 total edited lines. Here are the 7 edited lines:\n``` "
    };
    const result = parseChatAttempt(badRes);
    expect(result).toEqual(expectedResult);
  });

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