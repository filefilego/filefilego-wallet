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
      v-show="loading_wallet"
      class="icon-spinner7 ffg-spinner"
      style="font-size:2em; vertical-align:middle; margin-right:10px; color:#3e15ca; margin-top:12px; margin-left:10px;"
    ></span>

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
  computed: {
    user() {
      return "user";
    },
    loading_wallet() {
      return this.$store.state.loading_wallet;
    },
  },
  methods: {
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
