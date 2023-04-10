<template>
  <div class="vue-inspector-tool" v-show="show">
    <div ref="mask" class="tool-mask"></div>
    <div ref="toolbar" class="tool-bar">
      <span class="file-path">{{ relativePath }}</span>
      <span class="code" @click="openEditor('code')">code</span>
      <span class="ws" @click="openEditor('ws')">ws</span>
      <span class="bury" @click="openBuryDialog">bury</span>
    </div>
  </div>
</template>
<script>
import Vue from 'vue'
import axios from 'axios'
import BuryDialog from './BuryDialog.vue'
export default {
  name: 'vueInspectorTool',
  data () {
    return {
      show: false,
      relativePath: ''
    }
  },
  mounted () {
    document.addEventListener('mouseover', this.hoverFn)
    document.addEventListener('click', this.hideSelf)
    this.$el.addEventListener('mouseover', (e) => {
      e.stopPropagation()
    })
    this.height = document.documentElement.clientHeight
  },
  unmounted () {
    document.removeEventListener('mouseover', this.hoverFn)
    document.removeEventListener('click', this.hideSelf)
  },
  methods: {
    openEditor (editor) {
      const devServerPort = 9527
      // 本地调试建议通过localhost来进行，否则控制台会报跨域错误，但是不影响使用，没有强迫症的可以忽略直接使用IP也是可以的
      axios.get(`http://localhost:${devServerPort}/openComponent`, {
        params: {
          filePath: this.codeLocation,
          editor
        }
      })
    },
    hideSelf () {
      this.show = false
    },
    hoverFn (e) {
      if (e.altKey) {
        this.show = true
        let target = e.target
        let codeLocation
        while (!codeLocation) {
          codeLocation = target.getAttribute('code-location')
          if (codeLocation) break
          target = target.parentElement
        }
        const rect = target.getBoundingClientRect()
        const maskEl = this.$refs.mask
        const toolbarEl = this.$refs.toolbar
        maskEl.style.top = `${rect.top + window.scrollY}px`
        maskEl.style.left = `${rect.left + window.scrollX}px`
        maskEl.style.width = `${rect.width}px`
        maskEl.style.height = `${rect.height}px`
        const bottom = this.height - rect.top - rect.height
        const height = bottom > 50 ? rect.height + 8 : rect.top > 50 ? -42 : 0
        toolbarEl.style.top = `${rect.top + height + window.scrollY}px`
        toolbarEl.style.left = `${rect.left + window.scrollX}px`
        this.codeLocation = codeLocation
        this.relativePath = codeLocation.split(':')[0]
      }
    },
    openBuryDialog () {
      const filePath = this.relativePath
      const Comp = Vue.extend({
        ...BuryDialog,
        computed: {
          filePath () {
            return filePath
          }
        }
      })
      const vm = new Comp().$mount()
      document.body.appendChild(vm.$el)
    }
  }
}
</script>
<style>
.vue-inspector-tool .tool-mask{
  display: block;
  position: absolute;
  background-color: rgba(120, 170, 210, 0.7);
  z-index: 9999;
}
.vue-inspector-tool .tool-bar {
  display: block;
  position: absolute;
  padding: 8px;
  color: rgb(132, 0, 255);
  background-color: rgb(51, 55, 64);
  z-index: 10000;
}
.vue-inspector-tool .file-path {
  padding-right: 8px;
  border-right: 1px solid rgb(170, 170, 170);
}
.vue-inspector-tool .code {
  padding-left: 8px;
  color: #ff8000;
  margin-right: 4px;
  cursor: pointer;
}
.vue-inspector-tool .ws {
  color: #007fff;
  cursor: pointer;
  padding-right: 8px;
}
.vue-inspector-tool .bury {
  cursor: pointer;
  padding-left: 8px;
  border-left: 1px solid rgb(170, 170, 170);
}
</style>
