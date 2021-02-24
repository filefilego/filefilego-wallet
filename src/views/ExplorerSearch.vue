<template>
  <div>
    <div style="border-bottom: 1px solid #ddd" uk-grid>
      <div class="uk-width-expand">
        <h4
          style="color: rgb(13, 13, 13); padding-bottom: 11px"
          class="header-display-1"
        >
          Search
        </h4>
      </div>
      <div class="uk-width-auto uk-text-right">
        <!-- placeholder -->
      </div>
    </div>
    <div>
      <div style="padding-top:20px;" class="uk-text-center">
        <div class="">
          <label
            ><input
              v-model="searchType"
              class="uk-radio"
              type="radio"
              name="radio2"
              value="1"
              checked
            />
            Match all words
          </label>
          <label
            ><input
              v-model="searchType"
              class="uk-radio"
              type="radio"
              name="radio2"
              value="2"
            />
            Match any word
          </label>
          <label
            ><input
              v-model="searchType"
              class="uk-radio"
              type="radio"
              name="radio2"
              value="3"
            />
            Exact match
          </label>
        </div>

        <div style="width:60%;" class="uk-search uk-search-default">
          <span uk-search-icon></span>
          <input
            id="searchinpt"
            @keypress.enter="submit"
            v-model="query"
            class="uk-search-input"
            type="search"
            placeholder="Search..."
          />
        </div>
        <button
          @click="submit"
          style="background-color:#2c0fcd; color:white;"
          class="uk-button uk-button-default"
        >
          Search
        </button>
      </div>
    </div>

    <div
      v-show="nodes.length == 0 && !loading"
      class="uk-text-center"
      style="padding-top:20px;"
    >
      <div
        style="background-color:#fff; border-radius:50%; border:2px solid #3e15ca; width:120px; height:120px; text-align:center; margin:0 auto;"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          height="70px"
          width="70px"
          fill="#3e15ca"
          version="1.1"
          x="0px"
          y="0px"
          viewBox="0 0 28 26"
          xml:space="preserve"
          style="margin-top: 30px; fill: #3e15ca;enable-background:new 0 0 28 26;"
        >
          <g>
            <polygon
              points="10,7 5,0 0,7 5,7 5,14 12.995,17.998 28,3 15,3  "
            ></polygon>
            <polygon points="18,14.406 13.541,18.865 18,26  "></polygon>
          </g>
        </svg>
      </div>

      <div style="width:70%; margin:0 auto;">
        <p
          v-if="submited"
          class="med-text"
          style="color:black; font-weight:bold; font-size:1.1em; margin-top:20px;"
        >
          <span class="icon-notification"></span> No results found for your
          search query. Please try something else
        </p>
        <p
          v-else
          class="med-text"
          style="color:black; font-weight:bold; font-size:1.1em; margin-top:20px;"
        >
          Your search results will be available here
        </p>
      </div>
    </div>

    <div v-show="loading" class="uk-text-center" style="padding-top: 50px">
      <div style="text-align: center">
        <div class="lds-roller">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>

      <div style="width: 70%; margin: 0 auto">
        <h4
          style="color: rgb(13, 13, 13); padding-bottom: 11px"
          class="header-display-1"
        >
          Searching now
        </h4>
      </div>
    </div>

    <div v-show="!loading && nodes.length > 0" style="padding-top: 20px">
      <table class="uk-table uk-table-divider">
        <thead>
          <tr>
            <th>
              <div
                style="
                  margin: 0px auto;
                  width: 24px;
                  font-weight: 600;
                  color: white;
                  font-size: 1.2em;
                  text-align: center;
                  border-radius: 50%;
                  height: 24px;
                  background-color: #bdbdbd;
                "
              ></div>
            </th>
            <th>Name</th>
            <th style="text-align:right;">Date Created</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="ch in nodes" :key="ch.Hash">
            <td style="width: 34px; vertical-align: middle">
              <div
                style="
                  margin: 0px auto;
                  width: 32px;
                  font-weight: 600;
                  color: white;
                  font-size: 1.2em;
                  text-align: center;
                  border-radius: 50%;
                  height: 32px;
                  background-color: #3e15ca;
                "
              >
                {{ ch.Name | firstletter }}
              </div>
            </td>
            <td>
              <div style="vertical-align: middle">
                <router-link
                  style="font-weight: bold"
                  :to="'/explorer/' + ch.Hash"
                  >{{ ch.Name }}</router-link
                >
                <!-- <div style="font-size: 0.9em; padding: 0; margin: 0">
                  {{ ch.Description }}
                </div> -->
              </div>
            </td>
            <td style="vertical-align: middle; text-align:right;">
              <div>{{ ch.Timestamp | timestamptodate }}</div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      searchType: 1,
      query: "",
      nodes: [],
      loading: false,
      submited: false,
    };
  },
  async mounted() {
    let q = this.$route.query.query || -1;
    if (q == -1) {
      this.query = "";
      this.submited = false;
      this.nodes = [];
    } else {
      this.query = q;
      this.search();
    }
    document.getElementById("searchinpt").focus();
  },
  computed: {
    selected_wallet_status() {
      return this.$store.state.selected_wallet_status;
    },
    rpcEndpoint() {
      return this.$store.state.rpc_endpoint;
    },
    blockchain_settings() {
      return this.$store.state.blockchain_settings;
    },
  },
  methods: {
    submit() {
      this.$router.push("/explorer/search/query/?query=" + this.query);
    },
    async search() {
      this.loading = true;
      const rawRes = await axios.post(this.rpcEndpoint, {
        jsonrpc: "2.0",
        method: "channel_search",
        params: [this.query, parseInt(this.searchType), 100],
        id: 1,
      });

      if (rawRes.data.result) {
        this.nodes = [...rawRes.data.result];
        this.submited = false;
      } else {
        this.submited = true;
        this.nodes = [];
      }
      this.loading = false;
    },
  },
  watch: {
    $route: async function(val) {
      if (val && val.name == "ExplorerSearch") {
        let q = this.$route.query.query || -1;
        if (q == -1) {
          this.query = "";
          this.submited = false;
          this.nodes = [];
        } else {
          this.query = q;
          this.search();
        }
      }
    },
  },
};
</script>

<style>
.uk-input,
.uk-search-input {
  border: 1px solid #e7e7e7 !important;
}
</style>
