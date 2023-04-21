
import TreeSitter, { SyntaxNode, Tree } from 'tree-sitter';
import path from 'path';
import languages from '../languages';
import { getFileFromDir } from '../util';
import { LinearizedStatement } from '../types';
import { getGrammarPatterns } from './ast';
const langValues = Object.values(languages);

export async function getStatements(fileName: string): Promise<LinearizedStatement[]> {
  const extension = path.extname(fileName).slice(1);
  const langParser = langValues.find(lang => lang.fileExtension.includes(extension));
  if (!langParser) throw 'You found an unsupported parser!';

  const imported = await import(langParser.parserName);
  const masterGrammars = langParser.parserVariant ? imported.default[langParser.parserVariant] : imported.default;
  
  const parser = new TreeSitter();
  parser.setLanguage(masterGrammars);
  
  const code = getFileFromDir(fileName);
  const parsed = parser.parse(code);
  const nodeTypes = masterGrammars.nodeTypeInfo.flatMap(getGrammarPatterns);
  walkNode(parsed.rootNode);
  return getNodesOfType(parsed, nodeTypes);
}

export function walkNode(rootNode: SyntaxNode) {

  const linearText: Record<number, string> = {};
  const nodes: SyntaxNode[] = [];

  function innerWalk (node: SyntaxNode) {
    for (const child of node.children) {
      const key = child.startPosition.row;
  
      if (!linearText[key]) {
        linearText[key] = "";
      }
  
      linearText[key] += (linearText[key] ? " " : "") + child.text;
  
      // Recursion for deeper levels
      if (child.children && child.children.length > 0 && !linearText[key].includes(child.children[0].text)) {
        innerWalk(child);
      }
    }
  }

  innerWalk(rootNode)

  return nodes;
}

export function getNodesOfType(rootNode: Tree, nodeTypes: string[]): LinearizedStatement[] {
  
  let nodeIdCounter = 0;
  const usedNodes: Map<string, string> = new Map();
  const nodes: LinearizedStatement[] = [];

  function visitNode(node: SyntaxNode, parentId?: number): void {

    const shouldBeParsed = nodeTypes.includes(node.type);
    if (shouldBeParsed) {
      const nodeId = nodeIdCounter++;
      let content = node.text;

      if (parentId !== undefined) {
        const parentNode = nodes.find(n => n.i === parentId);
        if (parentNode) {
          parentNode.c = parentNode.c.replace(node.text, `XV_${nodeId}`);
        }
      }

      if (!usedNodes.has(node.type)) {
        usedNodes.set(node.type, `XT_${usedNodes.size + 1}`)
      }

      const linearizedStatement: LinearizedStatement = {
        i: nodeId,
        p: parentId,
        t: usedNodes.get(node.type)!,
        c: content.trim(),
      };
      nodes.push(linearizedStatement);

      if (node.type.includes('declaration')) {
        parentId = nodeId;
      }
    }

    for (const child of node.children) {
      visitNode(child, parentId);
    }
  }

  visitNode(rootNode.rootNode);
 
  return nodes;
}

// async function getMasterGrammars({ parserName, parserVariant }: LanguageParser): Promise<Grammars> {

//   const imported = await import(parserName);

//   const masterGrammars = parserVariant ? imported.default[parserVariant] : imported.default;
//   masterGrammars.nodeTypeInfo = extractApprovedTypes(masterGrammars.nodeTypeInfo);

//   // if (parserVariant && isDefaultGrammarVariants(imported)) {
//   //   const grammar = imported.default[parserVariant];
//   //   masterGrammars.nodeTypeInfo = masterGrammars.nodeTypeInfo.concat(extractApprovedTypes(grammar.nodeTypeInfo))
//   // } else if (isDefaultGrammar(imported)) {
//   //   masterGrammars.nodeTypeInfo = masterGrammars.nodeTypeInfo.concat(extractApprovedTypes(imported.default.nodeTypeInfo as Grammar[]));
//   // } else {
//   //   throw 'This file type requires unsupported parsers.'
//   // }

//   return masterGrammars;
// }

// const approvedTypes = ['declaration', 'definition', 'statement', 'expression'];

// export function extractApprovedTypes(nodeInfo: Grammars['nodeTypeInfo']): Grammars['nodeTypeInfo'] {
//   const groupedTypes: Grammars['nodeTypeInfo'] = [];
  
//   nodeInfo.filter(n => approvedTypes.some(at => n.type.indexOf(at) > -1))
//   .flatMap(gt => {
//     return  'subtypes' in gt ? gt.subtypes : undefined;
//   }).forEach(st => {
//     if (st && approvedTypes.some(at => st.type.indexOf(at) > -1)) {
//       groupedTypes.push(st)
//     }
//   });
  
//   return groupedTypes;
// }

// Huffman coding and an adaptation of the Burrows-Wheeler Transform (BWT) for the compression process.
