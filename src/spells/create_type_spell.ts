import fs from "fs";
import path from "path";
import { IPrompts } from "../prompts";
import { useAi } from "./use_ai_spell";
import { isValidName, toSnakeCase, toTitleCase } from "../util";
import { getConfig } from "../config";

export async function createType(typeName: string) {
  
  const config = getConfig();

  if (!isValidName(typeName)) {
    return 'this prompt typeName must follow ITypeName format, leading I, titleized';
  }

  const generatedType = await useAi<string>(IPrompts.CREATE_TYPE, typeName)
  const coreTypesPath = path.join(__dirname, config.ts.typeDir, `${toSnakeCase(typeName)}.ts`);
  const comment = `/*\n* @category ${toTitleCase(typeName)}\n*/\n`;

  fs.appendFileSync(coreTypesPath, `${comment}${generatedType}\n\n`);

  return generatedType.message;
}