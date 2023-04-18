import fs from 'fs';
import { getConfig, defaultConfig } from '../src/config';
import { Config } from '../src/types';
import { setupConfigTestBefore, setupConfigTestAfter, withTempConfig, withOriginalGetConfig } from './testHelpers';

describe('getConfig', () => {
  let tempConfigPath = '';
  beforeEach(() => {
    tempConfigPath = setupConfigTestBefore();
  });

  afterEach(() => {
    setupConfigTestAfter(tempConfigPath);
  });  

  it('returns default config values when config file does not exist', async () => {
    // Remove the config file
    await withOriginalGetConfig(async () => {
      await withTempConfig(defaultConfig, async () => {
        fs.unlinkSync(tempConfigPath);
        const config = getConfig();
        expect(config).toEqual(defaultConfig);
      })
    });
  });

  it('returns config values when config file exists', async () => {

    const expectedConfig: Config = {
      ai: { retries: '3', logFile: 'results.json' },
      ts: { configPath: 'config', typeDir: 'types', compDir: 'components' },
      git: { rootPath: 'root', source: 'dev', remote: 'origin' },
      user: { name: 'John Doe' },
    };
    await withOriginalGetConfig(async () => {
      await withTempConfig(expectedConfig, async () => {
        const config = getConfig();
        expect(config).toEqual(expectedConfig);
      });
    });
  });
});
