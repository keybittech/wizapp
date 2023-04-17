import { FunctionDeclaration, SyntaxKind, Node, Project } from 'ts-morph';

import { useAi } from './use_ai_spell';
import { GuidedEditKeys, GuidedEditResponse, IPrompts } from '../prompts';
import { prepareBranch, pushCommit, managePullRequest, goHome } from '../git';
import { getConfig } from '../config';

function getStatementText(child: Node) {
  const ignoredStatements = [SyntaxKind.TryStatement]
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

  sourceFile.getStatements().forEach((statement, index) => {
  walkNode(statement, index, parsedStatements, originalStatements);
  if (statement instanceof FunctionDeclaration) {
    const signature = statement.getSignature().getDeclarationSignature()
    if (signature != null) {
      parsedStatements[`signature_${index + 1}`] = signature;  // store only the signature
    }
    parsedStatements[`statement_${index + 1}`] = statement.getText();
  }
});

  return 'file not found: ' + fileName;
}