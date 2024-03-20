namespace ps {

    /** 视频节点数据对象类型 */
    export type MapVideoNodeUUIDType = { [key: string]: string };

    /**
     * 多视频列表管理器组件
     * @description 多视频列表管理器组件，新版PS工具使用
     * @author bin
     * @date 2021/09/03 15:11:10
     */
    export class VideosManager extends Behaviour {
        /** 场景ID对应当前场景所有节点 */
        private _mapVideoNodes: { [key: string]: MapVideoNodeUUIDType };
        /** 场景ID对应当前场景所有节点 */
        public get mapVideoNodes(): { [key: string]: MapVideoNodeUUIDType } {
            return this._mapVideoNodes;
        }
        public set mapVideoNodes(value: { [key: string]: MapVideoNodeUUIDType }) {
            this._mapVideoNodes = value;
        }

        /** 场景最大视频节点数量 */
        private _maxNodesCnt = 4;
        /** 场景最大视频节点数量 */
        public get maxNodesCnt(): number {
            return this._maxNodesCnt;
        }
        public set maxNodesCnt(value: number) {
            this._maxNodesCnt = value;
        }

        /** 视频类型 */
        public get videoType(): VideoType {
            return qici.config.videoType || "mp4";
        }

        /** 记录所有需预加载场景视频是否加载完成 */
        private _mapAllSceneVideoLoaded: { [key: string]: boolean; } = {};
        public get mapAllSceneVideoLoaded(): { [key: string]: boolean; } {
            return this._mapAllSceneVideoLoaded;
        }
        public set mapAllSceneVideoLoaded(value: { [key: string]: boolean; }) {
            this._mapAllSceneVideoLoaded = value;
        }

        constructor(gameObject: qc.Node) {
            super(gameObject);
            this.runInEditor = true;
        }

        /** 序列化 */
        private serializableFields: unknown = {
            mapVideoNodes: qc.Serializer.MAPPING,
            maxNodesCnt: qc.Serializer.NUMBER,
        };

        /** 组件被激活后执行 */
        public awake() {
            // console.info("[info] VideosManager.awake");
            // 监听场景中所有的视频节点，加载完成视频时，触发 gameReady
            if (this.videoType === "ts") {
                if (this.gameObject.children[0] && !Tools.objIsNull(this.mapVideoNodes)) {
                    this.addEventListenerLoaded(this.gameObject.children[0].uuid);
                } else {
                    Print.green("当前无场景节点，自动触发 gameReady");
                    this.gameReady();
                }
            } else {
                if (!Tools.objIsNull(this.mapVideoNodes)) {
                    for (const sceneUUID in this.mapVideoNodes) {
                        if (Object.prototype.hasOwnProperty.call(this.mapVideoNodes, sceneUUID)) {
                            this.addEventListenerLoaded(sceneUUID);
                        }
                    }
                } else {
                    Print.green("当前无视频节点，自动触发 gameReady");
                    this.gameReady();
                }
            }
        }

        /**
         * 监听场景中所有的视频节点，加载完成视频时，触发 gameReady
         * @param sceneUUID 场景节点UUID
         * @returns 
         */
        private addEventListenerLoaded(sceneUUID: string) {
            if (!this.mapVideoNodes || !this.mapVideoNodes[sceneUUID] || Object.keys(this.mapVideoNodes[sceneUUID]).length <= 0) {
                // Print.green("当前场景无视频节点，自动触发 gameReady");
                this.onGameReadyByAllVideoNodeLoaded(sceneUUID);
                return;
            }
            this.mapAllSceneVideoLoaded[sceneUUID] = false;
            const mapSceneMap = this.mapVideoNodes[sceneUUID];
            const keys = Object.keys(mapSceneMap);
            for (let i = 0; i < keys.length; i++) {
                const uuid = mapSceneMap[keys[i]];
                const node = this.game.nodePool.find(uuid);
                if (!node || !node.parent) {
                    this.onGameReadyByAllVideoNodeLoaded(sceneUUID);
                } else {
                    const video = node.getScript(Video) as Video;
                    if (!video.videoLoaded) {
                        video.eventDisp.addOnce(VideoEvent.LOAD_COMPLETE, this.onGameReadyByAllVideoNodeLoaded.bind(this, sceneUUID), this);
                    } else {
                        this.onGameReadyByAllVideoNodeLoaded(sceneUUID);
                    }
                }
            }
        }

        private gameReady() {
            hasVideosReady = true;
            // 兼容 PT 转 PS 的模版，里面没有 ps.checkReady 方法，需要调用 gameReady 并且调用 checkLaunch
            if (typeof checkReady === 'function') {
                checkReady()
            } else {
                if (hasReady && hasVideosReady) {
                    Print.green("gameReady");
                    if (window["gameReady"]) {
                        try {
                            window["gameReady"]();
                        }
                        catch (error) {
                            console.error(error);
                        }
                    }
                }
                checkLaunch();
            }
        }

        /**
         * 需预加载场景中所有的视频节点，加载完成视频时，触发 gameReady
         * @param sceneUUID 场景节点UUID
         * @returns 场景中对应的视频节点，是否加载完成视频
         */
        private onGameReadyByAllVideoNodeLoaded(sceneUUID: string) {
            const isAllLoaded = this.checkAllVideoNodeIsLoaded(sceneUUID);
            if (sceneUUID != void 0) {
                this.mapAllSceneVideoLoaded[sceneUUID] = isAllLoaded;
            }
            if (isAllLoaded) {
                if (this.checkAllSceneVideoIsLoaded()) {
                    // Print.green("需预加载场景中所有的视频节点，加载完成视频，触发 gameReady");
                    this.gameReady();
                }
            }
        }

        /**
         * 检查场景中对应的视频节点，是否加载完成视频
         * @param sceneUUID 场景节点UUID
         * @param videoUUID 视频节点UUID
         * @returns 场景中对应的视频节点，是否加载完成视频
         */
        public checkVideoNodeIsLoaded(sceneUUID: string, videoUUID: string): boolean {
            const mapSceneMap = this.mapVideoNodes[sceneUUID];
            if (!mapSceneMap) {
                return;
            }
            const uuid = mapSceneMap[videoUUID];
            const node = this.game.nodePool.find(uuid);
            if (!node || !node.parent) {
                // 容错：节点为空、被移除时默认为加载完成
                return true;
            }
            const video = node.getScript(Video) as Video;
            return video.videoLoaded;
        }

        /**
         * 检查所有需预加载场景中所有视频节点，是否加载完成视频
         * @returns 需预加载场景中所有视频节点，是否加载完成视频
         */
        public checkAllSceneVideoIsLoaded(): boolean {
            let isAllLoaded = true;
            for (const sceneUUID in this.mapAllSceneVideoLoaded) {
                if (Object.prototype.hasOwnProperty.call(this.mapAllSceneVideoLoaded, sceneUUID)) {
                    const videoLoaded = this.mapAllSceneVideoLoaded[sceneUUID];
                    if (!videoLoaded) {
                        isAllLoaded = false;
                        break;
                    }
                }
            }
            return isAllLoaded;
        }

        /**
         * 检查场景中所有的视频节点，是否加载完成视频
         * @param sceneUUID 场景节点UUID
         * @returns 场景中所有的视频节点，是否加载完成视频
         */
        public checkAllVideoNodeIsLoaded(sceneUUID: string): boolean {
            let isAllLoaded = true;
            const mapScene = this.mapVideoNodes[sceneUUID];
            if (mapScene) {
                const keys = Object.keys(mapScene);
                for (let i = 0; i < keys.length; i++) {
                    const videoUUID = keys[i];
                    const videoLoaded = this.checkVideoNodeIsLoaded(sceneUUID, videoUUID);
                    if (!videoLoaded) {
                        isAllLoaded = false;
                        break;
                    }
                }
            }
            return isAllLoaded;
        }

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
        public addVideoNode(sceneUUID: string, videoUUID: string) {
            let mapSceneMap: string | MapVideoNodeUUIDType | { [key: string]: MapVideoNodeUUIDType } = this.mapVideoNodes && this.mapVideoNodes[sceneUUID] != void 0 ? this.mapVideoNodes[sceneUUID] : {};
            if (mapSceneMap && Object.keys(mapSceneMap).length > this.maxNodesCnt) {
                console.warn("[warn] 当前尝尽视频节点数量超过最大限制", "sceneUUID:", sceneUUID, "videoUUID:", videoUUID);
                return;
            }
            mapSceneMap = this.addNodeToMap(mapSceneMap, videoUUID, videoUUID);
            this.mapVideoNodes = this.addNodeToMap(this.mapVideoNodes, sceneUUID, mapSceneMap) as { [key: string]: MapVideoNodeUUIDType };
            return this.mapVideoNodes;
        }

        /**
         * 删除场景中对应的视频节点
         * @param sceneUUID 场景节点UUID
         * @param videoUUID 视频节点UUID
         * @returns 如果 Map 对象中存在该元素，则移除它并返回 true；否则如果该元素不存在则返回 false。
         */
        public deleteVideoNode(sceneUUID: string, videoUUID: string): boolean {
            const mapSceneMap = this.mapVideoNodes[sceneUUID];
            const isHasDelete = mapSceneMap[videoUUID] != void 0;
            Object.keys(mapSceneMap).length === 0 && delete this.mapVideoNodes[sceneUUID];
            return isHasDelete;
        }

        /**
         * 删除场景中所有的视频节点
         * @param sceneUUID 场景节点UUID
         * @returns 如果 Map 对象中存在该元素，则移除它并返回 true；否则如果该元素不存在则返回 false。
         */
        public deleteAllVideoNode(sceneUUID: string): boolean {
            return delete this.mapVideoNodes[sceneUUID];
        }

        /**
         * 添加一个节点到指定的Map数据上，并返回新的 Map 对象
         * @param map Map 对象（单个场景/视频节点的 Map 对象）
         * @param strUUID UUID（单个场景/视频节点的UUID）
         * @returns 返回新的 Map 对象
         */
        private addNodeToMap(map: MapVideoNodeUUIDType | { [key: string]: MapVideoNodeUUIDType }, strUUID: string, strOrMap: string | MapVideoNodeUUIDType | { [key: string]: MapVideoNodeUUIDType }): MapVideoNodeUUIDType | { [key: string]: MapVideoNodeUUIDType } {
            if (map) {
                map[strUUID] = strOrMap as string | MapVideoNodeUUIDType;
            } else {
                map = { [strUUID]: strOrMap } as MapVideoNodeUUIDType;
            }
            return map;
        }
    }
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
}