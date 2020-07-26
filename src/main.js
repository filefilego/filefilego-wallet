import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import UIkit from "uikit";
import "@/assets/styles/styles.scss";
import Icons from "uikit/dist/js/uikit-icons";

UIkit.use(Icons);
window.UIkit = UIkit;

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
  mounted() {
    this.$router.push("/intro");
  },
}).$mount("#app");
