// config.js
import fs from 'fs';
import { Config } from './types';
const configFile = 'config.json';


// Default configuration values
const defaultConfig = {
  ts: { configPath: '' },
  git: { rootPath: '', source: 'main', remote: 'origin', typedir: '', compdir: '' },
  user: { name: '' },
};

// Load existing configuration or create a new file with default values
export let config: Config = {};
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