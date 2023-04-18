import { CreateChatCompletionRequest, CreateCompletionRequest, CreateModerationRequest } from "openai";
import { IPrompts } from "./prompts";

export type ConfigPropTypes = string;
export type Config = Record<string, Record<string, ConfigPropTypes>>;
export type CurrentType = ConfigPropTypes | Config;

export function isConfigNestedObject(obj: unknown): obj is Record<string, ConfigPropTypes> {
  return typeof obj === 'object' && obj !== null;
}

export type GuardValidations = Record<string, unknown> | Record<string, unknown>[] | string

export type OpenAIRequestShapes = CreateChatCompletionRequest | CreateCompletionRequest | CreateModerationRequest;

export type OpenAIResults = {
  model?: string;
  timestamp: Date;
  prompts?: string[];
  promptType: IPrompts;
  promptTemplate: string | undefined;
  rawResponses: (string | boolean | undefined)[];
  failures: string[];
  successful: boolean;
}

export type ChatResponse<T> = OpenAIResults & {
  supportingText?: string;
  message: T;
}

export type CompletionResponse = OpenAIResults & {
  message: string;
}

export type ModerationResponse = OpenAIResults & {
  flagged: boolean;
}

export type UseAIResponses<T> = T extends boolean ? ModerationResponse : T extends undefined ? CompletionResponse : ChatResponse<T>;


export function isChatRequest(obj: OpenAIRequestShapes): obj is CreateChatCompletionRequest {
  return 'messages' in obj;
}

export function isCompletionRequest(obj: OpenAIRequestShapes): obj is CreateCompletionRequest {
  return 'prompt' in obj;
}

export function isModerationRequest(obj: OpenAIRequestShapes): obj is CreateModerationRequest {
  return 'input' in obj;
}

export function isChatResponse<T>(obj: GuardValidations): obj is ChatResponse<T> {
  return 'object' === typeof obj && 'message' in obj && Array.isArray(obj.message);
}

export function isCompletionResponse(obj: GuardValidations): obj is CompletionResponse {
  return 'object' === typeof obj && 'message' in obj && 'string' === typeof obj.message;
}

export function isModerationResponse(obj: GuardValidations): obj is ModerationResponse {
  return 'object' === typeof obj && 'input' in obj;
}