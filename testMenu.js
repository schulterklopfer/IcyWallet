'use strict';


const menuJson = require( './menu.json' );
const Menu = require( './lib/menu.js' );


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


const m = new Menu();
  m.loadFromJSON( menuJson, function(err) {
  console.log( "json loaded" );

  m.readCurrentView(function(err) {
    console.log( "menu finished" );
  });

} );


