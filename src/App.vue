<template>
  <div>
    <router-view />

    <div ref="new_version" class="uk-modal" uk-modal="bg-close:false;">
      <div class="uk-modal-dialog uk-margin-auto-vertical">
        <button
          class="uk-modal-close-default"
          style="left: 5px; top: 15px; right: 0px"
          type="button"
          uk-close
        ></button>
        <div class="uk-modal-header">
          <h2 style="font-size: 1.1em" class="uk-modal-title header-display-1">
            New version available
          </h2>
        </div>
        <div
          style="padding: 0; margin-top: 0px; padding-bottom: 20px"
          class="uk-modal-body"
        >
          <div class="" style="padding: 15px">
            <div style="margin-top: 10px">
              <h4
                style="
                  color: rgb(13, 13, 13);
                  padding-bottom: 0;
                  margin-bottom: 0;
                "
                class="header-display-1"
              >
                <span
                  style="
                    font-size: 0.9em;
                    vertical-align: middle;
                    display: inline-block;
                  "
                >
                  <span
                    class="icon-notification"
                    style="
                      vertical-align: middle;
                      display: inline-block;
                      font-size: 1.6em;
                      color: red;
                      margin-right: 5px;
                    "
                  ></span>
                  Please upgrade your wallet software. Your current version is
                  incompatible with the network and you may get unexpected
                  errors.
                </span>
              </h4>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {};
  },
  computed: {
    blockchainVersion() {
      return this.$store.state.blockchain_settings;
    },
    walletv() {
      return this.$store.state.wallet_compatible_version;
    },
  },
  mounted() {},
  watch: {
    blockchainVersion: function (val) {
      if (val.blockchain_version != this.walletv) {
        window.UIkit.modal(this.$refs.new_version).show();
      }
    },
  },
};
</script>
<style></style>
