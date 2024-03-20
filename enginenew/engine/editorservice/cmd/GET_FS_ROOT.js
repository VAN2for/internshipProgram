/**
 * @author Yicai.jin
 *
 * 获取本地文件树
 * 创建新工程
 */
const path = require("path");
const fs = require("fs-extra");
COMMAND_D.registerCmd({
  name: "GET_FS_ROOT",
  main: function (socket, cookie, data) {
    var filesNameArr = [];
    let filePath = path.join(G.gameRoot);
    let originPathLen = filePath.length;
    let fileState = fs.statSync(filePath);
    let reg = /\\/g;
    function readdirs(dir, filesStats) {
      let val = dir.slice(originPathLen);
      val = val.replace(reg, "/");
      var result = {
        //构造文件夹数据
        id: filesStats.ino,
        label: path.basename(dir),
        path: dir,
        node: val,
      };
      var files = fs.readdirSync(dir); //同步拿到文件目录下的所有文件名
      result.children = files.map(function (file) {
        var subPath = path.join(dir, file); //拼接为相对路径
        var stats = fs.statSync(subPath); //拿到文件信息对象
        let val = subPath.slice(originPathLen);
        val = val.replace(reg, "/");
        if (stats.isDirectory()) {
          //判断是否为文件夹类型
          return readdirs(subPath, stats); //递归读取文件夹
        }
        return {
          //构造文件数据
          id: stats.ino,
          label: file,
          path: subPath,
          node: val,
        };
      });
      return result; //返回数据
    }
    filesNameArr.push(readdirs(filePath, fileState));
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

    return filesSort(filesNameArr[0].children);
  },
});
