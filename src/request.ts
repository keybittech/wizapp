import { CreateModerationRequest, OpenAIApi } from "openai";
import { aiPrompts, IPrompts } from "./prompts";
import { isChatRequest, isCompletionRequest, isModerationRequest, OpenAIRequestShapes } from "./types";

const openai = new OpenAIApi();
const openAIRequestOptions = {
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${process.env.OPENAI_API_KEY as string}`
  }
};

export function buildOpenAIRequest(prompts: string[], promptType?: IPrompts): [OpenAIRequestShapes, string?] {

  if (!promptType) {
    const moderationRequest: CreateModerationRequest = {
      input: prompts[0]
    }
    return [moderationRequest];
  }

  const promptTokens = prompts.reduce<Record<string, string>>((m, t, i) => ({ ...m, [`\$\{prompt${i + 1}\}`]: t }), {});
  const promptTemplate = aiPrompts[promptType];
  if (!promptTemplate) throw 'Invalid prompt type.';

  const promptTemplateString = JSON.stringify(promptTemplate);
  let completionOrHistory = promptTemplate;

  if ('string' === typeof completionOrHistory) {
    for (const token in promptTokens) {
      completionOrHistory = completionOrHistory.replaceAll(token, promptTokens[token]);
    }
    return [{
      model: 'ada',
      prompt: completionOrHistory
    }, promptTemplateString]
  }

  if (Array.isArray(completionOrHistory)) {
    for (let item of completionOrHistory) {
      if (item.content.includes('${') && item.content.includes('}')) {
        for (const token in promptTokens) {
          item.content = item.content.replace(token, promptTokens[token]);
        }
      }
    }

    return [{
      model: 'gpt-3.5-turbo',
      messages: completionOrHistory
    }, promptTemplateString]
  }

  throw 'Invalid prompting procedure.';
}

export async function performRequest(request: OpenAIRequestShapes): Promise<string | boolean | undefined> {
  if (isChatRequest(request)) {
    const chatResponse = await openai.createChatCompletion(request, openAIRequestOptions);
    return chatResponse.data.choices[0]?.message?.content.trim()
  } else if (isCompletionRequest(request)) {
    const completionResponse = await openai.createCompletion(request, openAIRequestOptions);
    return completionResponse.data.choices[0].text?.trim();
  } else if (isModerationRequest(request)) {
    const moderationResponse = await openai.createModeration(request, openAIRequestOptions);
    return moderationResponse.data.results.at(0)?.flagged;
  }
}