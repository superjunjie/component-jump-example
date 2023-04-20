import Vue from 'vue'

const options = {
  root: null, // 默认浏览器视窗
  threshold: 1 // 元素完全出现在浏览器视窗内才执行callback函数。
}
let timer = {} // 增加定时器对象
const callback =(entries, observer) => {
  entries.forEach(entry => {
    let visuallyData = null
    try {
      visuallyData = JSON.parse(entry.target.getAttribute('visually-data'))
    } catch {
      visuallyData = null
    }
    // 没有埋点数据取消上报
    if (!visuallyData) {
      observer.unobserve(entry.target)
      return
    }
    if(entry.isIntersecting) {
      // 上报埋点信息
      timer[visuallyData.id] = setTimeout(() => {
        setTimeout(() => {
          console.log('上报埋点信息==>', visuallyData)
          observer.unobserve(entry.target)
          visuallyList.push(visuallyData.id)
          timer[visuallyData.id] = null
        }, 1000)
      }, 5000)
    } else {
      if(timer[visuallyData.id]) {
        clearTimeout(timer[visuallyData.id])
        timer[visuallyData.id] = null
      }
    }
  })
}
const observer = new IntersectionObserver(callback, options)
const visuallyList = [] // 记录已经上报过的埋点信息
const addListenner = (ele, binding) => {
  const { id, repeat } = binding.value
  if(visuallyList.indexOf(id) !== -1 && !repeat) return
  observer.observe(ele)
}
const removeListener = (ele) => {
  observer.unobserve(ele)
}
//自定义曝光指令
Vue.directive('visually', { 
  bind: addListenner,
  unbind: removeListener,
})