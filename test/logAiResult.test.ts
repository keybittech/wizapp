import fs from 'fs';
import { ChatResponse } from '../src/types';
import { IPrompts } from '../src/prompts/prompts';

import { logAiResult } from '../src/stats';
import { GuidedEditResponse } from '../src/prompts/guided_edit_prompt';

describe('logAiResult', () => {
  const logFilePath = './testLogFile.log';
  const configSpy = jest.spyOn(require('../src/config'), 'getConfig');
  configSpy.mockReturnValue({ ai: { logFile: logFilePath } });

  afterEach(() => {
    if (fs.existsSync(logFilePath)) {
      fs.unlinkSync(logFilePath);
    }
  });

  test('should append a line to the log file with the correct metrics', () => {
    const chatResponse: ChatResponse<GuidedEditResponse> = {
      successful: true,
      timestamp: new Date(),
      failures: [''],
      rawResponses: [''],
      prompts: ['test'],
      model: 'testModel',
      message: [{ "above_9": "yep" }],
      supportingText: 'testSupportingText',
      promptTemplate: 'testTemplate',
      promptType: IPrompts.EDIT_FILE,
    };

    const expectedLogLine = {
      pass: chatResponse.successful,
      timestamp: chatResponse.timestamp.toISOString(),
      duration: expect.any(Number),
      prompts: chatResponse.prompts,
      model: chatResponse.model,
      data: { message: chatResponse.message, supportingText: chatResponse.supportingText },
      failures: chatResponse.failures,
      rawResponses: chatResponse.rawResponses,
      template: chatResponse.promptTemplate,
      type: chatResponse.promptType,
    };

    logAiResult<GuidedEditResponse>(chatResponse);

    const logFileContent = fs.readFileSync(logFilePath, { encoding: 'utf-8' });
    const loggedMetrics = JSON.parse(logFileContent);

    console.log({ expectedLogLine, loggedMetrics })

    expect(loggedMetrics).toEqual(expectedLogLine);
  });
});