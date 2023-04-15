import fs from 'fs';
import path from 'path';
import { Project, ScriptKind } from 'ts-morph';

import { useAi } from './use_ai';
import { IPrompts } from '../prompts';

export async function createComponent(description: string, user: string) {

  const project = new Project({
    tsConfigFilePath: './projectts.json'
  });

  const res = await useAi<string>(IPrompts.CREATE_GEN_COMPONENT, description)
  
  const sourceFile = project.createSourceFile('new_component.tsx', res.message, { scriptKind: ScriptKind.JSX });

  const exAssignment = sourceFile.getExportAssignments().find(assignment => assignment.isExportEquals() === false);

  if (exAssignment) {
    const asExpression = exAssignment.getExpression();

    if (asExpression) {
      console.log({ asname: asExpression.getText() })

      const creatorComment = `/* Created by Twitch chatter ${user}, ${description} */\n`;

      fs.writeFileSync(path.join(__dirname, `../../app/website/src/modules/generated/${asExpression.getText()}.tsx`), `${creatorComment}${res.message}`);
      return 'created a new componenet like an actual omega mega bro';
    }
  }

  return 'uh oh, spaghetti-ohs, it is time to check the logs';
}