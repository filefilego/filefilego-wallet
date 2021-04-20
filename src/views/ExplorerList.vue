<template>
  <div>
    <div style="border-bottom: 1px solid #ddd" uk-grid>
      <div class="uk-width-expand">
        <h4
          style="color: rgb(13, 13, 13); padding-bottom: 11px"
          class="header-display-1"
        >
          Channels
        </h4>
      </div>
      <div class="uk-width-auto uk-text-right">
        <router-link to="/explorer/search/query/">
          <span
            uk-tooltip="Search"
            class="icon-search clickable"
            style="vertical-align: middle; margin-right: 13px; font-size: 1.3em"
          ></span>
        </router-link>

        <button
          @click="showCreateChannelModal()"
          type="button"
          class="uk-button uk-button-default"
          style="
            border-radius: 3px;
            width: 170px;
            line-height: 30px;
            height: 35px;
            background-color: #2c0fcd;
            color: rgb(255, 255, 255);
            border: 1px solid #180141;
            font-weight: bold;
            padding: 0px;
          "
        >
          <span class="icon-plus" style="margin-right: 10px"></span> New Channel
        </button>
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
          Loading channels
        </h4>
      </div>
    </div>

    <div v-show="!loading" style="padding-top: 20px">

      <div class="uk-text-center" v-if="channels.length == 0">
        <h4
          v-if="loadingChannelError"
          style="color: rgb(13, 13, 13); padding-bottom: 11px;"
          class="header-display-1"
        >
          Error while connecting to remote RPC peer
        </h4>

        <h4
          v-else
          style="color: rgb(13, 13, 13); padding-bottom: 11px;"
          class="header-display-1"
        >
          There are no channels registered
        </h4>

        
        <div
          style="background-color:#fff; border-radius:50%; border:2px solid #3e15ca; width:120px; height:120px; text-align:center; margin:0 auto;"
        >
        <svg style="vertical-align:middle;"
                        xmlns="http://www.w3.org/2000/svg"
                        height="110px"
                        width="110px"
                        fill="#3e15ca"
                        data-name="Layer 1"
                        viewBox="0 0 100 100"
                        x="0px"
                        y="0px"
                      >
                        <title> </title>
                        <path
                          d="M90,39a4,4,0,0,0-3.86,3H83v8.36l-3.11-3.11L66.38,52.13l-3.17,8.79L54,56.6l-8.62,4,4-8.07-4.53-5.72L51.73,40h5.41a4,4,0,1,0,0-2H50.9l-7.29,7.29-3.14-4-7.34-.17,2.89-8-4.28-4.28L39.63,21H50.14a4,4,0,1,0,0-2H38.81l-8.48,8.48L27,24.15V13H37.14a4,4,0,1,0,0-2H25V24L12.85,28.38,8,41.89l9.66,9.66,3.94-1.42L20,53.24l4.31,5.44L19,64H12.86a4,4,0,1,0,0,2h7l5.74-5.74L29,64.49l12,.27V70H30.86a4,4,0,1,0,0,2H41v4.37l5,2.35V82H37.86a4,4,0,1,0,0,2H48V79.66l6,2.81,6-2.81V87H76.14a4,4,0,1,0,0-2H62V78.72l5-2.35V71.12l4.17,4.17,13.5-4.87,4.88-13.51L85,52.36V44h1.14A4,4,0,1,0,90,39ZM61,37a2,2,0,1,1-2,2A2,2,0,0,1,61,37ZM54,18a2,2,0,1,1-2,2A2,2,0,0,1,54,18ZM41,10a2,2,0,1,1-2,2A2,2,0,0,1,41,10ZM9,67a2,2,0,1,1,2-2A2,2,0,0,1,9,67Zm18,6a2,2,0,1,1,2-2A2,2,0,0,1,27,73Zm7,12a2,2,0,1,1,2-2A2,2,0,0,1,34,85Zm46-1a2,2,0,1,1-2,2A2,2,0,0,1,80,84ZM68,53.69l9.91-3.58L74,59.7l-7.56,2.73L65,61.78ZM65,65.07v1.22l-.9-.9Zm-2.47-2.26L62.1,64l-7.83,3.32L45.06,63,54,58.81Zm-23-19.51L46,51.57l-10.33-.63-4.19-5.29.9-2.5Zm-10-.22.83,0-.26.71Zm-.94,2.41-2.95,1.06,1.34-2.68ZM31,41.12,26.91,41l-4.52-4.51,4.07-10.07,7.25,7.25ZM14.42,30l9.91-3.58L20.46,36,11,39.36Zm3.74,19.29-7.59-7.59L21,37.9l4.48,4.48-2.57,5.15Zm6.14-.1,5.78-2.08,4,5-4.78,9.6L22.39,53ZM31,62.54,35.81,53l10.84.66L42.46,62,41,62.7v.06ZM43,64.8h.31l.17-.34L53,68.94V79.79L43,75.1ZM65,75.1,55,79.79V69.19l7.07-3L65,69.12Zm2-6.81v-4l7.49-2.7,7.58,7.59L71.69,73Zm16.49-.47-7.57-7.57L80,50.18l7.25,7.25ZM90,45a2,2,0,1,1,2-2A2,2,0,0,1,90,45Z"
                        />
                      </svg>


          <!-- <svg height='120px' width='120px'  fill="#3e15ca" xmlns="http://www.w3.org/2000/svg" data-name="Layer 2" viewBox="0 0 40 40" x="0px" y="0px"><title>essential</title><path d="M20,2A18,18,0,1,0,38,20,18.021,18.021,0,0,0,20,2ZM13.293,17.293a1,1,0,0,1,1.414,0L19,21.586V9a1,1,0,0,1,2,0V21.586l4.293-4.293a1,1,0,0,1,1.414,1.414l-6,6a1,1,0,0,1-1.414,0l-6-6A1,1,0,0,1,13.293,17.293ZM31,29a1,1,0,0,1-1,1H10a1,1,0,0,1-1-1V24a1,1,0,0,1,2,0v4H29V24a1,1,0,0,1,2,0Z"></path></svg> -->
        </div>

        <div style="width:70%; margin:0 auto;">
          <p class="med-text" style="font-size:1.1em; margin-top:20px;">
            Register a channel on the network to provide censorship-resistant content.
          </p>
        </div>
      </div>

      <table v-else class="uk-table uk-table-divider">
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
            <th>Channel Name</th>
            <th style="text-align:right;">Date Created</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(ch, idx) in channels" :key="ch.Hash">
            <td style="width: 34px; vertical-align: middle">
              <div
                :style="'background-color:' + getBgColor(idx)"
                style="
                  margin: 0px auto;
                  width: 32px;
                  font-weight: 600;
                  color: white;
                  font-size: 1.2em;
                  text-align: center;
                  border-radius: 50%;
                  height: 32px;
                "
              >
                {{ ch.Name | firstletter }}
              </div>
            </td>
            <td>
              <div style="vertical-align: middle">
                <router-link
                  style="font-weight: bold"
                  :to="{ name: 'ExplorerViewNode', params: { hash: ch.Hash } }"
                  >{{ ch.Name }}</router-link
                >
                <div style="font-size: 0.9em; padding: 0; margin: 0">
                  {{ ch.Description }}
                </div>
              </div>
            </td>
            <td style="vertical-align: middle; text-align:right;">
              <div>{{ ch.Timestamp | timestamptodate }}</div>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-if="channels.length > 0" style="padding: 0" class="uk-width-1-1">
        <div
          class="uk-visible@s uk-flex uk-flex-center"
          style="padding-left: 0px"
        >
          <paginationui
            size="m-l"
            :range="pagination.range"
            :total="pagination.total"
            :last_page="pagination.last_page"
            :page="pagination.page"
            :first_page_url="pagination.first_page_url"
            :last_page_url="pagination.last_page_url"
            :next_page_url="pagination.next_page_url"
            :previous_page_url="pagination.previous_page_url"
          />
        </div>
      </div>
    </div>

    <div ref="create_channel" class="uk-modal" uk-modal="bg-close:false;">
      <div class="uk-modal-dialog uk-margin-auto-vertical">
        <button
          class="uk-modal-close-default"
          style="left: 5px; top: 15px; right: 0px"
          type="button"
          uk-close
        ></button>
        <div class="uk-modal-header">
          <h2 style="font-size: 1.1em" class="uk-modal-title header-display-1">
            Create a channel
          </h2>
        </div>
        <div style="padding: 0" class="uk-modal-body">
          <div
            v-show="!loadingBalance"
            class="uk-text-center"
            style="padding: 15px"
          >
            <svg
              xmlns:dc="http://purl.org/dc/elements/1.1/"
              xmlns:cc="http://creativecommons.org/ns#"
              xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
              xmlns:svg="http://www.w3.org/2000/svg"
              xmlns="http://www.w3.org/2000/svg"
              xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd"
              xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape"
              height="80px"
              width="80px"
              fill="#000000"
              version="1.1"
              x="0px"
              y="0px"
              viewBox="0 0 100 100"
            >
              <g transform="translate(0,-952.36218)">
                <path
                  style="font-size:medium;font-style:normal;font-variant:normal;font-weight:normal;font-stretch:normal;text-indent:0;text-align:start;text-decoration:none;line-height:normal;letter-spacing:normal;word-spacing:normal;text-transform:none;direction:ltr;block-progression:tb;writing-mode:lr-tb;text-anchor:start;baseline-shift:baseline;opacity:1;color:#000000;fill:#000000;fill-opacity:1;stroke:none;stroke-width:2.19738006999999990;marker:none;visibility:visible;display:inline;overflow:visible;enable-background:accumulate;font-family:Sans;-inkscape-font-specification:Sans"
                  d="M 50 9 C 46.443505 9 43.53125 11.91225 43.53125 15.46875 C 43.53125 18.685892 45.91376 21.329467 49 21.8125 L 49 35.40625 C 44.340533 35.722045 40.267252 38.206425 37.8125 41.875 L 22.78125 33.15625 L 22.78125 26.375 C 24.131499 26.095074 25.385647 25.280812 26.125 24 C 27.499676 21.6186 26.662258 18.53115 24.28125 17.15625 C 21.900241 15.78134 18.843426 16.61859 17.46875 19 C 16.094074 21.38141 16.900242 24.46885 19.28125 25.84375 C 19.757013 26.118478 20.269244 26.270728 20.78125 26.375 L 20.78125 33.75 A 1.0001 1.0001 0 0 0 21.28125 34.625 L 36.8125 43.65625 C 36.01966 45.295865 35.535602 47.091444 35.40625 49 L 21.8125 49 C 21.329468 45.913764 18.685895 43.53125 15.46875 43.53125 C 11.912256 43.53125 9 46.44351 9 50 C 9 53.5565 11.912256 56.46875 15.46875 56.46875 C 18.685895 56.46875 21.329468 54.086236 21.8125 51 L 35.40625 51 C 35.535602 52.908557 36.01966 54.704138 36.8125 56.34375 L 21.28125 65.34375 A 1.0001 1.0001 0 0 0 20.78125 66.21875 L 20.78125 73.625 C 20.269244 73.729269 19.757013 73.881524 19.28125 74.15625 C 16.900242 75.53115 16.094074 78.6186 17.46875 81 C 18.843426 83.3814 21.900241 84.21865 24.28125 82.84375 C 26.662258 81.46885 27.499676 78.3814 26.125 76 C 25.385647 74.719193 24.131499 73.904932 22.78125 73.625 L 22.78125 66.8125 L 37.78125 58.09375 C 40.233478 61.781675 44.325514 64.276939 49 64.59375 L 49 78.1875 C 45.91376 78.670525 43.53125 81.314099 43.53125 84.53125 C 43.53125 88.08775 46.443505 91 50 91 C 53.556495 91 56.46875 88.08775 56.46875 84.53125 C 56.46875 81.314099 54.08624 78.670525 51 78.1875 L 51 64.59375 C 55.674487 64.276939 59.766522 61.781675 62.21875 58.09375 L 77.21875 66.8125 L 77.21875 73.625 C 75.868501 73.904932 74.614353 74.719193 73.875 76 C 72.500324 78.3814 73.337742 81.46885 75.71875 82.84375 C 78.099759 84.21865 81.156574 83.3814 82.53125 81 C 83.905926 78.6186 83.099758 75.53115 80.71875 74.15625 C 80.242987 73.881524 79.730756 73.729269 79.21875 73.625 L 79.21875 66.21875 A 1.0001 1.0001 0 0 0 78.71875 65.34375 L 63.1875 56.34375 C 63.98034 54.704138 64.464398 52.908557 64.59375 51 L 78.1875 51 C 78.670532 54.086236 81.314104 56.46875 84.53125 56.46875 C 88.087744 56.46875 91 53.5565 91 50 C 91 46.44351 88.087744 43.53125 84.53125 43.53125 C 81.314104 43.53125 78.670532 45.913764 78.1875 49 L 64.59375 49 C 64.464398 47.091444 63.98034 45.295865 63.1875 43.65625 L 78.71875 34.625 A 1.0001 1.0001 0 0 0 79.21875 33.75 L 79.21875 26.375 C 79.730756 26.270728 80.242987 26.118478 80.71875 25.84375 C 83.099758 24.46885 83.905926 21.38141 82.53125 19 C 81.156574 16.61859 78.099759 15.78134 75.71875 17.15625 C 73.337742 18.53115 72.500324 21.6186 73.875 24 C 74.614353 25.280812 75.868501 26.095074 77.21875 26.375 L 77.21875 33.15625 L 62.1875 41.875 C 59.732748 38.206425 55.659468 35.722045 51 35.40625 L 51 21.8125 C 54.08624 21.329467 56.46875 18.685892 56.46875 15.46875 C 56.46875 11.91225 53.556495 9 50 9 z M 50 11 C 52.475614 11 54.46875 12.99313 54.46875 15.46875 C 54.46875 17.94436 52.475614 19.90625 50 19.90625 C 47.524386 19.90625 45.53125 17.94436 45.53125 15.46875 C 45.53125 12.99313 47.524386 11 50 11 z M 21.5625 18.5 C 22.137815 18.46035 22.739369 18.593342 23.28125 18.90625 C 24.726267 19.74067 25.209281 21.55474 24.375 23 C 23.540719 24.44526 21.726267 24.92817 20.28125 24.09375 C 18.836233 23.25933 18.353219 21.44526 19.1875 20 C 19.708926 19.096719 20.603641 18.566083 21.5625 18.5 z M 78.4375 18.5 C 79.396359 18.566083 80.291074 19.096719 80.8125 20 C 81.646781 21.44526 81.163767 23.25933 79.71875 24.09375 C 78.273733 24.92817 76.459281 24.44526 75.625 23 C 74.790719 21.55474 75.273733 19.74067 76.71875 18.90625 C 77.260631 18.593342 77.862185 18.46035 78.4375 18.5 z M 50 37.34375 C 56.999696 37.34375 62.65625 43.00029 62.65625 50 C 62.65625 56.9997 56.999696 62.65625 50 62.65625 C 43.000305 62.65625 37.34375 56.9997 37.34375 50 C 37.34375 43.00029 43.000305 37.34375 50 37.34375 z M 15.46875 45.53125 C 17.944364 45.53125 19.90625 47.52439 19.90625 50 C 19.90625 52.4756 17.944364 54.46875 15.46875 54.46875 C 12.993136 54.46875 11 52.4756 11 50 C 11 47.52439 12.993136 45.53125 15.46875 45.53125 z M 84.53125 45.53125 C 87.006864 45.53125 89 47.52439 89 50 C 89 52.4756 87.006864 54.46875 84.53125 54.46875 C 82.055635 54.46875 80.09375 52.4756 80.09375 50 C 80.09375 47.52439 82.055635 45.53125 84.53125 45.53125 z M 22 75.5 C 22.958859 75.566081 23.853574 76.096688 24.375 77 C 25.209281 78.4452 24.726267 80.25935 23.28125 81.09375 C 21.836233 81.92815 20.021781 81.4453 19.1875 80 C 18.353219 78.5548 18.836233 76.74065 20.28125 75.90625 C 20.823131 75.59335 21.424685 75.460351 22 75.5 z M 78 75.5 C 78.575315 75.460351 79.176869 75.59335 79.71875 75.90625 C 81.163767 76.74065 81.646781 78.5548 80.8125 80 C 79.978219 81.4453 78.163767 81.92815 76.71875 81.09375 C 75.273733 80.25935 74.790719 78.4452 75.625 77 C 76.146426 76.096688 77.041141 75.566081 78 75.5 z M 50 80.09375 C 52.475614 80.09375 54.46875 82.05565 54.46875 84.53125 C 54.46875 87.00685 52.475614 89 50 89 C 47.524386 89 45.53125 87.00685 45.53125 84.53125 C 45.53125 82.05565 47.524386 80.09375 50 80.09375 z "
                  transform="translate(0,952.36218)"
                />
              </g>
            </svg>
            <div style="margin-top: 15px">
              <div class="uk-margin">
                <div style="width: 100%" class="uk-inline">
                  <span
                    style="color: #000000"
                    class="uk-form-icon"
                    uk-icon="icon: server"
                  ></span>
                  <input
                    v-model="channel.name"
                    class="uk-input"
                    type="text"
                    placeholder="Channel name"
                    required="true"
                    pattern=".{5,}"
                    title="5 characters minimum"
                  />
                </div>
              </div>

              <div class="uk-margin">
                <div style="width: 100%" class="uk-inline">
                  <textarea
                    v-model="channel.description"
                    style="height: 100px"
                    class="uk-input"
                    required="true"
                    placeholder="Channel description"
                  >
                  </textarea>
                </div>
              </div>

              <div class="uk-margin uk-text-center" style="padding: 15px">
                <button
                  @click="createChannel()"
                  type="button"
                  class="uk-button uk-button-default ffg-main-button"
                  style="
                      border-radius: 3px;
                      width: 170px;
                      line-height: 30px;
                      height: 50px;
                      background-color: #2c0fcd;
                      color: rgb(255, 255, 255);
                      border: 1px solid #180141;
                      font-weight: bold;
                      padding: 0px;
                    "
                >
                  Create
                </button>
                <br />

                <span
                  v-show="channel_creation_error != ''"
                  style="color:red; margin-top:8px; display:inline-block;"
                  >{{ channel_creation_error }}</span
                >
                <br />
              </div>
            </div>
          </div>
          <div v-show="loadingBalance">
            <div style="text-align: center; padding-top:20px;">
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
              <div style="width: 70%; margin: 0 auto">
                <h4
                  style="color: rgb(13, 13, 13); padding-bottom: 11px"
                  class="header-display-1"
                >
                  Please wait
                </h4>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Pagination from "../common/pagination.js";
import axios from "axios";
import Paginationui from "../components/Pagination";
import unitUtil from "../units";
const { ipcRenderer } = window.require("electron");
const BN = require("bn.js");
var messages = require("../messages_pb");

export default {
  components: {
    Paginationui,
  },
  data() {
    return {
      lastTxHash: "",
      channel_creation_error: "",
      loadingBalance: false,
      colorIdx: 0,
      colors: [
        "#3e15ca",
        "#f0506e",
        "#32d296",
        "#ff6200",
        "#00cca6",
        "#4947ef",
        "#bdbdbd",
      ],
      loadingChannelError: false,
      error_result: false,
      pagination: {},
      channels: [],
      loading: false,
      channel: {
        name: "",
        description: "",
      },
    };
  },
  async mounted() {
    let page = this.$route.query.page || 1;
    const req = {
      originalUrl: "",
      query: {
        include_metadata: "true",
        per_page: 100,
        page: page,
      },
    };
    await this.getData(req);
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
    getBgColor(idx) {
      if (idx > this.colors.length - 1) idx = 0;
      return this.colors[idx];
    },
    openSearch() {
      this.$router.push({ name: "ExplorerSearch", query: { q: "q" } });
    },
    HexAmountToAran(val) {
      let amount = new BN(val.slice(2), 16);
      return unitUtil.fromAran(amount.toString(10), "zaran").toString(10);
    },
    aranTo(val, to = "zaran") {
      let amount = new BN(val, 10);
      return unitUtil.fromAran(amount.toString(10), to).toString(10);
    },
    async createChannel() {
      this.channel.name = this.channel.name.trim();
      this.channel_creation_error = "";
      if (this.channel.name == "") {
        this.channel_creation_error = "Channel name is required";
        return;
      }
      if (this.channel.description == "") {
        this.channel_creation_error = "Channel description is required";
        return;
      }
      let chNode = new messages.ChanNode();
      chNode.setName(this.channel.name);
      chNode.setDescription(this.channel.description);
      chNode.setNodetype(messages.ChanNodeType.CHANNEL);

      let chEnvelp = new messages.ChanNodeEnvelop();
      chEnvelp.addNodes(chNode);

      let chanPayload = new messages.TransactionDataPayload();
      chanPayload.setType(messages.TransactionDataPayloadType.CREATE_NODE);
      chanPayload.setPayload(chEnvelp.serializeBinary());

      let txData = chanPayload.serializeBinary();

      try {
        this.loadingBalance = true;
        if (!this.selected_wallet_status.unlocked) {
          this.channel_creation_error =
            "You have to select a wallet and unlock it first. Go to 'Wallet' section.";
          return;
        }
        let addr = this.addressFromKeyname(this.selected_wallet_status.address);
        const res = await axios.post(this.rpcEndpoint, {
          jsonrpc: "2.0",
          method: "account_balance",
          params: [addr],
          id: 1,
        });

        let balance = new BN(res.data.result.balance_hex.slice(2), 16);
        // let balanceFinal = unitUtil.fromAran(balance.toString(10), "zaran").toString(10);

        let regTotal = new BN(
          this.blockchain_settings.namespace_registration_fee,
          10
        );
        let txFee = new BN(
          this.blockchain_settings.node_creation_fees_guest,
          10
        );

        let requiredBalance = regTotal.add(txFee);
        if (balance.lt(requiredBalance)) {
          this.channel_creation_error =
            "* Channel creation requires " +
            unitUtil
              .fromAran(requiredBalance.toString(10), "zaran")
              .toString(10) +
            " ZARANS. You don't have enough balance";
          return;
        }

        let amountHex;
        try {
          amountHex =
            "0x" +
            unitUtil
              .toAran(
                this.blockchain_settings.namespace_registration_fee,
                "aran"
              )
              .toString(16);
        } catch (e) {
          this.channel_creation_error = e.message;
          return;
        }

        let feesHex;
        try {
          feesHex =
            "0x" +
            unitUtil
              .toAran(this.blockchain_settings.node_creation_fees_guest, "aran")
              .toString(16);
        } catch (e) {
          this.channel_creation_error = e.message;
          return;
        }

        let tx = {
          Nounce: res.data.result.next_nounce,
          Data: Buffer.from(txData).toString("hex"),
          From: addr,
          To: this.blockchain_settings.verifiers[0].address,
          Value: amountHex,
          TransactionFees: feesHex,
          Signature: "",
          Hash: "",
          Chain: "0x01",
        };

        let signedTx = ipcRenderer.sendSync("sign_transaction", tx);

        const rawRes = await axios.post(this.rpcEndpoint, {
          jsonrpc: "2.0",
          method: "transaction_sendRawTransaction",
          params: [JSON.stringify(signedTx)],
          id: 1,
        });

        if ("error" in rawRes.data) {
          this.channel_creation_error = rawRes.data.error.message;
          return;
        }

        // tx send, now wait for confirmation
        this.lastTxHash = rawRes.data.result;
        let tryies = 0;
        let foundTx = false;
        while (!foundTx) {
          if (tryies > 7) break;

          await new Promise((resolve) => {
            setTimeout(() => {
              resolve(true);
            }, 2000);
          });

          const txRec = await axios.post(this.rpcEndpoint, {
            jsonrpc: "2.0",
            method: "transaction_receipt",
            params: [this.lastTxHash],
            id: 1,
          });

          if ("result" in txRec.data) {
            window.UIkit.modal(this.$refs.create_channel).hide();
            let chanHash = ipcRenderer.sendSync(
              "sha256",
              tx.From + this.channel.name
            );
            this.$router.push("/explorer/" + chanHash);
            foundTx = true;
          }

          tryies++;
        }

        if (!foundTx) {
          this.channel_creation_error =
            "It may take a few seconds for your channel to be available. Please search for it in the channel list!";
        }
      } catch (e) {
        this.channel_creation_error =
          "Unexpected error. Make sure you are connected to internet!";
      } finally {
        this.loadingBalance = false;
      }
    },
    async getData(req) {
      const paginator = new Pagination.Pagination(req);
      const paginationParams = paginator.extractPaginationData();
      this.loading = true;
      try {
        const res = await this.getChannels(
          paginationParams.limit,
          paginationParams.offset
        );

        if (res.data.result.channels && res.data.result.channels != null) {
          this.channels = [...res.data.result.channels];
        }

        paginator.paginate({ rows: this.channels, count: res.data.result.total });
        let pl = paginator.payload();
        this.pagination = { ...pl };
      } catch (e) {
        this.loadingChannelError = true;
      } finally {
        this.loading = false;
      }
      
    },
    async getChannels(limit, offset) {
      return axios.post(this.rpcEndpoint, {
        jsonrpc: "2.0",
        method: "channel_list",
        params: [limit, offset],
        id: 1,
      });
    },
    showCreateChannelModal() {
      window.UIkit.modal(this.$refs.create_channel).show();
    },
    addressFromKeyname(name) {
      return name.split("--")[2];
    },
  },
  watch: {
    $route: async function(val) {
      if (val && val.name == "ExplorerViewList") {
        const req = {
          originalUrl: "",
          query: {
            include_metadata: "true",
            per_page: 100,
            page: val.query.page,
          },
        };
        await this.getData(req);
      }
    },
  },
};
</script>

<style>

</style>
