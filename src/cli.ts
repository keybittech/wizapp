#!/usr/bin/env node


import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { config, saveConfig, getConfigValue } from './config';

const argv =  yargs(hideBin(process.argv))
  .options({
    // Global options
    'timeout': {
      type: 'number',
      description: 'How many attempts before failed',
      default: 3,
    },
    'outer-delimeter': {
      type: 'string',
      description: 'Outer delimeter used to encapsulate targeted result summaries',
      default: '&&&',
    },
    'inner-delimeter': {
      type: 'string',
      description: 'Inner delimeter used to encapsulate targeted results',
      default: '@@@',
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
      if (!argv.key) throw new Error('key required');
      const keys = argv.key.split('.');
      const [current, lastKey] = getConfigValue(config, keys);
      current[lastKey] = argv.value || '';      
      saveConfig();
      console.log(`Configuration updated: ${argv.key} = ${argv.value}`);
    }
  )
  .command(
    'use-ai [promptType] [prompt1] [prompt2]',
    'Use AI with the specified prompts',
    (yargs) => {
      return yargs
        .positional('promptType', {
          describe: 'The type of prompt to use',
          type: 'string',
        })
        .positional('prompt1', {
          describe: 'The first prompt',
          type: 'string',
        })
        .positional('prompt2', {
          describe: 'The second prompt',
          type: 'string',
        });
    },
    (argv) => {
      Object.keys(process.env).forEach(ke => {
        ke.startsWith('WIZAPP_') && console.log(ke)
      })
      // Add your use-ai logic here
      // Access global options with argv.timeout, argv['outer-delimeter'], argv['inner-delimeter']
      // Access user settings with config.user.name
    }
  )
  // Add guided-edit, create-component, and create-api commands with their specific options as follows:
  .command(
    'guided-edit [fileNameWithInstructions] [optionalName]',
    'Run guided edit',
    (yargs) => {
      return yargs
        .positional('fileNameWithInstructions', {
          describe: 'File name with instructions',
          type: 'string',
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
    (argv) => {
      // Add your guided-edit logic here
      // Access command options with argv.commit, argv['pull-request']
      // Access user settings with config.user.name
    }
  )
  .command(
    'create-component [description] [optionalName]',
    'Create a component',
    (yargs) => {
      return yargs
        .positional('description', {
          describe: 'Component description',
          type: 'string',
        })
        .positional('optionalName', {
          describe: 'Optional component name',
          type: 'string',
        });
    },
    (argv) => {
      // Add your create-component logic here
      // Access user settings with config.user.name
    }
  )
  .command(
    'create-api [typeName] [optionalName]',
    'Create an API',
    (yargs) => {
      return yargs
        .positional('typeName', {
          describe: 'API type name',
          type: 'string',
        })
        .positional('optionalName', {
          describe: 'Optional API name',
          type: 'string',
        });
    },
    (argv) => {
      // Add your create-api logic here
      // Access git settings with config.git.typedir, config.git.compdir
    }
  )
  .demandCommand(1, 'You need at least one command before moving on')
  .help()
  .alias('h', 'help')
  .strict()
  .argv;

export default argv;