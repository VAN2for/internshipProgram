var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var ps;
(function (ps) {
    /**
     * 多视频列表管理器组件
     * @description 多视频列表管理器组件，新版PS工具使用
     * @author bin
     * @date 2021/09/03 15:11:10
     */
    var VideosManager = /** @class */ (function (_super) {
        __extends(VideosManager, _super);
        function VideosManager(gameObject) {
            var _this = _super.call(this, gameObject) || this;
            /** 场景最大视频节点数量 */
            _this._maxNodesCnt = 4;
            /** 记录所有需预加载场景视频是否加载完成 */
            _this._mapAllSceneVideoLoaded = {};
            /** 序列化 */
            _this.serializableFields = {
                mapVideoNodes: qc.Serializer.MAPPING,
                maxNodesCnt: qc.Serializer.NUMBER,
            };
            _this.runInEditor = true;
            return _this;
        }
        Object.defineProperty(VideosManager.prototype, "mapVideoNodes", {
            /** 场景ID对应当前场景所有节点 */
            get: function () {
                return this._mapVideoNodes;
            },
            set: function (value) {
                this._mapVideoNodes = value;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(VideosManager.prototype, "maxNodesCnt", {
            /** 场景最大视频节点数量 */
            get: function () {
                return this._maxNodesCnt;
            },
            set: function (value) {
                this._maxNodesCnt = value;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(VideosManager.prototype, "videoType", {
            /** 视频类型 */
            get: function () {
                return qici.config.videoType || "mp4";
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(VideosManager.prototype, "mapAllSceneVideoLoaded", {
            get: function () {
                return this._mapAllSceneVideoLoaded;
            },
            set: function (value) {
                this._mapAllSceneVideoLoaded = value;
            },
            enumerable: false,
            configurable: true
        });
        /** 组件被激活后执行 */
        VideosManager.prototype.awake = function () {
            // console.info("[info] VideosManager.awake");
            // 监听场景中所有的视频节点，加载完成视频时，触发 gameReady
            if (this.videoType === "ts") {
                if (this.gameObject.children[0]) {
                    this.addEventListenerLoaded(this.gameObject.children[0].uuid);
                }
                else {
                    ps.Print.green("当前无场景节点，自动触发 gameReady");
                    this.gameReady();
                }
            }
            else {
                for (var sceneUUID in this.mapVideoNodes) {
                    if (Object.prototype.hasOwnProperty.call(this.mapVideoNodes, sceneUUID)) {
                        this.addEventListenerLoaded(sceneUUID);
                    }
                }
            }
        };
        /**
         * 监听场景中所有的视频节点，加载完成视频时，触发 gameReady
         * @param sceneUUID 场景节点UUID
         * @returns
         */
        VideosManager.prototype.addEventListenerLoaded = function (sceneUUID) {
            if (!this.mapVideoNodes || !this.mapVideoNodes[sceneUUID] || Object.keys(this.mapVideoNodes[sceneUUID]).length <= 0) {
                // Print.green("当前场景无视频节点，自动触发 gameReady");
                this.onGameReadyByAllVideoNodeLoaded(sceneUUID);
                return;
            }
            this.mapAllSceneVideoLoaded[sceneUUID] = false;
            var mapSceneMap = this.mapVideoNodes[sceneUUID];
            var keys = Object.keys(mapSceneMap);
            for (var i = 0; i < keys.length; i++) {
                var uuid = mapSceneMap[keys[i]];
                var node = this.game.nodePool.find(uuid);
                if (!node || !node.parent) {
                    this.onGameReadyByAllVideoNodeLoaded(sceneUUID);
                }
                else {
                    var video = node.getScript(ps.Video);
                    if (!video.videoLoaded) {
                        video.eventDisp.addOnce(ps.VideoEvent.LOAD_COMPLETE, this.onGameReadyByAllVideoNodeLoaded.bind(this, sceneUUID), this);
                    }
                    else {
                        this.onGameReadyByAllVideoNodeLoaded(sceneUUID);
                    }
                }
            }
        };
        VideosManager.prototype.gameReady = function () {
            ps.hasVideosReady = true;
            if (ps.hasReady && ps.hasVideosReady) {
                ps.Print.green("gameReady");
                if (window["gameReady"]) {
                    try {
                        window["gameReady"]();
                    }
                    catch (error) {
                        console.error(error);
                    }
                }
            }
            ps.checkLaunch();
        };
        /**
         * 需预加载场景中所有的视频节点，加载完成视频时，触发 gameReady
         * @param sceneUUID 场景节点UUID
         * @returns 场景中对应的视频节点，是否加载完成视频
         */
        VideosManager.prototype.onGameReadyByAllVideoNodeLoaded = function (sceneUUID) {
            var isAllLoaded = this.checkAllVideoNodeIsLoaded(sceneUUID);
            if (sceneUUID != void 0) {
                this.mapAllSceneVideoLoaded[sceneUUID] = isAllLoaded;
            }
            if (isAllLoaded) {
                if (this.checkAllSceneVideoIsLoaded()) {
                    // Print.green("需预加载场景中所有的视频节点，加载完成视频，触发 gameReady");
                    this.gameReady();
                }
            }
        };
        /**
         * 检查场景中对应的视频节点，是否加载完成视频
         * @param sceneUUID 场景节点UUID
         * @param videoUUID 视频节点UUID
         * @returns 场景中对应的视频节点，是否加载完成视频
         */
        VideosManager.prototype.checkVideoNodeIsLoaded = function (sceneUUID, videoUUID) {
            var mapSceneMap = this.mapVideoNodes[sceneUUID];
            if (!mapSceneMap) {
                return;
            }
            var uuid = mapSceneMap[videoUUID];
            var node = this.game.nodePool.find(uuid);
            if (!node || !node.parent) {
                // 容错：节点为空、被移除时默认为加载完成
                return true;
            }
            var video = node.getScript(ps.Video);
            return video.videoLoaded;
        };
        /**
         * 检查所有需预加载场景中所有视频节点，是否加载完成视频
         * @returns 需预加载场景中所有视频节点，是否加载完成视频
         */
        VideosManager.prototype.checkAllSceneVideoIsLoaded = function () {
            var isAllLoaded = true;
            for (var sceneUUID in this.mapAllSceneVideoLoaded) {
                if (Object.prototype.hasOwnProperty.call(this.mapAllSceneVideoLoaded, sceneUUID)) {
                    var videoLoaded = this.mapAllSceneVideoLoaded[sceneUUID];
                    if (!videoLoaded) {
                        isAllLoaded = false;
                        break;
                    }
                }
            }
            return isAllLoaded;
        };
        /**
         * 检查场景中所有的视频节点，是否加载完成视频
         * @param sceneUUID 场景节点UUID
         * @returns 场景中所有的视频节点，是否加载完成视频
         */
        VideosManager.prototype.checkAllVideoNodeIsLoaded = function (sceneUUID) {
            var isAllLoaded = true;
            var mapScene = this.mapVideoNodes[sceneUUID];
            if (mapScene) {
                var keys = Object.keys(mapScene);
                for (var i = 0; i < keys.length; i++) {
                    var videoUUID = keys[i];
                    var videoLoaded = this.checkVideoNodeIsLoaded(sceneUUID, videoUUID);
                    if (!videoLoaded) {
                        isAllLoaded = false;
                        break;
                    }
                }
            }
            return isAllLoaded;
        };
        // /** 试玩初始化的处理 */
        // public onInit() {
        //     // console.info("[info] VideosManager.onInit");
        // }
        // /** 试玩开始时的处理 */
        // public onStart() {
        //     // console.info("[info] VideosManager.onStart");
        // }
        // /** 当脚本被移除时，会自动调用 */
        // public onDestroy() {
        //     // console.info("[info] VideosManager.onDestroy");
        // }
        /**
         * 添加视频节点
         * @param sceneUUID 场景节点UUID
         * @param videoUUID 视频节点UUID
         * @returns 返回新的 Map 对象
         */
        VideosManager.prototype.addVideoNode = function (sceneUUID, videoUUID) {
            var mapSceneMap = this.mapVideoNodes && this.mapVideoNodes[sceneUUID] != void 0 ? this.mapVideoNodes[sceneUUID] : {};
            if (mapSceneMap && Object.keys(mapSceneMap).length > this.maxNodesCnt) {
                console.warn("[warn] 当前尝尽视频节点数量超过最大限制", "sceneUUID:", sceneUUID, "videoUUID:", videoUUID);
                return;
            }
            mapSceneMap = this.addNodeToMap(mapSceneMap, videoUUID, videoUUID);
            this.mapVideoNodes = this.addNodeToMap(this.mapVideoNodes, sceneUUID, mapSceneMap);
            return this.mapVideoNodes;
        };
        /**
         * 删除场景中对应的视频节点
         * @param sceneUUID 场景节点UUID
         * @param videoUUID 视频节点UUID
         * @returns 如果 Map 对象中存在该元素，则移除它并返回 true；否则如果该元素不存在则返回 false。
         */
        VideosManager.prototype.deleteVideoNode = function (sceneUUID, videoUUID) {
            var mapSceneMap = this.mapVideoNodes[sceneUUID];
            var isHasDelete = mapSceneMap[videoUUID] != void 0;
            Object.keys(mapSceneMap).length === 0 && delete this.mapVideoNodes[sceneUUID];
            return isHasDelete;
        };
        /**
         * 删除场景中所有的视频节点
         * @param sceneUUID 场景节点UUID
         * @returns 如果 Map 对象中存在该元素，则移除它并返回 true；否则如果该元素不存在则返回 false。
         */
        VideosManager.prototype.deleteAllVideoNode = function (sceneUUID) {
            return delete this.mapVideoNodes[sceneUUID];
        };
        /**
         * 添加一个节点到指定的Map数据上，并返回新的 Map 对象
         * @param map Map 对象（单个场景/视频节点的 Map 对象）
         * @param strUUID UUID（单个场景/视频节点的UUID）
         * @returns 返回新的 Map 对象
         */
        VideosManager.prototype.addNodeToMap = function (map, strUUID, strOrMap) {
            var _a;
            if (map) {
                map[strUUID] = strOrMap;
            }
            else {
                map = (_a = {}, _a[strUUID] = strOrMap, _a);
            }
            return map;
        };
        return VideosManager;
    }(ps.Behaviour));
    ps.VideosManager = VideosManager;
    qc.registerBehaviour('ps.VideosManager', VideosManager);
    VideosManager['__menu'] = 'Custom/VideosManager';
    /**
    帧回调（preUpdate、update、postUpdate）
    如果实现了这几个函数，系统会自动每帧进行调度（当挂载的Node节点处于可见、并且本脚本的enable=true时）
    初始化（awake）
    如果实现了awake函数，系统会在Node节点构建完毕（反序列化完成后）自动调度
    脚本可用/不可用（onEnable、onDisable）
    当脚本的enable从false->true时，会自动调用onEnable函数；反之调用onDisable函数
    ps:在awake结束时,如果当前脚本的enable为true，会自动调用onEnable函数
    交互回调（onClick、onUp、onDown、onDrag、onDragStart、onDragEnd）
    当挂载的Node具备交互时，一旦捕获相应的输入事件，这些函数会自动被调用
    脚本析构（onDestroy）
    当脚本被移除时，会自动调用onDestroy函数，用户可以定义必要的资源回收代码
    //PlaySmart新增回调(继承ps.Behaviour)
    pl状态回调(onInit、onStart、onEnding、onRetry)
    如果实现了这几个函数，会在pl进行到相应状态的时候进行回调
    */
})(ps || (ps = {}));
