// config.js
import fs from 'fs';
import { Config, ConfigPropTypes, isConfigNestedObject } from './types';
import { getPathOf } from './util';

export const configFilePath = getPathOf('../../config.json');

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
export function saveConfig() {
  fs.writeFileSync(configFilePath, JSON.stringify(config, null, 2));
}

export function setConfig(newConfig: Config) {
  config = newConfig;
}

export function getConfig() {
  let config: Config;
  
  try {
    const configText = fs.readFileSync(configFilePath, 'utf-8');
    config = JSON.parse(configText) as Config;
  } catch (error) {
    config = defaultConfig;
  }

  return config;
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