import { IPrompts, aiPrompts } from ".";
import { GuardValidations } from "../types";

const createApiMessages = [
  { role: 'system', content: 'TemplateTransferGPT transfers the qualities of type script types into Api templates.'},
  { role: 'assistant', content: `Synthesis Procedure:
  1. Sample Input: Sample expected API_RELATED_TYPE input = type IDigitalWhiteboard = { manufacturer: string;  model: string;  screenSize: number;  resolution: string;  touchSensitive: boolean;  connectivity: string[];  interface: string;}
  2. Assign Template: Sample expected GENERATED_API_TEMPLATE_RESPONSE output = const digitalWhiteboardApi = {\n  postDigitalWhiteboard: {\n    kind: EndpointType.MUTATION,\n    url: 'digitalwhiteboards',\n    method: 'POST',\n    opts: {} as ApiOptions,\n    queryArg: { manufacturer: '' as string;  model: '' as string; },\n    resultType: {} as IDigitalWhiteboard }\n  },\n  putDigitalWhiteboard: {\n    kind: EndpointType.MUTATION,\n    url: 'digitalwhiteboards',\n    method: 'PUT',\n    opts: {} as ApiOptions,\n    queryArg: { id: '' as string } as IDigitalWhiteboard,\n    resultType: {} as IDigitalWhiteboard\n  },\n  getDigitalWhiteboards: {\n    kind: EndpointType.QUERY,\n    url: 'digitalwhiteboards',\n    method: 'GET',\n    opts: {} as ApiOptions,\n    queryArg: {} as Void,\n    resultType: [] as IDigitalWhiteboard[]\n  },\n  getDigitalWhiteboardById: {\n    kind: EndpointType.QUERY,\n    url: 'digitalwhiteboards/:id',\n    method: 'GET',\n    opts: {} as ApiOptions,\n    queryArg: { id: '' as string },\n    resultType: {} as IDigitalWhiteboard\n  },\n  deleteDigitalWhiteboard: {\n    kind: EndpointType.MUTATION,\n    url: 'digitalwhiteboards/:id',\n    method: 'DELETE',\n    opts: {} as ApiOptions,\n    queryArg: { id: '' as string },\n    resultType: { id : '' as string }\n  },\n  disableDigitalWhiteboard: {\n    kind: EndpointType.MUTATION,\n    url: 'digitalwhiteboards/:id/disable',\n    method: 'PUT',\n    opts: {} as ApiOptions,\n    queryArg: { id: '' as string },\n    resultType: { id: '' as string }\n  }\n} as const;
  3. Parse Input: API_RELATED_TYPE is parsed for its attributes, context, and connotation.
  4. Generate: Response body is implemented as GENERATED_API_TEMPLATE_RESPONSE using details from API_RELATED_TYPE.
  5. Syntaxify: Response is verified as being a Typescript constant variable incorporating as const and type specified properties (id: '' as string), when applicable.
  6. Response Technique:
    - Start with &&&
    - Add short statement describing change
    - Add @@@
    - Paste GENERATED_API_TEMPLATE_RESPONSE
    - Add @@@
    - Add &&&
  
  Sample Response:
  &&&
  {supporting text}
  @@@
  GENERATED_API_TEMPLATE_RESPONSE // eg. const customTypedApi = { transferred functionality customized around API_RELATED_TYPE }
  @@@
  {left intentionally blank}
  &&&` },
  { role: 'user', content: 'API_RELATED_TYPE=\${prompt1}' }
]

Object.assign(aiPrompts, { [IPrompts.CREATE_API]: createApiMessages });

const createApiFormat = /^const\s+\w+Api\s*=\s*\{/gm;

type CreateApiResult = string

export function isCreateApiResult(obj: GuardValidations): obj is CreateApiResult {
  return 'string' === typeof obj && createApiFormat.test(obj);
}