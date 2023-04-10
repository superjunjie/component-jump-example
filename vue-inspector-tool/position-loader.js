const path = require('path')

module.exports = function (source) {
  // 计算相对路径
  const relativePath = pathRelative(this.resourcePath)
  const res = codeLineTrack(source, relativePath)
  return res
}

const pathRelative = (() => {
  const cache = {}
  return function (filePath) {
    if (cache[filePath]) {
      return cache[filePath]
    } else {
      let relativePath = path.relative(process.cwd(), filePath)
      relativePath = relativePath.replaceAll('\\', '/')
      cache[filePath] = relativePath
      return cache[filePath]
    }
  }
})()

const codeLineTrack = (code, path) => {
  const lineList = code.split('\n')
  const newList = []
  lineList.forEach((item, index) => {
    newList.push(addLineAttr(item, index + 1, path)) // 添加位置属性，index+1为具体的代码行号
  })
  return newList.join('\n')
}

const addLineAttr = (lineStr, line, path) => {
  if (!/^\s+</.test(lineStr)) {
    return lineStr
  }

  const reg = /((((^(\s)+<))|(^<))[\w-]+)|(<\/template)/g
  let leftTagList = lineStr.match(reg)
  if (leftTagList) {
    leftTagList = Array.from(new Set(leftTagList))
    leftTagList.forEach((item) => {
      const skip = [
        'KeepAlive',
        'template',
        'keep-alive',
        'transition',
        'router-view'
      ]
      if (item && !skip.some((i) => item.indexOf(i) > -1)) {
        const reg = new RegExp(`${item}`)
        const location = `${item} code-location="${path}:${line}"`
        lineStr = lineStr.replace(reg, location)
      }
    })
  }
  return lineStr
}
