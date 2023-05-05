const observerOptions = {
  childList: true, // 观察目标子节点的变化，是否有添加或者删除
  attributes: true, // 观察属性变动
  subtree: true, // 观察后代节点，默认为 false
}

function getParams(el) {
  const { exposureTrackerAction, exposureTrackerParams } = el.dataset

  let params
  if (exposureTrackerParams) {
    try {
      params = JSON.parse(exposureTrackerParams)
    } catch (error) {
      console.error('parse params fail')
    }
  }

  return {
    key: exposureTrackerAction,
    ...params
  }
}

export default class VisuallyObserver {
  constructor({
    threshold = 0.5,
    enterCb = (params) => { console.log('曝光埋点默认函数', params) },
    leaveCb,
    delay = 5000
  } = {}) {
    this.threshold = threshold
    this.enterCb = enterCb
    this.leaveCb = leaveCb
    this.delay = delay
    this.mutationObserver = new MutationObserver(this.observerCallback.bind(this))
    this.intersectionObserver = new IntersectionObserver(this.intersectionCallback.bind(this), {
      threshold: [0, threshold, 1]
    })
    this.timer = new WeakMap()
  }
  observe() {
    this.mutationObserver.observe(document, observerOptions)
  }
  discontent() {
    this.mutationObserver.discontent()
  }
  observerCallback(mutationList) {
    mutationList.forEach((mutation) => {
      switch (mutation.type) {
        case 'childList':
          this.collectTargets()
          break
        case 'attributes':
          break
      }
    })
  }
  collectTargets() {
    const els = Array.from(
      document.querySelectorAll('[data-exposure-tracker-action]')
    ).filter(el => !el.dataset.exposureTrackerTracked)
  
    if (els.length > 0) {
      els.forEach(el => {
        this.intersectionObserver.observe(el)
        el.dataset.exposureTrackerTracked = '1'
      })
    }
  }
  intersectionCallback(entries) {
    entries.forEach(entry => {
      const params = getParams(entry.target)
      if (
        !this.timer.get(entry.target) && 
        entry.target.dataset.exposureTrackerExposed !== '1' &&
        entry.intersectionRatio >= this.threshold
      ) {
        const timerId = setTimeout(() => {
          this.enterCb(params)
          this.timer.set(entry.target, null)
          if(!params.repeat) {
            entry.target.dataset.exposureTrackerExposed = '1'
          }
        }, this.delay)
        this.timer.set(entry.target, timerId)
      } else if (entry.intersectionRatio === 0) {
        clearTimeout(this.timer.get(entry.target))
        this.timer.set(entry.target, null)
        if(this.leaveCb) {
          this.leaveCb(params)
        }
      }
    })
  }
}