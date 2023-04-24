import fs from 'fs';
import { createComponent } from '../src/server/spells/create_component_spell';
import * as useAiModule from '../src/server/spells/use_ai_spell';
import { setupConfigTestAfter, setupConfigTestBefore, withOriginalGetConfig, withTempConfig } from './testHelpers';
import { getPathOf, sanitizeName } from '../src/server/util';
import { getConfig } from '../src/server/config';

jest.mock('fs', () => ({
  ...jest.requireActual('fs'),
  writeFileSync: jest.fn(),
  existsSync: jest.fn(),
  mkdirSync: jest.fn()
}));

jest.mock('../src/server/spells/use_ai_spell', () => ({
  useAi: jest.fn(),
}));

const useAiMock = useAiModule.useAi as jest.Mock;

describe('createComponent', () => {
  let tempConfigPath = '';

  beforeEach(() => {
    tempConfigPath = setupConfigTestBefore({ ts: { compDir: 'components', configPath: 'tsconfig.json' } });
    useAiMock.mockClear();
  });

  afterEach(() => {
    setupConfigTestAfter(tempConfigPath);
  });

  test('should throw error when ts.compDir is not set', async () => {
    await withTempConfig({ ts: { compDir: '', configPath: 'tsconfig.json' } }, async () => {
      await expect(createComponent('Create a test component', 'user123')).rejects.toThrow('Missing ts.compDir.');
    });
  });

  test('should create a new component', async () => {
    await withOriginalGetConfig(async () => {
      const config = getConfig();
      const componentName = 'TestComponent';
      const componentContent = `
          import React from 'react';
      
          function ${componentName}() {
            return <div>${componentName}</div>;
          }
      
          export default ${componentName};
        `;

      useAiMock.mockResolvedValue({ message: componentContent });

      fs.writeFileSync = jest.fn()

      await createComponent('Create a test component', 'user123');

      const coreCompsPath = sanitizeName(config.ts.compDir);
      const compFileDir = getPathOf(`${coreCompsPath}/${componentName}.tsx`);
      const comment = `/* Created by user123, Create a test component */\n`;

      // Check if the directory was created
      expect(fs.existsSync).toHaveBeenCalledWith(coreCompsPath);
      expect(fs.mkdirSync).toHaveBeenCalledWith(coreCompsPath, { recursive: true });

      expect(fs.writeFileSync).toHaveBeenCalledWith(compFileDir, `${comment}${componentContent}`)

    });
  });

  test('should return an error message if the component cannot be created', async () => {
    const invalidComponentContent = `import React from 'react';`;
    useAiMock.mockResolvedValue({ message: invalidComponentContent });
    const result = await createComponent('Create an invalid component', 'user123');
    expect(result).toBe('unable to create a component ' + invalidComponentContent);
  });
});
