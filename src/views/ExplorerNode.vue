<template>
  <div>
    <div v-show="entryMode">
      <div style="border-bottom: 1px solid #ddd" uk-grid>
        <div class="uk-width-expand">
          <h4
            style="color: rgb(13, 13, 13); padding-bottom: 11px"
            class="header-display-1"
          >
            Create new entry
          </h4>
        </div>
        <div class="uk-width-auto">
          <div>
            <div>
              <!-- <span @click="closeEntryModal" uk-tooltip="Close new entry" class="clickable icon-cancel-circle" style=" z-index: 99999999; display:inline-block;  cursor: pointer;  padding: 5px; vertical-align: middle; font-size: 1.6em;" ></span> -->
            </div>
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

      <div v-show="!loadingBalance" style="padding-top:20px;">
        <div style="width: 100%" class="uk-inline">
          <span style="color: #000000" class="uk-form-icon icon-quill"></span>
          <input
            :disabled="nextChecked"
            v-model="entry_name"
            class="uk-input"
            type="text"
            placeholder="Name"
            required="true"
            pattern=".{5,}"
            title="5 characters minimum"
          />
        </div>

        <div style="padding-top:20px;">
          <quill-editor
            :disabled="nextChecked"
            ref="myQuillEditor"
            :options="toolbarOptions"
            v-model="entry_content"
          />
        </div>
        


        <new-button v-if="nextChecked"/>

        <div v-if="nextChecked" style="padding-top:10px;  max-height:500px; overflow-y:auto;">
          <div
            v-for="(u, idx) in upload_data"
            :key="'up' + idx"
            style="border-top:1px solid #ededed; padding:0px; margin:0px; padding-bottom:8px;"
            uk-grid
          >
            <div class="uk-width-expand" style="vertical-align:middle;">
              <div style="padding:10px;" uk-grid>
                <div class="uk-width-1-1" style="padding:0px; margin:0px;">
                  <div
                    style="color:#3f383f;  -webkit-box-orient: vertical; overflow: hidden; text-overflow: ellipsis; white-space: normal; -webkit-line-clamp: 1; display: -webkit-box; color: #2c3e50; margin-bottom: 0; vertical-align: middle;"
                  >
                    <span
                      v-if="u.type == 'dir'"
                      style="color:#818284; font-size:1.3em; vertical-align:middle;"
                      class="icon-folder"
                    ></span>
                    <img
                      v-if="u.type == 'file'"
                      :src="nodeVector(u.name)"
                      style="width:24px; height:24px; font-size: 32px; vertical-align: middle; "
                    />
                    <span
                      v-if="!u.canceled && u.error == ''"
                      style="margin-left:5px; font-weight:bold; vertical-align:middle;"
                      >{{ u.name }}</span
                    >
                    <span
                      v-if="u.canceled || u.error != ''"
                      style="margin-left:5px; font-weight:bold; vertical-align:middle;"
                      ><strike style="color:red;">{{ u.name }}</strike> <span v-if="u.error != ''">({{u.error}})</span></span
                    >
                  </div>
                </div>
                <div class="uk-width-expand" style="padding:0px; margin:0px;">
                  <span style="color:#7e7e7e; font-weight:bold;">{{u.size | formatsize}}</span>
                </div>
                <div
                  class="uk-width-auto"
                  style="padding:0px; margin:0px; vertical-align:middle;"
                >
                  <span
                    style="color:#7e7e7e; display:inline-block; font-weight:bold;"
                    >{{ getProgress(u) }}%</span
                  >
                </div>
                <div class="uk-width-1-1" style="padding:0px; margin:0px;">
                  <div style="height:8px; background-color:#e6e6e6;">
                    <div
                      :style="'width: ' +getProgress(u) + '%;'"
                      style="background-color:#5cb85c; height:8px;"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
            <div class="uk-width-auto">
              <div style="padding:5px;">
                <span
                  uk-tooltip="Remove"
                  v-if="u.canceled || u.size == u.progress"
                  @click="removeItemFromUpload(idx)"
                  style="font-size:1.4em; margin-top:26px; display:inline-block;"
                  class="clickable icon-bin2"
                ></span>
                <span
                  uk-tooltip="Cancel"
                  v-else
                  @click="cancelItemFromUpload(idx)"
                  style="font-size:1.4em; margin-top:26px; display:inline-block;"
                  class="clickable icon-cancel-circle"
                ></span>
              
              </div>
            </div>
          </div>
        </div>

          <!-- <span>confilicts</span>
          <ul>
            <li v-for="(u, idx) in name_conflicts" :key="'up'+idx">
              {{u.name}} <span @click="removeItemFromConflicts(idx)"> x </span>
            </li>
          </ul>  -->

        <div class="uk-margin uk-text-center" style="padding: 15px">
          <button
            v-if="!nextChecked"
            @click="nextUploadItemsPage"
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

          <span  class="icon-upload3"></span>
            Next (Add files)
          </button>




          <a
            v-if="nextChecked"
            @click.prevent="backUploadItemsPage"
            style="
                      display:inline-block;
                      padding-right:20px;
                      
                      line-height: 30px;
                      height: 50px;
                      color: #0963f3;
                      font-weight: bold;
                    "
          >
          <span style="color:#0963f3;" class="icon-arrow-left2"></span>
            Back
          </a>



          <button
            v-if="nextChecked"
            @click="startUpload"
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

    <div
      v-if="!entryMode && (node.node.NodeType == 3 || node.node.NodeType == 4)"
    >
      <div style="border-bottom: 1px solid #ddd" uk-grid>
        <div class="uk-width-expand">
          <h4
            v-if="node.node"
            style="color: rgb(13, 13, 13); padding-bottom: 11px"
            class="header-display-1"
          >
            {{ node.node.Name }}
          </h4>
        </div>
        <div class="uk-width-auto">
          <div>
            <div>
              <span
                class="clickable icon-plus"
                style="color: #3e15ca; z-index: 99999999; display:inline-block;  cursor: pointer; border: 2px solid; border-radius: 50%; padding: 5px; vertical-align: middle; font-size: 1.1em;"
              ></span>
              <div
                id="new_dropdown"
                style="background-color:white; border:1px solid #e3e3e3; "
                uk-dropdown="mode: click; delay-hide:0;"
              >
                <ul
                  style="padding:0px; margin:0px;"
                  class="chan-action-ul uk-list"
                >
                  <li @click="openSubchannelModal" class="clickable">
                    <span class="icon-tree"></span> New sub-channel
                  </li>
                  <li @click="openEntryModal" class="clickable">
                    <span class="icon-stack"></span> New entry
                  </li>
                  <li @click="openNewFolderModal" class="clickable">
                    <span class="icon-folder"></span> New folder
                  </li>
                  <li class="clickable">
                    <span class="icon-upload"></span> Upload
                  </li>
                </ul>
              </div>
            </div>
          </div>
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
            Loading data
          </h4>
        </div>
      </div>

      <div v-show="!loading" style="padding-top: 20px">
        <div style="border: 1px solid #e3e3e3; border-radius: 2px">
          <div style="padding: 0px; margin: 0px">
            <div style="background-color: #f0f0f0; margin: 0; padding: 0">
              <h4
                style="color: rgb(13, 13, 13); padding: 7px; margin: 0px"
                class="header-display-1"
              >
                Sub Channels
              </h4>
            </div>
            <div style="margin: 0px; padding: 0px">
              <table class="uk-table uk-table-divider">
                <tbody>
                  <tr v-for="(ch, idx) in subchans" :key="ch.Hash">
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
                          :to="{
                            name: 'ExplorerViewNode',
                            params: { hash: ch.Hash },
                          }"
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
                  <tr v-if="subchans.length == 0">
                    <div style="text-align:center; padding-top:15px;">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        xmlns:xlink="http://www.w3.org/1999/xlink"
                        height="150px"
                        width="150px"
                        fill="#000000"
                        version="1.1"
                        x="0px"
                        y="0px"
                        viewBox="0 0 100 100"
                        style="enable-background:new 0 0 100 100;"
                        xml:space="preserve"
                      >
                        <g>
                          <path
                            d="M89.8388824,79.4838867L81.0312653,65.921875c-0.5922852-0.9130859-1.5063477-1.5405273-2.5737305-1.7666016   c-0.5527954-0.1171265-1.1108398-0.1140137-1.6478882-0.0063477l-2.5952759-3.996582   c-0.0290527-0.0446777-0.0726929-0.0709839-0.1072388-0.109375c2.8321533-2.6055298,4.798584-5.9986572,5.617981-9.8330078   c1.0458984-4.8925781,0.1186523-9.8989258-2.609375-14.09375c-0.8115234-1.2587891-1.8022461-2.4379883-2.9418945-3.5024414   c-2.9194336-2.746582-6.7441406-4.5029297-10.7670898-4.9448242c-4.1723633-0.4726563-8.2626953,0.4375-11.7880859,2.6035156   c-0.1738281,0.0961914-0.3276367,0.1875-0.4887695,0.2910156c-0.0317383,0.0200195-0.0620117,0.0419922-0.0908203,0.0654297   c-2.2641602,1.4697266-4.1450195,3.3769531-5.5634766,5.6289063c-0.1074219,0.152832-0.1962891,0.300293-0.2988281,0.4716797   c-1.4594727,2.4516602-2.3496094,5.253418-2.5742188,8.1020508c-0.2211914,2.7983398,0.1977539,5.6435547,1.2075195,8.21875   c0.4619141,1.2163086,1.0527344,2.3759766,1.7529297,3.440918c3.59375,5.5395508,9.6381836,8.5585938,15.8022461,8.5585938   c2.4810791,0,4.9789429-0.4998169,7.3463135-1.510498c0.0206299,0.0455933,0.0264893,0.0946655,0.0545654,0.1379395   l2.5933228,3.9934082c-0.3200073,0.4481812-0.5516357,0.9577026-0.6690063,1.5119629   c-0.2246094,1.0615234-0.0205078,2.1469727,0.5732422,3.0522461l8.8076172,13.5712891   c0.1914063,0.2949219,0.512207,0.4555664,0.8398438,0.4555664c0.1860352,0,0.3745117-0.0517578,0.5419922-0.1601563   l8.0898438-5.2333984c0.2231445-0.1445313,0.3793945-0.371582,0.4350586-0.6308594   C90.0332184,79.9775391,89.9834137,79.706543,89.8388824,79.4838867z M47.2373199,55.3974609   c-0.6235352-0.9482422-1.1474609-1.9765625-1.5610352-3.0673828c-0.9038086-2.3046875-1.2773438-4.8432617-1.0795898-7.3413086   c0.2001953-2.5444336,0.9951172-5.046875,2.3051758-7.2470703c0.0688477-0.1152344,0.1318359-0.222168,0.2373047-0.375   c1.3017578-2.0644531,2.9975586-3.7783203,5.0405273-5.09375c0.0288086-0.0185547,0.0566406-0.0385742,0.0830078-0.0600586   c0.1069336-0.0664063,0.215332-0.1303711,0.3637695-0.2133789c3.1796875-1.9526367,6.8330078-2.7631836,10.559082-2.3427734   c3.597168,0.3950195,7.0126953,1.9624023,9.6206055,4.4165039c1.0219727,0.9541016,1.90625,2.0063477,2.6308594,3.1303711   c2.4379883,3.7485352,3.2661133,8.2192383,2.3325195,12.5883789c-0.9365234,4.3798828-3.5297852,8.1328125-7.3027344,10.5673828   c-0.0004883,0.0004883-0.0009766,0.0004883-0.0009766,0.0004883   C62.6938629,65.3896484,52.2758942,63.1635742,47.2373199,55.3974609z M71.5517731,62.0395508   c0.3561401-0.2297974,0.6888428-0.4847412,1.0258789-0.7351074l2.395752,3.689209l-2.0916138,1.3488159l-2.3856812-3.673645   C70.8517609,62.4701538,71.2049713,62.263916,71.5517731,62.0395508z M81.2055817,83.8798828l-8.2666016-12.737793   c-0.3017578-0.4599609-0.4052734-1.0087891-0.2919922-1.5449219c0.1147461-0.5400391,0.4350586-1.0039063,0.9487305-1.3330078   l2.8833008-1.8613281c0.3408203-0.222168,0.7304688-0.3369141,1.128418-0.3369141   c0.1445313,0,0.2905273,0.0151367,0.4355469,0.0458984c0.5439453,0.1152344,1.0092773,0.4345703,1.3120117,0.9008789   l8.2607422,12.7202148L81.2055817,83.8798828z"
                          />
                          <path
                            d="M75.9936676,49.425293c0.8364258-3.9023438,0.0942383-7.8999023-2.0864258-11.2524414   c-0.640625-0.9951172-1.4321289-1.9355469-2.3496094-2.7919922c-0.7832031-0.7363281-1.6503906-1.3886719-2.5786133-1.9379883   c-1.8120117-1.0727539-3.8876953-1.7626953-6.0004883-1.9946289c-3.3173828-0.3764648-6.5683594,0.3481445-9.3959961,2.0839844   l-0.4169922,0.2539063c-1.8193359,1.1723633-3.3300781,2.699707-4.4882813,4.5361328l-0.2216797,0.3491211   c-1.1630859,1.9545898-1.8725586,4.1879883-2.0517578,6.4594727c-0.1757813,2.2280273,0.1621094,4.5043945,0.9731445,6.5727539   c0.3642578,0.9594727,0.8325195,1.8769531,1.3881836,2.7216797c1.2705078,1.9594727,2.925293,3.5507813,4.9179688,4.7304688   c2.378418,1.4086914,5.0180664,2.1103516,7.652832,2.1103516c2.8291016,0,5.652832-0.8085938,8.1435547-2.4199219   C72.8437653,56.675293,75.1572418,53.3295898,75.9936676,49.425293z M68.3945465,57.1660156   c-4.1704102,2.6972656-9.4160156,2.8012695-13.6928711,0.269043c-1.7246094-1.0214844-3.1572266-2.3999023-4.262207-4.1030273   c-0.4790039-0.7285156-0.8803711-1.515625-1.1967773-2.3486328c-0.7050781-1.7978516-0.9970703-3.7670898-0.8447266-5.6953125   c0.1547852-1.9672852,0.769043-3.9013672,1.7607422-5.5683594l0.2080078-0.3276367   c1.003418-1.5908203,2.3095703-2.9116211,3.8598633-3.9106445l0.3989258-0.2426758   c2.0273438-1.2446289,4.3032227-1.8862305,6.6572266-1.8862305c0.4887695,0,0.980957,0.027832,1.4746094,0.0834961   c1.8349609,0.2011719,3.6337891,0.7988281,5.2026367,1.7275391c0.8017578,0.4746094,1.5512695,1.0380859,2.2299805,1.6767578   c0.7993164,0.7460938,1.484375,1.559082,2.0380859,2.4194336c1.8911133,2.9067383,2.5336914,6.3681641,1.8095703,9.746582   C73.3134918,52.387207,71.3095856,55.284668,68.3945465,57.1660156z"
                          />
                          <path
                            d="M69.2505035,66.4238281H67.386734H12.0000162V24.6713867h68.8330078v40.112793c0,0.5522461,0.4477539,1,1,1   s1-0.4477539,1-1v-41.112793v-8.9331055c0-0.5522461-0.4477539-1-1-1H11.0000162c-0.5522461,0-1,0.4477539-1,1v8.9331055   v43.7524414c0,0.5522461,0.4477539,1,1,1H67.386734h1.8637695c0.5522461,0,1-0.4477539,1-1   S69.8027496,66.4238281,69.2505035,66.4238281z M80.8330231,15.7382813v6.9331055H12.0000162v-6.9331055H80.8330231z"
                          />
                          <path
                            d="M17.0586109,21.8574219c1.4677734,0,2.6621094-1.190918,2.6621094-2.6552734s-1.1943359-2.6557617-2.6621094-2.6557617   s-2.6621103,1.1914063-2.6621103,2.6557617S15.5908365,21.8574219,17.0586109,21.8574219z M17.0586109,18.5463867   c0.3652344,0,0.6621094,0.2939453,0.6621094,0.6557617c0,0.3613281-0.296875,0.6552734-0.6621094,0.6552734   s-0.6621094-0.2939453-0.6621094-0.6552734C16.3965015,18.840332,16.6933765,18.5463867,17.0586109,18.5463867z"
                          />
                          <path
                            d="M23.5527515,21.8574219c1.4677734,0,2.6621094-1.190918,2.6621094-2.6552734s-1.1943359-2.6557617-2.6621094-2.6557617   s-2.6621094,1.1914063-2.6621094,2.6557617S22.0849781,21.8574219,23.5527515,21.8574219z M23.5527515,18.5463867   c0.3652344,0,0.6621094,0.2939453,0.6621094,0.6557617c0,0.3613281-0.296875,0.6552734-0.6621094,0.6552734   s-0.6621094-0.2939453-0.6621094-0.6552734C22.8906422,18.840332,23.1875172,18.5463867,23.5527515,18.5463867z"
                          />
                          <path
                            d="M30.0468922,21.8574219c1.4677734,0,2.6621075-1.190918,2.6621075-2.6552734s-1.194334-2.6557617-2.6621075-2.6557617   s-2.6621094,1.1914063-2.6621094,2.6557617S28.5791187,21.8574219,30.0468922,21.8574219z M30.0468922,18.5463867   c0.3652344,0,0.6621094,0.2939453,0.6621094,0.6557617c0,0.3613281-0.296875,0.6552734-0.6621094,0.6552734   s-0.6621094-0.2939453-0.6621094-0.6552734C29.3847828,18.840332,29.6816578,18.5463867,30.0468922,18.5463867z"
                          />
                          <path
                            d="M27.4209156,55.96875c-2.0043945,0-3.6352539,1.6308594-3.6352539,3.6352539   c0,2.0048828,1.6308594,3.6357422,3.6352539,3.6357422c2.0048828,0,3.6357422-1.6308594,3.6357422-3.6357422   C31.0566578,57.5996094,29.4257984,55.96875,27.4209156,55.96875z M27.4209156,61.2397461   c-0.9018555,0-1.6352539-0.7338867-1.6352539-1.6357422s0.7333984-1.6352539,1.6352539-1.6352539   s1.6357422,0.7333984,1.6357422,1.6352539S28.3227711,61.2397461,27.4209156,61.2397461z"
                          />
                          <path
                            d="M32.8139801,33.2480469c0-2.9736328-2.4194317-5.3925781-5.3930645-5.3925781s-5.3925781,2.4189453-5.3876953,5.4912109   l0.0830078,0.7885742c0,0.0332031,0.0014648,0.0751953,0.0048828,0.1083984l1.6645508,16.5751953   c0,2.0048828,1.6308594,3.6357422,3.6352539,3.6357422c2.0048828,0,3.6357422-1.6308594,3.6308594-3.5361328l1.7573223-17.5717773   C32.8125153,33.3139648,32.8139801,33.2807617,32.8139801,33.2480469z M29.0566578,50.8188477   c0,0.9018555-0.7338867,1.6357422-1.6357422,1.6357422s-1.6352539-0.7338867-1.6401367-1.7353516L24.1162281,34.144043   c0-0.0327148-0.0014648-0.074707-0.0048828-0.1074219l-0.0830078-0.7885742c0-1.8706055,1.5219727-3.3925781,3.3925781-3.3925781   c1.8554688,0,3.3681641,1.4970703,3.3925781,3.3466797L29.0566578,50.8188477z"
                          />
                          <path
                            d="M57.1074371,38.1333008c0.1298828,0,0.262207-0.0258789,0.3891602-0.0795898   c0.2802734-0.1186523,0.5673828-0.2231445,0.8613281-0.3134766c0.5283203-0.1616211,0.8251953-0.7207031,0.6635742-1.2485352   c-0.1611328-0.527832-0.7226563-0.824707-1.2485352-0.6635742c-0.3603516,0.1098633-0.7128906,0.2387695-1.0556641,0.3837891   c-0.5087891,0.215332-0.746582,0.8022461-0.53125,1.3105469C56.3471832,37.9038086,56.7177887,38.1333008,57.1074371,38.1333008z"
                          />
                          <path
                            d="M60.9931793,55.3007813c-4.949707,0-8.9765625-4.0268555-8.9765625-8.9765625   c0-2.4985352,1.0537109-4.9038086,2.8916016-6.5991211c0.4057617-0.3745117,0.4311523-1.0068359,0.0566406-1.4130859   c-0.3730469-0.4047852-1.0058594-0.4316406-1.4130859-0.0566406c-2.246582,2.0722656-3.5351563,5.0131836-3.5351563,8.0688477   c0,6.0527344,4.9238281,10.9765625,10.9765625,10.9765625c0.5522461,0,1-0.4477539,1-1   S61.5454254,55.3007813,60.9931793,55.3007813z"
                          />
                        </g>
                      </svg>

                      <h4
                        style="color: rgb(13, 13, 13); margin:0px; padding-bottom: 0px;"
                        class="header-display-1"
                      >
                        There are no sub channels yet
                      </h4>
                    </div>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div style="padding: 0px; margin: 0px">
            <div style="background-color: #f0f0f0; margin: 0; padding: 0">
              <h4
                style="color: rgb(13, 13, 13); padding: 7px; margin: 0px"
                class="header-display-1"
              >
                Data
              </h4>
            </div>
            <div style="margin: 0px; padding: 0px">
              <table class="uk-table uk-table-divider">
                <tbody>
                  <tr v-for="(ch, idx) in data" :key="ch.Hash">
                    <td style="width: 34px; vertical-align: middle">
                      <div
                        v-if="ch.NodeType == 5"
                        :style="'background-color:' + getBgColor(idx)"
                        style="
                        margin: 0px auto;
                        width: 32px;
                        font-weight: 600;
                        color: white;
                        font-size: 1.2em;
                        text-align: center;
                        border-radius: 5px;
                        height: 32px;
                        
                      "
                      >
                        {{ ch.Name | firstletter }}
                      </div>
                      <span
                        v-if="ch.NodeType == 2"
                        style="font-size:1.7em;"
                        class="icon-folder"
                      ></span>
                      <img
                        v-if="ch.NodeType == 1"
                        :src="nodeVector(ch.Name)"
                        style="width:32px; height:32px; font-size: 32px; vertical-align: middle; "
                      />
                    </td>
                    <td>
                      <div style="vertical-align: middle">
                        <router-link
                          style="font-weight: bold"
                          :to="{
                            name: 'ExplorerViewNode',
                            params: { hash: ch.Hash },
                          }"
                          >{{ ch.Name }}</router-link
                        >
                        <div v-if="ch.NodeType == 1" style="font-size: 0.9em; padding: 0; margin: 0; font-weight:bold;">
                          Size: {{ ch.Size | formatsize}}
                        </div>
                      </div>
                    </td>
                    <td style="vertical-align: middle; text-align:right;">
                      <div>{{ ch.Timestamp | timestamptodate }}</div>
                    </td>
                  </tr>
                  <tr v-if="data.length == 0">
                    <div style="text-align:center; padding-top:15px;">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="150px"
                        width="150px"
                        fill="#000000"
                        data-name="Layer 1"
                        viewBox="0 0 100 100"
                        x="0px"
                        y="0px"
                      >
                        <title>Artboard 100</title>
                        <path
                          d="M90,39a4,4,0,0,0-3.86,3H83v8.36l-3.11-3.11L66.38,52.13l-3.17,8.79L54,56.6l-8.62,4,4-8.07-4.53-5.72L51.73,40h5.41a4,4,0,1,0,0-2H50.9l-7.29,7.29-3.14-4-7.34-.17,2.89-8-4.28-4.28L39.63,21H50.14a4,4,0,1,0,0-2H38.81l-8.48,8.48L27,24.15V13H37.14a4,4,0,1,0,0-2H25V24L12.85,28.38,8,41.89l9.66,9.66,3.94-1.42L20,53.24l4.31,5.44L19,64H12.86a4,4,0,1,0,0,2h7l5.74-5.74L29,64.49l12,.27V70H30.86a4,4,0,1,0,0,2H41v4.37l5,2.35V82H37.86a4,4,0,1,0,0,2H48V79.66l6,2.81,6-2.81V87H76.14a4,4,0,1,0,0-2H62V78.72l5-2.35V71.12l4.17,4.17,13.5-4.87,4.88-13.51L85,52.36V44h1.14A4,4,0,1,0,90,39ZM61,37a2,2,0,1,1-2,2A2,2,0,0,1,61,37ZM54,18a2,2,0,1,1-2,2A2,2,0,0,1,54,18ZM41,10a2,2,0,1,1-2,2A2,2,0,0,1,41,10ZM9,67a2,2,0,1,1,2-2A2,2,0,0,1,9,67Zm18,6a2,2,0,1,1,2-2A2,2,0,0,1,27,73Zm7,12a2,2,0,1,1,2-2A2,2,0,0,1,34,85Zm46-1a2,2,0,1,1-2,2A2,2,0,0,1,80,84ZM68,53.69l9.91-3.58L74,59.7l-7.56,2.73L65,61.78ZM65,65.07v1.22l-.9-.9Zm-2.47-2.26L62.1,64l-7.83,3.32L45.06,63,54,58.81Zm-23-19.51L46,51.57l-10.33-.63-4.19-5.29.9-2.5Zm-10-.22.83,0-.26.71Zm-.94,2.41-2.95,1.06,1.34-2.68ZM31,41.12,26.91,41l-4.52-4.51,4.07-10.07,7.25,7.25ZM14.42,30l9.91-3.58L20.46,36,11,39.36Zm3.74,19.29-7.59-7.59L21,37.9l4.48,4.48-2.57,5.15Zm6.14-.1,5.78-2.08,4,5-4.78,9.6L22.39,53ZM31,62.54,35.81,53l10.84.66L42.46,62,41,62.7v.06ZM43,64.8h.31l.17-.34L53,68.94V79.79L43,75.1ZM65,75.1,55,79.79V69.19l7.07-3L65,69.12Zm2-6.81v-4l7.49-2.7,7.58,7.59L71.69,73Zm16.49-.47-7.57-7.57L80,50.18l7.25,7.25ZM90,45a2,2,0,1,1,2-2A2,2,0,0,1,90,45Z"
                        />
                      </svg>

                      <h4
                        style="color: rgb(13, 13, 13); margin:0px; padding-bottom: 0px;"
                        class="header-display-1"
                      >
                        No data in this section yet
                      </h4>
                    </div>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="!entryMode && !(node.node.NodeType == 3 || node.node.NodeType == 4)"
    >
      <div style="border-bottom: 1px solid #ddd" uk-grid>
        <div class="uk-width-expand">
          <h4
            v-if="node.node"
            style="color: rgb(13, 13, 13); padding-bottom: 11px"
            class="header-display-1"
          >
            {{ node.node.Name }}
          </h4>
        </div>
        <div class="uk-width-auto">
          <div>
            <div>
              <span
                class="clickable icon-plus"
                style="color: #3e15ca; z-index: 99999999; display:inline-block;  cursor: pointer; border: 2px solid; border-radius: 50%; padding: 5px; vertical-align: middle; font-size: 1.1em;"
              ></span>
              <div
                id="new_dropdown"
                style="background-color:white; border:1px solid #e3e3e3; "
                uk-dropdown="mode: click; delay-hide:0;"
              >
                <ul
                  style="padding:0px; margin:0px;"
                  class="chan-action-ul uk-list"
                >
                  <li @click="openNewFolderModal" class="clickable">
                    <span class="icon-folder"></span> New folder
                  </li>
                  <li class="clickable">
                    <span class="icon-upload"></span> Upload
                  </li>
                </ul>
              </div>
            </div>
          </div>
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
            Loading data
          </h4>
        </div>
      </div>

      <div
        v-show="!loading && node.node.NodeType == 5"
        style="padding-top: 20px"
      >
        <div
          style="border: 1px solid #e3e3e3; border-radius: 2px;"
        >

          <!-- entry -->
          <div style="padding:7px;" v-html="node.node.Description"></div>

          <div style="padding: 0px; margin: 0px">
            <div style="background-color: #f0f0f0; margin: 0; padding: 0">
              <h4
                style="color: rgb(13, 13, 13); padding: 7px; margin: 0px"
                class="header-display-1"
              >
                Data
              </h4>
            </div>
            <div style="margin: 0px; padding: 0px">
              <table class="uk-table uk-table-divider">
                <tbody>
                  <tr v-for="(ch, idx) in data" :key="ch.Hash">
                    <td style="width: 34px; vertical-align: middle">
                      <div
                        v-if="ch.NodeType == 5"
                        :style="'background-color:' + getBgColor(idx)"
                        style="
                        margin: 0px auto;
                        width: 32px;
                        font-weight: 600;
                        color: white;
                        font-size: 1.2em;
                        text-align: center;
                        border-radius: 5px;
                        height: 32px;
                        
                      "
                      >
                        {{ ch.Name | firstletter }}
                      </div>
                      <span
                        v-if="ch.NodeType == 2"
                        style="font-size:1.7em;"
                        class="icon-folder"
                      ></span>
                      <img
                        v-if="ch.NodeType == 1"
                        :src="nodeVector(ch.Name)"
                        style="width:32px; height:32px; font-size: 32px; vertical-align: middle; "
                      />
                    </td>
                    <td>
                      <div style="vertical-align: middle">
                        <router-link
                          style="font-weight: bold"
                          :to="{
                            name: 'ExplorerViewNode',
                            params: { hash: ch.Hash },
                          }"
                          >{{ ch.Name }}</router-link
                        >
                        <div v-if="ch.NodeType == 1" style="font-size: 0.9em; padding: 0; margin: 0; font-weight:bold;">
                          Size: {{ ch.Size | formatsize}}
                        </div>
                      </div>
                    </td>
                    <td style="vertical-align: middle; text-align:right;">
                      <div>{{ ch.Timestamp | timestamptodate }}</div>
                    </td>
                  </tr>
                  <tr v-if="data.length == 0">
                    <div style="text-align:center; padding-top:15px;">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="150px"
                        width="150px"
                        fill="#000000"
                        data-name="Layer 1"
                        viewBox="0 0 100 100"
                        x="0px"
                        y="0px"
                      >
                        <title>Artboard 100</title>
                        <path
                          d="M90,39a4,4,0,0,0-3.86,3H83v8.36l-3.11-3.11L66.38,52.13l-3.17,8.79L54,56.6l-8.62,4,4-8.07-4.53-5.72L51.73,40h5.41a4,4,0,1,0,0-2H50.9l-7.29,7.29-3.14-4-7.34-.17,2.89-8-4.28-4.28L39.63,21H50.14a4,4,0,1,0,0-2H38.81l-8.48,8.48L27,24.15V13H37.14a4,4,0,1,0,0-2H25V24L12.85,28.38,8,41.89l9.66,9.66,3.94-1.42L20,53.24l4.31,5.44L19,64H12.86a4,4,0,1,0,0,2h7l5.74-5.74L29,64.49l12,.27V70H30.86a4,4,0,1,0,0,2H41v4.37l5,2.35V82H37.86a4,4,0,1,0,0,2H48V79.66l6,2.81,6-2.81V87H76.14a4,4,0,1,0,0-2H62V78.72l5-2.35V71.12l4.17,4.17,13.5-4.87,4.88-13.51L85,52.36V44h1.14A4,4,0,1,0,90,39ZM61,37a2,2,0,1,1-2,2A2,2,0,0,1,61,37ZM54,18a2,2,0,1,1-2,2A2,2,0,0,1,54,18ZM41,10a2,2,0,1,1-2,2A2,2,0,0,1,41,10ZM9,67a2,2,0,1,1,2-2A2,2,0,0,1,9,67Zm18,6a2,2,0,1,1,2-2A2,2,0,0,1,27,73Zm7,12a2,2,0,1,1,2-2A2,2,0,0,1,34,85Zm46-1a2,2,0,1,1-2,2A2,2,0,0,1,80,84ZM68,53.69l9.91-3.58L74,59.7l-7.56,2.73L65,61.78ZM65,65.07v1.22l-.9-.9Zm-2.47-2.26L62.1,64l-7.83,3.32L45.06,63,54,58.81Zm-23-19.51L46,51.57l-10.33-.63-4.19-5.29.9-2.5Zm-10-.22.83,0-.26.71Zm-.94,2.41-2.95,1.06,1.34-2.68ZM31,41.12,26.91,41l-4.52-4.51,4.07-10.07,7.25,7.25ZM14.42,30l9.91-3.58L20.46,36,11,39.36Zm3.74,19.29-7.59-7.59L21,37.9l4.48,4.48-2.57,5.15Zm6.14-.1,5.78-2.08,4,5-4.78,9.6L22.39,53ZM31,62.54,35.81,53l10.84.66L42.46,62,41,62.7v.06ZM43,64.8h.31l.17-.34L53,68.94V79.79L43,75.1ZM65,75.1,55,79.79V69.19l7.07-3L65,69.12Zm2-6.81v-4l7.49-2.7,7.58,7.59L71.69,73Zm16.49-.47-7.57-7.57L80,50.18l7.25,7.25ZM90,45a2,2,0,1,1,2-2A2,2,0,0,1,90,45Z"
                        />
                      </svg>

                      <h4
                        style="color: rgb(13, 13, 13); margin:0px; padding-bottom: 0px;"
                        class="header-display-1"
                      >
                        No data in this section yet
                      </h4>
                    </div>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>



        </div>
      </div>

      <div
        v-show="!loading && node.node.NodeType == 2"
        style="padding-top: 20px"
      >
        <div
          style="border: 1px solid #e3e3e3; border-radius: 2px; padding:7px;"
        >
          <div>

              <!-- directory -->
              <table class="uk-table uk-table-divider">
                <tbody>
                  <tr v-for="(ch, idx) in data" :key="ch.Hash">
                    <td style="width: 34px; vertical-align: middle">
                      <div
                        v-if="ch.NodeType == 5"
                        :style="'background-color:' + getBgColor(idx)"
                        style="
                        margin: 0px auto;
                        width: 32px;
                        font-weight: 600;
                        color: white;
                        font-size: 1.2em;
                        text-align: center;
                        border-radius: 5px;
                        height: 32px;
                        
                      "
                      >
                        {{ ch.Name | firstletter }}
                      </div>
                      <span
                        v-if="ch.NodeType == 2"
                        style="font-size:1.7em;"
                        class="icon-folder"
                      ></span>
                      <img
                        v-if="ch.NodeType == 1"
                        :src="nodeVector(ch.Name)"
                        style="width:32px; height:32px; font-size: 32px; vertical-align: middle; "
                      />
                    </td>
                    <td>
                      <div style="vertical-align: middle">
                        <router-link
                          style="font-weight: bold"
                          :to="{
                            name: 'ExplorerViewNode',
                            params: { hash: ch.Hash },
                          }"
                          >{{ ch.Name }}</router-link
                        >
                        <div v-if="ch.NodeType == 1" style="font-size: 0.9em; padding: 0; margin: 0; font-weight:bold;">
                          Size: {{ ch.Size | formatsize}}
                        </div>
                      </div>
                    </td>
                    <td style="vertical-align: middle; text-align:right;">
                      <div>{{ ch.Timestamp | timestamptodate }}</div>
                    </td>
                  </tr>
                  <tr v-if="data.length == 0">
                    <div style="text-align:center; padding-top:15px;">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="150px"
                        width="150px"
                        fill="#000000"
                        data-name="Layer 1"
                        viewBox="0 0 100 100"
                        x="0px"
                        y="0px"
                      >
                        <title>Artboard 100</title>
                        <path
                          d="M90,39a4,4,0,0,0-3.86,3H83v8.36l-3.11-3.11L66.38,52.13l-3.17,8.79L54,56.6l-8.62,4,4-8.07-4.53-5.72L51.73,40h5.41a4,4,0,1,0,0-2H50.9l-7.29,7.29-3.14-4-7.34-.17,2.89-8-4.28-4.28L39.63,21H50.14a4,4,0,1,0,0-2H38.81l-8.48,8.48L27,24.15V13H37.14a4,4,0,1,0,0-2H25V24L12.85,28.38,8,41.89l9.66,9.66,3.94-1.42L20,53.24l4.31,5.44L19,64H12.86a4,4,0,1,0,0,2h7l5.74-5.74L29,64.49l12,.27V70H30.86a4,4,0,1,0,0,2H41v4.37l5,2.35V82H37.86a4,4,0,1,0,0,2H48V79.66l6,2.81,6-2.81V87H76.14a4,4,0,1,0,0-2H62V78.72l5-2.35V71.12l4.17,4.17,13.5-4.87,4.88-13.51L85,52.36V44h1.14A4,4,0,1,0,90,39ZM61,37a2,2,0,1,1-2,2A2,2,0,0,1,61,37ZM54,18a2,2,0,1,1-2,2A2,2,0,0,1,54,18ZM41,10a2,2,0,1,1-2,2A2,2,0,0,1,41,10ZM9,67a2,2,0,1,1,2-2A2,2,0,0,1,9,67Zm18,6a2,2,0,1,1,2-2A2,2,0,0,1,27,73Zm7,12a2,2,0,1,1,2-2A2,2,0,0,1,34,85Zm46-1a2,2,0,1,1-2,2A2,2,0,0,1,80,84ZM68,53.69l9.91-3.58L74,59.7l-7.56,2.73L65,61.78ZM65,65.07v1.22l-.9-.9Zm-2.47-2.26L62.1,64l-7.83,3.32L45.06,63,54,58.81Zm-23-19.51L46,51.57l-10.33-.63-4.19-5.29.9-2.5Zm-10-.22.83,0-.26.71Zm-.94,2.41-2.95,1.06,1.34-2.68ZM31,41.12,26.91,41l-4.52-4.51,4.07-10.07,7.25,7.25ZM14.42,30l9.91-3.58L20.46,36,11,39.36Zm3.74,19.29-7.59-7.59L21,37.9l4.48,4.48-2.57,5.15Zm6.14-.1,5.78-2.08,4,5-4.78,9.6L22.39,53ZM31,62.54,35.81,53l10.84.66L42.46,62,41,62.7v.06ZM43,64.8h.31l.17-.34L53,68.94V79.79L43,75.1ZM65,75.1,55,79.79V69.19l7.07-3L65,69.12Zm2-6.81v-4l7.49-2.7,7.58,7.59L71.69,73Zm16.49-.47-7.57-7.57L80,50.18l7.25,7.25ZM90,45a2,2,0,1,1,2-2A2,2,0,0,1,90,45Z"
                        />
                      </svg>

                      <h4
                        style="color: rgb(13, 13, 13); margin:0px; padding-bottom: 0px;"
                        class="header-display-1"
                      >
                        No data in this section yet
                      </h4>
                    </div>
                  </tr>
                </tbody>
              </table>
          </div>
        </div>
      </div>

      <div
        v-show="!loading && node.node.NodeType == 1"
        style="padding-top: 20px"
      >
        <div
          style="border: 1px solid #e3e3e3; border-radius: 2px; padding:7px;"
        >
          <div>
            file
          </div>
        </div>
      </div>
    </div>

    <div ref="create_node" class="uk-modal" uk-modal="bg-close:false;">
      <div class="uk-modal-dialog uk-margin-auto-vertical">
        <button
          class="uk-modal-close-default"
          style="left: 5px; top: 15px; right: 0px"
          type="button"
          uk-close
        ></button>
        <div class="uk-modal-header">
          <h2 style="font-size: 1.1em" class="uk-modal-title header-display-1">
            Create a sub channel
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
                    class="uk-form-icon icon-tree"
                    uk-icon
                  ></span>
                  <input
                    v-model="subchannel.name"
                    class="uk-input"
                    type="text"
                    placeholder="Sub channel name"
                    required="true"
                    pattern=".{5,}"
                    title="5 characters minimum"
                  />
                </div>
              </div>

              <div class="uk-margin">
                <div style="width: 100%" class="uk-inline">
                  <textarea
                    v-model="subchannel.description"
                    style="height: 100px"
                    class="uk-input"
                    required="true"
                    placeholder="Sub channel description"
                  >
                  </textarea>
                </div>
              </div>

              <div class="uk-margin uk-text-center" style="padding: 15px">
                <button
                  @click="createSubChannel()"
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

    <div ref="create_folder" class="uk-modal" uk-modal="bg-close:false;">
      <div class="uk-modal-dialog uk-margin-auto-vertical">
        <button
          class="uk-modal-close-default"
          style="left: 5px; top: 15px; right: 0px"
          type="button"
          uk-close
        ></button>
        <div class="uk-modal-header">
          <h2 style="font-size: 1.1em" class="uk-modal-title header-display-1">
            Create a folder
          </h2>
        </div>
        <div style="padding: 0" class="uk-modal-body">
          <div
            v-show="!loadingBalance"
            class="uk-text-center"
            style="padding: 15px"
          >
            <div style="margin-top: 15px">
              <div class="uk-margin">
                <div style="width: 100%" class="uk-inline">
                  <span
                    style="color: #000000"
                    class="uk-form-icon icon-folder"
                  ></span>
                  <input
                    v-model="folder_name"
                    class="uk-input"
                    type="text"
                    placeholder="Folder name"
                    required="true"
                    pattern=".{5,}"
                    title="5 characters minimum"
                  />
                </div>
              </div>

              <div class="uk-margin uk-text-center" style="padding: 15px">
                <button
                  @click="createFolder()"
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
import axios from "axios";
import unitUtil from "../units";
import ftype from "../common/filetypes";
import NewButton from "../components/NewButton";
const BN = require("bn.js");
var messages = require("../messages_pb");
const { ipcRenderer } = window.require("electron");

export default {
  components: {
    NewButton,
  },
  data() {
    return {
      toolbarOptions: {
        modules: {
          toolbar: [
            ["bold", "italic", "underline", "strike"], // toggled buttons
            ["blockquote", "code-block"],

            [{ header: 1 }, { header: 2 }], // custom button values
            [{ list: "ordered" }, { list: "bullet" }],
            [{ script: "sub" }, { script: "super" }], // superscript/subscript
            [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
            [{ direction: "rtl" }], // text direction

            [{ size: ["small", false, "large", "huge"] }], // custom dropdown
            [{ header: [1, 2, 3, 4, 5, 6, false] }],

            [{ color: [] }, { background: [] }], // dropdown with defaults from theme
            [{ font: [] }],
            [{ align: [] }],

            ["clean"], // remove formatting button
          ],
        },
      },
      nextChecked: false,
      folder_name: "",
      entry_name: "",
      entry_content: "",
      lastTxHash: "",
      channel_creation_error: "",
      loadingBalance: false,
      colors: [
        "#3e15ca",
        "#f0506e",
        "#32d296",
        "#ff6200",
        "#00cca6",
        "#4947ef",
        "#bdbdbd",
      ],
      subchannel: { name: "", description: "" },
      subchans: [],
      data: [],
      node: { node: { NodeType: -1 } },
      loading: false,
    };
  },
  async mounted() {
    this.loading = true;
    await this.getNode(this.$route.params.hash);
    this.loading = false;
  },
  computed: {
    entryMode() {
      return this.$store.state.entryMode;
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
    upload_data() {
      return this.$store.state.upload_data;
    },
    name_conflicts() {
      return this.$store.state.name_conflicts;
    },
  },
  methods: {
    async nextUploadItemsPage() {
      this.entry_name = this.entry_name.trim()
      if(this.entry_name == '') {
        this.channel_creation_error = "Entry name is required"
        return;
      }

      let tmpNode = { 
        Name: this.entry_name, 
        ParentHash: this.node.node.Hash, 
        Hash: ipcRenderer.sendSync("sha256", this.node.node.Hash + this.entry_name)
      }

      this.loadingBalance = true;
      const res = await axios.post(this.rpcEndpoint, {
        jsonrpc: "2.0",
        method: "channel_getNode",
        params: [tmpNode.Hash],
        id: 1,
      });
      this.loadingBalance = false;

      if(!("error" in res.data)) {
        this.channel_creation_error = "The name is duplicate. Please choose another name"
        return
      }

      this.channel_creation_error = ""
      this.nextChecked = true;
      this.$store.dispatch("SetCurrentNodeUpload", tmpNode)
      // here set the node
    },
    backUploadItemsPage() {
      this.nextChecked = false;
      this.$store.dispatch("SetCurrentNodeUpload", {})
      // here set the node
    },
    getProgress(node) {
      let pg = parseInt((node.progress / node.size) * 100)
      return pg > 100 ? 100 : pg;
    },
    startUpload() {
      if(this.upload_data.length == 0) {
        this.createEntry();
      } else {
        let p = { type: "entry", cb: this.createEntry }
        this.$store.dispatch("StartUploadQueue", p);
      }
      
    },
    cancelItemFromUpload(idx) {
      this.$store.dispatch("CancelUploadData", idx);
    },
    removeItemFromUpload(idx) {
      this.$store.dispatch("RemoveUploadData", idx);
    },
    removeItemFromConflicts(idx) {
      this.$store.dispatch("RemoveItemFromConflicts", idx);
    },
    nodeVector(name) {
      let img = `/file_types/${ftype.getVectorOf(ftype.getExt(name))}.svg`;
      return img;
    },
    async createFolder() {
      this.folder_name = this.folder_name.trim();
      this.channel_creation_error = "";
      if (this.folder_name == "") {
        this.channel_creation_error = "Folder name is required";
        return;
      }

      this.loadingBalance = true;
      const res = await axios.post(this.rpcEndpoint, {
        jsonrpc: "2.0",
        method: "channel_getNode",
        params: [ipcRenderer.sendSync("sha256", this.node.node.Hash + this.folder_name)],
        id: 1,
      });
      this.loadingBalance = false;

      if(!("error" in res.data)) {
        this.channel_creation_error = "The name is duplicate. Please choose another name"
        return
      }




      let chNode = new messages.ChanNode();
      chNode.setName(this.folder_name);
      chNode.setNodetype(messages.ChanNodeType.DIR);
      chNode.setParenthash(this.node.node.Hash);

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
        let txFee = new BN(
          this.blockchain_settings.node_creation_fees_guest,
          10
        );

        if (balance.lt(txFee)) {
          this.channel_creation_error =
            "* Sub channel creation requires " +
            unitUtil.fromAran(txFee.toString(10), "zaran").toString(10) +
            " ZARANS. You don't have enough balance";
          return;
        }

        let amountHex;
        try {
          amountHex = "0x" + unitUtil.toAran("0", "aran").toString(16);
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
            window.UIkit.modal(this.$refs.create_folder).hide();
            this.loading = true;
            await this.getNode(this.$route.params.hash);
            this.loading = false;
            // let chanHash = ipcRenderer.sendSync("sha256", tx.From+this.channel.name);
            // this.$router.push("/explorer/" + chanHash)
            foundTx = true;
          }

          tryies++;
        }

        if (!foundTx) {
          this.channel_creation_error =
            "It may take a few seconds for your sub channel to be available. Please search for it in the channel list!";
        }
      } catch (e) {
        this.channel_creation_error =
          "Unexpected error. Make sure you are connected to internet!";
      } finally {
        this.loadingBalance = false;
      }
    },
    getBgColor(idx) {
      if (idx > this.colors.length - 1) idx = 0;
      return this.colors[idx];
    },
    openNewFolderModal() {
      this.channel_creation_error = "";
      window.UIkit.modal(this.$refs.create_folder).show();
      UIkit.dropdown(document.getElementById("new_dropdown")).hide();
    },
    openSubchannelModal() {
      this.channel_creation_error = "";
      window.UIkit.modal(this.$refs.create_node).show();
      UIkit.dropdown(document.getElementById("new_dropdown")).hide();
    },
    openEntryModal() {
      this.channel_creation_error = "";
      this.entry_content = "";
      this.entry_name = "";
      this.nextChecked = false;
      this.$store.dispatch("SetEntryMode", true);
      UIkit.dropdown(document.getElementById("new_dropdown")).hide();
    },
    closeEntryModal() {
      this.$store.dispatch("SetEntryMode", false);
    },
    addressFromKeyname(name) {
      return name.split("--")[2];
    },
    async createEntry() {
      this.entry_name = this.entry_name.trim()
      this.channel_creation_error = "";
      if (this.entry_name == "") {
        this.channel_creation_error = "Entry name is required";
        return;
      }
      if (this.entry_content == "") {
        this.channel_creation_error = "Entry content is required";
        return;
      }
      let chNode = new messages.ChanNode();
      chNode.setName(this.entry_name);
      chNode.setDescription(this.entry_content);
      chNode.setNodetype(messages.ChanNodeType.ENTRY);
      chNode.setParenthash(this.node.node.Hash);

      let chEnvelp = new messages.ChanNodeEnvelop();
      chEnvelp.addNodes(chNode);

      this.upload_data.map((o)=> {
        if(o.error != '' || o.canceled) return;

        if(o.type == "file") {
          let tmpN = new messages.ChanNode();
          tmpN.setName(o.name);
          tmpN.setNodetype(messages.ChanNodeType.FILE);
          tmpN.setParenthash(o.file.parentHash);
          tmpN.setBinlayerhash(o.file.file_hash);
          let sizeBig = new BN(o.file.file.size, 10).toString(16);
          tmpN.setSize('0x'+sizeBig);
          chEnvelp.addNodes(tmpN);

        } else if(o.type == "dir") {
          
          o.files.map((j) => {
            let tmpN = new messages.ChanNode();
            tmpN.setName(j.name);
            tmpN.setParenthash(j.parentHash);

            if("file" in j) {
              tmpN.setNodetype(messages.ChanNodeType.FILE);
              console.log("size in files ", j.file.size)
              let sizeBig = new BN(j.file.size, 10).toString(16);
              tmpN.setSize('0x'+sizeBig);
            } else {
              tmpN.setNodetype(messages.ChanNodeType.DIR);
            }
            tmpN.setParenthash(j.parentHash);
            chEnvelp.addNodes(tmpN);            
          })

        }
      })


      // clear the current files
      this.$store.dispatch("SetUploadData", []);
     

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
        let txFee = new BN(
          this.blockchain_settings.node_creation_fees_guest,
          10
        );

        if (balance.lt(txFee)) {
          this.channel_creation_error =
            "* Entry creation requires " +
            unitUtil.fromAran(txFee.toString(10), "zaran").toString(10) +
            " ZARANS. You don't have enough balance";
          return;
        }

        let amountHex;
        try {
          amountHex = "0x" + unitUtil.toAran("0", "aran").toString(16);
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
            this.loading = true;
            await this.getNode(this.$route.params.hash);
            this.loading = false;
            this.$store.dispatch("SetEntryMode", false);
            // let chanHash = ipcRenderer.sendSync("sha256", tx.From+this.channel.name);
            // this.$router.push("/explorer/" + chanHash)
            foundTx = true;
          }

          tryies++;
        }

        if (!foundTx) {
          this.channel_creation_error =
            "It may take a few seconds for your entry to be available. Please reload";
        }
      } catch (e) {
        this.channel_creation_error =
          "Unexpected error. Make sure you are connected to internet!";
      } finally {
        this.loadingBalance = false;
      }
    },
    async createSubChannel() {
      this.subchannel.name = this.subchannel.name.trim()
      this.channel_creation_error = "";
      if (this.subchannel.name == "") {
        this.channel_creation_error = "Sub channel name is required";
        return;
      }
      if (this.subchannel.description == "") {
        this.channel_creation_error = "Sub channel description is required";
        return;
      }

      this.loadingBalance = true;
      const res = await axios.post(this.rpcEndpoint, {
        jsonrpc: "2.0",
        method: "channel_getNode",
        params: [ipcRenderer.sendSync("sha256", this.node.node.Hash + this.subchannel.name)],
        id: 1,
      });
      this.loadingBalance = false;

      if(!("error" in res.data)) {
        this.channel_creation_error = "The name is duplicate. Please choose another name"
        return
      }



      let chNode = new messages.ChanNode();
      chNode.setName(this.subchannel.name);
      chNode.setDescription(this.subchannel.description);
      chNode.setNodetype(messages.ChanNodeType.SUBCHANNEL);
      chNode.setParenthash(this.node.node.Hash);

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
        let txFee = new BN(
          this.blockchain_settings.node_creation_fees_guest,
          10
        );

        if (balance.lt(txFee)) {
          this.channel_creation_error =
            "* Sub channel creation requires " +
            unitUtil.fromAran(txFee.toString(10), "zaran").toString(10) +
            " ZARANS. You don't have enough balance";
          return;
        }

        let amountHex;
        try {
          amountHex = "0x" + unitUtil.toAran("0", "aran").toString(16);
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
            window.UIkit.modal(this.$refs.create_node).hide();
            this.loading = true;
            await this.getNode(this.$route.params.hash);
            this.loading = false;
            // let chanHash = ipcRenderer.sendSync("sha256", tx.From+this.channel.name);
            // this.$router.push("/explorer/" + chanHash)
            foundTx = true;
          }

          tryies++;
        }

        if (!foundTx) {
          this.channel_creation_error =
            "It may take a few seconds for your sub channel to be available. Please search for it in the channel list!";
        }
      } catch (e) {
        this.channel_creation_error =
          "Unexpected error. Make sure you are connected to internet!";
      } finally {
        this.loadingBalance = false;
      }
    },
    async getNode(hash) {
      const res = await axios.post(this.rpcEndpoint, {
        jsonrpc: "2.0",
        method: "channel_getNode",
        params: [hash],
        id: 1,
      });

      this.node = res.data.result || { node: { NodeType: -1 } };

      if (
        res.data.result == null ||
        (res.data.result && !res.data.result.childs)
      ) {
        this.subchans = [];
        this.data = [];
      } else if (res.data.result && res.data.result.childs) {
        this.subchans = res.data.result.childs.filter((o) => o.NodeType == 4);
        this.data = res.data.result.childs.filter((o) => o.NodeType != 4);
      }
    },
  },
  watch: {
    $route: async function(val) {
      if (val && val.name == "ExplorerViewNode") {
        this.loading = true;
        await this.getNode(this.$route.params.hash);
        this.loading = false;
      }
    },
  },
};
</script>

<style>
.chan-action-ul li {
  padding: 2px !important;
}
</style>
