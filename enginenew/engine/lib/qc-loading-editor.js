/**
 * @author weism
 * 在编辑器模式下的启动
 */

// 内置的启动场景，启动后即刻载入入口场景
qici.splashState = {
    init: function () {
        var game = window[qici.config.gameInstance];
        try {
            if (window.parent && window.parent !== window && window.parent.G) {
                game.getWindow = function () {
                    return window;
                };
                window.parent.G.game = game;
                window.parent.G.e.emit(window.parent.G.e.SCENE_INITED, null);
            }
        } catch(e) {}

        if (qici.config.preview === true) {
            if (game.device.desktop) {
                window.initResizableGameSize && initResizableGameSize();
            }
            else {
                game.fullScreen();
            }
        }
        //PS框架初始化
        ps.ENV = qici.config.editor ? "EDITOR" : "DEBUG";
        ps.init();
    },

    preload: function () {
        // 由于 webstorm 的 web 容器不是及时刷新，必须在 webstorm 的目录树中操作才刷新
        // 导致我们外部新增资源的时候，无法加载到资源
        // 这里统一改为从 Node 后台下载资源
        var game = window[qici.config.gameInstance];
        try {
            if (window.parent && window.parent !== window && window.parent.G) {
                var service = window.parent.G.service;
                game.assets.baseURL = 'http://' + service.ip + ':' + service.port + '/';
            }
        } catch(e) {}

        // 加载切屏的动画预制
        if (qici.config.editor !== true) {
            if (qici.config.loadingPrefab)
                game.assets.load('__loading_prefab__', qici.config.loadingPrefab);
            game.updateScale(true);
        }

        //加载动态参数文件
        var key = "gameConfig";
        var url = "resource/config/gameConfig.json";
        game.phaser.load.json(key, url);

        // console.log("game.config.useLanguages", game.config.useLanguages);
        // console.log("game.useLanguages", game.useLanguages);
        if (game.config.useLanguages) {
            //加载多语言系统配置文件
            key = "languages";
            url = "resource/config/languages.json";
            game.phaser.load.json(key, url);

            //预加载多语言资源
            var res;
            if (hasBase64()) {
                res = ps.Tools.strToJson(assetsBase64()["languages_json"]);
            }
            var langArr = [];

            if (res && res.languages) {
                for (var key in res.languages) {
                    var lang = res.languages[key];
                    if (lang) {
                        langArr.push(key);
                    }
                }
            }
            // console.log('langArr', langArr);

            var assets = qc_game.assets._uuid2UrlConf;
            if (assets) {
                for (var key in assets) {
                    var url = assets[key];
                    var beforeIdx = url.indexOf("-");
                    if (beforeIdx === -1) continue;

                    var afterIdx = url.lastIndexOf(".");
                    if (afterIdx === -1) afterIdx = url.length;
                    var lang = url.slice(beforeIdx + 1, afterIdx);
                    if (!lang) continue;
                    //如果base64中存在多语言配置，只加载配置里存在的语言资源
                    if (langArr.length > 0 && langArr.indexOf(lang) === -1) continue;
                    // console.log(url)
                    qc_game.assets.load(url, url);
                }
            }
        }
    },

    create: function () {
        // 初始化用户场景信息
        var game = window[qici.config.gameInstance];
        game.scene.entry = qici.config.entryScene;
        game.scene.list = qici.config.scene;

        // 修改默认帧率
        if (qici.config.frameRate) game.time.applyFrameRate(qici.config.frameRate);

        // 挂载切屏场景的动画，并设置为切屏不析构
        var node;
        if (qici.config.editor !== true && qici.config.loadingPrefab) {
            var prefab = game.assets.find('__loading_prefab__');
            if (prefab) {
                node = game.add.clone(prefab);
                node.ignoreDestroy = true;
                node.visible = false;
            }
        }
        // 进入第一个场景(需要用户第一个场景资源下载完毕才能进入)
        var loadEntryScene = function () {
            game.scene.load(game.scene.entry, false, function () {
                console.log('Loading assets for entry scene.');
            }, function () {
                console.log('Finish loading assets for entry scene.');
                //加载完成
                ps.onLoaded();
                try {
                    if (window.parent && window.parent.G && window.parent.G.qcplay) {
                        window.parent.G.e.emit(window.parent.G.e.SCENE_LOADED, null);
                    }
                } catch (e){}
            });
        };
        game.scene.pendLoadComplete = true;
        game.timer.add(1, loadEntryScene);
    }
};