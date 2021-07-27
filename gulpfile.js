'use strict';

/**
 * common setting
 */

// load plugins
const gulp = require('gulp');
const fs = require('fs');
const bs = require('browser-sync').create();
const reload = bs.reload;
const $ = require('gulp-load-plugins')();

// load plugins for TypeScript
const webpackStream = require("webpack-stream");
const webpack = require("webpack");

// webpackの設定ファイルの読み込み
const webpackConfig = require("./webpack.config.js");

// 前方互換性のため、gulp-sassのコンパイルにnode-sassを明示的に指定
$.sass.compiler = require('node-sass');

// common value
const config = {
  root: './',
  src: 'src/',
  dist: 'static/',
  public: 'public/',
  assets: 'assets/',
  styleguide: '_styleguide/'
};

// gulp task対象ファイル
const srcSet = {
  html: [config.src + '**/*.html', '!' + config.src + '**/_*/**', '!' + config.src + '**/_*'],
  ejs: [config.src + '**/*.ejs', '!' + config.src + config.styleguide + '**/*.ejs'], // スタイルガイドを除く
  json: [config.src + '**/*.json'],
  img: config.src + '**/*.?(png|jpg|gif|svg)',
  scss: [config.src + '**/*.scss', '!' + config.src + config.styleguide + '**/*.scss'],
  ts: [config.src + '**/!(_)*.ts'],
  js: [ config.src + '**/!(_)*.js', '!' + config.src + '**/concat/**/*.js'],
  jsMin: config.src + '**/_*.js',
  jsUtilConcat: config.src + config.assets + 'js/utils/concat/**/*.js',
  libConcat: config.src + config.assets + 'lib/concat/**/*.js',
  styleguide: config.src + config.styleguide + '**/*',
  styleguideScss: config.src + config.styleguide + '**/*.scss',
};

/**
 * tasks
 */

// html setting =========================================
const html = () => {
  console.log('========== 📄 html を dist に持っていく');
  return gulp.src(srcSet.html, { base: config.src })
    .pipe(gulp.dest(config.dist));
};
exports.html = html;

const ejs = () => {
  console.log('========== 📄 ejs をhtml に変換して dist に持っていく');
  // 監視対象には_付きファイルを含むので、このタイミングでコンパイル対象から除外する
  const targetFile = srcSet.ejs.concat(['!' + config.src + '**/_*']);
  // JSONデータを取得する（監視対象に入っているのでejs関数内で読み込む）
  const json_meta = JSON.parse(fs.readFileSync(config.src + '_ejs/json/meta.json', 'utf8'));

  return gulp.src(targetFile, { base: config.src })
    // includeする際のファイルパスを設定する
    .pipe($.data(file => {
      return {
        'relativePath': '../'.repeat(file.path.split(config.src)[1].split('/').length - 1)
      }
    }))
    // 対象ファイルを.htmlに変換する
    .pipe($.ejs({ 'meta': json_meta }, {/* async: true */ }))
    .pipe($.rename({ extname: '.html' }))
    // distディレクトリへ格納
    .pipe(gulp.dest(config.dist));
};
exports.ejs = ejs;

// img setting =========================================
const img = () => {
  console.log('========== 🏞 画像 を dist に持っていく');
  return gulp.src(srcSet.img, { base: config.src })
    .pipe(gulp.dest(config.dist));
};
exports.img = img;

// styles setting =========================================
const styles = () => {
  console.log('========== 🎨 scss から css を生成');
  return gulp.src(srcSet.scss, { base: config.src })
    // エラー時でもタスクを続行
    .pipe($.plumber())
    // sass内でglobを利用
    .pipe($.sassGlob())
    // sassのコンパイル（小数点4桁, expanded, コンパイルエラーを表示）
    .pipe($.sass({
      precision: 4
    }).on('errror', $.sass.logError))
    // コード整形（設定は /.csscomb.json 参照）
    .pipe($.csscomb())
    .pipe($.postcss([
      // ベンダープレフィックスの自動付与
      require('autoprefixer')({
        cascade: false
      }),
      //メディアクエリーの最適化
      require('css-mqpacker')()
    ]))
    // ミニファイしてコメント削除 (/*! ... */記述は削除対象外）
    .pipe($.cleanCss({
      compatibility: {
        properties: {
          zeroUnits: true
        }
      },
      format: 'keep-breaks',
      level: {
        1: {
          specialComments: 'all'
        }
      }
    }))
    // dist
    .pipe(gulp.dest(config.dist));
};
exports.styles = styles;

// styleguide setting =========================================
const aigis = () => {
  console.log('========== 📜 スタイルガイドを生成');
  return gulp.src(config.src + config.styleguide + '/aigis_config.yml')
    .pipe($.aigis());
};
exports.aigis = aigis;

// sgStyles setting =========================================
const sgStyle = () => {
  return gulp.src(srcSet.styleguideScss, {base: config.src+ config.styleguide})
    .pipe($.plumber())
    .pipe($.sassGlob())
    .pipe($.sass({
      precision: 4
    }).on('errror', $.sass.logError))
    .pipe($.postcss([
      require('autoprefixer')({
        cascade: false
      }),
      require('css-mqpacker')()
    ]))
    .pipe($.cleanCss({
      compatibility: {
        properties: {
          zeroUnits: true
        }
      },
      format: 'keep-breaks',
      level: {
        1: {
          specialComments: 'all'
        }
      }
    }))
    .pipe(gulp.dest(config.src + config.styleguide + 'styleguide_assets/'));
};
exports.sgStyle = sgStyle;


// scripts setting =========================================
// 正規表現で '/*!' などのLicenseコメントを検出
const licenseRegexp = /^\!|^@license|^@preserve|\(c\)|License|Copyright/mi;
// そのまま dist
const jsDist = () => {
  return gulp.src(srcSet.js, { base: config.src })
    .pipe(gulp.dest(config.dist));
};
exports.jsDist = jsDist;

// _（アンダースコア）から始まる js ファイルはミニファイして .min.js に変更して dist
const jsMin = () => {
  return gulp.src(srcSet.jsMin, { base: config.src })
    // コメントブロックにlicense表記があれば残す
    .pipe($.uglify({
      output:{
        comments: licenseRegexp
      }
    }))
    .pipe($.rename((path) => {
      path.basename = path.basename.replace(/\_/,'');
      path.extname = '.min.js';
    }))
    .pipe(gulp.dest(config.dist));
};
exports.jsMin = jsMin;

// js/utils/concat 以下のファイルは uglify -> concat して dist
const jsUtilConcat = () => {
  return gulp.src(srcSet.jsUtilConcat, {base: config.src})
    // コメントブロックにlicense表記があれば残す
    .pipe($.uglify({
      output:{
        comments: licenseRegexp
      }
    }))
    .pipe($.concat('utils.js', {newLine: ';'}))
    .pipe($.rename((path) => {
      path.dirname = config.assets + 'js/' + path.basename;
    }))
    .pipe(gulp.dest(config.dist));
};
exports.jsUtilConcat = jsUtilConcat;

// lib/concat 以下のファイルは uglify -> concat して dist
const libConcat = () => {
  return gulp.src(srcSet.libConcat, {base: config.src})
    // コメントブロックにlicense表記があれば残す
    .pipe($.uglify({
      output:{
        comments: licenseRegexp
      }
    }))
    .pipe($.concat('lib.js', {newLine: ';'}))
    .pipe($.rename((path) => {
      path.dirname = config.assets + path.basename;
    }))
    .pipe(gulp.dest(config.dist));
};
exports.libConcat = libConcat;

const tsWebpack = () => {
  return gulp.src(srcSet.ts, { base: config.src })
  .pipe(webpackStream(webpackConfig), webpack)
  .pipe(gulp.dest(config.dist + "/assets/js"));
}
exports.tsWebpack = tsWebpack;


const scripts = gulp.series(
    (done) => { console.log('========== 🚀 js ファイルのミニファイ＆結合'); done(); },
    jsDist,
    jsMin,
    jsUtilConcat,
    libConcat,
    tsWebpack
  );

exports.scripts = scripts;

// serve setting =========================================
const serve = (done) => {
  console.log('========== 🌎 ローカルサーバを起動');
  bs.init({
    notify: false,
    port: 3000,
    startPath: '/',
    server: {
      baseDir: config.public,
      directory: false
    }
  });
  done();
};
exports.serve = serve;

// watch setting =========================================
const watch = (done) => {
  console.log('========== 👀 監視をはじめる');
  gulp.watch(
    srcSet.html,
    gulp.series('html', (done) => { reload(); done(); })
  );
  gulp.watch(
    srcSet.ejs.concat(srcSet.json),
    gulp.series('ejs', (done) => { reload(); done(); })
  );
  gulp.watch(
    srcSet.img,
    gulp.series('img', (done) => { reload(); done(); })
  );
  gulp.watch(
    srcSet.scss,
    gulp.series('styles', 'aigis', (done) => { reload(); done(); })
  );
  gulp.watch(
    srcSet.styleguideScss,
    gulp.series('sgStyle','aigis', (done) => { reload(); done(); })
  );

  //  Gulp4のwatch()でディレクトリ配列を引数とすることが無効となったため外部ループに書き換え
  [srcSet.js, srcSet.jsMin, srcSet.jsUtilConcat, srcSet.libConcat, srcSet.ts].forEach((pathWatch)=> {
    gulp.watch(
      pathWatch,
      gulp.series('scripts', (done) => { reload(); done(); })
    );
  });

  done();
};
exports.watch = watch;

// default setting =========================================
exports.default = gulp.series(
  (done) => { console.log('⚡ ⚡ ⚡ ⚡ ⚡ CONNECTED⚡ ⚡ ⚡ ⚡ ⚡'); done(); },
  //gulp.parallel(html, ejs, img, styles, sgStyle, scripts),
  gulp.parallel(img, styles, sgStyle, scripts),
  aigis,
  watch,
  serve
);
