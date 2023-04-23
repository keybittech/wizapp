// import fs from 'fs';
// import { Node, Project, ScriptKind, SyntaxKind } from 'ts-morph';

import { useAi } from '../spells/use_ai_spell.js';
import { IPrompts } from '../prompts/prompts.js';
import { getConfig } from '../config.js';
import { getTargetFile, saveTargetFile } from '../util.js';
import { FileEditorResponse } from '../prompts/file_editor_prompt.js';
// import { getPathOf, sanitizeName } from '../util';
// import { copyContentsToDocker } from '../tree/docker';

export async function fileEditor(...fileParts: string[]): Promise<string> {

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

  const lined = originalFileContents.split('\n').map((l, i) => `${i + 1}. ${l}`);

  console.log({ lined, fileName, suggestedEdits });

  const response = await useAi<FileEditorResponse>(IPrompts.FILE_EDITOR, fileName, suggestedEdits.join(' '), lined.join('\n'));
  
  console.log({ EDITOR_FINISHED: response.message });

  const editedLines: Record<string, string> = response.message.split('\n').reduce((m, d) => {
    const match = d.match(/^\d+. /);
    if (match) {
      console.log({ match })
      return ({
        ...m,
        [match[0].trim()]: d.slice(match[0].length)
      })
    }
    return { ...m };
  }, {});

  const regex = /\/\*\s*change:.*?\*\//gs;

  const editedFile = lined.map(l => {
    const match = l.match(/^\d+. /);
    const key = match && match[0].trim();
    const edit = key && editedLines[key as keyof typeof editedLines];
    if (edit) {
      return edit.replace(regex, ''); 
    }
    return l.slice(match?match[0].length:0);
  }).filter(l => l?.length > 0).join('\n');

  console.log({ lined, editedLines, editedFile, editNum: Object.keys(editedLines).length });

  const saved = saveTargetFile(fileName, editedFile);

  return saved;
}