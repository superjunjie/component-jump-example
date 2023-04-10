const fs = require('fs')
const compiler = require('vue-template-compiler')
const babel = require('babel-core')
const template = require('babel-template')
const babelParser = require('@babel/parser')

function generateCode (options) {
  const { filePath, viewShow, viewName, viewParams, clickShow, clickList } = options
  // 读取Vue文件的内容
  const content = fs.readFileSync(filePath, 'utf8')

  // 解析Vue文件，获取JavaScript部分的内容
  const parsedComponent = compiler.parseComponent(content)
  const scriptContent = parsedComponent.script ? parsedComponent.script.content : ''

  // 使用babel解析JavaScript部分
  const babelOptions = {}
  const ast = babel.transform(scriptContent, babelOptions).ast

  let mountedNode = null
  if (viewShow) {
    babel.traverse(ast, {
      ObjectMethod (path) {
        const name = path.node.key.name
        if (name === 'mounted') {
          mountedNode = path.node
        }
      }
    })
    if (mountedNode) {
      const blockStatement = mountedNode.body
      const statement = template(`this.$log('${viewName}', ${JSON.stringify(viewParams)})`)()
      blockStatement.body.unshift(statement)
    } else {
      babel.traverse(ast, {
        ExportDefaultDeclaration (path) {
          const { node } = path
          if (node.type === 'ExportDefaultDeclaration') {
            const properties = node.declaration.properties
            properties.push(
              babelParser.parse('mounted() { console.log("mounted"); }').program.body[0]
            )
          }
        }
      })
    }
  }
  if (clickShow) {
    babel.traverse(ast, {
      ObjectMethod (path) {
        const name = path.node.key.name
        const index = clickList.findIndex(i => i.eventName === name)
        if (index !== -1) {
          const item = clickList[index]
          const blockStatement = path.node.body
          const consoleLogStatement = template(`this.$log('${item.buryName}', ${JSON.stringify(item.params)})`)()
          blockStatement.body.unshift(consoleLogStatement)
        }
      }
    })
  }
  // 使用babel-generator重新生成JavaScript代码
  const transformedScriptContent = babel.transformFromAst(ast).code

  // 将生成的JavaScript代码写回Vue文件中
  const updatedContent = content.replace(scriptContent, transformedScriptContent)
  fs.writeFileSync(filePath, updatedContent, 'utf8')
}

module.exports = generateCode

// const params = {
//   filePath: 'src/views/demo.vue',
//   viewShow: true,
//   viewName: 'home_page_view',
//   viewParams: ['a', 'b'],
//   viewClick: true,
//   clickList: [
//     {
//       eventName: 'handleClick1',
//       buryName: 'handleClick1',
//       params: ['a', 'b']
//     },
//     {
//       eventName: 'handleClick2',
//       buryName: 'handleClick2',
//       params: ['a', 'b']
//     }
//   ]
// }

// generateCode(params)
