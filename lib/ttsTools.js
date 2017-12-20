

module.exports = {
  split: function( opt ) {

    const len = opt.len || 200;
    const text = opt.text;

    if( !text ) {
      return [];
    }

    const parts = text.split('.');

    for( let i=0; i<parts.length; i++ ) {
      if( parts[i].length > len ) {
        parts[i] = parts[i].substr(0,len).trim();
      } else {
        parts[i] = parts[i].trim();

      }
    }
    return parts;

  }
}