const gulp = require('gulp'),
  browserSync = require('browser-sync'),
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
  imageResize = require('gulp-image-resize'),
  imagemin = require('gulp-imagemin'),
  pngquant = require('imagemin-pngquant');



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

// Images
gulp.task('images', function () {
  return gulp.src('public/data/**/*[.jpg,.png]')
    .pipe(imagemin({
      progressive: true,
      svgoPlugins: [{
        removeViewBox: false
      }],
      use: [pngquant()]
    }))
    .pipe(gulp.dest(function (file) {
      return file.base;
    }));
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


gulp.task('default', ['frontend', 'backend', 'sass', 'watch', 'templates']);