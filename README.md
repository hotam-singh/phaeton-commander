![Logo](../docs/assets/banner_commander.png)

# Phaeton Commander

Phaeton Commander is a command line tool which allows you to manage a Phaeton node instance and interact with a Phaeton compatible network.

[![License: Apache 2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](http://www.apache.org/licenses/LICENSE-2.0)

## Installation

```sh
$ npm install --global --production phaeton-commander
```

Upon successful completion, NPM will add the `phaeton-commander` executable `phaeton` to your PATH.

## Usage

```sh-session
$ phaeton COMMAND
running command...
$ phaeton (-v|--version|version)
phaeton-commander/2.0.0 darwin-x64 node-v8.12.0
$ phaeton --help [COMMAND]
A command line interface for Phaeton

VERSION
  phaeton-commander/2.0.0 darwin-x64 node-v8.12.0

USAGE
  $ phaeton [COMMAND]

COMMANDS
  account      Commands relating to Phaeton accounts.
  block        Commands relating to Phaeton blocks.
  config       Manages Phaeton Commander configuration.
  core         Install and Manages Phaeton Core instances.
  copyright    Displays copyright notice.
  delegate     Commands relating to Phaeton delegates.
  help         Displays help.
  message      Commands relating to user messages.
  node         Commands relating to Phaeton node.
  passphrase   Commands relating to Phaeton passphrases.
  signature    Commands relating to signatures for Phaeton transactions from multisignature accounts.
  transaction  Commands relating to Phaeton transactions.
  warranty     Displays warranty notice.
```

### Running Tests

Phaeton Commander has an extensive set of unit tests. To run the tests, please install Phaeton Commander from source, and then run the command:

```sh
$ npm test
```

## Get Involved

| Reason                           | How                                                                                            |
| -------------------------------- | ---------------------------------------------------------------------------------------------- |
| Want to chat with our community  | [Chat with them on Phaeton.chat](http://phaeton.chat)                                                |
| Want to chat with our developers | [Chat with them on Gitter](https://gitter.im/PhaetonHQ/phaeton)                                      |
| Found a bug                      | [Open a new issue](https://github.com/PhaetonHQ/phaeton/issues/new)                                  |
| Found a security issue           | [See our bounty program](https://blog.phaeton.io/announcing-phaeton-bug-bounty-program-5895bdd46ed4) |
| Want to share your research      | [Propose your research](https://research.phaeton.io)                                              |
| Want to develop with us          | [Create a fork](https://github.com/PhaetonHQ/phaeton/fork)                                           |

## License

Copyright 2016-2019 Phaeton Foundation

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

---

[bugs]: https://github.com/PhaetonHQ/phaeton-commander/issues
[contribution guidelines]: docs/CONTRIBUTING.md
[gitter]: https://gitter.im/PhaetonHQ/phaeton
[license]: https://github.com/PhaetonHQ/phaeton-commander/tree/master/LICENSE
[phaeton chat]: https://phaeton.chat/home
[nvm]: https://github.com/creationix/nvm
# phaeton-commander
