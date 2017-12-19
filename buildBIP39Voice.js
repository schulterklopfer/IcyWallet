
const async = require('async');
const tts = require('./lib/tts.js');
const _ = require('lodash');
const fs = require('fs');

var index = {};

const wordlists = require('bip39').wordlists;

const texts = wordlists.english;

async.eachLimit( texts, 10, function( text, nextEach ) {
  text = text.toLowerCase();
  tts.get( text, 'en', 1, 'tts/en', function(err,r) {
    if( err ) return nextEach(err);
    index[r.text] = r.digest;
    console.log( r.text,'->',r.digest);
    nextEach();
  });
}, function(err) {
  const fileName = 'tts/en/bip39.json';
  fs.writeFileSync( fileName, JSON.stringify(index,null,4) );
  console.log( 'done' );
})




