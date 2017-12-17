
const crypto = require('crypto');
const spawn = require('child_process').spawn;
const async = require('async');
const fs = require('fs');

const Voice = function( baseFolder, lang ) {
  this._baseFolder = baseFolder;
  this._lang = lang;
}


Voice.prototype.say = function(text, cb ) {
  const that = this;
  text = text.toLowerCase();
  // get filename from text
  const hash = crypto.createHash('md5');
  hash.update(text);
  const digest = hash.digest('hex');
  const fileName = this._baseFolder+'/'+this._lang+'/'+digest+'.mp3';

  fs.exists( fileName, function( exists ) {
    if( exists ) {
      that.shutup();

      //ffmpeg -i deposit.wav -filter:a "atempo=1.7" -f wav - | mplayer -cache 128 -

      that._c = spawn('./play.sh',[fileName,1.5]);

      //that._c = spawn('mpg123', [fileName]);

      that._c.stdout.on('end', cb);

    } else {
      cb( new Error( 'No audio for text:',text ) );
    }
  } );
}

Voice.prototype.spell = function( text, cb ) {
  const that = this;
  text = text.toLowerCase();

  const chars = text.split('');

  async.eachSeries( chars, function( text, nextText ) {
    that.say( text, nextText );
  }, cb );

}

Voice.prototype.shutup = function() {
  if (this._c) {
    this._c.kill();
  }
}

module.exports = Voice;

