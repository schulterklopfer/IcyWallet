const _ = require( 'lodash' );
const async = require('async');
const fs = require('fs');
const bip39 = require('bip39');
const crypto = require('crypto');
const bitcoin = require('bitcoinjs-lib');
const keypress = require('keypress');
const bitcoinNetwork = bitcoin.networks.bitcoin;
const wrap = require('wordwrap')(80);

const debug = function() {
  if( module.parent.exports.logger ) {
    module.parent.exports.logger.debug.apply(null, [].slice.apply(arguments));
  }
}

const error = function() {
  if( module.parent.exports.logger ) {
    module.parent.exports.logger.error.apply(null, [].slice.apply(arguments));
  }
}

const warn = function() {
  if( module.parent.exports.logger ) {
    module.parent.exports.logger.warn.apply(null, [].slice.apply(arguments));
  }
}

const Wallet = function( options ) {
  const that = this;
  this._voice = (options || {}).voice;


  this._texts = [
    'The first word is:',
    'The second word is:',
    'The third word is:',
    'The fourth word is:',
    'The fifth word is:',
    'The sixth word is:',
    'The seventh word is:',
    'The eighth word is:',
    'The ninth word is:',
    'The tenth word is:',
    'The eleventh word is:',
    'The twelfth word is:'
  ];

  this._questions = [
    'What is the first word?',
    'What is the second word?',
    'What is the third word?',
    'What is the fourth word?',
    'What is the fifth word?',
    'What is the sixth word?',
    'What is the seventh word?',
    'What is the eighth word?',
    'What is the ninth word?',
    'What is the tenth word?',
    'What is the eleventh word?',
    'What is the twelfth word?'
  ];

}


Wallet.prototype.init = function() {
  const mnemonic = bip39.generateMnemonic();
  const seed = bip39.mnemonicToSeed(mnemonic);
  const hdMaster = bitcoin.HDNode.fromSeedBuffer(seed, bitcoinNetwork);
  const key1 = hdMaster.derivePath('m/0\'/0/0')
  const address = key1.getAddress();
  const key = key1.keyPair.toWIF();
  const node = bitcoin.HDNode.fromSeedBuffer(seed);
  const xpub = node.neutered().toBase58();


  this.mnemonic = mnemonic.split(' ');
  this.seed = seed;
  this.address = address;
  this.key = key;
  this.xpub = xpub;


  return [mnemonic, seed, address, key, xpub]

}

Wallet.prototype.readMnemonics = function( readMnemonicsFinished ) {
  const that = this;

  async.eachOfSeries( this.mnemonic, function( m, i, next ) {
    const t = that._texts[i];
    const spelling = m.split('');

    async.waterfall( [
      function( nextWaterfall ) {
        async.eachSeries( [t, m], function( text, nextEach ) {
          that.out( text, nextEach );
        }, nextWaterfall );
      },
      function( nextWaterfall ) {
        async.eachSeries( spelling, function( text, nextEach ) {
          that.out( text, nextEach );
        }, nextWaterfall );

      },
      function( nextWaterfall ) {
        that.out( m, nextWaterfall );
      },

    ], next );

  }, readMnemonicsFinished );

};


Wallet.prototype.readMnemonic = function( wordIndex, readMnemonicFinished ) {
  const that = this;

  if( wordIndex < 0 || wordIndex >= 12 ) {
    return readMnemonicFinished( new Error('no such word') );
  }

  const t = that._texts[wordIndex];
  const m = that.mnemonic[wordIndex];
  const spelling = m.split('');

  async.waterfall( [
    function( nextWaterfall ) {
      async.eachSeries( [t, m], function( text, nextEach ) {
        that.out( text, nextEach );
      }, nextWaterfall );
    },
    function( nextWaterfall ) {
      async.eachSeries( spelling, function( text, nextEach ) {
        that.out( text, nextEach );
      }, nextWaterfall );

    },
    function( nextWaterfall ) {
      that.out( m, nextWaterfall );
    },

  ], readMnemonicFinished );


};

Wallet.prototype.checkWord = function( i, checkWordCallback ) {

  const that = this;

  if( i < 0 || i >= 12 ) {
    return checkWordCallback(new Error("Index out of range"));
  }

  that.out( that._questions[i], function(err) {
    if( err ) {
      return checkWordCallback(err);
    }

    checkWordCallback( null, that.mnemonic[i] );

  } );

};


Wallet.prototype.out = function( text, cb ) {
  this._voice.say( text, cb );
}

module.exports = Wallet;