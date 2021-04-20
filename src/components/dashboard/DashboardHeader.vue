<template>
  <div class="dashboard-header" style="-webkit-app-region:drag">
    <span
      @click="toggleMobileSidebar"
      class="uk-hidden@m"
      style="z-index:20; color: #637382; padding-left: 15px; padding-top: 13px; float: left;"
    >
      <svg
        fill="#637282"
        width="20"
        height="20"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
        data-svg="navbar-toggle-icon"
      >
        <rect y="9" width="20" height="2"></rect>
        <rect y="3" width="20" height="2"></rect>
        <rect y="15" width="20" height="2"></rect>
      </svg>
    </span>


    <span
      @click="goBack"
      v-show="enable_back"
      class="clickable icon-arrow-left2"
      style="z-index: 99999999; display:inline-block; margin-top:10px; margin-left:10px; cursor: pointer; border: 1px solid; border-radius: 50%; padding: 5px; vertical-align: middle; font-size: 1.3em;"
      title=""
      aria-expanded="false"
    ></span>

    <span
      v-show="isOffline"
      style="width:12px; height:12px; border-radius:50%; background-color:red; display:inline-block; margin-top:10px; margin-left:10px; padding: 5px; vertical-align: middle; font-size:1em; color:red;"
      class=" clickable"
    ></span><span v-show="isOffline" style=" display:inline-block; margin-top:7px; padding: 5px; vertical-align: middle; color:red;">offline</span>

    <div
      style="z-index: 99999999; position: fixed; right: 4px; top: 2px; margin-right: 8px; margin-top: 0px; "
    >
      <div style="margin-left: 5px; margin-right: 5px;">
        <span
          class="clickable"
          @click="minimizeApp()"
          style="color:#000; font-size:1.6em; margin-right:25px;"
          >-</span
        >
        <span
          class="clickable"
          @click="maximizeApp()"
          style="color:#000; font-size:1.6em; margin-right:25px;"
          >□</span
        >
        <span
          class="clickable"
          @click="closeApp()"
          style="color:#000; font-size:1.6em;"
          >×</span
        >
      </div>
    </div>
  </div>
</template>

<script>
const { ipcRenderer } = window.require("electron");
export default {
  data() {
    return {
      channel_view: false,
      enable_back: false,
    };
  },
  computed: {
    isOffline() {
      return this.$store.state.fetch_blockchain_info_error
    },
    entryMode() {
      return this.$store.state.entryMode;
    },
    user() {
      return "user";
    },
    loading_wallet() {
      return this.$store.state.loading_wallet;
    },
    selected_wallet_status() {
      return this.$store.state.selected_wallet_status;
    },
  },
  watch: {
    $route: function(val) {
      if (this.entryMode) {
        this.$store.dispatch("SetEntryMode", false);
        return;
      }

      if (
        (val && val.name == "ExplorerViewNode") ||
        val.name == "ExplorerSearch" ||
        val.name == "ExplorerViewList"
      ) {
        this.channel_view = true;
      } else {
        this.channel_view = false;
      }

      if (
        (val && val.name == "ExplorerViewNode") ||
        val.name == "ExplorerSearch"
      ) {
        this.enable_back = true;
      } else {
        this.enable_back = false;
      }
    },
  },
  methods: {
    goBack() {
      if (this.entryMode) {
        this.$store.dispatch("SetEntryMode", false);
        return;
      }

      this.$router.go(-1);
    },
    closeApp() {
      ipcRenderer.send("close-me");
    },
    maximizeApp() {
      ipcRenderer.send("maximize");
    },
    minimizeApp() {
      ipcRenderer.send("minimize");
    },
    toggleMobileSidebar() {},
  },
};
</script>

<style>
.dashboard-header {
  border-bottom: 1px solid #f0f0f0;
  height: 56px;
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 99;
  background-color: #fff;
}
</style>
