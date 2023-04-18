import fs from "fs";
import { CreateTypeResponse, IPrompts } from "../prompts";
import { useAi } from "./use_ai_spell";
import { getPathOf, isValidName, sanitizeName, toSnakeCase, toTitleCase } from "../util";
import { getConfig } from "../config";

export async function createType(typeName: string) {
  
  const config = getConfig();
  if (!config.ts.typeDir) {
    throw new Error('Missing ts.typeDir.')
  }

  if (!isValidName(typeName)) {
    throw new Error('this prompt typeName must follow ITypeName format, leading I, titleized');
  }

  const coreTypesPath = sanitizeName(config.ts.typeDir);
  const typeFilePath = getPathOf(`../../${coreTypesPath}/${toSnakeCase(typeName)}.ts`);
  const comment = `/*\n* @category ${toTitleCase(typeName)}\n*/\n`;  
  const generatedType = await useAi<CreateTypeResponse>(IPrompts.CREATE_TYPE, typeName)

  if (!fs.existsSync(coreTypesPath)) {
    fs.mkdirSync(coreTypesPath, { recursive: true });
  }

  fs.writeFileSync(typeFilePath, `${comment}${generatedType.message}\n\n`);

  return generatedType.message;
}