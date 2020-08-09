import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import UIkit from "uikit";
import "@/assets/styles/styles.scss";
import Icons from "uikit/dist/js/uikit-icons";
const { ipcRenderer } = window.require("electron");

UIkit.use(Icons);
window.UIkit = UIkit;

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
  mounted() {
    this.$router.push("/intro");
    let settings = ipcRenderer.sendSync("load_settings");
    this.$store.dispatch("SetSettings", settings);
  },
}).$mount("#app");

Vue.filter("formaldatetime", (val) => {
  return new Date(val).toLocaleString();
});
