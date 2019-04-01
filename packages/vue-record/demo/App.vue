<!--渲染模版-->
<template>
  <div>
    <record
      :minTime="2000"
      @startRecord="startRecord"
      @stopRecord="stopRecord"
      @lowRecord="lowRecord"
      ></record>
  </div>
</template>

<!--样式描述-->
<style scoped>

</style>

<!--组件逻辑-->
<script>
  export default {
    data() {
      return {
        msg: 'Hello,Webpack'
      }
    },
    methods: {
      startRecord() {
        console.log('开始录音')
      },
      stopRecord() {
        console.log('结束录音');
      },
      lowRecord() {
        console.log('录音时间过短')
      }
    }
  }
</script>
