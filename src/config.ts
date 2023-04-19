// config.ts
import fs from 'fs';
import path from 'path';
import { Config, ConfigPropTypes, isConfigNestedObject } from './types';

export const isCliRunning = process.argv[1].includes('bin/src/cli.js');

export const configFilePath = path.join(__dirname, `${isCliRunning ? '../..' : '..'}/config.json`);

// Default configuration values
export const defaultConfig: Config = {
  ai: { retries: '3', logFile: 'results.json' },
  ts: { configPath: '', typeDir: '', compDir: '' },
  git: { rootPath: '', source: 'main', remote: 'origin' },
  user: { name: 'wizapp' },
};

// Load existing configuration or create a new file with default values
export let config = defaultConfig;
if (fs.existsSync(configFilePath)) {
  const rawData = fs.readFileSync(configFilePath);
  config = JSON.parse(rawData.toString());
} else {
  fs.writeFileSync(configFilePath, JSON.stringify(defaultConfig, null, 2));
  config = defaultConfig;
}

// Function to save the configuration
export function saveConfig(): void {
  fs.writeFileSync(configFilePath, JSON.stringify(config, null, 2));
}

export function updateConfig(newConfig: Config): void {
  config = Object.assign(config, newConfig);
}

export function setConfig(newConfig: Config): void {
  config = newConfig;
}

export function getConfig(): Config {
  return config;
}

export function getConfigFromPath(configPath: string): Config {
  let optionalConfig: Config;

  try {
    const configText = fs.readFileSync(configPath, 'utf-8');
    optionalConfig = JSON.parse(configText) as Config;
  } catch (error) {
    optionalConfig = defaultConfig;
  }

  return optionalConfig;
}

// Helper function
export function getConfigValue(config: Config, keys: string[]): [Record<string, ConfigPropTypes | Record<string, ConfigPropTypes>>, string] {
  let current: Record<string, ConfigPropTypes | Record<string, ConfigPropTypes>> = config;

  for (let i = 0; i < keys.length - 1; i++) {
    if (!isConfigNestedObject(current[keys[i]])) {
      throw new Error('invalid config key');
    }
    current = current[keys[i]] as Record<string, ConfigPropTypes>;
  }

  return [current, keys[keys.length - 1]];
}