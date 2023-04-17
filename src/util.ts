import path from "path";

export const isValidName = (name: string): boolean => {
  const regex = /^I[A-Z][a-zA-Z]*$/;
  return regex.test(name);
};

export const toSnakeCase = (name: string): string => {
  if (!isValidName(name)) {
    throw new Error("Invalid name format");
  }
  return name.substr(1).replace(/[A-Z]/g, (match) => `_${match.toLowerCase()}`).slice(1);
};

export const toTitleCase = (name: string): string => {
  if (!isValidName(name)) {
    throw new Error("Invalid name format");
  }
  return name.substr(1).replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase());
};

export function extractCodeBlock(inputString: string, delimeter: string = '\`\`\`', languages: string[] = ['typescript', 'json', 'jsx', 'tsx']) {
  const langStartTag = (language: string) => language ? `${delimeter}${language}` : delimeter;

  for (const language of languages) {
    const startTag = langStartTag(language);
    if (inputString.includes(startTag)) {
      return inputString.split(startTag)[1].split(delimeter)[0];
    }
  }

  if (inputString.includes(delimeter)) {
    return inputString.split(delimeter)[1];
  }

  return inputString;
};

export function sanitizeName(input: string): string {
  // Trim whitespaces and replace consecutive spaces with a single dash
  const trimmed = input.trim();

  // Remove invalid characters: ~ ^ : ? * [ ] @ { } \ /
  const sanitized = trimmed.replace(/[~^:?"*\[\]@{}\\/]+/g, '');

  // Limit branch name length to 100 characters
  const maxLength = 100;
  const shortened = sanitized.slice(0, maxLength);

  // Remove leading and trailing period (.)
  const noLeadingTrailingPeriods = shortened.replace(/(^\.+|\.+$)/g, '');

  // Remove leading and trailing forward slash (-)
  const result = noLeadingTrailingPeriods.replace(/(^-+|-+$)/g, '');

  return result;
}

export function ensureKeysAreQuoted(jsonString: string): string {
  const unquotedKeysRegex = /([{,]\s*)(\w+)\s*:/g;
  function quoteKeys(match: unknown, prefix: string, key: string) {
    return `${prefix}"${key}":`;
  }
  return jsonString.replace(unquotedKeysRegex, quoteKeys);
}

export function typeDefinitionToSentence(typeDefinition: string): string {
  const typeNameMatch = typeDefinition.match(/export type (\w+)/);

  if (!typeNameMatch) {
    return 'Invalid type definition provided.';
  }

  const typeName = typeNameMatch[1];
  const properties = [];
  const propertyRegex = /(\w+)\s*:\s*([^;]+);/g;

  let match;
  while ((match = propertyRegex.exec(typeDefinition)) !== null) {
    properties.push({ key: match[1], type: match[2].trim().replace(/\s+/g, ' ') });
  }

  if (properties.length > 0) {
    const propertiesDescription = properties
      .map((property) => `${property.key} as a ${property.type}`)
      .join(', ');

    return `${typeName} defines ${propertiesDescription}.`;
  } else {
    const recordMatch = typeDefinition.match(/Record<(.+),\s*(.+)>/);
    if (recordMatch) {
      return `${typeName} is a Record ${recordMatch[1]} of ${recordMatch[2]}.`;
    }
  }

  return 'Unable to parse the type definition.';
}

export function hasSimilarKey(obj: Record<string, unknown>, prop: string): boolean {
  const regex = new RegExp(`^${prop}_\\d+$`);
  return Object.keys(obj).some(key => regex.test(key));
}

export function getPathOf(name: string): string {
  return path.join(__dirname, name);
}