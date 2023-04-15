import path from 'path';
import fs from 'fs';
import { Project } from 'ts-morph';

import { isValidName, toSnakeCase, toTitleCase } from '../util';
import { useAi } from './use_ai';
import { IPrompts } from '../prompts';

export async function createApi(typeName: string, user: string) {
  if (!isValidName(typeName)) {
    return 'this prompt typeName must follow ITypeName format, leading I, titleized';
  }

  const project = new Project({
    tsConfigFilePath: './projectts.json'
  });

  const generatedType = await useAi<string>(IPrompts.CREATE_TYPE, typeName)
  const coreTypesPath = path.join(__dirname, `../../core/types/generated/${toSnakeCase(typeName)}.ts`);
  const creatorComment = `/* Created by ${user} */\n`;
  const comment = `/*\n* @category ${toTitleCase(typeName)}\n*/\n`;

  fs.appendFileSync(coreTypesPath, `${creatorComment}${comment}${generatedType}\n\n`);

  const generatedApi = await useAi<string>(IPrompts.CREATE_API, generatedType.message)

  fs.appendFileSync(coreTypesPath, `${comment}${generatedApi.message}\n\n`);

  const sourceFile = project.addSourceFileAtPath(coreTypesPath);
  const variables = sourceFile.getVariableDeclarations();
  const apiEndpoints: string[] = [];

  for (const v of variables) {
    if (v.getName().endsWith('Api')) {
      const initializer = v.getInitializer();
      if (initializer) {
        initializer.getType().getProperties().forEach(p => {
          apiEndpoints.push(p.getName())
        });
      }
    }
  }
  console.log({ apiEndpoints });

  try {
    const generatedApiBackend = await useAi<string>(IPrompts.CREATE_API_BACKEND, generatedType + ' ' + apiEndpoints.join(' '))

    sourceFile.insertText(sourceFile.getEnd(), `${comment}${generatedApiBackend.message}\n\n`);
    sourceFile.fixMissingImports();
    await project.save();
  } catch (error) {
    console.error(error);
  }

  return `generated api artifacts using the type ${typeName}!`;
}