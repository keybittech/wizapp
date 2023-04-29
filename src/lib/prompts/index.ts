import { ChatCompletionRequestMessage } from "openai";

import { convertPurposeMessages } from './convert_purpose_prompt';
import { createApiBackendMessages } from './create_api_backend_prompt';
import { createApiMessages } from './create_api_prompt';
import { createAppComponentMessages } from './create_app_component_prompt';
import { createGenComponentMessages } from './create_gen_component_prompt';
import { createTypeMessages } from './create_type_prompt';
import { fileEditorMessages } from './file_editor_prompt';
import { guidedEditMessages } from './guided_edit_prompt';
import { suggestFeatureMessages } from './suggest_feature_prompt';
import { suggestRoleMessages } from './suggest_role_prompt';
import { suggestServiceMessages } from './suggest_service_prompt';
import { suggestTierMessages } from './suggest_tier_prompt';
import { deriveInstructionMessages } from "./derive_instruction_prompt";

export enum IPrompts {
  CREATE_API = 'create_api',
  CREATE_API_BACKEND = 'create_api_backend',
  CREATE_TYPE = 'create_type',
  CREATE_GEN_COMPONENT = 'create_gen_component',
  CREATE_APP_COMPONENT = 'create_app_component',
  DERIVE_INSTRUCTION = 'derive_instruction',
  FILE_EDITOR = 'file_editor',
  GUIDED_EDIT = 'guided_edit',
  SUGGEST_ROLE = 'suggest_role',
  SUGGEST_SERVICE = 'suggest_service',
  SUGGEST_TIER = 'suggest_tier',
  SUGGEST_FEATURE = 'suggest_feature',
  CONVERT_PURPOSE = 'convert_purpose'
}

type AiPrompts = Record<IPrompts, string | ChatCompletionRequestMessage[]>;

export let aiPrompts: AiPrompts = {
  [IPrompts.CONVERT_PURPOSE]: convertPurposeMessages,
  [IPrompts.CREATE_API_BACKEND]: createApiBackendMessages,
  [IPrompts.CREATE_API]: createApiMessages,
  [IPrompts.CREATE_APP_COMPONENT]: createAppComponentMessages,
  [IPrompts.CREATE_GEN_COMPONENT]: createGenComponentMessages,
  [IPrompts.CREATE_TYPE]: createTypeMessages,
  [IPrompts.DERIVE_INSTRUCTION]: deriveInstructionMessages,
  [IPrompts.FILE_EDITOR]: fileEditorMessages,
  [IPrompts.GUIDED_EDIT]: guidedEditMessages,
  [IPrompts.SUGGEST_FEATURE]: suggestFeatureMessages,
  [IPrompts.SUGGEST_ROLE]: suggestRoleMessages,
  [IPrompts.SUGGEST_SERVICE]: suggestServiceMessages,
  [IPrompts.SUGGEST_TIER]: suggestTierMessages
};

export function injectPrompts(prompts: Partial<AiPrompts>) {
  aiPrompts = { ...aiPrompts, ...prompts };
}