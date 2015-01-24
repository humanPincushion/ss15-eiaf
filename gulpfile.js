'use strict';
/* jshint camelcase: false, unused: false */

var gulp = require('gulp'),
    browserify = require('gulp-browserify'),
    concat = require('gulp-concat'),
    connect = require('gulp-connect'),
    fileinclude = require('gulp-file-include'),
    imagemin = require('gulp-imagemin'),
    jshint = require('gulp-jshint'),
    karma = require('gulp-karma'),
    minifyCSS = require('gulp-minify-css'),
    notify = require('gulp-notify'),
    pngcrush = require('imagemin-pngcrush'),
    prefix = require('gulp-autoprefixer'),
    prettify = require('gulp-html-prettify'),
    protractor = require('gulp-protractor').protractor,
    rename = require('gulp-rename'),
    sass = require('gulp-sass'),
    scsslint = require('gulp-scss-lint'),
    size = require('gulp-filesize'),
    svg2png = require('gulp-svg2png'),
    svgmin = require('gulp-svgmin'),
    svgstore = require('gulp-svgstore'),
    uglify = require('gulp-uglify'),
    webdriver_standalone = require('gulp-protractor').webdriver_standalone,
    webdriver_update = require('gulp-protractor').webdriver_update;

/*
 * ### Task aliases.
 */

gulp.task('default', ['watch']);
gulp.task('watch', ['webserver', 'watch-files']);
gulp.task('test', ['unit-test', 'e2e']);
gulp.task('build', ['copy', 'html', 'sass', 'app', 'images']);

gulp.task('webdriver_update', webdriver_update);
gulp.task('webdriver_standalone', webdriver_standalone);

/*
 * ### Core tasks.
 */

// compile html templates.
gulp.task('html', function() {
  gulp.src('./src/html/*.tpl.html')
    .pipe(fileinclude())
    .pipe(prettify({indent_char: ' ', indent_size: 2}))
    .pipe(rename({
      extname: ''
    }))
    .pipe(rename({
      extname: '.html'
    }))
    .pipe(gulp.dest('./dist'))
    .pipe(connect.reload());
  
  gulp.src('./src/html/angular-tpl/**/*.tpl.html')
    .pipe(gulp.dest('./dist/ng'));
});

// compile stylesheet.
gulp.task('sass', function () {
 return gulp.src('src/scss/**/*.scss')
    .pipe(sass())
    .pipe(concat('style.css'))
    .pipe(prefix('last 2 versions', '> 1%'))
    .pipe(minifyCSS())
    .pipe(gulp.dest('dist/css'))
    .pipe(connect.reload());
});

// compile javascript application.
gulp.task('app', function() { 
 return gulp.src([
     'src/lib/ngstorage/ngStorage.js',
     'src/lib/codebird-js/codebird.js',
     'src/js/**/*.js'
   ])
    .pipe(concat('com.app.js'))
    //.pipe(browserify({
      //insertGlobals: true
    //}))
    //.pipe(uglify())
    .pipe(gulp.dest('dist/js'))
    .pipe(connect.reload());
});

// optimise images (.jpg, .png, .gif, .svg)
gulp.task('images', function() {
  return gulp.src('src/img/**/*')
    .pipe(imagemin({
      progressive: true,
      optimizationLevel: 5,
      svgoPlugins: [{removeViewBox: false}],
      use: [pngcrush()]
    }))
    .pipe(size())
    .pipe(gulp.dest('dist/img'));
});

gulp.task('sprite', function() {
  
  gulp.src('src/svg/*.svg')
    .pipe(svg2png())
    .pipe(gulp.dest('dist/img/icons'));
  
  return gulp.src('src/svg/*.svg')
    .pipe(svgmin())
    .pipe(svgstore({
      fileName: 'sprite.svg',
      prefix: 'ico-',
      inlineSvg: true
    }))
    .pipe(gulp.dest('dist/img'));
});

/*
 * ### Copy vendor scripts.
 */

gulp.task('copy', function() {
  // libraries loaded off cdn.
  gulp.src([
      'src/lib/jquery/dist/jquery.min.js',
      'src/lib/angularjs/angular.min.js',
      'src/lib/angular-animate/angular-animate.min.js',
      'src/lib/angular-resource/angular-resource.min.js',
      'src/lib/angular-sanitize/angular-sanitize.min.js',
      'src/lib/angular-touch/angular-touch.min.js',
      'src/lib/angular-ui-router/release/angular-ui-router.min.js',
    ])
    .pipe(gulp.dest('dist/js/lib'));
  // uglify modernizr tho.
  gulp.src('src/lib/modernizr/modernizr.js')
    .pipe(uglify())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('dist/js/lib'));
});

/*
 * ### Watch tasks.
 */

gulp.task('watch-files', function() {
  var watchcss = gulp.watch('src/**/*.scss', ['scss-lint', 'sass']),
      watchhtml = gulp.watch('src/**/*.html', ['html']),
      watchimg = gulp.watch('src/img/**/*', ['images']),
      watchjs = gulp.watch('src/js/**/*.js', ['jshint', 'app']),
      watchsvg = gulp.watch('src/svg/*', ['sprite']);
});

// unit testing watcher; handy for test driven development
gulp.task('test-driven', function() {
  return gulp.watch(['src/js/**/*.js', 'test/unit/*.js'], ['unit-test']);
});

/*
 * ### Code linters.
 */

gulp.task('scss-lint', function() {
  return gulp.src([
      'src/scss/*.scss', 
      '!src/scss/lib/**/*.scss', 
      '!src/scss/**/_normalize.scss'
    ])
    .pipe(scsslint({'config': '.scss-lint.yml'}));
});

gulp.task('jshint', function() {
  return gulp.src([
      'src/js/app/**/*.js',
      'src/js/com.app.js'
    ])
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('jshint-stylish'));
});

/*
 * ### Testing utilities.
 */

// karma unit testing.
gulp.task('unit-test', function() {
  /* 
   * Using the fake './foobar' so as to run the files listed in 
   * karma.config.js INSTEAD of what was passed to gulp.src
   */
  return gulp.src('./foobar')
    .pipe(karma({
      configFile: './test/config/karma.config.js',
      action: 'run'
    }))
    .on('error', function(err) {
      // make sure failed tests cause gulp to exit non-zero
      console.log(err);
      this.emit('end'); // instead of erroring the stream, end it
    });
});

// end-to-end testing with protractor.
gulp.task('e2e', ['webdriver_update'], function() {
  return gulp.src('./test/e2e/**/*.js') 
    .pipe(webdriver_standalone({
      configFile: './test/config/protractor-e2e.config.js'
    }))
    .on('error', function(e) { throw e; });
});

/*
 * ### Bundled webserver.
 */

gulp.task('webserver', function() {
  return connect.server({
    host: '0.0.0.0',
    root: 'dist',
    livereload: true
  });
});
