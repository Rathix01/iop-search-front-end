var gulp = require('gulp'),
	bower = require('gulp-bower'),
	concat = require('gulp-concat'),
	dest = require('gulp-dest'),
	filter = require('gulp-filter'),
	mainBowerFiles = require('main-bower-files'),
	sass = require('gulp-sass');

var config = {
	// The bower directory.
	bowerDir: './bower_components' ,
	// The distribution folder - this gets committed to Git for Bower purposes.
	distDir: './dist/',
	// The temporary directory where temporary untracked files should be stored.
	tempDir: './temp/',
	// The SASS files to compile.
	sassSrc: [
		'./sass/**/*.scss'
	],
	// The SASS files to pass to the SASS compiler.
	compileSass: [
		'./sass/tvguide/demo.scss'
	],
	// The JS sources to include in the main distributable.
	jsSrc: [
		'./js/thirdparty/*.js',
		'./js/modules/*.js',
		'./js/directives/*.js',
		'./js/services/*.js'
	]
};

// Install the Bower dependencies.
gulp.task('bower', function() { 
	return bower()
         .pipe(gulp.dest(config.bowerDir)) 
});

// Get the Bower dependencies and concatenate into a single bower.js file.
gulp.task('bower-concat', ['bower'], function() {
	gulp.src(mainBowerFiles())
		.pipe(filter('*.js'))
		.pipe(concat('bower.js'))
		.pipe(gulp.dest(config.tempDir));
});

// Concatenate the JS files into a single distributable.
gulp.task('concat', function() {
	gulp.src(config.jsSrc)
		.pipe(concat('tvguide.js'))
		.pipe(gulp.dest(config.distDir));
});

// Build the SASS files and place the CSS into the temporary directory.
gulp.task('sass', function () {
    gulp.src(config.compileSass)
        .pipe(sass())
        .pipe(gulp.dest(config.tempDir));
});

// The watch gulp task.
gulp.task('watch', function () {
   gulp.watch([ config.sassSrc, config.jsSrc ], ['concat', 'sass']);
});

// The default gulp task.
gulp.task('default', ['bower-concat', 'concat', 'sass'], function() {
});
