import { IPrompts, aiPrompts, codeGPTPrecursor } from ".";
import { GuardValidations } from "../types";

const createApiPrompt = [
  { role: 'system', content: codeGPTPrecursor },
  { role: 'user', content: 'Generate API definition: type IDigitalWhiteboard = { manufacturer: string;  model: string;  screenSize: number;  resolution: string;  touchSensitive: boolean;  connectivity: string[];  interface: string;}' },
  { role: 'assistant', content: `const digitalWhiteboardApi = {\n  postDigitalWhiteboard: {\n    kind: EndpointType.MUTATION,\n    url: 'digitalwhiteboards',\n    method: 'POST',\n    opts: {} as ApiOptions,\n    queryArg: { manufacturer: string;  model: string; },\n    resultType: {} as IDigitalWhiteboard }\n  },\n  putDigitalWhiteboard: {\n    kind: EndpointType.MUTATION,\n    url: 'digitalwhiteboards',\n    method: 'PUT',\n    opts: {} as ApiOptions,\n    queryArg: {} as IDigitalWhiteboard,\n    resultType: {} as IDigitalWhiteboard\n  },\n  getDigitalWhiteboards: {\n    kind: EndpointType.QUERY,\n    url: 'digitalwhiteboards',\n    method: 'GET',\n    opts: {} as ApiOptions,\n    queryArg: {} as Void,\n    resultType: [] as IDigitalWhiteboard[]\n  },\n  getDigitalWhiteboardById: {\n    kind: EndpointType.QUERY,\n    url: 'digitalwhiteboards/:id',\n    method: 'GET',\n    opts: {} as ApiOptions,\n    queryArg: { id: '' as string },\n    resultType: {} as IDigitalWhiteboard\n  },\n  deleteDigitalWhiteboard: {\n    kind: EndpointType.MUTATION,\n    url: 'digitalwhiteboards/:id',\n    method: 'DELETE',\n    opts: {} as ApiOptions,\n    queryArg: { id: '' as string },\n    resultType: { id : '' as string }\n  },\n  disableDigitalWhiteboard: {\n    kind: EndpointType.MUTATION,\n    url: 'digitalwhiteboards/:id/disable',\n    method: 'PUT',\n    opts: {} as ApiOptions,\n    queryArg: { id: '' as string },\n    resultType: { id: '' as string }\n  }\n} as const;\n` },
  { role: "user", content: 'Generate API definition: ${prompt1}' }
];

Object.assign(aiPrompts, { [IPrompts.CREATE_API]: createApiPrompt });

const createApiFormat = /^const\s+\w+Api\s*=\s*\{/;

type CreateApiResult = string

export function isCreateApiResult(obj: GuardValidations): obj is CreateApiResult {
  return 'string' === typeof obj && createApiFormat.test(obj);
}