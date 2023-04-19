import fs from 'fs';
import * as useAiModule from '../src/spells/use_ai_spell';
import { getConfig } from '../src/config';
import { getPathOf, sanitizeName, toSnakeCase, toTitleCase } from '../src/util';
import { setupConfigTestBefore, setupConfigTestAfter, withTempConfig, withOriginalGetConfig } from './testHelpers';

jest.mock('fs', () => ({
  ...jest.requireActual('fs'),
  writeFileSync: jest.fn(),
  existsSync: jest.fn(),
  mkdirSync: jest.fn()
}));

// Mock the useAi function
jest.mock('../src/spells/use_ai_spell', () => ({
  useAi: jest.fn(),
}));

const useAiMock = useAiModule.useAi as jest.Mock;

import { createType } from '../src/spells';

describe('createType', () => {
  let tempConfigPath = '';

  beforeEach(() => {
    tempConfigPath = setupConfigTestBefore({ ts: { typeDir: 'types', configPath: 'tsconfig.json' } });
    jest.clearAllMocks();
  });

  afterEach(() => {
    setupConfigTestAfter(tempConfigPath);
  });

  test('should throw error when ts.typeDir is not set', async () => {
    await withTempConfig({ ts: { typeDir: '' } }, async () => {
      await expect(createType('ISomeTypeName')).rejects.toThrow('Missing ts.typeDir.');
    });
  });

  test('should throw error if typeName does not follow the required format', async () => {
    await expect(createType('invalidTypeName')).rejects.toThrowError();
  });

  test('should generate the type correctly and append it to the file', async () => {
    await withOriginalGetConfig(async () => {
      const typeName = 'ITestType';
      const generatedType = 'Test Type';
      const config = getConfig();
      useAiMock.mockResolvedValue({ message: generatedType });

      const coreTypesPath = sanitizeName(config.ts.typeDir);
      const typeFilePath = getPathOf(`${coreTypesPath}/${toSnakeCase(typeName)}.ts`);
      const comment = `/*\n* @category ${toTitleCase(typeName)}\n*/\n`;
  
      (fs.existsSync as jest.Mock).mockReturnValue(false);
  
      await createType(typeName);
  
      // Check if the directory was created
      expect(fs.existsSync).toHaveBeenCalledWith(coreTypesPath);
      expect(fs.mkdirSync).toHaveBeenCalledWith(coreTypesPath, { recursive: true });
  
      // Check if the file was written correctly
      expect(fs.writeFileSync).toHaveBeenCalledWith(typeFilePath, `${comment}${generatedType}\n\n`);
    });
  });
});
