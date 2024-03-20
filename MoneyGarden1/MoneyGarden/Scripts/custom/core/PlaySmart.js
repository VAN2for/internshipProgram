/** 版本 */
var PS_VERSION = "2.6.1";
/** qc接口对象 */
var qc_game;
/** phaser接口对象 */
var game;
/** box2d物理世界对象 */
var box2d;
/** 场景对象根节点 */
var UIRoot;
/** playSmart框架 */
var ps;
(function (ps) {
    /** 渠道 */
    ps.channel = "local";
    /** 环境 */
    ps.ENV = "RELEASE";
    /** 全屏触摸遮罩 */
    var touchMask;
    /** 游戏状态控制 */
    ps.mainState = new ps.GameState();
    /** 玩家自己gameRetry不更新动态参数。仓库在线制作、实时预览需要通过gameRetry更新动态参数 */
    ps.playerRetry = false;
    /** 项目配置 */
    ps.cfg = {
        AUDIO_PATH: "resource",
        /** 背景音名，默认为空。无背景音时不播放 */
        BGM_NAME: "",
        /** 自动播放BGM,默认自动播放 */
        AUTO_PLAY_BGM: true,
        /** 自动gameStart(调试用) */
        AUTO_GAMESTART: true,
        /** 显示fps数据 */
        SHOW_FPS: true,
        /** 使用gameConfig.json */
        USE_CONFIG_JSON: true,
        /** 拥有开始界面 */
        HAS_START_PANEL: true,
        /** 拥有ending界面 */
        HAS_ENDING_PANEL: true,
    };
    /** 调试配置(方便调试用，在调试模式下会覆盖项目配置) */
    ps.debugCfg = {
        /** 自动gameStart(调试用) */
        AUTO_GAMESTART: true,
        /** 显示fps数据 */
        SHOW_FPS: false,
        USE_CONFIG_JSON: false,
    };
    //-----------------------------------------------------
    ps.hasReady = false;
    ps.hasStart = false;
    ps.hasLaunch = false;
    ps.loadScening = false;
    /** 是否自动播放 填false则需要点击才能播放,默认true */
    ps.withPlay = true;
    /** 框架全局初始化接口 */
    function init() {
        if (ps.hasLaunch)
            return;
        game = qc_game["phaser"];
        box2d = qc_game["box2d"];
        if (qici.config.editor)
            ps.editor = window.parent["G"];
        var urlChannel = getQueryString("channel");
        //渠道优先用url上channel参数值
        if (urlChannel) {
            ps.channel = urlChannel;
        }
        //MW配置信息
        if (window["MW_CONFIG"]) {
            if (!urlChannel)
                ps.channel = MW_CONFIG.channel;
        }
        if (window["playsound"] === false) {
            ps.Print.orange("playsound:false");
        }
        //打印信息
        printVersion();
    }
    ps.init = init;
    /** 加载结束 */
    function onLoaded() {
        console.log("config", ps.cfg);
        //
        ps.Audio.rootPath = ps.cfg.AUDIO_PATH;
        //根节点
        UIRoot = qc_game.world.getChildAt(0);
        //编辑器模式下
        if (qici.config.editor) {
            ps.Print.green("gameReady");
            if (window["gameReady"]) {
                try {
                    window["gameReady"]();
                }
                catch (error) {
                    console.error(error);
                }
            }
            return;
        }
        UIRoot.visible = false;
        //创建开始界面
        createStartPanel();
    }
    ps.onLoaded = onLoaded;
    /** 创建开始界面 */
    function createStartPanel() {
        if (!ps.cfg.HAS_START_PANEL) {
            onStartPanelLoaded();
            return;
        }
        //动态加载开始界面
        qc_game.assets.maxRetryTimes = 0;
        qc_game.assets.load("resource/start/start.bin", function (r) {
            if (r) {
                ps.startPanel = qc_game.add.clone(r, UIRoot);
            }
            else {
                ps.Print.red("start开始界面不存在");
            }
            onStartPanelLoaded();
        });
    }
    /** 开始界面加载结束 */
    function onStartPanelLoaded() {
        //调试参数
        if (ps.ENV === "DEBUG") {
            ps.cfg.AUTO_GAMESTART = ps.debugCfg.AUTO_GAMESTART;
            ps.cfg.SHOW_FPS = ps.debugCfg.SHOW_FPS;
            ps.cfg.USE_CONFIG_JSON = ps.debugCfg.USE_CONFIG_JSON;
        }
        if (ps.cfg.AUTO_GAMESTART) {
            ps.Print.orange("AUTO_GAMESTART");
            window["gameStart"]();
        }
        //初始化动态参数
        if (ps.cfg.USE_CONFIG_JSON)
            ps.GameConfig.init();
        console.log("GAME_CFG", ps.cfg.USE_CONFIG_JSON, GAME_CFG);
        //初始化完成
        ps.hasReady = true;
        ps.mainState.ready();
        ps.Print.green("gameReady");
        if (window["gameReady"]) {
            try {
                window["gameReady"]();
            }
            catch (error) {
                console.error(error);
            }
        }
        checkLaunch();
        //FPS工具
        if (ps.cfg.SHOW_FPS) {
            qc_game.assets.load("resource/prefab/FPS.bin", function (r) {
                qc_game.add.clone(r, UIRoot);
            });
        }
    }
    /** 真正的启动游戏 */
    function checkLaunch() {
        if (qici.config.editor)
            return;
        if (ps.hasLaunch)
            return;
        if (ps.hasReady && ps.hasStart) {
            ps.Print.green("gameLaunch");
            ps.hasLaunch = true;
            //需要在gamestart的时候初始化webaudio
            ps.Audio.playBGM(ps.cfg.BGM_NAME, "game", "mp3", ps.withPlay);
            //自动播放BGM
            if (ps.cfg.AUTO_PLAY_BGM != false)
                playBgSound();
            UIRoot.visible = true;
            //开始游戏
            gameStart();
        }
    }
    ps.checkLaunch = checkLaunch;
    //PL接口集===============================================================
    /** 已发送埋点列表 */
    var actionRecords = {};
    /** 埋点接口 */
    function sendAction(action) {
        if (actionRecords[action])
            return;
        actionRecords[action] = true;
        ps.Print.blue("sendAction " + action);
        if (window["HttpAPI"]) {
            try {
                window["HttpAPI"].sendPoint("action&action=" + action);
            }
            catch (error) {
                console.error(error);
            }
        }
    }
    ps.sendAction = sendAction;
    /**
     * 全屏诱导点击,点击后自动跳转商店，发送GameEnd
     * @param endType null表示不弹出结束界面,默认win
     */
    function induce(endType) {
        if (endType === void 0) { endType = "win"; }
        qc_game.input.onPointerDown.add(function () {
            ps.install(InstallType.Global);
            if (endType) {
                switch (endType) {
                    case "win":
                        ps.gameEnd();
                        break;
                    case "lose":
                        ps.gameEnd(false);
                        break;
                    case "null":
                        ps.gameEnd(true, 0, false);
                        break;
                }
            }
        });
    }
    ps.induce = induce;
    /**
     * 是否屏蔽素材内置全局可点
     * @description true: 屏蔽全局可点； false: 启动全局可点
     * @default false 默认为false, 只有头条、穿山甲、抖音、pangle渠道设置为true
     */
    function disable_global_click() {
        return ((window.MW_CONFIG && window.MW_CONFIG["disable_global_click"]) ||
            getQueryString("disable_global_click") == "true");
    }
    ps.disable_global_click = disable_global_click;
    /**
     * 是否屏蔽素材内置自动跳转逻辑
     * @description true: 屏蔽自动跳转； false: 启动自动跳转
     * @default false 默认为false, 只有输出给DSP的渠道设置为true
     */
    function disable_auto_click() {
        return ((window.MW_CONFIG && window.MW_CONFIG["disable_auto_click"]) ||
            getQueryString("disable_auto_click") == "true");
    }
    ps.disable_auto_click = disable_auto_click;
    /**
     * 是否屏蔽素材内置诱导跳转逻辑
     * @description true: 屏蔽诱导跳转； false: 启动诱导跳转
     * @default false 默认为false
     */
    function disable_yd_click() {
        return ((window.MW_CONFIG && window.MW_CONFIG["disable_yd_click"]) ||
            getQueryString("disable_yd_click") == "true");
    }
    ps.disable_yd_click = disable_yd_click;
    /** 跳转类型 */
    var InstallType;
    (function (InstallType) {
        InstallType[InstallType["None"] = 1] = "None";
        InstallType[InstallType["Global"] = 2] = "Global";
        InstallType[InstallType["Auto"] = 4] = "Auto";
        InstallType[InstallType["YouDao"] = 8] = "YouDao";
    })(InstallType = ps.InstallType || (ps.InstallType = {}));
    /** 要转成仓库的类型 */
    var installTypeWrap = [];
    installTypeWrap[InstallType.Global] = "globalClick";
    installTypeWrap[InstallType.Auto] = "autoClick";
    installTypeWrap[InstallType.YouDao] = "youdaoClick";
    /**
     *  安装接口
     * @param {InstallType} type 触发类型，默认为：InstallType.None 正常跳转
     * @description 只需要单种情况时，可以这样传：install(false, InstallType.Global)；
     * @description 当需要多种情况都存在时，可以这样传：install(false, InstallType.Global | InstallType.Auto | InstallType.YouDao)
     */
    function install(type) {
        if (type === void 0) { type = InstallType.None; }
        var installType = installTypeWrap[type & -type]; // 只取最右边第一个1的位。
        ps.Print.blue("install：" + installType);
        if (ps.ENV === "DEBUG")
            ps.PopBox.popLabel(UIRoot, "install", 60, "#FFFFFF");
        if (window["install"]) {
            try {
                window["install"]({ type: installType });
            }
            catch (error) {
                console.error(error);
            }
        }
    }
    ps.install = install;
    /**
     * 试玩真正开始的接口
     */
    function gameStart() {
        if (touchMask)
            touchMask.visible = false;
        ps.mainState.dispatch(ps.GameState.GAMESTART);
        if (!ps.startPanel)
            ps.mainState.start();
    }
    /**
     * 试玩结束接口,调用此接口会展示ending界面
     * @param result 试玩结果（成功失败),默认为true
     * @param delayShow ending界面延迟弹出时间
     * @param showEnding 展示ending界面，默认true
     */
    function gameEnd(result, delayShow, showEnding) {
        if (result === void 0) { result = true; }
        if (delayShow === void 0) { delayShow = 0; }
        if (showEnding === void 0) { showEnding = true; }
        if (!ps.mainState.end(result))
            return;
        ps.Print.blue("gameEnd " + result + " " + delayShow + " " + showEnding);
        if (window["gameEnd"]) {
            try {
                window["gameEnd"](result);
            }
            catch (error) {
                console.error(error);
            }
        }
        if (!showEnding)
            return;
        //
        return ps.timer.once(delayShow, function () {
            createEndingPanel();
        });
    }
    ps.gameEnd = gameEnd;
    /** 创建ending界面 */
    function createEndingPanel() {
        if (!ps.cfg.HAS_ENDING_PANEL)
            return;
        //动态加载
        qc_game.assets.load("resource/ending/ending.bin", function (r) {
            ps.endingPanel = qc_game.add.clone(r, UIRoot);
        });
    }
    //游戏开始或者重新开始的时候调用
    function retry() {
        ps.Print.blue("retry");
        if (window["gameRetry"]) {
            try {
                window["gameRetry"]();
            }
            catch (error) {
                console.error(error);
            }
        }
        if (!ps.loadScening)
            ps.timer.clearAll();
        if (game.tweens["_tweens"] && game.tweens["_tweens"].length) {
            game.tweens["_tweens"].forEach(function (tween) {
                if (tween)
                    ps.Tween.clear(tween);
            });
            game.tweens["_tweens"] = [];
        }
        //关闭EndingSmart做的结束页
        window["closeEnding"] && window["closeEnding"]();
        if (GameEvent && GameEvent.removeAll)
            GameEvent.removeAll();
        //重新加载场景
        ps.mainState.reset();
        ps.loadScening = true;
        qc_game.scene.load(qc_game.scene.current, false, undefined, function () {
            ps.loadScening = false;
            ps.hasReady = false;
            ps.hasLaunch = false;
            //重置状态
            ps.mainState.retry();
            createStartPanel();
        });
    }
    ps.retry = retry;
    //==============================================================
    /** 打印版本信息 */
    function printVersion() {
        var str = " PlaySmart v" + PS_VERSION + " ";
        str += "| jWebAudio " + jwv + " ";
        str += "| Channel " + ps.channel + " ";
        str += "| Env " + ps.ENV + " ";
        //str += `| enter ${config.ENTER_SCENE}`
        if (hasBase64())
            str += "| base64 ";
        //let colorList = ["#9854d8", "#6c2ca7", "#450f78"];
        var colorList = ["#fb8cb3", "#d44a52", "#871905"];
        //let colorList = ["#00cccc", "#00aaaa", "#006666"];
        console.log("%c %c %c" + str + "%c %c ", "background: " + colorList[0], "background: " + colorList[1], "color:#fff;background: " + colorList[2] + ";", "background: " + colorList[1], "background: " + colorList[0]);
    }
    ps.printVersion = printVersion;
})(ps || (ps = {}));
//SDK调用,游戏开始，一般用来播放背景音乐
function gameStart() {
    if (ps.hasStart) {
        ps.Print.red("ERROR:重复调用gameStart");
        return;
    }
    ps.Print.green("gameStart");
    ps.hasStart = true;
    ps.withPlay = arguments[0];
    ps.checkLaunch();
    document === null || document === void 0 ? void 0 : document.addEventListener("PLAYABLE:redirect", function (e) {
        if (e.detail.type == "ending") {
            ps.gameEnd(e.detail.params[0]);
        }
    });
}
//SDK调用,游戏结束
function gameClose() {
    //sdk关闭的时候调用js的这个方法，一定要加上！不然安卓可能无法销毁音乐
    //停止所有音乐音效
    window["destorySound"]();
}
