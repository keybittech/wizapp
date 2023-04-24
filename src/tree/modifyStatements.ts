// import fs from 'fs';
import type { Node, Statements } from '../lib/types';
// import { parseFile } from './getStatements';

export function modifyStatements(
  node: Node,
  modifications: (statement: Statements) => Statements | null
): Node | null {
  // Modify, add or delete statements based on modifications function
  const statement = { type: node.type, text: node.text };
  const modifiedStatement = modifications(statement);
  if (modifiedStatement) {
    node.text = modifiedStatement.text;
  } else {
    return null;
  }

  node.children = node.children
    .map((child) => modifyStatements(child, modifications))
    .filter((child) => child !== null) as Node[];

  return node;
}

// export async function modifyStatementsInFile(
//   modifications: (statement: Statements) => Statements | null
// ): Promise<string> {
//   const files = fs.readdirSync('../files');
//   const modificationFileName = files.find(f => f.startsWith('modifications'));



//   const root = await parseFile();
//   const modifiedRoot = modifyStatements(root.rootNode, modifications);
//   // Serialize the modified AST back to the source code
//   // You can use a library like "ast-pretty-print" or write your own serialization function
//   const modifiedCode = serializeAstToCode(modifiedRoot);
//   return modifiedCode;
// }