import fs from 'fs';
import { setConfig, defaultConfig, configFilePath } from '../src/server/config';
import type { Config } from '../src/lib/types';
import { SyntaxKind } from 'ts-morph';
import { generateTempFilePath, getDirPathOf } from '../src/server/util';

let chatResponseContent: string;
let completionResponseText: string;
let moderationResponseFlagged: boolean;

export let openai: Record<string, ReturnType<ReturnType<typeof jest.fn>['mockResolvedValue']>>;

export function setupOpenAiMocks({ chat, completion, moderation }: { chat?: string, completion?: string, moderation?: string }) {
  openai = {
    createChatCompletion: jest.fn().mockResolvedValue({
      data: { choices: [{ message: { content: chat || chatResponseContent } }] },
    }),
    createCompletion: jest.fn().mockReturnValue({
      data: { choices: [{ text: completion || completionResponseText }] },
    }),
    createModeration: jest.fn().mockReturnValue({
      data: { results: [{ flagged: moderation || moderationResponseFlagged }] },
    }),
  };
}

export function setupCommonMocks() {

  setupOpenAiMocks({});

  jest.mock('openai', () => ({
    OpenAIApi: jest.fn().mockImplementation(() => openai),
  }));

  jest.mock('ts-morph', () => ({
    // Mock the ts-morph library's methods here.
    Project: jest.fn().mockImplementation(() => ({
      addSourceFileAtPath: jest.fn().mockReturnValue({}),
      getSourceFile: jest.fn().mockReturnValue({}),
      save: jest.fn(),
      // ...mock other methods if needed
    })),
    SyntaxKind: jest.fn().mockReturnValue({}),
    FunctionDeclaration: jest.fn(),
    Node: jest.fn()
  }));
}

export function setupChatResponse(content: string) {
  chatResponseContent = content;
}

export function setupCompletionResponse(text: string) {
  completionResponseText = text;
}

export function setupModerationResponse(flagged: boolean) {
  moderationResponseFlagged = flagged;
}

export function generateTempConfigPath() {
  const configDirPath = getDirPathOf(configFilePath);
  return generateTempFilePath(configDirPath, `test-config`);
}

export function setupConfigTestBefore(testConfig?: Config) {
  const updatedConfig = Object.assign(defaultConfig, (testConfig || {}));
  setConfig(updatedConfig);
  
  // Reset the config file to default values before each test using a custom test file
  const tempConfigPath = generateTempConfigPath();
  fs.writeFileSync(tempConfigPath, JSON.stringify(updatedConfig, null, 2));
  return tempConfigPath;
}

export function setupConfigTestAfter(tempConfigPath: string) {
  // Clean up the config file after each test
  if (fs.existsSync(tempConfigPath)) {
    fs.unlinkSync(tempConfigPath);
  }
}

export function mockGetConfig(tempConfigPath: string) {
  jest.resetModules();
  jest.mock('../src/config', () => {
    const original = jest.requireActual('../src/config');
    return {
      ...original,
      getConfig: () => original.getConfigFromPath(tempConfigPath),
    };
  });
}

export async function withTempConfig(tempConfig: Config, testFunc: () => Promise<void>) {
  const tempConfigPath = setupConfigTestBefore(tempConfig);
  mockGetConfig(tempConfigPath);
  try {
    await testFunc();
  } finally {
    setupConfigTestAfter(tempConfigPath);
  }
}

export function withOriginalGetConfig(testFunc: () => Promise<void>) {
  jest.resetModules(); // Clear the Jest module cache
  try {
    return testFunc();
  } finally {
    jest.resetModules(); // Clear the Jest module cache again after the test execution
  }
}

export function createMockStatement(text: string, kind: SyntaxKind) {
  return {
    getText: () => text,
    getFullText: () => text,
    getKind: () => kind,
    getParent: () => null,
  };
}