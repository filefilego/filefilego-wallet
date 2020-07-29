import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    rpc_endpoint: "http://rpc.filefilego.com:8090/",
    wallets: [],
    selected_wallet_status: { unlocked: false },
  },
  mutations: {
    SetWallets(state, wallets) {
      state.wallets = [...wallets];
    },
    SetSelectedWalletStatus(state, sts) {
      state.selected_wallet_status = { ...sts };
    },
    SetSettings(state, settings) {
      if (settings.wallet_rpc_endpoint && settings.wallet_rpc_endpoint != "") {
        state.rpc_endpoint = settings.wallet_rpc_endpoint;
      }
    },
  },
  actions: {
    SetWallets(context, payload) {
      context.commit("SetWallets", payload);
    },

    SetSelectedWalletStatus(context, payload) {
      context.commit("SetSelectedWalletStatus", payload);
    },

    SetSettings(context, payload) {
      context.commit("SetSettings", payload);
    },
  },
  modules: {},
});
