<template>
  <div v-if="show" class="bury-container">
    <div class="box">
      <div class="view_bury_point">
        <div style="margin-bottom: 4px;">当前埋点位置: {{ filePath }}</div>
        <div class="form-item">
          <div class="form-label">
            <input type="checkbox" v-model="viewShow"/>
            <span>是否曝光埋点</span>
          </div>
          <div class="form-content" v-show="viewShow">
            <input v-model="viewName" placeholder="请输入曝光埋点事件名称"/>
            <div style="margin-top: 12px;" >
              <button @click="handleClickViewParams">添加属性</button>
            </div>
            <div style="margin-top: 12px;">
              <div v-for="item in viewParams" :key="item.key" style="margin-bottom:12px;">
                <input type="text" v-model="item.value" placeholder="参数名" />
                <button style="margin-left: 12px" @click="handleDelViewParams(item.key)">删除</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="click_bury_point">
        <div class="form-item">
          <div class="form-label">
            <input @click="handleAddClickbury" type="checkbox" v-model="clickShow" />
            <span>是否click埋点</span>
            <button v-show="clickShow" style="margin-left: 4px;" @click="handleAddClickEvent">add</button>
          </div>
        </div>
        <template v-if="clickShow">
          <div class="form-content" v-for="item in clickList" :key="item.key">
            <select v-model="item.eventName" style="width: 120px">
              <option v-for="(item, index) in clickElements" :key="index" :value="item.value">{{ item.text }}</option>
            </select>
            <input type="text" style="margin: 0 12px;" v-model="item.buryName" placeholder="click event name" />
            <button @click="handleDelClickEvent(item.key)">del</button>
            <button style="margin-left: 12px;" @click="handleAddEventParams(item)">添加属性</button>
            <div style="margin-left: 84px;">
              <div v-for="(ele,index) in item.params" :key="ele.key" style="margin-top: 8px;">
                <span style="margin-right: 4px;">属性{{ index+1 }}:</span>
                <input type="text" v-model="ele.value">
                <button style="margin-left: 12px;" @click="handleDelEventParams(item.params, ele.key)">del</button>
              </div>
            </div>
          </div>
        </template>
      </div>
      <div style="display: flex; justify-content: flex-end; margin-top: 20px;">
        <button @click="show = false">取消</button>
        <button style="margin-left: 8px;" @click="handleGenerate">generate</button>
      </div>
    </div>
  </div>
</template>
<script>
import axios from 'axios'
let index = 1
export default {
  name: 'buryDialog',
  data () {
    return {
      viewShow: false,
      clickShow: false,
      show: true,
      viewName: '',
      viewParams: [],
      clickList: [],
      clickElements: []
    }
  },
  async mounted () {
    const devServerPort = 9527
    const res = await axios.get(`http://localhost:${devServerPort}/getBuryElement`, {
      params: {
        filePath: this.filePath
      }
    })
    const clickElements = res.data || []
    this.clickElements = clickElements.map(item => {
      return {
        text: item.text.value,
        value: item.value
      }
    })
  },
  methods: {
    handleAddClickbury () {
      const devServerPort = 9527
      axios.get(`http://localhost:${devServerPort}/getburyElement`, {
        params: {
          filePath: this.filePath
        }
      })
    },
    handleClickViewParams () {
      this.viewParams.push({
        key: `eventKey${index++}`,
        value: ''
      })
    },
    handleDelViewParams (key) {
      const index = this.viewParams.findIndex(item => item.key === key)
      this.viewParams.splice(index, 1)
    },
    handleAddClickEvent () {
      this.clickList.push({
        key: `eventKey${index++}`,
        eventName: '',
        buryName: '',
        params: []
      })
    },
    handleDelClickEvent (key) {
      const index = this.clickList.findIndex(item => item.key === key)
      this.clickList.splice(index, 1)
    },
    handleAddEventParams (item) {
      item.params.push({
        key: `eventKey${index++}`,
        value: ''
      })
    },
    handleDelEventParams (paramsList, key) {
      const index = paramsList.findIndex(item => item.key === key)
      paramsList.splice(index, 1)
    },
    handleGenerate () {
      const params = {
        filePath: this.filePath,
        viewShow: this.viewShow,
        viewName: this.viewName,
        viewParams: this.viewParams.map(i => i.value),
        clickShow: this.clickShow,
        clickList: this.clickList.map(i => {
          return {
            eventName: i.eventName,
            buryName: i.buryName,
            params: i.params.map(i => i.value)
          }
        })
      }
      const devServerPort = 9527
      this.show = false
      axios.post(`http://localhost:${devServerPort}/generatebury`, params)
    }
  }
}
</script>
<style scoped>
.bury-container {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 9999;
}
.bury-container .box {
  width: 500px;
  height: 300px;
  overflow-y: auto;
  margin: auto;
  padding: 24px;
  margin-top: 200px;
  background-color: cyan;
  box-shadow:
    2.8px 2.8px 2.2px rgba(0, 0, 0, 0.02),
    6.7px 6.7px 5.3px rgba(0, 0, 0, 0.028),
    12.5px 12.5px 10px rgba(0, 0, 0, 0.035),
    22.3px 22.3px 17.9px rgba(0, 0, 0, 0.042),
    41.8px 41.8px 33.4px rgba(0, 0, 0, 0.05),
    100px 100px 80px rgba(0, 0, 0, 0.07)
}
.form-content {
  margin-left: 20px;
  margin-top: 12px;
}
</style>
