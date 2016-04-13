var gulp = require('gulp');
var sync = require('browser-sync');
var $ = require('gulp-load-plugins')({lazy: true});


var paths = {
  // all our client app js files, not including 3rd party js files or any existing dist files
  scripts: ['client/app/**/*.js', '!client/lib/**/*.js', '!client/dist/*.js'],
  server: ['server/**/*.js'],
  html: ['client/app/**/*.html', 'client/index.html'],
  styles: ['client/styles/style.css'],
  test: ['specs/**/*.js']
};

gulp.task('lint', function() {
  return gulp.src(paths.scripts.concat(paths.server))
      .pipe($.jshint())
      .pipe($.jshint.reporter('jshint-stylish', {verbose: true}))
      .pipe($.jshint.reporter('fail'));
});

gulp.task('optimise', function() {
  return gulp.src(paths.scripts)
      .pipe($.sourcemaps.init())
      .pipe($.concat('app.js'))
      .pipe(gulp.dest('./client/dist'))
      .pipe($.rename('app.min.js'))
      .pipe($.uglify())
      .pipe($.sourcemaps.write('./'))
      .pipe(gulp.dest('./client/dist'))
      .on('error', function(err) {
        console.error(err);
      });
});

// gulp.task('test', function() {
//   var stream = gulp.src(paths.test, {read: true})
//       .pipe($.mocha({reporter: 'nyan'}))
//       .once('error', function (err) {
//         console.log(err);
//         process.exit(1);
//       })
//       .once('end', function () {
//         process.exit();
//       });
//   return stream;
// });

// nodemon equivalent for browser
gulp.task('sync', ['nodemon'], function () {
  sync.init({
    notify: true,
    injectChanges: true,
    files: paths.scripts.concat(paths.html, paths.styles),
    proxy: 'localhost:1337',
  });
});

// start our node server using nodemon
gulp.task('nodemon', function (cb) {
  var called = false;

  var nodeOptions = {
    script: 'index.js',
    delayTime: 1,
    ignore: [
      'Gulpfile.js',
      'node_modules/**/*.js'
    ]
  };

  return $.nodemon(nodeOptions)
      .on('start', function () {
          if (!called) {
            called = true;
            cb();
          }
        })
        .on('restart', function () {
          setTimeout(function () {
            sync.reload({ stream: false });
          }, 1000);
        });
});

gulp.task('default', ['sync']);

gulp.task('prod', ['lint', /*'test',*/ 'optimise']);