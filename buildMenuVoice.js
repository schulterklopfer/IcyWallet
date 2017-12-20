
const async = require('async');
const tts = require('./lib/tts.js');
const menuJSON = require('./menu.json');
const _ = require('lodash');
const fs = require('fs');
const ttsTools = require('./lib/ttsTools.js');

var index = {};

const contexts = ['init', 'default'];

// TODO: read from file
var texts = [
  'a', 'b', 'c', 'd', 'e', 'f',
  'g', 'h', 'i', 'j', 'k', 'l',
  'm', 'n', 'o', 'p', 'q', 'r',
  's', 't', 'u', 'v', 'w', 'x',
  'y', 'z', 'current view'];

const views = menuJSON.views ;

_.each( views, function(view) {

  _.each( contexts, function( context ) {
    if( view[context] ) {
      if( _.indexOf( texts, view[context].speak )===-1  ) {

        texts = texts.concat(ttsTools.split( {text: view[context].title} ));
        texts = texts.concat(ttsTools.split( {text: view[context].speak} ));

      }

      _.each( view[context].options, function(option) {
        if(  _.indexOf( texts, option.speak )===-1 ) {
          texts = texts.concat(ttsTools.split( {text: option.speak} ));
        }

      });
    }
  });
});

texts = texts.filter(function(n){ return !!n; });


console.log( JSON.stringify(texts,null,4));

async.eachLimit( texts, 1, function( text, nextEach ) {
  text = text.toLowerCase();
  tts.get( text, 'en', 1.0, 'tts/en', function(err,r) {
    if( err ) return nextEach(err);
    index[r.text] = r.digest;
    nextEach();
  })
}, function(err) {
  console.log( err );
  const fileName = 'tts/en/menu.json';
  fs.writeFileSync( fileName, JSON.stringify(index,null,4) );
  console.log( 'done' );
})



