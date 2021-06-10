// 导入 gulp
const gulp = require('gulp');
// 导入 gulp-cssmin
const cssmin = require('gulp-cssmin');
// 导入 gulp-autoprefixer
const autoprefixer = require('gulp-autoprefixer');
// 导入 gulp-sass
const sass = require('gulp-sass');
// 导入 gulp-uglify
const uglify = require('gulp-uglify');
// 导入 gulp-babel
const babel = require('gulp-babel');
// 导入 gulp-htmlmin
const htmlmin = require('gulp-htmlmin');
// 导入 del
const del = require('del');
/// 导入 gulp-webserver
const webserver = require('gulp-webserver');

// 1、创建任务
// 1.1、创建一个打包 css 的任务
const cssHandler = function () {
  return gulp
    .src('./src/css/*.css')
    .pipe(autoprefixer())
    .pipe(cssmin())
    .pipe(gulp.dest('./dist/css/'));
};

// 1-2、创建一个打包 sass 文件的任务
const sassHandler = function () {
  return gulp
    .src('./src/sass/*.scss')
    .pipe(sass())
    .pipe(autoprefixer())
    .pipe(cssmin())
    .pipe(gulp.dest('./dist/sass/'));
};

// 1-3、创建一个打包 js 文件的任务
const jsHandler = function () {
  return gulp
    .src('./src/js/*.js')
    .pipe(
      babel({
        presets: ['@babel/env'],
      })
    )
    .pipe(uglify())
    .pipe(gulp.dest('./dist/js/'));
};

// 1-4、创建一个打包 html 文件的任务
const htmlHandler = function () {
  return gulp
    .src('./src/pages/*.html')
    .pipe(
      htmlmin({
        collapseWhitespace: true, // 移除空格
        removeEmptyAttributes: true, // 移除控的属性
        collapseBooleanAttributes: true, // 移除 checked 类似布尔值的属性
        removeAttributeQuotes: true, // 移除属性上的双引号
        minifyCSS: true, // 压缩内嵌式 css 代码
        minifyJS: true, // 压缩内嵌式 js 代码
        removeStyleLinkTypeAttributes: true, // 移除 style 和 link 标签上的 type 属性
        removeScriptTypeAttributes: true, // 移除 script 标签上默认的 type 属性
      })
    )
    .pipe(gulp.dest('./dist/pages/'));
};

// 1-5、创建一个打包 images 文件的任务
const imgHandler = function () {
  return gulp.src('./src/images/**').pipe(gulp.dest('./dist/images/'));
};

// 1-6、创建一个打包 images 文件的任务
const videoHandler = function () {
  return gulp.src('./src/videos/**').pipe(gulp.dest('./dist/videos/'));
};

// 1-7、创建一个打包 images 文件的任务
const audioHandler = function () {
  return gulp.src('./src/audios/**').pipe(gulp.dest('./dist/audios/'));
};

// 1-8、创建一个打包 第三方 的任务
const libHandler = function () {
  return gulp.src('./src/lib/**').pipe(gulp.dest('./dist/lib/'));
};

// 1-9、创建一个打包 fonts 的任务
const fontHandler = function () {
  return gulp.src('./src/fonts/**').pipe(gulp.dest('./dist/fonts/'));
};

// 1-10、创建一个删除 dist 目录的任务
const delHandler = function () {
  return del(['./dist/']);
};

// 1-11、创建一个启动 服务器 的任务
const webHandler = function () {
  return gulp.src('./dist').pipe(
    webserver({
      host: 'localhost', // 域名
      port: '8099', // 端口号
      livereload: true, // 当文件更新时候，是否自动刷新页面
      open: './pages/index.html', // 默认打开那一个文件
      // 配置所有的代理
      proxies: [
        {
          // 代理标识符
          source: '/api',
          // 代理目标地址
          // target: 'http://192.168.9.10:8080',
          target: 'http://47.103.133.195:8068',
        },
      ],
    })
  );
};

// 1-12、创建一个监控
const watchHandler = function () {
  gulp.watch('./src/css/*.css', cssHandler);
  gulp.watch('./src/sass/*.scss', sassHandler);
  gulp.watch('./src/js/*.js', jsHandler);
  gulp.watch('./src/pages/*.html', htmlHandler);
  gulp.watch('./src/lib/**', libHandler);
  gulp.watch('./src/images/**', imgHandler);
};

// 3、配置一个默认任务
// gulp.series(); 先后顺序执行
// gulp.parallel(); 同时执行
// 这两个方法的返回值是一个函数，返回值可以直接被当做做任务函数使用
// 使用 task 的方式创建一个 default 任务
// 方式一：
// gulp.task('default', () => {})
// 方式二：
// module.exports.default = () => {}

module.exports.default = gulp.series(
  delHandler,
  gulp.parallel(
    cssHandler,
    sassHandler,
    jsHandler,
    htmlHandler,
    imgHandler,
    videoHandler,
    audioHandler,
    libHandler,
    fontHandler
  ),
  webHandler,
  watchHandler
);
