import fs from 'fs';
import { getPathOf, sanitizeName, toSnakeCase, toTitleCase } from '../util.js';
import { useAi } from '../spells/use_ai_spell.js';
import { IPrompts } from '../prompts/prompts.js';
import { getConfig } from '../config.js';
import { CreateApiResult } from '../prompts/create_api_prompt.js';

export async function createApi(typeName: string, generatedType: string): Promise<string> {

  const config = getConfig();

  if (!config.ts.typeDir) {
    throw new Error('Missing ts.typeDir.')
  }

  const coreTypesPath = sanitizeName(config.ts.typeDir);
  const typeFilePath = getPathOf(`${coreTypesPath}/${toSnakeCase(typeName)}.ts`);
  const comment = `/*\n* @category ${toTitleCase(typeName)}\n*/\n`;
  
  const generatedApi = await useAi<CreateApiResult>(IPrompts.CREATE_API, generatedType);

  fs.appendFileSync(typeFilePath, `${comment}${generatedApi.message}\n\n`);

  return generatedApi.message;
}