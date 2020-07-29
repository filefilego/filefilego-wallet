<template>
  <div>
    <div style="border-bottom: 1px solid #ddd;" uk-grid>
      <div class="uk-width-expand">
        <h4
          style="color: rgb(13, 13, 13); padding-bottom: 11px;"
          class="header-display-1"
        >
          Wallet
        </h4>
      </div>
      <div class="uk-width-auto uk-text-right">
        <button
          @click="openImportWalletModal()"
          type="button"
          class="uk-button uk-button-default"
          style="margin-right:4px; border-radius: 3px;width: 170px;line-height: 30px;height: 35px;background-color: #607d8b;color: rgb(255, 255, 255);border: 1px solid #57707c;font-weight: bold;padding: 0px;"
        >
          <span class="icon-box-add" style="margin-right: 10px;"></span> Import
          Wallet
        </button>
        <button
          @click="openNewWalletDialog()"
          type="button"
          class="uk-button uk-button-default"
          style="border-radius: 3px;width: 170px;line-height: 30px;height: 35px;background-color: #4a07c2; color: rgb(255, 255, 255);border: 1px solid #180141;font-weight: bold;padding: 0px;"
        >
          <span class="icon-plus" style="margin-right:10px;"></span> New Wallet
        </button>
      </div>
    </div>

    <div
      v-show="wallets.length == 0"
      class="uk-text-center"
      style="margin-top:15px;"
    >
      <h4
        style="color: rgb(13, 13, 13); padding-bottom: 11px; "
        class="header-display-1"
      >
        You don't have any wallet yet
      </h4>
      <div
        style="background-color:#fff; border-radius:50%; border:2px solid #3e15ca; width:120px; height:120px; text-align:center; margin:0 auto;"
      >
        <span
          class="icon-credit-card"
          style="color:#3e15ca; font-size:4em; margin-top:25px; display:inline-block;"
        ></span>
      </div>

      <div style="width:70%; margin:0 auto;">
        <p class="med-text" style="font-size:1.1em; margin-top:20px;">
          You can create a new wallet or import an existing one by using the
          above buttons. You can create multiple wallets with different
          passwords each but you
          <span style="font-weight:bold;">MUST</span> remember the
          <span style="font-weight:bold; color:red;">password</span> + backup
          the <span style="font-weight:bold; color:red;">keystore file</span>.
          If you forget or lose the keystore file no one will be able to recover
          the coins associated with your wallets.
        </p>
      </div>
    </div>

    <div
      v-show="wallets.length > 0"
      class="uk-text-center"
      style="margin-top:15px;"
    >
      <h4
        style="color: rgb(13, 13, 13); padding-bottom: 11px; font-size:1.6em;"
        class="header-display-1"
      >
        Select wallet to unlock:
      </h4>

      <div class="uk-margin">
        <select
          v-model="selected_wallet"
          style="width:50%; border:1px solid #ebecef; border-radius:4px; height:60px;"
          class="uk-select"
        >
          <option value="select">
            <span style="font-weight:bold; padding:5px;">Select key file</span>
          </option>
          <option
            :value="wallet.name"
            v-for="wallet in wallets"
            :key="wallet.name"
          >
            <span style="font-weight:bold; padding:5px;">{{
              addressFromKeyname(wallet.name)
            }}</span>
          </option>
        </select>
      </div>
      <div class="uk-margin">
        <input
          v-if="!selected_wallet_status.unlocked"
          v-model="unlock_password"
          style="width:50%; border:1px solid #ebecef; border-radius:4px; height:60px;"
          class="uk-input"
          type="password"
          placeholder="Password"
        />
        <span style="color:#000;" v-else
          >This wallet is already unlocked. Click below to open the wallet</span
        >
      </div>

      <div class="uk-margin">
        <button
          v-if="!selected_wallet_status.unlocked"
          :disabled="selected_wallet == 'select' || unlock_password == ''"
          @click="unlockWallet()"
          type="button"
          class="uk-button uk-button-default"
          style="margin-top:20px; border-radius: 4px;width: 300px;background-color: rgb(12, 99, 244);color: rgb(255, 255, 255);border: 1px solid rgb(13, 100, 240);padding: 0px;line-height: 34px;height: 47px;font-weight: bold;"
        >
          <span class="icon-unlocked" style="margin-right:7px;"></span>
          Unlock
        </button>
        <button
          @click="openWalletPanel()"
          v-else
          type="button"
          class="uk-button uk-button-default"
          style="margin-top:20px; border-radius: 4px;width: 300px;background-color: rgb(12, 99, 244);color: rgb(255, 255, 255);border: 1px solid rgb(13, 100, 240);padding: 0px;line-height: 34px;height: 47px;font-weight: bold;"
        >
          <span class="icon-unlocked" style="margin-right:7px;"></span>
          Open Wallet
        </button>

        <br />
        <span
          v-show="error != ''"
          style="margin-top:10px; display:inline-block; color:red;"
          >{{ error }}</span
        >
      </div>

      <div style="margin-top:90px;"></div>

      <!-- <div v-for="wallet in wallets" :key="wallet.name">{{ wallet.name }}</div> -->
    </div>

    <div ref="import_wallet" class="uk-modal" uk-modal="bg-close:false;">
      <div class="uk-modal-dialog uk-margin-auto-vertical">
        <button
          class="uk-modal-close-default"
          style="left: 5px; top: 15px; right: 0px;"
          type="button"
          uk-close
        ></button>
        <div class="uk-modal-header">
          <h2 style="font-size: 1.1em;" class="uk-modal-title header-display-1">
            Import wallet with keystore file
          </h2>
        </div>
        <div style="padding:0; margin-top:0px;" class="uk-modal-body">
          <div class="uk-text-center" style="padding:15px;">
            <div style="margin-top:10px;">
              <span style="display: inline-block; margin-top: 5px;">
                Click on "Select Key File" and enter your password to import
                your key to this wallet.
              </span>

              <button
                @click="importWallet()"
                type="button"
                class="uk-button uk-button-default"
                style=" margin-top:10px; border-radius: 4px;width: 157px;background-color: #607d8b;color: rgb(255, 255, 255); border: 1px solid #57707c;padding: 0px;line-height: 34px;height: 47px;font-weight: bold;"
              >
                <span class="icon-key" style="margin-right:4px;"></span>
                Select Key File</button
              ><br />

              <div class="uk-margin">
                <div style="width:100%;" class="uk-inline">
                  <span
                    style="color:#000000"
                    class="uk-form-icon"
                    uk-icon="icon: lock"
                  ></span>
                  <input
                    v-model="password_import"
                    class="uk-input"
                    type="password"
                    placeholder="Password"
                    required="true"
                    pattern=".{5,}"
                    title="5 characters minimum"
                  />
                </div>
                <br />
                <span
                  v-show="import_error != ''"
                  style="color:red; display:inline-block; margin-top:7px;"
                  >{{ import_error }}</span
                >
              </div>

              <div class="uk-margin uk-text-center" style="padding:15px;">
                <button
                  @click="importKey"
                  :disabled="
                    loading ||
                      !(
                        password_import.length > 0 &&
                        selected_keystore_file_import != ''
                      )
                  "
                  type="button"
                  class="uk-button uk-button-default"
                  style="border-radius: 4px;width: 157px;background-color: rgb(12, 99, 244);color: rgb(255, 255, 255);border: 1px solid rgb(13, 100, 240);padding: 0px;line-height: 34px;height: 47px;font-weight: bold;"
                >
                  Import</button
                ><br />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      ref="success_import_wallet"
      class="uk-modal"
      uk-modal="bg-close:false;"
    >
      <div class="uk-modal-dialog uk-margin-auto-vertical">
        <button
          class="uk-modal-close-default"
          style="left: 5px; top: 15px; right: 0px;"
          type="button"
          uk-close
        ></button>
        <div class="uk-modal-header">
          <h2 style="font-size: 1.1em;" class="uk-modal-title header-display-1">
            Successful
          </h2>
        </div>
        <div
          style="padding:0; margin-top:0px; padding-bottom:20px;"
          class="uk-modal-body"
        >
          <div class="uk-text-center" style="padding:15px;">
            <div style="margin-top:10px;">
              <h4
                style="color: rgb(13, 13, 13); padding-bottom:0; margin-bottom:0;"
                class="header-display-1"
              >
                <span
                  class="icon-notification"
                  style="vertical-align:middle; display:inline-block; font-size:1.7em; color:green; margin-right:5px;"
                ></span>
                <span
                  style="vertical-align:middle; display:inline-block; color:green; "
                >
                  Key was successfully imported!
                </span>
              </h4>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      ref="success_created_wallet"
      class="uk-modal"
      uk-modal="bg-close:false;"
    >
      <div class="uk-modal-dialog uk-margin-auto-vertical">
        <button
          class="uk-modal-close-default"
          style="left: 5px; top: 15px; right: 0px;"
          type="button"
          uk-close
        ></button>
        <div class="uk-modal-header">
          <h2 style="font-size: 1.1em;" class="uk-modal-title header-display-1">
            Successful
          </h2>
        </div>
        <div
          style="padding:0; margin-top:0px; padding-bottom:20px;"
          class="uk-modal-body"
        >
          <div class="uk-text-center" style="padding:15px;">
            <div style="margin-top:10px;">
              <h4
                style="color: rgb(13, 13, 13); padding-bottom:0; margin-bottom:0;"
                class="header-display-1"
              >
                <span
                  class="icon-notification"
                  style="vertical-align:middle; display:inline-block; font-size:1.7em; color:green; margin-right:5px;"
                ></span>
                <span
                  style="vertical-align:middle; display:inline-block; color:green; "
                >
                  Your wallet was successfully created. You can now select and
                  unlock it.
                </span>
              </h4>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div ref="create_wallet" class="uk-modal" uk-modal="bg-close:false;">
      <div class="uk-modal-dialog uk-margin-auto-vertical">
        <button
          class="uk-modal-close-default"
          style="left: 5px; top: 15px; right: 0px;"
          type="button"
          uk-close
        ></button>
        <div class="uk-modal-header">
          <h2 style="font-size: 1.1em;" class="uk-modal-title header-display-1">
            Create a wallet
          </h2>
        </div>
        <div style="padding:0; margin-top:20px;" class="uk-modal-body">
          <div class="uk-text-center" style="padding:15px;">
            <div uk-grid>
              <div class="uk-width-1-3@m">
                <span
                  style="padding: 13px; border-radius: 50%; border: 1px solid #0963f4; color: rgb(9, 99, 244); font-size: 2em;"
                  class="icon-eye-blocked"
                ></span>
                <h2
                  style="margin-top: 13px; font-size: 1.1em;"
                  class="uk-modal-title header-display-1"
                >
                  Don't Lose It
                </h2>
              </div>
              <div class="uk-width-1-3@m">
                <span
                  style="padding: 13px; border-radius: 50%; border: 1px solid #0963f4; color: rgb(9, 99, 244); font-size: 2em;"
                  class="icon-link"
                ></span>
                <h2
                  style="margin-top: 13px; font-size: 1.1em;"
                  class="uk-modal-title header-display-1"
                >
                  Don't Share It
                </h2>
              </div>
              <div class="uk-width-1-3@m">
                <span
                  style="padding: 13px; border-radius: 50%; border: 1px solid #0963f4; color: rgb(9, 99, 244); font-size: 2em;"
                  class="icon-briefcase"
                ></span>
                <h2
                  style="margin-top: 13px; font-size: 1.1em;"
                  class="uk-modal-title header-display-1"
                >
                  Make a Backup
                </h2>
              </div>
            </div>

            <div style="margin-top:40px;">
              <div class="uk-margin">
                <div style="width:100%;" class="uk-inline">
                  <span
                    style="color:#000000"
                    class="uk-form-icon"
                    uk-icon="icon: lock"
                  ></span>
                  <input
                    v-model="password"
                    class="uk-input"
                    type="password"
                    placeholder="Password ( min 5 characters )"
                    required="true"
                    pattern=".{5,}"
                    title="5 characters minimum"
                  />
                </div>
              </div>

              <div class="uk-margin">
                <div style="width:100%;" class="uk-inline">
                  <span
                    style="color:#000000"
                    class="uk-form-icon"
                    uk-icon="icon: lock"
                  ></span>
                  <input
                    v-model="password_confirmation"
                    class="uk-input"
                    type="password"
                    placeholder="Password confirmation ( min 5 characters )"
                    required="true"
                    pattern=".{5,}"
                    title="5 characters minimum"
                  />
                </div>
              </div>

              <div class="uk-margin uk-text-center" style="padding:15px;">
                <button
                  @click="createWallet()"
                  :disabled="
                    loading ||
                      !(
                        password.length >= 5 &&
                        password == password_confirmation
                      )
                  "
                  type="button"
                  class="uk-button uk-button-default"
                  style="border-radius: 4px;width: 157px;background-color: rgb(12, 99, 244);color: rgb(255, 255, 255);border: 1px solid rgb(13, 100, 240);padding: 0px;line-height: 34px;height: 47px;font-weight: bold;"
                >
                  Create</button
                ><br />

                <span style="display: inline-block; margin-top: 17px;">
                  <span style="color:red;">DO NOT FORGET</span> to save your
                  password. You will need this
                  <span style="color:red;">Password + Keystore File</span> to
                  unlock your wallet.
                </span>
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
const { dialog } = window.require("electron").remote;

export default {
  data() {
    return {
      import_error: "",
      selected_keystore_file_import: "",
      password_import: "",
      selected_wallet: "select",
      loading: false,
      password: "",
      password_confirmation: "",
      unlock_password: "",
      error: "",
      saveDialogRegistered: false,
    };
  },
  beforeDestroy() {
    ipcRenderer.removeAllListeners();
  },
  watch: {
    selected_wallet: function(newval) {
      this.$store.dispatch("SetSelectedWalletStatus", {
        address: newval,
        unlocked: ipcRenderer.sendSync("is_unlocked_wallet", newval),
      });
    },
  },
  mounted() {
    ipcRenderer.on("accounts-reply", (event, arg) => {
      this.loading = false;
      // this.wallets = [...arg];
      this.$store.dispatch("SetWallets", arg);
    });

    this.loading = true;
    ipcRenderer.send("accounts");
    this.$store.dispatch("SetSelectedWalletStatus", {
      address: "",
      unlocked: false,
    });
  },
  computed: {
    wallets() {
      return this.$store.state.wallets;
    },
    selected_wallet_status() {
      return this.$store.state.selected_wallet_status;
    },
  },
  methods: {
    importKey() {
      let res = ipcRenderer.sendSync("import_wallet", {
        password: this.password_import,
        file: this.selected_keystore_file_import,
      });

      if (res.error) {
        this.import_error = res.message;
      } else {
        window.UIkit.modal(this.$refs.import_wallet).hide();
        window.UIkit.modal(this.$refs.success_import_wallet).show();
      }
    },
    openImportWalletModal() {
      window.UIkit.modal(this.$refs.import_wallet).show();
    },
    openWalletPanel() {
      this.$router.push("/wallet/panel");
    },
    unlockWallet() {
      this.error = "";
      if (
        this.selected_wallet == "select" ||
        this.selected_wallet == "" ||
        this.unlock_password == ""
      )
        return;

      // get the passcode
      let res = ipcRenderer.sendSync("unlock_wallet", {
        password: this.unlock_password,
        address: this.selected_wallet,
      });

      if (res.error) this.error = res.error;
      else {
        this.$store.dispatch("SetSelectedWalletStatus", {
          address: this.selected_wallet,
          unlocked: true,
        });
        this.openWalletPanel();
      }

      // this.$store.dispatch("SetUnlockedWallet", res.key);
    },
    addressFromKeyname(name) {
      return name.split("--")[2];
    },
    importWallet() {
      dialog.showOpenDialog({ properties: ["openFile"] }).then((result) => {
        if (!result.canceled) {
          let destinationFile = result.filePaths[0];
          this.selected_keystore_file_import = destinationFile;
          // console.log(destinationFile);
          // ipcRenderer.send("import_wallet", {
          //   destination: destinationFile,
          // });
        }
      });
    },
    createWallet() {
      if (this.loading) return;
      if (
        !(
          this.password.length >= 5 &&
          this.password == this.password_confirmation
        )
      )
        return;

      this.loading = true;
      ipcRenderer.send("create_wallet", this.password);
      if (!this.saveDialogRegistered)
        ipcRenderer.on("create_wallet-reply", (event, arg) => {
          this.saveDialogRegistered = true;
          window.UIkit.modal(this.$refs.create_wallet).hide();
          window.UIkit.modal(this.$refs.success_created_wallet).show();

          this.loading = false;
          ipcRenderer.send("accounts");
          dialog
            .showOpenDialog({ properties: ["openDirectory"] })
            .then((result) => {
              if (!result.canceled) {
                let destinationDir = result.filePaths[0];
                ipcRenderer.send("save_wallet", {
                  destination: destinationDir,
                  payload: arg,
                });
              }
            });
        });
      // this.wallets.push({ address: res.address });
    },
    openNewWalletDialog() {
      window.UIkit.modal(this.$refs.create_wallet).show();
    },
  },
};
</script>

<style scoped>
.uk-button-default:disabled,
.uk-button-primary:disabled,
.uk-button-secondary:disabled,
.uk-button-danger:disabled {
  background-color: #f8f8f8 !important;
  color: #999 !important;
  border: 1px solid #d5d5d5 !important;
}
</style>
