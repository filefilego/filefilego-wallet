<template>
  <div
    ref="mobile_side"
    class="mobile-side main-side-bar-container"
    style="display:none; position: fixed; top: 0; bottom: 0; left: 0; z-index: 2050 !important;"
  >
    <div style="padding:0px;" class="uk-offcanvas-bar">
      <span
        @click="hideCanvas"
        uk-close
        style="position: absolute; z-index: 1000; top: 20px; right: 20px; padding: 5px;"
        ><svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          xmlns="http://www.w3.org/2000/svg"
          data-svg="close-icon"
        >
          <line
            fill="none"
            stroke="#000"
            stroke-width="1.1"
            x1="1"
            y1="1"
            x2="13"
            y2="13"
          ></line>
          <line
            fill="none"
            stroke="#000"
            stroke-width="1.1"
            x1="13"
            y1="1"
            x2="1"
            y2="13"
          ></line></svg
      ></span>

      <div
        class="uk-text-center"
        style="padding-top: 10px; padding-bottom: 10px;"
      >
        <h4 style="padding-top: 14px; color: #fff;" class="header-display-1">
          filefilego
        </h4>
      </div>

      <ul
        class="main-side-container uk-nav-default uk-nav uk-nav-parent-icon uk-nav"
        uk-nav
      >
        <router-link @click.native="hideCanvas" to="/home/dashboard">
          <li
            class="uk-text-center main-sidebar-item"
            style="font-size: 1em; padding-left: 12px; padding: 12px;"
          >
            <span style="font-size:1.7em;" class="icon-home3"></span>
            <div>Dashboard</div>
          </li>
        </router-link>
        <router-link
          @click.native="hideCanvas"
          v-show="user.role == 'user'"
          to="/home/deals"
        >
          <li
            class="uk-text-center main-sidebar-item"
            style="font-size: 1em; padding-left: 12px; padding: 12px;"
          >
            <span style="font-size:1.7em;" class="icon-calendar"></span>
            <div>Deals</div>
          </li>
        </router-link>
        <router-link
          @click.native="hideCanvas"
          v-show="user.role == 'user'"
          to="/home/receipts"
        >
          <li
            class="uk-text-center main-sidebar-item"
            style="font-size: 1em; padding-left: 12px; padding: 12px;"
          >
            <span style="font-size:1.7em;" class="icon-newspaper"></span>
            <div>Receipts</div>
          </li>
        </router-link>
        <router-link
          @click.native="hideCanvas"
          v-show="user.role == 'user'"
          to="/home/wallet"
        >
          <li
            class="uk-text-center main-sidebar-item"
            style="font-size: 1em; padding-left: 12px; padding: 12px;"
          >
            <span style="font-size:1.7em;" class="icon-credit-card"></span>
            <div>Wallet</div>
          </li>
        </router-link>
        <router-link
          @click.native="hideCanvas"
          v-show="user.role == 'admin'"
          to="/home/users"
        >
          <li
            class="uk-text-center main-sidebar-item"
            style="font-size: 1em; padding-left: 12px; padding: 12px;"
          >
            <span style="font-size:1.7em;" class="icon-share2"></span>
            <div>Users</div>
          </li>
        </router-link>
        <router-link
          @click.native="hideCanvas"
          v-show="user.role == 'admin'"
          to="/home/clients"
        >
          <li
            class="uk-text-center main-sidebar-item"
            style="font-size: 1em; padding-left: 12px; padding: 12px;"
          >
            <span style="font-size:1.7em;" class="icon-tree"></span>
            <div>Clients</div>
          </li>
        </router-link>
        <router-link
          @click.native="hideCanvas"
          v-show="user.role == 'admin'"
          to="/home/faq"
        >
          <li
            class="uk-text-center main-sidebar-item"
            style="font-size: 1em; padding-left: 12px; padding: 12px;"
          >
            <span style="font-size:1.7em;" class="icon-question"></span>
            <div>FAQ</div>
          </li>
        </router-link>
        <router-link @click.native="hideCanvas" to="/home/settings">
          <li
            class="uk-text-center main-sidebar-item"
            style="font-size: 1em; padding-left: 12px; padding: 12px;"
          >
            <span style="font-size:1.7em;" class="icon-user-tie"></span>
            <div>Profile</div>
          </li>
        </router-link>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  computed: {
    user() {
      return "user";
    },
  },
  methods: {
    hideCanvas() {
      this.hideMobileSideBar();
    },
    toggleMobileSideBar() {
      const inner = document.getElementsByClassName("mobile-side");
      Array.from(inner).forEach(function(el) {
        el.style.display = "block";
      });
    },
    hideMobileSideBar() {
      const inner = document.getElementsByClassName("mobile-side");
      Array.from(inner).forEach(function(el) {
        el.style.display = "none";
      });
    },
  },
  mounted() {},
  beforeDestroy() {
    this.$refs.mobile_side.parentNode.removeChild(this.$refs.mobile_side);
  },
};
</script>

<style scoped>
.uk-offcanvas-bar {
  left: 0 !important;
  position: absolute;
  top: 0;
  bottom: 0;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  width: 270px;
  background: #230061;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}
</style>
