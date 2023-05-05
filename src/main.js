import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import { VisuallyObserver, getExposureTrackerProps }  from './utils/exposure-tracker/index'

function enterCb(params) {
  console.log('有效曝光', params)
}

const visuallyObserver = new VisuallyObserver({ enterCb })
visuallyObserver.observe()

Vue.config.productionTip = false
Vue.prototype.getExposureTrackerProps = getExposureTrackerProps

Vue.use(ElementUI)

new Vue({
  render: h => h(App),
}).$mount('#app')
