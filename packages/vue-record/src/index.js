import vueRecord from './vue-record.vue'

function install (Vue) {
  if (install.installed) return
  install.installed = true
  Vue.component('record', vueRecord)
}

const VueRecord = {
  version: '0.1.0',
  install
}

if (typeof window !== undefined && window.Vue) {
  window.Vue.use(vueRecord)
}

export default VueRecord