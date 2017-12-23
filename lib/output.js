
const _ = require('lodash');
const wrap = require('wordwrap')(80);

const Output = function( opt ) {
  this._voice = opt.voice;
  this._stdout = opt.stdout;
}

Output.prototype.writeln = function( texts, opt, cb ) {

  if( cb === undefined && _.isFunction(opt) ) {
    cb = opt;
    opt = undefined;
  }

  opt = opt || {};

  opt.appendNewline = true;

  this.write( texts, opt, cb );
};

Output.prototype.write = function( texts, opt, cb ) {

  if( !_.isArray(texts) ) {
    texts = [texts];
  }

  if( cb === undefined && _.isFunction(opt) ) {
    cb = opt;
    opt = undefined;
  }

  opt = opt || {};

  const useVoice = !!!opt.noVoice;
  const appendNewline = !!opt.appendNewline;

  const text = texts.join('\n');

  if( this._voice !== undefined && useVoice ) {
    if( this._stdout !== undefined ) {
      this._stdout.write( wrap(text) + (appendNewline?'\n':''));
    }

    this._voice.say( texts, 1.5, cb );
  } else {
    this._stdout.write( wrap(text) + (appendNewline?'\n':''));
    cb();
  }

}

Output.prototype.shutup = function() {
  if( this._voice !== undefined ) {
    this._voice.shutup();
  }
}

module.exports = Output;