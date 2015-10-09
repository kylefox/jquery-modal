var gulp = require('gulp');
var uglify = require("gulp-uglify");
var rename = require('gulp-rename');


gulp.task('min', function() {
  gulp.src('jquery.modal.js')
    .pipe(uglify({preserveComments: 'license'}))
    .pipe(rename('jquery.modal.min.js'))
    .pipe(gulp.dest('.'));
});
