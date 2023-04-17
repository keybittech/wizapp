import fs from 'fs';
import { createComponent } from '../src/spells/create_component_spell';
import { useAi } from '../src/spells/use_ai_spell';
import { setupConfigTestAfter, setupConfigTestBefore } from './testHelpers';
import { getPathOf } from '../src/util';

jest.mock('../src/spells/use_ai_spell');

const useAiMock = useAi as jest.Mock;

describe('createComponent', () => {
  const compDir = getPathOf('./components');

  beforeEach(() => {
    setupConfigTestBefore({ ts: { compDir: './components', configPath: 'tsconfig.json' } });
    fs.mkdirSync(compDir);
    useAiMock.mockClear();
  });

  afterEach(() => {
    setupConfigTestAfter();
    fs.rmdirSync(compDir, { recursive: true });
  });

  test('should throw error when ts.compDir is not set', async () => {
    setupConfigTestBefore({ ts: { compDir: '', configPath: 'tsconfig.json' } });
    await expect(createComponent('Create a test component', 'user123')).rejects.toThrow('Missing ts.compDir.');
  });

  test('should create a new component', async () => {
    setupConfigTestBefore({ ts: { compDir: './components', configPath: 'tsconfig.json' } });
    const componentName = 'TestComponent';
    const componentContent = `
      import React from 'react';
  
      function ${componentName}() {
        return <div>${componentName}</div>;
      }
  
      export default ${componentName};
    `;
  
    useAiMock.mockResolvedValue({ message: componentContent });
  
    const writeFileSpy = jest.spyOn(fs, 'writeFileSync');
    const result = await createComponent('Create a test component', 'user123');
    const filePath = getPathOf(`./components/${componentName}.tsx`);
    const creatorComment = `/* Created by user123, Create a test component */\n`;
  
    expect(writeFileSpy).toHaveBeenCalledWith(filePath, `${creatorComment}${componentContent}`);
    expect(result).toBe('created a new component');
  });

  test('should return an error message if the component cannot be created', async () => {
    const invalidComponentContent = `
      import React from 'react';
    `;

    useAiMock.mockResolvedValue({ message: invalidComponentContent });

    const result = await createComponent('Create an invalid component', 'user123');
    expect(result).toBe('unable to create a component ' + invalidComponentContent);
  });
});
