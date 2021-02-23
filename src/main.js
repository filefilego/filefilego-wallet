import Vue from "vue";
import axios from "axios"
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
  computed: {
    rpcEndpoint() {
      return this.$store.state.rpc_endpoint;
    }
  },
  async mounted() {
    this.$router.push("/intro");
    let settings = ipcRenderer.sendSync("load_settings");
    this.$store.dispatch("SetSettings", settings);


    try {
      const res = await axios.post(this.rpcEndpoint, {"jsonrpc": "2.0", "method": "ffg_settings", "params": [], "id": 1});
      this.$store.dispatch("SetBlockchainSettings", res.data.result);
    } catch (e) {
      if(e.name == 'NetworkError'){
        this.$store.dispatch("SetFetchBlockchainInfoError", "Error while connecting to the RPC server. Please make sure you are connected to internet.");      
      }
    }
    
  },
}).$mount("#app");

Vue.filter("firstletter", (val="") => {
  return val.charAt(0).toUpperCase()
});


Vue.filter("timestamptodate", (val) => {
  return new Date(val * 1000).toLocaleString();
});


Vue.filter("formaldatetime", (val) => {
  return new Date(val).toLocaleString();
});
