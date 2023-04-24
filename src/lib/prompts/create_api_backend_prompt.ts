import { ChatCompletionRequestMessage } from "openai";
import type { GuardValidations } from "../types";

export const createApiBackendMessages: ChatCompletionRequestMessage[] = [
  { role: 'system', content: 'I, TemplateTransferGPT, transfer the qualities of Typescript types into file templates.'},
  { role: 'assistant', content: `I perform each step silently to my self, and then I will give you a response like in Sample Response:
  1. Define Accepted FILE_RELATED_TYPE Input: type IUuidFiles = { id: string; parentUuid: string; fileId: string; } postUuidFile, putUuidFile, getUuidFiles, getUuidFileById, deleteUuidFile, disableUuidFile' }
  2. Assign FILE_TEMPLATE: const uuidFilesApiHandlers: ApiHandler<typeof uuidFilesApi> = {\n  postUuidFile: async props => {\n    const { parentUuid: parent_uuid, fileId: file_id } = props.event.body;\n    const { id } = await props.tx.one<IUuidFiles>(\`\n      INSERT INTO dbtable_schema.uuid_files (parent_uuid, file_id, created_on, created_sub)\n      VALUES ($1, $2, $3, $4::uuid)\n      RETURNING id\n    \`, [parent_uuid, file_id, utcNowString(), props.event.userSub]);\n    \n    return { id };\n  },\n  putUuidFile: async props => {\n    const { id, parentUuid: parent_uuid, fileId: file_id } = props.event.body;\n    const updateProps = buildUpdate({\n      id,\n      parent_uuid,\n      file_id,\n      updated_on: utcNowString(),\n      updated_sub: props.event.userSub\n    });\n    await props.tx.none(\`\n      UPDATE dbtable_schema.uuid_files\n      SET \${updateProps.string}\n      WHERE id = $1\n    \`, updateProps.array);\n    return { id };\n  },\n  getUuidFiles: async props => {\n    const uuidFiles = await props.db.manyOrNone<IUuidFiles>(\`\n      SELECT * FROM dbview_schema.enabled_uuid_files\n    \`);\n    \n    return uuidFiles;\n  },\n  getUuidFileById: async props => {\n    const { id } = props.event.pathParameters;\n    const response = await props.db.one<IUuidFiles>(\`\n      SELECT * FROM dbview_schema.enabled_uuid_files\n      WHERE id = $1\n    \`, [id]);\n    \n    return response;\n  },\n  deleteUuidFile: async props => {\n    const { id } = props.event.pathParameters;\n    await props.tx.none(\`\n      DELETE FROM dbtable_schema.uuid_files\n      WHERE id = $1\n    \`, [id]);\n    \n    return { id };\n  },\n  disableUuidFile: async props => {\n    const { id, parentUuid: parent_uuid, fileId: file_id } = props.event.body;\n    await props.tx.none(\`\n      UPDATE dbtable_schema.uuid_files\n      SET enabled = false, updated_on = $3, updated_sub = $4\n      WHERE parent_uuid = $1 AND file_id = $2\n    \`, [parent_uuid, file_id, utcNowString(), props.event.userSub]);\n    return { id };\n  },\n} as const;
  3. Parse Input: FILE_RELATED_TYPE is parsed for its attributes, context, and connotation.
  4. Implement: RESPONSE_BODY is implemented as an API_TEMPLATE using details from FILE_RELATED_TYPE.
  5. Verify: RESPONSE_BODY is verified as being a Typescript constant variable incorporating as const and defining .
  6. Response Technique is the following verbatim text with variables replaced by <>: &&&@@@<RESPONSE_BODY>@@@&&&
  7. Validate Response: The response returned to the user follows the exact format of Step 6: eg. &&&@@@const customizedApiHandlers: ApiHandler<typeof customizedApi> = {\n transferred functionality customized around FILE_RELATED_TYPE\n }@@@&&&` },
  { role: 'user', content: 'FILE_RELATED_TYPE=\${prompt1}' }
];

const createApiFormat = /^const\s+\w+ApiHandlers:\s+ApiHandler/gim;

type CreateApiBackendKey = string;
export type CreateApiBackendResult = `const ${CreateApiBackendKey}ApiHandlers: ApiHandler`;

export function isCreateApiBackendResult(obj: GuardValidations): obj is CreateApiBackendResult {
  return 'string' === typeof obj && createApiFormat.test(obj);
}