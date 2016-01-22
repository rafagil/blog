/* global process, __dirname */
(function () {
  'use strict';

  var gulp = require('gulp');
  var uglify = require('gulp-uglify');
  var concat = require('gulp-concat');
  var rename = require('gulp-rename');
  var nodemon = require('gulp-nodemon');
  var inject = require('gulp-inject');
  var mainBowerFiles = require('main-bower-files');
  var filter = require('gulp-filter');
  var mocha = require('gulp-mocha');

  var scriptFilter = '**/*.js';

  var paths = {
    servicesModule: './front-end/js/services/services.module.js',
    serviceFiles: './front-end/js/services/!(services.module)*.js',
    mainModule: './front-end/js/blog.js',
    appJs: './front-end/js/!(services|min)**/*.js',
    vendor: mainBowerFiles()
  };

  gulp.task('js', function () {
    gulp.src([paths.servicesModule, paths.serviceFiles])
      .pipe(concat('./services'))
      .pipe(rename('services.js'))
      .pipe(gulp.dest('./front-end/dist'));

    gulp.src([paths.servicesModule, paths.serviceFiles])
      .pipe(concat('./services'))
      .pipe(rename('services.min.js'))
      .pipe(uglify())
      .pipe(gulp.dest('./front-end/dist'));

    gulp.src([paths.mainModule, paths.appJs])
      .pipe(concat('./blog'))
      .pipe(rename('blog.js'))
      .pipe(gulp.dest('./front-end/dist'));

    gulp.src([paths.mainModule, paths.appJs])
      .pipe(concat('./blog'))
      .pipe(rename('blog.min.js'))
      .pipe(uglify())
      .pipe(gulp.dest('./front-end/dist'));
  });

  gulp.task('inject-dev', function () {
    var target = gulp.src('./front-end/index.html');
    var vendor = gulp.src(paths.vendor);
    var sources = gulp.src([paths.servicesModule, paths.serviceFiles, paths.mainModule, paths.appJs], {
      read: false
    });
    return target.pipe(inject(sources, {
      addRootSlash: false,
      ignorePath: 'front-end'
    }))
      .pipe(inject(vendor, {
        name: 'vendor',
        addRootSlash: false,
        ignorePath: 'front-end'
      }))
      .pipe(gulp.dest('front-end'));
  });


  gulp.task('inject-prod', function () {
    var target = gulp.src('./front-end/index.html');
    var vendor = gulp.src(paths.vendor);
    var sources = gulp.src([paths.servicesModule, paths.serviceFiles, paths.mainModule, paths.appJs]);

    return target.pipe(inject(
      sources.pipe(concat('./app'))
        .pipe(rename('app.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./front-end/js/min')), {
        addRootSlash: false,
        ignorePath: 'front-end'
      }))
      .pipe(inject(vendor.pipe(filter(scriptFilter))
        .pipe(concat('./vendor'))
        .pipe(rename('vendor.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./front-end/js/min')), {
          name: 'vendor',
          addRootSlash: false,
          ignorePath: 'front-end'
        }))
      .pipe(gulp.dest('front-end'));
  });

  gulp.task('dist', ['js', 'inject-prod']);

  gulp.task('serve', ['inject-dev'], function () {
    nodemon({
      script: 'server.js',
      cwd: __dirname + '/back-end',
      env: { 'NODE_ENV': 'development' },
      ignore: ['front-end/*'],
      ext: 'js'
    });
    gulp.watch('front-end/js/**/*.js', ['inject-dev']);
  });

  gulp.task('test', function() {
    process.chdir('back-end');
    gulp.src('tests/*.js', {read: false}).pipe(mocha());
  });

  gulp.task('default', ['dist']);

} ());