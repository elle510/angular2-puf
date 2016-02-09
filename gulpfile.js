'use strict';

var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var uglifycss = require('gulp-uglifycss');
var minifyhtml = require('gulp-minify-html');
var stripComments = require('gulp-strip-comments');
var stripDebug = require('gulp-strip-debug');
var less = require('gulp-less');

var typescript = require('gulp-typescript');
var sourcemaps = require('gulp-sourcemaps');
var tsconfig = require('./tsconfig.json');

var path = require("path");
var Builder = require('systemjs-builder');

var del = require('del');
var merge2 = require('merge2');
var runSequence = require('run-sequence');

//-----------------------
// configuration

// js
var SRC_PATH = 'puf-src';
var BUILD_PATH = 'puf-build/scripts';
var BUILD_BUNDLE_PATH = 'puf-build/scripts/bundles';
var DIST_PATH = 'puf-dist/puf/scripts';

// css
var LESS_PATH = 'less';
var BUILD_CSS_PATH = 'puf-build/styles';
var DIST_CSS_PATH = 'puf-dist/puf/styles';

var CONFIG = {
	src_files: SRC_PATH + '/**/*.ts',
	build_files: BUILD_PATH + '/**/*.js',
	bundle_files: BUILD_BUNDLE_PATH + '/*.js',
	
	// less 경로
	common_less: LESS_PATH + '/common/common.less',
	themes_less: LESS_PATH + '/themes/*.less',
	frame_less: LESS_PATH + '/main-frame-layouts/*.less',
	skins_less: LESS_PATH + '/skins/*.less',
	login_less: LESS_PATH + '/login/*.less',
	visualization_less: LESS_PATH + '/visualization/visualization.less',
	
	// 배포할 빌드 CSS
	common_css: BUILD_CSS_PATH + '/common.css',
	themes_css: BUILD_CSS_PATH + '/themes/*.css',
	visualization_css: BUILD_CSS_PATH + '/visualization.css'
};

var PUF_BUNDLE_CONFIG = [
	'puf/common',
	'puf/core',
	'puf/compiler',
	'puf/instrumentation',
	'puf/platform/browser',
	'puf/platform/common_dom'
];

var PUF_BUNDLE_CONTENT = PUF_BUNDLE_CONFIG.join(' + ') + ' - rxjs/*';

//-----------------------
// JS

// clean the contents of the distribution directory
//gulp.task('clean', function () {
//	return del([BUILD_PATH + '/**/*', DIST_PATH + '/**/*']);
//});

gulp.task('clean.js', ['clean.js:build', 'clean.js:dist']);

gulp.task('clean.js:build', function() {
	return del(BUILD_PATH);
});

gulp.task('clean.js:dist', function() {
	return del(DIST_PATH);
});

// TypeScript compile
gulp.task('compile', ['clean.js:build'], function() {
	return gulp.src(CONFIG.src_files)
				.pipe(sourcemaps.init())
				.pipe(typescript(tsconfig.compilerOptions))
				.pipe(sourcemaps.write('.'))
				.pipe(gulp.dest(BUILD_PATH));
});

gulp.task('bundle', ['compile'], function() {
	
	var builder = new Builder();
	var buildConfig = {
			baseURL: BUILD_PATH,
			defaultJSExtensions: true,
			paths: {
				'boot2': 'boot2.js',
				'app2.component': 'app2.component.js'
				//'puf/*': 'puf/*.js' 모듈명 boot2.js 를 boot2 로 한다.
				//'*': "*.js" 모든 모듈명에 붙는 .js 제거(?) 테스트 필요
			},
			meta: {
				//'angular2/*': {format: 'register', exports: 'angular2/*'}
				'angular2/*': {build: false}
				//'rxjs/*': {build: false}
			},
			map: {
				//'angular2': '../node_modules/angular2'
//				'rxjs': '../node_modules/rxjs'
			}/*,
			packages: {
				'app': {
					format: 'register',
					defaultExtension: 'js'
				}
			}*/
	};
	var outputConfig = {sourceMaps: true};
	builder.config(buildConfig);
	//builder.loader.defaultJSExtensions = true;
    return builder.bundle('boot2 + app2.component', BUILD_BUNDLE_PATH + '/puf.js', outputConfig);
    				/*
    				.then(function() {
    					console.log('Bundle Complete');
    					//done();
    				})
    				.catch(function(ex) {
    					console.log('error', ex);
    	                //done('Build failed.');
    				});
    				*/
	
});

//자바스크립트 파일을 하나로 합치고 압축한다.
gulp.task('dist.js', ['clean.js:dist', 'bundle'], function() {
	return merge2(
				gulp.src(CONFIG.bundle_files)
					//.pipe(stripComments())
					//.pipe(concat('puf.js', {newLine: '\n'}))
					.pipe(concat('puf.js'))
					.pipe(gulp.dest(DIST_PATH)),
				gulp.src(CONFIG.bundle_files)
					.pipe(stripDebug())
					.pipe(uglify())
					.pipe(concat('puf.min.js'))
					.pipe(gulp.dest(DIST_PATH))
			);
});
/*
gulp.task('dist.js:min', ['clean.js:dist', 'bundle'], function() {
	return gulp.src(CONFIG.bundle_files)
				.pipe(stripDebug())
				.pipe(uglify())
				.pipe(concat('puf.min.js'))
				.pipe(gulp.dest(DIST_PATH));
});
*/

//-----------------------
// CSS

gulp.task('clean.css', ['clean.css:build', 'clean.css:dist']);

gulp.task('clean.css:build', function() {
	return del(BUILD_CSS_PATH);
});

gulp.task('clean.css:dist', function() {
	return del(DIST_CSS_PATH);
});

gulp.task('less', ['clean.css:build'], function() {
	return merge2(
				gulp.src(CONFIG.common_less)
					.pipe(less())
					.pipe(gulp.dest(BUILD_CSS_PATH)),
				gulp.src(CONFIG.themes_less)
					.pipe(less())
					.pipe(gulp.dest(BUILD_CSS_PATH + '/themes')),
				gulp.src(CONFIG.frame_less)
					.pipe(less())
					.pipe(gulp.dest(BUILD_CSS_PATH + '/main-frame-layouts')),
				gulp.src(CONFIG.skins_less)
					.pipe(less())
					.pipe(gulp.dest(BUILD_CSS_PATH + '/skins')),
				gulp.src(CONFIG.login_less)
					.pipe(less())
					.pipe(gulp.dest(BUILD_CSS_PATH + '/login')),
				gulp.src(CONFIG.visualization_less)
					.pipe(less())
					.pipe(gulp.dest(BUILD_CSS_PATH))
			);
	
//	return gulp.src([CONFIG.common_less, CONFIG.themes_less])
//				/*
//	    		.pipe(less({
//	    			paths: [ path.join(__dirname, 'less', 'includes') ]
//	    		}))
//	    		*/
//				.pipe(less())
//	    		.pipe(gulp.dest(BUILD_CSS_PATH));
});

gulp.task('dist.css', ['clean.css:dist', 'less'], function() {
	var rename = require('gulp-rename');
	
	return merge2(
				gulp.src(CONFIG.common_css).pipe(gulp.dest(DIST_CSS_PATH)),
				gulp.src(CONFIG.themes_css).pipe(gulp.dest(DIST_CSS_PATH + '/themes')),
				gulp.src(CONFIG.visualization_css).pipe(gulp.dest(DIST_CSS_PATH)),
				
				gulp.src(CONFIG.common_css)
					.pipe(uglifycss())
					.pipe(rename({extname: '.min.css'}))
					.pipe(gulp.dest(DIST_CSS_PATH)),
				gulp.src(CONFIG.themes_css)
					.pipe(uglifycss())
					.pipe(rename({extname: '.min.css'}))
					.pipe(gulp.dest(DIST_CSS_PATH + '/themes')),
				gulp.src(CONFIG.visualization_css)
					.pipe(uglifycss())
					.pipe(rename({extname: '.min.css'}))
					.pipe(gulp.dest(DIST_CSS_PATH))
			);
});

//gulp.task('dist.css:min', ['clean.css:dist','less'], function() {
//	var rename = require('gulp-rename');
//	
//	return merge2(
//				gulp.src(CONFIG.common_css)
//					.pipe(uglifycss())
//					.pipe(rename({extname: '.min.css'}))
//					.pipe(gulp.dest(DIST_CSS_PATH)),
//				gulp.src(CONFIG.themes_css)
//					.pipe(uglifycss())
//					.pipe(rename({extname: '.min.css'}))
//					.pipe(gulp.dest(DIST_CSS_PATH + '/themes')),
//				gulp.src(CONFIG.visualization_css)
//					.pipe(uglifycss())
//					.pipe(rename({extname: '.min.css'}))
//					.pipe(gulp.dest(DIST_CSS_PATH))
//			);
//	
////	return gulp.src(CONFIG.css_files)
////	    		/*
////				.pipe(uglifycss({
////	    			"max-line-len": 80
////	    		}))
////	    		*/
////				.pipe(uglifycss())
////				.pipe(rename({extname: '.min.css'}))
////	    		.pipe(gulp.dest(DIST_CSS_PATH));
//});

//-----------------------
// Demo

var DEMO_SRC_PATH = './webapps/puf-demo';
var DEMO_BUILD_PATH = './webapps/puf-demo/scripts';

gulp.task('clean.demo', function() {
	return del(DEMO_BUILD_PATH);
});

// demo compile
gulp.task('build.demo', ['clean.demo'], function() {
	var demo_tsconfig = require('./webapps/puf-demo/tsconfig.json');
	return gulp.src(DEMO_SRC_PATH + '/**/*.ts')
				.pipe(sourcemaps.init())
//				.pipe(typescript({module:'system', moduleResolution: 'node', experimentalDecorators: true}))
				.pipe(typescript(demo_tsconfig.compilerOptions))
				.pipe(sourcemaps.write('.'))
				.pipe(gulp.dest(DEMO_BUILD_PATH));
});

//-----------------------
// Tutorial

var TUTORIAL_SRC_PATH = './webapps/tutorial';
var TUTORIAL_BUILD_PATH = './webapps/tutorial';

gulp.task('clean.tutorial', function() {
	return del([TUTORIAL_BUILD_PATH + '/**/*.js', TUTORIAL_BUILD_PATH + '/**/*.js.map', '!./webapps/tutorial/lib/**/*']);
});

//demo compile
gulp.task('build.tutorial', ['clean.tutorial'], function() {
	var tutorial_tsconfig = require('./webapps/tutorial/tsconfig.json');
	return gulp.src(TUTORIAL_SRC_PATH + '/**/*.ts')
				.pipe(sourcemaps.init())
				.pipe(typescript(tutorial_tsconfig.compilerOptions))
				.pipe(sourcemaps.write('.'))
				.pipe(gulp.dest(TUTORIAL_BUILD_PATH));
});

//-----------------------
// puf copy

gulp.task('webapps:clean', function() {
	return del('webapps/puf');
});

gulp.task('webapps:copy', ['webapps:clean'], function() {
	return gulp.src('puf-dist/puf/**/*')
				.pipe(gulp.dest('webapps/puf'));
});

gulp.task('webapps.js:clean', function() {
	return del('webapps/puf/scripts');
});

gulp.task('webapps.js:copy', ['webapps.js:clean', 'dist.js'], function() {
	return gulp.src('puf-dist/puf/scripts/**/*')
				.pipe(gulp.dest('webapps/puf/scripts'));
});

gulp.task('webapps.css:clean', function() {
	return del('webapps/puf/styles');
});

gulp.task('webapps.css:copy', ['webapps.css:clean', 'dist.css'], function() {
	return gulp.src('puf-dist/puf/styles/**/*')
				.pipe(gulp.dest('webapps/puf/styles'));
});

//-----------------------
// task 설정

gulp.task('clean', ['clean.js', 'clean.css']);											// puf js/css clean
gulp.task('build.js', ['compile', 'bundle', 'dist.js', 'webapps.js:copy']);				// puf js
gulp.task('build.css', ['less', 'dist.css', 'webapps.css:copy']);						// puf css
gulp.task('build', ['build.js', 'build.css', 'webapps:copy']);							// puf js/css
//gulp.task('build.app', ['build.demo', 'build.tutorial']);								// puf-demo/tutorial
gulp.task('default', ['build.js', 'build.css', 'build.demo', 'build.tutorial']);		// puf/puf-demo/tutorial