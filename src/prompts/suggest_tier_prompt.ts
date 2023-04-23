import { generateExample, getSuggestionPrompt } from "../util.js";


export const suggestTierPrompt = `${getSuggestionPrompt('service level names for ${prompt1}')}
${generateExample('service level names for a generic service', 'Small|Medium|Large')}
${generateExample('service level names for writing tutoring at a school writing center', 'WRI 1010|WRI 1020|WRI 2010|WRI 2020|WRI 3010')}
${generateExample('service level names for streaming at a web media platform', 'Basic|Standard|Premium')}
${generateExample('service level names for advising at a school learning center', 'ENG 1010|WRI 1010|MAT 1010|SCI 1010|HIS 1010')}
${generateExample('service level names for travelling on an airline service', 'Economy|Business|First Class')}
${generateExample('service level names for reading tutoring at a school reading center', 'ESL 900|ESL 990|ENG 1010|ENG 1020|ENG 2010')}
${generateExample('service level names for ${prompt1}')}`;
