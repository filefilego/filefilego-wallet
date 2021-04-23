import Vue from "vue";
import Vuex from "vuex";
import queue from "queue";
import axios from "axios";
import uploader from "../common/uploader";

let filesQueue = queue();
filesQueue.concurrency = 4;
filesQueue.autostart = false;

Vue.use(Vuex);

const asyncFunctionFactory = (store, item) => {
  return () => {
    /* eslint-disable no-async-promise-executor */
    return new Promise(async (resolve, reject) => {
      try {
        if (item.canceled) return resolve("CANCELED");

        if (item.type == "dir") {
          let size = 0,
            totalSize = 0;

          for (let i = 0; i < item.files.length; i++) {
            item.cancel = axios.CancelToken.source();
            if (!("file" in item.files[i])) continue;
            let formData = new FormData();
            formData.append("file", item.files[i].file);
            formData.append("node_hash", item.files[i].hash);

            let result = await uploader.uploadData(
              store.state.binlayer.endpoint,
              store.state.binlayer.authtoken,
              formData,
              item.cancel,
              (progressEvent) => {
                size = Number(progressEvent.loaded);
                item.progress = Number(totalSize + progressEvent.loaded);
              }
            );

            if (!result.success) {
              // item.error = result.data.error;
              // problem uploading
              // record it
            } else {
              item.files[i].file_hash = result.data.file_hash;
              item.files[i].merkle_root = Uint8Array.from(
                Buffer.from(result.data.merkle_root, "hex")
              );
              size = Number(item.files[i].file.size);
            }

            totalSize += size;
          }
          item.progress = totalSize;
        } else {
          // single file
          item.cancel = axios.CancelToken.source();
          let formData = new FormData();
          formData.append("file", item.file.file);
          formData.append("node_hash", item.file.hash);

          let result = await uploader.uploadData(
            store.state.binlayer.endpoint,
            store.state.binlayer.authtoken,
            formData,
            item.cancel,
            (progressEvent) => {
              item.progress = Number(progressEvent.loaded);
            }
          );

          if (!result.success) {
            // item.error = result.data.error;
          } else {
            item.file.file_hash = result.data.file_hash;
            item.file.merkle_root = Uint8Array.from(
              Buffer.from(result.data.merkle_root, "hex")
            );
            item.progress = item.file.file.size;
          }
        }

        if (filesQueue.length <= 1) {
          store.commit("StopUploadQueue");
        }

        resolve("success");
      } catch (e) {
        if (filesQueue.length <= 1) {
          store.commit("StopUploadQueue");
        }

        item.error = e.message;
        reject(e);
      }
    });
  };
};

export default new Vuex.Store({
  state: {
    // Uploading stuff
    upload_data: [],
    name_conflicts: [],
    file_queue_started: false,
    after_upload: { type: "", cb: null },
    current_node_upload: {},
    //
    entryMode: false,
    wallet_compatible_version: "0.9.3",
    fetch_blockchain_info_error: false,
    binlayer: {
      endpoint: "http://localhost:8090/uploads",
      authtoken: "1234",
    },
    rpc_endpoint: "http://rpc.filefilego.com:8090/",
    wallets: [],
    selected_wallet_status: { unlocked: false },
    pending_txs: [],
    loading_wallet: false,
    contracts: [],
    blockchain_settings: {
      binlayer_engine_enabled: false,
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
    SetCurrentNodeUpload(state, val) {
      state.current_node_upload = { ...val };
    },
    AddToUploadData(state, val) {
      let isConflict =
        state.upload_data.filter((o) => o.name == val.name).length > 0;
      if (isConflict) {
        state.name_conflicts.push(val);
      } else {
        state.upload_data.push(val);
        filesQueue.push(
          asyncFunctionFactory(
            this,
            state.upload_data[state.upload_data.length - 1]
          )
        );
      }
    },
    SetUploadData(state, val) {
      state.upload_data = [...val];
    },
    AddToContracts(state, val) {
      let isDup =
        state.contracts.filter(
          (o) => o.txHash == val.txHash && o.contractHash == val.contractHash
        ).length > 0;
      if (!isDup) state.contracts.push(val);
    },
    SetContracts(state, val) {
      state.contracts = [...val];
    },
    RemoveContract(state, index) {
      state.contracts.splice(index, 1);
    },
    RemoveUploadData(state, index) {
      state.upload_data.splice(index, 1);
    },
    CancelUploadData(state, index) {
      state.upload_data[index].canceled = true;
      if (state.upload_data[index].cancel)
        state.upload_data[index].cancel.cancel();
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

      if (settings.binlayer_token && settings.binlayer_token != "") {
        state.binlayer.authtoken = settings.binlayer_token;
      }

      if (settings.binlayer_endpoint && settings.binlayer_endpoint != "") {
        state.binlayer.endpoint = settings.binlayer_endpoint;
      }

      if (settings.contracts && settings.contracts.length != 0) {
        state.contracts = settings.contracts;
      }
    },
    SetBlockchainSettings(state, sts) {
      state.blockchain_settings = { ...sts };
    },
    StartUploadQueue(state, payload) {
      state.file_queue_started = true;
      filesQueue.start();
      state.after_upload = payload;
    },
    StopUploadQueue(state) {
      state.file_queue_started = false;
      filesQueue.stop();

      // go through all the data
      if (state.after_upload.cb != null) {
        state.after_upload.cb();
      }
    },
  },
  actions: {
    AddToContracts(context, payload) {
      context.commit("AddToContracts", payload);
    },
    SetContracts(context, payload) {
      context.commit("SetContracts", payload);
    },
    RemoveContract(context, payload) {
      context.commit("RemoveContract", payload);
    },
    SetCurrentNodeUpload(context, payload) {
      context.commit("SetCurrentNodeUpload", payload);
    },
    StartUploadQueue(context, payload) {
      context.commit("StartUploadQueue", payload);
    },
    StopUploadQueue(context) {
      context.commit("StopUploadQueue");
    },
    AddToUploadData(context, payload) {
      context.commit("AddToUploadData", payload);
    },
    SetUploadData(context, payload) {
      context.commit("SetUploadData", payload);
    },
    RemoveUploadData(context, payload) {
      context.commit("RemoveUploadData", payload);
    },
    CancelUploadData(context, payload) {
      context.commit("CancelUploadData", payload);
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
      context.commit("SetFetchBlockchainInfoError", false);
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
