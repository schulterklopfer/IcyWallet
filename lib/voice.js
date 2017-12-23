
const crypto = require('crypto');
const spawn = require('child_process').spawn;
const async = require('async');
const fs = require('fs');
const _ = require('lodash');
const ttsTools = require('./ttsTools.js');

const Voice = function( baseFolder, lang ) {
  this._baseFolder = baseFolder;
  this._lang = lang;
  this._spawn;
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

        files.push('-i '+fileName );
        filters.push( '['+(channel++)+':0]');

      }
    }
  }

  delete that._spawn;

  // build input files arguments for ffmpeg
  const filesStr = files.join(' ');

  // build complex filter for concatenation and speedup
  const filtersStr = filters.join('')+'concat=n='+(filters.length)+':v=0:a=1[i];[i]atempo='+tempo+'[out]';

  that._spawn = spawn('./play.sh',[filesStr,filtersStr]);
  that._spawn.stdout.on('end', cb);


}

Voice.prototype.shutup = function() {
  if ( this._spawn ) {
    this._spawn.kill();
    delete this._spawn;
  }
  // important or sometimes wallet will overtalk itself
  spawn( 'killall', ['mplayer']);
}

module.exports = Voice;

