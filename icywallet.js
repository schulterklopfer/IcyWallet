var wrap = require('wordwrap')(80);
var keypress = require('keypress');
var player = require('play-sound')(opts = {player: 'mpg321'})
var mpg321 = require('mpg321');
var bip39 = require('bip39');
var crypto = require('crypto');
var bitcoin = require('bitcoinjs-lib');
var bitcoinNetwork = bitcoin.networks.bitcoin
const { exec } = require('child_process');
const readline = require('readline');
const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});

console.log('Test complete.');