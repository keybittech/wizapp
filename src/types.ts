import { CreateChatCompletionRequest, CreateCompletionRequest, CreateModerationRequest } from "openai";
import { IPrompts } from "./prompts";

export type Config = Record<string, Record<string, string | undefined>>;
export type CurrentType = string | undefined | Config | Record<string, string | undefined>;

export function isConfigNestedObject(obj: unknown): obj is Record<string, string | undefined> {
  return typeof obj === 'object' && obj !== null;
}

export type OpenAIRequestShapes = CreateChatCompletionRequest | CreateCompletionRequest | CreateModerationRequest;

export type OpenAIResults = {
  timestamp: Date;
  promptType: IPrompts;
  promptTemplate: string | undefined;
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

export type UseAIResponses<T> = T extends undefined ? (CompletionResponse | ModerationResponse) : ChatResponse<T>;

export function isChatRequest(obj: OpenAIRequestShapes): obj is CreateChatCompletionRequest {
  return 'messages' in obj;
}

export function isCompletionRequest(obj: OpenAIRequestShapes): obj is CreateCompletionRequest {
  return 'prompt' in obj;
}

export function isModerationRequest(obj: OpenAIRequestShapes): obj is CreateModerationRequest {
  return 'input' in obj;
}

export function isChatResponse<T>(obj: Record<string, unknown>): obj is ChatResponse<T> {
  return 'message' in obj && Array.isArray(obj.message) && obj.message.length > 0;
}

export function isCompletionResponse(obj: Record<string, unknown>): obj is CompletionResponse {
  return 'message' in obj && 'string' === typeof obj.message;
}

export function isModerationResponse(obj: Record<string, unknown>): obj is ModerationResponse {
  return 'input' in obj;
}