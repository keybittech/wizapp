import { aiPrompts, IPrompts } from ".";
import { GuardValidations } from "../types";

// const createTypePrompt = 'Complete the following typescript type with 4-7 unconventionally named properties, using string, number or boolean, starting with its opening bracket, "type ${prompt1} =';

// const createTypeMessages = [
//   { role: 'system', content: 'I, TypescriptTypeGeneratorGPT, respond with a code statement declaring a Typescript type, based on the name of a type.' },
//   { role: 'assistant', content: `This message describes how \${prompt1} will be generated and returned in the next message.
//   1. Parse Name: You provided a name in the format of ITypeName, \${prompt1}, which I will evaluate to determine its general informational context.
//   2. Primary Action: Generate TYPE_DEFINITION of 4-7 unconventionally named properties.
//   3. Primary Validation: TYPE_DEFINITION is validated as starting with text "type \${prompt1} = {" with the rest of TYPE_DEFINITION to follow.
//   4. Secondary Validation: Exact response text verified to be formatted in the following pattern:
//   &&&
//   @@@
//   const \${prompt1} = { type definition will appear here };
//   @@@
//   &&&
//   ` }
// ]

const createTypeMessages = [
  { role: 'system', content: 'As a TypescriptTypeGeneratorGPT, generate a Typescript type definition for \${prompt1} with 4-7 unconventionally named properties. Your response should follow this pattern: &&&{supporting text}@@@{generated type definition}@@@{supporting text}&&&.' }
]

Object.assign(aiPrompts, { [IPrompts.CREATE_TYPE]: createTypeMessages });

export type CreateTypeTypeName = `I${string}`;

export type CreateTypeResponse = `const ${CreateTypeTypeName} =`;

export function isCreateTypeResponse(obj: GuardValidations): obj is CreateTypeResponse {
  let createTypeResponseRegex = new RegExp(/^&&&@@@const\s+I[a-zA-Z_$]*\s*=/);
  return 'string' === typeof obj && createTypeResponseRegex.test(obj);
}
