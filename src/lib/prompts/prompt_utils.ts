
export function getSuggestionPrompt(prompt: string) {
  return `Generate 5 ${prompt}; Result is 1-3 words separated by |. Here are some examples: `;
}

export function generateExample(prompt: string, result: string = '') {
  return `Phrase: ${prompt}\nResult: ${result}`;
}

export function hasSimilarKey(obj: Record<string, unknown>, regex: RegExp): boolean {
  return Object.keys(obj).some(key => regex.test(key));
}