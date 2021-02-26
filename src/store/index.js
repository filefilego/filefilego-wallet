import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    // Uploading stuff
    upload_data: [],
    name_conflicts: [],
    //
    entryMode: false,
    wallet_compatible_version: "0.9.2",
    fetch_blockchain_info_error: false,
    rpc_endpoint: "http://rpc.filefilego.com:8090/",
    wallets: [],
    selected_wallet_status: { unlocked: false },
    pending_txs: [],
    loading_wallet: false,
    blockchain_settings: {
      blockchain_version: "",
      block_time_seconds: 10,
      chain: "AQ==",
      drop_reward_days: 1095,
      drop_reward_factor: 2,
      genesis_hash: "",
      initial_block_reward: "15000000000000000000",
      max_supply: "500000000000000000000000000",
      namespace_enabled: true,
      namespace_registration_fee: "10000000000000000000000",
      node_creation_fees_guest: "",
      verifiers: [],
    },
  },
  mutations: {
    AddToUploadData(state, val) {
      let isConflict =
        state.upload_data.filter((o) => o.name == val.name).length > 0;
      if (isConflict) {
        state.name_conflicts.push(val);
      } else {
        state.upload_data.push(val);
      }
    },
    SetUploadData(state, val) {
      state.upload_data = [...val];
    },
    RemoveUploadData(state, index) {
      state.upload_data.splice(index, 1);
    },
    RemoveItemFromConflicts(state, index) {
      state.name_conflicts.splice(index, 1);
    },
    SetFetchBlockchainInfoError(state, val) {
      state.fetch_blockchain_info_error = val;
    },
    SetLoadingWallet(state, val) {
      state.loading_wallet = val;
    },
    SetEntryMode(state, val) {
      state.entryMode = val;
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
    SetBlockchainSettings(state, sts) {
      state.blockchain_settings = { ...sts };
    },
  },
  actions: {
    AddToUploadData(context, payload) {
      context.commit("AddToUploadData", payload);
    },
    SetUploadData(context, payload) {
      context.commit("SetUploadData", payload);
    },
    RemoveUploadData(context, payload) {
      context.commit("RemoveUploadData", payload);
    },
    RemoveItemFromConflicts(context, payload) {
      context.commit("RemoveItemFromConflicts", payload);
    },
    SetEntryMode(context, payload) {
      context.commit("SetEntryMode", payload);
    },
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

    SetBlockchainSettings(context, payload) {
      context.commit("SetBlockchainSettings", payload);
    },

    SetLoadingWallet(context, payload) {
      context.commit("SetLoadingWallet", payload);
    },

    SetFetchBlockchainInfoError(context, payload) {
      context.commit("SetFetchBlockchainInfoError", payload);
    },
  },
  modules: {},
});
