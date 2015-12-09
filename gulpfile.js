var gulp = require('gulp'),
  browserSync = require('browser-sync'),
  nodemon = require('gulp-nodemon'),
  concat = require('gulp-concat'),
  uglify = require('gulp-uglify'),
  autoprefixer = require('gulp-autoprefixer'),
  rename = require('gulp-rename'),
  compass = require('gulp-compass'),
  plumber = require('gulp-plumber'),
  cache = require('gulp-cache'),
  jshint = require('gulp-jshint'),
  scsslint = require('gulp-scss-lint'),
  minifyCSS = require('gulp-minify-css'),
  handlebars = require('gulp-handlebars'),
  wrap = require('gulp-wrap'),
  declare = require('gulp-declare'),
  imageResize = require('gulp-image-resize');



// Concatenate & Minify JS
gulp.task('frontend', function () {
  return gulp.src('public/src/js/canellwatkins-front.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
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
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(uglify())
    .pipe(gulp.dest('public/dist/js/'));
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
    .pipe(gulp.dest('public/dist/css'));
});

gulp.task('templates', function () {
  gulp.src('views/templates/src/*.handlebars')
    .pipe(handlebars())
    .pipe(wrap('Handlebars.template(<%= contents %>)'))
    .pipe(declare({
      namespace: 'MyApp.templates',
      noRedeclare: true
    }))
    .pipe(concat('templates.js'))
    .pipe(uglify())
    .pipe(gulp.dest('public/dist/js/handlebars'));
});

//gulp.task('resize', function () {
//  gulp.src('public/data/**/*.{png,gif,jpg}')
//    .pipe(imageResize({
//      width: 300,
//      height: 300
//    }))
//    .pipe(rename(function (path) {
//      path.basename = "thumbnail-" + path.basename;
//    }))
//    .pipe(gulp.dest(''));
//});

// Watch for changes in files
gulp.task('watch', function () {
  // Watch .js files
  gulp.watch('public/src/js/*.js', ['backend', 'frontend']);
  // Watch .scss files
  gulp.watch('public/src/scss/*.scss', ['sass']);
  // Watch templates
  gulp.watch('views/templates/src/*.handlebars', ['templates']);
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
          stream: false
        });
      }, BROWSER_SYNC_RELOAD_DELAY);
    });
});

gulp.task('default', ['frontend', 'backend', 'sass', 'watch', 'templates']);
