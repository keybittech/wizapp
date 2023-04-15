import fs from 'fs';
import path from 'path';
import { getConfig, defaultConfig } from '../src/config';
import { Config } from '../src/types';
import { setupConfigTestBefore, setupConfigTestAfter } from './testHelpers';

const configFile = path.join(__dirname, '../src/config.json');

describe('getConfig', () => {
  beforeEach(() => {
    setupConfigTestBefore();
  });

  afterEach(() => {
    setupConfigTestAfter();
  });  

  it('returns default config values when config file does not exist', () => {
    // Remove the config file
    fs.unlinkSync(configFile);

    const config = getConfig();
    expect(config).toEqual(defaultConfig);
  });

  it('returns config values when config file exists', () => {
    const expectedConfig: Config = {
      ts: { configPath: 'config', typeDir: 'types', compDir: 'components' },
      git: { rootPath: 'root', source: 'dev', remote: 'origin' },
      user: { name: 'John Doe' },
    };

    // Save the expected config to the config file
    fs.writeFileSync(configFile, JSON.stringify(expectedConfig, null, 2));

    const config = getConfig();
    expect(config).toEqual(expectedConfig);
  });
});
