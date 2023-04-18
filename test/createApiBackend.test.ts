import * as useAiModule from '../src/spells/use_ai_spell';
import { getConfig } from '../src/config';
import { setupConfigTestBefore, setupConfigTestAfter, withTempConfig } from './testHelpers';
import { getPathOf, toSnakeCase, toTitleCase } from '../src/util';
import { Project } from 'ts-morph';

jest.mock('fs', () => ({
  ...jest.requireActual('fs'),
  appendFileSync: jest.fn(),
}));

// Mock the useAi function
jest.mock('../src/spells/use_ai_spell', () => ({
  useAi: jest.fn(),
}));

const useAiMock = useAiModule.useAi as jest.Mock;

import { createApiBackend } from '../src/spells';

describe('createApiBackend', () => {
  let tempConfigPath = '';

  beforeEach(() => {
    tempConfigPath = setupConfigTestBefore({ ts: { typeDir: 'types', configPath: 'tsconfig.json' } });
  });

  afterEach(() => {
    setupConfigTestAfter(tempConfigPath);
  });

  test('should throw error when ts.configPath is not set', async () => {
    await withTempConfig({ ts: { configPath: '' } }, async () => {
      await expect(createApiBackend('ISomeTypeName', 'GeneratedType')).rejects.toThrow('Missing ts.configPath.');
    });
  });

  test('should generate the API backend correctly and append it to the file', async () => {
    await withTempConfig({ ts: { typeDir: 'types', configPath: 'tsconfig.json' } }, async () => {
      const typeName = 'ITestType';
      const generatedType = 'GeneratedType';
      const config = getConfig();
      useAiMock.mockResolvedValue({ message: generatedType });
      const coreTypesPath = getPathOf(`../src/spells/${config.ts.configPath}/${toSnakeCase(typeName)}.ts`);
      const comment = `/*\n* @category ${toTitleCase(typeName)}\n*/\n`;
  
      const addSourceFileAtPathMock = jest.fn().mockReturnValue({
        getVariableDeclarations: jest.fn().mockReturnValue([]),
        insertText: jest.fn(),
        fixMissingImports: jest.fn(),
        getEnd: jest.fn()
      });
      const saveMock = jest.fn();
      jest.spyOn(Project.prototype, 'addSourceFileAtPath').mockImplementation(addSourceFileAtPathMock);
      jest.spyOn(Project.prototype, 'save').mockImplementation(saveMock);
      
      // Re-import the project module to use the mocked version
      jest.resetModules();
      require('ts-morph');
  
      await createApiBackend(typeName, generatedType);
  
      const project = new Project();
      const sourceFile = project.addSourceFileAtPath(coreTypesPath);
      expect(sourceFile).toBeTruthy();
      expect(sourceFile.insertText).toHaveBeenCalledWith(sourceFile.getEnd(), `${comment}${generatedType}\n\n`);
      expect(sourceFile.fixMissingImports).toHaveBeenCalled();
      expect(project.save).toHaveBeenCalled();
    });
  });
});
