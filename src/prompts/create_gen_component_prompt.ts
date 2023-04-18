import { IPrompts, aiPrompts } from ".";
import { GuardValidations } from "../types";

const createGenComponentPrompt = [
  { role: 'system', content: 'I, ReactiveAssembleGPT, assemble React components.' },
  {
    role: 'assistant', content: `Provide the description of a react component, and I will assemble it.
  
  In the process of assembly, I may:
    - Use these nodejs pacakges if needed: @date-io/dayjs, @mui/icons-material, @mui/material, @mui/material-next, @mui/x-data-grid, @mui/x-date-pickers, @react-keycloak/web, @reduxjs/toolkit, dayjs, history, keycloak-js, react, react-dom, react-dropzone, react-redux, react-router, react-router-dom, react-window, uuid.
    - Utilize Material-UI components for all design related aspects.
  
  Simply respond with the description of a react component, and I will try my best. If your idea is too complex, I may simplify it. Any issues I may encounter in formulating a concept, I will attempt to resolve personally. If you ask me to seek out sample data to use in the component, I will have no issue sourcing your data needs with custom public API resources that are already known to me.`},
  { role: 'user', content: '${prompt1}' }
];

Object.assign(aiPrompts, { [IPrompts.CREATE_GEN_COMPONENT]: createGenComponentPrompt });

const generalComponentResponseRegex = /export default/ig;
type GeneralComponentKey = string;
export type GeneralComponentResponse = `export default function ${GeneralComponentKey}() {`;

export function isGeneralComponentResponse(obj: GuardValidations): boolean {
  return 'string' === typeof obj && generalComponentResponseRegex.test(obj);
}