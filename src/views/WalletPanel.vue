<template>
  <div>
    <h4
      style="color: rgb(13, 13, 13); border-bottom: 1px solid #ddd; padding-bottom: 11px; margin-bottom: 0px !important;"
      class="header-display-1"
    >
      Address:
      <span
        class="icon-copy"
        uk-tooltip="Copy"
        style="cursor:pointer; display:inline-block;"
        @click="copyAddressToClipboard()"
      ></span>
      {{ addressFromKeyname(selected_wallet_status.address) }}
    </h4>

    <div style="">
      <div
        style="padding-top: 0px; margin-top:0px;  border-radius: 10px;"
        class="uk-section"
      >
        <div
          style="background-color: #3e15ca; border-bottom: 2px solid #e7e7e7;"
        >
          <div class="uk-container" style="margin-top:0px; padding-top:0px;">
            <div style="padding:20px;">
              <div
                style="background-color:#fff; border-radius:50%; border:1px solid #3e15ca; width:64px; height:64px; text-align:center; margin:0 auto;"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  xmlns:xlink="http://www.w3.org/1999/xlink"
                  height="40px"
                  width="40px"
                  fill="#3e15ca"
                  version="1.1"
                  x="0px"
                  y="0px"
                  viewBox="0 0 28 26"
                  xml:space="preserve"
                  style="margin-top: 14px; fill: #3e15ca;enable-background:new 0 0 28 26;"
                >
                  <g>
                    <polygon
                      points="10,7 5,0 0,7 5,7 5,14 12.995,17.998 28,3 15,3  "
                    ></polygon>
                    <polygon points="18,14.406 13.541,18.865 18,26  "></polygon>
                  </g>
                </svg>
              </div>

              <h1
                style="color: #fff; font-size: 1.8em; margin-top: 9px; text-align: center;"
                class="header-display-1"
              >
                {{ HexAmountToAran(balance) }} ZARAN
              </h1>
            </div>
          </div>
        </div>

        <div
          style="background-color: rgb(242, 242, 242); border-bottom: 1px solid #dedede;     padding: 20px;"
        >
          <div style="" class="uk-container uk-text-center">
            <a
              style="font-size: 1.3em; padding-bottom: 5px; padding-top: 5px; margin-right:8px;"
              class="uk-button uk-button-default ffg-secondary-btn"
              href="#"
              @click="openSendModal()"
            >
              <span class="icon-arrow-up2"></span>
              Send</a
            >
            <a
              style="background-color:#3e15ca; font-size: 1.3em; padding-bottom: 5px; padding-top: 5px;"
              class="uk-button uk-button-default ffg-primary-btn"
              href="#"
              @click="showReceiveCoins()"
            >
              <span class="icon-arrow-down2"></span>
              Receive
            </a>
          </div>
        </div>
        <div style="padding: 8px 10px;">
          <span style="text-transform: none; color: black; font-weight: bold"
            >Last 10 transactions</span
          >
        </div>

        <div v-if="loading">
          <div class="uk-text-center">
            <span
              class="ffg-spinner icon-spinner10"
              style="font-size:6em; color:#3e15ca; margin-right:6px; vertical-align: middle;"
            ></span>
          </div>
        </div>
        <div v-else>
          <div v-if="!offline">
            <table class="uk-table uk-table-striped">
              <tbody>
                <tr
                  v-show="
                    transaction.From ==
                      addressFromKeyname(selected_wallet_status.address)
                  "
                  v-for="(transaction, i) in pending_txs"
                  :key="'pending_' + i"
                >
                  <td>
                    <div uk-grid>
                      <div class="uk-width-auto" style=" ">
                        <span
                          uk-tooltip="Waiting to verify"
                          class="icon-spinner7 ffg-spinner"
                          style="font-size:2em; vertical-align:middle; margin-right:6px; color:#3e15ca; margin-top:7px; "
                        ></span>
                      </div>
                      <div class="uk-width-expand">
                        <div style="padding-left:7px;">
                          <h4 style="margin-bottom: 0px;">
                            Sent
                            <span style=" font-weight:bold;">
                              {{ transaction.Timestamp8601 | formaldatetime }}
                            </span>
                          </h4>
                          <div style="margin-top:-7px;">
                            <p style="margin: 0;">
                              <span style="font-weight:bold;"
                                >To: {{ transaction.To }}</span
                              >
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td class="uk-text-right">
                    <span
                      style="color: #ff1100; text-transform: none;  font-weight: bold; font-size: 1.5em;"
                      >-{{ HexAmountToAran(transaction.Value) }} Z</span
                    >
                  </td>
                </tr>

                <tr v-for="(transaction, i) in transactions" :key="'tx_' + i">
                  <td>
                    <div uk-grid>
                      <div
                        class="uk-width-auto"
                        style=" margin-top: 2px; width: 40px; height: 40px; border-radius: 50%; border: 2px solid rgb(102, 102, 102); text-align: center;"
                      >
                        <span
                          style="font-size: 1.2em; margin-top: 10px; display: inline-block; vertical-align: middle;"
                          class=""
                          :class="
                            transaction.Transaction.From ==
                            addressFromKeyname(selected_wallet_status.address)
                              ? 'icon-arrow-up2'
                              : 'icon-arrow-down2'
                          "
                        ></span>
                      </div>
                      <div class="uk-width-expand">
                        <div style="padding-left:7px;">
                          <h4 style="margin-bottom: 0px;">
                            {{
                              transaction.Transaction.From ==
                              addressFromKeyname(selected_wallet_status.address)
                                ? "Sent"
                                : "Received"
                            }}
                            <span style=" font-weight:bold;">
                              {{ transaction.Timestamp8601 | formaldatetime }}
                            </span>
                          </h4>
                          <div style="margin-top:-7px;">
                            <p style="margin: 0;">
                              <span style="font-weight:bold;"
                                >{{
                                  transaction.Transaction.From ==
                                  addressFromKeyname(
                                    selected_wallet_status.address
                                  )
                                    ? "To"
                                    : "From"
                                }}:
                                {{
                                  transaction.Transaction.From ==
                                  addressFromKeyname(
                                    selected_wallet_status.address
                                  )
                                    ? transaction.Transaction.To
                                    : transaction.Transaction.From
                                }}</span
                              >
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td class="uk-text-right">
                    <span
                      :style="
                        transaction.Transaction.From ==
                        addressFromKeyname(selected_wallet_status.address)
                          ? 'color: #ff1100;'
                          : 'color: #47c463;'
                      "
                      style="text-transform: none;  font-weight: bold; font-size: 1.5em;"
                      >{{
                        transaction.Transaction.From ==
                        addressFromKeyname(selected_wallet_status.address)
                          ? "-"
                          : "+"
                      }}{{
                        HexAmountToAran(transaction.Transaction.Value)
                      }}
                      Z</span
                    >
                  </td>
                </tr>
              </tbody>
            </table>
            <div v-show="transactions.length == 0">
              <div>
                <div class="uk-text-center">
                  <div
                    style="background-color:#3e15ca; padding:15px; border-radius:12px 12px 0px 0px;"
                  >
                    <h4
                      style="color:#fff; margin:0; padding:0; font-weight:bold;"
                    >
                      No transactions associated with this address
                    </h4>
                  </div>
                  <div style="background-color:#f8f8f8; padding:15px;">
                    <p
                      class="med-text"
                      style="font-size:1.1em; margin-top:20px;"
                    >
                      There are no transactions for this address yet.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-else>
            <div class="uk-text-center">
              <div style="background-color:#d31056; padding:15px;">
                <h4 style="color:#fff; margin:0; padding:0;">
                  Network connection error
                </h4>
              </div>
              <div style="background-color:#f8f8f8; padding:15px;">
                <p class="med-text" style="font-size:1.1em; margin-top:20px;">
                  Please check your internet connection or make sure the remote
                  ip is resolvable.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div ref="receive_transaction" class="uk-modal" uk-modal="bg-close:false;">
      <div class="uk-modal-dialog uk-margin-auto-vertical">
        <button
          class="uk-modal-close-default"
          style="left: 5px; top: 15px; right: 0px;"
          type="button"
          uk-close
        ></button>
        <div class="uk-modal-header">
          <h2 style="font-size: 1.1em;" class="uk-modal-title header-display-1">
            Receive coins
          </h2>
        </div>
        <div style="padding:0; margin-top:0px;" class="uk-modal-body">
          <div class="uk-text-center" style="padding:10px;">
            <span style="display: inline-block; margin-top: 7px;">
              You can use your wallet's address to receive coins. Please make
              sure to copy the address exactly as it is.
            </span>

            <div style="margin-top:17px;">
              <div class="uk-margin">
                <div style="width:100%;" class="uk-inline">
                  <span
                    style="color:#000000"
                    class="uk-form-icon icon-target"
                  ></span>
                  <input
                    readonly
                    :value="addressFromKeyname(selected_wallet_status.address)"
                    class="uk-input"
                    type="text"
                    placeholder="Destination address"
                    required="true"
                  />
                </div>
              </div>

              <div class="uk-margin uk-text-center" style="padding:15px;">
                <button
                  @click="copyAddressToClipboard()"
                  type="button"
                  class="uk-button uk-button-default"
                  style="border-radius: 4px;width: 157px;background-color: rgb(12, 99, 244);color: rgb(255, 255, 255);border: 1px solid rgb(13, 100, 240);padding: 0px;line-height: 34px;height: 47px;font-weight: bold;"
                >
                  Copy Address</button
                ><br />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div ref="send_transaction" class="uk-modal" uk-modal="bg-close:false;">
      <div class="uk-modal-dialog uk-margin-auto-vertical">
        <button
          class="uk-modal-close-default"
          style="left: 5px; top: 15px; right: 0px;"
          type="button"
          uk-close
        ></button>
        <div class="uk-modal-header">
          <h2 style="font-size: 1.1em;" class="uk-modal-title header-display-1">
            Send coins
          </h2>
        </div>
        <div style="padding:0; margin-top:20px;" class="uk-modal-body">
          <div class="uk-text-center" style="padding:15px;">
            <span style="display: inline-block; margin-top: 17px;">
              Send coins to the destination address by specifying the amount and
              the fees.
            </span>

            <div style="margin-top:40px;">
              <div class="uk-margin">
                <div style="width:100%;" class="uk-inline">
                  <span
                    style="color:#000000"
                    class="uk-form-icon icon-target"
                  ></span>
                  <input
                    v-model="destination_address"
                    class="uk-input"
                    type="text"
                    placeholder="Destination address"
                    required="true"
                  />
                </div>
                <div
                  class="uk-text-left"
                  style="padding-left:16px; padding-top:4px;"
                >
                  <span v-show="errorAddr != ''" style="color:red;"
                    >⚫ {{ errorAddr }}</span
                  >
                </div>
              </div>

              <div class="uk-margin">
                <div style="width:100%;" class="uk-inline">
                  <span
                    style="color:#000000"
                    class="uk-form-icon icon-coin-dollar"
                  ></span>
                  <input
                    v-model="amount"
                    class="uk-input"
                    type="text"
                    placeholder="Amount (e.g. 100)"
                    required="true"
                  />
                </div>
                <div
                  class="uk-text-left"
                  style="padding-left:16px; padding-top:4px;"
                >
                  <span v-show="amountError != ''" style="color:red;"
                    >⚫ {{ amountError }}</span
                  >
                </div>
              </div>

              <div class="uk-margin">
                <div style="width:100%;" class="uk-inline">
                  <span
                    style="color:#000000"
                    class="uk-form-icon icon-coin-dollar"
                  ></span>
                  <input
                    v-model="fees"
                    class="uk-input"
                    type="text"
                    placeholder="Fees (e.g. 0.05)"
                    required="true"
                  />
                </div>
                <div
                  class="uk-text-left"
                  style="padding-left:16px; padding-top:4px;"
                >
                  <span v-show="feesError != ''" style="color:red;"
                    >⚫ {{ feesError }}</span
                  >
                </div>
              </div>

              <div class="uk-margin uk-text-center" style="padding:15px;">
                <div
                  class="uk-text-left"
                  style="padding-left:16px; padding-top:4px;"
                >
                  <span v-show="error_result != ''" style="color:red;"
                    >⚫ {{ error_result }}</span
                  >
                </div>

                <span
                  v-show="loading_sendcoin"
                  class="icon-spinner9 ffg-spinner"
                  style="font-size:1.7em; vertical-align:middle; margin-right:10px; color:#3e15ca;"
                ></span>
                <button
                  :disabled="loading_sendcoin"
                  @click="SendCoins()"
                  type="button"
                  class="uk-button uk-button-default"
                  style="border-radius: 4px;width: 157px;background-color: rgb(12, 99, 244);color: rgb(255, 255, 255);border: 1px solid rgb(13, 100, 240);padding: 0px;line-height: 34px;height: 47px;font-weight: bold;"
                >
                  Send</button
                ><br />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const { ipcRenderer } = window.require("electron");
const { clipboard } = window.require("electron");

import ks from "../keystore";
import unitUtil from "../units";
import axios from "axios";
const BN = require("bn.js");
export default {
  data() {
    return {
      loading_sendcoin: false,
      error_result: "",
      loading: false,
      balance: "0",
      transactions: [],
      errorAddr: "fc",
      amount: "",
      amountError: "",
      fees: "",
      feesError: "",
      destination_address: "",
      offline: false,
    };
  },
  components: {},
  computed: {
    loading_wallet() {
      return this.$store.state.loading_wallet;
    },
    pending_txs() {
      return this.$store.state.pending_txs;
    },
    rpcEndpoint() {
      return this.$store.state.rpc_endpoint;
    },
    selected_wallet_status() {
      return this.$store.state.selected_wallet_status;
    },
  },
  beforeDestroy() {
    clearInterval(this.refreshInterval);
  },
  mounted() {
    this.errorAddr = "";
    this.amountError = "";
    this.feesError = "";
    this.loadData(true);
    this.refreshInterval = setInterval(() => {
      this.loadData(false);
    }, 11000);
  },
  watch: {
    fees: function() {
      this.validInputs();
    },
    amount: function() {
      this.validInputs();
    },
    destination_address: function() {
      this.validInputs();
    },
  },
  methods: {
    async loadData(first) {
      if (this.loading) return;
      if (first) this.loading = true;

      this.$store.dispatch("SetLoadingWallet", true);

      await this.getDataFromRPC(
        this.addressFromKeyname(this.selected_wallet_status.address)
      );
      await this.getLastTransactions(
        this.addressFromKeyname(this.selected_wallet_status.address)
      );

      this.transactions.map((o) => {
        let hash = new Buffer(o.Transaction.Hash, "base64");
        o.Transaction.Hash = `0x${ks.EncodeBytesToHex(hash)}`;
        this.pending_txs.map((j) => {
          if (j.Hash == o.Transaction.Hash) {
            this.$store.dispatch("RemovePendingTxs", j);
          }
        });
      });

      this.loading = false;
      this.$store.dispatch("SetLoadingWallet", false);
    },
    HexAmountToAran(val) {
      let amount = new BN(val.slice(2), 16);
      return unitUtil.fromAran(amount.toString(10), "zaran").toString(10);
    },
    showReceiveCoins() {
      window.UIkit.modal(this.$refs.receive_transaction).show();
    },
    validInputs() {
      if (this.destination_address.substring(0, 2) != "0x") {
        this.errorAddr = "Address must begin with '0x'";
        return false;
      }

      if (this.destination_address.length != 42) {
        this.errorAddr = "Address must be 42 characters";
        return false;
      } else {
        this.errorAddr = "";
      }

      if (this.amount == "") {
        this.amountError = "Amount is required";
        return false;
      }

      let decimalRegex = /^\d+(\.\d+)*$/;
      if (!decimalRegex.test(`${this.amount}`)) {
        this.amountError = "Amount is invalid";
        return false;
      }

      this.amountError = "";

      if (!decimalRegex.test(`${this.fees}`)) {
        this.feesError = "Fees amount is invalid";
        return false;
      }

      this.feesError = "";

      return true;
    },
    async SendCoins() {
      try {
        this.error_result = "";
        let addr = this.addressFromKeyname(this.selected_wallet_status.address);

        let validRes = this.validInputs();
        if (!validRes) return;

        const res = await axios.post(this.rpcEndpoint, {
          jsonrpc: "2.0",
          method: "account_balance",
          params: [addr],
          id: 1,
        });
        let amountHex;
        try {
          amountHex = "0x" + unitUtil.toAran(this.amount, "zaran").toString(16);
        } catch (e) {
          this.amountError = e.message;
          return;
        }

        let feesHex;
        try {
          feesHex = "0x" + unitUtil.toAran(this.fees, "zaran").toString(16);
        } catch (e) {
          this.feesError = e.message;
          return;
        }

        this.loading_sendcoin = true;

        let tx = {
          Nounce: res.data.result.next_nounce,
          Data: "",
          From: addr,
          To: this.destination_address,
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

        if ("error" in rawRes.data) {
          this.error_result = rawRes.data.error.message;
          return;
        }

        this.$store.dispatch("AddPendingTxs", {
          Hash: rawRes.data.result,
          Timestamp8601: new Date(),
          To: this.destination_address,
          From: addr,
          Value: amountHex,
          TransactionFees: feesHex,
        });

        window.UIkit.modal(this.$refs.send_transaction).hide();

        this.destination_address = "";
        this.amount = "";
        this.fees = "";
        // everything is ok, put it recent transactions

        //  { result: "0x9c1e92a50dc7e13265255f7388926ab8a9310d14359045561bce6ca0db8fc5f2" ... }

        // { error: {code: -32000, message: "a transaction with the same nounce is already in mempool" }}}
      } catch (e) {
        console.log(e.message);
      } finally {
        this.loading_sendcoin = false;
      }
    },
    openSendModal() {
      window.UIkit.modal(this.$refs.send_transaction).show();
    },
    async getDataFromRPC(address) {
      try {
        const res = await axios.post(this.rpcEndpoint, {
          jsonrpc: "2.0",
          method: "account_balance",
          params: [address],
          id: 1,
        });
        this.balance = res.data.result.balance_hex;
      } catch (e) {
        if (e.message == "Network Error") {
          this.offline = true;
        }
      }
    },
    async getLastTransactions(address) {
      try {
        const res = await axios.post(this.rpcEndpoint, {
          jsonrpc: "2.0",
          method: "transaction_byAddress",
          params: [address],
          id: 1,
        });
        this.transactions = [...res.data.result];
      } catch (e) {
        // console.log(e);
        if (e.message == "Network Error") {
          this.offline = true;
        }
      }
    },
    copyAddressToClipboard() {
      clipboard.writeText(
        this.addressFromKeyname(this.selected_wallet_status.address),
        "clipboard"
      );

      window.UIkit.notification({
        message: "Address copied to clipboard!",
        status: "success",
        pos: "top-center",
        timeout: 900,
      });
    },
    addressFromKeyname(name) {
      return name.split("--")[2];
    },
  },
};
</script>

<style>
.uk-notification-message {
  border: 1px solid #ddd;
  border-radius: 4px;
}

.uk-table td {
  padding: 8px 9px;
  vertical-align: top;
}

.uk-button-default:disabled,
.uk-button-primary:disabled,
.uk-button-secondary:disabled,
.uk-button-danger:disabled {
  background-color: #f8f8f8 !important;
  color: #999 !important;
  border: 1px solid #d2d2d2 !important;
}
</style>
