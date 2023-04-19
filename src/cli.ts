#!/usr/bin/env node


import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { config, saveConfig, getConfigValue, checkConfigExists, isCalledWithNpx, isCliRunning } from './config';
import * as spells from './spells';
import { IPrompts } from './prompts';

const argv =  yargs(hideBin(process.argv))
  .options({
    'config': {
      alias: 'c',
      describe: 'Path to the configuration file',
      default: 'config.json',
      type: 'string',
    },
    'verbose': {
      alias: 'v',
      describe: 'Display verbose output',
      default: false,
      type: 'boolean',
    },
  })
  .command(
    'set [key] [value]',
    'Set a configuration value',
    (yargs) => {
      return yargs.positional('key', {
        describe: 'Configuration key to set',
        type: 'string',
      }).positional('value', {
        describe: 'Value to set for the configuration key',
        type: 'string',
      });
    },
    (argv) => {
      checkConfigExists();
      if (!argv.key) throw new Error('key required');
      const keys = argv.key.split('.');
      const [current, lastKey] = getConfigValue(config, keys);
      current[lastKey] = argv.value || '';
      saveConfig();
    }
  )
  .command(
    'use-ai [promptType] [prompts...]',
    'Use AI with the specified prompts',
    (yargs) => {
      return yargs
        .positional('promptType', {
          describe: 'The type of prompt to use',
          default: undefined,
          type: 'string',
        })
        .positional('prompts', {
          describe: 'Prompts',
          demandOption: true,
          type: 'string',
          nargs: 1,
          array: true,
        });
    },
    async (argv) => {
      await spells.useAi(argv.promptType as IPrompts | undefined, ...argv.prompts)
        .then((result) => console.log(result))
        .catch((error) => console.error(error));
    }
  )
  .command(
    'guided-edit [fileNameWithInstructions] [optionalName]',
    'Run guided edit',
    (yargs) => {
      return yargs
        .positional('fileNameWithInstructions', {
          describe: 'File name with instructions',
          type: 'string',
          demandOption: true
        })
        .positional('optionalName', {
          describe: 'Optional name',
          type: 'string',
        })
        .options({
          'commit': {
            type: 'boolean',
            description: 'Will commit edits to the generated branch',
            default: true,
          },
          'pull-request': {
            type: 'boolean',
            description: 'Will create and add to 1 pull request per generated branch',
            default: true,
          },
        });
    },
    async (argv) => {
      await spells.guidedEdit(argv.fileNameWithInstructions, argv.optionalName)
        .then((result) => console.log(result))
        .catch((error) => console.error(error));
    }
  )
  .command(
    'create-component [description]',
    'Create a component',
    (yargs) => {
      return yargs
        .positional('description', {
          describe: 'Component description',
          demandOption: true,
          type: 'string',
        });
    },
    async (argv) => {
      await spells.createComponent(argv.description)
        .then((result) => console.log(result))
        .catch((error) => console.error(error));
    }
  )
  .command(
    'create-api [typeName]',
    'Create an API',
    (yargs) => {
      return yargs
        .positional('typeName', {
          describe: 'API type name',
          demandOption: true,
          type: 'string',
        });
    },
    async (argv) => {
      const generatedType = await spells.createType(argv.typeName) 

      await spells.createApi(argv.typeName, generatedType)
        .then((result) => console.log(result))
        .catch((error) => console.error(error));

      await spells.createApiBackend(argv.typeName, generatedType);
    }
  )
  .demandCommand(1, 'You need at least one command before moving on')
  .help()
  .alias('h', 'help')
  .strict()
  .argv;

export default argv;