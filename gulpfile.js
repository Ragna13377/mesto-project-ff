//TODO: картинки прожать попробуй
//TODO: устранить различие в пути. Тесты гитхаб без папки src/правильно с папкой src
const gulp = require('gulp');
const fs = require('fs');
const del = require('del');
const gulpIf = require('gulp-if');
const plumber = require('gulp-plumber');
const htmlMinifier = require('html-minifier');
const replace = require('gulp-replace');
const sass = require('gulp-sass')(require('sass'));
const concat = require('gulp-concat-css');
const postCss = require('gulp-postcss');
const cssnano = require('cssnano'); //gulp-clean-css
const autoprefixer = require('autoprefixer'); //gulp-autoprefixer
const postCssCombineMediaQuery = require('postcss-combine-media-query'); //gulp-group-css-media-queries
const fonter = require('gulp-fonter');
const ttf2woff2 = require('gulp-ttf2woff2');
const browserSync = require('browser-sync').create();
const pug = require('gulp-pug');
const webpack = require('webpack-stream');

let isBuild = process.argv.includes('--build');

const plugins = [
  autoprefixer({
    grid: true,
    cascade: true,
  }),
  postCssCombineMediaQuery(),
  cssnano(),
];
const options = {
  removeComments: true,
  removeRedundantAttributes: true,
  removeScriptTypeAttributes: true,
  removeStyleLinkTypeAttributes: true,
  sortClassName: true,
  useShortDoctype: true,
  collapseWhitespace: true,
  minifyCSS: true,
  keepClosingSlash: true,
};

let srcFolder = '.';
let distFolder = './_dist';

let path = {
  dest: {
    html: `${distFolder}/`,
    css: `${distFolder}/styles/`,
    js: `${distFolder}/scripts/`,
    images: `${distFolder}/images/`,
    svg: `${distFolder}/svg/`,
    fonts: `${distFolder}/fonts/`,
  },
  // css: [`${srcFolder}/**/*.css`, `!${srcFolder}/**/fonts.css`], Пример отрицания
  src: {
    html: `${srcFolder}/*.pug`,
    scss: [`${srcFolder}/styles/**.scss`, `!${srcFolder}/styles/{global,variables}.scss`],
    scss_layout: `${srcFolder}/layout/**/*.scss`,
    js: `${srcFolder}/scripts/**/*.js`,
    images: `${srcFolder}/images/**/*.{avif,webp,ico,gif,png,jpg}`,
    svg: `${srcFolder}/svg/**/*.svg`,
    fonts: `${srcFolder}/fonts`,
    font_style: `${srcFolder}/fonts/fonts.scss`,
  },
  // css: `${srcFolder}/**/*.css`,
  watch: {
    html: `${srcFolder}/**/*.pug`,
    scss: `${srcFolder}/styles/**/*.scss`,
    scss_components: `${srcFolder}/components/**/*.scss`,
    scss_layout: `${srcFolder}/layout/**/*.scss`,
    js: `${srcFolder}/scripts/**/*.js`,
    images: `${srcFolder}/images/**/*.{avif,webp,ico,gif,png,jpg}`,
    svg: `${srcFolder}/svg/**/*.svg`,
    font_style: `${srcFolder}/fonts/fonts.scss`,
  },
  clean: `./${distFolder}/`,
};

const font = gulp.series(otfToTtfAndWoff, ttfToWoff2, fontsStyle);
const build = gulp.series(fonts, gulp.parallel(html, scss, scss_layout, js, images, svg));
const watch = gulp.series(clean, build, gulp.parallel(watchFiles, server));

function server(params) {
  browserSync.init({
    server: {
      baseDir: `${path.dest.html}`,
    },
    port: 3000,
    notify: false,
  });
}

function html() {
  return (
    gulp
      .src(path.src.html)
      .pipe(plumber())
      .pipe(
        pug({
          pretty: !isBuild,
        })
      )
      .pipe(
        replace(
          /((?:src|srcset)=")(?:\.\.\/)+(images\/(?:(?:\w+\/)+)?\w+(?:.avif|.webp|.svg|.gif|.png|.jpg)")/gi,
          '$1./$2'
        )
      )
      .on('data', function (file) {
        if (isBuild) {
          const bufferFile = Buffer.from(
            htmlMinifier.minify(file.contents.toString(), options)
          );
          return (file.contents = bufferFile);
        }
      })
      .pipe(gulp.dest(path.dest.html))
      .pipe(browserSync.stream())
  );
}

//compressed/expanded
function scss() {
  return gulp
    .src(path.src.scss, {})
    .pipe(plumber())
    .pipe(
      replace(
        /(url\((?:'|")?)(?:\.\.\/)+(images\/(?:(?:\w+\/)+)?\w+(?:.avif|.webp|.svg|.gif|.png|.jpg)(?:'|")?\))/gi,
        '$1../$2'
      )
    )
    .pipe(
      sass({
        outputStyle: 'expanded',
      })
    )
    .pipe(gulpIf(isBuild, postCss(plugins)))
    .pipe(gulp.dest(path.dest.css))
    .pipe(browserSync.stream());
}

function scss_layout(){
  return gulp
      .src(path.src.scss_layout, {})
      .pipe(plumber())
      .pipe(
          replace(
              /(url\((?:'|")?)(?:\.\.\/)+(images\/(?:(?:\w+\/)+)?\w+(?:.avif|.webp|.svg|.gif|.png|.jpg)(?:'|")?\))/gi,
              '$1../$2'
          )
      )
      .pipe(
          sass({
            outputStyle: 'expanded',
          })
      )
      .pipe(gulpIf(isBuild, postCss(plugins)))
      .pipe(gulp.dest(path.dest.css))
      .pipe(browserSync.stream());
}

function css() {
  return gulp
    .src(path.src.css, {})
    .pipe(plumber())
    .pipe(concat('bundle.css'))
    .pipe(gulpIf(isBuild, postCss(plugins)))
    .pipe(gulp.dest(path.dest.css))
    .pipe(browserSync.stream());
}

function font_style() {
  return gulp
    .src(path.src.font_style)
    .pipe(plumber())
    .pipe(
      replace(
        /(url\((?:'|")?)(?:\.\.\/)+(images\/(?:(?:\w+\/)+)?\w+(?:.avif|.webp|.svg|.gif|.png|.jpg)(?:'|")?\))/gi,
        '$1../$2'
      )
    )
    .pipe(
      sass({
        outputStyle: 'expanded',
      })
    )
    .pipe(gulpIf(isBuild, postCss(plugins)))
    .pipe(gulp.dest(path.dest.fonts))
    .pipe(browserSync.stream());
}

function js() {
  return gulp
    .src(path.src.js)
    .pipe(plumber())
    .pipe(
      webpack({
        mode: isBuild ? 'development' : 'development',
        output: {
          filename: 'app.min.js',
        },
      })
    )
    .pipe(gulp.dest(path.dest.js))
    .pipe(browserSync.stream());
}

function images() {
  return gulp.src(`${path.src.images}`).pipe(gulp.dest(`${path.dest.images}`));
}

function svg() {
  return gulp.src(`${path.src.svg}`).pipe(gulp.dest(`${path.dest.svg}`));
}

function fonts() {
  return gulp
    .src(`${srcFolder}/fonts/*.{ttf,otf,woff,woff2,svg}`)
    .pipe(gulp.dest(path.dest.fonts))
    .pipe(font_style());
}

function otfToTtfAndWoff() {
  return gulp
    .src(`${path.src.fonts}/*.otf`, {})
    .pipe(plumber())
    .pipe(
      fonter({
        formats: ['ttf', 'woff'],
      })
    )
    .pipe(gulp.dest(`${path.src.fonts}`));
}

function ttfToWoff2() {
  return gulp
    .src(`${path.src.fonts}/*.ttf`)
    .pipe(plumber())
    .pipe(ttf2woff2())
    .pipe(gulp.dest(path.src.fonts));
}

function fontsStyle() {
  let fontsFile = path.src.font_style;
  fs.readdir(path.dest.fonts, function (err, fontsFiles) {
    if (fontsFiles) {
      if (!fs.existsSync(fontsFile)) {
        fs.writeFile(fontsFile, '', cb);
        let newFileOnly;
        for (let i = 0; i < fontsFiles.length; i++) {
          let fontFileName = fontsFiles[i].split('.')[0];
          if (newFileOnly !== fontFileName) {
            let fontName = fontFileName.split('-')[0]
              ? fontFileName.split('-')[0]
              : fontFileName;
            let fontWeight = fontFileName.split('-')[1]
              ? fontFileName.split('-')[1]
              : fontFileName;
            switch (fontWeight.toLowerCase()) {
              case 'thin':
                fontWeight = 100;
                break;
              case 'extralight':
                fontWeight = 200;
                break;
              case 'light':
                fontWeight = 300;
                break;
              case 'regular':
                fontWeight = 400;
                break;
              case 'medium':
                fontWeight = 500;
                break;
              case 'semibold':
                fontWeight = 600;
                break;
              case 'bold':
                fontWeight = 700;
                break;
              case 'extrabold':
                fontWeight = 800;
                break;
              case 'black':
                fontWeight = 900;
                break;
              default:
                fontWeight = 400;
            }
            fs.appendFile(
              fontsFile,
              `@font-face {\n\tfont-family: ${fontName};\n\tfont-display: swap;\n\tsrc: url(../fonts/${fontFileName}.woff2) format("woff2"), url(../fonts/${fontFileName}.woff) format("woff"), url(../fonts/${fontFileName}.ttf) format("truetype"), url(../fonts/${fontFileName}.otf) format("opentype");\n\tfont-weight: ${fontWeight};\n\t}\r\n`,
              function () {}
            );
            newFileOnly = fontFileName;
          }
        }
      }
    }
  });
  return gulp.src(`${srcFolder}`);
  function cb() {}
}

function clean() {
  return del('_dist');
}

// gulp.watch([path.watch.css], css);
function watchFiles() {
  gulp.watch([path.watch.html], html);
  gulp.watch([path.watch.scss], scss);
  gulp.watch([path.watch.scss_components], scss);
  gulp.watch([path.watch.scss_layout], scss_layout);
  gulp.watch([path.watch.font_style], font_style);
  gulp.watch([path.watch.js], js);
  gulp.watch([path.watch.images], images);
  gulp.watch([path.watch.svg], svg);
}

exports.font = font;
exports.build = build;
exports.watch = watch;
exports.default = watch;
