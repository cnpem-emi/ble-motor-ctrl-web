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
    },
    snackbar: false,
    message: "",
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
    },
    show_snackbar(state, message) {
      state.snackbar = true;
      state.message = message;
    },
    hide_snackbar(state) {
      state.snackbar = false;
    },
  },
});

export default store;
