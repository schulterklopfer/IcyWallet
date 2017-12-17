
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
  const that = this;
  this._voice = new Voice('tts','en');
  this._actions = {
    '[navigate]': function( viewId ) {
      debug( 'internal action: navigate', viewId );
      that.navigateTo( viewId );
      that.readCurrentView( function( err ) {

      } );
    },

    '[back]' : function() {
      debug( 'internal action: back' );
      that.navigateBack();
      that.readCurrentView( function( err ) {

      } );
    },

    '[cancel]' : function() {
      debug( 'internal action: cancel' );
      this['[back]']();
    },
    '[next]' : function() {
      debug( 'internal action: next' );
      that.navigateForward();
      that.readCurrentView( function( err ) {

      } );
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
  this._history = [this._json.entryPoint];
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

Menu.prototype.navigateTo = function( viewId ) {

  this._history.push( viewId );

}

Menu.prototype.navigateForward = function() {
  const view = this.getCurrentView();

  if( view && view.next ) {
    this.navigateTo( view.next );
  }

}

Menu.prototype.navigateBack = function() {
  if( this._history.length <= 1 ) {
    return;
  }
  this._history.pop();
}

Menu.prototype.getCurrentViewId = function() {
  return this._history[this._history.length-1];
}

Menu.prototype.getCurrentView = function() {
  return _.get( this._json, 'views.'+this.getCurrentViewId() );
}

Menu.prototype.readCurrentView = function( readCurrentViewFinished ) {
  const view =  this.getCurrentView();
  const options = view.options;
  const cv = this.getCurrentViewId();
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

  const that = this;
  const cv = this.getCurrentViewId();
  const view = this.getCurrentView();
  const option = view.options[input];

  if( !option || !_.isPlainObject(option) ) {
    return warn( 'No such option for', cv );
  }

  debug( option );

  this._speaking[cv] = false;
  this._voice.shutup();


  const navigate = function() {
    if( option.navigate ) {

      if( that._actions[option.navigate] !== undefined ) {
        that._actions[option.navigate]();
      } else {
        that._actions['[navigate]'](option.navigate);
      }

    }
  }

  if( option.action ) {
    if( this._actions[option.action] ) {
      this.executeAction( option.action, option.actionParams, navigate );
    }
  } else {
    navigate();
  }

};

Menu.prototype.registerAction = function( action, cb ) {


  if( !_.isString( action ) || !action.match(/^[A-Za-z0-9.]+$/ ) ) {
    error( "Action must be a string and must only contain [A-Za-z0-9\.]" );
    return;
  }

  if( cb === undefined ) {
    if( this._actions[action] ) {
      delete this._actions[action];
    }
  } else {
    if( !_.isFunction(cb) ) {
      error( "Action method must be a function" );
      return;
    }

    this._actions[action] = cb;

    console.log( JSON.stringify(this._actions,null,4));

  }
}

Menu.prototype.deregisterAction = function( action ) {
  this.registerAction(action,undefined);
}

Menu.prototype.executeAction = function( action, params, next ) {
  const cb = this._actions[action];

  if( !cb || !_.isFunction(cb) ) {
    error( "no such action" );
    return;
  }

  cb.apply( this, [params,next] );
}


module.exports = Menu;
