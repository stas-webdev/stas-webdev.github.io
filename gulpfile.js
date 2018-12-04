const gulp = require('gulp');
const pug = require('gulp-pug');
const sass = require('gulp-sass');
const runSequence = require('run-sequence');
const browserSync = require('browser-sync');
const reload = browserSync.reload;

const baseDir = __dirname;
const port = 3000;

gulp.task('default', done => runSequence('browserSync', 'build', 'watch', done));

gulp.task('watch', () => {
  gulp.watch(baseDir + '/*.pug', ['pug']);
  gulp.watch(baseDir + '/*.sass', ['sass']);
});

gulp.task('browserSync', () => {
  browserSync.init(['*.html', '*.css', '*.js'], {
   server: {
     baseDir: baseDir
   },
   port: port,
   open: true,
   notify: false
 });
});

gulp.task('build', ['pug', 'sass']);

gulp.task('pug', () => {
  return gulp.src(baseDir + '/*.pug')
    .pipe(pug({ pretty: true }))
    .pipe(gulp.dest(baseDir));
});

gulp.task('sass', () => {
  return gulp.src(baseDir + '/*.sass')
    .pipe(sass({ outputStyle: 'expanded' }))
    .pipe(gulp.dest(baseDir));
});
