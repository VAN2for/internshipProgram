var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
/** 版本 */
// @ts-ignore
var PS_VERSION = '2.7.0';
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
    ps.channel = 'local';
    /** 环境 */
    ps.ENV = 'RELEASE';
    /** 全屏触摸遮罩 */
    var touchMask;
    /** 游戏状态控制 */
    ps.mainState = new ps.GameState();
    /** 玩家自己gameRetry不更新动态参数。仓库在线制作、实时预览需要通过gameRetry更新动态参数 */
    ps.playerRetry = false;
    ps.enableAction = true;
    ps.enablePSScene = true; // 是否发 scene 埋点
    /** 项目配置 */
    ps.cfg = {
        AUDIO_PATH: 'resource',
        /** 背景音名，默认为空。无背景音时不播放 */
        BGM_NAME: '',
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
        /** 重玩援关闭埋点记录 */
        DISABLE_RETRY_ACTIONS: false,
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
    ps.hasVideosReady = false;
    ps.hasBgReady = false;
    ps.hasStart = false;
    ps.hasLaunch = false;
    ps.loadScening = false;
    /** 是否自动播放 填false则需要点击才能播放,默认true */
    ps.withPlay = true;
    /** 框架全局初始化接口 */
    ps.init = function () {
        if (ps.hasLaunch)
            return;
        game = qc_game['phaser'];
        box2d = qc_game['box2d'];
        if (qici.config.editor)
            ps.editor = window.parent['G'];
        var urlChannel = getQueryString('channel');
        //渠道优先用url上channel参数值
        if (urlChannel) {
            ps.channel = urlChannel;
        }
        //MW配置信息
        if (window['MW_CONFIG']) {
            if (!urlChannel)
                ps.channel = MW_CONFIG.channel;
        }
        if (window['playsound'] === false) {
            ps.Print.orange('playsound:false');
        }
        //打印信息
        ps.printVersion();
        ps.audioManager.initialize(ps.cfg.AUDIO_PATH + '/');
    };
    /** 加载结束 */
    ps.onLoaded = function () {
        console.log('config', ps.cfg);
        ps.Audio.rootPath = ps.cfg.AUDIO_PATH;
        //根节点
        UIRoot = qc_game.world.getChildAt(0);
        //编辑器模式下
        if (qici.config.editor) {
            ps.Print.green('gameReady');
            if (window['gameReady']) {
                try {
                    window['gameReady']();
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
    };
    /**
     * 是否可以发 gameReady
     * 发 gameReady 需要等待资源加载完毕才可以发
     * 如果有视频的话，需要等待视频加载完毕，再发
     * 如果有背景图片的话，需要等待背景图片加载完毕，再发
     */
    var hasSendGameReady = false;
    ps.checkReady = function () {
        // 如果 UIRoot 没有准备好 或者已经触发过 gameReady，直接 return
        if (!UIRoot || hasSendGameReady)
            return;
        var gamePlay = UIRoot.getChild('gamePlay');
        var videosManager = gamePlay &&
            gamePlay.VideosManager &&
            gamePlay.getScript('ps.VideosManager');
        var globalConfig = gamePlay &&
            gamePlay.GlobalConfigBg &&
            gamePlay.getScript('ps.GlobalConfigBg');
        // 如果有 videosManager ，需要判断 ps.hasVideosReady
        // 如果有 globalConfig ，需要判断 ps.hasBgReady
        var flag = ps.hasReady &&
            (!videosManager || ps.hasVideosReady) &&
            (!globalConfig || ps.hasBgReady);
        if (flag) {
            ps.Print.green('gameReady');
            hasSendGameReady = true;
            if (window['gameReady']) {
                try {
                    window['gameReady']();
                }
                catch (error) {
                    console.error(error);
                }
            }
            ps.checkLaunch();
        }
    };
    /** 创建开始界面 */
    function createStartPanel() {
        if (!ps.cfg.HAS_START_PANEL) {
            onStartPanelLoaded();
            return;
        }
        //动态加载开始界面
        qc_game.assets.maxRetryTimes = 0;
        qc_game.assets.load('resource/start/start.bin', function (r) {
            if (r) {
                ps.startPanel = qc_game.add.clone(r, UIRoot);
            }
            else {
                ps.Print.red('start开始界面不存在');
            }
            onStartPanelLoaded();
        });
    }
    /** 开始界面加载结束 */
    function onStartPanelLoaded() {
        //调试参数
        if (ps.ENV === 'DEBUG') {
            ps.cfg.AUTO_GAMESTART = ps.debugCfg.AUTO_GAMESTART;
            ps.cfg.SHOW_FPS = ps.debugCfg.SHOW_FPS;
            ps.cfg.USE_CONFIG_JSON = ps.debugCfg.USE_CONFIG_JSON;
        }
        if (ps.cfg.AUTO_GAMESTART) {
            ps.Print.orange('AUTO_GAMESTART');
            window['gameStart']();
        }
        //初始化动态参数
        if (ps.cfg.USE_CONFIG_JSON)
            ps.GameConfig.init();
        console.log('GAME_CFG', ps.cfg.USE_CONFIG_JSON, GAME_CFG);
        //初始化完成
        ps.hasReady = true;
        ps.mainState.ready();
        ps.checkReady();
        //FPS工具
        if (ps.cfg.SHOW_FPS) {
            qc_game.assets.load('resource/prefab/FPS.bin', function (r) {
                qc_game.add.clone(r, UIRoot);
            });
        }
    }
    /** 真正的启动游戏 */
    ps.checkLaunch = function () {
        if (qici.config.editor)
            return;
        if (ps.hasLaunch)
            return;
        if (ps.hasReady && ps.hasStart) {
            ps.Print.green('gameLaunch');
            ps.hasLaunch = true;
            //自动播放BGM
            if (ps.cfg.AUTO_PLAY_BGM != false) {
                var match = ps.cfg.BGM_NAME.match(/(.*)\/audio\/(.*)\.mp3/);
                if (match) {
                    var url = ps.cfg.BGM_NAME.replace(/^resource\//, '');
                    ps.initAudioManager(url, ps.withPlay);
                }
                else {
                    // 没有背景音乐也需要play空bgm,兼容gameStart(false)的渠道一进游戏就播放其他音效的问题
                    ps.initAudioManager('game/audio/bm_bgm0.mp3', ps.withPlay);
                }
            }
            UIRoot.visible = true;
            //开始游戏
            gameStart();
        }
    };
    //PL接口集===============================================================
    /** 已发送埋点列表 */
    var actionRecords = {};
    /** 埋点接口 */
    ps.sendAction = function (action, force) {
        if (force === void 0) { force = false; }
        if (!ps.enableAction && !force)
            return;
        if (actionRecords[action])
            return;
        actionRecords[action] = true;
        ps.Print.blue('sendAction ' + action);
        if (window['HttpAPI']) {
            try {
                window['HttpAPI'].sendPoint('action&action=' + action);
            }
            catch (error) {
                console.error(error);
            }
        }
    };
    /** 场景埋点接口 */
    ps.sendPSScene = function (scene, force) {
        if (force === void 0) { force = false; }
        if (!ps.enablePSScene && !force)
            return;
        ps.Print.blue('sendPSScene' + scene);
        if (window['HttpAPI']) {
            try {
                window['HttpAPI'].sendPoint(scene);
            }
            catch (error) {
                console.error(error);
            }
        }
    };
    // 如果是 PT 转进来的模版，不允许发 ps 内置的 sendPSScene 方法
    if (UIRoot &&
        UIRoot.scripts &&
        UIRoot.scripts.length &&
        UIRoot.scripts.some(function (item) {
            return item.class == 'playsmart.editor.data';
        })) {
        ps.enablePSScene = !(UIRoot.getScript('playsmart.editor.data').$data &&
            UIRoot.getScript('playsmart.editor.data').$data.isTransformByPt);
    }
    /**
     * 全屏诱导点击,点击后自动跳转商店，发送GameEnd
     * @param endType null表示不弹出结束界面,默认win
     */
    ps.induce = function (endType) {
        if (endType === void 0) { endType = 'win'; }
        qc_game.input.onPointerDown.add(function () {
            ps.install(InstallType.Global);
            if (endType) {
                switch (endType) {
                    case 'win':
                        ps.gameEnd();
                        break;
                    case 'lose':
                        ps.gameEnd(false);
                        break;
                    case 'null':
                        ps.gameEnd(true, 0, false);
                        break;
                }
            }
        });
    };
    /**
     * 是否屏蔽素材内置全局可点
     * @description true: 屏蔽全局可点； false: 启动全局可点
     * @default false 默认为false, 只有头条、穿山甲、抖音、pangle渠道设置为true
     */
    ps.disable_global_click = function () {
        return ((window.MW_CONFIG && window.MW_CONFIG['disable_global_click']) ||
            getQueryString('disable_global_click') == 'true');
    };
    /**
     * 是否屏蔽素材内置自动跳转逻辑
     * @description true: 屏蔽自动跳转； false: 启动自动跳转
     * @default false 默认为false, 只有输出给DSP的渠道设置为true
     */
    ps.disable_auto_click = function () {
        return ((window.MW_CONFIG && window.MW_CONFIG['disable_auto_click']) ||
            getQueryString('disable_auto_click') == 'true');
    };
    /**
     * 是否屏蔽素材内置诱导跳转逻辑
     * @description true: 屏蔽诱导跳转； false: 启动诱导跳转
     * @default false 默认为false
     */
    ps.disable_yd_click = function () {
        return ((window.MW_CONFIG && window.MW_CONFIG['disable_yd_click']) ||
            getQueryString('disable_yd_click') == 'true');
    };
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
    installTypeWrap[InstallType.Global] = 'globalClick';
    installTypeWrap[InstallType.Auto] = 'autoClick';
    installTypeWrap[InstallType.YouDao] = 'youdaoClick';
    /**
     *  安装接口
     * @param {InstallType} type 触发类型，默认为：InstallType.None 正常跳转
     * @description 只需要单种情况时，可以这样传：install(false, InstallType.Global)；
     * @description 当需要多种情况都存在时，可以这样传：install(false, InstallType.Global | InstallType.Auto | InstallType.YouDao)
     */
    ps.install = function (type) {
        if (type === void 0) { type = InstallType.None; }
        var installType = installTypeWrap[type & -type]; // 只取最右边第一个1的位。
        ps.Print.blue('install：' + installType);
        if (ps.ENV === 'DEBUG')
            ps.PopBox.popLabel(UIRoot, 'install', 60, '#FFFFFF');
        if (window['install']) {
            try {
                window['install']({ type: installType });
            }
            catch (error) {
                console.error(error);
            }
        }
    };
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
    ps.gameEnd = function (result, delayShow, showEnding) {
        if (result === void 0) { result = true; }
        if (delayShow === void 0) { delayShow = 0; }
        if (showEnding === void 0) { showEnding = true; }
        if (!ps.mainState.end(result))
            return;
        ps.Print.blue("gameEnd ".concat(result, " ").concat(delayShow, " ").concat(showEnding));
        if (window['gameEnd']) {
            try {
                window['gameEnd'](result);
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
    };
    /** 创建ending界面 */
    function createEndingPanel() {
        if (!ps.cfg.HAS_ENDING_PANEL)
            return;
        //动态加载
        qc_game.assets.load('resource/ending/ending.bin', function (r) {
            ps.endingPanel = qc_game.add.clone(r, UIRoot);
        });
    }
    //游戏开始或者重新开始的时候调用
    ps.retry = function () {
        ps.Print.blue('retry');
        if (window['gameRetry']) {
            try {
                window['gameRetry']();
            }
            catch (error) {
                console.error(error);
            }
        }
        if (!ps.loadScening)
            ps.timer.clearAll();
        if (game.tweens['_tweens'] && game.tweens['_tweens'].length) {
            game.tweens['_tweens'].forEach(function (tween) {
                if (tween)
                    ps.Tween.clear(tween);
            });
            game.tweens['_tweens'] = [];
        }
        //关闭EndingSmart做的结束页
        window['closeEnding'] && window['closeEnding']();
        if (gameEvent && gameEvent.removeAll)
            gameEvent.removeAll();
        box2d === null || box2d === void 0 ? void 0 : box2d.getBodyList().forEach(function (body) { body.behaviour.destroy(); });
        //重新加载场景
        ps.mainState.reset();
        // 重玩前需要删除节点池里的节点,再重新加载场景,不然重新加载场景后节点的uuid会全变
        UIRoot.removeChildren();
        // @ts-ignore
        Object.keys(qc_game.nodePool._nodes).forEach(function (uuid) {
            if (uuid !== UIRoot.uuid) {
                // @ts-ignore
                qc_game.nodePool.remove(uuid);
            }
        });
        ps.loadScening = true;
        qc_game.scene.load(qc_game.scene.current, false, undefined, function () {
            ps.loadScening = false;
            ps.hasReady = false;
            ps.hasLaunch = false;
            hasSendGameReady = false;
            //重置状态
            ps.mainState.retry();
            createStartPanel();
        });
    };
    //==============================================================
    /** 打印版本信息 */
    ps.printVersion = function () {
        var str = " PlaySmart v".concat(PS_VERSION, " ");
        str += "| Channel ".concat(ps.channel, " ");
        str += "| Env ".concat(ps.ENV, " ");
        if (hasBase64())
            str += '| base64 ';
        var colorList = ['#fb8cb3', '#d44a52', '#871905'];
        console.log("%c %c %c".concat(str, "%c %c "), "background: ".concat(colorList[0]), "background: ".concat(colorList[1]), "color:#fff;background: ".concat(colorList[2], ";"), "background: ".concat(colorList[1]), "background: ".concat(colorList[0]));
    };
    /**
     * 通过自定义事件字段获取自定义对象数据
     * @param param 自定义事件字段
     * @returns 自定义事件对象数据
     */
    function getCustomEventByParam(param) {
        var eventName = param.eventName;
        var eventNameEn = param.eventNameEn;
        var currentScene = param.scene;
        var asts = currentScene.getScript('playsmart.editor.data').vpAst;
        var vpAst = Object.values(asts);
        var ast = vpAst.find(function (ast) {
            var isMatchCn = !eventName;
            var isMatchEn = !eventNameEn;
            if (!isMatchCn) {
                isMatchCn = ast.eventName === eventName;
            }
            if (!isMatchEn) {
                isMatchEn = ast.eventNameEn === eventNameEn;
            }
            return isMatchCn && isMatchEn && ast.condition[0].content === 'CUSTOM_EVENT';
        });
        if (!ast) {
            console.error('没有设置对应名字的自定义事件');
        }
        return ast;
    }
    ps.getCustomEventByParam = getCustomEventByParam;
    /**
     * 通过自定义事件字段获取自定义对象数据
     * @param param 自定义事件字段
     * @returns 自定义事件对象数据
     */
    function getCustomEventByCustomEventField(param) {
        var obj = typeof (param) === "string" ? JSON.parse(param) : param;
        var eventName = obj.eventName;
        var eventNameEn = obj.eventNameEn;
        var sceneUuid = typeof (param) === "string" ? obj.sceneUuid : obj.condition[0].node;
        var scene = qc_game.nodePool.find(sceneUuid);
        return getCustomEventByParam({ scene: scene, eventName: eventName, eventNameEn: eventNameEn });
    }
    ps.getCustomEventByCustomEventField = getCustomEventByCustomEventField;
    /**
     * 通过自定义事件参数，触发对应场景的自定义事件
     * @param param 自定义事件参数
     */
    ps.triggerCustomEvent = function (param) {
        var ast = getCustomEventByParam(param);
        if (ast) {
            ps.mainState.dispatch('CUSTOM_EVENT', ast.id);
        }
    };
    /**
     * 通过自定义事件字符串参数，触发对应场景的自定义事件
     * @param param 自定义事件字符串参数
     */
    ps.triggerCustomEventByCustomEventField = function (param) {
        var ast = getCustomEventByCustomEventField(param);
        if (ast) {
            ps.mainState.dispatch('CUSTOM_EVENT', ast.id);
        }
    };
    /**
     * 获取自定义事件响应动作的参数
     * @param param.scene  自定义事件的场景节点
     * @param param.eventName 自定义事件名字
     * @param param.index 自定义事件响应动作序号
     */
    ps.getCustomEventParam = function (param) {
        var ast = getCustomEventByParam(param);
        if (ast) {
            return ast.action[param.index].param;
        }
    };
    /**
     * 播放PS可视化平台（VisualProgram）自定义事件行为
     * @param action 事件行为
     */
    function playVpAction(action) {
        return __awaiter(this, void 0, void 0, function () {
            var node, script, method;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        node = qc_game.nodePool.find("".concat(action.node));
                        script = action.script ? node.getScript("".concat(action.script)) : null;
                        method = (script === null || script === void 0 ? void 0 : script["".concat(action.method)]) || node["".concat(action.method)];
                        return [4 /*yield*/, method.call(script || node, action.param)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    }
    ps.playVpAction = playVpAction;
    /**
     * 播放PS可视化平台（VisualProgram）自定义事件行为数组
     * @param action 事件行为数组
     */
    function playVpActions(actions) {
        return __awaiter(this, void 0, void 0, function () {
            var i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        i = 0;
                        _a.label = 1;
                    case 1:
                        if (!(i < actions.length)) return [3 /*break*/, 4];
                        return [4 /*yield*/, playVpAction(actions[i])];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/];
                }
            });
        });
    }
    ps.playVpActions = playVpActions;
    /**
     * 克隆一个事件对象
     * @param param 事件字符串参数
     * @returns 深度克隆后的事件对象
     */
    function cloneCustomEventByCustomEventField(param) {
        return ps.Tools.deepClone(getCustomEventByCustomEventField(param));
    }
    ps.cloneCustomEventByCustomEventField = cloneCustomEventByCustomEventField;
    /**
     * 克隆一个事件对象，并一一映射新的节点数据
     * @param param 事件字符串参数
     * @param nodes 要映射的新旧节点
     * @returns 深度克隆后的事件对象（映射成新节点后）
     */
    function cloneCustomEventByCustomEventFieldToNode(param, nodes) {
        var result = cloneCustomEventByCustomEventField(param);
        var action = result.action;
        var findActionByNode = function (node) {
            return action.find(function (a) { return a.node === node.uuid; });
        };
        var updateActionNodeUuid = function (from, to) {
            var act = findActionByNode(from);
            if (act)
                act.node = to.uuid;
            from.children.forEach(function (element, i) {
                updateActionNodeUuid(element, to.getChildAt(i));
            });
        };
        updateActionNodeUuid(nodes.from, nodes.to);
        return result;
    }
    ps.cloneCustomEventByCustomEventFieldToNode = cloneCustomEventByCustomEventFieldToNode;
})(ps || (ps = {}));
//SDK调用,游戏开始，一般用来播放背景音乐
function gameStart() {
    if (ps.hasStart) {
        ps.Print.red('ERROR:重复调用gameStart');
        return;
    }
    document === null || document === void 0 ? void 0 : document.addEventListener('PLAYABLE:switchScene', function (customEvent) {
        // 需要跳转的场景
        var scene = customEvent.detail.scene;
        // 素材跳转逻辑
        var mainBeh = UIRoot.getScript(MainBeh);
        var sceneNodes = mainBeh && mainBeh.sceneNodes && mainBeh.sceneNodes.length > 0
            ? mainBeh.sceneNodes
            : UIRoot.children[0].children;
        sceneNodes.forEach(function (sceneNode) {
            sceneNode.visible = sceneNode.name === scene;
        });
    });
    document === null || document === void 0 ? void 0 : document.addEventListener('PLAYABLE:redirect', function (e) {
        if (e.detail.type == 'ending') {
            ps.gameEnd(e.detail.params[0]);
        }
    });
    ps.Print.green('gameStart');
    ps.hasStart = true;
    ps.withPlay = arguments[0];
    //需要在gamestart的时候初始化webaudio
    ps.Audio.rootPath = ps.cfg.AUDIO_PATH;
    ps.checkLaunch();
}
//SDK调用,游戏结束
function gameClose() {
    //sdk关闭的时候调用js的这个方法，一定要加上！不然安卓可能无法销毁音乐
    //停止所有音乐音效
    window['destorySound']();
}
//# sourceMappingURL=PlaySmart.js.map