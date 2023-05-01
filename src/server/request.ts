import { CreateModerationRequest, OpenAIApi } from "openai";
import { aiPrompts, IPrompts } from "../lib/prompts";
import type { OpenAIRequestShapes } from "./types";
import { deepClone, isChatRequest, isCompletionRequest, isModerationRequest } from "./util";
import { getConfig } from "./config";

const openai = new OpenAIApi();
export const openAIRequestOptions = {
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${process.env.OPENAI_API_KEY as string}`
  }
};

export function buildOpenAIRequest(prompts: string[], promptType?: IPrompts): [OpenAIRequestShapes, string?] {
  const config = getConfig();
  if (!promptType) {
    const moderationRequest: CreateModerationRequest = {
      input: prompts[0]
    }
    return [moderationRequest];
  }

  const promptTokens = prompts.reduce<Record<string, string>>((m, t, i) => ({ ...m, [`\$\{prompt${i + 1}\}`]: t }), {});
  const promptTemplate = aiPrompts[promptType];
  if (!promptTemplate) throw new Error('invalid prompt type');

  const originalPromptTemplate = JSON.stringify(promptTemplate);
  const completionStringOrMessageHistory = promptTemplate;

  if ('string' === typeof completionStringOrMessageHistory) {
    let completionString = String(completionStringOrMessageHistory);
    for (const token in promptTokens) {
      completionString = completionString.replaceAll(token, promptTokens[token]);
    }
    const completionRequest = {
      model: config.ai.completionModel,
      prompt: completionString
    };
    return [completionRequest, originalPromptTemplate]
  }

  if (Array.isArray(completionStringOrMessageHistory)) {
    const messageHistory = deepClone(completionStringOrMessageHistory);
    for (let item of messageHistory) {
      if (item.content.includes('${') && item.content.includes('}')) {
        for (const token in promptTokens) {
          item.content = item.content.replaceAll(token, promptTokens[token]);
        }
      }
    }

    const chatRequest = {
      model: config.ai.chatModel,
      messages: messageHistory
    };
    return [chatRequest, originalPromptTemplate]
  }

  throw new Error('invalid prompting procedure');
}

export async function performRequest(request: OpenAIRequestShapes): Promise<string | boolean | undefined> {
  console.log('OpenAIActionTrigger  =::= ', JSON.stringify(request, null, 2))
  if (isChatRequest(request)) {
    const chatResponse = await openai.createChatCompletion(request, openAIRequestOptions);
    console.log({ RAW_CHAT: chatResponse.data.choices[0] });
    return chatResponse.data.choices[0]?.message?.content.trim();
  } else if (isCompletionRequest(request)) {
    const completionResponse = await openai.createCompletion(request, openAIRequestOptions);
    console.log({ RAW_COMPLETION: completionResponse.data.choices[0] });
    return completionResponse.data.choices[0].text?.trim();
  } else if (isModerationRequest(request)) {
    const moderationResponse = await openai.createModeration(request, openAIRequestOptions);
    console.log({ RAW_MODERATION: moderationResponse.data.results[0] });
    return moderationResponse.data.results[0]?.flagged;
  }
}