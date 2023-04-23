import { ChatCompletionRequestMessage } from "openai";
import { convertPurposePrompt } from "./convert_purpose_prompt.js";
import { createApiBackendMessages } from "./create_api_backend_prompt.js";
import { createApiMessages } from "./create_api_prompt.js";
import { createAppComponentPrompt } from "./create_app_component_prompt.js";
import { createGenComponentPrompt } from "./create_gen_component_prompt.js";
import { createTypeMessages } from "./create_type_prompt.js";
import { deriveInstructionPrompt } from "./derive_instruction_prompt.js";
import { fileEditorPrompt } from "./file_editor_prompt.js";
import { guidedEditPrompt } from "./guided_edit_prompt.js";
import { suggestFeaturePrompt } from "./suggest_feature_prompt.js";
import { suggestRoleMessages } from "./suggest_role_prompt.js";
import { suggestServicePrompt } from "./suggest_service_prompt.js";
import { suggestTierPrompt } from "./suggest_tier_prompt.js";

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

export const aiPrompts: Partial<Record<IPrompts, string | ChatCompletionRequestMessage[]>> = {
  [IPrompts.CONVERT_PURPOSE]: convertPurposePrompt,
  [IPrompts.CREATE_API_BACKEND]: createApiBackendMessages,
  [IPrompts.CREATE_API]: createApiMessages,
  [IPrompts.CREATE_APP_COMPONENT]: createAppComponentPrompt,
  [IPrompts.CREATE_GEN_COMPONENT]: createGenComponentPrompt,
  [IPrompts.CREATE_TYPE]: createTypeMessages,
  [IPrompts.DERIVE_INSTRUCTION]: deriveInstructionPrompt,
  [IPrompts.FILE_EDITOR]: fileEditorPrompt,
  [IPrompts.GUIDED_EDIT]: guidedEditPrompt,
  [IPrompts.SUGGEST_FEATURE]: suggestFeaturePrompt,
  [IPrompts.SUGGEST_ROLE]: suggestRoleMessages,
  [IPrompts.SUGGEST_SERVICE]: suggestServicePrompt,
  [IPrompts.SUGGEST_TIER]: suggestTierPrompt
};