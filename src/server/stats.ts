import type { ChatResponse, CompletionResponse, ModerationResponse } from "../lib/types";
import fs from 'fs';
import { getConfig } from "./config";
import { isChatResponse, isCompletionResponse, isModerationResponse } from "../lib/util";

export function logAiResult<T>(res: ChatResponse<T> | CompletionResponse | ModerationResponse) {
  const config = getConfig();
  const { successful, timestamp, failures, rawResponses, prompts, model, ...metric } = res;
  const duration = ((new Date()).getTime() - (new Date(res.timestamp).getTime())) / 1000;

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

  Object.assign(metrics, {  type: metric.promptType, template: metric.promptTemplate, rawResponses, failures });

  fs.appendFileSync(config.ai.logFile, `${JSON.stringify(metrics)}\n`);
}