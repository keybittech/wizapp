import { IPrompts, aiPrompts, getSuggestionPrompt, generateExample } from ".";

const suggestRolePrompt = `${getSuggestionPrompt('role names for a group named ${prompt1} which is interested in ${prompt2}')}
${generateExample('role names for a group named writing center which is interested in consulting on writing', 'Tutor|Student|Advisor|Administrator|Consultant')}
${generateExample('role names for a group named city maintenance department which is interested in maintaining the facilities in the city', 'Dispatcher|Engineer|Administrator|Technician|Manager')}
${generateExample('role names for a group named "${prompt1}" which is interested in ${prompt2}')}`

Object.assign(aiPrompts, { [IPrompts.SUGGEST_ROLE]: suggestRolePrompt })