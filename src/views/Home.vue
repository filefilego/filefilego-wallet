<template>
  <div>
    <mobile-side-bar style="z-index: 2050 !important;" />
    <div clas="uk-grid-match" uk-grid>
      <div
        class="uk-width-auto uk-visible@m"
        style="background-color:#230061; max-width: 247px; width: 247px; "
      >
        <div style="max-width: 247px; width: 247px; height:100vh;">
          <div style="position:absolute; ">
            <div style="position:fixed; max-width: 247px; width: 247px; ">
              <sidebar />
            </div>
          </div>
        </div>
      </div>
      <div style="padding:0; margin:0;" class="uk-width-expand">
        <dashboard-header />
        <div style="margin-top: 56px;">
          <div
            style="margin: 0px 10px; border: 1px solid rgb(234, 234, 234); background-color: rgb(255, 255, 255);"
          >
            <div
              style="padding-left: 15px; padding-top: 15px; padding-right: 15px;"
            >
              <router-view></router-view>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import MobileSideBar from "../components/dashboard/MobileSideBar";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import Sidebar from "../components/Sidebar";
export default {
  components: {
    Sidebar,
    MobileSideBar,
    DashboardHeader,
  },
};
</script>
<style></style>
