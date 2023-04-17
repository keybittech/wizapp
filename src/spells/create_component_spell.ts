import fs from 'fs';
import { Project, ScriptKind } from 'ts-morph';

import { useAi } from './use_ai_spell';
import { IPrompts } from '../prompts';
import { getConfig } from '../config';
import { getPathOf } from '../util';

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

  const res = await useAi<string>(IPrompts.CREATE_GEN_COMPONENT, description)
  
  const sourceFile = project.createSourceFile('new_component.tsx', res.message, { scriptKind: ScriptKind.JSX });

  const exAssignment = sourceFile.getExportAssignments().find(assignment => assignment.isExportEquals() === false);

  if (exAssignment) {
    const asExpression = exAssignment.getExpression();

    if (asExpression) {
      const creatorComment = `/* Created by ${user || config.user.name}, ${description} */\n`;

      const filePath = getPathOf(`./${config.ts.compDir}/${asExpression.getText()}.tsx`);
      fs.writeFileSync(filePath, `${creatorComment}${res.message}`);
      return 'created a new component';
    }
  }

  return 'unable to create a component ' + res.message;
}