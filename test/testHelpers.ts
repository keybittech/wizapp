import fs from 'fs';
import { setConfig, getConfig, configFilePath } from '../src/config';
import { Config } from '../src/types';
import { SyntaxKind, CommentRange } from 'ts-morph';

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

export function setupConfigTestBefore(testConfig?: Config) {
  const defaultConfig = getConfig();
  const updatedConfig = Object.assign(defaultConfig, (testConfig || {}));
  setConfig(updatedConfig);
  // Reset the config file to default values before each test
  fs.writeFileSync(configFilePath, JSON.stringify(updatedConfig, null, 2));
}

export function setupConfigTestAfter() {
  // Clean up the config file after each test
  if (fs.existsSync(configFilePath)) {
    fs.unlinkSync(configFilePath);
  }
}

export function createMockStatement(
  text: string,
  kind: SyntaxKind,
  leadingCommentRanges: CommentRange[] = []
) {
  return {
    getText: () => text,
    getFullText: () => text,
    getKind: () => kind,
    getParent: () => null,
    getLeadingCommentRanges: () => leadingCommentRanges.map(range => ({
      ...range,
      getText: () => text.slice(range.compilerObject.pos, range.compilerObject.end),
    })),
    leadingCommentRanges
  };
}

