
const readline = require('readline');
const _ = require( 'lodash' );
const Voice = require('./voice.js');
const async = require('async');

const debug = function() {
  if( module.parent.exports.logger ) {
    module.parent.exports.logger.debug.apply(null, [].slice.apply(arguments));
  }
}

const error = function() {
  if( module.parent.exports.logger ) {
    module.parent.exports.logger.error.apply(null, [].slice.apply(arguments));
  }
}

const warn = function() {
  if( module.parent.exports.logger ) {
    module.parent.exports.logger.warn.apply(null, [].slice.apply(arguments));
  }
}

const Menu = function() {
  this._voice = new Voice('tts','en');
  this.actions = {
    '[navigate]': function( params ) {
      debug( 'internal action: navigate', params );
    },

    '[back]' : function( params ) {
      debug( 'internal action: back', params );
    },

    '[cancel]' : function( params ) {
      debug( 'internal action: cancel', params );
    },
    '[next]' : function( params ) {
    debug( 'internal action: next', params );
  }
  };
}


Menu.prototype.loadFromJSON = function(json, cb) {
  debug( "loading from json" );

  if( !json.entryPoint ) {
    return cb( new Error("No entry point") );
  }

  if( !json.views || !_.isPlainObject(json.views) ) {
    return cb( new Error( "No views" ))
  }

  const that = this;

  this._json = json;
  this._currentView = this._json.entryPoint;
  this._speaking = {};

  this._readline = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  this._readline
    .on('line', function(line, lineCount, byteCount) {
      that.handleInput( line.trim() );
    })
    .on('error', function(e) {
      error( e );
    });

  cb();
};

Menu.prototype.readCurrentView = function( readCurrentViewFinished ) {
  const view =  _.get( this._json, 'views.'+this._currentView );
  const options = _.get( this._json, 'views.'+this._currentView+'.options' );
  const cv = this._currentView;
  const that = this;

  if( !view ) {
    return readCurrentViewFinished( new Error( "No current view" ) );
  }

  debug( "reading current view");

  async.waterfall( [
    function( nextWaterfall ) {
      that._speaking[cv] = true;
      nextWaterfall();
    },
    function( nextWaterfall ) {
      // read current view
      if( !that._speaking[cv] ) return nextWaterfall();
      that._voice.say( 'Current view', nextWaterfall );
    },
    function( nextWaterfall ) {
      // read current view
      if( !that._speaking[cv] ) return nextWaterfall();
      that._voice.say( view.title, nextWaterfall )
    },
    function( nextWaterfall ) {
      // read options

      if( !options || !_.isPlainObject( options ) ) {
        warn( "No options for current screen"  );
        return nextWaterfall();
      }

      const optionKeys = _.keys(options).sort();

      if( !that._speaking[cv] ) return nextWaterfall();
      async.eachSeries( optionKeys, function( key, nextEach ) {
        const option = options[key];
        async.eachSeries( ['press', key, option.title], function( text, nextText ) {
          if( !that._speaking[cv] ) return nextText();
          that._voice.say( text, nextText );
        }, nextEach );
      }, nextWaterfall )
    },function( nextWaterfall ) {
      delete that._speaking[cv];
    }
  ], readCurrentViewFinished );


}

Menu.prototype.handleInput = function(input) {
  debug( "handle input", input, 'in view', this._currentView );
  const that= this;

  const cv = this._currentView;


  const view = _.get( this._json, 'views.'+cv );
  const option = _.get( this._json, 'views.'+cv+'.options.'+input );

  if( !option || !_.isPlainObject(option) ) {
    return warn( 'No such option for', this._currentView );
  }

  debug( option );

  this._speaking[cv] = false;
  this._voice.shutup();


  if( option.navigate ) {
    if( option.navigate === '[next]' ) {
      if( view.next ) {
        that._currentView = view.next;
        that.readCurrentView( function( err ) {

        } );
      }
    } else if( option.navigate === '[back]' ) {
      that._currentView = that._json.entryPoint;
      that.readCurrentView( function( err ) {

      } );
    }
  }



};

Menu.prototype.registerAction = function( action, cb ) {

  if( !_.isString( action ) || !action.match(/^[A-Za-z0-9.]+$/ ) ) {
    error( "Action must be a string and must only contain [A-Za-z0-9\.]" );
    return;
  }

  if( cb === undefined ) {
    if( this.actions[action] ) {
      delete this.actions[action];
    }
  } else {
    if( !_.isFunction(cb) ) {
      error( "Action method must be a function" );
      return;
    }

    this.actions[action] = cb;

  }
}

Menu.prototype.deregisterAction = function( action ) {
  this.registerAction(action,undefined);
}

Menu.prototype.executeAction = function( action, params ) {
  const cb = this.actions[action];

  if( !cb || !_.isFunction(cb) ) {
    error( "no such action" );
    return;
  }

  cb.apply( this, [params] );
}


module.exports = Menu;
