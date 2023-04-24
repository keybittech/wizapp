
export type ConfigPropTypes = string;
export type Config = Record<string, Record<string, ConfigPropTypes>>;
export type CurrentType = ConfigPropTypes | Config;

export type GuardValidations = Record<string, unknown> | Record<string, unknown>[] | string


export type OpenAIResults = {
  model?: string;
  timestamp: Date;
  prompts?: string[];
  promptType: string;
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


export interface Node {
  type: string;
  text: string;
  children: Node[];
}

export type Language = {
  grammar: any;
  regexRules: {
    [nodeType: string]: RegExp;
  };
};

export interface Statements {
  type: string;
  text: string;
}

export interface LanguageParser {
  fileExtension: string[];
  parserName: string;
  parserVariant?: string;
}

export interface Grammars {
  name: string;
  nodeTypeInfo: Grammar[];
}

export interface Grammar {
  type: string;
  named: boolean;
  subtypes?: Grammar[];
  fields?: Record<string, Field>;
  children?: Children;
}

export interface Field {
  multiple: boolean;
  required: boolean;
  types: TypeRef[];
}

export interface TypeRef {
  type: string;
  named: boolean;
}

export interface Children {
  multiple: boolean;
  required: boolean;
  types: TypeRef[];
}

export type LinearizedStatement = {
  i: number; // id
  p?: number; // parentId
  t: string; // type
  c: string; // content
};

export type DefaultGrammarOrVariants = {
  default: Grammars | {
    [prop: string]: Grammars
  }
}