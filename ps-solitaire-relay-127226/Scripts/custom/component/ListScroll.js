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
/** 滚动方向 */
var DireScroll;
(function (DireScroll) {
    /** 向上/左 */
    DireScroll[DireScroll["UP_OR_LEFT"] = -1] = "UP_OR_LEFT";
    /** 向下/右 */
    DireScroll[DireScroll["DOWN_OR_RIGHT"] = 1] = "DOWN_OR_RIGHT";
})(DireScroll || (DireScroll = {}));
/** 布局类型 */
var ListLayout;
(function (ListLayout) {
    /** 水平 */
    ListLayout[ListLayout["HORIZONTAL"] = 0] = "HORIZONTAL";
    /** 垂直 */
    ListLayout[ListLayout["VERTICAL"] = 1] = "VERTICAL";
})(ListLayout || (ListLayout = {}));
/** 滚动列表事件 */
var ListScrollEvent;
(function (ListScrollEvent) {
    /** 滚动完成起步阶段 */
    ListScrollEvent["PLAY_FINISHED_FIRST"] = "playFinishedFirst";
    /** 滚动完成第一步骤阶段 */
    ListScrollEvent["PLAY_FINISHED_TW0"] = "playFinishedTw0";
    /** 滚动完成收尾阶段 */
    ListScrollEvent["PLAY_FINISHED_LAST"] = "playFinishedLast";
})(ListScrollEvent || (ListScrollEvent = {}));
/** 滚动列表当前状态 */
var ListScrollState;
(function (ListScrollState) {
    /** 待机静止状态 */
    ListScrollState[ListScrollState["IDLE"] = 0] = "IDLE";
    /** 滚动起步阶段 */
    ListScrollState[ListScrollState["PLAYING_FIRST"] = 1] = "PLAYING_FIRST";
    /** 滚动收尾阶段 */
    ListScrollState[ListScrollState["PLAYING_LAST"] = 2] = "PLAYING_LAST";
})(ListScrollState || (ListScrollState = {}));
var ps;
(function (ps) {
    /**
     * 滚动列表组件
     * @description 滚动列表组件，可用于如：摇奖、老虎机、关卡楼层等需要滚动列表
     * @author JingBin
     */
    var ListScroll = /** @class */ (function (_super) {
        __extends(ListScroll, _super);
        function ListScroll(gameObject) {
            var _this = _super.call(this, gameObject) || this;
            /** 间距 */
            _this.space = 0;
            /** 滚动方向: -1:向上/左 1:向下/右 */
            _this.direScroll = DireScroll.DOWN_OR_RIGHT;
            /** 布局: 0:水平 1:垂直 */
            _this.listLayout = ListLayout.VERTICAL;
            /** 滚动时间 */
            _this.duration = 1;
            /** 滚动圈数 */
            _this.scrollCnt = 2;
            /** 最终停在的图片索引 */
            _this.stopToIdx = 0;
            /** 启用速度模糊 */
            _this.isSpeedBlur = true;
            /** 速度模糊 */
            _this.speedBlur = 1;
            /** 启用Debug模式，点击对象即滚动 */
            _this.debug = false;
            /** 滚动列表过程中循环播放的音效 */
            _this.smPlaying = "";
            /** 滚动列表过程中循环播放的音效，时间间隔 */
            _this.smPlayingInterval = 80;
            /** 滚动列表完成音效 */
            _this.smFinish = "";
            /** 随机出现斜光特效，时间间隔 */
            _this.idleLightEffInterval = 2000;
            _this.scrollCnt0 = 1;
            _this.scrollCnt1 = 1;
            _this.stopToXY = 0;
            _this.eventDisp = new ps.EventDispatcher();
            _this.state = ListScrollState.IDLE;
            /** 序列化 */
            _this.serializableFields = {
                textures: qc.Serializer.TEXTURES,
                textureIdxs: qc.Serializer.INTS,
                space: qc.Serializer.NUMBER,
                direScroll: qc.Serializer.AUTO,
                listLayout: qc.Serializer.AUTO,
                duration: qc.Serializer.NUMBER,
                scrollCnt: qc.Serializer.NUMBER,
                stopToIdx: qc.Serializer.INT,
                isSpeedBlur: qc.Serializer.BOOLEAN,
                speedBlur: qc.Serializer.NUMBER,
                debug: qc.Serializer.BOOLEAN,
                smPlaying: qc.Serializer.STRING,
                smPlayingInterval: qc.Serializer.NUMBER,
                smFinish: qc.Serializer.STRING,
                lightIdx: qc.Serializer.NUMBER,
                msk: qc.Serializer.NODE,
                idleLightEffInterval: qc.Serializer.NUMBER,
                orgXY: qc.Serializer.AUTO,
            };
            _this.playCnt = 0;
            return _this;
        }
        Object.defineProperty(ListScroll.prototype, "scrollTime", {
            /** 滚动总时长（毫秒） */
            get: function () {
                if (!this.tw0 || !this.tw1)
                    return;
                return (this.tw0.duration * this.scrollCnt + this.tw1.duration) * 1000;
            },
            set: function (time) {
                this.duration = time;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(ListScroll.prototype, "stopIndex", {
            set: function (index) {
                this.stopToIdx = index;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(ListScroll.prototype, "SpeedBlurFlag", {
            set: function (flag) {
                this.isSpeedBlur = flag;
            },
            enumerable: false,
            configurable: true
        });
        ListScroll.prototype.awake = function (resetToEnd /*  ps.ENV === 'EDITOR' */) {
            if (resetToEnd === void 0) { resetToEnd = void 0; }
            this.state = ListScrollState.IDLE;
            this.xy = this.listLayout === ListLayout.HORIZONTAL ? "x" : "y";
            this.xyBack = this.listLayout === ListLayout.HORIZONTAL ? "y" : "x";
            this.wh = this.listLayout === ListLayout.HORIZONTAL ? "width" : "height";
            this.whBack =
                this.listLayout === ListLayout.HORIZONTAL ? "height" : "width";
            if (this.orgXY != void 0)
                this.gameObject[this.xy] = this.orgXY;
            else
                this.orgXY = this.gameObject[this.xy];
            if (this.orgXYBack != void 0)
                this.gameObject[this.xyBack] = this.orgXYBack;
            else
                this.orgXYBack = this.gameObject[this.xyBack];
            this.scrollCnt0 = Math.ceil(this.scrollCnt / 2);
            this.scrollCnt1 = this.scrollCnt - this.scrollCnt0;
            // if (ps.ENV === 'EDITOR') {
            this.renderList();
            this.cloneListBox(this.listBox0);
            // }
            this.initTw0();
            this.initTw1();
            if (!!resetToEnd)
                this.resetToEndTw1();
            else
                this.resetTw0();
            this.stopBlur();
            if (this.showLightE)
                this.game.timer.remove(this.showLightE);
            if (this.msk && this.idleLightEffInterval > 0)
                this.showLightE = this.game.timer.loop(this.idleLightEffInterval, this.showLight, this);
        };
        ListScroll.prototype.showLight = function (idx) {
            if (idx == void 0) {
                if (this.state !== ListScrollState.IDLE) {
                    return;
                }
                idx = ps.Random.floor(this.listBox0.children.length);
            }
            var img = this.listBox0.getChildAt(idx);
            if (!img)
                return;
            var msk = img.getChildByName("msk");
            var light;
            if (!msk) {
                msk = this.game.add.clone(this.msk);
                msk.name = "msk";
                img.addChild(msk);
                msk.x = msk.y = 0;
                light = msk.getChildByName("light");
            }
            msk.visible = true;
            light.x = 274;
            light.y = -70;
            var tw = light.getScript(qc.TweenPosition);
            tw.playForward(true);
        };
        /** 试玩初始化的处理 */
        ListScroll.prototype.onInit = function () { };
        /** 试玩开始时的处理 */
        ListScroll.prototype.onStart = function () {
            if (!this.debug)
                return;
            this.gameObject.addListener(this.game.input.onPointerDown, this.play, this);
        };
        ListScroll.prototype.renderList = function () {
            // this.listBox0 = this.gameObject.getChild('listBox0')
            // if (!this.listBox0) {
            this.gameObject.removeChildren();
            this.listBox0 = this.game.add.node(this.gameObject);
            this.listBox0.name = "listBox0";
            this.listBox0.x = 0;
            this.listBox0.y = 0;
            this.listBox0.width = 0;
            this.listBox0.height = 0;
            // }
            var nextImgXY = 0;
            if (this.direScroll === DireScroll.DOWN_OR_RIGHT) {
                var min = new qc.Point();
                var max = new qc.Point();
                min[this.xy] = max[this.xy] = 1;
                min[this.xyBack] = max[this.xyBack] = 0;
                this.listBox0["pivot".concat(this.xy.toUpperCase())] = 1;
                this.listBox0.setAnchor(min, max);
            }
            var whBackMax = 0;
            for (var i = 0; i < this.textureIdxs.length; i++) {
                var textureIdx = this.textureIdxs[i];
                if (textureIdx < 0) {
                    console.warn("图片索引值不能小于“0”！暂时使用“0”取代");
                    textureIdx = 0;
                }
                else if (textureIdx > this.textures.length - 1) {
                    console.warn("图片索引值不能大于“所有用到的图片纹理数组长度”！暂时使用“所有用到的图片纹理数组长度”取代");
                    textureIdx = this.textures.length - 1;
                }
                var texture = this.textures[textureIdx];
                if (!texture) {
                    console.error("\u5F53\u524D\u56FE\u7247\u7D22\u5F15".concat(textureIdx, "\u5728\u5E8F\u5217\u5316\u4E2D\u672A\u5B9A\u4E49\u503C\uFF01"));
                    continue;
                }
                var img = this.listBox0.getChildAt(i) ||
                    new qc.UIImage(this.game, this.listBox0);
                img.texture = texture;
                img.resetNativeSize();
                if (this.direScroll === DireScroll.DOWN_OR_RIGHT) {
                    img["pivot".concat(this.xy.toUpperCase())] = 1;
                    var min = new qc.Point();
                    var max = new qc.Point();
                    min[this.xy] = max[this.xy] = 1;
                    min[this.xyBack] = max[this.xyBack] = 0;
                    img.setAnchor(min, max);
                }
                var space = this.space;
                var addSpace = space; // i === this.textureIdxs.length - 1 ? 0 : space
                img["anchored".concat(this.xy.toUpperCase())] = nextImgXY; // (i * (img[this.wh] + space)) * -this.direScroll
                nextImgXY =
                    img["anchored" + this.xy.toUpperCase()] +
                        (img[this.wh] + space) * -this.direScroll;
                if (i === this.stopToIdx)
                    this.stopToXY = img[this.xy];
                this.listBox0[this.wh] += img[this.wh] + addSpace;
                whBackMax = Math.max(this.listBox0[this.whBack], img[this.whBack]);
            }
            this.listBox0[this.whBack] = whBackMax;
            this.gameObject[this.wh] = this.listBox0[this.wh];
            this.gameObject[this.whBack] = this.listBox0[this.whBack];
        };
        ListScroll.prototype.cloneListBox = function (listBox) {
            if (!listBox)
                return;
            // this.listBox1 = this.gameObject.getChild('listBox1')
            // if (this.listBox1 && this.listBox1.parent) return
            this.listBox1 = this.game.add.clone(listBox);
            this.listBox1.name = "listBox1";
            this.listBox1[this.xy] =
                listBox[this.xy] +
                    Math.max(this.space, 0) +
                    listBox[this.wh] * -this.direScroll;
        };
        Object.defineProperty(ListScroll.prototype, "tw0", {
            get: function () {
                var tws = this.gameObject.getScripts(qc.TweenPosition);
                if (!tws || tws.length <= 0)
                    return;
                return tws[0];
            },
            enumerable: false,
            configurable: true
        });
        ListScroll.prototype.initTw0 = function (resetFrom) {
            if (resetFrom === void 0) { resetFrom = true; }
            var tw0 = this.tw0;
            if (!tw0) {
                tw0 = this.gameObject.addScript("qc.TweenPosition");
                tw0.tweenGroup = 1;
            }
            tw0.moveAxis =
                this.xy === "x" ? qc.TweenPosition.ONLY_X : qc.TweenPosition.ONLY_Y;
            tw0.from[this.xy] = resetFrom ? this.orgXY : this.gameObject[this.xy];
            tw0.from[this.xyBack] = resetFrom
                ? this.orgXYBack
                : this.gameObject[this.xyBack];
            tw0.to[this.xy] =
                tw0.from[this.xy] + this.gameObject[this.wh] * this.direScroll;
            tw0.style = qc.Tween.STYLE_LOOP;
            tw0.duration = this.duration;
        };
        ListScroll.prototype.resetTw0 = function () {
            var tw0 = this.tw0;
            if (!tw0) {
                return;
            }
            tw0.resetToBeginning();
        };
        /** 滚动起来 */
        ListScroll.prototype.play = function (reset) {
            if (this.smPlaying) {
                // this.playSoundE = this.game.timer.loop(this.smPlayingInterval, () => {
                // ps.Audio.playSound(this.smPlaying, void 0, void 0, 1, Math.max(50, this.smPlayingInterval - 10))
                var nodeAudio = UIRoot.getChild(this.smPlaying);
                if (nodeAudio && (ps.AudioTrigger === null || ps.AudioTrigger === void 0 ? void 0 : ps.AudioTrigger.playSound)) {
                    ps.AudioTrigger.playSound(nodeAudio, true, false, 1);
                }
                else {
                    ps.Audio.playSound(this.smPlaying);
                }
                // })
            }
            this.state = ListScrollState.PLAYING_FIRST;
            this.playCnt = 0;
            var tw0 = this.tw0;
            if (!tw0)
                return;
            if (reset)
                this.resetTw0();
            tw0.onLoopFinished.remove(this.playFinishedTw0, this);
            tw0.onLoopFinished.add(this.playFinishedTw0, this);
            tw0.playForward(!!reset);
            this.startBlur();
        };
        ListScroll.prototype.startBlur = function () {
            //速度模糊
            var speedBlur = this.speedBlur;
            if (this.isSpeedBlur) {
                var filter = this.gameObject.getScript(qc.FilterGroup);
                if (!filter)
                    filter = this.gameObject.addScript("qc.FilterGroup");
                var BlurXY = this.xy === "x" ? qc.Filter.BlurX : qc.Filter.BlurY;
                var blurs = filter.findFilter(BlurXY);
                var blur_1 = blurs && blurs.length > 0 ? blurs[0] : null;
                if (!blur_1) {
                    blur_1 = new BlurXY(game, void 0, void 0);
                    blur_1 = filter.addFilter(blur_1);
                }
                blur_1.blur = speedBlur;
                filter.enable = true;
            }
        };
        ListScroll.prototype.stopBlur = function () {
            var filter = this.gameObject.getScript(qc.FilterGroup);
            if (!filter) {
                return;
            }
            filter.enable = false;
        };
        ListScroll.prototype.playFinishedTw0 = function () {
            this.playCnt++;
            if (this.scrollCnt < 0)
                return;
            if (this.playCnt >= this.scrollCnt) {
                this.eventDisp.dispatch(ListScrollEvent.PLAY_FINISHED_TW0);
                var tw0 = this.tw0;
                tw0.onLoopFinished.remove(this.playFinishedTw0, this);
                tw0.stop();
                this.playTw1();
            }
            else if (this.playCnt >= this.scrollCnt0) {
                this.eventDisp.dispatch(ListScrollEvent.PLAY_FINISHED_FIRST);
                this.state = ListScrollState.PLAYING_LAST;
            }
        };
        Object.defineProperty(ListScroll.prototype, "tw1", {
            get: function () {
                var tws = this.gameObject.getScripts(qc.TweenPosition);
                if (!tws || tws.length <= 1)
                    return;
                return tws[1];
            },
            enumerable: false,
            configurable: true
        });
        ListScroll.prototype.initTw1 = function (resetFrom) {
            if (resetFrom === void 0) { resetFrom = true; }
            var tw1 = this.tw1;
            if (!tw1) {
                tw1 = this.gameObject.addScript("qc.TweenPosition");
                tw1.tweenGroup = 1;
            }
            tw1.moveAxis =
                this.xy === "x" ? qc.TweenPosition.ONLY_X : qc.TweenPosition.ONLY_Y;
            tw1.from[this.xy] = resetFrom ? this.orgXY : this.gameObject[this.xy];
            tw1.from[this.xyBack] = resetFrom
                ? this.orgXYBack
                : this.gameObject[this.xyBack];
            var base = this.stopToIdx / (this.textures.length - 1);
            if (resetFrom)
                tw1.to[this.xy] = tw1.from[this.xy] + this.stopToXY * -this.direScroll;
            // else if (tw1.to[this.xy] * -this.direScroll < tw1.from[this.xy] * -this.direScroll) tw1.to[this.xy] += this.gameObject[this.wh] * this.direScroll
            tw1.duration = Math.max(this.duration * base, 0.001);
        };
        ListScroll.prototype.resetTw1 = function () {
            var tw1 = this.tw1;
            if (!tw1) {
                return;
            }
            tw1.resetToBeginning();
        };
        ListScroll.prototype.resetToEndTw1 = function () {
            var tw1 = this.tw1;
            if (!tw1) {
                return;
            }
            this.gameObject[this.xy] = tw1.to[this.xy];
            this.gameObject[this.xyBack] = tw1.to[this.xyBack];
        };
        ListScroll.prototype.resetToStopPot = function () {
            var tw1 = this.tw1;
            if (!tw1) {
                return;
            }
            this.gameObject[this.xy] = tw1.to[this.xy];
        };
        ListScroll.prototype.playTw1 = function () {
            var tw1 = this.tw1;
            if (!tw1)
                return;
            this.resetTw1();
            tw1.onFinished.addOnce(this.playFinishedTw1, this);
            tw1.playForward();
        };
        ListScroll.prototype.playFinishedTw1 = function () {
            if (this.playSoundE)
                this.game.timer.remove(this.playSoundE);
            if (this.smPlaying) {
                var nodeAudio = UIRoot.getChild(this.smPlaying);
                if (nodeAudio && (ps.AudioTrigger === null || ps.AudioTrigger === void 0 ? void 0 : ps.AudioTrigger.stopSound)) {
                    ps.AudioTrigger.stopSound(nodeAudio);
                }
                else {
                    ps.Audio.stopSound(this.smPlaying);
                }
            }
            if (this.smFinish) {
                var nodeAudio = UIRoot.getChild(this.smFinish);
                if (nodeAudio && (ps.AudioTrigger === null || ps.AudioTrigger === void 0 ? void 0 : ps.AudioTrigger.playSound)) {
                    ps.AudioTrigger.playSound(nodeAudio, true, false, 1);
                }
                else {
                    ps.Audio.playSound(this.smFinish);
                }
            }
            this.resetToStopPot();
            this.eventDisp.dispatch(ListScrollEvent.PLAY_FINISHED_LAST);
            this.state = ListScrollState.IDLE;
            this.stopBlur();
        };
        ListScroll.prototype.playLight = function () {
            if (this.lightIdx != void 0)
                this.showLight(this.lightIdx);
        };
        return ListScroll;
    }(ps.Behaviour));
    ps.ListScroll = ListScroll;
    qc.registerBehaviour("ps.ListScroll", ListScroll);
    ListScroll["__menu"] = "Custom/ListScroll";
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
//# sourceMappingURL=ListScroll.js.map