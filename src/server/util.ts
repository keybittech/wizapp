import fs from 'fs';
import path from "path";
import { sync } from 'fast-glob';
import { isCalledWithNpx, isCliRunning } from "./config";

import languages from "../lib/languages";
import type { OpenAIRequestShapes } from './types';
import { CreateChatCompletionRequest, CreateCompletionRequest, CreateModerationRequest } from 'openai';
const langValues = Object.values(languages);

export const codeGPTPrecursor = 'You are BacktickGPT, providing only typescript code responses wrapped with 3 backticks before and after.';

export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => deepClone(item) as T) as unknown as T;
  }

  const result: Record<string, unknown> = {};

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      result[key] = deepClone((obj as Record<string, unknown>)[key]);
    }
  }

  return result as T;
}

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

export function extractCodeBlock(inputString: string, delimeter: string = '```', languages: string[] = ['typescript', 'json', 'jsx', 'tsx']) {
  const langStartTag = (language: string) => language ? `${delimeter}${language}` : delimeter;

  for (const language of languages) {
    const startTag = langStartTag(language);
    if (inputString.includes(startTag)) {
      return {
        codeBlock: inputString.split(startTag)[1].split(delimeter)[0],
        index: inputString.indexOf(startTag) + startTag.length,
      };
    }
  }

  if (inputString.includes(delimeter)) {
    const index = inputString.indexOf(delimeter) + delimeter.length;
    return {
      codeBlock: inputString.split(delimeter)[1],
      index,
    };
  }

  return {
    codeBlock: inputString,
    index: 0,
  };
};

export function extractCodeBlockPre(inputString: string, index: number): string {
  return inputString.substring(0, index)?.trim() || '';
}

export function extractCodeBlockPost(inputString: string, index: number, delimeter: string = '```'): string {
  return inputString.substring(index).split(delimeter)[1]?.trim() || '';
}

export function processTextWithCodeBlock(inputString: string): { codeBlock: string; supportingText: string } {
  const { codeBlock, index } = extractCodeBlock(inputString);
  const preText = extractCodeBlockPre(inputString, index);
  const postText = extractCodeBlockPost(inputString, index);

  return {
    codeBlock,
    supportingText: preText + ' ' + postText,
  };
}

export function stripWrappedCharacter(inputString: string, wrappedCharacters: string[] = ['"', "'"]): string {
  for (const char of wrappedCharacters) {
    if (inputString.startsWith(char)) inputString = inputString.slice(1); 
    if (inputString.endsWith(char)) inputString = inputString.substring(0, inputString.length - 1); 
  }
  return inputString;
}

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

export function getDirPathOf(filePath: string) {
  return path.dirname(filePath)
}

export function generateTempFilePath(dir: string, name: string) {
  return path.join(dir, `${name}-${Date.now()}.json`)
}

export function getRootDir() {
  return isCalledWithNpx ? process.cwd() : path.join(__dirname, isCliRunning ? '../../' : '../');
}

export function getPathOf(name: string, baseDir?: string): string {
  return path.join(baseDir || getRootDir(), name);
}

export function getFileParser(fileName: string) {
  const extension = path.extname(fileName);
  const parser = langValues.find(l => l.fileExtension.includes(extension));
  if (!parser) throw 'That parser is undefined!';
  return parser.parserName;
}

export function getFileFromDir(file: string, dir: string = __dirname) {
  const files = fs.readdirSync(dir);
  const fileName = files.find(f => f.startsWith(file));
  if (!fileName) throw 'File not found.';
  return fs.readFileSync(path.join(dir, fileName), { encoding: 'utf-8' })
}

export function getTargetFile(targetFile: string, rootDir: string = getRootDir(), ignoredDirectories: string[] = excludeDirectories): string | null {
  const pattern = path.join(rootDir, '**', targetFile);

  const files = sync(pattern, {
    ignore: ignoredDirectories.map(dir => path.join('**', dir, '**')),
    onlyFiles: true,
  });

  if (!files.length) {
    throw 'No file found.';
  }
  
  if (files.length > 1) {
    throw 'Multiple files were found. Please specifiy with a local folder path.';
  }

  const fileContent = fs.readFileSync(files[0], { encoding: 'utf-8' });

  console.log({ gotfiles: files, fileContent})

  return files.length > 0 ? fileContent : null;
}

export function saveTargetFile(targetFile: string, contents: string, rootDir: string = getRootDir(), ignoredDirectories: string[] = excludeDirectories): string {
  const pattern = path.join(rootDir, '**', targetFile);

  const files = sync(pattern, {
    ignore: ignoredDirectories.map(dir => path.join('**', dir, '**')),
    onlyFiles: true,
  });

  if (!files.length) {
    throw 'No file found.';
  }
  
  if (files.length > 1) {
    throw 'Multiple files were found. Please specifiy with a local folder path.';
  }

  const fileContent = fs.writeFileSync(files[0], contents, { encoding: 'utf-8' });

  console.log({ gotfiles: files, fileContent})

  return 'file saved';
}

const excludeDirectories = [
  'node_modules',
  'vendor',
  'dist',
  'build',
  '.git',
  '.svn',
  // add other directories to exclude
];

export function isChatRequest(obj: OpenAIRequestShapes): obj is CreateChatCompletionRequest {
  return 'messages' in obj;
}

export function isCompletionRequest(obj: OpenAIRequestShapes): obj is CreateCompletionRequest {
  return 'prompt' in obj;
}

export function isModerationRequest(obj: OpenAIRequestShapes): obj is CreateModerationRequest {
  return 'input' in obj;
}