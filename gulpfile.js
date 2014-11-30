var gulp  = require('gulp');
var sass = require('gulp-sass');
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');

gulp.task('sass', function(){
	return gulp.src('scss/main.scss')
	.pipe(sass())
	.pipe(gulp.dest('dist'))
});

gulp.task('lint', function(){
	return gulp.src('js/*.js')
	.pipe(jshint())
	.pipe(jshint.reporter('default'));
})

gulp.task('scripts', function(){
	return gulp.src('js/script.js')
	.pipe(concat('script.js'))
	.pipe(gulp.dest('dist'))
	.pipe(rename('script.min.js'))
	.pipe(uglify())
	.pipe(gulp.dest('dist'))
});

gulp.task('watch', function(){
	gulp.watch('js/*.js',['lint','scripts']);
	gulp.watch('scss/*.scss',['sass']);
});

gulp.task('default', ['lint','sass','scripts','watch']);

