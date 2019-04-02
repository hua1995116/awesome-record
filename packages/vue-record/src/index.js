import vueRecord from './vue-record.vue'
import vueVoice from './vue-voice.vue'

function install (Vue) {
  if (install.installed) return
  install.installed = true
  Vue.component('record', vueRecord)
  Vue.component('voice', vueVoice)
}

const VueRecord = {
  version: '0.1.0',
  install
}

if (typeof window !== undefined && window.Vue) {
  window.Vue.use(vueRecord)
  window.Vue.use(vueVoice)
}

export default VueRecord