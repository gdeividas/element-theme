var gulp = require('gulp');
var series = require('run-sequence').use(gulp);
var task = require('./lib/task');
var vars = require('./lib/gen-vars');
var config = require('./lib/config');

var build = function (opts) {
	return function () {
		return task.build(Object.assign(opts, {message: 'build element theme'}));
	};
};

var fonts = function (opts) {
	return function () {
		return task.fonts(Object.assign(opts, {message: 'build theme font'}));
	};
};

exports.init = function (filePath) {
	filePath = {}.toString.call(filePath) === '[object String]' ? filePath : '';
	vars.init(filePath);
};

exports.watch = function (opts) {
	gulp.task('build', build(opts));
	exports.run(opts);
	gulp.watch(opts.config || config.config, ['build']);
};

exports.run = function (opts, cb) {

	// to avoid task "evication"
	var timestamp = +(new Date());
	var buildTaskName = "build" + timestamp;
	var fontsTaskName = "fonts" + timestamp;


	gulp.task(buildTaskName, build(opts));
	gulp.task(fontsTaskName, fonts(opts));
	if (typeof cb === 'function') {
		return series(buildTaskName, fontsTaskName, cb);
	}
	return series(buildTaskName, fontsTaskName);
};
