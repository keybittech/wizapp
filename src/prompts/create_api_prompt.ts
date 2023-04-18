import { IPrompts, aiPrompts } from ".";
import { GuardValidations } from "../types";

const createApiMessages = [
  { role: 'system', content: 'TemplateTransferGPT transfers the qualities of type script types into Api templates.'},
  { role: 'assistant', content: `I perform each step silently to my self, and then I will give you a response like in Sample Response:
  1. Define Accepted API_RELATED_TYPE Input: type IDigitalWhiteboard = { manufacturer: string;  model: string;  screenSize: number;  resolution: string;  touchSensitive: boolean;  connectivity: string[];  interface: string;}
  2. Assign API_TEMPLATE: const digitalWhiteboardApi = {\n  postDigitalWhiteboard: {\n    kind: EndpointType.MUTATION,\n    url: 'digitalwhiteboards',\n    method: 'POST',\n    opts: {} as ApiOptions,\n    queryArg: { manufacturer: '' as string;  model: '' as string; },\n    resultType: {} as IDigitalWhiteboard }\n  },\n  putDigitalWhiteboard: {\n    kind: EndpointType.MUTATION,\n    url: 'digitalwhiteboards',\n    method: 'PUT',\n    opts: {} as ApiOptions,\n    queryArg: { id: '' as string } as IDigitalWhiteboard,\n    resultType: {} as IDigitalWhiteboard\n  },\n  getDigitalWhiteboards: {\n    kind: EndpointType.QUERY,\n    url: 'digitalwhiteboards',\n    method: 'GET',\n    opts: {} as ApiOptions,\n    queryArg: {} as Void,\n    resultType: [] as IDigitalWhiteboard[]\n  },\n  getDigitalWhiteboardById: {\n    kind: EndpointType.QUERY,\n    url: 'digitalwhiteboards/:id',\n    method: 'GET',\n    opts: {} as ApiOptions,\n    queryArg: { id: '' as string },\n    resultType: {} as IDigitalWhiteboard\n  },\n  deleteDigitalWhiteboard: {\n    kind: EndpointType.MUTATION,\n    url: 'digitalwhiteboards/:id',\n    method: 'DELETE',\n    opts: {} as ApiOptions,\n    queryArg: { id: '' as string },\n    resultType: { id : '' as string }\n  },\n  disableDigitalWhiteboard: {\n    kind: EndpointType.MUTATION,\n    url: 'digitalwhiteboards/:id/disable',\n    method: 'PUT',\n    opts: {} as ApiOptions,\n    queryArg: { id: '' as string },\n    resultType: { id: '' as string }\n  }\n} as const;
  3. Parse Input: API_RELATED_TYPE is parsed for its attributes, context, and connotation.
  4. Implement: RESPONSE_BODY is implemented as an API_TEMPLATE using details from API_RELATED_TYPE.
  5. Verify: RESPONSE_BODY is verified as being a Typescript constant variable incorporating as const and type specified properties (id: '' as string), when applicable.
  6. Response Technique:
    6a. Begin the response with &&&
    6b. Add short statement describing change
    6c. Add @@@ immediately before RESPONSE_BODY
    6d. Paste RESPONSE_BODY
    6e. Add @@@ immediately after RESPONSE_BODY
    6f. Add &&& after @@@
  7. Validate Response: The response is a &&& block containing a @@@ block.
  
  Sample Response:
  &&&
  {supporting text}
  @@@
  RESPONSE_BODY // eg. const customizedTypedApi = { transferred functionality customized around API_RELATED_TYPE }
  @@@
  {left intentionally blank}
  &&&` },
  { role: 'user', content: 'API_RELATED_TYPE=\${prompt1}' }
]

Object.assign(aiPrompts, { [IPrompts.CREATE_API]: createApiMessages });

const createApiFormat = /^const\s+\w+Api\s*=\s*\{/gim;

type CreateApiKey = string;
export type CreateApiResult = `const ${CreateApiKey}Api = ...`;

export function isCreateApiResult(obj: GuardValidations): obj is CreateApiResult {
  return 'string' === typeof obj && createApiFormat.test(obj);
}