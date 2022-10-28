oclif-hello-world
=================

oclif example Hello World CLI

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/oclif-hello-world.svg)](https://npmjs.org/package/oclif-hello-world)
[![CircleCI](https://circleci.com/gh/oclif/hello-world/tree/main.svg?style=shield)](https://circleci.com/gh/oclif/hello-world/tree/main)
[![Downloads/week](https://img.shields.io/npm/dw/oclif-hello-world.svg)](https://npmjs.org/package/oclif-hello-world)
[![License](https://img.shields.io/npm/l/oclif-hello-world.svg)](https://github.com/oclif/hello-world/blob/main/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g gamekeeper-cli
$ gamekeeper-cli COMMAND
running command...
$ gamekeeper-cli (--version)
gamekeeper-cli/0.0.0 linux-x64 node-v16.17.1
$ gamekeeper-cli --help [COMMAND]
USAGE
  $ gamekeeper-cli COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`gamekeeper-cli hello PERSON`](#gamekeeper-cli-hello-person)
* [`gamekeeper-cli hello world`](#gamekeeper-cli-hello-world)
* [`gamekeeper-cli help [COMMAND]`](#gamekeeper-cli-help-command)
* [`gamekeeper-cli plugins`](#gamekeeper-cli-plugins)
* [`gamekeeper-cli plugins:install PLUGIN...`](#gamekeeper-cli-pluginsinstall-plugin)
* [`gamekeeper-cli plugins:inspect PLUGIN...`](#gamekeeper-cli-pluginsinspect-plugin)
* [`gamekeeper-cli plugins:install PLUGIN...`](#gamekeeper-cli-pluginsinstall-plugin-1)
* [`gamekeeper-cli plugins:link PLUGIN`](#gamekeeper-cli-pluginslink-plugin)
* [`gamekeeper-cli plugins:uninstall PLUGIN...`](#gamekeeper-cli-pluginsuninstall-plugin)
* [`gamekeeper-cli plugins:uninstall PLUGIN...`](#gamekeeper-cli-pluginsuninstall-plugin-1)
* [`gamekeeper-cli plugins:uninstall PLUGIN...`](#gamekeeper-cli-pluginsuninstall-plugin-2)
* [`gamekeeper-cli plugins update`](#gamekeeper-cli-plugins-update)

## `gamekeeper-cli hello PERSON`

Say hello

```
USAGE
  $ gamekeeper-cli hello [PERSON] -f <value>

ARGUMENTS
  PERSON  Person to say hello to

FLAGS
  -f, --from=<value>  (required) Who is saying hello

DESCRIPTION
  Say hello

EXAMPLES
  $ oex hello friend --from oclif
  hello friend from oclif! (./src/commands/hello/index.ts)
```

_See code: [dist/commands/hello/index.ts](https://github.com/jtamminga/gamekeeper/blob/v0.0.0/dist/commands/hello/index.ts)_

## `gamekeeper-cli hello world`

Say hello world

```
USAGE
  $ gamekeeper-cli hello world

DESCRIPTION
  Say hello world

EXAMPLES
  $ gamekeeper-cli hello world
  hello world! (./src/commands/hello/world.ts)
```

## `gamekeeper-cli help [COMMAND]`

Display help for gamekeeper-cli.

```
USAGE
  $ gamekeeper-cli help [COMMAND] [-n]

ARGUMENTS
  COMMAND  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for gamekeeper-cli.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v5.1.14/src/commands/help.ts)_

## `gamekeeper-cli plugins`

List installed plugins.

```
USAGE
  $ gamekeeper-cli plugins [--core]

FLAGS
  --core  Show core plugins.

DESCRIPTION
  List installed plugins.

EXAMPLES
  $ gamekeeper-cli plugins
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v2.1.1/src/commands/plugins/index.ts)_

## `gamekeeper-cli plugins:install PLUGIN...`

Installs a plugin into the CLI.

```
USAGE
  $ gamekeeper-cli plugins:install PLUGIN...

ARGUMENTS
  PLUGIN  Plugin to install.

FLAGS
  -f, --force    Run yarn install with force flag.
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Installs a plugin into the CLI.

  Can be installed from npm or a git url.

  Installation of a user-installed plugin will override a core plugin.

  e.g. If you have a core plugin that has a 'hello' command, installing a user-installed plugin with a 'hello' command
  will override the core plugin implementation. This is useful if a user needs to update core plugin functionality in
  the CLI without the need to patch and update the whole CLI.

ALIASES
  $ gamekeeper-cli plugins add

EXAMPLES
  $ gamekeeper-cli plugins:install myplugin 

  $ gamekeeper-cli plugins:install https://github.com/someuser/someplugin

  $ gamekeeper-cli plugins:install someuser/someplugin
```

## `gamekeeper-cli plugins:inspect PLUGIN...`

Displays installation properties of a plugin.

```
USAGE
  $ gamekeeper-cli plugins:inspect PLUGIN...

ARGUMENTS
  PLUGIN  [default: .] Plugin to inspect.

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Displays installation properties of a plugin.

EXAMPLES
  $ gamekeeper-cli plugins:inspect myplugin
```

## `gamekeeper-cli plugins:install PLUGIN...`

Installs a plugin into the CLI.

```
USAGE
  $ gamekeeper-cli plugins:install PLUGIN...

ARGUMENTS
  PLUGIN  Plugin to install.

FLAGS
  -f, --force    Run yarn install with force flag.
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Installs a plugin into the CLI.

  Can be installed from npm or a git url.

  Installation of a user-installed plugin will override a core plugin.

  e.g. If you have a core plugin that has a 'hello' command, installing a user-installed plugin with a 'hello' command
  will override the core plugin implementation. This is useful if a user needs to update core plugin functionality in
  the CLI without the need to patch and update the whole CLI.

ALIASES
  $ gamekeeper-cli plugins add

EXAMPLES
  $ gamekeeper-cli plugins:install myplugin 

  $ gamekeeper-cli plugins:install https://github.com/someuser/someplugin

  $ gamekeeper-cli plugins:install someuser/someplugin
```

## `gamekeeper-cli plugins:link PLUGIN`

Links a plugin into the CLI for development.

```
USAGE
  $ gamekeeper-cli plugins:link PLUGIN

ARGUMENTS
  PATH  [default: .] path to plugin

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Links a plugin into the CLI for development.

  Installation of a linked plugin will override a user-installed or core plugin.

  e.g. If you have a user-installed or core plugin that has a 'hello' command, installing a linked plugin with a 'hello'
  command will override the user-installed or core plugin implementation. This is useful for development work.

EXAMPLES
  $ gamekeeper-cli plugins:link myplugin
```

## `gamekeeper-cli plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ gamekeeper-cli plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ gamekeeper-cli plugins unlink
  $ gamekeeper-cli plugins remove
```

## `gamekeeper-cli plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ gamekeeper-cli plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ gamekeeper-cli plugins unlink
  $ gamekeeper-cli plugins remove
```

## `gamekeeper-cli plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ gamekeeper-cli plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ gamekeeper-cli plugins unlink
  $ gamekeeper-cli plugins remove
```

## `gamekeeper-cli plugins update`

Update installed plugins.

```
USAGE
  $ gamekeeper-cli plugins update [-h] [-v]

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Update installed plugins.
```
<!-- commandsstop -->
