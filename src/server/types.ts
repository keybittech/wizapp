import { CreateChatCompletionRequest, CreateCompletionRequest, CreateModerationRequest } from "openai";

export type OpenAIRequestShapes = CreateChatCompletionRequest | CreateCompletionRequest | CreateModerationRequest;
