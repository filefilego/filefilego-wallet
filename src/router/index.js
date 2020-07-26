import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import WalletView from "../views/Wallet.vue";
import WalletPanel from "../views/WalletPanel.vue";
import ExplorerView from "../views/Explorer.vue";
import SettingsView from "../views/Settings.vue";
import IntroView from "../views/Intro.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
    children: [
      {
        path: "intro",
        name: "intro",
        component: IntroView,
      },
      {
        path: "wallet",
        name: "wallet",
        component: WalletView,
      },
      {
        path: "wallet/panel",
        name: "walletpanel",
        component: WalletPanel,
      },
      {
        path: "explorer",
        name: "explorer",
        component: ExplorerView,
      },
      {
        path: "settings",
        name: "settings",
        component: SettingsView,
      },
    ],
  },
];

const router = new VueRouter({
  mode: process.env.IS_ELECTRON ? "hash" : "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
