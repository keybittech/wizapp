import { ChatResponse, CompletionResponse, isChatResponse, isCompletionResponse, isModerationResponse, ModerationResponse } from "./types";
import fs from 'fs';

export function logAiResult<T>(res: (ChatResponse<T> | CompletionResponse | ModerationResponse) & { prompts: string[], model?: string }) {
  const { successful, timestamp, failures, prompts, model, ...metric } = res;
  const duration = ((new Date()).getTime() - res.timestamp.getTime()) / 1000;

  let metrics: Record<string, unknown> = {
    pass: successful,
    timestamp,
    duration,
    prompts,
    model
  }

  if (isChatResponse(res)) {
    const { message, supportingText } = res;
    Object.assign(metrics, { data: { message, supportingText } });
  }

  if (isCompletionResponse(res)) {
    const { message } = res;
    Object.assign(metrics, { data: { message } });
  }

  if (isModerationResponse(res)) {
    const { flagged } = res;
    Object.assign(metrics, { data: { flagged } });
  }

  Object.assign(metrics, { failures, template: metric.promptTemplate, type: metric.promptType });

  fs.appendFileSync('results.json', `${JSON.stringify(metrics)}\n`);
}