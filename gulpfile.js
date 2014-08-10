browserify = require('browserify')
connect = require('gulp-connect')
gulp = require('gulp')
gutil = require('gulp-util')
jshint = require('gulp-jshint')
source = require('vinyl-source-stream')
mocha = require('gulp-mocha')

gulp.task('browserify:app', ['jshint'], function() {
  browserify('./js/geo.js')
  .bundle()
  .on('error', gutil.log)
  .pipe(source('bundle.js'))
  .pipe(gulp.dest("./js/"))
})

gulp.task('build', ['browserify:app'], function() {
  
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
  .pipe(mocha({reporter:'tap', ui:'bdd'}))
})

gulp.task('serve', function() {
  connect.server({
    root: ['./'],
    livereload: true
  })
})

var sources = ['*.html', 'js/*.js', 'css/*.css']

gulp.task('reload', function () {
  gulp.src(sources)
    .pipe(connect.reload());
});

gulp.task('watch', ['build'], function () {
  gulp.watch(sources, ['reload']);
});


gulp.task('default', ['connect', 'watch']);