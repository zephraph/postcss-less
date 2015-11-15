import gulp from 'gulp';

gulp.task('clean', () => {
    let del = require('del');
    return del(['build/']);
});

// Build

gulp.task('build:lib', ['clean'], () => {
    let babel = require('gulp-babel');
    return gulp.src('lib/*.es')
        .pipe(babel())
        .pipe(gulp.dest('build/lib'));
});

gulp.task('build:docs', ['clean'], () => {
    let ignore = require('fs').readFileSync('.npmignore').toString()
        .trim().split(/\n+/)
        .concat(['.npmignore', 'package.json', 'index.js'])
        .map( i => '!' + i );
    return gulp.src(['*'].concat(ignore))
        .pipe(gulp.dest('build'));
});

gulp.task('build:package', ['clean'], () => {
    let editor = require('gulp-json-editor');
    gulp.src('./package.json')
        .pipe(editor( (p) => {
            p.main = 'lib/scss-syntax';
            p.devDependencies['babel-core'] = p.dependencies['babel-core'];
            delete p.dependencies['babel-core'];
            return p;
        }))
        .pipe(gulp.dest('build'));
});

gulp.task('build', ['build:lib', 'build:docs', 'build:package']);

// Lint

gulp.task('lint', () => {
    let eslint = require('gulp-eslint');
    return gulp.src(['*.js', 'lib/*.es', 'test/*.es'])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

// Test

gulp.task('test', () => {
    require('babel-core/register')({ extensions: ['.es'], ignore: false });
    let mocha = require('gulp-mocha');
    return gulp.src('test/*.es', { read: false }).pipe(mocha());
});

gulp.task('integration', (done) => {
    require('babel-core/register')({ extensions: ['.es'], ignore: false });
    let postcss = require('postcss');
    let real    = require('postcss-parser-tests/real');
    let scss    = require('./');
    real(done, (css) => {
        return postcss().process(css, {
            parser: scss,
            map:    { annotation: false }
        });
    });
});

// Common

gulp.task('default', ['lint', 'test']);
