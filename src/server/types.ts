import { CreateChatCompletionRequest, CreateCompletionRequest, CreateModerationRequest } from "openai";

export type OpenAIRequestShapes = CreateChatCompletionRequest | CreateCompletionRequest | CreateModerationRequest;

export function isChatRequest(obj: OpenAIRequestShapes): obj is CreateChatCompletionRequest {
  return 'messages' in obj;
}

export function isCompletionRequest(obj: OpenAIRequestShapes): obj is CreateCompletionRequest {
  return 'prompt' in obj;
}

export function isModerationRequest(obj: OpenAIRequestShapes): obj is CreateModerationRequest {
  return 'input' in obj;
}