// declare module 'abstract-syntax-tree' {
//   export type NodeType =
//     | 'Program'
//     | 'FunctionDeclaration'
//     | 'VariableDeclaration'
//     | 'ExpressionStatement'
//     | 'CallExpression'
//     | 'Identifier'
//     | 'Literal'
//     | 'BinaryExpression'
//     | 'ArrayExpression'
//     | 'ObjectExpression'
//     | 'Property'
//     | 'AssignmentExpression'
//     | 'MemberExpression'
//     | 'ThisExpression'
//     | 'BlockStatement'
//     | 'IfStatement'
//     | 'SwitchStatement'
//     | 'SwitchCase'
//     | 'ForStatement'
//     | 'WhileStatement'
//     | 'DoWhileStatement'
//     | 'BreakStatement'
//     | 'ContinueStatement'
//     | 'TryStatement'
//     | 'CatchClause'
//     | 'ThrowStatement'
//     | 'ReturnStatement'
//     | 'UnaryExpression'
//     | 'UpdateExpression'
//     | 'LogicalExpression'
//     | 'ConditionalExpression'
//     | 'NewExpression'
//     | 'ArrowFunctionExpression'
//     | 'YieldExpression'
//     | 'TemplateLiteral'
//     | 'TemplateElement'
//     | 'TaggedTemplateExpression'
//     | 'ClassDeclaration'
//     | 'ClassExpression'
//     | 'ClassBody'
//     | 'MethodDefinition'
//     | 'ImportDeclaration'
//     | 'ImportSpecifier'
//     | 'ExportDefaultDeclaration'
//     | 'ExportNamedDeclaration'
//     | 'ExportSpecifier'
//     | 'ForInStatement'
//     | 'ForOfStatement'
//     | 'AwaitExpression'
//     | 'SpreadElement'
//     | 'RestElement'
//     | 'AssignmentPattern'
//     | 'ArrayPattern'
//     | 'ObjectPattern'
//     | 'MetaProperty'
//     | 'Super'
//     | 'Import'
//     | 'ChainExpression';

//   export interface Node {
//     type: NodeType;
//     loc?: SourceLocation;
//     [key: string]: any;
//   }

//   export interface SourceLocation {
//     start: Position;
//     end: Position;
//     source?: string | null;
//   }

//   export interface Position {
//     line: number;
//     column: number;
//   }

//   export interface ParseOptions {
//     ecmaVersion?: number;
//     sourceType?: 'script' | 'module';
//     locations?: boolean;
//     ranges?: boolean;
//     comment?: boolean;
//   }

//   export function parse(source: string, options?: ParseOptions): Node;

//   export function generate(tree: Node): string;

//   export function walk(tree: Node, callback: (node: Node, parent: Node | null) => void): void;

//   export function find(tree: Node, selector: NodeType | { [key: string]: any }): Node[];

//   export function serialize(node: Node): any;

//   export function traverse(tree: Node, options: { enter?: (node: Node) => void; leave?: (node: Node) => void }): void;

//   export function replace(tree: Node, callback: (node: Node) => Node | null): void;

//   export function remove(tree: Node, selector: NodeType | { [key: string]: any } | ((node: Node) => Node | null)): void;

//   export function each(tree: Node, selector: NodeType, callback: (node: Node) => void): void;

//   export function first(tree: Node, selector: NodeType): Node | undefined;

//   export function last(tree: Node, selector: NodeType): Node | undefined;

//   export function reduce(tree: Node, callback: (accumulator: any, node: Node) => any, accumulator: any): any;

//   export function has(tree: Node, selector: NodeType | { [key: string]: any }): boolean;

//   export function count(tree: Node, selector: NodeType | { [key: string]: any }): number;

//   export function append(tree: Node, node: Node | string): void;

//   export function prepend(tree: Node, node: Node | string): void;

//   export function equal(node1: Node, node2: Node): boolean;

//   export function match(node: Node, selector: string): boolean;

//   export function template(templateString: string, replacements?: { [key: string]: any }): Node[];

//   export function program(): Node;

//   export function iife(): Node;
// }