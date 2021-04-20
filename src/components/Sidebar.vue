<template>
  <div
    style="width: 247px; max-width: 247px; z-index: 9999999;"
    class="main-side-container uk-text-center"
  >
    <h4
      style="margin-top:25px; padding-top: 14px; color: #fff;"
      class="header-display-1"
    >
      <div
        style="background-color:#fff; border-radius:50%; border:1px solid #3e15ca; width:50px; height:50px; text-align:center; margin:0 auto;"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          height="28px"
          width="28px"
          fill="#3e15ca"
          version="1.1"
          x="0px"
          y="0px"
          viewBox="0 0 28 26"
          xml:space="preserve"
          style="margin-top: 14px; fill: #3e15ca;enable-background:new 0 0 28 26;"
        >
          <g>
            <polygon
              points="10,7 5,0 0,7 5,7 5,14 12.995,17.998 28,3 15,3  "
            ></polygon>
            <polygon points="18,14.406 13.541,18.865 18,26  "></polygon>
          </g>
        </svg>
      </div>
      <span style="margin-top: 9px; display: inline-block;">
        filefilego
      </span>
    </h4>
    <ul class="uk-nav-default uk-nav uk-nav-parent-icon uk-nav" uk-nav>
      <router-link to="/intro">
        <li
          class="uk-text-center main-sidebar-item"
          style="font-size: 1em; padding-left: 12px; padding: 12px;"
        >
          <span style="font-size:1.7em;" class="icon-earth"></span>
          <div>Home</div>
        </li>
      </router-link>

      <router-link to="/wallet">
        <li
          class="uk-text-center main-sidebar-item"
          style="font-size: 1em; padding-left: 12px; padding: 12px;"
        >
          <span style="font-size:1.7em;" class="icon-credit-card"></span>
          <div>Wallet</div>
        </li>
      </router-link>

      <router-link to="/explorer">
        <li
          class="uk-text-center main-sidebar-item"
          style="font-size: 1em; padding-left: 12px; padding: 12px;"
        >
          <span style="font-size:1.7em;" class="icon-infinite"></span>
          <div>Explorer</div>
        </li>
      </router-link>

      <router-link to="/downloads">
        <li
          class="uk-text-center main-sidebar-item"
          style="font-size: 1em; padding-left: 12px; padding: 12px;"
        >
          <span style="font-size:1.7em;" class="icon-box-add"></span>
          <div>Downloads</div>
        </li>
      </router-link>



      <router-link to="/settings">
        <li
          class="uk-text-center main-sidebar-item"
          style="font-size: 1em; padding-left: 12px; padding: 12px;"
        >
          <span style="font-size:1.7em;" class="icon-cog"></span>
          <div>Settings</div>
        </li>
      </router-link>
    </ul>
  </div>
</template>

<script>
export default {
  computed: {
    isOffline() {
      return this.$store.state.fetch_blockchain_info_error
    },
    user() {
      return "";
    },
  },
};
</script>

<style></style>
