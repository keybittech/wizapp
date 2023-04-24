import fs from 'fs';
import { getPathOf, sanitizeName, toSnakeCase, toTitleCase } from '../src/server/util';
import {
  setupChatResponse,
  setupCommonMocks,
  setupConfigTestBefore,
  setupConfigTestAfter,
  mockGetConfig,
  withTempConfig,
  withOriginalGetConfig,
} from './testHelpers';
import * as useAiModule from '../src/server/spells/use_ai_spell';

setupChatResponse('const testTypeApi = { ...');
setupCommonMocks();

import { createApi } from '../src/server/spells';
import { getConfig } from '../src/server/config';

jest.mock('fs', () => ({
  ...jest.requireActual('fs'),
  appendFileSync: jest.fn(),
}));

jest.mock('../src/server/spells/use_ai_spell', () => ({
  useAi: jest.fn(),
}));

const useAiMock = useAiModule.useAi as jest.Mock;

describe('createApi', () => {
  let tempConfigPath = '';

  beforeEach(() => {
    tempConfigPath = setupConfigTestBefore({ ai: { retries : '3' }, ts: { typeDir: 'types', configPath: 'tsconfig.json' } });
    mockGetConfig(tempConfigPath);
    useAiMock.mockClear();
  });

  afterEach(() => {
    setupConfigTestAfter(tempConfigPath);
  });

  test('should work by passing normal parameters for chat completion', async () => {
    useAiMock.mockResolvedValue({ message: 'const testTypeApi = { ...' });
    const response = await createApi('ITestTypeName', 'userName');
    expect(useAiMock).toHaveBeenCalled();
    expect(response).toBe('const testTypeApi = { ...');
  });

  test('should throw error when ts.typeDir is not set', async () => {
    await withTempConfig({ ai: { retries: '3' }, ts: { configPath: 'tsconfig.json' } }, async () => {
      await expect(createApi('ITestTypeName', 'userName')).rejects.toThrow('Missing ts.typeDir.');
    });
  });

  test('should append the generated API to the correct file', async () => {
    await withOriginalGetConfig(async () => {
      await withTempConfig({ ai: { retries: '3' }, ts: { typeDir: 'types' } }, async () => {
        const config = getConfig();
        const typeName = 'ITestTypeName';
        const generatedType = 'type ITestTypeName = {';
        const coreTypesPath = sanitizeName(config.ts.typeDir);
        const typeFilePath = getPathOf(`${coreTypesPath}/${toSnakeCase(typeName)}.ts`);
        const comment = `/*\n* @category ${toTitleCase(typeName)}\n*/\n`;
        const generatedApi = 'const testTypeApi = { ...';
        await createApi(typeName, generatedType);
        expect(fs.appendFileSync).toHaveBeenCalledWith(typeFilePath, `${comment}${generatedApi}\n\n`);
      });
    });
  });

});
