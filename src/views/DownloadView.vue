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

    <div>
      <div class="upper">
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

        <div v-show="!loading">
          <div class="uk-text-center" v-if="contracts.length == 0">
            <h4
              style="color: rgb(13, 13, 13); padding-bottom: 11px; margin-top:20px;"
              class="header-display-1"
            >
              There are no downloads yet
            </h4>
            <div
              style="background-color:#fff; border-radius:50%; border:2px solid #3e15ca; width:120px; height:120px; text-align:center; margin:0 auto;"
            >
              <svg
                height="120px"
                width="120px"
                fill="#3e15ca"
                xmlns="http://www.w3.org/2000/svg"
                data-name="Layer 2"
                viewBox="0 0 40 40"
                x="0px"
                y="0px"
              >
                <title></title>
                <path
                  d="M20,2A18,18,0,1,0,38,20,18.021,18.021,0,0,0,20,2ZM13.293,17.293a1,1,0,0,1,1.414,0L19,21.586V9a1,1,0,0,1,2,0V21.586l4.293-4.293a1,1,0,0,1,1.414,1.414l-6,6a1,1,0,0,1-1.414,0l-6-6A1,1,0,0,1,13.293,17.293ZM31,29a1,1,0,0,1-1,1H10a1,1,0,0,1-1-1V24a1,1,0,0,1,2,0v4H29V24a1,1,0,0,1,2,0Z"
                ></path>
              </svg>
            </div>

            <div style="width:70%; margin:0 auto;">
              <p class="med-text" style="font-size:1.1em; margin-top:20px;">
                You can use the "Channels" tab to browse different channels and
                download data.
              </p>
            </div>
          </div>

          <table v-else class="uk-table uk-table-divider contracts-table uk-table-hover">
            <thead>
              <tr style="background-color: #f1f1f1; color:black; font-size:0.9em;">
                <th>#</th>
                <th>Name</th>
                <th>Size</th>
                <th>Status</th>
                <th>Down Speed</th>
                <th>ETA</th>
              </tr>
            </thead>
            <tbody>
              <tr style="color:black; font-size:0.9em;" @contextmenu.prevent="$refs.menu.open($event, { ch })" :style="isSelectedContract(ch) ? 'background-color:#e3edf9' : ''" @click="selectContract(ch)" v-for="(ch, idx) in contracts" :key="'ctx' + idx">
                <td style="width:5px;">{{idx+1}}</td>
                <td>{{ ch.nodesNames[0] }}</td>
                <td>{{ getContractSize(ch) | formatsize }}</td>
                <td>
                  <div style="width:200px; vertical-align:middle; display:inline-block; margin-top:-3px;">
                    <div style="position:relative; width:100%; background-color:#e6e6e6; height:20px;">
                      <span style="position:absolute; width: 200px; text-align:center; font-size:0.9em;">Downloading 10%</span>
                      <div style="width:87%; background-color:#5cb85c; height:20px; text-align:center;">
                      </div>
                    </div>
                  </div>
                </td>
                <td>300KB/S</td>
                <td>∞</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div v-show="selectedContract!=null" class="lower">
        <div>
          <div>
            <ul
              uk-tab
              class="uk-tab main-tab"
              style="margin-bottom: 0px; margin-bottom: 0px; margin: 0 auto;"
            >
              <li class="uk-active">
                <a href="#" class="entry nuxt-link-active" aria-expanded="false"
                  ><span class="icon-file-text"></span>
                  Files
                </a>
              </li>
              <li>
                <a
                  href="#"
                  class="entry nuxt-link-exact-active nuxt-link-active"
                  aria-expanded="true"
                  ><span class="icon-info"></span>
                  Info
                </a>
              </li>              
            </ul>

             <span @click="selectedContract = null" class="clickable" style="margin-top:-42px; margin-right:20px; color:#000; font-size:1.6em; position:absolute; right:0;">×</span>

            <ul
              class="uk-switcher"
              style=" color:#000;border-right: 1px solid #c2c2c2; border-left: 1px solid #c2c2c2; border-bottom: 1px solid #c2c2c2;  border-top: 1px solid #c2c2c2; margin-top: 0px !important;"
            >
              <li>
                <div style="overflow-y:auto; max-height: 300px; min-height: 250px;">
                  <table v-if="selectedContract != null" class="uk-table uk-table-divider contracts-table">
                    <thead>
                      <tr style="background-color: #f1f1f1;">
                        <th>Path</th>
                        <th>Size</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(f, idx) in selectedContract.fileInfos[0]" :key="'files' + idx">
                        <td>
                          <span style="font-size:1em;">{{ f.Path }}</span>
                        </td>
                        <td>{{ f.Size | formatsize }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </li>
              
              <li>
                <div style="overflow-y:auto; max-height: 300px; min-height: 250px;">
                  <div style="padding:5px;" v-if="selectedContract != null">
                      <div>Contract hash: {{selectedContract.contractHash}}</div>
                      <div>Transaction hash: {{selectedContract.txHash}}</div>
                      <div>Timestamp: {{selectedContract.timestamp | timestamptodate}}</div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <vue-context ref="menu" v-slot="{ data }">
        <li>
            <a @click.prevent="selectContract(data.ch)">Properties</a>
        </li>
        <li>
            <!-- <a href="#" @click.prevent="onClick($event.target.innerText)">Option 2</a> -->
        </li>
    </vue-context>
  </div>
</template>

<script>
import VueContext from 'vue-context';
export default {
  components: {
    VueContext
  },
  data() {
    return {
      selectedContract: null,
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
    selectContract(contract) {
      if(this.selectedContract == contract) this.selectedContract = null; else  this.selectedContract = contract;
    },
    isSelectedContract(contract) {
      return this.selectedContract == contract;
    },
    getContractSize(contract) {
      const sizes = contract.fileInfos[0].map((o) => Number(o.Size));
      return sizes.reduce((total, num) => (total += num));
    }
  },
};
</script>

<style scoped>
@import '~vue-context/dist/css/vue-context.css';
.upper,
.lower {
  left: 0;
  right: 0;
}

.upper {
  min-height: 300px;
  
  top: 0;
  /* overflow:scroll; */
}

.lower {
  /* min-height: 100px; */
  
  border-top: 1px solid #f0f0f0;
  bottom: 0;
  padding-top:10px;
  left:257px;
  background-color:white;
  position: fixed;
}

.main-tab a.entry {
  border-radius: 3px 3px 0 0;
  border: 1px solid #c2c2c2;
  border-bottom: 0 solid;
  border-color: #c2c2c2 !important;
  /* color: #000; */
  font-weight: bold;
  font-size: 0.9em;
}

.main-tab li {
  height: 34px;
  padding-right: 10px;
  padding-left: 0px;
}

.uk-active > a {
  /* color: #3e15ca; */
  /* border-color: #1e87f0; */
}

.contracts-table td, .contracts-table th {
  padding: 5px !important;
}
</style>
