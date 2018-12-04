const gulp = require('gulp');
const pug = require('gulp-pug');
const sass = require('gulp-sass');
const runSequence = require('run-sequence');
const browserSync = require('browser-sync');
const reload = browserSync.reload;

const baseDir = __dirname;
const port = 3000;

gulp.task('default', done => runSequence(
  'browserSync',
  ['index:build', 'playground:build'],
  ['index:watch', 'playground:watch'],
  done
));

gulp.task('browserSync', () => {
  browserSync.init([
    '*.html', '*.css', '*.js',
    'playground/**/*.html', 'playground/**/*.css', 'playground/**/*.js'
  ], {
    server: {
      baseDir: baseDir
    },
    port: port,
    open: true,
    notify: false
  });
});

gulp.task('index:watch', () => {
  gulp.watch(baseDir + '/*.pug', ['index:pug']);
  gulp.watch(baseDir + '/*.sass', ['index:sass']);
});

gulp.task('index:build', ['index:pug', 'index:sass']);

gulp.task('index:pug', () => {
  return gulp.src(baseDir + '/*.pug')
    .pipe(pug({ pretty: true }))
    .pipe(gulp.dest(baseDir));
});

gulp.task('index:sass', () => {
  return gulp.src(baseDir + '/*.sass')
    .pipe(sass({ outputStyle: 'expanded' }))
    .pipe(gulp.dest(baseDir));
});

gulp.task('playground:watch', () => {
  gulp.watch(baseDir + '/playground/**/*.pug', ['pug']);
  gulp.watch(baseDir + '/playground/**/*.sass', ['sass']);
});

gulp.task('playground:build', ['playground:pug', 'playground:sass']);

gulp.task('playground:pug', () => {
  return gulp.src(baseDir + '/playground/**/*.pug')
    .pipe(pug({ pretty: true }))
    .pipe(gulp.dest(baseDir + '/playground'));
});

gulp.task('playground:sass', () => {
  return gulp.src(baseDir + '/playground/**/*.sass')
    .pipe(sass({ outputStyle: 'expanded' }))
    .pipe(gulp.dest(baseDir + '/playground'));
});
