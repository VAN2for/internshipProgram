/**
 * @author Yicai.jin
 *
 * 转化后端返回的下载树
 * 创建新工程
 */
var request = require("sync-request");
var config = require('../config/index');

COMMAND_D.registerCmd({
  name: "GET_DOWNLOAD_FILESTREE",
  main: function (socket, cookie, data) {
    let files = [];
    function getResData(callback) {
      let res = request(
        "GET",
        "https://" + config.prod.domain + "/openapi/internal/playsmart/list-files?access_token=" + config.prod.token + "&pid=" +
          G.config.project.projectId
      );
      let resData = JSON.parse(res.getBody("utf8"));
      files = resData.data.result.items;
      callback(files);
    }
    function changItemToChildren(files) {
      if (!files) {
        return;
      }
      files.forEach((file) => {
        let val = file.name.match(/\/(\S*)\/$/);
        val = val ? val[1] : file.name;
        let index = val.lastIndexOf("/");
        val = val.slice(index + 1);
        file.label = val;
        file.name = file.name.slice(1)
        if (file.items) {
          file.children = file.items;
          changItemToChildren(file.items);
          delete file.items;
        }
      });
    }
    getResData(changItemToChildren);
    //排序
    function filesSort(filesArr) {
      let folder = []; //文件夹
      let file = []; //文件
      filesArr.forEach((item) => {
        if (item.children && item.children[0]) {
          folder.push(item);
          item.children = filesSort(item.children);
        } else {
          file.push(item);
        }
      });
      folder.sort();
      file.sort();
      return folder.concat(...file);
    }
    
    return filesSort(files);
  },
});
