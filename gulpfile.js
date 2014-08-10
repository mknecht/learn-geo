browserify = require('browserify')
gulp = require('gulp')
gutil = require('gulp-util')
source = require('vinyl-source-stream')
mocha = require('gulp-mocha')

gulp.task('default', function() {
  
})

gulp.task('browserify:app', function() {
  browserify()
  .bundle()
  .on('error', gutil.log)
  .pipe(source('js/src/site.js'))
  .pipe(gulp.dest("./build/app.js"))
})

gulp.task('test', function() {
  gulp
  .src("tests/*-spec.js")
  .on('error', gutil.log)
  .pipe(mocha({ui:'bdd'}))
})