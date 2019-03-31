var gulp = require('gulp');
var sass = require('gulp-sass');
var header = require('gulp-header');
var cleanCSS = require('gulp-clean-css');
var rename = require("gulp-rename");
var uglify = require('gulp-uglify');
var pkg = require('./package.json');
var browserSync = require('browser-sync').create();

var gutil = require('gulp-util');
var minimist = require('minimist');
var args = minimist(process.argv.slice(2));

var ga = require('gulp-ga');

var removeHtmlComments = require('gulp-remove-html-comments');

// Set the banner content
var banner = ['/*!\n',
    ' * Start Bootstrap - <%= pkg.title %> v<%= pkg.version %> (<%= pkg.homepage %>)\n',
    ' * Copyright 2013-' + (new Date()).getFullYear(), ' <%= pkg.author %>\n',
    ' * Licensed under <%= pkg.license %> (https://github.com/BlackrockDigital/<%= pkg.name %>/blob/master/LICENSE)\n',
    ' */\n',
    ''
].join('');

// Copy third party libraries from /node_modules into /vendor
gulp.task('vendor', function () {

    // Bootstrap
    gulp.src([
        './node_modules/bootstrap/dist/**/*',
        '!./node_modules/bootstrap/dist/css/bootstrap-grid*',
        '!./node_modules/bootstrap/dist/css/bootstrap-reboot*'
    ])
        .pipe(gulp.dest('./vendor/bootstrap'))
        .pipe(gulp.dest('./dist/vendor/bootstrap'))

    // Devicons
    gulp.src([
        './node_modules/devicon/**/*',
        '!./node_modules/devicon/*.json',
        '!./node_modules/devicon/*.md',
        '!./node_modules/devicon/!PNG',
        '!./node_modules/devicon/!PNG/**/*',
        '!./node_modules/devicon/!SVG',
        '!./node_modules/devicon/!SVG/**/*'
    ])
        .pipe(gulp.dest('./vendor/devicons'))
        .pipe(gulp.dest('./dist/vendor/devicons'))

    // Font Awesome
    gulp.src([
        './node_modules/font-awesome/**/*',
        '!./node_modules/font-awesome/{less,less/*}',
        '!./node_modules/font-awesome/{scss,scss/*}',
        '!./node_modules/font-awesome/.*',
        '!./node_modules/font-awesome/*.{txt,json,md}'
    ])
        .pipe(gulp.dest('./vendor/font-awesome'))
        .pipe(gulp.dest('./dist/vendor/font-awesome'))

    // jQuery
    gulp.src([
        './node_modules/jquery/dist/*',
        '!./node_modules/jquery/dist/core.js'
    ])
        .pipe(gulp.dest('./vendor/jquery'))
        .pipe(gulp.dest('./dist/vendor/jquery'))

    // jQuery Easing
    gulp.src([
        './node_modules/jquery.easing/*.js'
    ])
        .pipe(gulp.dest('./vendor/jquery-easing'))
        .pipe(gulp.dest('./dist/vendor/jquery-easing'))

    // Simple Line Icons
    gulp.src([
        './node_modules/simple-line-icons/fonts/**',
    ])
        .pipe(gulp.dest('./vendor/simple-line-icons/fonts'))
        .pipe(gulp.dest('./dist/vendor/simple-line-icons/fonts'))

    gulp.src([
        './node_modules/simple-line-icons/css/**',
    ])
        .pipe(gulp.dest('./vendor/simple-line-icons/css'))
        .pipe(gulp.dest('./dist/vendor/simple-line-icons/css'))

    gulp.src([
        './vendor/cookieconsent/**',
    ])
        .pipe(gulp.dest('./dist/vendor/cookieconsent'))

    gulp.src([
        './vendor/font-awesome/**',
    ])
        .pipe(gulp.dest('./dist/vendor/font-awesome'))

    gulp.src([
        './vendor/font-mfizz/**',
    ])
        .pipe(gulp.dest('./dist/vendor/font-mfizz'))

    gulp.src([
        './vendor/jquery-easing/**',
    ])
        .pipe(gulp.dest('./dist/vendor/jquery-easing'))

});

// Compile SCSS
gulp.task('css:compile', function () {
    return gulp.src('./scss/**/*.scss')
        .pipe(sass.sync({
            outputStyle: 'expanded'
        }).on('error', sass.logError))
        .pipe(gulp.dest('./css'))
});

// Minify CSS
gulp.task('css:minify', ['css:compile'], function () {
    return gulp.src([
        './css/*.css',
        '!./css/*.min.css'
    ])
        .pipe(cleanCSS())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('./css'))
        .pipe(gulp.dest('./dist/css'))
        .pipe(browserSync.stream());
});

// CSS
gulp.task('css', ['css:compile', 'css:minify']);

// Minify JavaScript
gulp.task('js:minify', function () {
    return gulp.src([
        './js/*.js',
        '!./js/*.min.js'
    ])
        .pipe(uglify())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('./js'))
        .pipe(gulp.dest('./dist/js'))
        .pipe(browserSync.stream());
});

// JS
gulp.task('js', ['js:minify']);

gulp.task('html', function () {
    return gulp.src('*.html')
        .pipe(removeHtmlComments())
        .pipe(ga({url: 'www.stefanbaust.de', uid: 'UA-63317853-15', anonymizeIp: true}))
        .pipe(gulp.dest('dist'));
});

gulp.task('img', function () {
    return gulp.src('img/**')
        .pipe(gulp.dest('dist/img'));
});


// Default task
gulp.task('default', ['css', 'js', 'vendor', 'html', 'img']);

// Configure the browserSync task
gulp.task('browserSync', function () {
    browserSync.init({
        open: false,
        server: {
            baseDir: "./"
        }
    });
});

gulp.task('deploy', function () {
    console.log('deploy todo');
});

// Dev task
gulp.task('dev', ['css', 'js', 'browserSync'], function () {
    gulp.watch('./scss/*.scss', ['css']);
    gulp.watch('./js/*.js', ['js']);
    gulp.watch('./**/*.html', browserSync.reload);
});
