const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cleanCSS = require('gulp-clean-css');
const sourcemaps = require('gulp-sourcemaps');
const rename = require('gulp-rename');
const browserSync = require('browser-sync').create();

// File Paths
const paths = {
  scss: {
    src: 'scss/**/*.{scss,sass}',
    dest: 'css'
  },
  html: {
    src: '*.html'
  }
};

// Compile SCSS to CSS with autoprefixing and sourcemaps
function styles() {
  return gulp.src('scss/styles.sass')
    .pipe(sourcemaps.init())
    .pipe(sass({
      outputStyle: 'expanded',
      indentType: 'space',
      indentWidth: 2
    }).on('error', sass.logError))
    .pipe(postcss([
      autoprefixer({
        cascade: false,
        overrideBrowserslist: ['last 2 versions', '> 1%', 'ie >= 11']
      })
    ]))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.scss.dest))
    .pipe(browserSync.stream());
}

// Minify CSS for production version
function minifyStyles() {
  return gulp.src('scss/styles.sass')
    .pipe(sass({
      outputStyle: 'compressed'
    }).on('error', sass.logError))
    .pipe(postcss([
      autoprefixer({
        cascade: false,
        overrideBrowserslist: ['last 2 versions', '> 1%', 'ie >= 11']
      })
    ]))
    .pipe(cleanCSS({
      level: 2,
      compatibility: 'ie11'
    }))
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest(paths.scss.dest));
}

// Run Browser Sync for live reload
function serve() {
  browserSync.init({
    server: {
      baseDir: './'
    },
    port: 3000,
    notify: false,
    open: true
  });

  // Watch for changes
  gulp.watch(paths.scss.src, styles);
  gulp.watch(paths.html.src).on('change', browserSync.reload);
}

// Tasks
gulp.task('styles', styles);
gulp.task('minify', minifyStyles);
gulp.task('serve', serve);

// Development build (compile + serve)
gulp.task('dev', gulp.series(styles, serve));

// Production build (compile + minify)
gulp.task('build', gulp.series(styles, minifyStyles));

// Default task
gulp.task('default', gulp.series('dev'));
