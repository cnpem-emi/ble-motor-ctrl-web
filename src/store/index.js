import Vuex from "vuex";
import Vue from "vue";

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    bluetooth: {
      device: "",
      server: "",
      motors: [],
      service: ""
    }
  },
  mutations: {
    set_bluetooth(state, bluetooth) {
      state.bluetooth = bluetooth;
    },
    disconnect_bluetooth(state) {
      state.bluetooth = {
        device: "",
        server: "",
        motors: [],
        service: ""
      }
    }
  },
});

export default store;
