"use strict";

let gulp = require("gulp"),
    csso = require("gulp-csso"),
	cp = require("child_process"),
	browserSync = require('browser-sync').create(),
	sass = require('gulp-sass')(require('sass'));

gulp.task("sass", async function() {
	return gulp.src( '_scss/**/*.scss')
		.pipe( sass().on('error', sass.logError) )
		.pipe( csso() )
		.pipe( gulp.dest( './docs/css/' ) )
		.pipe( browserSync.stream({ match: '**/*.css' }) )
	;
});

gulp.task('copy', function() {
    return gulp.src([
		'_scss/fa/css/*.css',
		'_scss/fa/fa/webfonts/*.eot',
		'_scss/fa/webfonts/*.svg',
		'_scss/fa/webfonts/*.ttf',
		'_scss/fa/webfonts/*.woff',
		'_scss/fa/webfonts/*.woff2',
		'_scss/theme/*.css'
	], {base:'_scss/'})
        .pipe(gulp.dest('./docs/css/'));
});

// Jekyll
gulp.task("jekyll-dev", function() {
	return cp.spawn("bundle", ["exec", "jekyll", "build --baseurl ''"], { stdio: "inherit", shell: true });
});

// Jekyll
gulp.task("jekyll", function() {
	return cp.spawn("bundle", ["exec", "jekyll", "build"], { stdio: "inherit", shell: true });
});

gulp.task("watch", function() {

	browserSync.init({
		server: {
            baseDir: "./docs/"
		}
	});

	gulp.watch( '_scss/**/*.scss', gulp.series('sass') );

	gulp.watch(
		[
			"./*.html",
			"./*.yml",
			"./_includes/*.html",
			"./_layouts/*.html",
			"./_data/*.json"
		]
	).on('change', gulp.series('jekyll-dev', 'sass', 'copy') );
	//).on('change', gulp.series('jekyll-dev', 'sass') );

	gulp.watch( 'docs/**/*.html' ).on('change', browserSync.reload );
	gulp.watch( 'docs/**/*.js' ).on('change', browserSync.reload );
});

gulp.task("default", gulp.series('jekyll-dev', 'sass', 'copy', 'watch'));
//gulp.task("default", gulp.series('jekyll-dev', 'sass', 'watch'));

gulp.task("deploy", gulp.series('jekyll', 'sass', 'copy' , function() {
//gulp.task("deploy", gulp.series('jekyll', 'sass', function() {
	return cp.spawn('git status && git commit -am "GHP deploy" && git pull && git push', { stdio: "inherit", shell: true });
}));