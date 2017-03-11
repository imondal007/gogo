var gulp = require('gulp'),
  browserSync = require('browser-sync').create(),
  uglify = require('gulp-uglify'),
  rename = require('gulp-rename'),
  sass = require('gulp-sass'),
  plumber = require('gulp-plumber'),
  cleanCSS = require('gulp-clean-css'),
  imagemin = require('gulp-imagemin'),
  fs = require('fs'); // Node module for file system

// browserSync Server
gulp.task('serve', function() {
  browserSync.init({
    server: "./"
  });
});

//Styles
gulp.task('styles', function() {
  gulp.src('scss/*.scss')
    .pipe(plumber())
    .pipe(sass({ outputStyle: 'expanded' }))
    .pipe(gulp.dest('css/'))
    .pipe(cleanCSS({ compatibility: 'ie8' }))
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('css/'))
    .pipe(browserSync.stream());
});

//Script
gulp.task('script', function() {
  gulp.src(['js/*.js', '!js/*.min.js'])
    .pipe(plumber())
    .pipe(uglify())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('js/'));
});

//Images
gulp.task('image', () =>
  gulp.src('img/*')
  .pipe(imagemin())
  .pipe(gulp.dest('img/'))
);


//Watch Task
gulp.task('watch', function() {
  gulp.watch("scss/**/*.scss", ['styles']);
  gulp.watch(['js/*.js', '!js/*.min.js'], ['script']);
  gulp.watch("css/*.min.css").on('change', browserSync.reload);
  gulp.watch("*.html").on('change', browserSync.reload);
  gulp.watch("js/*min.js").on('change', browserSync.reload);
})


gulp.task('copy', function() {
  if (fs.existsSync('./src')) {
    // Do Nothing if src directory available
  } else {
    // If src directory not available run the task

    // Copy Bootstrap
    gulp.src(['node_modules/bootstrap/dist/**/*', '!**/npm.js', '!**/bootstrap-theme.*', '!**/*.map'])
      .pipe(gulp.dest('src/bootstrap'));
    // Copy Font-awesome
    gulp.src([
        'node_modules/font-awesome/**/*',
        '!node_modules/font-awesome/less{,/**}',
        '!node_modules/font-awesome/scss{,/**}',
        '!node_modules/font-awesome/**/*.map',
        '!node_modules/font-awesome/.npmignore',
        '!node_modules/font-awesome/*.txt',
        '!node_modules/font-awesome/*.md',
        '!node_modules/font-awesome/*.json'
      ])
      .pipe(gulp.dest('src/font-awesome'));
  }
});

// Default Task
gulp.task('default', ['styles', 'script', 'copy', 'serve', 'watch']);