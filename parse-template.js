const fs = require('fs')
const compiler = require('vue-template-compiler')

function parseTemplate (filePath) {
  // 读取Vue文件的内容
  const content = fs.readFileSync(filePath, 'utf-8')

  // 编译Vue文件的模板部分，生成AST树
  const { ast } = compiler.compile(content, { comments: false })

  const elements = []

  const getInnerText = (ast) => {
    const children = ast.children
    for (let i = 0; i < children.length; i++) {
      if (children[i].type === 2) {
        return {
          value: children[i].expression,
          static: false
        }
      } else if (children[i].type === 3) {
        return {
          value: children[i].text,
          static: true
        }
      }
    }
  }

  // 找到所有绑定了@click事件的元素
  function traverseAst (ast) {
    if (ast == null) return
    if (ast.attrsList && ast.attrsList.length) {
      for (let i = 0; i < ast.attrsList.length; i++) {
        const attr = ast.attrsList[i]
        if (attr.name.startsWith('@click') || attr.name.startsWith('v-on:click')) {
          const value = attr.value.replace(/\([\s\S]+\)/g, '')
          elements.push({
            text: getInnerText(ast) ?? { value, static: true },
            value
          })
        }
      }
    }
    const children = ast.children || []
    if (children.length === 0) return
    for (let i = 0; i < children.length; i++) {
      traverseAst(children[i])
    }
  }

  traverseAst(ast)
  return elements
}

module.exports = parseTemplate

// test
// const list = parseTemplate('src/views/demo.vue')
// console.log(list)

// const that = {
//   btnText1: '按钮1',
//   bthText2: '按钮2',

//   $t: (key) => {
//     return key
//   }
// }

// const res = []
// for (let i = 0; i < list.length; i++) {
//   const text = list[i].text
//   if (text.static) {
//     res.push(text.value)
//   } else {
//     const match = text.value.match(/_s\(([\s\S]+)\)/)
//     with (that) {
//       const tmp = eval(match[1])
//       res.push(tmp)
//     }
//   }
// }

// console.log(res)
