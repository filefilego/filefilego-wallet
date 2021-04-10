<template>
  <div class="uk-text-center" style="padding-top:20px;">
      <h4
        style="color: rgb(13, 13, 13); padding-bottom: 0px;"
        class="header-display-1"
      >
        <span class="icon-upload3"></span>
        Attach files/folders by using the following:
      </h4>

    <div class="uk-active">

      <span>
        <span style="color:black; font-size: 1.4em;" class="icon-upload"></span>
        <label
          style="margin-left:5px; color:black; font-weight:bold; font-size: 1.1em; cursor:pointer;"
          for="filesinput"
          class="custom-file-upload"
          >files</label
        >
        <input
          @change="selectFiles"
          style="display:none;"
          id="filesinput"
          type="file"
          multiple
        />
      </span>
      

      <span style="margin-left:23px;">
        <span style="color:black; font-size: 1.4em;" class="icon-folder-upload"></span>
        <label
          style="margin-left:5px; color:black; font-weight:bold; font-size: 1.1em; cursor:pointer;"
          for="folderinput"
          class="custom-file-upload"
          >folder</label
        >
        <input
          @change="selectFolder"
          style="display:none;"
          id="folderinput"
          type="file"
          webkitdirectory
          mozdirectory
        />
      </span>
    </div>
  </div>
</template>

<script>
const { ipcRenderer } = window.require("electron");
export default {
  data() {
    return {};
  },
  computed: {
    cnode() {
      return this.$store.state.current_node_upload;
    }
  },
  methods: {
    upload() {
      return 
    },
    generateStructureFromPath(file, currentHash = "") {
      let splits = file.webkitRelativePath.split("/");
      let nodes = [];
      let lastHash = currentHash;
      splits.forEach((val, index) => {
        let obj = {
          file_hash: "",
          merkle_root: "",
          parentHash: lastHash,
          hash: ipcRenderer.sendSync("sha256", lastHash + val),
          name: val,
        };
        if (index == splits.length - 1) obj.file = file;
        lastHash = obj.hash;
        nodes.push(obj);
      });

      return nodes;
    },
    selectFiles(e) {
      for (let i = 0; i < e.target.files.length; i++) {
        let payload = {
          size: e.target.files[i].size,
          canceled: false,
          cancel: null,
          progress: 0,
          error: "",
          type: "file",
          name: e.target.files[i].name,
          file: {
            file_hash: "",
            merkle_root: "",
            parentHash: this.cnode.Hash,
            hash: ipcRenderer.sendSync(
              "sha256",
              this.cnode.Hash + e.target.files[i].name
            ),
            name: e.target.files[i].name,
            file: e.target.files[i],
          },
        };
        this.$store.dispatch("AddToUploadData", payload);
      }
    },
    selectFolder(e) {
      let nodes = [];
      for (let i = 0; i < e.target.files.length; i++) {
        let newNodes = this.generateStructureFromPath(
          e.target.files[i],
          this.cnode.Hash
        );
        newNodes.forEach((v) => {
          if (nodes.filter((o) => o.hash == v.hash).length == 0) nodes.push(v);
        });
      }

      let totalSize = Number(0)
      nodes.forEach((o)=> {
        if("file" in o) totalSize+= Number(o.file.size);
      })

      if (nodes.length > 0) {
        let payload = {
          size: totalSize,
          canceled: false,
          cancel: null,
          progress: 0,
          error: "",
          type: "dir",
          name: nodes[0].name,
          files: nodes,
        };
        this.$store.dispatch("AddToUploadData", payload);
      }
    },
  },
};
</script>

<style></style>
