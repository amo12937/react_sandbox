var gulp = require("gulp");

var dir = (root) => {
  var self = (path) => `${root}/${path}`;
  self.scripts = (path) => self(`scripts/${path}`)

  return self;
};

var src = dir("src");
var dest = dir("dest");

gulp.task("html", () =>
  gulp.src(src("index.html"))
  .pipe(gulp.dest(dest("")))
);

((
  babelify = require("babelify"),
  browserify = require("browserify"),
  buffer = require("vinyl-buffer"),
  source = require("vinyl-source-stream")
) => {
  gulp.task("scripts", () =>
    browserify({
      entries: [src.scripts("index.jsx")],
      extensions: [".js", ".jsx"],
      paths: ["src/scripts/"]
    })
    .transform(babelify)
    .bundle()
    .on("error", (err) => console.log("Error : " + err.message))
    .pipe(source("bundle.js"))
    .pipe(buffer())
    .pipe(gulp.dest(dest.scripts("")))
  );
})();

((browserSync = require("browser-sync")) => {
  gulp.task("browser-sync", () => browserSync({server: dest("")}));

  gulp.task("reload", browserSync.reload);

  gulp.task("watch", () => {
    gulp.watch(src("index.html"))
    .on("change", gulp.series("html", "reload"));

    gulp.watch([src.scripts("index.jsx"), src.scripts("components/**/*.jsx")])
    .on("change", gulp.series("scripts", "reload"));
  });
})();

gulp.task("dev", gulp.series(gulp.parallel("html", "scripts"), gulp.parallel("browser-sync", "watch")));

