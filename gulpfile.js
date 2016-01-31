'use strict';

var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var uglifycss = require('gulp-uglifycss');
var minifyhtml = require('gulp-minify-html');
var stripComments = require('gulp-strip-comments');
var stripDebug = require('gulp-strip-debug');
var path = require("path");
var Builder = require('systemjs-builder');

//-----------------------
//configuration

var BUILD = 'puf-build/app';
var DIST = 'puf-dist';

var PATHS = {
	js: BUILD + '/**/*.js'
	//scss: SRC + '/scss/*.scss',
	//html: BUILD + '/**/*.html'
};

var bundleConfig = {
	paths: {"*": "dist/js/prod/es5/*.js"},
	// Files that end up empty after transpilation confuse system-builder
	// and need to be explitily listed here.
	// TODO: upgrade system builder and find a way to declare all input as cjs.
	meta: {
		'angular2/src/router/route_definition': {format: 'cjs'},
		'angular2/src/common/directives/observable_list_diff': {format: 'cjs'},
		'angular2/lifecycle_hooks': {format: 'cjs'}
	}
};

gulp.task('dist-js', function () {
	return gulp.src(PATHS.js)
				//.pipe(stripComments())
				//.pipe(concat('puf.js', {newLine: '\n'}))
				.pipe(concat('puf.js'))
				.pipe(gulp.dest(DIST + '/js'));
});

//자바스크립트 파일을 하나로 합치고 압축한다.
gulp.task('dist-min-js', function () {
	return gulp.src(PATHS.js)
				.pipe(stripDebug())
				.pipe(uglify())
				.pipe(concat('puf.min.js'))
				.pipe(gulp.dest(DIST + '/js'));
});

gulp.task('bundle-js', function () {
	var builder = new Builder();
	var builderConfig = {sourceMaps: true};
	builder.config(builderConfig);
    return builder.build('puf-build/app/*', 'puf-build/bundles/puf.js', builderConfig);
});
	
//기본 task 설정
gulp.task('default', ['dist-js', 'dist-min-js', 'bundle', 'build']);