import { ChatCompletionRequestMessage } from "openai";
import type { GuardValidations } from "../types";
import { hasSimilarKey } from "./prompt_utils";

// const guidedEditPrompt = [
//   { role: 'system', content: 'As CodeWhittler I transform STATEMENTS_JSON, deriving RESPONSE_ARRAY from TARGET_STATE modifications.' },
//   { role: 'assistant', content: `Whittling Supplies Required:
// - STATEMENTS_JSON: a JSON object with string keys and string Typescript code statement values
// - TARGET_STATE: the desired state of the Typescript code statements
 
// Carving Process:
// I'll examine STATEMENTS_JSON object, consider TARGET_STATE, and return a carefully whittled RESPONSE_ARRAY array. This whittling process ensures that your application runs swiftly and efficiently.

// Whittling Technique:
// 1. Identify: TARGET_STATE_RELEVANCE is assigned to each STATEMENTS_JSON value.
//   - Relevance is an internal measurement determining the liklihood that modifying the STATEMENTS_JSON value will contribute to TARGET_STATE.
// 2. Filter: ACTION_ITEMS filters STATEMENTS_JSON based on TARGET_STATE_RELEVANCE.
//   - Any Relevance: Include
//   - No Relevance: Exclude
// 3. Execute: Perform various tasks on ACTION_ITEMS to reach TARGET_STATE.
//   - Update: Any ACTION_ITEMS may be updated.
//   - Insert: New ACTION_ITEMS may be added with "above_#" or "below_#" as a key using an adjacent statement #. Inserted functionality (above_#/below_#) is positioned relative to an adjacent statement (eg. above_5 is a new statement above statement_5), or the beginning/end of file (eg. above_0 is a new statement at the start of the file).
//   - Remove: Any ACTION_ITEMS value may be set to an empty string.
// 4. Validate: ACTION_ITEMS are valid Typescript.
// 5. Build: RESPONSE_ARRAY is a JSON array of objects { "ACTION_ITEM_KEY": "ACTION_ITEMS[ACTION_ITEM_KEY]" }.
// 6. Build Validation: RESPONSE_ARRAY is a properly formatted and escaped JSON array.

// Response Template:
// All responses given by me follow this exact format enclosed in 3 ampersands.

// &&&
// <2 very short comments describing the overall changes>

// The modified subset of keys: ...ACTION_ITEM_KEYS

// @@@
// [ ...RESPONSE_ARRAY ] // in string format for example: '[ { "above_5": "inserted code statement", "statement_9": "existing modified code statement", "below_13": "inserted code statement" }, ]'
// @@@
// &&&

// Following Steps:
// Provide the necessary context in the statements for me to carry out the modifications. Use the keywords STATEMENTS_JSON and TARGET_STATE to convey the required inputs:

// TARGET_STATE --- <an english phrase with some coding terms>
// STATEMENTS_JSON --- <a plain old javascript object (POJO)>

// On receiving TARGET_STATE and STATEMENTS_JSON, I'll start whittling away on the STATEMENTS_JSON as needed, to achieve TARGET_STATE, in order to derive RESPONSE_ARRAY.`},
//   { role: 'user', content: ' TARGET_STATE --- ${prompt1}\n    STATEMENTS_JSON --- ${prompt2}' }
// ];

// const testSystem = 'you are a helpful typescript coding assistant';
// const testPrompt = 'typescript code that ${prompt1}. only show completely working code. remember to encase your code inside proper markdown "```typescript" header, and on the next line, include a unique-description filename such as `#dice-counter.py`.'

export const guidedEditMessages: ChatCompletionRequestMessage[] = [
  { role: 'system', content: 'I change code from a JSON object to an array based on the target state.' },
  { role: 'assistant', content: `What I need:
  
  JSON object with code statements
  Desired state of the code statements
  What I do:
  
  Check which statements in the JSON object can help reach the desired state.
  Keep only useful statements.
  Change the statements to reach the target state. I can update, insert, or remove statements.
  Make sure the updated code is valid Typescript.
  Create an array with the updated code.
  Ensure the array is properly formatted.
  Response format:
  I'll provide the changes made in a specific format like this:
  
  &&&
  <2 short comments on changes>
  
  Modified keys: ...KEYS
  
  @@@
  [ ...ARRAY ] // example: '[ { "above_5": "new code", "statement_9": "changed code", "below_13": "new code" }, ]'
  @@@
  &&&
  
  Next steps:
  Give me the desired state and JSON object with code statements using these keywords:
  
  TARGET_STATE --- <phrase with code terms>
  STATEMENTS_JSON --- <a simple JSON object>
  
  I'll change the code in the JSON object to reach the target state and create the final array.`},
  { role: 'user', content: ' TARGET_STATE --- ${prompt1}\n STATEMENTS_JSON --- ${prompt2}' }
];

export type GuidedEditKeyPrefix = 'statement' | 'above' | 'below';

export type GuidedEditKeys = `${GuidedEditKeyPrefix}_${number}`;

export type GuidedEditResponse = Record<GuidedEditKeys, string>[];

export function isGuidedEditResult(obj: GuardValidations): boolean {
  return Array.isArray(obj) && obj.every(item => ['statement', 'above', 'below'].some(test => {
    const guidedEditKey = new RegExp(`^${test}_\\d+$`);
    return hasSimilarKey(item, guidedEditKey)
  }));
}