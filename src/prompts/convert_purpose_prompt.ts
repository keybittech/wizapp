import { IPrompts, aiPrompts } from ".";

const convertPurposePrompt = 'Complete the following statement: A 50 character maximum passive gerund mission statement for a business named "${prompt1}" with the description of "${prompt2}", could be ';

Object.assign(aiPrompts, { [IPrompts.CONVERT_PURPOSE]: convertPurposePrompt });