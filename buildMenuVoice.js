
const async = require('async');
const tts = require('./lib/tts.js');
const menuJSON = require('./menu.json');
const _ = require('lodash');
const fs = require('fs');

var index = {};

// TODO: read from file
var texts = [
  'a', 'b', 'c', 'd', 'e', 'f',
  'g', 'h', 'i', 'j', 'k', 'l',
  'm', 'n', 'o', 'p', 'q', 'r',
  's', 't', 'u', 'v', 'w', 'x',
  'y', 'z', 'current view'];

const views = menuJSON.views ;

_.each( views, function(view) {
  if( _.indexOf( texts, view.speak )===-1  ) {
    texts.push(view.speak);
  }

  _.each( view.options, function(option) {
    if(  _.indexOf( texts, option.speak )===-1 ) {
      texts.push(option.speak);
    }

  });

});


console.log( JSON.stringify(texts,null,4));

async.eachLimit( texts, 1, function( text, nextEach ) {
  text = text.toLowerCase();
  tts.get( text, 'en', 10.0, 'tts/en', function(err,r) {
    if( err ) return nextEach(err);
    index[r.text] = r.digest;
    console.log( r.text,'->',r.digest);
    nextEach();
  })
}, function(err) {
  const fileName = 'tts/en/menu.json';
  fs.writeFileSync( fileName, JSON.stringify(index,null,4) );
  console.log( 'done' );
})



