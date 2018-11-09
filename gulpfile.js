/* 
	var moduel = require('module')
	gulp.task - define tasks
	gulp.src - points to files or folders
	gulp.dest - where to place the compiled files
	gulp.watch - watch files 

	*/

var gulp = require("gulp");
var sass = require("gulp-sass");

const SCSS_SRC = "./src/scss/**/*.scss";
const SCSS_DEST = "./src/css";

gulp.task("sass", function() {
  gulp
    .src(SCSS_SRC)
    .pipe(sass().on("error", sass.logError))
    .pipe(gulp.dest(SCSS_DEST));
});

gulp.task("default", ["sass_watch"]);

gulp.task("sass_watch", function() {
  gulp.watch(SCSS_SRC, ["sass"]);
});
