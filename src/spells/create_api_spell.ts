import path from 'path';
import fs from 'fs';
import { toSnakeCase, toTitleCase } from '../util';
import { useAi } from './use_ai_spell';
import { IPrompts } from '../prompts';
import { getConfig } from '../config';

export async function createApi(typeName: string, generatedType: string) {

  const config = getConfig();

  if (!config.ts.typeDir) {
    throw new Error('Missing ts.typeDir.')
  }

  const generatedApi = await useAi<string>(IPrompts.CREATE_API, generatedType);
  const coreTypesPath = path.join(__dirname, config.ts.typeDir, `${toSnakeCase(typeName)}.ts`);
  const comment = `/*\n* @category ${toTitleCase(typeName)}\n*/\n`;

  fs.appendFileSync(coreTypesPath, `${comment}${generatedApi.message}\n\n`);

  return generatedApi.message;
}