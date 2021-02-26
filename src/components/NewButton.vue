<template>
  <div>
    <div style="padding:9px;" class="uk-active">
        <span style="font-size: 1.4em;" class="icon-upload"></span>
        <label style="margin-left: 18px; font-size: 1.2em; cursor:pointer;" for="filesinput" class="custom-file-upload">Upload files</label>
        <input @change="selectFiles" style="display:none;" id="filesinput" type="file" multiple />
        <!-- <a @click="checkloading" style="display:inline; margin-left: 18px; font-size: 1.2em;" href="#">Upload</a> -->
    </div>
    <div style="padding:9px;" class="uk-active">
        <span style="font-size: 1.4em;" class="icon-folder-upload"></span>
        <label style="margin-left: 18px; font-size: 1.2em; cursor:pointer;" for="folderinput" class="custom-file-upload">Upload folder</label>
        <input @change="selectFolder" style="display:none;" id="folderinput" type="file" webkitdirectory mozdirectory />
        <!-- <a @click="checkloading" style="display:inline; margin-left: 18px; font-size: 1.2em;" href="#">Upload</a> -->
    </div>
  </div>
</template>

<script>
import uploader from '../common/uploader'
const { ipcRenderer } = window.require("electron");
export default {
    props: ['cnode'],
    data() {
        return {}
    },
    methods: {
        upload() {
            console.log(uploader)
            // const doneUpload = await uploader.uploadData(parent_id, store.state.jwt, formData, store.state.uploader.vfs.files[index].cancel, (progressEvent) => {
                // store.commit("uploader/setNodeProgress", { type: "file" , index: index, value: progressEvent.loaded  })
            // })
        },
        generateStructureFromPath(file, currentHash = ""){
            let splits = file.webkitRelativePath.split("/");
            let nodes = [];
            let lastHash = currentHash;
            splits.forEach((val, index) => {
                let obj = {
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
            for(let i=0;i<e.target.files.length;i++) {
                let payload = {
                    type: "file",
                    name: e.target.files[i].name,
                    file: {
                        parentHash: this.cnode.Hash,
                        hash: ipcRenderer.sendSync("sha256", this.cnode.Hash + e.target.files[i].name),
                        name: e.target.files[i].name,
                        file: e.target.files[i]
                    }
                }
                this.$store.dispatch("AddToUploadData", payload)
            } 
            
        },
        selectFolder(e) {
            let nodes = [];
            for(let i=0;i<e.target.files.length;i++) {
                let newNodes = this.generateStructureFromPath(e.target.files[i], this.cnode.Hash)
                newNodes.forEach((v)=> {
                    if(nodes.filter((o)=> o.hash == v.hash).length == 0) nodes.push(v)
                })
            }
            if(nodes.length > 0) {
                let payload = { type: "dir", name: nodes[0].name, files: nodes }
                this.$store.dispatch("AddToUploadData", payload)
            }
        }
    }
}
</script>

<style>

</style>