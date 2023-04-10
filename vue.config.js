const launch = require('launch-editor')
const parseTemplate = require('./parse-template')
const generateBuryCode = require('./generator-bury-code')

const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  chainWebpack: config => {
    config.resolve.symlinks(false)
    config.module
      .rule('vue')
      .use('vue-loader')
      .loader('vue-loader')
      .end()
      .use('position-loader')
      .loader('position-loader')
      .end()
  },
  configureWebpack: {
    resolveLoader: {
      // 找loader的时候，先去loaders目录下找，找不到再去node_modules下面找
      modules: ['vue-inspector-tool', 'node_modules']
    }
  },
  devServer: {
    port: 9527,
    setupMiddlewares: (middlewares, devServer) => {
      if (!devServer) {
        throw new Error("webpack-dev-server is not defined");
      }
      middlewares.push({
        name: "openComponent",
        path: "/openComponent",
        middleware: (req, res) => {
          const filePath = req.query.filePath
          if (filePath && filePath.includes('vue')) {
            const editor = req.query.editor
            launch(filePath, editor, (fileName, errorMsg) => {
              console.log('fileName', fileName, errorMsg)
            })
            res.send(`The file opened successfully! filePath: ${filePath}`)
          }
        },
      })
      middlewares.push({
        name: "getBuryElement",
        path: "/getBuryElement",
        middleware: (req, res) => {
          const filePath = req.query.filePath
          if (filePath && filePath.includes('vue')) {
            const clickElments = parseTemplate(filePath)
            res.send(clickElments)
          }
        }
      })
      middlewares.push({
        name: "generateBury",
        path: "/generateBury",
        middleware: (req, res) => {
          let postData = ''
          req.on('data', chunk => {
            postData += chunk.toString()
          })
          req.on('end', () => {
            if (postData) {
              const params = JSON.parse(postData)
              const { filePath } = params
              if (filePath && filePath.includes('vue')) {
                generateBuryCode(params)
              }
              res.send(`generator bury code successfully! filePath: ${filePath}`)
            }
          })
        }
      })
      return middlewares
    }
  }
})
