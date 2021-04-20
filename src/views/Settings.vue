<template>
  <div>
    <h4
      style="color: rgb(13, 13, 13); border-bottom: 1px solid #ddd; padding-bottom: 11px;"
      class="header-display-1"
    >
      Settings
    </h4>

    <h4
      style="color: rgb(13, 13, 13); padding-bottom:0; margin-bottom:0;"
      class="header-display-1"
    >
      Remote JSON RPC Endpoint
    </h4>

    <div style="margin-top:10px;">
      <div class="uk-margin">
        <div style="width:100%;" class="uk-inline">
          <input
            v-model="endpoint"
            class="uk-input"
            type="text"
            placeholder="http://127.0.0.1:8090/"
            required="true"
          />
        </div>
      </div>
    </div>

    <div class="uk-margin" style="">
      <button
        @click="SaveSettings()"
        type="button"
        class="uk-button uk-button-default"
        style="border-radius: 4px;width: 157px;background-color: rgb(12, 99, 244);color: rgb(255, 255, 255);border: 1px solid rgb(13, 100, 240);padding: 0px;line-height: 34px;height: 47px;font-weight: bold;"
      >
        Save settings</button
      ><br />
    </div>

    <div style="margin-top:10px;">
      <div class="uk-margin">
        <pre>{{ blockchain_settings }}</pre>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
const { ipcRenderer } = window.require("electron");
export default {
  data() {
    return {
      endpoint: "",
    };
  },
  computed: {
    rpcEndpoint() {
      return this.$store.state.rpc_endpoint;
    },
    blockchain_settings() {
      return this.$store.state.blockchain_settings;
    },
  },
  mounted() {
    if (
      this.rpcEndpoint != "http://rpc.filefilego.com:8090/" &&
      this.rpcEndpoint != "http://rpc.filefilego.com:8090"
    ) {
      this.endpoint = this.rpcEndpoint;
    }
  },
  methods: {
    async SaveSettings() {
      if (this.endpoint != "") {
        let settings = ipcRenderer.sendSync("load_settings");
        settings.wallet_rpc_endpoint = this.endpoint;
        this.$store.dispatch("SetSettings", settings);

        try {
          const res = await axios.post(this.rpcEndpoint, {
            jsonrpc: "2.0",
            method: "ffg_settings",
            params: [],
            id: 1,
          });
          this.$store.dispatch("SetBlockchainSettings", res.data.result);
        } catch (e) {
          // error
          
          this.$store.dispatch(
            "SetFetchBlockchainInfoError",
            "Error while connecting to the RPC server. Please make sure you are connected to internet."
          );
          
        }

        ipcRenderer.sendSync("save_settings", settings);
        window.UIkit.notification({
          message: "Settings were successfully saved",
          status: "success",
          pos: "top-center",
          timeout: 900,
        });
      }
    },
  },
};
</script>

<style></style>
