import { generateExample, getSuggestionPrompt } from "../util";

export const suggestFeatureMessages = `${getSuggestionPrompt('features of ${prompt1}')}
${generateExample('features of ENGL 1010 writing tutoring', 'Feedback|Revisions|Brainstorming|Discussion')}
${generateExample('features of Standard gym membership', 'Full Gym Equipment|Limited Training|Half-Day Access')}
${generateExample('features of Pro web hosting service', 'Unlimited Sites|Unlimited Storage|1TB Bandwidth|Daily Backups')}
${generateExample('features of professional photography service', 'Next-Day Prints|High-quality digital photos|Retouching and editing|Choice of location|Choice of outfit changes')}
${generateExample('features of ${prompt1}')}`;


