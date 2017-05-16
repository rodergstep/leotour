var gulp = require('gulp'),
    del = require('del'),
    fileinclude = require('gulp-file-include'),
    sass = require('gulp-sass'),
    cssmin = require('gulp-cssmin'),
    spritesmith = require('gulp.spritesmith'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    jpegtran = require('imagemin-jpegtran'),
    rename = require('gulp-rename'),
    changed = require('gulp-changed'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    gutil = require('gulp-util'),
    ftp = require('vinyl-ftp'),
    autoprefixer = require('gulp-autoprefixer'),
    sourcemaps = require('gulp-sourcemaps');
    notify = require("gulp-notify"),
    browserSync = require('browser-sync');

var path = {
    build: {
        root: 'docs/',
        html: 'docs/',
        css: 'docs/css/',
        js: 'docs/js/',
        img: 'docs/img/',
        fonts: 'docs/fonts/',
        vendors: 'docs/js/vendors/'
    },
    src: {
        html: 'src/*.html',
        sass: 'src/sass/**/*.scss',
        js: 'src/js/*.js',
        img: 'src/img/**/**',
        fonts: 'src/fonts/**/*.*',
        vendors: 'src/js/vendors/**/*.*',
    }
};
// SERVER
gulp.task('browser-sync', function() {
    browserSync({
        server: {
            baseDir: 'docs'
        },
        notify: false
    });
});

// HTML
gulp.task('html', function() {
    gulp.src(path.src.html)
        .on("error", notify.onError())
        .pipe(fileinclude({prefix: '@@'}))
        .pipe(gulp.dest(path.build.html))
        .pipe(browserSync.reload({
            stream: true
        }));
});

// CSS
gulp.task('style', function() {
    return gulp.src(path.src.sass)
        .pipe(changed(path.build.css))
        .pipe(sourcemaps.init())
        .pipe(sass()).on("error", notify.onError())
        .pipe(autoprefixer({
            browsers: ['last 30 versions'],
            cascade: false
        }))
        .pipe(cssmin())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.build.css))
        .pipe(browserSync.reload({
            stream: true
        }));
});

// JS
gulp.task('js', function() {
    gulp.src(path.src.js)
        /*.pipe(babel({
             presets: ['es2015']
         }))*/
        .pipe(uglify())
        .on("error", notify.onError())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest(path.build.js))
        .pipe(browserSync.reload({
            stream: true
        }));
});

// IMAGES
gulp.task('image', function() {
    gulp.src(path.src.img)
        .pipe(changed(path.build.img))
        .pipe(imagemin({
            progressive: true,
            optimizationLevel: 5,
            svgoPlugins: [{
                removeViewBox: false
            }],
            use: [pngquant(), jpegtran()],
            interlaced: true
        })).on("error", notify.onError())
        .pipe(gulp.dest(path.build.img))
        .pipe(browserSync.reload({
            stream: true
        }));
});

// SPRITE
gulp.task('sprite', function() {
    var spriteData = gulp.src('src/img/sprite/*.png').pipe(spritesmith({
        retinaSrcFilter: ['src/img/sprite/*-2x.png'],
        retinaImgName: 'sprite-2x.png',
        retinaImgPath: '../img/sprite-2x.png',
        imgName: 'sprite.png',
        cssName: '_sprite.scss',
        padding: 5,
        algorithm: 'diagonal',
        imgPath: '../img/sprite.png'
    }));

    spriteData.img.pipe(gulp.dest('docs/img/'));
    spriteData.css.pipe(gulp.dest('src/sass/'));
    spriteData.pipe(browserSync.reload({
        stream: true
    }));

});

// FONTS
gulp.task('font', function() {
    gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.build.fonts))
        .pipe(browserSync.reload({
            stream: true
        }));
});

// VENDORS
gulp.task('vendors', function() {
    gulp.src(path.src.vendors)
        // .pipe(concat('libs.min.js'))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(uglify())
        .pipe(gulp.dest(path.build.vendors))
        .pipe(browserSync.reload({
            stream: true
        }));
});

// SERVICE FILES
gulp.task('buildServiceFiles', function() {
    var buildFiles = gulp.src([
        'src/mail.php', 'src/.htaccess', 'src/robots.txt'
    ]).pipe(gulp.dest('docs/'));
});

// CLEANING OF OLDER PROJECT
gulp.task('removedist', function() {
    return del.sync('build');
});

// WATCH
gulp.task('watch', ['browser-sync'], function() {
    gulp.watch(path.src.sass, ['style']);
    gulp.watch(path.src.html, ['html']);
    gulp.watch(path.src.js, ['js']);
    gulp.watch(path.src.img, ['image']);
    gulp.watch(path.src.fonts, ['font']);
    gulp.watch(path.src.vendors, ['vendors']);
});

// BUILD
gulp.task('build', [
    'removedist',
    'buildServiceFiles',
    'html',
    'sprite',
    'image',
    'style',
    'js',
    'font',
    'vendors',
    'browser-sync'
]);

gulp.task('default', ['build', 'watch']);

// DEPLOY
gulp.task('deploy', function() {

    var conn = ftp.create({
        host: 'crocus-foto.in.ua',
        user: 'romab162',
        password: 'B4h6Z0q4',
        parallel: 21,
        log: gutil.log
    });

    var globs = [
        'docs/**',
    ];
    return gulp.src(globs, {
            buffer: false
        })
        .pipe(conn.dest('/www/crocus-foto.in.ua/'));

});
