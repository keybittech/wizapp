import { CreateChatCompletionRequest, CreateCompletionRequest, CreateModerationRequest } from "openai";
import { IPrompts } from "./prompts";

export type ConfigPropTypes = string;
export type Config = Record<string, Record<string, ConfigPropTypes>>;
export type CurrentType = ConfigPropTypes | Config;

export function isConfigNestedObject(obj: unknown): obj is Record<string, ConfigPropTypes> {
  return typeof obj === 'object' && obj !== null;
}

export type GuardValidations = Record<string, unknown> | Record<string, unknown>[] | string[] | Array<{ [k: string]: unknown; blah_2?: unknown; beep_1?: unknown; }>

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
} & { blah_2?: unknown; beep_1?: unknown; }

export type ChatResponse<T> = OpenAIResults & {
  supportingText?: string;
  message: T;
} & { blah_2?: unknown; beep_1?: unknown; }

export type CompletionResponse = OpenAIResults & {
  message: string;
} & { blah_2?: unknown; beep_1?: unknown; }

export type ModerationResponse = OpenAIResults & {
  flagged: boolean;
} & { blah_2?: unknown; beep_1?: unknown; }

export type UseAIResponses<T> = T extends boolean ? ModerationResponse : T extends undefined ? CompletionResponse : ChatResponse<T> & { blah_2?: unknown; beep_1?: unknown; };


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
  return 'object' === typeof obj && 'message' in obj && Array.isArray(obj.message) && obj.message.every((elem: unknown) => {
  return typeof elem === 'object' && elem !== null && ('blah_2' in elem || 'beep_1' in elem);
});
}

export function isCompletionResponse(obj: GuardValidations): obj is CompletionResponse {
  return 'object' === typeof obj && 'message' in obj && 'string' === typeof obj.message && ('blah_2' in obj || 'beep_1' in obj);
}

export function isModerationResponse(obj: GuardValidations): obj is ModerationResponse {
  return 'object' === typeof obj && 'input' in obj;
}