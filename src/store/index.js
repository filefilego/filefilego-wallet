import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    wallets: [],
    selected_wallet_status: { unlocked: false },
  },
  mutations: {
    SetWallets(state, wallets) {
      // mutate state
      state.wallets = [...wallets];
    },
    SetSelectedWalletStatus(state, sts) {
      // mutate state
      state.selected_wallet_status = { ...sts };
    },
  },
  actions: {
    SetWallets(context, payload) {
      context.commit("SetWallets", payload);
    },

    SetSelectedWalletStatus(context, payload) {
      context.commit("SetSelectedWalletStatus", payload);
    },
  },
  modules: {},
});
