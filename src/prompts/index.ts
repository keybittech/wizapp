import { ChatCompletionRequestMessage } from "openai";

export enum IPrompts {
  CREATE_API = 'create_api',
  CREATE_API_BACKEND = 'create_api_backend',
  CREATE_TYPE = 'create_type',
  CREATE_GEN_COMPONENT = 'create_gen_component',
  CREATE_APP_COMPONENT = 'create_app_component',
  EDIT_FILE = 'edit_file',
  MORPH_FILE = 'morph_file',
  MORPH_2 = 'morph_2',
  MORPH_3 = 'morph_3',
  DERIVE_INSTRUCTION = 'derive_instruction',
  FILE_EDITOR = 'file_editor',
  GUIDED_EDIT = 'guided_edit',
  MIRROR_EDIT = 'mirror_edit',
  SUGGEST_ROLE = 'suggest_role',
  SUGGEST_SERVICE = 'suggest_service',
  SUGGEST_TIER = 'suggest_tier',
  SUGGEST_FEATURE = 'suggest_feature',
  CONVERT_PURPOSE = 'convert_purpose'
}

export const codeGPTPrecursor = 'You are BacktickGPT, providing only typescript code responses wrapped with 3 backticks before and after.';

export const aiPrompts: Partial<Record<IPrompts, string | ChatCompletionRequestMessage[]>> = {};

export function getSuggestionPrompt(prompt: string) {
  return `Generate 5 ${prompt}; Result is 1-3 words separated by |. Here are some examples: `;
}

export function generateExample(prompt: string, result: string = '') {
  return `Phrase: ${prompt}\nResult: ${result}`;
}

export * from './convert_purpose_prompt';
export * from './create_api_backend_prompt';
export * from './create_api_prompt';
export * from './create_app_component_prompt';
export * from './create_gen_component_prompt';
export * from './create_type_prompt';
export * from './file_editor_prompt';
export * from './guided_edit_prompt';
export * from './suggest_feature_prompt';
export * from './suggest_role_prompt';
export * from './suggest_service_prompt';
export * from './suggest_tier_prompt';