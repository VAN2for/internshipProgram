/**
 * @author weism
 * copyright 2015 Qcplay All Rights Reserved.
 *
 * 用户的逻辑脚本维护
 * 数据来源：GAME_FILES_D
 */
var fs = fsExtra;
var fsEx = FS_EXPAND_D;

var jsExtMap = {};

/**
 * 获取某个目录下的脚本载入次序信息
 */
function getScriptOrder(dir) {
    if (dir === 'Scripts') return GAME_FILES_D.logicalScriptOrder || [];
    if (dir === 'Editor') return GAME_FILES_D.editorScriptOrder || [];
    if (dir === 'Editor/Service') return GAME_FILES_D.editorServiceScriptOrder || [];
    return [];
};

/**
 * 设置脚本依赖顺序
 */
function setScriptOrder(dir, order) {
    if (!order) order = [];

    trace('Set script order, path : {0}, order : {1}', dir, order);

    if (dir === 'Scripts') {
        GAME_FILES_D.logicalScriptOrder = order;
        save();

        // 重新生成游戏启动文件
        debug('save logical script setting, generate html.');
        PROJECT_D.genGameHTML();
    }
    else if (dir === 'Editor') {
        GAME_FILES_D.editorScriptOrder = order;
        save();

        // 重新生成游戏启动文件
        debug('save editor script setting, generate html.');
        G.emitter.emit('refreshStartupFile');
    }
    else if (dir === 'Editor/Service') {
        GAME_FILES_D.editorServiceScriptOrder = order;
        save();
    }
    else
        return;
};

/**
 * 获取某个目录下的脚本，需要按照依赖关系排序
 */
function getScripts(dir, except) {
    // 收集所有的脚本文件
    var uuid2file = GAME_FILES_D.uuid2file;

    var order = getScriptOrder(dir);

    var scriptFile = {};
    var weight, orderLen = order.length;

    for (var uuid in uuid2file) {
        var path = uuid2file[uuid];
        if (path.indexOf(dir) === 0) {
            if (except) {
                // 是否属于排除的对象
                var len = except.length;
                var isException = false;
                while (len-- && !isException) {
                    isException = path.indexOf(except[len]) === 0;
                }
                if (isException) {
                    continue;
                }
            }
            for (weight = 0; weight < orderLen; weight++)
                if (path.indexOf(order[weight]) === 0)
                    break;

            scriptFile[path] = weight;
        }
    }

    // 根据权重排序
    var arr = Object.keys(scriptFile);
    arr.sort(function (key1, key2) {
        return scriptFile[key1] - scriptFile[key2];
    });
    if (dir === 'Scripts') {
        // User Scripts时需要把Scripts/vp导入, VPComponent.js不用导入
        for (var uuid in uuid2file) {
            if (uuid2file[uuid].indexOf('Scripts/vp') === 0 && uuid2file[uuid].indexOf('VPComponent') === -1) {
                arr.push(uuid2file[uuid]);
            }
        }
        // VPComponent业务逻辑js放在最后面
        for (var uuid in uuid2file) {
            if (/VPComponent_[0-9a-fA-F]{8}.js/.test(uuid2file[uuid])) {
                arr.push(uuid2file[uuid]);
            }
        }
    }

    return arr;
};

/**
 * 按照脚本依赖，获取所有的逻辑脚本列表
 */
function getUserScripts(subPackageScripts) {
    // 取得用户自定义脚本，强制在Game/Scripts目录下
    var scripts = getScripts('Scripts', ['Scripts/vp', 'Scripts/LanguageTrigger.js']);
    scripts = PROJECT_D.filterSubPackageScripts(scripts, subPackageScripts);
    return scripts;
};

/**
 * 获取编辑器扩展的脚本列表
 */
function getEditorExtends() {
    // 获取用户的编辑器扩展脚本，强制在Game/Editor目录下
    return getScripts('Editor', ['Editor/Service']);
};

/**
 * 获取后台扩展的脚本列表
 */
function getServiceExtends() {
    return getScripts('Editor/Service');
};

/**
 * 打印逻辑脚本
 */
function printLogicScripts(publish) {
    var scripts = getUserScripts();
    var content = '';
    for (var i in scripts) {
        var s = scripts[i];
        if (!publish) {
            // 后面挂载个随机字符串，确保浏览器不会加载缓存的代码
            s = addJsExtToDenyCache(s);
        }
        content += "\t\t\t" + "'./" + s + "',\n";
    }
    return content;
};

/**
 * 打印编辑器扩展脚本
 */
function printEditorExtends() {
    var template = '    <script src="__FILE__"></script>\n';
    var scripts = getEditorExtends();
    var content = '';
    for (var i in scripts) {
        content += template.replace(/__FILE__/g, '' + scripts[i]);
    }
    return content;
};

// 替换 __LOADING_ASSET_COUNT__
function replaceLoadingAssetCount(content, publish) {
    var assetCount = 0;

    if (!G.config.project.loading) {
        if (publish) {
            // 发布，则读 entryScene 对应的 state 文件
            var entryScene = G.config.scene.entryScene;

            var fullPath = fsEx.expandPath(path.join(G.gameRoot, entryScene)) + '.state';
            var state = fs.readJSONFileSync(fullPath);
            for (var key in state.dependences) {
                if (key != "__builtin_resource__")
                    assetCount += 1;
            }
        }
        else {
            var fullPath = fsEx.expandPath(path.join(G.gameRoot, 'Temp/scene_editor.state'));
            var state = fs.readJSONFileSync(fullPath);
            for (var key in state.dependences) {
                if (key != "__builtin_resource__")
                    assetCount += 1;
            }
        }
    }

    content = content.replace(/__LOADING_ASSET_COUNT__/g, assetCount);

    return content;
};

/**
 * 加工 StartGame/StartScene 模板
 */
function genTemplateContent(content, publish, libVersion, platform) {
    // uuid to url map
    var urlMapPath = './Assets/meta/globalUrlMap.js';

    if (publish) {
        if (G.config.project.appCache)
            content = content.replace(/__MANIFEST__/g, 'manifest="qici.appcache"');
        else
            content = content.replace(/__MANIFEST__/g, '');
    }
    else {
        // 增加唯一标记码确保不被缓存
        // urlMapPath = addJsExtToDenyCache(urlMapPath, true);
    }

    content = content.replace(/__URLMAP_SCRIPTS__/g, "'" + urlMapPath + "',");

    //Aries
    content = content.replace(/__URLMAP___PUBLISH/g, "Assets/meta/globalUrlMap.js");
    
    //多语言系统接口
    if (G.config.project.useLanguages)
        content = content.replace(/__LANGUAGES_MGR___PUBLISH/g, '"../lib/expand/languagesMgr/languagesMgr.js",');
    else
        content = content.replace(/__LANGUAGES_MGR___PUBLISH/g, '');
    
    // 生成逻辑脚本（如果有明确指定 userScripts 则直接使用这一份）
    content = content.replace(/__USER_SCRIPTS__/g, printLogicScripts(publish));
    
    // 替换配置文件
    var config = fs.readFileSync(path.join(G.editorRoot, 'Template/html_config.templet.js'), 'utf8');
    content = content.replace(/__CONFIG__/g, config);

    // 所有的场景
    var scenes = '';
    for (var i in G.config.scene.scene) {
        if (i !== '0' || !publish)
            scenes += ',\n                ';

        var s = G.config.scene.scene[i];
        scenes += '"' + s + '"';
    }
    content = content.replace(/__SCENE_LIST__/g, scenes);

    // 获取配置
    var frameRate = G.config.project.frameRate,
        renderer = G.config.project.renderer,
        developerMode = G.config.project.developerMode,
        dirtyRectangles = G.config.project.dirtyRectangles,
        dirtyRectanglesShow = G.config.project.dirtyRectanglesShow;

    if (platform === 'android') {
        frameRate = {
            mobile: G.config.project.android.frameRate,
            desktop: G.config.project.android.frameRate
        };
        renderer = G.config.project.android.renderer;
        developerMode = G.config.project.android.developerMode;
        dirtyRectangles = G.config.project.android.dirtyRectangles;
        dirtyRectanglesShow = G.config.project.android.dirtyRectanglesShow;
    }
    else if (platform === 'ios') {
        frameRate = {
            mobile: G.config.project.ios.frameRate,
            desktop: G.config.project.ios.frameRate
        };
        renderer = G.config.project.ios.renderer;
        developerMode = G.config.project.ios.developerMode;
        dirtyRectangles = G.config.project.ios.dirtyRectangles;
        dirtyRectanglesShow = G.config.project.ios.dirtyRectanglesShow;
    }

    // 替换其他数据
    content = content.replace(/__GAME_NAME__/g, G.config.project.gameName);
    content = content.replace(/__LOCAL_STORAGE_ID__/g, G.config.project.localStorageID);
    content = content.replace(/__GAME_INSTANCE__/g, G.config.project.gameInstance);
    content = content.replace(/__FRAMERATE__/g, JSON.stringify(frameRate));
    content = content.replace(/__FIXEDGAMESIZE__/g, JSON.stringify(G.config.project.fixedGameSize));
    content = content.replace(/__RESOLUTIONRATIO__/g, JSON.stringify(G.config.project.resolutionRatio));
    content = content.replace(/__CUSTOM_SETTINGS__/g, JSON.stringify(G.config.project.customSettings || {}));
    content = content.replace(/__BACKGROUNDCOLOR__/g, G.config.project.backgroundColor);
    content = content.replace(/__RUNINBACKGROUND__/g, G.config.project.runInBackground);
    content = content.replace(/__USE_LANGUAGES__/g, G.config.project.useLanguages);
    content = content.replace(/__ANTIALIAS__/g, G.config.project.antialias);
    content = content.replace(/__TRANSPARENT__/g, G.config.project.transparent);
    content = content.replace(/__RENDERER__/g, renderer);
    content = content.replace(/__ENTRY_SCENE__/g, G.config.scene.entryScene);
    content = content.replace(/__LOADINGPREFAB__/g, G.config.project.loading || '');

    content = content.replace(/__DIRTYRECTAGNLES__/g, dirtyRectangles);
    content = content.replace(/__DIRTYRECTAGNLESSHOW__/g, dirtyRectanglesShow);
    content = content.replace(/{__ver__}/g, libVersion === undefined ? G.VERSION : libVersion);

    var meta = "    <meta name='viewport' content='width=device-width,user-scalable=no'>\n" +
        "    <meta name='apple-mobile-web-app-status-bar-style' content='black-translucent'>\n" +
        "    <meta name='apple-mobile-web-app-capable' content='yes'>\n" +
        "    <meta name='apple-mobile-web-app-title' content='" + G.config.project.gameName + "'>\n";

    content = content.replace(/__VIEWPORT__/g, meta);

    if (publish) {
        content = content.replace(/__DEVELOPERMODE__/g, developerMode);
    }
    else {
        content = content.replace(/__DEVELOPERMODE__/g, 'true');
    }
    if (G.config.project.isNewPS) {
        content = content.replace(/__initResizableGameSize__/g, fs.readFileSync(path.join(G.editorRoot, 'Template/html_initResizableGameSizePS.templet.js'), 'utf8'));
    } else {
        content = content.replace(/__initResizableGameSize__/g, fs.readFileSync(path.join(G.editorRoot, 'Template/html_initResizableGameSize.templet.js'), 'utf8'));
    }
    content = content.replace(/__INIT_SIMPLE__/g, fs.readFileSync(path.join(G.editorRoot, 'Template/html_init_simple.templet.js'), 'utf8'));

    content = replaceLoadingAssetCount(content, publish);

    // 给个事件（允许在关注中被修改）
    var eventInfo = {
        content: content,
        publish: publish
    };
    G.emitter.emit('genTemplateContent', eventInfo);

    return eventInfo.content;
};

/**
 * application cache 的 __PUBLISH_ASSETS__ 替换
 */
function genCacheAssetsContent(content, publish) {
    if (publish) {
        // 发布，则读 entryScene 对应的 state 文件，取得依赖的资源文件名
        var entryScene = G.config.scene.entryScene + '.bin';

        var urlList = [entryScene];
        var visited = {};

        var findPrefab = function (prefabUrl, type) {
            // 已经访问过的资源
            if (visited[prefabUrl]) return;
            visited[prefabUrl] = true;

            fullPath = fsEx.expandPath(path.join(G.gameRoot, prefabUrl));
            fullPath = fullPath.replace('.bin', type);
            var prefab = fs.readJSONFileSync(fullPath);
            for (var key in prefab.dependences) {
                if (key != "__builtin_resource__") {
                    var url = GAME_FILES_D.uuid2file[key];
                    if (url && urlList.indexOf(url) === -1) {
                        if (/\.(mp3|ogg|mp3\.bin|ogg\.bin)$/.test(url.toLowerCase()))
                            addSoundCache(url, urlList);
                        else
                            urlList.push(url);
                    }

                    if (url.indexOf('prefab') !== -1)
                        // 预制资源还需要取得其依赖的资源
                        findPrefab(url, '.prefab');
                }
            }
        };

        findPrefab(entryScene, '.state');
        if (urlList.length > 0) {
            var str = urlList.join('\n');
            content = content.replace(/__PUBLISH_ASSETS__/g, str);
        }
    }

    return content;
};

// sound 文件需要将各个类型都加入 cache 中
function addSoundCache(url, urlList) {
    var prefix = url.match(/(.*)\.(mp3|ogg)/)[1];
    url = prefix + '.mp3';
    if (urlList.indexOf(url) === -1)
        urlList.push(url);
    url = prefix + '.mp3.bin';
    if (urlList.indexOf(url) === -1)
        urlList.push(url);
    url = prefix + '.ogg';
    if (urlList.indexOf(url) === -1)
        urlList.push(url);
    url = prefix + '.ogg.bin';
    if (urlList.indexOf(url) === -1)
        urlList.push(url);
}

/**
 * 序列化
 */
function save() {
    fs.writeJSONFileSync(G.gameRoot + 'ProjectSetting/script.setting', {
        logicalScriptOrder: GAME_FILES_D.logicalScriptOrder,
        editorScriptOrder: GAME_FILES_D.editorScriptOrder
    });
};

/**
 * 反序列化
 */
function restore() {
    var jsonData = fs.readJSONFileSync(G.gameRoot + 'ProjectSetting/script.setting') || {};
    GAME_FILES_D.logicalScriptOrder = jsonData.logicalScriptOrder || [];
    GAME_FILES_D.editorScriptOrder = jsonData.editorScriptOrder || []
};

/**
 * 为 JS 加入后缀，用于强行防止浏览器缓存
 */
function addJsExtToDenyCache(key, forceRefresh) {
    var rawKey = key;
    key = toUnixPath(key);

    var extInfo = jsExtMap[key];
    if (extInfo && extInfo.ext && !forceRefresh)
        // 上次的后缀还有效
        return rawKey + '?' + extInfo.ext;

    // 无效，生成新的后缀
    if (!extInfo)
        extInfo = jsExtMap[key] = {};

    // 规则：使用 20151014000000 这种 ext
    // 如果同一秒内连续两次生成，则需要增加后缀 20151014000000_1

    var ext = formattedTime();
    if (ext === extInfo.baseExt) {
        // 重复了
        extInfo.cookie = 1 + (extInfo.cookie || 0);
    }
    else {
        extInfo.baseExt = ext;
        extInfo.cookie = 0;
    }

    // 如果有 cookie，则拼接为 ext_cookie 形式，否则直接 ext
    // 即同一秒内，只调用一次，则形如 20151014000000
    // 如果2次或以上调用，则形如 20151014000000_2
    extInfo.ext = extInfo.baseExt + (extInfo.cookie ? '_' + (extInfo.cookie + 1) : '');

    return rawKey + '?' + extInfo.ext;
};

/**
 * 清空所有JS extension 记录
 */
function clearAllJsExt() {
    jsExtMap = {};
};

/**
 * 标记 js 为脏，此后 addJsExtToDenyCache 就要全新生成一个
 */
function markJsExtDirty(key) {
    if (!G.gameRoot) return;
    key = path.relative(G.gameRoot, key);
    key = key.replace(/\\/g, '/');
    var double = /\/\//;
    while (key.match(double))
        key = key.replace(double, '/');

    var extInfo = jsExtMap[key];
    if (!extInfo) return;
    delete extInfo.ext;
};

// 模块析构函数
function destruct() {
}

// 模块构造函数
function create() {
}

// 导出模块
global.USER_SCRIPTS_D = module.exports = {
    getScriptOrder: getScriptOrder,
    setScriptOrder: setScriptOrder,
    getUserScripts: getUserScripts,
    getEditorExtends: getEditorExtends,
    getServiceExtends: getServiceExtends,
    printEditorExtends: printEditorExtends,
    printLogicScripts: printLogicScripts,
    genTemplateContent: genTemplateContent,
    genCacheAssetsContent: genCacheAssetsContent,
    addSoundCache: addSoundCache,
    addJsExtToDenyCache: addJsExtToDenyCache,
    clearAllJsExt: clearAllJsExt,
    markJsExtDirty: markJsExtDirty,
    save: save,
    restore: restore,
    destruct: destruct,
    create: create,
}

// 执行模块构造函数
create();
