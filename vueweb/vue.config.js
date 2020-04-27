/* eslint-disable block-scoped-var */
/* eslint-disable lines-around-comment */
/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable global-require */
/* eslint-disable no-empty-function */
const path = require("path");
function resolve(dir) {
  return path.join(__dirname, ".", dir);
}
// const UglifyPlugin = require("uglifyjs-webpack-plugin");
module.exports = {
  // 基本路径
  /* 部署生产环境和开发环境下的URL：可对当前环境进行区分，baseUrl 从 Vue CLI 3.3 起已弃用，要使用publicPath */
  /* baseUrl: process.env.NODE_ENV === 'production' ? './' : '/' */
  publicPath: process.env.NODE_ENV === "production" ? "./" : "./",
  // 输出文件目录
  outputDir: process.env.NODE_ENV === "production" ? "dist" : "devdist",
  // eslint-loader 是否在保存的时候检查
  // lintOnSave: true,
  // use the full build with in-browser compiler?
  // https://vuejs.org/v2/guide/installation.html#Runtime-Compiler-vs-Runtime-only
  //   compiler: false,
  runtimeCompiler: true, // 关键点在这
  // 调整内部的 webpack 配置。
  // 查阅 https://github.com/vuejs/vue-doc-zh-cn/vue-cli/webpack.md
  // webpack配置
  // see https://github.com/vuejs/vue-cli/blob/dev/docs/webpack.md
  chainWebpack: config => {
    const svgRule = config.module.rule("svg");
    svgRule.uses.clear();
    svgRule
      .use("svg-sprite-loader")
      .loader("svg-sprite-loader")
      .options({
        symbolId: "icon-[name]",
        include: ["./src/icons"]
      });
    // config.module
    //   .rule("svg")
    //   .exclude.add(resolve("src/icons"))
    //   .end();

    // config.module
    //   .rule("icons")
    //   .test(/\.svg$/)
    //   .include.add(resolve("src/icons"))
    //   .end()
    //   .use("svg-sprite-loader")
    //   .loader("svg-sprite-loader")
    //   .options({
    //     symbolId: "icon-[name]"
    //   });
  },
  configureWebpack: config => {
    /* if (process.env.NODE_ENV === "production") {
      // 为生产环境修改配置...
      config.mode = "production";
      // 将每个依赖包打包成单独的js文件
      var optimization = {
        runtimeChunk: "single",
        splitChunks: {
          chunks: "all",
          maxInitialRequests: Infinity,
          minSize: 20000, // 依赖包超过20000bit将被单独打包
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name(module) {
                // get the name. E.g. node_modules/packageName/not/this/part.js
                // or node_modules/packageName
                consle.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];
                // npm package names are URL-safe, but some servers don't like @ symbols
                return `npm.${packageName.replace("@", "")}`;
              }
            }
          }
        },
        minimizer: [
          new UglifyPlugin({
            uglifyOptions: {
              compress: {
                warnings: false,
                drop_console: true, // console
                drop_debugger: false,
                pure_funcs: ["console.log"] // 移除console
              }
            }
          })
        ]
      };
      Object.assign(config, {
        optimization
      });
    } else {
      // 为开发环境修改配置...
      config.mode = "development";
      var optimization2 = {
        runtimeChunk: "single",
        splitChunks: {
          chunks: "all",
          maxInitialRequests: Infinity,
          minSize: 20000, // 依赖包超过20000bit将被单独打包
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name(module) {
                // get the name. E.g. node_modules/packageName/not/this/part.js
                // or node_modules/packageName
                consle.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];
                // npm package names are URL-safe, but some servers don't like @ symbols
                return `npm.${packageName.replace("@", "")}`;
              }
            }
          }
        }
      };
    }*/
    // 开发生产共同配置

    // externals: {
    //   'vue': 'Vue',
    //   'element-ui': 'ELEMENT',
    //   'vue-router': 'VueRouter',
    //   'vuex': 'Vuex'
    // } // 防止将某些 import 的包(package)打包到 bundle 中，而是在运行时(runtime)再去从外部获取这些扩展依赖(用于csdn引入)
    config.resolve = {
      extensions: [".js", ".vue", ".json"], // 文件优先解析后缀名顺序
      alias: {
        vue: "vue/dist/vue.js",
        "@": path.resolve(__dirname, "./src"),
        "@c": path.resolve(__dirname, "./src/components"),
        "@v": path.resolve(__dirname, "./src/views"),
        "@u": path.resolve(__dirname, "./src/utils"),
        "@s": path.resolve(__dirname, "./src/service"),
        api: path.resolve(__dirname, "./src/api"),
        data: path.resolve(__dirname, "./src/data"),
        common: path.resolve(__dirname, "./src/common"),
        public: path.resolve(__dirname, "./public")
      }, // 别名配置
      plugins: []
      // optimization: optimization2
    };
  },
  // vue-loader 配置项
  // https://vue-loader.vuejs.org/en/options.html
  // vueLoader: {},
  // 生产环境是否生成 sourceMap 文件
  productionSourceMap: false,
  // css相关配置
  css: {
    // 是否使用css分离插件 ExtractTextPlugin
    // extract: true, // 注释css热更新生效
    // 开启 CSS source maps?
    sourceMap: false,
    // css预设器配置项
    loaderOptions: {
      sass: {
        prependData: `@import "./src/styles/main.scss";`
      }
    }
    // 启用 CSS modules for all css / pre-processor files.
    // requireModuleExtension: true
    // modules: false
  },
  // use thread-loader for babel & TS in production build
  // enabled by default if the machine has more than 1 cores
  parallel: require("os").cpus().length > 1,
  // 是否启用dll
  // See https://github.com/vuejs/vue-cli/blob/dev/docs/cli-service.md#dll-mode
  // dll: false,
  // PWA 插件相关配置
  // see https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-pwa
  pwa: {},

  // webpack-dev-server 相关配置
  devServer: {
    /* 自动打开浏览器*/
    open: false,
    host: "0.0.0.0", // 指定使用地址，默认localhost,0.0.0.0代表可以被外界访问
    port: 8080, // 访问端口
    https: false, // 编译失败时刷新页面
    hot: true, // 开启热加载
    hotOnly: false,

    /* 使用代理*/
    proxy: {
      "/devapi": {
        /* 目标代理服务器地址 */
        target: "http://www.web-jshtml.cn/productapi/token",

        /* 允许跨域 */
        changeOrigin: true,
        ws: true, // 是否启用websockets
        pathRewrite: {
          "^/devapi": ""
        }
      }
    },
    // 全屏模式下是否显示脚本错误
    overlay: {
      warnings: true,
      errors: true
    },
    before: () => {}
  },
  // 第三方插件配置
  pluginOptions: {}
};
