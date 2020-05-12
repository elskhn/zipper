const { src, dest, watch, series } = require("gulp"),
  pug = require("gulp-pug"),
  sass = require("gulp-sass"),
  browserSync = require("browser-sync").create(),
  prefix = require("gulp-autoprefixer"),
  rename = require("gulp-rename"),
  uglify = require("gulp-uglify"),
  babel = require("gulp-babel"),
  concat = require("gulp-concat"),
  streamqueue = require("streamqueue")


const paths = {
  dist: "./dist/",
  src: "./src/",
  assets: "./src/assets/",
  sass: "./src/sass/",
  scripts: "./src/js/"
}

function html(cb) {
  return src(paths.src + "*.pug")
    .pipe(pug())
    .on("error", (err) => {
      console.log(err.message + "\n")
      cb()
    })
    .pipe(rename("index.html"))
    .pipe(dest(paths.dist))
}

function styles() {
  return src(paths.sass + "styles.sass")
    .pipe(sass({
      includePaths: [paths.sass],
      errLogToConsole: true,
      outputStyle: "compressed",
      onError: browserSync.notify,
    }))
    .pipe(prefix('last 2 versions'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(dest(paths.dist + "css/"))
    .pipe(browserSync.stream())
}

function assets() {
  return src(paths.assets + "**/*")
    .pipe(dest(paths.dist + "assets/"))
}

function scripts() {
  let jsStream =
    src(paths.scripts + "*.js")
      .pipe(babel({
        "presets": ["@babel/env"]
      }))
      .pipe(uglify())

  return streamqueue({ objectMode: true }, src(paths.scripts + "lib/three.min.js"), jsStream)
    .pipe(concat('zipper-bundle.min.js'))
    .pipe(dest(paths.dist + "js/"))
}

function watchAndServe() {
  browserSync.init({
    server: {
      baseDir: paths.dist,
      serveStaticOptions: {
        "extensions": [
          "html"
        ]
      }
    },
    port: 8111
  })

  watch(paths.sass + "**/*.sass", styles)
  watch(paths.src + "**/*.pug", html)
  watch(paths.assets + "*", assets)
  watch(paths.scripts + "**/*.js", scripts)
  watch(paths.dist + "*.html").on("change", browserSync.reload)
}

exports.html = html
exports.styles = styles
exports.watch = watchAndServe
exports.default = process.argv.includes("--dev") && !process.argv.includes("--prod") ? series(html, styles, scripts, assets, watchAndServe) : series(html, styles, scripts, assets)
