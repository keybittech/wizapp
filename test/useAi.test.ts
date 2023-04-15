import { setupChatResponse, setupCommonMocks, setupConfigTestBefore, setupConfigTestAfter, openai } from './testHelpers';
setupChatResponse('test');
setupCommonMocks();


jest.mock('fs', () => ({
  ...jest.requireActual('fs'),
  appendFileSync: jest.fn()
}))

describe('useAi', () => {

  beforeEach(() => {
    setupConfigTestBefore({ ai: { retries: '3' }, ts: { typeDir: 'types', configPath: 'tsconfig.json' } });
  });

  afterEach(() => {
    setupConfigTestAfter();
  });
  
  test('should work by passing normal parameters for chat completion', async () => {


    // const response = await useAi("ITestTypeName", "userName");
    // expect(openai.createChatCompletion).toHaveBeenCalled();
    // expect(response).toBe('test');
  });

});
