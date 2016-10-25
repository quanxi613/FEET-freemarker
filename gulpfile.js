var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var ext_replace = require('gulp-ext-replace');
var config = require('./config.json');
var runSequence = require('run-sequence');


gulp.task('connect', function () {
    $.connect.server({
	    root: ['./app', './dist'],
	    livereload: true,
	    port: 9001
	});

    //var proxy = httpProxy.createProxyServer({});

    browserSync({
	    notify: false,
	    port: 9000,
	    server: {
	        baseDir: ['dist'],
	        directory: true
    	}
  	});

  	gulp.watch('./app/src/css/**/*.less', ['less', reload]);
	gulp.watch('./app/WEB-INF/view/**/*.ftl', ['ftl', reload]);
	gulp.watch('./app/src/js/**/*.js', ['js', reload]);
	gulp.watch('./app/src/js/**/*.hbs', ['jstpl', reload]);
});

gulp.task('ftl', function () {
  return gulp.src('./app/mock/**/*.json')
    .pipe($.freemarker({
        viewRoot: __dirname + '/app/WEB-INF/view/',
        options: {}
    }))
    .pipe(ext_replace('.html'))
    .pipe(gulp.dest('./dist/WEB-INF/view'));
});

gulp.task('img', function () {
  return gulp.src('./app/src/img/**/*')
    .pipe($.imagemin({
      progressive: true,
      interlaced: true,
      // don't remove IDs from SVGs, they are often used
      // as hooks for embedding and styling
      svgoPlugins: [{cleanupIDs: false}]
    }))
    .pipe(gulp.dest(config.dist + 'src/img'));
});

gulp.task('less', function () {
	var AUTOPREFIXER_BROWSERS = [
		'ie >= 8',
		'ff >= 30',
		'chrome >= 34',
		'safari >= 7',
		'opera >= 23'
	];

	return gulp.src(['./app/src/css/**/*.less', '!./app/src/css/Common/include/*.less'])
	.pipe($.plumber())
	.pipe($.watchLess('./app/src/css/**/*.less'))
	.pipe($.changed(config.dist + 'src/css', {extension: '.css'}))
	.pipe($.sourcemaps.init())
	.pipe($.less())
	.pipe($.postcss([
	  require('autoprefixer')({browers: AUTOPREFIXER_BROWSERS})
	]))
	.pipe($.sourcemaps.write())
	.pipe($.if(config.uglify, $.csso()))
	.pipe(gulp.dest(config.dist + 'src/css'))
	.pipe($.plumber.stop())
	.pipe(reload({stream: true}));
});

gulp.task('js', function () {
	return gulp.src('./app/src/js/**/*.js')
	.pipe($.changed(config.dist + 'src/js'))
	.pipe($.if(config.uglify, $.uglify()))
	.pipe(gulp.dest(config.dist + 'src/js'));
});

gulp.task('jstpl', function () {
	return gulp.src('./app/src/js/**/*.hbs')
	.pipe($.handlebars())
	.pipe($.defineModule('amd'))
	.pipe(gulp.dest(config.dist + 'src/js'));
});

gulp.task('clean', require('del').bind(null, ['dist']));

var build = ['ftl', 'jstpl', 'less', 'js', 'img'];
var local = ['ftl', 'jstpl', 'less', 'js', 'img'];

//本地调试
gulp.task('default', function (callback) {
	runSequence(
		'clean',
		local,
		'connect',
		callback
	);
});


//发布版本
gulp.task('build', function (callback) {
	runSequence(
		build,
		callback
	);
});
