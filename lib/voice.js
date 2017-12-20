
const crypto = require('crypto');
const spawn = require('child_process').spawn;
const async = require('async');
const fs = require('fs');
const ttsTools = require('./ttsTools.js');

const Voice = function( baseFolder, lang ) {
  this._baseFolder = baseFolder;
  this._lang = lang;
  this._spawns = [];
}


Voice.prototype.say = function(text, cb ) {
  const that = this;
  that.shutup();

  text = text.toLowerCase();
  this._currentText = text;
  // get filename from text

  const parts = ttsTools.split({text: text});

  async.eachSeries( parts, function( part, nextPart ) {
    if( !part || that._currentText != text ) {
      return nextPart();
    }

    const hash = crypto.createHash('md5');
    hash.update(part);
    const digest = hash.digest('hex');
    const fileName = that._baseFolder+'/'+that._lang+'/'+digest+'.mp3';

    fs.exists( fileName, function( exists ) {
      if( exists ) {
        const s = spawn('./play.sh',[fileName,1.5]);
        //const s = spawn('mpg123',[fileName]);
        that._spawns.push( s ); // hack to identify the childprocess
        s.stdout.on('end', nextPart );
      } else {
        console.log( 'No audio for text:', text, part );
        nextPart();
      }
    } );
  }, function(err) {
    that._spawns.length = 0;
    cb(err);
  } );

}

Voice.prototype.spell = function( text, cb ) {
  const that = this;
  const chars = text.split('');

  async.eachSeries( chars, function( text, nextText ) {
    that.say( text, nextText );
  }, cb );

}

Voice.prototype.shutup = function() {
  if (this._spawns.length > 0 ) {
    this._spawns.forEach( function(s) {
      s.stdin.pause();
      s.kill();
    } );
    this._spawns.length = 0;
  }
  // important or sometimes wallet will overtalk itself
  spawn( 'killall', ['mplayer']);
}

module.exports = Voice;

