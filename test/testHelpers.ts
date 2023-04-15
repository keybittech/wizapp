import fs from 'fs';
import path from 'path';
import { getConfig } from '../src/config';
import { Config } from '../src/types';

let chatResponseContent: string;
let completionResponseText: string;
let moderationResponseFlagged: boolean;

export let openai: Record<string, ReturnType<ReturnType<typeof jest.fn>['mockResolvedValue']>>;

export function setupCommonMocks() {
  openai = {
    createChatCompletion: jest.fn().mockResolvedValue({
      data: { choices: [{ message: { content: chatResponseContent } }] },
    }),
    createCompletion: jest.fn().mockReturnValue({
      data: { choices: [{ text: completionResponseText }] },
    }),
    createModeration: jest.fn().mockReturnValue({
      data: { results: [{ flagged: moderationResponseFlagged }] },
    }),
  };

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

const configFile = path.join(__dirname, '../src/config.json');

export function setupConfigTestBefore(testConfig?: Config) {
  const defaultConfig = getConfig();
  // Reset the config file to default values before each test
  fs.writeFileSync(configFile, JSON.stringify(Object.assign(defaultConfig, (testConfig || {})), null, 2));
}

export function setupConfigTestAfter() {
  // Clean up the config file after each test
  if (fs.existsSync(configFile)) {
    fs.unlinkSync(configFile);
  }
}