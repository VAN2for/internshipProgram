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
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var ps;
(function (ps) {
    /** 视频事件 */
    var VideoEvent;
    (function (VideoEvent) {
        /** 加载完成 */
        VideoEvent["LOAD_COMPLETE"] = "loadComplete";
        /** 播放开始 */
        VideoEvent["PLAY_START"] = "playStart";
        /** 循环播放开始（每次播放开始，包含循环播放） */
        VideoEvent["PLAY_LOOP_START"] = "playLoopStart";
        /** 播放完成 */
        VideoEvent["PLAY_COMPLETE"] = "playComplete";
        /** 循环播放完成（每次播放完成，包含循环播放） */
        VideoEvent["PLAY_LOOP_COMPLETE"] = "playLoopComplete";
        /** 播放停止 */
        VideoEvent["PLAY_STOP"] = "playStop";
        /** 播放暂停 */
        VideoEvent["PLAY_PAUSE"] = "playPause";
        /** 当父亲或自我的视觉属性发生变化时 */
        VideoEvent["VISIBLE_CHANGE"] = "visibleChange";
        /** 节点层级位置发生变化时 */
        VideoEvent["POS_LAYOUT_CHANGE"] = "posLayoutChange";
    })(VideoEvent = ps.VideoEvent || (ps.VideoEvent = {}));
    /**
     * 播放结束后停留位置
     */
    var PlayEndFrameType;
    (function (PlayEndFrameType) {
        /** 第一帧 */
        PlayEndFrameType[PlayEndFrameType["FIRST"] = 0] = "FIRST";
        /** 最后一帧 */
        PlayEndFrameType[PlayEndFrameType["LAST"] = 1] = "LAST";
    })(PlayEndFrameType = ps.PlayEndFrameType || (ps.PlayEndFrameType = {}));
    /** 已发起过请求的视频 */
    var __videoReqMap;
    /** 已发起过请求的视频 */
    ps._videoReqMap = function () {
        return __videoReqMap || (__videoReqMap = {});
    };
    /** 已缓存过的视频 */
    var __videoRoadedMap;
    /** 已缓存过的视频 */
    ps._videoRoadedMap = function () {
        return __videoRoadedMap || (__videoRoadedMap = {});
    };
    /**
     * 视频组件
     * @description 视频组件，新版PS工具使用
     * @author JingBin
     */
    var Video = /** @class */ (function (_super) {
        __extends(Video, _super);
        function Video(gameObject) {
            var _this = _super.call(this, gameObject) || this;
            /** 原视频URL */
            _this._sourceVideoUrl = "";
            /** 原视频时长 */
            _this._sourceVideoDuration = 0;
            /** 当前视频URL */
            _this._videoUrl = "";
            /** 当前音频URL */
            _this._audioUrl = "";
            /** 当前音频name */
            _this._audioName = "";
            /** 播放结束后停留位置 0:第一帧，1:最后一帧 */
            _this._playEndFrame = PlayEndFrameType.LAST;
            /** [<=0]:循环 [>0]:次数播放 */
            _this._loopNumber = 1;
            /** 剩余播放次数，[-1]:循环 [>0]:次数播放，播放一次减一次 [0]:播放完不再继续播放 */
            _this._playTimes = 1;
            /** 上一次裁剪起始时间 */
            _this._clipStartTime = 0;
            /** 上一次裁剪结束时间 */
            _this._clipEndTime = 0;
            /** 加载完成自动播放视频 */
            _this._autoPlay = true;
            /** 资源库资源ID */
            _this._assetId = 0;
            /** 音频是否静音 */
            _this._isMute = false;
            /** 当前视频预览图URL */
            _this._videoCoverUrl = "";
            _this._isStop = false;
            _this.isShowHideByVp = false;
            _this.vpActionConfig = {
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
            _this.vpAction = {
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
            _this.eventDisp = new ps.EventDispatcher();
            /** 动态数据，可以减少脚本更新次数 */
            _this._$data = {};
            /** 序列化 */
            _this.serializableFields = {
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
            _this.runInEditor = true;
            return _this;
        }
        Object.defineProperty(Video.prototype, "sourceVideoUrl", {
            /** 原视频URL */
            get: function () {
                return this._sourceVideoUrl;
            },
            set: function (value) {
                this._sourceVideoUrl = value;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Video.prototype, "sourceVideoDuration", {
            /** 原视频时长 */
            get: function () {
                return this._sourceVideoDuration;
            },
            set: function (value) {
                this._sourceVideoDuration = value;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Video.prototype, "videoUrl", {
            /** 当前视频URL */
            get: function () {
                return this._videoUrl;
            },
            set: function (value) {
                //根据 videoType 自动修改视频后缀
                var urlPrefix = value.split(".")[0];
                if (!urlPrefix) {
                    console.warn("\u89C6\u9891\u8DEF\u5F84\uFF1A".concat(value, "\u6709\u8BEF\uFF0C\u8BF7\u68C0\u67E5\uFF01"));
                    return;
                }
                value = "".concat(urlPrefix, ".").concat(this.videoType);
                this._videoUrl = value;
                if (value) {
                    this.loadVideo();
                }
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Video.prototype, "audioUrl", {
            /** 当前音频URL */
            get: function () {
                return this._audioUrl;
            },
            set: function (value) {
                this._audioUrl = value;
                if (value) {
                    this.loadAudio();
                }
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Video.prototype, "audioName", {
            /** 当前音频name */
            get: function () {
                if (!this._audioName) {
                    var audioNames = this._audioUrl.split("/");
                    this._audioName = audioNames[audioNames.length - 1].split(".")[0];
                }
                return this._audioName;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Video.prototype, "playEndFrame", {
            /** 播放结束后停留位置 0:第一帧，1:最后一帧 */
            get: function () {
                return this._playEndFrame;
            },
            set: function (value) {
                this._playEndFrame = value;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Video.prototype, "loopNumber", {
            /** [<=0]:循环 [>0]:次数播放 */
            get: function () {
                return this._loopNumber;
            },
            set: function (value) {
                this._loopNumber = value;
                if (value <= 0) {
                    this._playTimes = -1;
                }
                else {
                    this._playTimes = value;
                }
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Video.prototype, "clipStartTime", {
            /** 上一次裁剪起始时间 */
            get: function () {
                return this._clipStartTime;
            },
            set: function (value) {
                this._clipStartTime = value;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Video.prototype, "clipEndTime", {
            /** 上一次裁剪结束时间 */
            get: function () {
                return this._clipEndTime;
            },
            set: function (value) {
                this._clipEndTime = value;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Video.prototype, "autoPlay", {
            /** 加载完成自动播放视频 */
            get: function () {
                return this._autoPlay;
            },
            set: function (value) {
                this._autoPlay = value;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Video.prototype, "assetId", {
            /** 资源库资源ID */
            get: function () {
                return this._assetId;
            },
            set: function (value) {
                this._assetId = value;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Video.prototype, "isMute", {
            /** 音频是否静音 */
            get: function () {
                return this._isMute;
            },
            set: function (value) {
                this._isMute = value;
                if (value && this.audioUrl) {
                    ps.Audio.stopSound(this.audioName, 'game');
                }
                if (this.videoCanvas && typeof (this.videoCanvas.muted) === "boolean") {
                    this.videoCanvas.muted = value || ps.ENV === "RELEASE";
                }
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Video.prototype, "videoCoverUrl", {
            /** 当前视频预览图URL */
            get: function () {
                return this._videoCoverUrl;
            },
            set: function (value) {
                this._videoCoverUrl = value;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Video.prototype, "videoType", {
            /** 视频类型 */
            get: function () {
                return qici.config.videoType || "mp4";
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Video.prototype, "playing", {
            /** 视频播放状态 */
            get: function () {
                if (this.videoType === 'mp4' && this.player) {
                    // @ts-ignore
                    return !!(this.player.currentTime > 0 && !this.player.paused && !this.player.ended && this.player.readyState > 2);
                }
                else if (this.videoType === 'ts' && this.player) {
                    return !this.player.paused;
                }
                return false;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Video.prototype, "$data", {
            get: function () {
                return this._$data;
            },
            set: function (value) {
                this._$data = value;
            },
            enumerable: false,
            configurable: true
        });
        Video.prototype.awake = function () {
            var _this = this;
            // console.info("[info] Video.awake", this.name);
            this.gameObject.serializable = false;
            this._lastPos = this.gameObject.pos;
            // 把onVisibleChange函数hook一下
            var __onVisibleChange = this.gameObject.onVisibleChange.bind(this.gameObject);
            this.gameObject.onVisibleChange = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                __onVisibleChange.apply(void 0, __spreadArray([], __read(args), false));
                _this.onVisibleChange(true);
            };
            // 仅在编辑器环境下运行
            if (this.runInEditor && qici.config.editor) {
                this.onRefresh();
                this.onVisibleChange();
            }
        };
        /** 刷新重来。根据新的配置重新刷新视频 */
        Video.prototype.onRefresh = function () {
            this.onInit();
            // 只有编辑区才默认播放，其他环境都是等待 gameStart 再播放
            if (ps.ENV === "EDITOR") {
                this.onGameStart();
            }
            else {
                this.gameStart();
            }
        };
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
        Video.prototype.onEnable = function () {
            // console.info("[info] Video.onEnable");
            this.onRefresh();
        };
        Video.prototype.onDisable = function () {
            // console.info("[info] Video.onDisable");
            this.stop();
        };
        // public onDestroy() {
        //     console.info("[info] Video.onDestroy");
        // }
        /**
         * 当父亲或自我的视觉属性发生变化时，事件将被触发
         * @param isReload 是否重新加载视频、音频
         */
        Video.prototype.onVisibleChange = function (isReload) {
            var _this = this;
            if (isReload === void 0) { isReload = false; }
            // 事件系统设置视频显示隐藏时单独走的逻辑
            if (this.isShowHideByVp) {
                if (!this.gameObject.visible || !this.gameObject.worldVisible) {
                    this.pause();
                }
                // gameStart需要依赖isShowHideByVp来决定autoPlay=true时是否需要重新播放,所以延后一帧设回去原值
                setTimeout(function () {
                    _this.isShowHideByVp = false;
                });
                return;
            }
            // console.info("[info] Video.onVisibleChange", this.gameObject.name, this.gameObject.parent?.name);
            if (!this.gameObject.visible || !this.gameObject.worldVisible) {
                // 初始化onload时，UIRoot.visible为false，worldVisible为false，此时是不需要进入这个逻辑的。
                if (!UIRoot || !UIRoot.visible)
                    return;
                // 为什么这样改，因为 ios 15 上面，切换场景时，视频节点的父节点（QC.DOM）节点会提前一帧消失，导致切换场景会看到一帧的背景图片，也就是跳转闪烁问题，因此需要在切换场景时，延迟 100ms 再把视频节点设置为隐藏
                if (this.videoType === 'mp4' && this.videoCanvas && this.videoCanvas.parentElement) {
                    this.videoCanvas.parentElement.style.display = "block";
                    setTimeout(function () {
                        if (_this.videoCanvas && _this.videoCanvas.parentElement) {
                            _this.videoCanvas.parentElement.style.display = "none";
                        }
                    }, 100);
                }
                this.stop();
                this.destroyVideo();
                this.eventDisp.dispatch(VideoEvent.VISIBLE_CHANGE, false);
            }
            else {
                var loadVideoCallback_1 = function () {
                    if (_this._videoCanPlay) {
                        _this.onRefresh();
                        // 显示的时候需要更新一下状态
                        _this.update();
                        _this.eventDisp.dispatch(VideoEvent.VISIBLE_CHANGE, true);
                    }
                    else {
                        setTimeout(function () {
                            loadVideoCallback_1();
                        }, 32);
                    }
                };
                if (isReload && this._isStop && this._videoLoading == false && this.videoLoaded == false) {
                    this.stop();
                    this.loadAudio();
                    // 如果是 mp4 资源，并且已经有 player 资源，直接复用即可，不需要重新触发 load
                    if (this.videoType === 'mp4' && this.player) {
                        this.videoLoaded = true;
                        this._videoLoading = true;
                        loadVideoCallback_1();
                    }
                    else {
                        this.loadVideo(loadVideoCallback_1);
                    }
                }
                else {
                    loadVideoCallback_1();
                }
            }
        };
        /** 节点层级位置发生变化时，事件将被触发 */
        Video.prototype.onPosChange = function () {
            if (this.gameObject.pos !== this._lastPos) {
                // console.info("[info] Video.onPosChange", this.gameObject.pos);
                if (this._lastPos !== qc.Dom.POS_BACK && this._lastPos !== qc.Dom.POS_FRONT && (this.gameObject.pos === qc.Dom.POS_BACK || this.gameObject.pos === qc.Dom.POS_FRONT)) {
                    this.onRefresh();
                }
                else if ((this._lastPos === qc.Dom.POS_BACK || this._lastPos === qc.Dom.POS_FRONT) && this.gameObject.pos !== qc.Dom.POS_BACK && this.gameObject.pos !== qc.Dom.POS_FRONT) {
                    this.stop();
                }
                this._lastPos = this.gameObject.pos;
                this.eventDisp.dispatch(VideoEvent.POS_LAYOUT_CHANGE, this.gameObject.pos);
            }
        };
        /** 试玩初始化的处理 */
        Video.prototype.onInit = function () {
            // console.info("[info] Video.onInit", this.name);
            // 在这里初始化游戏场景需要的东西
            this._isStop = !this.gameObject.visible || !this.gameObject.worldVisible;
            if (this.loopNumber <= 0) {
                this._playTimes = -1;
            }
            else {
                this._playTimes = this.loopNumber;
            }
            this.gameObject.div.style.display = "block";
        };
        /** 试玩开始时的处理 */
        Video.prototype.onGameStart = function () {
            this._isGameStart = true;
            this.gameStart();
        };
        Video.prototype.resetPlayTimes = function () {
            if (this.loopNumber <= 0) {
                this._playTimes = -1;
            }
            else {
                this._playTimes = this.loopNumber;
            }
        };
        Video.prototype.gameStart = function () {
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
        };
        Video.prototype.update = function () {
            this.onResizeVideo();
            this.onPosChange();
        };
        /**
         * 播放
         * @param {boolean} isReplay 是否重头播，default: true
         */
        Video.prototype.play = function (isReplay) {
            if (isReplay === void 0) { isReplay = true; }
            if (!this.gameObject.visible) {
                this.isShowHideByVp = true;
                this.gameObject.visible = true;
            }
            this._isStop = false;
            this.playOnce(isReplay);
            this.eventDisp.dispatch(VideoEvent.PLAY_START);
            main.gameEvent.dispatch(VideoEvent.PLAY_START, this.gameObject.uuid);
        };
        /**
         * 暂停
         */
        Video.prototype.pause = function () {
            this._isStop = true;
            if (this.player) {
                this.player.pause();
            }
            if (this.audioUrl) {
                ps.Audio.pauseSound(this.audioName, 'game');
            }
            this.eventDisp.dispatch(VideoEvent.PLAY_PAUSE);
        };
        /**
         * 停止
         */
        Video.prototype.stop = function () {
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
        };
        Video.prototype.stopVideo = function () {
            if (this.player) {
                var tsPlayer = this.player;
                var mp4Player = this.player;
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
        };
        Object.defineProperty(Video.prototype, "onEnded", {
            set: function (onCallBack) {
                if (this.player) {
                    var tsPlayer = this.player;
                    var mp4Player = this.player;
                    if (this.videoType === "ts") {
                        if (tsPlayer.options) {
                            tsPlayer.options.onEnded = onCallBack;
                        }
                    }
                    else {
                        mp4Player.onended = onCallBack;
                    }
                }
            },
            enumerable: false,
            configurable: true
        });
        /**
         * 播放一次
         * @param isReplay 是否重头播，default: true
         */
        Video.prototype.playOnce = function (isReplay) {
            var _this = this;
            if (isReplay === void 0) { isReplay = true; }
            var mp4Player = this.player;
            // 如果视频播放的时候，没有视频实例，则时延调用，兼容 ts 的场景
            if (!this.player) {
                setTimeout(function () {
                    _this.playOnce(isReplay);
                }, 30);
            }
            else {
                if (isReplay) {
                    this.onEnded = null;
                    this.onEnded = this.playComplete.bind(this);
                    this.stopVideo();
                    // mp4 的视频，如果重新播放需要设置回到第一帧
                    if (this.videoType === "mp4") {
                        mp4Player.currentTime = 0;
                    }
                }
                else {
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
                    if (!this.isMute && (this.videoType === "ts" || ps.ENV === "RELEASE")) {
                        if (isReplay) {
                            ps.Audio.playSound(this.audioName, 'game');
                        }
                        else {
                            ps.Audio.resumeSound(this.audioName, 'game');
                        }
                    }
                }
            }
        };
        Video.prototype.vpReplayVideo = function (param) {
            // 为 -1 是循环播放；loopNumber 小于 1 时或为空时，播放一次；
            this.loopNumber = param.loop ? -1 : param.loopNumber >= 1 ? param.loopNumber : 1;
            // 只有 playEndFrame 为 true 时，才保持尾帧，其他情况都返回首帧
            this.playEndFrame = param.playEndFrame === true ? PlayEndFrameType.LAST : PlayEndFrameType.FIRST;
            this.stop();
            this.play();
        };
        Video.prototype.vpResumeVideo = function (param) {
            this.play(false);
        };
        /** 播放结束 */
        Video.prototype.playEnd = function () {
            if (this.playEndFrame === PlayEndFrameType.FIRST) {
                this.stopVideo();
            }
            if (this.audioUrl) {
                ps.Audio.stopSound(this.audioName, 'game');
            }
            this.resetPlayTimes();
            this.eventDisp.dispatch(VideoEvent.PLAY_COMPLETE);
            main.gameEvent.dispatch(VideoEvent.PLAY_COMPLETE, this.gameObject.uuid);
        };
        /** 检查是否再次播放 */
        Video.prototype.checkPlayAgain = function () {
            return this._playTimes === -1 || this._playTimes > 0;
        };
        /** 播放完成 */
        Video.prototype.playComplete = function () {
            var _this = this;
            // console.info("[info] Video.playComplete");
            if (this._playTimes > 0) {
                this._playTimes--;
            }
            if (this.checkPlayAgain()) {
                this.playOnce();
            }
            else {
                this.playEnd();
            }
            // 确保在视频销毁之后再派发 complete 事件
            setTimeout(function () {
                _this.eventDisp.dispatch(VideoEvent.PLAY_LOOP_COMPLETE);
                main.gameEvent.dispatch(VideoEvent.PLAY_LOOP_COMPLETE, _this.gameObject.uuid);
            });
        };
        Video.prototype.onResizeVideo = function () {
            if (!this.videoLoaded) {
                return;
            }
            // console.info("[info] Video.onResizeVideo");
            var winW = this.winW;
            var winH = this.winH;
            var videoCanvasW = this.videoCanvasW;
            var videoCanvasH = this.videoCanvasH;
            if (this._lastWinW !== winW || this._lastWinH !== winH || this._lastVideoCanvasW !== videoCanvasW || this._lastVideoCanvasH !== videoCanvasH) {
                // console.info("[info] Video.onResizeVideo", this._lastWinW, winW, this._lastWinH, winH);
                this.initConVideo();
                this._lastWinW = winW;
                this._lastWinH = winH;
                this._lastVideoCanvasW = videoCanvasW;
                this._lastVideoCanvasH = videoCanvasH;
            }
        };
        Object.defineProperty(Video.prototype, "videoCanvasW", {
            get: function () {
                return this.videoCanvas.width;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Video.prototype, "videoCanvasH", {
            get: function () {
                return this.videoCanvas.height;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Video.prototype, "winW", {
            get: function () {
                var winW = this.gameObject.div.offsetWidth; // window["adWidth"] || window.innerWidth;
                return winW;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Video.prototype, "winH", {
            get: function () {
                var winH = this.gameObject.div.offsetHeight; // window["adHeight"] || window.innerHeight;
                return winH;
            },
            enumerable: false,
            configurable: true
        });
        Video.prototype.readFileAsDataURL = function (file) {
            return new Promise(function (resolve, reject) {
                var reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = function (file) {
                    resolve(file);
                };
                reader.onerror = function (event) {
                    reader.abort();
                    reject(event);
                };
            });
        };
        Video.prototype.download = function (url, outputType) {
            var _this = this;
            return new Promise(function (resolve, reject) {
                if (!url) {
                    throw new Error("\u975E\u6CD5 URL, ".concat(url));
                }
                var xhr = new XMLHttpRequest();
                xhr.open('GET', url + '?random=' + new Date().getTime(), true);
                xhr.responseType = 'blob';
                ps._videoReqMap()[url] = {
                    xhr: xhr,
                    url: url
                };
                var deleteReq = function () {
                    delete ps._videoReqMap()[url];
                };
                xhr.onreadystatechange = function () { return __awaiter(_this, void 0, void 0, function () {
                    var blob, result, data, objectURL, data;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (!(xhr.readyState === 4 && xhr.status === 200)) return [3 /*break*/, 3];
                                blob = xhr.response;
                                if (!(outputType === "dataURL")) return [3 /*break*/, 2];
                                return [4 /*yield*/, this.readFileAsDataURL(blob)];
                            case 1:
                                result = _a.sent();
                                data = {
                                    url: url,
                                    dataURL: result.target.result,
                                    blob: blob
                                };
                                resolve(data);
                                deleteReq();
                                return [3 /*break*/, 3];
                            case 2:
                                objectURL = window.URL.createObjectURL(blob);
                                data = {
                                    url: url,
                                    objectURL: objectURL,
                                    blob: blob
                                };
                                resolve(data);
                                deleteReq();
                                _a.label = 3;
                            case 3: return [2 /*return*/];
                        }
                    });
                }); };
                xhr.onerror = function (err) {
                    console.error(err);
                    reject(new Error("\u52A0\u8F7D ".concat(url, " \u5931\u8D25")));
                    deleteReq();
                };
                xhr.send();
            });
        };
        Video.prototype.destroyVideo = function () {
            if (this.player) {
                var tsPlayer = this.player;
                // const mp4Player = this.player as HTMLVideoElement;
                if (typeof (tsPlayer.destroy) === "function") {
                    tsPlayer.destroy();
                    this.player = null;
                    this.videoCanvas.remove();
                    this.videoCanvas = null;
                }
            }
        };
        /**
         * 加载视频
         * @param callback loadVideo 后的回调事件
         */
        Video.prototype.loadVideo = function (callback) {
            return __awaiter(this, void 0, void 0, function () {
                var loadCallback, videoUrl, res;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            // console.info("[info] Video.loadVideo", this.videoUrl);
                            this._videoLoading = true;
                            this._videoCanPlay = false;
                            if (this.audioUrl) {
                                ps.Audio.stopSound(this.audioName, 'game');
                            }
                            loadCallback = function () {
                                if (callback && typeof callback === 'function') {
                                    callback();
                                }
                            };
                            if (this.player) {
                                this.onEnded = null;
                                this.stopVideo();
                            }
                            videoUrl = this.videoUrl;
                            if (!!window.hasBase64()) return [3 /*break*/, 3];
                            res = ps._videoRoadedMap()[this.videoUrl];
                            if (!(!res || !res.dataURL)) return [3 /*break*/, 2];
                            return [4 /*yield*/, this.download(this.videoUrl, 'dataURL')];
                        case 1:
                            res = _a.sent();
                            ps._videoRoadedMap()[this.videoUrl] = res;
                            _a.label = 2;
                        case 2:
                            videoUrl = res.dataURL;
                            _a.label = 3;
                        case 3:
                            if (this.videoType === "ts") {
                                if (!this.videoCanvas) {
                                    this.videoCanvas = document.createElement("canvas");
                                }
                                if (this.gameObject.visible && this.gameObject.worldVisible) {
                                    this.player = this.videoCanvas["player"] = new window["JSMpeg"].Player(videoUrl, {
                                        canvas: this.videoCanvas,
                                        disableWebAssembly: true,
                                        onSourceCompleted: this.loadVideoComplete.bind(this),
                                        progressive: false,
                                        autoplay: false,
                                        loop: false,
                                    });
                                    this.player.play();
                                    this.player.stop();
                                }
                                else {
                                    this.videoLoaded = false;
                                    this._videoLoading = false;
                                    this._isStop = true;
                                }
                                // this.videoCanvas.style.display = "none";
                                if (!this.videoCanvas.parentElement) {
                                    this.gameObject.div.appendChild(this.videoCanvas);
                                }
                                loadCallback();
                            }
                            else {
                                if (window.hasBase64()) {
                                    videoUrl = window.getAssestByUrl(videoUrl);
                                }
                                if (!this.videoCanvas) {
                                    this.videoCanvas = document.createElement("video");
                                    this.videoCanvas.preload = "auto";
                                    this.videoCanvas.playsInline = true;
                                    //发布环境下，mp4视频静音
                                    this.videoCanvas.muted = this.isMute || ps.ENV === "RELEASE";
                                }
                                this.player = this.videoCanvas;
                                this.player.src = videoUrl;
                                this.player.autoplay = false;
                                this.player.onloadeddata = function () {
                                    // 为啥要这样写，因为 pause 是在 then 之后执行，如果 onloadeddata 执行时机很快，会在 then 之前执行，导致 loadVideoComplete 里面的 play 被 then 后的 pause 暂停
                                    // 所以必须要在下一个事件循环之后再执行 loadVideoComplete
                                    setTimeout(function () {
                                        _this.loadVideoComplete();
                                    });
                                };
                                this.player.load();
                                // 安卓机器如果没有 play 的话，默认会展示播放按钮，需要先 play 之后再调用 pause
                                // 因为 pause 是在 then 之后执行，如果 loadVideo 事件后面执行 play 会导致 play 之后立马 pause，所以 loadVideo 后面的回调事件需要通过 callback 去执行
                                try {
                                    // oncanplay 并不是在 loadVideoComplete 之后，所以 oncanplay 需要再次播放视频
                                    this.player.oncanplay = function () {
                                        // 最新版105的chrome浏览器不能自动播放第一个场景的视频，且在浏览器预览时有interrupt by pause报错，这里区分发布包和ps预览做兼容
                                        if (ps.ENV === "RELEASE") {
                                            _this.player.play().then(function () {
                                                _this._videoCanPlay = true;
                                                _this.player.pause();
                                                loadCallback();
                                                _this.player.oncanplay = function () { };
                                            });
                                        }
                                        else {
                                            _this._videoCanPlay = true;
                                            loadCallback();
                                            _this.player.oncanplay = function () { };
                                        }
                                    };
                                }
                                catch (error) {
                                    this._videoCanPlay = true;
                                    this.player.play();
                                    this.player.pause();
                                    loadCallback();
                                }
                                // this.videoCanvas.style.display = "none";
                                if (!this.videoCanvas.parentElement) {
                                    this.gameObject.div.appendChild(this.videoCanvas);
                                }
                            }
                            return [2 /*return*/];
                    }
                });
            });
        };
        Video.prototype.loadAudio = function () {
            // console.info("[info] Video.loadAudio", this.audioUrl);
            // 仅在无Base64环境下需要预加载音频
            if (this.audioUrl && !window.hasBase64()) {
                ps.Audio.playSound(this.audioName, 'game');
                ps.Audio.stopSound(this.audioName, 'game');
            }
        };
        Video.prototype.loadVideoComplete = function ( /* source: AjaxSource */) {
            // console.info("[info] Video.loadVideoComplete"/* , source */);
            this.videoLoaded = true;
            this._videoLoading = false;
            this.eventDisp.dispatch(VideoEvent.LOAD_COMPLETE);
            this.gameStart();
            this.update();
        };
        /** 初始化视频容器 */
        Video.prototype.initConVideo = function () {
            if (!this.gameObject.worldVisible) {
                var scale = 0;
                this.videoCanvas.style.transform = this.videoCanvas.style.webkitTransform = "scale(".concat(scale, ", ").concat(scale, ")");
            }
            else {
                this.fitDOMElementInArea(this.videoCanvas);
            }
        };
        /** 适配 DOM 节点 */
        Video.prototype.fitDOMElementInArea = function (ele) {
            if (!ele) {
                return;
            }
            if (!ele["_fitLayaAirInitialized"]) {
                ele["_fitLayaAirInitialized"] = true;
                ele.style.transformOrigin = ele.style.webkitTransformOrigin = "left top";
                ele.style.position = "absolute";
            }
            var winW = this.winW;
            var winH = this.winH;
            var width = ele.videoWidth || ele.width;
            var height = ele.videoHeight || ele.height;
            var s1 = winW / width;
            var s2 = winH / height;
            var scale = ps.Mathf.keepDecimal(Math.min(s1, s2), 2, "ceil");
            var left = ps.Mathf.keepDecimal((winW - width * scale) / 2, 2, "ceil");
            var top = ps.Mathf.keepDecimal((winH - height * scale) / 2, 2, "ceil");
            ele.style.transform = ele.style.webkitTransform = "scale(".concat(scale, ", ").concat(scale, ")");
            ele.style.left = "".concat(left, "px");
            ele.style.top = "".concat(top, "px");
        };
        return Video;
    }(ps.Behaviour));
    ps.Video = Video;
    qc.registerBehaviour('ps.Video', Video);
    Video["__menu"] = 'Custom/Video';
    Video["__ability"] = 'mp4,ts'; // 脚本能力，后续通过该字段来判断脚本是否支持部分能力
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
//# sourceMappingURL=Video.js.map