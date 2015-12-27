var gulp  = require('gulp');
var uglify = require('gulp-uglify');
var rename = require("gulp-rename");
var jshint = require('gulp-jshint');
var Server = require('karma').Server;

var oiFile = 'oi.js';

gulp.task('compress', function() {
    return gulp.src(oiFile)
        .pipe(uglify())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('.'))
});

gulp.task('lint', function() {
    return gulp.src(oiFile)
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

gulp.task('test', function() {
  return new Server({
        configFile: __dirname + '/karma.conf.js',
        singleRun: false
      }).start();
});

gulp.task('watch', function() {
    gulp.watch([oiFile], ['lint','compress', 'test']);
});

gulp.task('default', ['lint', 'compress', 'test', 'watch']);