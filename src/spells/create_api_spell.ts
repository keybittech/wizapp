import fs from 'fs';
import { getPathOf, sanitizeName, toSnakeCase, toTitleCase } from '../util';
import { useAi } from './use_ai_spell';
import { IPrompts } from '../prompts';
import { getConfig } from '../config';

export async function createApi(typeName: string, generatedType: string) {

  const config = getConfig();

  if (!config.ts.typeDir) {
    throw new Error('Missing ts.typeDir.')
  }

  const coreTypesPath = sanitizeName(config.ts.typeDir) + '/';
  const generatedApi = await useAi<string>(IPrompts.CREATE_API, generatedType);
  const typeFilePath = getPathOf(`${coreTypesPath}${toSnakeCase(typeName)}.ts`);
  const comment = `/*\n* @category ${toTitleCase(typeName)}\n*/\n`;

  fs.appendFileSync(typeFilePath, `${comment}${generatedApi.message}\n\n`);

  return generatedApi.message;
}