// import fs from 'fs';
// import { Node, Project, ScriptKind, SyntaxKind } from 'ts-morph';

import { useAi } from './use_ai_spell';
import { IPrompts } from '../prompts';
import { getConfig } from '../config';
// import { getPathOf, sanitizeName } from '../util';
import { FileEditorResponse } from '../prompts/file_editor_prompt';
import { getTargetFile } from '../util';

export async function fileEditor(...fileParts: string[]) {

  console.log({ fileParts });
  
  const config = getConfig();
  if (!config.ts.compDir) {
    throw new Error('Missing ts.compDir.')
  }

  if (!config.ts.configPath) {
    throw new Error('Missing ts.configPath.')
  }

  const [fileName, ...suggestedEdits] = fileParts;

  const originalFileContents = getTargetFile(fileName, config.git.rootPath);

  if (!originalFileContents) throw 'File not found.';

  const lined = originalFileContents.split('\n').map((l, i) => `${i + 1}. ${l}`).join('\n');

  console.log({ lined, fileName, suggestedEdits });

  await useAi<FileEditorResponse>(IPrompts.FILE_EDITOR, fileName, suggestedEdits.join(' '), lined);
  
  // console.log({ EDITOR_FINISHED: true })

  // const sourceFile = project.createSourceFile('new_component.tsx', res.message, { scriptKind: ScriptKind.JSX });

  
  // let componentName;
  // const exportedDeclarations = sourceFile.getExportedDeclarations().get('default');
  // if (exportedDeclarations) {
  //   const declaration = exportedDeclarations[0];
  //   if (Node.isVariableDeclaration(declaration)) {
  //     const initializer = declaration.getInitializer();
  //     if (initializer?.getKind() === SyntaxKind.FunctionExpression || initializer?.getKind() === SyntaxKind.ArrowFunction) {
  //       componentName = declaration.getName();
  //     }
  //   } else if (Node.isFunctionDeclaration(declaration)) {
  //     componentName = declaration.getName();
  //   }
  // }

  // if (componentName) {
  //   const creatorComment = `/* Created by ${user || config.user.name}, ${description} */\n`;
  //   const coreCompsPath = sanitizeName(config.ts.compDir);
  //   const compFilePath = getPathOf(`${coreCompsPath}/${componentName}.tsx`);
    
  //   if (!fs.existsSync(coreCompsPath)) {
  //     fs.mkdirSync(coreCompsPath, { recursive: true });
  //   }

  //   fs.writeFileSync(compFilePath, `${creatorComment}${res.message}`);
  //   return 'created a new component';
  // }

  return 'end of file editor ';
}