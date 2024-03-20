/**
 * @author weism
 * copyright 2015 Qcplay All Rights Reserved.
 *
 * 保存场景
 */

COMMAND_D.registerCmd({
    name : 'SAVE_SCENE',
    main : function(socket, cookie, data) {
        var path = data.path;
        var json = data.data;
        // world的position和scale保持不变，避免多人协同操作时的冲突
        json.data.position[2] = 0;
        json.data.position[3] = 0;
        json.data.position[4] = 0;
        json.data.position[5] = 0;
        
        json.data.scaleX[1] = 1;
        json.data.scaleY[1] = 1;
        if (typeof G.config.project.sceneVersion === 'undefined' || data.sceneVersion === G.config.project.sceneVersion || data.force) {
            var ret = SCENE_MANAGER_D.saveScene(path, json);
            if (ret) {
                // 重新生成游戏启动文件
                debug('update scene settings.');
                PROJECT_D.genGameHTML();
            }
            return {
                operRet: true,
                sceneVersion: G.config.project.sceneVersion
            };
        } else {
          return {
            operRet: false
          };
        }
    }
});
