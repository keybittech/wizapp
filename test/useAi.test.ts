import { GuidedEditResponse, IPrompts } from '../src/prompts';
import { setupCommonMocks, setupChatResponse, setupCompletionResponse, setupModerationResponse, setupOpenAiMocks } from './testHelpers';

setupChatResponse('&&&Some text@@@[{ "statement_0": "some code " }]@@@Some other text&&&');
setupCompletionResponse('test completion response');
setupModerationResponse(false);
setupCommonMocks();

import { useAi } from '../src/spells/use_ai_spell';

describe('useAi', () => {

  test('should return a chat response when promptType is a chat prompt', async () => {
    
    const response = await useAi<GuidedEditResponse>(IPrompts.GUIDED_EDIT, 'Profile.tsx make the profile picture round instead of square.');
    expect(response.message).toStrictEqual([{ "statement_0": "some code "}]);
  });

  test('should return a completion response when promptType is a completion prompt', async () => {
    const response = await useAi<string>(IPrompts.SUGGEST_SERVICE, 'the downtown learning center at the U library');
    expect(response.message).toBe('test completion response');
  });

  test('should return a moderation response when promptType is not provided', async () => {
    const response = await useAi<boolean>(undefined, 'test');
    expect(response.flagged).toBe(false);
  });

  test('should throw an error when all attempts fail', async () => {
    const failingChatResponse = '&&&Some text@invalid json}@@@Some other text&&&';
    setupChatResponse(failingChatResponse);
    setupOpenAiMocks();
    await expect(useAi<GuidedEditResponse>(IPrompts.GUIDED_EDIT, 'testfile.tsx', 'add comments throughout the file')).rejects.toThrowError();
  });

});
