
const async = require('async');
const tts = require('./lib/tts.js');
const _ = require('lodash');
const fs = require('fs');

var index = {};

const texts = [
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
  'The twelfth word is:',
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

async.eachLimit( texts, 10, function( text, nextEach ) {
  text = text.toLowerCase();
  tts.get( text, 'en', 1, 'tts/en', function(err,r) {
    if( err ) return nextEach(err);
    index[r.text] = r.digest;
    console.log( r.text,'->',r.digest);
    nextEach();
  });
}, function(err) {
  const fileName = 'tts/en/wallet.json';
  fs.writeFileSync( fileName, JSON.stringify(index,null,4) );
  console.log( 'done' );
})




