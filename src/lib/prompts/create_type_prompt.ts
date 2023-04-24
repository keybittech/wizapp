
import { ChatCompletionRequestMessage } from "openai";
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

export const createTypeMessages: ChatCompletionRequestMessage[] = [
  { role: 'system', content: 'As a TypescriptTypeGeneratorGPT, generate a Typescript type definition for ${prompt1}.' },
  { role: 'assistant', content: `Internal Process:
  1. Generate: 4-7 uncommon English-language attribute names. 
  2. Format: Your response is formatted in the following enclosed structure:
  &&&
  {supporting text}
  @@@
  type \${prompt1} = {generated type definition}
  @@@
  {left intentionally blank}
  &&&
  3. Validation: Response structure is re-validated to adhere to the formatting of step 2.`}
];

export type CreateTypeTypeName = `I${string}`;

export type CreateTypeResponse = `type ${CreateTypeTypeName} =`;

export function isCreateTypeResponse(obj: GuardValidations): boolean {
  let createTypeResponseRegex = new RegExp(/type\s+I\w+\s*=\s*\{/gm);
  return 'string' === typeof obj && createTypeResponseRegex.test(obj);
}
