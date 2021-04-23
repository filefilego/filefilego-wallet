<template>
  <div>
    <div style="border-bottom: 1px solid #ddd" uk-grid>
      <div class="uk-width-expand">
        <h4
          style="color: rgb(13, 13, 13); padding-bottom: 11px"
          class="header-display-1"
        >
          Downloads
        </h4>
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
          Loading downloads
        </h4>
      </div>
    </div>

    <div v-show="!loading" style="padding-top: 20px">
      <div class="uk-text-center" v-if="contracts.length == 0">
        <h4
          style="color: rgb(13, 13, 13); padding-bottom: 11px;"
          class="header-display-1"
        >
          There are no downloads yet
        </h4>
        <div
          style="background-color:#fff; border-radius:50%; border:2px solid #3e15ca; width:120px; height:120px; text-align:center; margin:0 auto;"
        >
          <svg height='120px' width='120px'  fill="#3e15ca" xmlns="http://www.w3.org/2000/svg" data-name="Layer 2" viewBox="0 0 40 40" x="0px" y="0px"><title>essential</title><path d="M20,2A18,18,0,1,0,38,20,18.021,18.021,0,0,0,20,2ZM13.293,17.293a1,1,0,0,1,1.414,0L19,21.586V9a1,1,0,0,1,2,0V21.586l4.293-4.293a1,1,0,0,1,1.414,1.414l-6,6a1,1,0,0,1-1.414,0l-6-6A1,1,0,0,1,13.293,17.293ZM31,29a1,1,0,0,1-1,1H10a1,1,0,0,1-1-1V24a1,1,0,0,1,2,0v4H29V24a1,1,0,0,1,2,0Z"></path></svg>
        </div>

        <div style="width:70%; margin:0 auto;">
          <p class="med-text" style="font-size:1.1em; margin-top:20px;">
            You can use the "Explorer" tab to browse different channels and download data.
          </p>
        </div>
      </div>

      <table v-else class="uk-table uk-table-divider">
        <thead>
          <tr>
            <th style="text-align: left;">Hash</th>
            <th style="text-align: left;">Contract hash</th>
            <th style="text-align:right;">Date Created</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(ch, idx) in contracts" :key="'ctx' + idx">
            <td class="uk-text-truncate">
              <div>
                {{ ch.txHash }}
              </div>
            </td>
            <td class="uk-text-truncate">
              <div>
                {{ ch.contractHash}}
              </div>
            </td>
            <td class="uk-text-truncate">
              <div>{{ ch.timestamp }}</div>
            </td>
          </tr>
        </tbody>
      </table>

    </div>
  </div>
</template>

<script>

export default {
  components: {
  },
  data() {
    return {
      downloads: [],
      loading: false,
    };
  },
  async mounted() {
  },
  computed: {
    contracts() {
      return this.$store.state.contracts;
    },
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
    pathsToTree() {
      let paths = [];
      let result = [];
      let level = {result};

      paths.forEach(path => {
        path.split('/').reduce((r, name) => {
          if(!r[name]) {
            r[name] = {result: []};
            r.result.push({name, children: r[name].result})
          }
          return r[name];
        }, level)
      })
      return result;
    }
  },
};
</script>

<style>

</style>
