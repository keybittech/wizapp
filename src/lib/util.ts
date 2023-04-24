import type { ChatResponse, CompletionResponse, ConfigPropTypes, DefaultGrammarOrVariants, Grammars, GuardValidations, ModerationResponse } from "./types";

export function isConfigNestedObject(obj: unknown): obj is Record<string, ConfigPropTypes> {
  return typeof obj === 'object' && obj !== null;
}

export function isDefaultGrammar(obj: DefaultGrammarOrVariants): obj is { default: Grammars } {
  return 'string' === typeof obj.default.name;
}

export function isDefaultGrammarVariants(obj: DefaultGrammarOrVariants): obj is { default: { [prop: string]: Grammars } } {
  return 'undefined' === typeof obj.default.name;
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