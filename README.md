# ![KeyBit Tech Logo](https://raw.githubusercontent.com/keybittech/awayto/main/app/src/webapp/img/kbt-icon_32w.png) The Wizard's Apprentice

[Awayto.dev](https://awayto.dev/) - [KeyBit Tech](https://keybittech.com/) - [Patreon](https://patreon.com/KeyBitTech) -  [Discord](https://discord.gg/KzpcTrn5DQ) - [Twitch](https://twitch.tv/chatjoept) - [Twitter](https://twitter.com/awaytodev) - [Contact](mailto:joe@keybittech.com) - [LinkedIn](https://www.linkedin.com/in/joe-mccormick-76224429/)

TLDR: This software is in beta, providing baseline functionality that may be temperamental. An AI-assisted CLI & Typescript function suite including file editing, git pr initiation + follow-up, response format validation, detailed logging including prompt versioning to derive success rates, examples of prompt design with the goal of code generation, and strategies for working with code artifacts in prompts.

WizApp is a powerful TypeScript-based command-line tool and library for managing TypeScript projects, utilizing AI-driven code modifications, and generating code structures. The intended use is to have an informed code companion as you go through your development cycle.

WizApp provides the following feature set:

- TypeScript project parsing
- AI-driven code modifications and generation
- GitHub pull request generation and follow-up
- Prompt management, customization
- Logging and statistics
- Detailed configuration

Also check out [Awayto](https://github.com/keybittech/awayto) and soon to be released [Awayto v2](https://github.com/jcmccormick/wc), letting you deploy web apps on AWS (v1), k8s (v2), or docker (v2). V2 is exceptionally featured and you should check it out if you deploy, build, or need pre-built fully featured web platforms to launch from.

## Installation

[Clone Installation Demo](https://youtu.be/kCVwqbW8cic)

OPENAI_API_KEY in the environment.

To install WizApp locally, run the following command:

```
npm install @keybittech/wizapp
```

### Configure WizApp settings
[Config Demo](https://youtu.be/b8uU2reOE5I)
```
npx wizapp set ts.configPath "<path/to/tsconfig.json>"
// required for create-api create-component guided-edit

npx wizapp set ts.typeDir "<folder for generated types/apis>"
// required for create-api

npx wizapp set ts.compDir "<folder for generated components>"
// required for create-component

npx wizapp set git.rootPath "<root directory for the git project containing the above>"
// setting this will enable PR creation only for guided-edit

npx wizapp set user.name "<name used for generating entity>"
// default wizapp
```

## CLI & Typescript Imports

The software can be used both as a CLI which acts upon a local typescript project, kind of like a scaffolding utility. But key functionality can also be imported into your Typescript files for direct use.

### Spells

The WizApp CLI offers a variety of magical delights to help you manage your TypeScript projects:

- `use-ai`: General purpose function to generate a request for any application prompt [Demo](https://youtu.be/TbeQcZsg_eM)
- `guided-edit`: Edits a specific file, creates a new git branch + pull request, updates pr on subsequent calls to same file [Demo](https://youtu.be/2gbj2QHwYEs)
- `create-component`: Creates a new TypeScript react component [Demo](https://youtu.be/1eBD2-X9tTE)
- `create-api`: (Awayto extension) Creates a Typescript type with an api definition and functionality (Temperamental)

```
npx wizapp [command] [options]
```

### CLI Commands - Work In Progress

#### Use AI
```
use-ai "suggest_service" "the downtown learning center at the U library"
```

#### Guided Edit
```
guided-edit "<fileName/Path> <desired addition, deletion, edit>"

Ex:

guided-edit "Profile.tsx make the profile picture round instead of square"

```
Guided edit requires the tsconfig.json path to be configured and will seek out the filename you give it and attempt to perform the command that follows. Internally, guided edit reduces token usage on the response end, meaning requests can be larger; Generally an edit won't be too sweeping of a change, so AST parsing and prompt design are used to target the minimum required modifications.


#### Create API - Temperamental

```
npx wizapp create-api "IMyApi"
```
(Awayto Extension) This command infers a typescript type from the name given, then designs a templated API configuration and functionality.

#### Create Component

```
create-component "description of a component"
```
This requires ts.compDir to be configured. A component name will be generated based on the description and placed into compDir/Component.tsx.


## TypeScript Library Usage

This section is under development; seen as temperamental.

WizApp can also be used as a library to directly interact with TypeScript files and manipulate them in your projects:

- `createComponent(componentName: string, options?: ComponentOptions)`: Creates a new TypeScript component
- `useAi(input: string, output?: string, options?: AiOptions)`: Generates or modifies code based on AI suggestions

### Examples - Work in Progress

#### Create a new component

```typescript
import { createComponent } from '@keybittech/wizapp';

createComponent('A tarot card reader that shows 7 cards in a grid and pulls images from a real tarot card website along with their names and descriptions. Users can press a button to reveal 7 new cards.');
```

#### Generate or modify code based on AI suggestions

```typescript
import { useAi, IPrompts } from '@keybittech/wizapp';

useAi(IPrompts.SUGGEST_SERVICE, 'a group of people who go out on the weekends and do various activities');
```
