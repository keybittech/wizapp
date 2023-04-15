import path from 'path';
import fs from 'fs';
import { toSnakeCase, toTitleCase } from '../src/util';
import {
  setupChatResponse,
  setupCommonMocks,
  openai,
  setupConfigTestBefore,
  setupConfigTestAfter,
} from './testHelpers';

setupChatResponse('test');
setupCommonMocks();

import { createApi } from '../src/spells';
import { IPrompts } from '../src/prompts';
import { buildOpenAIRequest, openAIRequestOptions } from '../src/request';

jest.mock('fs', () => ({
  ...jest.requireActual('fs'),
  appendFileSync: jest.fn(),
}));

describe('createApi', () => {

  beforeEach(() => {
    setupConfigTestBefore({ ai: { retries: '3' }, ts: { typeDir: 'types', configPath: 'tsconfig.json' } });
  });

  afterEach(() => {
    setupConfigTestAfter();
  });

  test('should work by passing normal parameters for chat completion', async () => {
    const response = await createApi('ITestTypeName', 'userName');
    expect(openai.createChatCompletion).toHaveBeenCalled();
    expect(response).toBe('test');
  });

  test('should throw error when ts.typeDir is not set', async () => {
    setupConfigTestBefore({ ai: { retries: '3' }, ts: { configPath: 'tsconfig.json' } });
    await expect(createApi('ITestTypeName', 'userName')).rejects.toThrow('Missing ts.typeDir.');
  });

  test('should call useAi with the correct prompt', async () => {
    const typeName = 'ITestTypeName';
    const generatedType = 'userName';
    const [builtRequest] = buildOpenAIRequest([generatedType], IPrompts.CREATE_API);
    await createApi(typeName, generatedType);
    expect(openai.createChatCompletion).toHaveBeenCalledWith(builtRequest, openAIRequestOptions);
  });

  test('should append the generated API to the correct file', async () => {
    setupConfigTestBefore({ ai: { retries: '3' }, ts: { typeDir: 'types' } });
    const typeName = 'ITestTypeName';
    const generatedType = 'userName';
    const coreTypesPath = path.join(__dirname, '../src/spells/types', `${toSnakeCase(typeName)}.ts`);
    const comment = `/*\n* @category ${toTitleCase(typeName)}\n*/\n`;
    const generatedApi = 'test';
    await createApi(typeName, generatedType);
    expect(fs.appendFileSync).toHaveBeenCalledWith(coreTypesPath, `${comment}${generatedApi}\n\n`);
  });

});
