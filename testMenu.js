'use strict';


const menuJson = require( './menu.json' );
const Menu = require( './lib/menu.js' );
const Voice = require('./lib/voice.js');
const Wallet = require('./lib/wallet.js');


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


const unhandledMenuInput = function( input ) {
  console.log( input );
}

const v = new Voice('tts','en');
const m = new Menu( {voice: v, unhandledInputCallback: unhandledMenuInput } );
const w = new Wallet( {voice: v} );

console.log();

//w.readMnemonics();


m.registerAction('wallet.init', function( params, next ) {

  w.init();
  w.readMnemonic(0,next);

})

m.setContext('init');

m.loadFromJSON( menuJson, function(err) {

  m.start( function(err) {} );

} );


