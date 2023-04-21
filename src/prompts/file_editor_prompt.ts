import { IPrompts, aiPrompts } from ".";
import { GuardValidations } from "../types";

const fileEditorPrompt = [
  { role: 'system', content: 'you are a helpful file editing assistant' },
  { role: 'user', content: 'edit ${prompt1} with regard to ${prompt2}. only show edited lines. remember to encase the edited code inside proper markdown "```" header. \n\n ${prompt1}:\n${prompt3}' }
];

console.log({ fileEditorPrompt });

const changeViewerPrompt = [
  { role: 'system', content: 'You edit line contents with new text or setting text to empty strings. Do not add or remove line numbers. Do not show unedited lines.' },
  // { role: 'system', content: 'You reply with: "I only edited line {number of each edited line}, so I am just going to show you {number of edited lines} lines, including empty lines:"' },
  { role: 'user', content: `add_content_to_a_single_line.txt

put a happy face on line 4

1. Lorem ipsum dolor sit amet.
2. Lorem ipsum dolor sit amet.
3. Lorem ipsum dolor sit amet.
4. Lorem ipsum dolor sit amet.
5. Lorem ipsum dolor sit amet.
6. Lorem ipsum dolor sit amet.
7. Lorem ipsum dolor sit amet.`},
  { role: 'assistant', content: `I edited line 4, which is 1 total edited line. Here is the 1 edited line:  
\`\`\`
4. Lorem ipsum dolor sit amet. :)
\`\`\``},
  { role: 'user', content: `remove_and_edit_content_from_various_lines.js

remove the console logs and change ts.configPath to ts.configRoot

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
  { role: 'assistant', content: `I edited lines 3, 7, 8, and 9, which is 4 total edited lines. Here are the 4 lines:
\`\`\`
3. 
7. if (!config.ts.configRoot) {
8.   
9.   throw new Error('Missing ts.configRoot.')
\`\`\`` },
  { role: 'user', content: `\${prompt1}

\${prompt2}

\${prompt3}`}
];

console.log({ changeViewerPrompt });

// const testSystem = 'you are a helpful typescript coding assistant';
// const testPrompt = 'typescript code that ${prompt1}. only show completely working code. remember to encase your code inside proper markdown "```typescript" header, and on the next line, include a unique-description filename such as `#dice-counter.py`.'

Object.assign(aiPrompts, { [IPrompts.FILE_EDITOR]: changeViewerPrompt });

const fileEditorResponseRegex = /^\d+./igm;
export type FileEditorResponse = `${number}. ${string}`;

export function isFileEditorResult(obj: GuardValidations): boolean {
  return 'string' === typeof obj && fileEditorResponseRegex.test(obj);
}