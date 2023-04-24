import { ChatCompletionRequestMessage } from "openai";
import { GuardValidations } from "../types";

// const fileEditorPrompt = [
//   { role: 'system', content: 'you are a helpful file editing assistant' },
//   { role: 'user', content: 'edit ${prompt1} with regard to ${prompt2}. only show edited lines. remember to encase the edited code inside proper markdown "```" header. \n\n ${prompt1}:\n${prompt3}' }
// ];

export const fileEditorMessages: ChatCompletionRequestMessage[] = [
  { role: 'system', content: 'You, CodeCommenter, follow user instructions to add, edit, and delete text in specific ways, leaving change comments. You only reply with the line number + the change comment + the new content of the line. 3 possible static comments: "/* change: added text */", "/* change: edited text */", and "/* change: fully removed text */". Your reply includes only changed lines which have change comments, and clearly formats it in an anonymous markdown backtick block.' },
  // { role: 'system', content: 'You reply with: "I only edited line {number of each edited line}, so I am just going to show you {number of edited lines} lines, including empty lines:"' },
  { role: 'user', content: `add_text_example.txt

instructions: put a happy face on line 4

1. Lorem ipsum dolor sit amet.
2. Lorem ipsum dolor sit amet.
3. Lorem ipsum dolor sit amet.
4. Lorem ipsum dolor sit amet.
5. Lorem ipsum dolor sit amet.
6. Lorem ipsum dolor sit amet.
7. Lorem ipsum dolor sit amet.`},
  { role: 'assistant', content: `1 text change signified: I edited line 4, which is 1 total edited line. Here is the 1 edited line containing a signifier, including its line number:  
\`\`\`
4. Lorem ipsum dolor sit amet. :) /* change: added text */
\`\`\`
Please find the 1 change above this line.`},
  { role: 'user', content: `remove_and_edit_text_example.js

instructions: remove any console logs. change ts.configPath to ts.configRoot

1. const config = getConfig();
2. if (!config.ts.compDir) {
3.   console.log('hey');
4.   throw new Error('Missing ts.compDir.')
5. }
6. 
7. if (!config.ts.configPath) {
8.   console.log('testing removals');
9.   throw new Error('Missing ts.configPath.')
10. }`},
  { role: 'assistant', content: `4 text changes signified: I edited lines 3, 7, 8, and 9, which is 4 total edited lines. Here are the 4 lines containing signifiers, including their line numbers:
\`\`\`
3. /* change: fully removed text */
7. if (!config.ts.configRoot) { /* change: edited text */
8.   /* change: fully removed text */
9.   throw new Error('Missing ts.configRoot.') /* change: edited text */
\`\`\`
Please find the 4 changes above this line.` },
  { role: 'user', content: `\${prompt1}

\${prompt2}

\${prompt3}`}
];

// const testSystem = 'you are a helpful typescript coding assistant';
// const testPrompt = 'typescript code that ${prompt1}. only show completely working code. remember to encase your code inside proper markdown "```typescript" header, and on the next line, include a unique-description filename such as `#dice-counter.py`.'

const fileEditorResponseRegex = /^\d+./igm;
export type FileEditorResponse = `${number}. ${string}`;

export function isFileEditorResult(obj: GuardValidations): boolean {
  return 'string' === typeof obj && fileEditorResponseRegex.test(obj);
}