
const _ = require( 'lodash' );
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

const Menu = function( options ) {
  const that = this;
  options = options || {};
  this._output = options.output;
  this._context = 'default';
  this._actions = {};
  this._navigate = {
    '[navigate]': function( viewId, cb ) {
      that.navigateTo( viewId );
      that.readCurrentView( function( err ) {
        cb(err);
      } );
    },

    '[back]' : function(cb) {
      that.navigateBack();
      that.readCurrentView( function( err ) {
        cb(err);
      } );
    },

    '[cancel]' : function(cb) {
      this['[back]'](cb);
    },
    '[next]' : function(cb) {
      that.navigateForward();
      that.readCurrentView( function( err ) {
        cb(err);
      } );
    }
  };
}

Menu.prototype.setContext = function( context ) {
  if( this._context == context ) return;
  this._context = context;
}

Menu.prototype.loadFromJSON = function(json, cb) {

  if( !json.entryPoint ) {
    return cb( new Error("No entry point") );
  }

  if( !json.views || !_.isPlainObject(json.views) ) {
    return cb( new Error( "No views" ))
  }

  // map option keys to lowercase
  _.each( json.views, function( view ) {
    _.each( view, function( context ) {
      context.options = _.mapKeys( context.options, function(value, key) {
        return key.toLowerCase();
      } );
    } );
  } );

  const that = this;

  this._json = json;
  this._history = [];
  this._speaking = {};

  this.navigateTo(this._json.entryPoint);
  cb();
};

Menu.prototype.start = function( cb ) {
  this.readCurrentView( cb );
}

Menu.prototype.navigateTo = function( viewId ) {

  const view = this.getView( viewId );

  if( view ) {
    this._history.push( viewId );
  }

}

Menu.prototype.clearHistory = function() {
  this._history.length = 0;
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
  return this.getView( this.getCurrentViewId() );
}

Menu.prototype.getView = function( viewId ) {
  return _.get( this._json, 'views.'+viewId+'.'+this._context );
}

Menu.prototype.readCurrentView = function( readCurrentViewFinished ) {
  const view =  this.getCurrentView();
  const options = view.options;
  const sKey = this.getCurrentViewId()+'_'+this._context;
  const that = this;

  if( !view ) {
    return readCurrentViewFinished( new Error( "No current view" ) );
  }

  async.waterfall( [
    function( nextWaterfall ) {
      that._speaking[sKey] = true;
      nextWaterfall();
    },
    function( nextWaterfall ) {
      // read current view
      if( !that._speaking[sKey] ) return nextWaterfall();
      that.out( view.speak, nextWaterfall );
    },
    function( nextWaterfall ) {
      // read options

      if( !options || !_.isPlainObject( options ) ) {
        return nextWaterfall();
      }

      const optionKeys = _.keys(options).sort();

      if( !that._speaking[sKey] ) return nextWaterfall();
      async.eachSeries( optionKeys, function( key, nextEach ) {
        const option = options[key];
        if( !that._speaking[sKey] ) return nextEach();
        that.out( option.speak, nextEach );
      }, nextWaterfall );
    },function( nextWaterfall ) {
      delete that._speaking[sKey];
      nextWaterfall();
    }
  ], function(err) {
    console.log( err );
    readCurrentViewFinished();
  } );


}

Menu.prototype.out = function( text, cb ) {
  this._output.writeln( text, cb );
}

Menu.prototype.handleInput = function(input, cb) {

  const that = this;
  const sKey = this.getCurrentViewId()+'_'+this._context;
  const view = this.getCurrentView();
  // since all option keys are transformed to lower case all possible cases are matched
  // STarT will match START or start or any other upper/lower case combination of start
  const option = view.options[input.toLowerCase()];

  if( !option || !_.isPlainObject(option) ) {
    return cb(null,false);
  }

  this._speaking[sKey] = false;
  this._output.shutup();
  
  const navigate = function( localOption, cb ) {
    if( localOption.setContext ) {
      that.setContext( localOption.setContext );
    }

    if( localOption.navigate ) {

      if( that._navigate[localOption.navigate] !== undefined ) {
        that._navigate[localOption.navigate]( cb );
      } else {
        that._navigate['[navigate]'](localOption.navigate, cb );
      }

    } else {
      cb();
    }
  }

  if( option.action ) {
    if( this._actions[option.action] ) {
      this.executeAction( option.action, option.actionParams, function( optionOverrides ) {

        const localOption = _.defaultsDeep( optionOverrides, option );

        navigate(localOption, function(err) {
          cb( err, true);
        });
      } );
    }
  } else {
    navigate( option, function(err) {
      cb( err, true);
    });
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
