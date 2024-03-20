/**
 * upload-test
 * yicai.jin
 */
var uploadTest = new Vue({
  el: "#project-upload-test",
  template: `<el-dialog
                title="mpub提测"
                :visible.sync="dialogVisible"
                width="55%"
                :before-close="handleClose"
                >
                <div v-loading="loading">
                    <el-form :model="form" label-width="150px" size="medium" >
                        <el-form-item label="执行的命令：">
                            <el-input v-model="form.pre_command"></el-input>
                        </el-form-item>
                        <el-form-item label="素材基础包文件路径：">
                            <el-input v-model="form.zip_file"></el-input>
                        </el-form-item>
                        <el-form-item label="用户ID：">
                            <el-input v-model="form.user_id"></el-input>
                        </el-form-item>
                        <el-form-item label="需求ID：">
                            <el-input v-model="form.demand_id"></el-input>
                        </el-form-item>
                        <el-form-item label="是否自测：">
                            <el-radio-group v-model="radio" v-model="form.self_test" >
                                <el-radio :label="true">是</el-radio>
                                <el-radio :label="false">否</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="测试人ID：">
                            <el-input v-model="form.tester_id"></el-input>
                        </el-form-item>
                        <el-form-item label="是否发送通知：">
                            <el-radio v-model="form.dingding_notify" :label="true">是</el-radio>
                            <el-radio v-model="form.dingding_notify" :label="false">否</el-radio>
                        </el-form-item>
                        <el-form-item label="机器人的token：">
                            <el-input v-model="form.dingding_token"></el-input>
                        </el-form-item>
                        <el-form-item label="要通知人员手机号码：">
                            <el-input v-model="form.at_mobiles"></el-input>
                        </el-form-item>
                        <el-form-item label="素材更新说明：">
                            <el-input type="textarea" v-model="form.comment"></el-input>
                        </el-form-item>
                    </el-form>
                    <div class =stdioMeg >{{stdioMeg}}</div>
                    <div class = "form-btn">
                        <el-button type="primary" @click="submitForm">确 定</el-button>
                        <el-button @click="handleClose">取 消</el-button>
                    </div>
                </div>
              </el-dialog>`,
  data: function () {
    return {
      loading: true,
      dialogVisible: false,
      stdioMeg: "",
      form: {
        pre_command: "",
        zip_file: "./Build/project.zip",
        user_id: 0,
        demand_id: 0,
        self_test: true,
        tester_id: 19,
        dingding_notify: true,
        dingding_token: "",
        at_mobiles: "",
        comment: "",
      },
    };
  },
  methods: {
    show() {
      this.dialogVisible = true;
      window.G.service.request(
        "UPLOAD_MPUB",
        {
          data: {
            type: "readMpub",
            content: "",
          },
        },
        (mpubContent) => {
          this.loading = false;
          Object.assign(this.$data.form, mpubContent);
        }
      );
    },
    submitForm() {
      this.loading = true;
      this.form.user_id = parseInt(this.form.user_id);
      this.form.demand_id = parseInt(this.form.demand_id);
      this.form.tester_id = parseInt(this.form.tester_id);
      window.G.service.request(
        "UPLOAD_MPUB",
        {
          data: {
            type: "writeMpub",
            content: this.form,
          },
        },
        (stdioMeg) => {
          this.stdioMeg = stdioMeg;
          this.loading = false;
        }
      );
    },
    handleClose() {
      this.stdioMeg = ""
      this.dialogVisible = false;
    }
  },
});
