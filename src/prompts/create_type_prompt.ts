import { aiPrompts, IPrompts } from ".";

const createTypePrompt = 'Complete the following typescript type with 4-7 unconventionally named properties, using string, number or boolean, starting with its opening bracket, "type ${prompt1} =';

Object.assign(aiPrompts, { [IPrompts.CREATE_TYPE]: createTypePrompt });
