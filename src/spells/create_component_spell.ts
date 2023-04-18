import fs from 'fs';
import { Node, Project, ScriptKind, SyntaxKind } from 'ts-morph';

import { useAi } from './use_ai_spell';
import { GeneralComponentResponse, IPrompts } from '../prompts';
import { getConfig } from '../config';
import { getPathOf, sanitizeName } from '../util';

export async function createComponent(description: string, user?: string) {
  
  const config = getConfig();
  if (!config.ts.compDir) {
    throw new Error('Missing ts.compDir.')
  }

  if (!config.ts.configPath) {
    throw new Error('Missing ts.configPath.')
  }

  const project = new Project({
    tsConfigFilePath: config.ts.configPath
  });

  const res = await useAi<GeneralComponentResponse>(IPrompts.CREATE_GEN_COMPONENT, description);

  const sourceFile = project.createSourceFile('new_component.tsx', res.message, { scriptKind: ScriptKind.JSX });

  
  let componentName;
  const exportedDeclarations = sourceFile.getExportedDeclarations().get('default');
  if (exportedDeclarations) {
    const declaration = exportedDeclarations[0];
    if (Node.isVariableDeclaration(declaration)) {
      const initializer = declaration.getInitializer();
      if (initializer?.getKind() === SyntaxKind.FunctionExpression || initializer?.getKind() === SyntaxKind.ArrowFunction) {
        componentName = declaration.getName();
      }
    } else if (Node.isFunctionDeclaration(declaration)) {
      componentName = declaration.getName();
    }
  }

  if (componentName) {
    const creatorComment = `/* Created by ${user || config.user.name}, ${description} */\n`;
    const coreCompsPath = sanitizeName(config.ts.compDir);
    const filePath = getPathOf(`../../${coreCompsPath}/${componentName}.tsx`);
    
    if (!fs.existsSync(coreCompsPath)) {
      fs.mkdirSync(coreCompsPath, { recursive: true });
    }

    fs.writeFileSync(filePath, `${creatorComment}${res.message}`);
    return 'created a new component';
  }

  return 'unable to create a component ' + res.message;
}