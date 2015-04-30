'use strict';

var crypto = require('crypto');
var fs = require('fs');
var path = require('path');

var es = require('event-stream');
var File = require('vinyl');
var assert = require('chai').assert;

var hasher = require('..');

describe('gulp-hasher', function() {
  describe('in streaming mode', function() {
    var p = path.join(__dirname, 'tinypotato.jpg');
    var hash = crypto.createHash('md5');
    var digest = hash.update(fs.readFileSync(p)).digest('hex');
    it('should generate a filename-to-md5-digest mapping', function(done) {
      var file = new File({
        path: p,
        contents: fs.createReadStream(p)
      });
      var through = hasher();
      es.readArray([file])
        .pipe(through)
        .pipe(es.wait(function(err) {
          assert.isNull(err, 'There was no error');
          assert.equal(hasher.hashes[p], digest);
          done();
        }));
    });
  });

  describe('in buffer mode', function() {
    var p = path.join(__dirname, 'phteven.jpg');
    var hash = crypto.createHash('md5');
    var digest = hash.update(fs.readFileSync(p)).digest('hex');
    it('should generate a filename-to-md5-digest mapping', function(done) {
      var file = new File({
        path: p,
        contents: fs.readFileSync(p)
      });
      var through = hasher();
      es.readArray([file])
        .pipe(through)
        .pipe(es.wait(function(err) {
          assert.isNull(err, 'There was no error');
          assert.equal(hasher.hashes[p], digest);
          done();
        }));
    });
  });

  describe('with null files', function() {
    it('should generate an empty  mapping', function(done) {
      var file = new File({
        path: __dirname,
        contents: null
      });
      var through = hasher();
      es.readArray([file])
        .pipe(through)
        .pipe(es.wait(function(err) {
          assert.isNull(err, 'There was no error');
          assert.equal(hasher.hashes[__dirname], '');
          done();
        }));
    });
  });
});
