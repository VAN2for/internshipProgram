var projectUpload = new Vue({
  el: "#project-upload-container",
  data: function () {
    return {
      visible: false,
      loading: false,
      treeLoading: true,
      filesTree: [],
      defaultProps: {
        children: "children",
        label: "label",
      },
    };
  },
  methods: {
    show: function () {
      this.visible = true;
      var that = this;
      this.loading = false;
      window.G.service.request("GET_FS_ROOT", "", function (filesTree) {
        console.log(filesTree);
        that.filesTree = filesTree;
        that.treeLoading = false;
      });
    },
    hide: function () {
      this.visible = false;
    },
    loadingFinish: function () {
      this.loading = false;
    },
    successTip: function (content) {
      this.$message.success(content);
    },
    errorTip: function (content) {
      this.$message.error(content);
    },
    uploadFull: function () {
      if (this.loading) return;
      if (window.confirm("确认上传？")) {
        this.loading = true;
        window.G.service.request("SYNC_PS", {
          data: {
            type: "upload",
            uploadContent:
              // "Assets,build.sh,Makefile,PreviewGameWebGL.html,ProjectSetting,README.md,resource,Scripts,StartScene.html,StartScene_tech.html,Temp/scene_editor.bin,Temp/scene_editor.state,Temp/scene_editor.bin.meta,Temp/scene_editor_tech.bin,Temp/scene_editor_tech.bin.meta,Temp/scene_editor_tech.state,tsconfig.json,TypeScripts,editorConfig.json,lang.xlsx,gameConfig.xlsx",
              "PreviewGameWebGL.html,ProjectSetting,Scripts,StartScene.html,StartScene_tech.html,Temp/scene_editor_tech.bin,Temp/scene_editor_tech.bin.meta,Temp/scene_editor_tech.state,tsconfig.json,TypeScripts,lang.xlsx,gameConfig.xlsx,resource/config/gameConfig.json"
          },
        });
      }
    },
    uploadTreeFiles: function () {
      if (this.$refs.tree.getCheckedKeys().length == 0) {
        alert("请选择上传的文件");
      } else {
        var that = this;
        if (this.loading) return;
        if (window.confirm("确认上传？")) {
          this.loading = true;
          console.log("上传文件", this.$refs.tree.getCheckedKeys());
          window.G.service.request("SYNC_PS", {
            data: {
              type: "upload",
              uploadContent: that.$refs.tree.getCheckedKeys().join(","),
            },
          });
        }
      }
    },
    uploadFullForce: function () {
      if (this.loading) return;
      if (window.confirm("确认上传？")) {
        this.loading = true;
        window.G.service.request("SYNC_PS", {
          data: {
            type: "upload",
            uploadContent:
              // "Assets,build.sh,Makefile,PreviewGameWebGL.html,ProjectSetting,README.md,resource,Scripts,StartScene.html,StartScene_tech.html,Temp/scene_editor.bin,Temp/scene_editor.state,Temp/scene_editor.bin.meta,Temp/scene_editor_tech.bin,Temp/scene_editor_tech.bin.meta,Temp/scene_editor_tech.state,tsconfig.json,TypeScripts,editorConfig.json,lang.xlsx,gameConfig.xlsx",
              "PreviewGameWebGL.html,ProjectSetting,Scripts,StartScene.html,StartScene_tech.html,Temp/scene_editor_tech.bin,Temp/scene_editor_tech.bin.meta,Temp/scene_editor_tech.state,Temp/scene_editor.bin,Temp/scene_editor.bin.meta,Temp/scene_editor.state,tsconfig.json,TypeScripts,lang.xlsx,gameConfig.xlsx,resource/config/gameConfig.json",
            force: true
          },
        });
      }
    }
  },
  template: `<el-dialog :visible.sync="visible" title="上传项目">
              <div v-loading="loading">
                <p>
                  <el-button @click="uploadFull">一键上传(合并)</el-button>
                </p>
                <div class="tree-name">自定义上传</div>
                <div class="files-tree">
                  <el-tree
                  v-loading="treeLoading"
                  :data="filesTree"
                  show-checkbox
                  node-key="node"
                  ref="tree"
                  :props="defaultProps">
                  </el-tree>
                </div>
                <div class="tree-upload-btn">
                  <el-button @click="uploadTreeFiles">自定义上传</el-button>
                </div>
                <div class="tree-force-btn">
                  <el-button @click="uploadFullForce">强行上传覆盖</el-button>
                </div>
              </div>
            </el-dialog>`,
});

var projectDownload = new Vue({
  el: "#project-download-container",
  data: function () {
    return {
      filesTree: [],
      treeLoading: true,
      visible: false,
      loading: false,
      defaultProps: {
        children: "children",
        label: "label",
      },
      tip: '下载前请先保存，下载后会自动刷新页面，确认下载？'
    };
  },
  methods: {
    show: function () {
      this.visible = true;
      this.loading = false;
      window.G.service.request("GET_DOWNLOAD_FILESTREE", {}, (files) => {
        this.filesTree = files;
        this.treeLoading = false;
      });
    },
    hide: function () {
      this.visible = false;
    },
    loadingFinish: function () {
      this.loading = false;
    },
    successTip: function (content) {
      this.$message.success(content);
    },
    errorTip: function (content) {
      this.$message.error(content);
    },
    downloadFull: function () {
      if (this.loading) return;
      if (window.confirm(this.tip)) {
        this.loading = true;
        window.G.service.request("SYNC_PS", {
          data: {
            type: "download",
            downloadContent: "Assets/,resource/,Temp/,Scripts/vp/,Scripts/grid/,info.json",
          },
        });
      }
    },
    downFilesFromTree: function () {
      if (this.$refs.tree.getCheckedKeys().length === 0) {
        alert("请选择下载的文件");
      } else {
        if (this.loading) return;
        if (window.confirm(this.tip)) {
          this.loading = true;
          window.G.service.request("SYNC_PS", {
            data: {
              type: "download",
              downloadContent: encodeURIComponent(this.$refs.tree.getCheckedKeys().join(",")),
            },
          });
        }
      }
    },
    downloadProject: function () {
      if (this.loading) return;
      if (window.confirm(this.tip)) {
        this.loading = true;
        window.G.service.request("SYNC_PS", {
          data: {
            type: "download",
            downloadContent: "",
          },
        });
      }
    },
  },
  template: `<el-dialog :visible.sync="visible" title="下载项目">
              <div v-loading="loading">
                <p>
                  <el-button  @click="downloadFull">一键下载(合并)</el-button>
                </p>
                <div class="tree-name">自定义下载</div>
                <div class="files-tree">
                  <el-tree
                    v-loading="treeLoading"
                    :data="filesTree"
                    show-checkbox
                    node-key="name"
                    ref="tree"
                    :props="defaultProps">
                  </el-tree>
                </div>
                <div class="tree-upload-btn">
                 <el-button @click="downFilesFromTree">自定义下载</el-button>
                </div>
                <p>
                  <el-button  @click="downloadProject">全量下载(不做合并处理，全部已ps平台为准)</el-button>
                </p>
              </div>
            </el-dialog>`,
});
