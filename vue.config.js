const path = require('path')

function resolve(dir) {
    return path.join(__dirname, dir)
}

const proxy = {
  dev: 'http://localhost:9100',
  pro: 'https://www.enjoy-ind.cn'
}

module.exports = {
  // 设置eslint报错时停止代码编译
  lintOnSave: false,

  // 不需要生产环境的 source map（减小dist文件大小，加速构建）
  productionSourceMap: false,

  runtimeCompiler: true,

  devServer: {
    proxy: {
        '/': {
            target: proxy.dev,
            changeOrigin: true,
            ws: false, //关闭websocket服务
            pathWrite: {
                '^/':'/'
            }
        }
    }
  },

  chainWebpack: (config) => { 
    // 第1个参数：别名，第2个参数：路径  （设置路径别名）
    config.resolve.alias
    .set('@', resolve('src'))
  },

  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'less',
      patterns: [
        resolve('./src/styles/var.less'),
        resolve('./src/styles/mixin.less')
      ]
    }
  }
}
