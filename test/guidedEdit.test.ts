import * as git from '../src/git';
import * as useAiModule from '../src/spells/use_ai_spell';
import { createMockStatement, setupConfigTestAfter, setupConfigTestBefore, withTempConfig } from './testHelpers';
import { Project, SyntaxKind } from 'ts-morph';

// Mock the required functions
jest.mock('../src/git');
jest.mock('../src/spells/use_ai_spell');

const prepareBranchMock = git.prepareBranch as jest.Mock;
const managePullRequestMock = git.managePullRequest as jest.Mock;
const useAiMock = useAiModule.useAi as jest.Mock;

import { guidedEdit } from '../src/spells/guided_edit_spell';

describe('guidedEdit', () => {
  let tempConfigPath = '';

  beforeEach(() => {
    tempConfigPath = setupConfigTestBefore({ ai: { retries: '3' }, ts: { typeDir: 'types', configPath: 'tsconfig.json' } });
    jest.clearAllMocks();
  });

  afterEach(() => {
    setupConfigTestAfter(tempConfigPath);
  });

  test('should throw error when ts.configPath is not set', async () => {
    await withTempConfig({ ai: { retries: '3' }, ts: { configPath: '' } }, async () => {
      await expect(guidedEdit('NonExistent.tsx please make some changes to the file')).rejects.toThrow('Missing ts.configPath.');
    });
  });

  it('should return "file not found" if the file does not exist', async () => {
    await withTempConfig({ ai: { retries: '3' }, ts: { configPath: 'tsconfig.json' } }, async () => {
      const fileParts = 'NonExistent.tsx please make some changes to the file';
      prepareBranchMock.mockResolvedValue('test_branch');
      useAiMock.mockResolvedValue({ message: [] });
  
      const result = await guidedEdit(fileParts);
      expect(result).toBe('file not found: NonExistent.tsx');
    });
  });

  it('should return "the file is too large" if the file size is greater than 10000 characters', async () => {
    const fileParts = 'LargeFile.tsx please make some changes to the file';
    prepareBranchMock.mockResolvedValue('test_branch');
    useAiMock.mockResolvedValue({ message: [] });

    Project.prototype.getSourceFiles = jest.fn().mockReturnValue([{
      getFilePath: () => 'LargeFile.tsx',
      getText: () => 'a'.repeat(10001),
      getStatements: () => [],
    }]);

    const result = await guidedEdit(fileParts);
    expect(result).toBe('the file is too large');
  });

  it('should correctly handle generatedStatements for replacing, adding above, and adding below', async () => {
    const fileParts = 'Test.tsx please make some changes to the file';
    prepareBranchMock.mockResolvedValue('test_branch');
    managePullRequestMock.mockResolvedValue('PR created or updated');
  
    // Create mock statements
    const mockStatements = [
      createMockStatement('const statement_0 = "original_0";', SyntaxKind.VariableStatement),
      createMockStatement('const statement_1 = "original_1";', SyntaxKind.VariableStatement),
      createMockStatement('const statement_2 = "original_2";', SyntaxKind.VariableStatement),
    ];
  
    // Check if sourceFile content was updated correctly
    let updatedFileContent = mockStatements.map(s => s.getText()).join('\n');

    // Update sourceFileMock
    const sourceFileMock = {
      getFilePath: () => 'Test.tsx',
      getText: () => updatedFileContent,
      getFullText: () => updatedFileContent,
      getStatements: () => mockStatements,
      removeText: jest.fn(),
      insertText: jest.fn((index, content) => {
        updatedFileContent = updatedFileContent.slice(0, index) + content + updatedFileContent.slice(index);
      }),
      saveSync: jest.fn(),
    };

    // Mock project.save
    Project.prototype.save = jest.fn();
  
    // Mock getSourceFiles() to return the sourceFileMock
    const getSourceFilesMock = jest.fn().mockReturnValue([sourceFileMock]);
    Project.prototype.getSourceFiles = getSourceFilesMock;
  
    // Define generatedStatements
    const generatedStatements = {
      statement_0: 'const statement_0 = "original_0"',
      above_1: 'const above_1 = "above";',
      statement_2: 'const statement_2 = "original_2";',
      below_2: 'const below_2 = "below";',
    };
  
    // Mock useAi to return the generatedStatements
    useAiMock.mockResolvedValue({ message: [generatedStatements], supportingText: 'Supporting text' });

    // Call guidedEdit
    await guidedEdit(fileParts);
  
    // Check if useAi was called with correct parsedStatements
    const parsedStatements = JSON.parse(useAiMock.mock.calls[0][2]);
    expect(parsedStatements).toHaveProperty('statement_0');
    expect(parsedStatements).toHaveProperty('statement_1');
    expect(parsedStatements).toHaveProperty('statement_2');

    expect(updatedFileContent).toContain('const statement_0 = "original_0"');
    expect(updatedFileContent).toContain('const above_1 = "above";');
    expect(updatedFileContent).toContain('const statement_2 = "original_2";');
    expect(updatedFileContent).toContain('const below_2 = "below";');
  });
});