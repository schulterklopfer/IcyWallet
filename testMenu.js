'use strict';


const menuJson = require( './menu.json' );
const Menu = require( './lib/menu.js' );
const Voice = require('./lib/voice.js');
const Wallet = require('./lib/wallet.js');
const Output = require('./lib/output.js');
const readline = require('readline');


const handleInput = function( line, lineCount, byteCount ) {
  m.handleInput( line.trim(), function( err, handled ) {
    console.log( line, handled );

  } );
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl
  .on('line', function(line, lineCount, byteCount) {
    handleInput( line, lineCount, byteCount );
  })
  .on('error', function(e) {
    error( e );
  });

const logger = {
  debug: function () {
    console.log.apply(null, [].slice.apply(arguments));
  },
  error: function () {
    console.log.apply(null, [].slice.apply(arguments));
  },
  warn: function () {
    console.log.apply(null, [].slice.apply(arguments));
  }
}

module.exports = {
  logger: logger
}



const o = new Output( { voice: new Voice('tts','en'), speed: 1.0, stdout: process.stdout } );
const m = new Menu( {output: o } );
const w = new Wallet( {output: o} );

m.registerAction('wallet.init', function( params, next ) {
  w.init();
  next();
});


let currentIndex=0;

m.registerAction('mnemonic.speakWord', function( params, next ) {
  w.readMnemonic(currentIndex,function(err) {
    console.log( "finished reading", currentIndex);
    next();
  });
});

m.registerAction('mnemonic.nextWord', function( params, next ) {
  currentIndex++;
  next();
});


m.setContext('init');

m.loadFromJSON( menuJson );

m.start( function(err) {} );




