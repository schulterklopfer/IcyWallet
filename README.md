# IcyWallet

_Accessible Bitcoin cold storage_

Finally, a Bitcoin cold storage wallet that doesn’t require sight. From seed to spend, IcyWallet aims to be the simplest and most secure Bitcoin cold storage solution—with a total emphasis on accessibility. Just plug in headphones and a keyboard, or a refreshable braille display, and get going.

[<img src="https://icywallet.com/samples/icywallet_angle.jpg" width="300" height="300" alt="An IcyWallet device, angle view" title="An IcyWallet device, angle view">](https://icywallet.com/samples/icywallet_angle.jpg)
[<img src="https://icywallet.com/samples/icywallet_overhead.jpg" width="300" height="300" alt="An IcyWallet device, top view" title="An IcyWallet device, top view">](https://icywallet.com/samples/icywallet_overhead.jpg)

## Features

* 100% [free and open source](https://github.com/pugsh/IcyWallet)
* Boots directly into the wallet app with functioning audio and braille support (via [BRLTTY](https://github.com/brltty/brltty))
* All interactions designed for the best possible accessible experience
* Generates hierarchical deterministic wallets with mnemonic seeds for safe backup
* Uses the proven and reliable [BitcoinJS](https://bitcoinjs.org) library

## Audio Previews

* [Start-up](https://icywallet.com/samples/welcome.mp3)
* [Intro to the wallet creation process](https://icywallet.com/samples/new_wallet.mp3)
* [Seed word generation](https://icywallet.com/samples/seed_word.mp3)

## Chat & Support

We’re using [Keybase](https://keybase.io) Teams for project communication. Join the IcyWallet team if you’d like to chat!

## Development

### Current Status

Development is underway and you can view the [master branch commits](https://github.com/pugsh/IcyWallet/commits/master) for the latest activity. The [master branch](https://github.com/pugsh/IcyWallet/tree/master) is the active development branch, **which should should not be used with coins** (but is ideal for testing). There is no stable release at this time.

[![Build Status](https://travis-ci.org/pugsh/IcyWallet.svg?branch=master)](https://travis-ci.org/pugsh/IcyWallet) [![Dependencies Status](https://david-dm.org/pugsh/icywallet/status.svg)](https://david-dm.org/pugsh/icywallet) [![Known Vulnerabilities](https://snyk.io/test/github/pugsh/icywallet/badge.svg)](https://snyk.io/test/github/pugsh/icywallet)

### Progress

| Item                                       | Status   | Notes                            | Updated    |
| ------------------------------------------ | -------- | -------------------------------- | ---------- |
| Wallet generation                          | Complete | Private key generated and stored | 2017-11-21 |
| Mnemonic backup seed process               | 90%      | Wrapping up confirmation process | 2017-11-21 |
| Speech synthesis process                   | Complete | Combined with localization       | 2017-11-25 |
| Language localization process              | Complete | Combined with speech synthesis   | 2017-11-25 |
| Config: Language                           | 10%      |                                  | 2017-11-26 |
| Config: Voice speed                        | 10%      |                                  | 2017-11-26 |
| Config: Refreshable braille display model  | Pending  |                                  |            |
| Fee estimation                             | Pending  |                                  |            |
| Data movement process                      | Pending  |                                  |            |
| Transaction signing                        | Pending  |                                  |            |
| Upgrade process                            | Pending  |                                  |            |

## Press

- [This Developer Is Making The First Bitcoin Wallet For The Blind](http://www.ibtimes.com/developer-making-first-bitcoin-wallet-blind-2618126), International Business Times, 11/21/2017
- [Creating the World's First Bitcoin Wallet for the Blind](http://bitcoinist.com/creating-worlds-first-bitcoin-wallet-blind/), Bitcoinist, 11/25/2017

## License

This project is licensed under the [MIT License](LICENSE.md).

## Author

IcyWallet is a [Pug](https://pug.sh) project, by [Adam Newbold](https://github.com/newbold).