gulp-hasher
===========

Gulp plugin that builds a cache of assets and their md5 digests

[![Build Status](https://travis-ci.org/disintegrator/gulp-hasher.svg)](https://travis-ci.org/disintegrator/gulp-hasher)

## Install

    npm install --save-dev gulp-hasher

## Usage

Throughout your gulpfile whenever an asset is generated you will want to add it
to the cache of hashes


    var autoprefixer = require('gulp-autoprefixer');
    var buster = require('gulp-buster');
    var gulp = require('gulp');
    var hasher = require('gulp-hasher');
    var imagemin = require('gulp-imagemin');
    var less = require('gulp-less');
    var minifyCss = require('gulp-minify-css');
    var pngquant = require('imagemin-pngquant');
    var rename = require('gulp-rename');


    // Using it in an image processing workflow looks like this:
    gulp.task('images', function() {
      return gulp.src('assets/images/**/*')
        .pipe(imagemin({
          progressive: true,
          svgoPlugins: [{removeViewBox: false}],
          use: [pngquant()]
        }))
        .pipe(gulp.dest('dist/assets/images/'))
        .pipe(hasher());     // We have output assets, hash and cache them
    });

    // Using it in a css workflow looks like this:
    gulp.task('styles', ['images'], function() {
      return gulp.src('assets/styles/themes/*/style.less')
        .pipe(less())
        .pipe(autoprefixer())
        .pipe(buster({
          assetRoot: path.join(__dirname, 'dist'),
          hashes: hasher.hashes
        }))
        .pipe(gulp.dest('dist/assets/styles/'))
        .pipe(hasher())     // we want to hash the unminified build...
        .pipe(minifyCss())
        .pipe(rename({extname: '.min.css'}))
        .pipe(gulp.dest('dist/assets/styles/'))
        .pipe(hasher());    // ...and the minified build
    });

## Why

We need to build a cache of assets and their hash digests to pass on to certain
tasks such as cache busting.

Notice above the `buster` plugin in the `styles` task and how it receives the
cache `hasher.hashes`.

## See also

- [gulp-buster][1] which relies on gulp-hasher to provide a cache busting plugin

[1]: https://github.com/disintegrator/gulp-buster

## Contributing

Pull requests are welcome. If you add functionality, then please add unit tests to cover it.

## License

MIT © George Haidar

