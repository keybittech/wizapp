import fs from 'fs';
import path from 'path';
import * as useAiModule from '../src/spells/use_ai_spell';
import { getConfig } from '../src/config';
import { toSnakeCase, toTitleCase } from '../src/util';
import { setupConfigTestBefore, setupConfigTestAfter } from './testHelpers';

jest.mock('fs', () => ({
  ...jest.requireActual('fs'),
  appendFileSync: jest.fn(),
}));

// Mock the useAi function
jest.mock('../src/spells/use_ai_spell', () => ({
  useAi: jest.fn(),
}));

const useAiMock = useAiModule.useAi as jest.Mock;

import { createType } from '../src/spells';

describe('createType', () => {

  beforeEach(() => {
    setupConfigTestBefore({ ts: { typeDir: 'types', configPath: 'tsconfig.json' } });
    jest.clearAllMocks();
  });

  afterEach(() => {
    setupConfigTestAfter();
  });

  test('should throw error when ts.typeDir is not set', async () => {
    setupConfigTestBefore({ ts: { typeDir: '' } });
    await expect(createType('ISomeTypeName')).rejects.toThrow('Missing ts.typeDir.');
  });

  test('should throw error if typeName does not follow the required format', async () => {
    await expect(createType('invalidTypeName')).rejects.toThrowError();
  });

  test('should generate the type correctly and append it to the file', async () => {
    const typeName = 'ITestType';
    const generatedType = 'Test Type';
    const config = getConfig();
    useAiMock.mockResolvedValue({ message: generatedType });
    const coreTypesPath = path.join(__dirname, `../src/spells/${config.ts.typeDir}`, `${toSnakeCase(typeName)}.ts`);
    const comment = `/*\n* @category ${toTitleCase(typeName)}\n*/\n`;

    await createType(typeName);

    expect(fs.appendFileSync).toHaveBeenCalledWith(coreTypesPath, `${comment}${generatedType}\n\n`);
  });
});
