import fs from 'fs';
import { getPathOf, sanitizeName, toSnakeCase, toTitleCase } from '../src/util';
import {
  setupChatResponse,
  setupCommonMocks,
  openai,
  setupConfigTestBefore,
  setupConfigTestAfter,
  mockGetConfig,
  withTempConfig,
  withOriginalGetConfig,
} from './testHelpers';

setupChatResponse('const testTypeApi = { ...');
setupCommonMocks();

import { createApi } from '../src/spells';
import { IPrompts } from '../src/prompts';
import { buildOpenAIRequest, openAIRequestOptions } from '../src/request';
import { getConfig } from '../src/config';

jest.mock('fs', () => ({
  ...jest.requireActual('fs'),
  appendFileSync: jest.fn(),
}));

describe('createApi', () => {
  let tempConfigPath = '';

  beforeEach(() => {
    tempConfigPath = setupConfigTestBefore({ ai: { retries : '3' }, ts: { typeDir: 'types', configPath: 'tsconfig.json' } });
    mockGetConfig(tempConfigPath);
  });

  afterEach(() => {
    setupConfigTestAfter(tempConfigPath);
  });

  test('should work by passing normal parameters for chat completion', async () => {
    const response = await createApi('ITestTypeName', 'userName');
    expect(openai.createChatCompletion).toHaveBeenCalled();
    expect(response).toBe('const testTypeApi = { ...');
  });

  test('should throw error when ts.typeDir is not set', async () => {
    await withTempConfig({ ai: { retries: '3' }, ts: { configPath: 'tsconfig.json' } }, async () => {
      await expect(createApi('ITestTypeName', 'userName')).rejects.toThrow('Missing ts.typeDir.');
    });
  });

  test('should call useAi with the correct prompt', async () => {
    const typeName = 'ITestTypeName';
    const generatedType = 'userName';
    const [builtRequest] = buildOpenAIRequest([generatedType], IPrompts.CREATE_API);
    await createApi(typeName, generatedType);
    expect(openai.createChatCompletion).toHaveBeenCalledWith(builtRequest, openAIRequestOptions);
  });

  test('should append the generated API to the correct file', async () => {
    await withOriginalGetConfig(async () => {
      await withTempConfig({ ai: { retries: '3' }, ts: { typeDir: 'types' } }, async () => {
        const config = getConfig();
        const typeName = 'ITestTypeName';
        const generatedType = 'userName';
        const coreTypesPath = sanitizeName(config.ts.typeDir);
        const typeFilePath = getPathOf(`../../${coreTypesPath}/${toSnakeCase(typeName)}.ts`);
        const comment = `/*\n* @category ${toTitleCase(typeName)}\n*/\n`;
        const generatedApi = 'const testTypeApi = { ...';
        await createApi(typeName, generatedType);
        expect(fs.appendFileSync).toHaveBeenCalledWith(typeFilePath, `${comment}${generatedApi}\n\n`);
      });
    });
  });

});
