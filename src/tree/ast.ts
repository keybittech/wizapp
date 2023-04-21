import { Grammar } from "../types";

// export const syntacticGroupPatterns = [
//   /_statement$/,          // e.g., if_statement, for_statement, while_statement
//   /_declaration$/,        // e.g., variable_declaration, function_declaration
//   /_definition$/,         // e.g., class_definition, function_definition
//   /_assignment$/,         // e.g., assignment, augmented_assignment
//   /_expression$/,         // e.g., call_expression, binary_expression
//   /_clause$/,             // e.g., case_clause, when_clause
//   /_specifier$/,          // e.g., storage_specifier, type_specifier
//   /_declarator$/,         // e.g., variable_declarator, function_declarator
//   /_item$/,               // e.g., struct_item, enum_item
//   /_pattern$/,            // e.g., tuple_pattern, list_pattern
//   /_literal$/,            // e.g., string_literal, number_literal
//   /_specifier$/,          // e.g., import_specifier, export_specifier
//   /_directive$/,          // e.g., preprocessor_directive, import_directive
//   /_modifier$/,           // e.g., access_modifier, type_modifier
//   /_command$/,            // e.g., pipeline_command, simple_command
//   /_parameter$/,          // e.g., function_parameter, lambda_parameter
//   /_attribute$/,          // e.g., html_attribute, xml_attribute
//   /_tag$/,                // e.g., html_tag, xml_tag
//   /_rule$/,               // e.g., grammar_rule, rewrite_rule
//   /_production$/,         // e.g., grammar_production, nonterminal_production
//   /_label$/,              // e.g., goto_label, case_label
//   /_constructor$/,        // e.g., record_constructor, object_constructor
//   /_binding$/,            // e.g., let_binding, pattern_binding
//   /_condition$/,          // e.g., switch_condition, guard_condition
//   // Add other patterns as needed
// ];

const syntacticGroupPatterns = [
  /_declaration$/, // Variable, function, class, or module declarations
  /_definition$/, // Variable, function, class, or module definitions
  /_statement$/, // Statements like if, while, for, return, etc.
  /_import$/,
  /_class$/,
  /_function$/
  // /_expression$/, // Expressions like assignment, arithmetic, or function call expressions
];

const disallowedSubGroupPatterns = [
  /export/,
  /empty/,
  /except_clause$/
];

function matchesPatterns(nodeType: string) {
  return syntacticGroupPatterns.some(p => p.test(nodeType)) && disallowedSubGroupPatterns.every(p => !p.test(nodeType));
}

// Modified recursive function to process the AST nodes and return an array of matching nodes
export function getGrammarPatterns(node: Grammar): string[] {
  let matchingNodes: string[] = [];

  if (matchesPatterns(node.type)) {
    console.log(`Found node of type: ${node.type}`);
    if (!matchingNodes.includes(node.type)) {
      matchingNodes.push(node.type); // Add the matching node to the array
    }
  }

  if (node.children) {
    for (const child of node.children.types) {
      getGrammarPatterns(child).forEach(p => {
        if (!matchingNodes.includes(p)) {
          matchingNodes.push(p);
        }
      });
    }
  }

  return matchingNodes;
}

// function linearizeTree(tree) {
//   const linearized = [];
//   const stack: = [];

//   function extractNodeInfo(node) {
//     const type = node.type;
//     const named = node.named;
//     const children = node.subtypes || node.children?.types || [];

//     const content = {
//       fields: node.fields,
//     };

//     return { type, named, children, content };
//   }

//   function traverse(node: Grammar) {
//     const { type, named, content, children } = extractNodeInfo(node);

//     // Create an object representing the current node
//     const obj = {
//       type,
//       named,
//       content,
//       parent: stack.length > 0 ? stack[stack.length - 1] : null
//     };

//     if (children.length === 0) {
//       // Add leaf nodes to the linearized array
//       linearized.push(obj);
//     } else {
//       // Push the current node onto the stack and process its children
//       stack.push(obj);
//       children.forEach(traverse);
//       stack.pop();
//     }
//   }

//   traverse(tree);
//   return linearized;
// }