import { CreateModerationRequest, OpenAIApi } from "openai";
import { aiPrompts, IPrompts } from "../lib/prompts";
import { isChatRequest, isCompletionRequest, isModerationRequest, OpenAIRequestShapes } from "./types";

const openai = new OpenAIApi();
export const openAIRequestOptions = {
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${process.env.OPENAI_API_KEY as string}`
  }
};

export const chatModel = 'gpt-3.5-turbo';

export function buildOpenAIRequest(prompts: string[], promptType?: IPrompts): [OpenAIRequestShapes, string?] {
  if (!promptType) {
    const moderationRequest: CreateModerationRequest = {
      input: prompts[0]
    }
    return [moderationRequest];
  }

  const promptTokens = prompts.reduce<Record<string, string>>((m, t, i) => ({ ...m, [`\$\{prompt${i + 1}\}`]: t }), {});
  const promptTemplate = aiPrompts[promptType];
  if (!promptTemplate) throw new Error('invalid prompt type');

  const promptTemplateString = JSON.stringify(promptTemplate);
  let completionOrHistory = promptTemplate;

  if ('string' === typeof completionOrHistory) {
    for (const token in promptTokens) {
      completionOrHistory = completionOrHistory.replaceAll(token, promptTokens[token]);
    }
    const completionRequest = {
      model: 'curie',
      prompt: completionOrHistory
    };
    return [completionRequest, promptTemplateString]
  }

  if (Array.isArray(completionOrHistory)) {
    for (let item of completionOrHistory) {
      if (item.content.includes('${') && item.content.includes('}')) {
        for (const token in promptTokens) {
          item.content = item.content.replaceAll(token, promptTokens[token]);
        }
      }
    }

    const chatRequest = {
      model: chatModel,
      messages: completionOrHistory
    };
    return [chatRequest, promptTemplateString]
  }

  throw new Error('invalid prompting procedure');
}

export async function performRequest(request: OpenAIRequestShapes): Promise<string | boolean | undefined> {
  console.log('OpenAIActionTrigger  =::= ', JSON.stringify(request, null, 2))
  if (isChatRequest(request)) {
    console.log('CHAT')
    const chatResponse = await openai.createChatCompletion(request, openAIRequestOptions);
    console.log({ RAW_CHAT: chatResponse.data.choices[0] });
    return chatResponse.data.choices[0]?.message?.content.trim();
  } else if (isCompletionRequest(request)) {
    console.log('COMPLETION')
    const completionResponse = await openai.createCompletion(request, openAIRequestOptions);
    console.log({ RAW_COMPLETION: completionResponse.data.choices[0] });
    return completionResponse.data.choices[0].text?.trim();
  } else if (isModerationRequest(request)) {
    console.log('MODERATION')
    const moderationResponse = await openai.createModeration(request, openAIRequestOptions);
    console.log({ RAW_MODERATION: moderationResponse.data.results[0] });
    return moderationResponse.data.results[0]?.flagged;
  }
}