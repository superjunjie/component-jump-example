<template>
  <el-dialog
    title="提示"
    :visible.sync="visible"
    width="30%"
    v-bind="getExposureTrackerProps('dialog_content_expose', { arg1: 132, arg2: 456, repeat: true })"
  >
    <span>这是一段信息</span>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取 消</el-button>
      <el-button type="primary" @click="visible = false">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
export default {
  name: 'DialogVue',
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    visible: {
      get () {
        return this.value
      },
      set (value) {
        this.$emit('input', value)
      }
    }
  }
}
</script>
