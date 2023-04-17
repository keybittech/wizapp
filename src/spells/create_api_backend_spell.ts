import { Project } from 'ts-morph';
import { getConfig } from '../config';
import { getPathOf, toSnakeCase, toTitleCase } from '../util';
import { useAi } from './use_ai_spell';
import { IPrompts } from '../prompts';

export async function createApiBackend(typeName: string, generatedType: string) {
  const config = getConfig();
  if (!config.ts.configPath) {
    throw new Error('Missing ts.configPath.')
  }
  const project = new Project({
    tsConfigFilePath: config.ts.configPath
  });

  const coreTypesPath = getPathOf(`${config.ts.typeDir}/${toSnakeCase(typeName)}.ts`);
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
  
  try {
    const generatedApiBackend = await useAi<string>(IPrompts.CREATE_API_BACKEND, generatedType + ' ' + apiEndpoints.join(' '))
    const comment = `/*\n* @category ${toTitleCase(typeName)}\n*/\n`;
    sourceFile.insertText(sourceFile.getEnd(), `${comment}${generatedApiBackend.message}\n\n`);
    sourceFile.fixMissingImports();
    await project.save();
  } catch (error) {
    console.error(error);
  }

  return `generated backend using the type ${typeName}!`;
}