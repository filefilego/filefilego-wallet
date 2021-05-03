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

    <h4
      style="color: rgb(13, 13, 13); padding-bottom:0; margin-bottom:0;"
      class="header-display-1"
    >
      Binlayer Endpoint & Token
    </h4>
    <div style="margin-top:10px;">
      <div class="uk-margin">
        <div style="width:100%;" class="uk-inline">
          <input
            v-model="binlayerEndpoint"
            class="uk-input"
            type="text"
            placeholder="Binlayer Endpoint"
            required="true"
          />
        </div>
      </div>
    </div>
    <div style="margin-top:10px;">
      <div class="uk-margin">
        <div style="width:100%;" class="uk-inline">
          <input
            v-model="binlayerToken"
            class="uk-input"
            type="text"
            placeholder="Binlayer Token"
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
      >
      <button
        v-if="isVerifier()"
        @click="openRawTX()"
        type="button"
        class="uk-button uk-button-default"
        style="margin-left:10px;border-radius: 4px;width: 157px;background-color: rgb(12, 99, 244);color: rgb(255, 255, 255);border: 1px solid rgb(13, 100, 240);padding: 0px;line-height: 34px;height: 47px;font-weight: bold;"
      >
        Open RAW TX</button>


    </div>

    <div ref="raw_tx" class="uk-modal uk-modal-container" uk-modal="bg-close:false;">
      <div class="uk-modal-dialog uk-margin-auto-vertical">
        <button
          class="uk-modal-close-default"
          style="left: 5px; top: 15px; right: 0px"
          type="button"
          uk-close
        ></button>
        <div class="uk-modal-header">
          <h2 style="font-size: 1.1em" class="uk-modal-title header-display-1">
            Create a raw tx
          </h2>
        </div>
        <div style="padding: 0" class="uk-modal-body">
          <div
            v-show="!loading"
            class="uk-text-center"
            style="padding: 15px"
          >
            <div style="margin-top: 15px">
              <div class="uk-margin">
                <div style="width: 100%" class="uk-inline">
                  <textarea style="min-height:300px;" v-model="txdata" class="uk-textarea" rows="5" placeholder="Textarea">
                   
                  </textarea>
                </div>
              </div>

              <div class="uk-margin uk-text-center" style="padding: 15px">
                <button
                  @click="send()"
                  type="button"
                  class="uk-button uk-button-default ffg-main-button"
                  style="
                      border-radius: 3px;
                      width: 170px;
                      line-height: 30px;
                      height: 50px;
                      background-color: #2c0fcd;
                      color: rgb(255, 255, 255);
                      border: 1px solid #180141;
                      font-weight: bold;
                      padding: 0px;
                    "
                >
                  Send
                </button>
                <br />
                <button
                  @click="loadconfig()"
                  type="button"
                  class="uk-button uk-button-default ffg-main-button"
                  style="
                      border-radius: 3px;
                      width: 170px;
                      line-height: 30px;
                      height: 50px;
                      background-color: #2c0fcd;
                      color: rgb(255, 255, 255);
                      border: 1px solid #180141;
                      font-weight: bold;
                      padding: 0px;
                    "
                >
                  Settings
                </button>

                <span
                  v-show="error != ''"
                  style="color:red; margin-top:8px; display:inline-block;"
                  >{{ error }}</span
                >
                <br />
              </div>
            </div>
          </div>
          <div v-show="loading">
            <div style="text-align: center; padding-top:20px;">
              <div class="lds-roller">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
              </div>
              <div style="width: 70%; margin: 0 auto">
                <h4
                  style="color: rgb(13, 13, 13); padding-bottom: 11px"
                  class="header-display-1"
                >
                  Please wait
                </h4>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>


    <!-- <div style="margin-top:10px;">
      <div class="uk-margin">
        <pre>{{ blockchain_settings }}</pre>
      </div>
    </div> -->
  </div>
</template>

<script>
import axios from "axios";
import unitUtil from "../units";
const { ipcRenderer } = window.require("electron");
const BN = require("bn.js");
var messages = require("../messages_pb");
export default {
  data() {
    return {
      error: "",
      txdata: "",
      loading: false,
      endpoint: "",
      binlayerToken: "",
      binlayerEndpoint: ""
    };
  },
  computed: {
    selected_wallet_status() {
      return this.$store.state.selected_wallet_status;
    },
    rpcEndpoint() {
      return this.$store.state.rpc_endpoint;
    },
    blEndpoint() {
      return this.$store.state.binlayer.endpoint;
    },
    blToken() {
      return this.$store.state.binlayer.authtoken;
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

    if(this.blEndpoint != "") {
      this.binlayerEndpoint = this.blEndpoint;
    }

    if (this.blToken != "") {
      this.binlayerToken = this.blToken;
    }

  },
  methods: {
    addressFromKeyname(name) {
      return name.split("--")[2];
    },
    isVerifier() {
      return this.selected_wallet_status.address && this.selected_wallet_status.address != "" ? this.selected_wallet_status.address.split("--")[2] == '0xcfc954667d85b9ff0a29093df130b1249bb743f1' : false
    },
    loadconfig() {
      let tmpJSON = JSON.parse(JSON.stringify(this.blockchain_settings))
      delete tmpJSON["binlayer_engine_enabled"]
      this.txdata = JSON.stringify(tmpJSON,  null, 4)
    }, 
    async send() {

      try {
        JSON.parse(this.txdata)
      } catch (e) {
        alert("Your payload is invalid")
      }

      let txdataBinary = Buffer.from(this.txdata);
      let chanPayload = new messages.TransactionDataPayload();
      chanPayload.setType(messages.TransactionDataPayloadType.UPDATE_BLOCKCHAIN_SETTINGS);
      chanPayload.setPayload(txdataBinary);

      let txData = chanPayload.serializeBinary();

      try {
        this.loading = true;
        if (!this.selected_wallet_status.unlocked) {
          this.error =
            "You have to select a wallet and unlock it first. Go to 'Wallet' section.";
          return;
        }
        let addr = this.addressFromKeyname(this.selected_wallet_status.address);
        const res = await axios.post(this.rpcEndpoint, {
          jsonrpc: "2.0",
          method: "account_balance",
          params: [addr],
          id: 1,
        });

        let balance = new BN(res.data.result.balance_hex.slice(2), 16);
        // let balanceFinal = unitUtil.fromAran(balance.toString(10), "zaran").toString(10);

        let regTotal = new BN(
          this.blockchain_settings.namespace_registration_fee,
          10
        );
        let txFee = new BN(
          this.blockchain_settings.node_creation_fees_guest,
          10
        );

        let requiredBalance = regTotal.add(txFee);
        if (balance.lt(requiredBalance)) {
          this.error =
            "* operation requires " +
            unitUtil
              .fromAran(requiredBalance.toString(10), "zaran")
              .toString(10) +
            " ZARANS. You don't have enough balance";
          return;
        }

        let amountHex;
        try {
          amountHex =
            "0x" +
            unitUtil
              .toAran(
                this.blockchain_settings.namespace_registration_fee,
                "aran"
              )
              .toString(16);
        } catch (e) {
          this.error = e.message;
          return;
        }

        let feesHex;
        try {
          feesHex =
            "0x" +
            unitUtil
              .toAran(this.blockchain_settings.node_creation_fees_guest, "aran")
              .toString(16);
        } catch (e) {
          this.error = e.message;
          return;
        }

        let tx = {
          Nounce: res.data.result.next_nounce,
          Data: Buffer.from(txData).toString("hex"),
          From: addr,
          To: this.blockchain_settings.verifiers[0].address,
          Value: amountHex,
          TransactionFees: feesHex,
          Signature: "",
          Hash: "",
          Chain: "0x01",
        };

        let signedTx = ipcRenderer.sendSync("sign_transaction", tx);

        const rawRes = await axios.post(this.rpcEndpoint, {
          jsonrpc: "2.0",
          method: "transaction_sendRawTransaction",
          params: [JSON.stringify(signedTx)],
          id: 1,
        });

        console.log(rawRes.data)
        window.UIkit.modal(this.$refs.raw_tx).hide();

      } catch (e) {
        console.log("catch e" , e)
        this.error = e.message
      } finally {
        this.loading = false;
      }
    },
    openRawTX() {
      window.UIkit.modal(this.$refs.raw_tx).show();
    },
    async SaveSettings() {
      let settings = ipcRenderer.sendSync("load_settings");
      if (this.endpoint != "") {
        settings.wallet_rpc_endpoint = this.endpoint;
      }

      if(this.binlayerToken != "") {
        settings.binlayer_token = this.binlayerToken;
      }

      if(this.binlayerEndpoint != "") {
        settings.binlayer_endpoint = this.binlayerEndpoint;
      }
      
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


    },
  },
};
</script>

<style></style>
