'use strict';

const gulp = require('gulp');
const del = require('del');
const Builder = require('systemjs-builder');
const runSequence = require('run-sequence');
const concat = require('gulp-concat');
const cleanCss = require('gulp-clean-css');
const exec = require('child_process').execSync;

const utilities = require('@renovolive/gulp-utilities');
utilities.gulp.clean.config();
utilities.gulp.version.config();

const testBundleSource = '(source/ui.module.js + karma-test-setup.js + source/**/*.tests.js)';
utilities.gulp.bundle.config('tests', testBundleSource, {
	outDir: 'tests',
	outFile: 'tests.bundle.js',
});

const scriptFiles = [
	'./source/**/*.js',
	'./source/**/*.html',
	'./bootstrapper/**/*.js',
	'./bootstrapper/**/*.html',
	'./bootstrapper/*.js',
	'./bootstrapper/*.html',
];
const otherFiles = ['./source/**/*.css', '!./source/**/*.tests.js'];
const cssFiles = ['./node_modules/ng-wig/dist/**/*.css', './libraries/**/*.css', './source/**/*.css', '!./source/**/*ng2.css'];

const appBundleSource = 'bootstrapper/app.js';
utilities.gulp.bundle.config('bootstrapper', appBundleSource, {
	mainAppFiles: scriptFiles,
	outDir: 'bootstrapper',
	outFile: 'app.bundle.js',
});

gulp.task('bundle-all.watch', (done) => {
	gulp.watch(scriptFiles.concat(otherFiles), ['bundle-all']);
});

gulp.task('bundle-all', (done) => {
	runSequence('bundle-bootstrapper',
		'bundle-css',
		'bundle-css.minify',
		done);
});

gulp.task('bundle-css.watch', (done) => {
	gulp.watch(cssFiles, ['bundle.css']);
});

gulp.task('bundle-css', () => {
	return gulp.src(cssFiles)
		.pipe(concat('components.css'))
		.pipe(gulp.dest('./dist'));
});

gulp.task('bundle-css.minify', () => {
	return gulp.src(cssFiles)
		.pipe(cleanCss())
		.pipe(concat('components.min.css'))
		.pipe(gulp.dest('./dist'));
});

gulp.task('wipe-npm', () => {
	return del('node_modules');
});

gulp.task('run-update', () => {
	return exec('npm run update');
});

gulp.task('wipe-npm-update', ['wipe-npm'], () => {
	gulp.start('run-update');
});