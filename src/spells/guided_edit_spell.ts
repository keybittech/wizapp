import { FunctionDeclaration, SyntaxKind, Node, Project } from 'ts-morph';

import { useAi } from './use_ai_spell';
import { GuidedEditKeys, GuidedEditResponse, IPrompts } from '../prompts';
import { prepareBranch, pushCommit, managePullRequest } from '../git';
import { getConfig } from '../config';

function getStatementText(child: Node) {
  let parsedStatementText = child.getText();
if (child.getLeadingCommentRanges()?.length) {
  const leadingComments = child.getLeadingCommentRanges()?.reduce((s, c) => s + c.getText(), '') as string;
  parsedStatementText = `${leadingComments}\n${parsedStatementText}`;
}
  const parent = child.getParent();

  if (child.getKind() == SyntaxKind.VariableDeclaration && parent instanceof Node) {
    parsedStatementText = parent.getText();
  }
  return parsedStatementText;
}

const ignoredStatements = [SyntaxKind.TryStatement]

function walkNode(child: Node, i: number, parsedStatements: Record<string, string>, originalStatements: Map<string, string>) {
  const statementName = `statement_${i}`;
  if (child instanceof FunctionDeclaration) {
    child.getStatements().forEach((descendant, index) => {
      walkNode(descendant, index + i, parsedStatements, originalStatements);
    })
  } else if (!ignoredStatements.includes(child.getKind())) {
    parsedStatements[statementName] = getStatementText(child);
    originalStatements.set(statementName, getStatementText(child));
  }
}

export async function guidedEdit(fileParts: string, editingUser?: string) {
  
  const config = getConfig();
  if (!config.ts.configPath) {
    throw new Error('Missing ts.configPath.')
  }
  const project = new Project({
    tsConfigFilePath: config.ts.configPath
  });

  const [fileName, ...suggestedEdits] = fileParts.split(' ');
  const suggestions = suggestedEdits.join(' ');

  const generatedBranch = await prepareBranch(editingUser || config.user.name);

  const sourceFile = project.getSourceFiles().filter(sf => sf.getFilePath().toLowerCase().includes(fileName.toLowerCase()))[0];

  if (sourceFile) {

    if (sourceFile.getText().length > 10000) {
      return 'the file is too large';
    }

    const originalStatements: Map<string, string> = new Map();
    const parsedStatements: Record<string, string> = {};

    sourceFile.getStatements().forEach((statement, index) => {
      walkNode(statement, index, parsedStatements, originalStatements);
    });

    sourceFile.getFullText().split('\n').forEach(line => {
      if (line.match(/\/\/|\/\*/)) {
        const commentBody = line.replace(/.*?(\/\*|\/\/)/, '').trim();
        
        if (commentBody) {
          const previousStatementIndex = Object.keys(parsedStatements).length;
          parsedStatements[`statement_${previousStatementIndex + 1}`] = commentBody
        }
      }
    })

    const res = await useAi<GuidedEditResponse>(IPrompts.GUIDED_EDIT, suggestions, JSON.stringify(parsedStatements));
    
    const generatedStatements = res.message.reduce((m, d) => ({ ...m, ...d }), {});

    let fileContent = sourceFile.getFullText();
    let fileModified = false;

    Object.keys(generatedStatements).forEach(statementKey => {
      const stKey = statementKey as GuidedEditKeys;
      if (['new_statement', 'newstatement', `statement_${originalStatements.size + 1}`].includes(stKey)) {
        fileContent += `\n${generatedStatements[stKey]} // generated by ${editingUser || config.user.name}`;
        fileModified = true;
      } else if ([/above_\d{1,2}/, /below_\d{1,2}/].some(regex => regex.test(stKey))) {
        const [direction, index] = stKey.split('_');
        const adjacentStatement = originalStatements.get(`statement_${index}`);
        
        if (adjacentStatement) {
          let adjacentStart = fileContent.indexOf(adjacentStatement);
          let adjacentEnd = adjacentStart + adjacentStatement.length;

          if ('above' == direction) {
            fileContent = fileContent.substring(0, adjacentStart) + '\n' + generatedStatements[stKey] + fileContent.substring(adjacentStart);
            adjacentStart = fileContent.indexOf(adjacentStatement);
            adjacentEnd = adjacentStart + adjacentStatement.length;          
          } else {
            fileContent = fileContent.substring(0, adjacentEnd) + '\n' + generatedStatements[stKey] + fileContent.substring(adjacentEnd);
          }          

          fileModified = true;
        }

      } else {
        const originalStatement = originalStatements.get(stKey);

        if (originalStatement) {
          const originalIndex = fileContent.indexOf(originalStatement);

          if (originalIndex >= 0 && originalStatement !== generatedStatements[stKey]) {
            fileContent = fileContent.substring(0, originalIndex) + generatedStatements[stKey] + fileContent.substring(originalIndex + originalStatement.length);
            fileModified = true;
          }
        }
      }
    });

    if (fileModified) {
      // const projectDiffPath = path.resolve('~/code/project_diff');
      // const apiPath = path.join(projectDiffPath, 'api');
      // const tsConfigFilePath = path.join(apiPath, 'projectts.json');
      // const tsConfigFile = ts.readConfigFile(tsConfigFilePath, ts.sys.readFile);
      // const configParseResult = ts.parseJsonConfigFileContent(tsConfigFile.config, ts.sys, apiPath)
      // const testFile = ts.createSourceFile('temp.ts', fileContent, ts.ScriptTarget.ES2016, true);
      // const testProgram = ts.createProgram([testFile.fileName], configParseResult.options)
      // const diagnostics = ts.getPreEmitDiagnostics(testProgram);

      // if (diagnostics.length > 0) {
      //   console.log('Diagnostic errors:');
      //   diagnostics.forEach(diagnostic => {
      //     const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n');
      //     console.log(`${diagnostic.file?.fileName} (${diagnostic.start}): ${message}`);
      //   })
      //   return 'you really did it now, no code, no show, no turkey';
      // } else {

      // console.log('Makin it pretty')
      // try {
      //   fileContent = prettier.format(fileContent, {
      //     parser: 'typescript',
      //     tabWidth: 2,
      //     useTabs: false
      //   });
      // } catch (error) { }

      sourceFile.removeText();
      sourceFile.insertText(0, fileContent);
      sourceFile.saveSync();
      await project.save();

      const sourceFilePath = sourceFile.getFilePath().toString();
      await pushCommit(sourceFilePath, generatedBranch, `${editingUser || config.user.name} - ${suggestions}`);

      const prTitle = `${editingUser || config.user.name} edited ${fileName}: ${suggestions.replace(/[~^:?"*\[\]@{}\\/]+/g, '')}`.slice(0, 255);
      const prBody = `GPT: ${res.supportingText || 'No supporting text found.'}`.replaceAll('"', '');
      return await managePullRequest(generatedBranch, prTitle, prBody);

    } else {
      return 'guided edit produced no modifications for ' + fileName;
    }
  }

  return 'file not found: ' + fileName;
}