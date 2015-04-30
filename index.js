'use strict';

var crypto = require('crypto');
var es = require('event-stream');

var hashes = {};

var calculateMD5 = function(file, cb) {
  var hash = crypto.createHash('md5');
  var stream = es.through(function(chunk) {
      hash.update(chunk);
  }, function() {
    cb(null, hash.digest('hex'));
  });

  if (file.isNull()) {
    return cb(null, '');
  }
  else if (file.isBuffer()) {
    stream.write(file.contents);
    stream.end();
  }
  else if (file.isStream()) {
    file.pipe(stream);
  }
  else {
    return cb(new Error('Unrecognised file object'));
  }
};

var plugin = function() {
  var stream = es.map(function(file, cb) {
    calculateMD5(file, function(err, digest) {
      if (err) { return cb(err); }
      hashes[file.path] = digest;
      cb(null, file);
    });
  });
  return stream;
};

plugin.hashes = hashes;

module.exports = plugin;
