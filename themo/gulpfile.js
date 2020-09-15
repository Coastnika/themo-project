const gulp = require('gulp');
const pug= require('gulp-pug');
const concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify');
const del = require('del');
const sass = require('gulp-sass');
const browserSync = require('browser-sync').create();

const cssFiles = [
   './src/css/style.css',
]

const jsFiles = [
   './src/js/script.js',
]

function styles() {
   return gulp.src(cssFiles)
   .pipe(concat('style.css'))
   .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
   }))
   .pipe(cleanCSS({
      level: 2
   }))
   .pipe(gulp.dest('./build/css'))
   .pipe(browserSync.stream());
}

function scripts() {
   return gulp.src(jsFiles)
   .pipe(concat('script.js'))
   .pipe(gulp.dest('build/js'))
   .pipe(browserSync.stream());
}

function clean() {
   return del(['build/*'])
}

function style(){
   return gulp.src('./src/scss/style.scss')
   .pipe(sass())
   .pipe(gulp.dest('./build/css/'))
   .pipe(browserSync.stream())
}

gulp.task('pug', function () {
   
   let data = {
      revision: new Date().getTime()
    };  

   return gulp.src('src/pug/*.pug')
   .pipe(pug({
      locals: data,
      pretty: true
   }))
   .pipe(gulp.dest('./'))						
   .pipe(browserSync.reload({
       stream: true						
   }));
})

 function watch(){
   browserSync.init({
      server:{
         baseDir:'./'
      }
   })
   gulp.watch('./src/pug/**/*.pug', gulp.series('pug'));
   gulp.watch('./src/scss/**/*.scss', style);
   gulp.watch('./*.html').on('change', browserSync.reload);
}

gulp.task('style' , style);
gulp.task('styles', styles);
gulp.task('scripts', scripts);
gulp.task('del', clean);
gulp.task('watch', watch);
gulp.task('build', gulp.series(clean, gulp.parallel(styles,scripts)));
gulp.task('dev', gulp.series('build','watch'));

gulp.task('default',gulp.series(
   'build',
   gulp.parallel('pug','style'),
   'watch'
))