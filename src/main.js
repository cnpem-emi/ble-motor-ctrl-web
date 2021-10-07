import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import store from "./store";

Vue.config.productionTip = false

Vue.mixin({
  methods: {
    dataview_to_string(dv) {
      let byte_arr = [];
      let enc = new TextDecoder("utf-8");
    
      for(let i = 0; i < dv.byteLength; i++) byte_arr.push(dv.getUint8(i))
    
      return enc.decode(new Uint8Array(byte_arr));
    }
  }
});

new Vue({
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
