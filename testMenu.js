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

console.log(w.init());

//w.readMnemonics();


m.registerAction('wait', function( params, next ) {
  const time = parseInt(params.ms);
  setTimeout( next, time );
})

m.setContext('init');

m.loadFromJSON( menuJson, function(err) {

  m.start( function(err) {} );

  //w.checkWord(0,function(err,word) {
  //  console.log( word );
  //} )

} );


