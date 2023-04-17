
import { ChatResponse, CompletionResponse, isChatResponse, isCompletionResponse, isModerationResponse, ModerationResponse } from "./types";

function sum(a: number, b: number): number {
  return a + b;
}

function subtract(a: number, b: number): number {
  return a - b;
}

function multiply(a: number, b: number): number {
  return a * b;
}

function divide(a: number, b: number): number {
  return a / b;
}
import { ChatResponse, CompletionResponse, isChatResponse, isCompletionResponse, isModerationResponse, ModerationResponse } from "./types";
import fs from 'fs';
import { getConfig } from "./config";

export function logAiResult<T>(res: ChatResponse<T> | CompletionResponse | ModerationResponse) {
  const config = getConfig();
  const { successful, timestamp, failures, prompts, model, ...metric } = res;
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

  Object.assign(metrics, { failures, template: metric.promptTemplate, type: metric.promptType });

  fs.appendFileSync(config.ai.logFile, `${JSON.stringify(metrics)}\n`);
}