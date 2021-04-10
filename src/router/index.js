import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import WalletView from "../views/Wallet.vue";
import WalletPanel from "../views/WalletPanel.vue";
import DownloadView from "../views/DownloadView.vue";
import ExplorerView from "../views/Explorer.vue";
import SettingsView from "../views/Settings.vue";
import IntroView from "../views/Intro.vue";
import ExplorerViewList from "../views/ExplorerList.vue";
import ExplorerViewNode from "../views/ExplorerNode.vue";
import ExplorerSearch from "../views/ExplorerSearch.vue";
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
        path: "/explorer",
        name: "explorer",
        component: ExplorerView,
        children: [
          {
            path: "/explorer",
            component: ExplorerViewList,
            name: "ExplorerViewList",
          },
          {
            path: "/explorer/:hash",
            component: ExplorerViewNode,
            name: "ExplorerViewNode",
          },
          {
            path: "/explorer/search/query/",
            component: ExplorerSearch,
            name: "ExplorerSearch",
          },
        ],
      },
      {
        path: "downloads",
        name: "DownloadView",
        component: DownloadView,
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
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
