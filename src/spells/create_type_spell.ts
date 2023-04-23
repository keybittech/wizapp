import fs from "fs";
import { IPrompts } from "../prompts/prompts.js";
import { useAi } from "../spells/use_ai_spell.js";
import { getPathOf, isValidName, sanitizeName, toSnakeCase, toTitleCase } from "../util.js";
import { getConfig } from "../config.js";
import { CreateTypeResponse } from "../prompts/create_type_prompt.js";

export async function createType(typeName: string): Promise<string> {
  
  const config = getConfig();
  if (!config.ts.typeDir) {
    throw new Error('Missing ts.typeDir.')
  }

  if (!isValidName(typeName)) {
    throw new Error('this prompt typeName must follow ITypeName format, leading I, titleized');
  }

  const coreTypesPath = sanitizeName(config.ts.typeDir);
  const typeFilePath = getPathOf(`${coreTypesPath}/${toSnakeCase(typeName)}.ts`);
  const comment = `/*\n* @category ${toTitleCase(typeName)}\n*/\n`;  
  const generatedType = await useAi<CreateTypeResponse>(IPrompts.CREATE_TYPE, typeName)

  if (!fs.existsSync(coreTypesPath)) {
    fs.mkdirSync(coreTypesPath, { recursive: true });
  }

  fs.writeFileSync(typeFilePath, `${comment}${generatedType.message}\n\n`);

  return generatedType.message;
}