browserify = require('browserify')
connect = require('gulp-connect')
gulp = require('gulp')
gutil = require('gulp-util')
jshint = require('gulp-jshint')
source = require('vinyl-source-stream')
mocha = require('gulp-mocha')

var sources = [
  './src/html/*.html',
  './src/js/*.js',
  './src/css/*.css',
  './src/images/*.{png,jpg,svg}'
]

gulp.task('browserify:app', function() {
  browserify('./src/js/cities.js', {debug:true})
  .bundle()
  .on('error', gutil.log)
  .pipe(source('cities.js'))
  .pipe(gulp.dest("build/js/"))
})

gulp.task('build', ['browserify:app', 'jshint'], function() {
  gulp.src('src/css/*.css').pipe(gulp.dest('build/css/'))
  gulp.src('src/css/vendor/*.css').pipe(gulp.dest('build/css/vendor/'))
  gulp.src('src/html/*.html').pipe(gulp.dest('build/html/'))
  gulp.src('src/images/*.{jpg,png,svg}').pipe(gulp.dest('build/images/'))
  gulp.src('src/js/vendor/*.js').pipe(gulp.dest('build/js/vendor/'))
})

gulp.task('jshint', function() {
  return gulp
  .src("src/js/*.js")
  .on('error', gutil.log)
  .pipe(jshint({asi: true}))
  .pipe(jshint.reporter('default'))
  .pipe(jshint.reporter("fail"))
})

gulp.task('test', ['jshint'], function() {
  return gulp
  .src("tests/*-spec.js")
  .on('error', gutil.log)
  .pipe(mocha({reporter:'tap', ui:'bdd'}))
})

gulp.task('serve', ['build'], function() {
  return connect.server({
    root: ['./'],
    livereload: true
  })
})

gulp.task('reload', ['build'], function () {
  return gulp.src(sources)
    .pipe(connect.reload());
})

gulp.task('watch', ['build'], function () {
  return gulp.watch(sources, ['reload']);
})

gulp.task('default', ['watch', 'serve'])