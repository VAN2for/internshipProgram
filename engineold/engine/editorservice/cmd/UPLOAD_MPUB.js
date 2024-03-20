/**
 * @author yicai.jin
 * check or generate mpub.yaml file
 * October 11th,2022
 */
const path = require("path");
const { execSync } = require("child_process");
const fs = require("fs-extra");
const yaml = require("js-yaml");

COMMAND_D.registerCmd({
  name: "UPLOAD_MPUB",
  main: function (socket, cookie, data) {
    const { type } = data.data;
    const { content } = data.data;
    //读取文件
    function readMpub(dir) {
      let content = {};
      let state = fs.statSync(dir);
      if (state.isDirectory()) {
        let files = fs.readdirSync(dir);
        let mpubFile = files.find((item) => item == "mpub.yaml");
        if (mpubFile) {
          //有mpub这个文件
          let mpub = path.join(G.gameRoot, mpubFile);
          content = yaml.load(fs.readFileSync(mpub, "UTF-8"));
        }
      }
      return content;
    }
    //写入文件
    function writeMpub(content) {
      content = JSON.parse(JSON.stringify(content));
      content = yaml.dump(content);
      try {
        fs.writeFileSync(path.join(G.gameRoot, "mpub.yaml"), content, "utf8");
      } catch (err) {
        throw new Error("写入mpub文件错误", err);
      }
    }
    if (type == "readMpub") {
      return readMpub(G.gameRoot);
    }
    if (type == "writeMpub") {
      writeMpub(content);
      let stdMessage = "";
      try {
        stdMessage = execSync("mpub", {
          cwd: G.gameRoot,
          // env: {
          //   MPUB_API_HOST: "https://playable.dev.com:8066",
          //   MPUB_API_TOKEN: 123,
          // },
          encoding: "utf8",
        });
        let reg = /发布结果\s\+=*\+\n((.|\n)*)/;
        stdMessage = stdMessage.match(reg)[1];
      } catch (err) {
        stdMessage = err;
        console.log("上传测试失败", err);
      }
      return stdMessage;
    }
  },
});
