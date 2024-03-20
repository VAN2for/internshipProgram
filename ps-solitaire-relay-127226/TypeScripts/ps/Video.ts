namespace ps {
    /** 视频事件 */
    export enum VideoEvent {
        /** 加载完成 */
        LOAD_COMPLETE = "loadComplete",
        /** 播放开始 */
        PLAY_START = "playStart",
        /** 循环播放开始（每次播放开始，包含循环播放） */
        PLAY_LOOP_START = "playLoopStart",
        /** 播放完成 */
        PLAY_COMPLETE = "playComplete",
        /** 循环播放完成（每次播放完成，包含循环播放） */
        PLAY_LOOP_COMPLETE = "playLoopComplete",
        /** 播放停止 */
        PLAY_STOP = "playStop",
        /** 播放暂停 */
        PLAY_PAUSE = "playPause",
        /** 当父亲或自我的视觉属性发生变化时 */
        VISIBLE_CHANGE = "visibleChange",
        /** 节点层级位置发生变化时 */
        POS_LAYOUT_CHANGE = "posLayoutChange",
    }

    /**
     * 播放结束后停留位置
     */
    export enum PlayEndFrameType {
        /** 第一帧 */
        FIRST = 0,
        /** 最后一帧 */
        LAST = 1,
    }

    /**
     * 事件表参数类型
     */
    export type VpParam = {
        loopNumber: number;
        loop: true;
        // true 保持尾帧；false 第一帧
        playEndFrame: boolean;
    };

    /**
     * 请求视频数据类型
     */
    export type RequestDataType = {
        url: string;
        dataURL?: string | ArrayBuffer | null;
        objectURL?: string | ArrayBuffer | null;
        blob: Blob;
    };

    /**
     * 视频类型
     */
    export type VideoType = "mp4" | "ts";

    /** 已发起过请求的视频 */
    let __videoReqMap;
    /** 已发起过请求的视频 */
    export const _videoReqMap = () => {
        return __videoReqMap || (__videoReqMap = {});
    };

    /** 已缓存过的视频 */
    let __videoRoadedMap: { [key: string]: RequestDataType };
    /** 已缓存过的视频 */
    export const _videoRoadedMap = (): { [key: string]: RequestDataType } => {
        return __videoRoadedMap || (__videoRoadedMap = {});
    };

    /**
     * 视频组件
     * @description 视频组件，新版PS工具使用
     * @author JingBin
     */
    export class Video extends Behaviour {
        public gameObject: qc.Dom;

        /** 原视频URL */
        private _sourceVideoUrl = "";
        /** 原视频URL */
        public get sourceVideoUrl(): string {
            return this._sourceVideoUrl;
        }
        public set sourceVideoUrl(value: string) {
            this._sourceVideoUrl = value;
        }

        /** 原视频时长 */
        private _sourceVideoDuration = 0;
        /** 原视频时长 */
        public get sourceVideoDuration(): number {
            return this._sourceVideoDuration;
        }
        public set sourceVideoDuration(value: number) {
            this._sourceVideoDuration = value;
        }

        /** 当前视频URL */
        private _videoUrl = "";
        /** 当前视频URL */
        public get videoUrl(): string {
            return this._videoUrl;
        }
        public set videoUrl(value: string) {
            //根据 videoType 自动修改视频后缀
            const urlPrefix = value.split(".")[0];
            if (!urlPrefix) {
                console.warn(`视频路径：${value}有误，请检查！`);
                return;
            }
            value = `${urlPrefix}.${this.videoType}`;

            this._videoUrl = value;
            if (value) {
                this.loadVideo();
            }
        }

        /** 当前音频URL */
        private _audioUrl = "";
        /** 当前音频name */
        private _audioName = "";
        /** 当前音频URL */
        public get audioUrl(): string {
            return this._audioUrl;
        }
        public set audioUrl(value: string) {
            this._audioUrl = value;
            if (value) {
                this.loadAudio();
            }
        }
        /** 当前音频name */
        public get audioName(): string {
            if (!this._audioName) {
                var audioNames = this._audioUrl.split("/");
                this._audioName = audioNames[audioNames.length - 1].split(".")[0];
            }
            return this._audioName;
        }

        /** 播放结束后停留位置 0:第一帧，1:最后一帧 */
        private _playEndFrame: PlayEndFrameType = PlayEndFrameType.LAST;
        /** 播放结束后停留位置 0:第一帧，1:最后一帧 */
        public get playEndFrame(): PlayEndFrameType {
            return this._playEndFrame;
        }
        public set playEndFrame(value: PlayEndFrameType) {
            this._playEndFrame = value;
        }

        /** [<=0]:循环 [>0]:次数播放 */
        private _loopNumber = 1;
        /** [<=0]:循环 [>0]:次数播放 */
        public get loopNumber(): number {
            return this._loopNumber;
        }
        public set loopNumber(value: number) {
            this._loopNumber = value;
            if (value <= 0) {
                this._playTimes = -1;
            } else {
                this._playTimes = value;
            }
        }

        /** 剩余播放次数，[-1]:循环 [>0]:次数播放，播放一次减一次 [0]:播放完不再继续播放 */
        private _playTimes = 1;

        /** 上一次裁剪起始时间 */
        private _clipStartTime = 0;
        /** 上一次裁剪起始时间 */
        public get clipStartTime(): number {
            return this._clipStartTime;
        }
        public set clipStartTime(value: number) {
            this._clipStartTime = value;
        }

        /** 上一次裁剪结束时间 */
        private _clipEndTime = 0;
        /** 上一次裁剪结束时间 */
        public get clipEndTime(): number {
            return this._clipEndTime;
        }
        public set clipEndTime(value: number) {
            this._clipEndTime = value;
        }

        /** 加载完成自动播放视频 */
        private _autoPlay = true;
        /** 加载完成自动播放视频 */
        public get autoPlay(): boolean {
            return this._autoPlay;
        }
        public set autoPlay(value: boolean) {
            this._autoPlay = value;
        }

        /** 资源库资源ID */
        private _assetId = 0;
        /** 资源库资源ID */
        public get assetId(): number {
            return this._assetId;
        }
        public set assetId(value: number) {
            this._assetId = value;
        }

        /** 音频是否静音 */
        private _isMute = false;
        /** 音频是否静音 */
        public get isMute(): boolean {
            return this._isMute;
        }
        public set isMute(value: boolean) {
            this._isMute = value;
            if (value && this.audioUrl) {
                ps.Audio.stopSound(this.audioName, 'game');
            }
            if (this.videoCanvas && typeof ((this.videoCanvas as HTMLVideoElement).muted) === "boolean") {
                (this.videoCanvas as HTMLVideoElement).muted = value || ENV === "RELEASE";
            }
        }

        /** 当前视频预览图URL */
        private _videoCoverUrl = "";
        /** 当前视频预览图URL */
        public get videoCoverUrl(): string {
            return this._videoCoverUrl;
        }
        public set videoCoverUrl(value: string) {
            this._videoCoverUrl = value;
        }

        /** 视频类型 */
        public get videoType(): VideoType {
            return qici.config.videoType || "mp4";
        }

        /** 视频播放状态 */
        public get playing(): boolean {
            if (this.videoType === 'mp4' && this.player) {
                // @ts-ignore
                return !!(this.player.currentTime > 0 && !this.player.paused && !this.player.ended && this.player.readyState > 2)
            } else if (this.videoType === 'ts' && this.player) {
                return !this.player.paused
            }
            return false
        }

        public videoCanvas: HTMLCanvasElement | HTMLVideoElement;
        /** mp4视频player即为HTMLVideoElement */
        public player: Player | HTMLVideoElement;

        /** 视频是否加载完毕 */
        public videoLoaded: boolean;
        private _videoLoading: boolean;
        private _lastWinW: number;
        private _lastWinH: number;
        private _lastVideoCanvasW: number;
        private _lastVideoCanvasH: number;
        /** 记录上次的节点层级位置 */
        private _lastPos: number;

        /** 视频是否可以播放 */
        private _videoCanPlay: boolean;

        private _isStop = false;

        private isShowHideByVp = false;

        public vpActionConfig = {
            ReplayVideo: {
                type: "object",
                properties: {
                    loopNumber: {
                        title: "播放次数",
                        component: "input-number"
                    },
                    loop: {
                        title: "是否循环",
                        component: "switch"
                    },
                    playEndFrame: {
                        title: "保持尾帧",
                        component: "switch"
                    }
                },
                initData: {
                    loopNumber: 1,
                    loop: false,
                    playEndFrame: false
                },
                initFunc: function () { },
            },
            ResumeVideo: null,
            stopVideo: null
        };

        public vpAction = {
            ReplayVideo: {
                label: '从头播放视频',
                method: 'vpReplayVideo',
                category: '视频',
                target: true,
                paramLabel: 'target'
            },
            ResumeVideo: {
                label: '继续播放视频',
                method: 'vpResumeVideo',
                category: '视频',
                target: true,
                paramLabel: 'target'
            },
            pauseVideo: {
                label: '暂停播放视频',
                method: 'pause',
                category: '视频',
                target: true,
                paramLabel: 'target'
            }
        };

        public eventDisp: EventDispatcher = new EventDispatcher();

        /** 动态数据，可以减少脚本更新次数 */
        private _$data = {};

        public get $data() {
            return this._$data
        }

        public set $data(value) {
            this._$data = value;
        }

        /** 序列化 */
        private serializableFields = {
            sourceVideoUrl: qc.Serializer.STRING,
            sourceVideoDuration: qc.Serializer.NUMBER,
            videoUrl: qc.Serializer.STRING,
            audioUrl: qc.Serializer.STRING,
            playEndFrame: qc.Serializer.INT,
            loopNumber: qc.Serializer.INT,
            clipStartTime: qc.Serializer.NUMBER,
            clipEndTime: qc.Serializer.NUMBER,
            autoPlay: qc.Serializer.BOOLEAN,
            assetId: qc.Serializer.NUMBER,
            isMute: qc.Serializer.BOOLEAN,
            videoCoverUrl: qc.Serializer.STRING,
            $data: qc.Serializer.MAPPING
        };

        constructor(gameObject: qc.Node) {
            super(gameObject);
            this.runInEditor = true;
        }

        public awake() {
            // console.info("[info] Video.awake", this.name);
            this.gameObject.serializable = false;
            this._lastPos = this.gameObject.pos;

            // 把onVisibleChange函数hook一下
            const __onVisibleChange = this.gameObject.onVisibleChange.bind(this.gameObject);
            this.gameObject.onVisibleChange = (...args) => {
                __onVisibleChange(...args);
                this.onVisibleChange(true);
            };

            // 仅在编辑器环境下运行
            if (this.runInEditor && qici.config.editor) {
                this.onRefresh();
                this.onVisibleChange();
            }
        }

        /** 刷新重来。根据新的配置重新刷新视频 */
        public onRefresh() {
            this.onInit();
            // 只有编辑区才默认播放，其他环境都是等待 gameStart 再播放
            if (ENV === "EDITOR") {
                this.onGameStart();
            } else {
                this.gameStart();
            }
        }

        // public onClick() {
        //     this.play();
        //     this.gameObject.zIndex = 2;
        //     // // 节点位置，不显示（即临时从节点树中移除）
        //     // this.gameObject.pos = qc.Dom.POS_NONE;
        //     // // 节点位置，背景层（位于game.canvas之下）
        //     // this.gameObject.pos = qc.Dom.POS_BACK;
        //     // // 节点位置，顶层（位于game.canvas之上）
        //     // this.gameObject.pos = qc.Dom.POS_FRONT;
        // }

        public onEnable() {
            // console.info("[info] Video.onEnable");
            this.onRefresh();
        }

        public onDisable() {
            // console.info("[info] Video.onDisable");
            this.stop();
        }

        // public onDestroy() {
        //     console.info("[info] Video.onDestroy");
        // }

        /**
         * 当父亲或自我的视觉属性发生变化时，事件将被触发
         * @param isReload 是否重新加载视频、音频
         */
        private onVisibleChange(isReload = false) {
            // 事件系统设置视频显示隐藏时单独走的逻辑
            if (this.isShowHideByVp) {
                if (!this.gameObject.visible || !this.gameObject.worldVisible) {
                    this.pause();
                }
                // gameStart需要依赖isShowHideByVp来决定autoPlay=true时是否需要重新播放,所以延后一帧设回去原值
                setTimeout(() => {
                    this.isShowHideByVp = false;
                });
                return;
            }
            // console.info("[info] Video.onVisibleChange", this.gameObject.name, this.gameObject.parent?.name);
            if (!this.gameObject.visible || !this.gameObject.worldVisible) {
                // 初始化onload时，UIRoot.visible为false，worldVisible为false，此时是不需要进入这个逻辑的。
                if (!UIRoot || !UIRoot.visible) return;
                // 为什么这样改，因为 ios 15 上面，切换场景时，视频节点的父节点（QC.DOM）节点会提前一帧消失，导致切换场景会看到一帧的背景图片，也就是跳转闪烁问题，因此需要在切换场景时，延迟 100ms 再把视频节点设置为隐藏
                if (this.videoType === 'mp4' && this.videoCanvas && this.videoCanvas.parentElement) {
                    this.videoCanvas.parentElement.style.display = "block"
                    setTimeout(() => {
                        if (this.videoCanvas && this.videoCanvas.parentElement) {
                            this.videoCanvas.parentElement.style.display = "none"
                        }
                    }, 100);
                }
                this.stop();
                this.destroyVideo();
                this.eventDisp.dispatch(VideoEvent.VISIBLE_CHANGE, false);
            } else {
                const loadVideoCallback = () => {
                    if (this._videoCanPlay) {
                        this.onRefresh();
                        // 显示的时候需要更新一下状态
                        this.update();
                        this.eventDisp.dispatch(VideoEvent.VISIBLE_CHANGE, true);
                    } else {
                        setTimeout(() => {
                            loadVideoCallback()
                        }, 32)
                    }
                }
                if (isReload && this._isStop && this._videoLoading == false && this.videoLoaded == false) {
                    this.stop();
                    this.loadAudio();
                    // 如果是 mp4 资源，并且已经有 player 资源，直接复用即可，不需要重新触发 load
                    if (this.videoType === 'mp4' && this.player) {
                        this.videoLoaded = true
                        this._videoLoading = true
                        loadVideoCallback()
                    } else {
                        this.loadVideo(loadVideoCallback)
                    }

                } else {
                    loadVideoCallback()
                }
            }
        }

        /** 节点层级位置发生变化时，事件将被触发 */
        private onPosChange() {
            if (this.gameObject.pos !== this._lastPos) {
                // console.info("[info] Video.onPosChange", this.gameObject.pos);
                if (this._lastPos !== qc.Dom.POS_BACK && this._lastPos !== qc.Dom.POS_FRONT && (this.gameObject.pos === qc.Dom.POS_BACK || this.gameObject.pos === qc.Dom.POS_FRONT)) {
                    this.onRefresh();
                } else if ((this._lastPos === qc.Dom.POS_BACK || this._lastPos === qc.Dom.POS_FRONT) && this.gameObject.pos !== qc.Dom.POS_BACK && this.gameObject.pos !== qc.Dom.POS_FRONT) {
                    this.stop();
                }
                this._lastPos = this.gameObject.pos;
                this.eventDisp.dispatch(VideoEvent.POS_LAYOUT_CHANGE, this.gameObject.pos);
            }
        }

        /** 试玩初始化的处理 */
        public onInit() {
            // console.info("[info] Video.onInit", this.name);
            // 在这里初始化游戏场景需要的东西
            this._isStop = !this.gameObject.visible || !this.gameObject.worldVisible;
            if (this.loopNumber <= 0) {
                this._playTimes = -1;
            } else {
                this._playTimes = this.loopNumber;
            }
            this.gameObject.div.style.display = "block";
        }

        /** 试玩开始时的处理 */
        public onGameStart() {
            this._isGameStart = true;
            this.gameStart();
        }

        private resetPlayTimes(){
            if (this.loopNumber <= 0) {
                this._playTimes = -1;
            } else {
                this._playTimes = this.loopNumber;
            }
        }

        private _isGameStart: boolean;

        private gameStart() {
            // console.info("[info] Video.gameStart");
            if (!this.player) {
                return;
            }
            if (!this.videoLoaded) {
                return;
            }
            if (!this._isGameStart) {
                return;
            }
            if (this._isStop) {
                return;
            }

            this.videoCanvas.style.display = "block";
            this.initConVideo();
            if (this.autoPlay && !this.isShowHideByVp) {
                this.play();
            }
        }

        public update() {
            this.onResizeVideo();
            this.onPosChange();
        }

        /**
         * 播放
         * @param {boolean} isReplay 是否重头播，default: true
         */
        public play(isReplay = true) {
            if (!this.gameObject.visible) {
                this.isShowHideByVp = true;
                this.gameObject.visible = true;
            }
            this._isStop = false;
            this.playOnce(isReplay);
            this.eventDisp.dispatch(VideoEvent.PLAY_START);
            main.gameEvent.dispatch(VideoEvent.PLAY_START, this.gameObject.uuid);
        }

        /**
         * 暂停
         */
        public pause() {
            this._isStop = true;
            if (this.player) {
                this.player.pause();
            }
            if (this.audioUrl) {
                ps.Audio.pauseSound(this.audioName, 'game');
            }
            this.eventDisp.dispatch(VideoEvent.PLAY_PAUSE);
        }

        /**
         * 停止
         */
        public stop() {
            this._videoLoading = false;
            this.videoLoaded = false;
            this._isStop = true;
            this.onEnded = null;
            // this.gameObject.div.style.display = "none";
            this.stopVideo();
            if (this.audioUrl) {
                ps.Audio.stopSound(this.audioName, 'game');
            }
            this.eventDisp.dispatch(VideoEvent.PLAY_STOP);
        }

        private stopVideo() {
            if (this.player) {
                const tsPlayer = this.player as Player;
                const mp4Player = this.player as HTMLVideoElement;
                if (typeof (mp4Player.pause) === "function" && this.playing) {
                    mp4Player.pause();
                }
                // 场景切换的时候会自动调用 stop 事件，需要判断是否需要返回首帧的配置再返回首帧
                if (this.playEndFrame === PlayEndFrameType.FIRST && typeof (mp4Player.currentTime) === "number") {
                    mp4Player.currentTime = 0;
                }
                if (typeof (tsPlayer.stop) === "function") {
                    tsPlayer.stop();
                }
            }
        }

        private set onEnded(onCallBack) {
            if (this.player) {
                const tsPlayer = this.player as Player;
                const mp4Player = this.player as HTMLVideoElement;
                if (this.videoType === "ts") {
                    if (tsPlayer.options) {
                        tsPlayer.options.onEnded = onCallBack;
                    }
                } else {
                    mp4Player.onended = onCallBack;
                }
            }
        }

        /**
         * 播放一次
         * @param isReplay 是否重头播，default: true
         */
        private playOnce(isReplay = true) {
            const mp4Player = this.player as HTMLVideoElement;
            // 如果视频播放的时候，没有视频实例，则时延调用，兼容 ts 的场景
            if (!this.player) {
                setTimeout(() => {
                    this.playOnce(isReplay);
                }, 30);
            } else {
                if (isReplay) {
                    this.onEnded = null;
                    this.onEnded = this.playComplete.bind(this);
                    this.stopVideo();
                    // mp4 的视频，如果重新播放需要设置回到第一帧
                    if (this.videoType === "mp4") {
                        mp4Player.currentTime = 0;
                    }
                } else {
                    // 如果第一次播放是事件播放的，确保绑定了 playComplete 事件
                    if (!this.onEnded) {
                        this.onEnded = this.playComplete.bind(this);
                    }
                }
                this.player.play();
                this.eventDisp.dispatch(VideoEvent.PLAY_LOOP_START);
                main.gameEvent.dispatch(VideoEvent.PLAY_LOOP_START, this.gameObject.uuid);

                if (this.audioUrl) {
                    ps.Audio.pauseSound(this.audioName, 'game');
                    if (!this.isMute && (this.videoType === "ts" || ENV === "RELEASE")) {
                        if (isReplay) {
                            ps.Audio.playSound(this.audioName, 'game');
                        } else {
                            ps.Audio.resumeSound(this.audioName, 'game');
                        }
                    }
                }
            }
        }

        public vpReplayVideo(param: VpParam) {
            // 为 -1 是循环播放；loopNumber 小于 1 时或为空时，播放一次；
            this.loopNumber = param.loop ? -1 : param.loopNumber >= 1 ? param.loopNumber : 1;
            // 只有 playEndFrame 为 true 时，才保持尾帧，其他情况都返回首帧
            this.playEndFrame = param.playEndFrame === true ? PlayEndFrameType.LAST : PlayEndFrameType.FIRST;
            this.stop();
            this.play();
        }

        public vpResumeVideo(param: VpParam) {
            this.play(false);
        }

        /** 播放结束 */
        private playEnd() {
            if (this.playEndFrame === PlayEndFrameType.FIRST) {
                this.stopVideo();
            }
            if (this.audioUrl) {
                ps.Audio.stopSound(this.audioName, 'game');
            }
            this.resetPlayTimes()
            this.eventDisp.dispatch(VideoEvent.PLAY_COMPLETE);
            main.gameEvent.dispatch(VideoEvent.PLAY_COMPLETE, this.gameObject.uuid);
        }

        /** 检查是否再次播放 */
        private checkPlayAgain(): boolean {
            return this._playTimes === -1 || this._playTimes > 0;
        }

        /** 播放完成 */
        private playComplete() {
            // console.info("[info] Video.playComplete");
            if (this._playTimes > 0) {
                this._playTimes--;
            }
            if (this.checkPlayAgain()) {
                this.playOnce();
            } else {
                this.playEnd();
            }
            // 确保在视频销毁之后再派发 complete 事件
            setTimeout(() => {
                this.eventDisp.dispatch(VideoEvent.PLAY_LOOP_COMPLETE);
                main.gameEvent.dispatch(VideoEvent.PLAY_LOOP_COMPLETE, this.gameObject.uuid);
            });
        }

        private onResizeVideo() {
            if (!this.videoLoaded) {
                return;
            }
            // console.info("[info] Video.onResizeVideo");
            const winW: number = this.winW;
            const winH: number = this.winH;
            const videoCanvasW: number = this.videoCanvasW;
            const videoCanvasH: number = this.videoCanvasH;

            if (this._lastWinW !== winW || this._lastWinH !== winH || this._lastVideoCanvasW !== videoCanvasW || this._lastVideoCanvasH !== videoCanvasH) {
                // console.info("[info] Video.onResizeVideo", this._lastWinW, winW, this._lastWinH, winH);
                this.initConVideo();
                this._lastWinW = winW;
                this._lastWinH = winH;
                this._lastVideoCanvasW = videoCanvasW;
                this._lastVideoCanvasH = videoCanvasH;
            }
        }

        private get videoCanvasW(): number {
            return this.videoCanvas.width;
        }

        private get videoCanvasH(): number {
            return this.videoCanvas.height;
        }

        private get winW(): number {
            let winW: number = this.gameObject.div.offsetWidth; // window["adWidth"] || window.innerWidth;
            return winW;
        }

        private get winH(): number {
            let winH: number = this.gameObject.div.offsetHeight; // window["adHeight"] || window.innerHeight;
            return winH;
        }


        private readFileAsDataURL(file: Blob) {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = (file) => {
                    resolve(file);
                };
                reader.onerror = (event) => {
                    reader.abort();
                    reject(event);
                };
            });
        }

        private download(url: string, outputType: string): Promise<RequestDataType> {
            return new Promise((resolve, reject) => {
                if (!url) {
                    throw new Error(`非法 URL, ${url}`);
                }
                const xhr = new XMLHttpRequest();
                xhr.open('GET', url + '?random=' + new Date().getTime(), true);
                xhr.responseType = 'blob';
                _videoReqMap()[url] = {
                    xhr: xhr,
                    url
                };
                const deleteReq = () => {
                    delete _videoReqMap()[url];
                };
                xhr.onreadystatechange = async () => {
                    if (xhr.readyState === 4 && xhr.status === 200) {
                        const blob = xhr.response;
                        if (outputType === "dataURL") {
                            const result: ProgressEvent = await this.readFileAsDataURL(blob) as ProgressEvent;
                            const data: RequestDataType = {
                                url,
                                dataURL: (result.target as FileReader).result,
                                blob
                            };
                            resolve(data);
                            deleteReq();
                        } else {
                            const objectURL = window.URL.createObjectURL(blob); // IE10+
                            const data = {
                                url,
                                objectURL,
                                blob
                            };
                            resolve(data);
                            deleteReq();
                        }
                    }
                };
                xhr.onerror = (err) => {
                    console.error(err);
                    reject(new Error(`加载 ${url} 失败`));
                    deleteReq();
                };
                xhr.send();
            });
        }

        public destroyVideo() {
            if (this.player) {
                const tsPlayer = this.player as Player;
                // const mp4Player = this.player as HTMLVideoElement;
                if (typeof (tsPlayer.destroy) === "function") {
                    tsPlayer.destroy();
                    this.player = null;
                    this.videoCanvas.remove();
                    this.videoCanvas = null;
                }
            }
        }

        /**
         * 加载视频
         * @param callback loadVideo 后的回调事件
         */
        public async loadVideo(callback?: Function) {
            // console.info("[info] Video.loadVideo", this.videoUrl);
            this._videoLoading = true;
            this._videoCanPlay = false;

            if (this.audioUrl) {
                ps.Audio.stopSound(this.audioName, 'game');
            }

            const loadCallback = () => {
                if (callback && typeof callback === 'function') {
                    callback()
                }
            }

            if (this.player) {
                this.onEnded = null;
                this.stopVideo();
            }

            let videoUrl = this.videoUrl;
            // 仅在无Base64环境下运行, 播放 blob 的视频
            if (!window.hasBase64()) {
                let res = _videoRoadedMap()[this.videoUrl];
                if (!res || !res.dataURL) {
                    res = await this.download(this.videoUrl, 'dataURL');
                    _videoRoadedMap()[this.videoUrl] = res;
                }
                videoUrl = res.dataURL as string;
            }

            if (this.videoType === "ts") {
                if (!this.videoCanvas) {
                    this.videoCanvas = document.createElement("canvas") as HTMLCanvasElement;
                }

                if (this.gameObject.visible && this.gameObject.worldVisible) {
                    this.player = this.videoCanvas["player"] = new window["JSMpeg"].Player(videoUrl, {
                        canvas: this.videoCanvas as HTMLCanvasElement,
                        disableWebAssembly: true,
                        onSourceCompleted: this.loadVideoComplete.bind(this),
                        progressive: false,
                        autoplay: false,
                        loop: false,
                    });
                    this.player.play();
                    this.player.stop();
                } else {
                    this.videoLoaded = false;
                    this._videoLoading = false;
                    this._isStop = true;
                }
                // this.videoCanvas.style.display = "none";

                if (!this.videoCanvas.parentElement) {
                    this.gameObject.div.appendChild(this.videoCanvas);
                }
                loadCallback()
            } else {
                if (window.hasBase64()) {
                    videoUrl = window.getAssestByUrl(videoUrl);
                }
                if (!this.videoCanvas) {
                    this.videoCanvas = document.createElement("video") as HTMLVideoElement;
                    this.videoCanvas.preload = "auto";
                    this.videoCanvas.playsInline = true;
                    //发布环境下，mp4视频静音
                    this.videoCanvas.muted = this.isMute || ENV === "RELEASE";
                }
                this.player = this.videoCanvas as HTMLVideoElement;
                this.player.src = videoUrl;
                this.player.autoplay = false;
                this.player.onloadeddata = () => {
                    // 为啥要这样写，因为 pause 是在 then 之后执行，如果 onloadeddata 执行时机很快，会在 then 之前执行，导致 loadVideoComplete 里面的 play 被 then 后的 pause 暂停
                    // 所以必须要在下一个事件循环之后再执行 loadVideoComplete
                    setTimeout(() => {
                        this.loadVideoComplete();
                    })
                }
                this.player.load();
                // 安卓机器如果没有 play 的话，默认会展示播放按钮，需要先 play 之后再调用 pause
                // 因为 pause 是在 then 之后执行，如果 loadVideo 事件后面执行 play 会导致 play 之后立马 pause，所以 loadVideo 后面的回调事件需要通过 callback 去执行
                try {
                    // oncanplay 并不是在 loadVideoComplete 之后，所以 oncanplay 需要再次播放视频
                    this.player.oncanplay = () => {
                      // 最新版105的chrome浏览器不能自动播放第一个场景的视频，且在浏览器预览时有interrupt by pause报错，这里区分发布包和ps预览做兼容
                      if (ps.ENV === "RELEASE") {
                        (this.player.play() as Promise<void>).then(() => {
                            this._videoCanPlay = true
                            this.player.pause();
                            loadCallback();
                            (this.player as HTMLVideoElement).oncanplay = () => {};
                        });
                      } else {
                        this._videoCanPlay = true
                        loadCallback();
                        (this.player as HTMLVideoElement).oncanplay = () => {};
                      }
                    };
                } catch (error) {
                    this._videoCanPlay = true
                    this.player.play();
                    this.player.pause();
                    loadCallback()
                }
                // this.videoCanvas.style.display = "none";

                if (!this.videoCanvas.parentElement) {
                    this.gameObject.div.appendChild(this.videoCanvas);
                }
            }
        }

        private loadAudio() {
            // console.info("[info] Video.loadAudio", this.audioUrl);
            // 仅在无Base64环境下需要预加载音频
            if (this.audioUrl && !window.hasBase64()) {
                ps.Audio.playSound(this.audioName, 'game');
                ps.Audio.stopSound(this.audioName, 'game');
            }
        }

        private loadVideoComplete(/* source: AjaxSource */) {
            // console.info("[info] Video.loadVideoComplete"/* , source */);
            this.videoLoaded = true;
            this._videoLoading = false;
            this.eventDisp.dispatch(VideoEvent.LOAD_COMPLETE);
            this.gameStart();
            this.update();
        }

        /** 初始化视频容器 */
        private initConVideo() {
            if(!this.gameObject.worldVisible) {
                const scale = 0;
                this.videoCanvas.style.transform = this.videoCanvas.style.webkitTransform = `scale(${scale}, ${scale})`;
            } else {
                this.fitDOMElementInArea(this.videoCanvas)
            }
        }

        /** 适配 DOM 节点 */
        private fitDOMElementInArea(ele: HTMLCanvasElement | HTMLVideoElement): void {
            if (!ele) {
                return;
            }

            if (!ele["_fitLayaAirInitialized"]) {
                ele["_fitLayaAirInitialized"] = true;
                ele.style.transformOrigin = ele.style.webkitTransformOrigin = "left top";
                ele.style.position = "absolute";
            }

            const winW = this.winW;
            const winH = this.winH;

            const width = (ele as HTMLVideoElement).videoWidth || ele.width;
            const height = (ele as HTMLVideoElement).videoHeight || ele.height;

            const s1: number = winW / width;
            const s2: number = winH / height;
            const scale = Mathf.keepDecimal(Math.min(s1, s2), 2, "ceil");
            const left = Mathf.keepDecimal((winW - width * scale) / 2, 2, "ceil");
            const top = Mathf.keepDecimal((winH - height * scale) / 2, 2, "ceil");

            ele.style.transform = ele.style.webkitTransform = `scale(${scale}, ${scale})`;
            ele.style.left = `${left}px`;
            ele.style.top = `${top}px`;
        }
    }
    qc.registerBehaviour('ps.Video', Video);
    Video["__menu"] = 'Custom/Video';
    Video["__ability"] = 'mp4,ts' // 脚本能力，后续通过该字段来判断脚本是否支持部分能力
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
