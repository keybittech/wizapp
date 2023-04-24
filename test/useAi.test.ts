import { IPrompts } from '../src/prompts';
import { setupCommonMocks, setupChatResponse, setupCompletionResponse, setupModerationResponse, openai, setupConfigTestBefore, setupConfigTestAfter } from './testHelpers';

setupChatResponse('&&&Some text@@@[{ "statement_0": "some code " }]@@@Some other text&&&');
setupCompletionResponse('test completion response');
setupModerationResponse(false);
setupCommonMocks();

jest.mock('fs', () => ({
  ...jest.requireActual('fs'),
  appendFileSync: jest.fn()
}));

import { useAi } from '../src/spells/use_ai_spell';
import { GuidedEditResponse } from '../src/prompts/guided_edit_prompt';

describe('useAi', () => {
  let tempConfigPath = '';

  beforeEach(() => {
    tempConfigPath = setupConfigTestBefore({ ai: { retries: '3' }, ts: { typeDir: '../../types', configPath: 'tsconfig.json' } });
    jest.clearAllMocks();
  });

  afterEach(() => {
    setupConfigTestAfter(tempConfigPath);
  });

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

  test('should throw an error when all parsing attempts fail', async () => {
    openai.createChatCompletion.mockImplementation(() => ({
      data: { choices: [{ message: { content: '&&&Some text@invalid json}@@@Some other text&&&' } }] },
    }));

    await expect(useAi<GuidedEditResponse>(IPrompts.GUIDED_EDIT, 'testfile.tsx', 'add comments throughout the file')).rejects.toThrowError();
  });
});
