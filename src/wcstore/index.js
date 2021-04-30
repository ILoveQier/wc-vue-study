import Vue from 'vue'
import WcVuex from './wc-vuex'

Vue.use(WcVuex)

export default new WcVuex.Store({
  state: {
    counter: 0,
    counter2: 0,
  },
  mutations: {
    add(state) {
      state.counter++
    },
    add2(state) {
      state.counter += 2
    }
  },
  actions: {
    add2({ commit }) {
      setTimeout(() => {
        commit('add2')
      }, 1000);
    }
  },
  getters: {
    doubleCounter: state => {
      return state.counter * 2;
    }
  }
})
