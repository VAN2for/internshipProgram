/**
 * Created by weism
 * 将Asset/state目录转换为Asset/scene目录
 */

var MY_FLAG = 5;

var fs = fsExtra;

var convert = function(dir) {
    var settingPath = path.join(dir, 'ProjectSetting/project.setting');
    var scenePath = path.join(dir, 'ProjectSetting/scene.setting');
    if (!fs.existsSync(settingPath) || !fs.existsSync(scenePath))
        return;

    var projectConf = null;
    var sceneConf = null;
    try {
        projectConf = fs.readJsonSync(settingPath, { throws : false });
        sceneConf = fs.readJsonSync(scenePath, { throws : false });
    }
    catch(e) {
    }
    if (!projectConf || !sceneConf) return;

    var toolFlag = projectConf.toolFlag || 0;
    if (toolFlag & (1 << MY_FLAG)) {
        // 处理过了
        return;
    }

    // 设置回写
    projectConf.toolFlag = (toolFlag | (1 << MY_FLAG));
    FS_EXPAND_D.writeJsonSync(settingPath, projectConf);

    // 转换state为scene
    for (var k in sceneConf.scene) {
        sceneConf.scene[k] = sceneConf.scene[k].replace('resource/state/', 'resource/scene/');
        sceneConf.scene[k] = sceneConf.scene[k].replace('resource\\state\\', 'resource\\scene\\');
    }
    FS_EXPAND_D.writeJsonFileSync(scenePath, sceneConf);

    // 改变目录名
    if (!fs.existsSync(path.join(dir, 'resource/scene')) &&
        fs.existsSync(path.join(dir, 'resource/state'))) {
        fs.rename(path.join(dir, 'resource/state'), path.join(dir, 'resource/scene'));
    }
};

PATCH_D.registerPatch(MY_FLAG, convert);
