import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    rpc_endpoint: "http://rpc.filefilego.com:8090/",
    wallets: [],
    selected_wallet_status: { unlocked: false },
    pending_txs: [],
    loading_wallet: false,
  },
  mutations: {
    SetLoadingWallet(state, val) {
      state.loading_wallet = val;
    },
    SetWallets(state, wallets) {
      state.wallets = [...wallets];
    },
    AddPendingTxs(state, tx) {
      state.pending_txs.push(tx);
    },
    RemovePendingTxs(state, tx) {
      let i = state.pending_txs.map((item) => item.Hash).indexOf(tx.Hash);
      state.pending_txs.splice(i, 1);
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
    AddPendingTxs(context, payload) {
      context.commit("AddPendingTxs", payload);
    },
    RemovePendingTxs(context, payload) {
      context.commit("RemovePendingTxs", payload);
    },
    SetWallets(context, payload) {
      context.commit("SetWallets", payload);
    },

    SetSelectedWalletStatus(context, payload) {
      context.commit("SetSelectedWalletStatus", payload);
    },

    SetSettings(context, payload) {
      context.commit("SetSettings", payload);
    },

    SetLoadingWallet(context, payload) {
      context.commit("SetLoadingWallet", payload);
    },
  },
  modules: {},
});
