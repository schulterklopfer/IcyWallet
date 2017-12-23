
const crypto = require('crypto');
const spawn = require('child_process').spawn;
const fs = require('fs');
const _ = require('lodash');
const ttsTools = require('./ttsTools.js');

const __handleFfmpegStdoutData = function( data ) {
  if( __player.stdin.writable ) {
    __player.stdin.write(data);
  }
}

const __handleFfmpegClose = function( code ) {
  __player.stdin.end();
}

const __handlePlayerClose = function( code ) {
  //console.log(`player process exited with code ${code}`);
}

const __handlePlayerStdinError = function() {
  // catch EPIPE from killing processes ...
}


let __ffmpeg;
let __player;


const Voice = function( baseFolder, lang ) {
  this._baseFolder = baseFolder;
  this._lang = lang;
}


Voice.prototype.say = function(texts, tempo, cb ) {


  if( !_.isArray(texts) ) {
    texts = [texts];
  }

  const that = this;
  that.shutup();

  // get filename from text
  let files = [];
  let filters = [];


  let channel = 0;

  for( let i=0; i<texts.length; i++ ) {

    const text = texts[i].toLowerCase();

    const parts = ttsTools.split({text: text});

    for( let j=0; j<parts.length; j++ ) {
      const part = parts[j].toLowerCase();

      if( !part ) {
        continue;
      }

      const hash = crypto.createHash('md5');
      hash.update(part);
      const digest = hash.digest('hex');
      const fileName = that._baseFolder+'/'+that._lang+'/'+digest+'.mp3';

      // not nice but removes complexity
      if( fs.existsSync( fileName ) ) {

        files = files.concat(['-i',fileName] );
        filters.push( '['+(channel++)+':0]');

      }
    }
  }

  // build complex filter for concatenation and speedup
  const filtersStr = filters.join('')+'concat=n='+(filters.length)+':v=0:a=1[i];[i]atempo='+tempo.toFixed(2)+'[out]';
  const ffmpegArgs = files.concat([ "-filter_complex", filtersStr, "-map", "[out]", "-f", "wav", "-"]);

  __ffmpeg = spawn( '/usr/local/bin/ffmpeg', ffmpegArgs );
  __player = spawn( '/usr/local/bin/mplayer', ["-cache","2048", "-"] );


  __ffmpeg.stdout.on('data', __handleFfmpegStdoutData );
  __player.stdin.on('error',__handlePlayerStdinError);
  __ffmpeg.on('close', __handleFfmpegClose );
  __player.on('close', __handlePlayerClose );

}

Voice.prototype.shutup = function() {

  if ( __ffmpeg ) {
    __ffmpeg.kill();
  }

  if ( __player ) {
    __player.kill();
  }

  __ffmpeg = __player = undefined;


}

module.exports = Voice;

