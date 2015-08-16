var gulp = require('gulp');
var browserSync = require('browser-sync');
var nodemon = require('gulp-nodemon');

var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var autoprefixer = require('gulp-autoprefixer');
var rename = require('gulp-rename');
var compass = require('gulp-compass');
var plumber = require('gulp-plumber');
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');
var jshint = require('gulp-jshint');
var scsslint = require('gulp-scss-lint');
var minifyCSS = require('gulp-minify-css');
var handlebars = require('gulp-handlebars');
var wrap = require('gulp-wrap');
var declare = require('gulp-declare');


// Concatenate & Minify JS
gulp.task('frontend', function () {
  return gulp.src('public/src/js/canellwatkins-front.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(concat('main.js'))
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(uglify())
    .pipe(gulp.dest('public/dist/js/'));
});

gulp.task('backend', function () {
  return gulp.src('public/src/js/canellwatkins-back.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(concat('main.js'))
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(uglify())
    .pipe(gulp.dest('public/dist/js/'));
});


gulp.task('lint', function () {
  return gulp.src(['*.js', 'config/*.js', 'app/**/*.js', 'public/src/js/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});


gulp.task('sass', function () {
  return gulp.src('public/src/scss/*')
    .pipe(plumber())
    .pipe(scsslint())
    .pipe(compass({
      css: 'public/dist/css',
      sass: 'public/src/scss/'
    }))
    .pipe(autoprefixer())
    //    .pipe(minifyCSS())
    .pipe(gulp.dest('public/dist/css'));
});

gulp.task('images', function () {
  return gulp.src('src/img/**/*')
    .pipe(cache(imagemin({
      optimizationLevel: 5,
      progressive: true,
      interlaced: true
    })))
    .pipe(gulp.dest('build/img'));
});

gulp.task('templates', function () {
  gulp.src('views/templates/src/*.handlebars')
    .pipe(handlebars())
    .pipe(wrap('Handlebars.template(<%= contents %>)'))
    .pipe(declare({
      namespace: 'MyApp.templates',
      noRedeclare: true, // Avoid duplicate declarations 
    }))
    .pipe(concat('templates.js'))
    .pipe(gulp.dest('public/dist/js/handlebars'));
});

// Watch for changes in files
gulp.task('watch', function () {
  // Watch .js files
  gulp.watch('public/src/js/*.js', ['backend', 'frontend']);
  // Watch .scss files
  gulp.watch('public/src/scss/main.scss', ['sass']);
  // Watch image files
  //    gulp.watch('src/img/**/*', ['images']);
});

// we'd need a slight delay to reload browsers
// connected to browser-sync after restarting nodemon
var BROWSER_SYNC_RELOAD_DELAY = 500;

gulp.task('nodemon', function (cb) {
  var called = false;
  return nodemon({

      // nodemon our expressjs server
      script: 'server.js',

      // watch core server file(s) that require server restart on change
      watch: ['server.js']
    })
    .on('start', function onStart() {
      // ensure start only got called once
      if (!called) {
        cb();
      }
      called = true;
    })
    .on('restart', function onRestart() {
      // reload connected browsers after a slight delay
      setTimeout(function reload() {
        browserSync.reload({
          stream: false //
        });
      }, BROWSER_SYNC_RELOAD_DELAY);
    });
});

gulp.task('browser-sync', ['nodemon'], function () {
  browserSync.init({
    files: ['public/**/*.*', 'public/**/*.*'],
    proxy: 'http://localhost:80',
    port: 9000
  });
});

gulp.task('default', ['nodemon', 'frontend', 'backend', 'sass', 'watch', 'templates']);