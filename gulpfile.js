var gulp = require('gulp');
var uglify = require("gulp-uglify");
var uglifycss = require("gulp-uglifycss");
var rename = require('gulp-rename');
var changelog = require('gulp-conventional-changelog');

gulp.task('min', function() {
  gulp.src('jquery.modal.js')
    .pipe(uglify({preserveComments: 'license'}))
    .pipe(rename('jquery.modal.min.js'))
    .pipe(gulp.dest('.'));
});

gulp.task('css', function() {
  gulp.src('jquery.modal.css')
    .pipe(uglifycss())
    .pipe(rename('jquery.modal.min.css'))
    .pipe(gulp.dest('.'));
});

gulp.task('changelog', function() {
  gulp.src('CHANGELOG.md')
    .pipe(changelog())
    .pipe(gulp.dest('.'));
});
