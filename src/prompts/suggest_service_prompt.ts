import { IPrompts, aiPrompts, getSuggestionPrompt, generateExample } from ".";

const suggestServicePrompt = `${getSuggestionPrompt('gerund verbs performed for the purpose of ${prompt1}')}
${generateExample('gerund verbs performed for the purpose of offering educational services to community college students', 'Tutoring|Advising|Consulting|Instruction|Mentoring')}
${generateExample('gerund verbs performed for the purpose of providing banking services to the local area', 'Accounting|Financing|Securities|Financial Planning|Investing')}
${generateExample('gerund verbs performed for the purpose of ${prompt1}')}`

Object.assign(aiPrompts, { [IPrompts.SUGGEST_SERVICE]: suggestServicePrompt })