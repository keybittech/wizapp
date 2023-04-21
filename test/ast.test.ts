// Import the required package
import Parser from 'tree-sitter';
import { Grammars } from '../src';
import { getGrammarPatterns } from '../src/tree/ast';

// Test suite
describe('Tree-sitter Python Grammar', () => {
  const sourceCode = 'def hello_world():\n  print("Hello, World!")';
  let Python: Grammars;

  beforeEach(async () => {
    const { default: parser } = await import('tree-sitter-python');
    Python = parser;
  })

  // Test for importing tree-sitter and tree-sitter-python
  test('should import tree-sitter and tree-sitter-python', async () => {
    expect(Parser).toBeDefined();
    expect(Python).toBeDefined();
  });

  // Test for pulling the grammars
  test('should pull grammars from tree-sitter-python', async () => {
    const parser = new Parser();
    parser.setLanguage(Python);

    const tree = parser.parse(sourceCode);

    expect(tree).toBeDefined();
    expect(tree.rootNode.type).toBe('module');
  });

  // Test for storing grammar keys in a string array
  test('should store grammar keys in a string array', async () => {
    const patterns = Python.nodeTypeInfo.flatMap(getGrammarPatterns);
    expect(patterns).toBeInstanceOf(Array);
  });

  // Test for storing grammar keys in a string array
  test('should linearize a grammar node', async () => {

    const patterns = Python.nodeTypeInfo.flatMap(getGrammarPatterns);
    expect(patterns).toBeInstanceOf(Array);

  });
});