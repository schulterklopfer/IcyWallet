const async = require('async');
const googleTTS = require('google-tts-api');
const request = require('request');
const fs = require('fs');
const crypto = require('crypto');

module.exports = {
  get: function (text, language, speed, baseFolder, cb) {
    async.waterfall([
      function (nextWaterfall) {
        // render and request url
        const hash = crypto.createHash('md5');
        hash.update(text);

        const digest = hash.digest('hex');

        googleTTS(text, language, speed)
          .then(function (url) {
            nextWaterfall(null, text, url, baseFolder, digest);
          })
          .catch(function (err) {
            nextWaterfall(err);
          });
      },
      function (text, url, baseFolder, digest, nextWaterfall) {
        const fileName = baseFolder + '/' + digest + '.mp3';

        fs.exists(fileName, function(exists) {
          if( !exists ) {
            const file = fs.createWriteStream(fileName);
            request.get(url).pipe(file).on('close', function () {
              nextWaterfall(null, {text: text, fileName: fileName, digest: digest, newFile: true});
            });
          } else {
            nextWaterfall(null,{text: text, fileName: fileName, digest: digest, newFile: false});
          }
        });

      }
    ], cb);

  }
}