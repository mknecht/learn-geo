browserify = require('browserify')
gulp = require('gulp')
gutil = require('gulp-util')
jshint = require('gulp-jshint')
source = require('vinyl-source-stream')
mocha = require('gulp-mocha')

gulp.task('default', function() {
  
})

gulp.task('browserify:app', ['jshint'], function() {
  browserify()
  .bundle()
  .on('error', gutil.log)
  .pipe(source('js/src/site.js'))
  .pipe(gulp.dest("./build/app.js"))
})

gulp.task('jshint', function() {
  gulp
  .src("js/*.js")
  .on('error', gutil.log)
  .pipe(jshint({asi: true}))
  .pipe(jshint.reporter('default'))
  })

gulp.task('test', ['jshint'], function() {
  gulp
  .src("tests/*-spec.js")
  .on('error', gutil.log)
  .pipe(mocha({ui:'bdd'}))
})