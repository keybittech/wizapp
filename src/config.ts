// config.js
import fs from 'fs';
import { Config, ConfigPropTypes, isConfigNestedObject } from './types';
import path from 'path';
const configFile = 'config.json';


// Default configuration values
export const defaultConfig: Config = {
  ai: { retries: '3' },
  ts: { configPath: '', typeDir: '', compDir: '' },
  git: { rootPath: '', source: 'main', remote: 'origin' },
  user: { name: 'wizapp' },
};

// Load existing configuration or create a new file with default values
export let config = defaultConfig;
if (fs.existsSync(configFile)) {
  const rawData = fs.readFileSync(configFile);
  config = JSON.parse(rawData.toString());
} else {
  fs.writeFileSync(configFile, JSON.stringify(defaultConfig, null, 2));
  config = defaultConfig;
}

// Function to save the configuration
export function saveConfig() {
  fs.writeFileSync(configFile, JSON.stringify(config, null, 2));
}

export function getConfig() {
  let config: Config;
  
  try {
    const configText = fs.readFileSync(path.join(__dirname, configFile), 'utf-8');
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