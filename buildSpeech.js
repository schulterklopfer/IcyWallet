
const async = require('async');
const googleTTS = require('google-tts-api');
const request = require('request');
const fs = require('fs');
const crypto = require('crypto');
const menuJSON = require('./menu.json');
const _ = require('lodash');

const tts = function( text, baseFolder, cb ) {

  async.waterfall( [
    function( nextWaterfall ) {
      // render and request url
      const hash = crypto.createHash('md5');
      hash.update(text);

      const digest = hash.digest('hex');

      googleTTS(text, 'en', 1)
        .then(function (url) {
          nextWaterfall(null,text, url, baseFolder, digest);
        })
        .catch(function (err) {
          nextWaterfall(err);
        });
    },
    function( text, url, baseFolder, digest, nextWaterfall ) {
      const fileName = baseFolder+'/'+digest+'.mp3';
      const file = fs.createWriteStream(fileName);
      request.get(url).pipe(file).on('close', function() {
        console.log( "saved file" );
        nextWaterfall(null,{ text: text, fileName: fileName, digest: digest } );
      });

    }
  ], cb );

}

var index = {};

var texts = ['current view', 'press'];

const views = menuJSON.views ;



_.each( views, function(view) {
  if( _.indexOf( texts, view.title )===-1  ) {
    texts.push(view.title);
  }

  _.each( view.options, function(option,key) {
    if(  _.indexOf( texts, option.title )===-1 ) {
      texts.push(option.title);
    }

    if( _.indexOf( texts, key )===-1 ) {
      texts.push(key);
    }
  });

});


console.log( JSON.stringify(texts,null,4));

async.eachLimit( texts, 1, function( text, nextEach ) {
  text = text.toLowerCase();
  tts( text, 'tts/en', function(err,r) {
    if( err ) return nextEach(err);
    index[r.text] = r.digest;
    nextEach();
  })
}, function(err) {
  console.log( JSON.stringify(index,null,4));
})


/**/
