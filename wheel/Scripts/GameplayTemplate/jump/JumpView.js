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
     *
     * @description
     * @author jingru.wu
     * @date 2023/03/16 15:03:07
     */
    var GEvent;
    (function (GEvent) {
        /** 游戏成功 */
        GEvent[GEvent["gameSuccess"] = 0] = "gameSuccess";
        /** 游戏失败 */
        GEvent[GEvent["gameDefeat"] = 1] = "gameDefeat";
        /** 有效点击
         * @var times 点击次数
         */
        GEvent[GEvent["vaildDown"] = 2] = "vaildDown";
        /** 第一个盒子到达指定位置
         * @var box 第一个盒子的JumpBox脚本
         */
        GEvent[GEvent["firstBoxArrive"] = 3] = "firstBoxArrive";
        /** 完整合并反馈
         * @var preBox 完整合并的上一个盒子的JumpBox脚本
         * @var curBox 完整合并当前的盒子的JumpBox脚本
         */
        GEvent[GEvent["pefretIntergral"] = 4] = "pefretIntergral";
        /**
         * 角色站在盒子上面时
         * @var boxFinishNum 当前角色已完成的盒子个数
         */
        GEvent[GEvent["boxFinishNum"] = 5] = "boxFinishNum";
        /**
         * 阶段性反馈
         * @var leverNum 层数
         */
        GEvent[GEvent["periodicFeedback"] = 6] = "periodicFeedback";
    })(GEvent = ps.GEvent || (ps.GEvent = {}));
    var JumpGameState;
    (function (JumpGameState) {
        JumpGameState[JumpGameState["isReady"] = 0] = "isReady";
        JumpGameState[JumpGameState["isPlaying"] = 1] = "isPlaying";
        JumpGameState[JumpGameState["isEnd"] = 2] = "isEnd";
    })(JumpGameState = ps.JumpGameState || (ps.JumpGameState = {}));
    var JumpView = /** @class */ (function (_super) {
        __extends(JumpView, _super);
        function JumpView(gameObject) {
            var _this = _super.call(this, gameObject) || this;
            _this.Event = new ps.EventDispatcher();
            _this._boxNum = 0;
            _this._boxMaxNum = 20;
            _this._boxesScript = [];
            _this._boxFinishNum = 0;
            _this._boxesTopY = 0;
            _this._downNum = 0;
            _this._isJumping = false;
            _this.gameState = JumpGameState.isReady;
            _this._countdown = 1000;
            _this.isStop = false;
            _this._perMeter = 10;
            _this._winIsToInit = false;
            _this._defeatIsToInit = false;
            _this._winIsToInitTime = 2000;
            _this._defeatIsToInitTime = 2000;
            _this._bgScrollTime = 300;
            _this._boxAppearX = 500;
            /** 序列化 */
            _this.serializableFields = {
                _boxFab: qc.Serializer.NODE,
                _petNode: qc.Serializer.NODE,
                _cloudFab: qc.Serializer.NODE,
                _meterFab: qc.Serializer.NODE,
                _nStage: qc.Serializer.NODE,
                _countdown: qc.Serializer.NUMBER,
                _perMeter: qc.Serializer.NUMBER,
                _boxMaxNum: qc.Serializer.NUMBER,
                _winIsToInit: qc.Serializer.BOOLEAN,
                _defeatIsToInit: qc.Serializer.BOOLEAN,
                _winIsToInitTime: qc.Serializer.NUMBER,
                _defeatIsToInitTime: qc.Serializer.NUMBER,
                _bgScrollTime: qc.Serializer.NUMBER,
                _boxAppearX: qc.Serializer.NUMBER,
            };
            _this._meters = [];
            return _this;
        }
        JumpView.prototype.createGui = function () {
            return {
                _boxFab: {
                    title: "盒子组件节点",
                    component: "node", // 数字控件
                },
                _petNode: {
                    title: "角色组件节点",
                    component: "node", // 数字控件
                },
                _bg: {
                    title: "静态背景节点",
                    component: "node", // 数字控件
                },
                _cloudFab: {
                    title: "动态背景节点",
                    component: "node", // 数字控件
                },
                _meterFab: {
                    title: "阶段性反馈组件节点",
                    component: "node", // 数字控件
                },
                _nStage: {
                    title: "移动节点",
                    component: "node", // 数字控件
                },
                _winIsToInit: {
                    title: "胜利后背景回到初始位置",
                    component: "switch", // 数字控件
                },
                _defeatIsToInit: {
                    title: "失败后背景回到初始位置",
                    component: "switch", // 数字控件
                },
                _countdown: {
                    title: "游戏开始倒计时",
                    component: "input",
                    field: {
                        type: "number",
                    },
                },
                _bgScrollTime: {
                    title: "游戏过程中背景每次滚动的时间",
                    component: "input",
                    field: {
                        type: "number",
                    },
                },
                _boxAppearX: {
                    title: "盒子生成距中心位置的x轴距离",
                    component: "input",
                    field: {
                        type: "number",
                    },
                },
                _perMeter: {
                    title: "阶段性胜利层数",
                    component: "input",
                    field: {
                        type: "number",
                    },
                },
                _boxMaxNum: {
                    title: "胜利层数",
                    component: "input",
                    field: {
                        type: "number",
                    },
                },
                _winIsToInitTime: {
                    title: "胜利后间隔多久开始滚动",
                    component: "input",
                    field: {
                        type: "number",
                    },
                },
                _defeatIsToInitTime: {
                    title: "失败后间隔多久开始滚动",
                    component: "input",
                    field: {
                        type: "number",
                    },
                },
            };
        };
        Object.defineProperty(JumpView.prototype, "boxNum", {
            get: function () {
                return this._boxNum;
            },
            set: function ($value) {
                this._boxNum = $value;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(JumpView.prototype, "boxFinishNum", {
            get: function () {
                return this._boxFinishNum;
            },
            set: function ($value) {
                if (this._boxFinishNum == $value)
                    return;
                this._boxFinishNum = $value;
                this.Event.dispatch(GEvent.boxFinishNum, $value);
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(JumpView.prototype, "boxMaxNum", {
            get: function () {
                return this._boxMaxNum;
            },
            set: function ($value) {
                this._boxMaxNum = $value;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(JumpView.prototype, "curBox", {
            get: function () {
                return this._curBox;
            },
            set: function ($value) {
                this._curBox = $value;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(JumpView.prototype, "boxOffsetY", {
            get: function () {
                return this._boxOffsetY;
            },
            set: function ($value) {
                this._boxOffsetY = $value;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(JumpView.prototype, "boxesScript", {
            get: function () {
                return this._boxesScript;
            },
            set: function ($value) {
                this._boxesScript = $value;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(JumpView.prototype, "isJumping", {
            get: function () {
                return this._isJumping;
            },
            set: function ($value) {
                if (this._isJumping == $value) {
                    return;
                }
                this.Event.dispatch("jump", $value);
                this._isJumping = $value;
            },
            enumerable: false,
            configurable: true
        });
        JumpView.prototype.onInit = function () {
            var _this = this;
            ps.timer.once(this._countdown, function () {
                _this.createBox();
            });
            this._boxOffsetY = this._boxFab.children[0].height;
            this._nStageInit = this._nStage.y;
            this._petScript = this._petNode.getScript("ps.JumpSheep");
            this.Event.add("checkBoxHipSheep", this.checkBoxHitSheep, this);
            this.initClouds();
            this.initMeters();
            this._nStage.width = 0;
            this._nStage.height = 0;
            this._petNode.parent.width = 0;
            this._petNode.parent.height = 0;
        };
        JumpView.prototype.fixAnchored = function () {
            if (!this._cloudFab)
                return;
            this._cloudFab.parent.width = 0;
            this._cloudFab.parent.height = 0;
            this._cloudFab.setAnchor(new qc.Point(0.5, 1), new qc.Point(0.5, 1), true);
            this._cloudFab.pivotX = 0.5;
            this._cloudFab.pivotY = 1;
        };
        JumpView.prototype.createBox = function () {
            if (this._boxNum >= this._boxMaxNum) {
                // 游戏胜利
                this.gameEnd(true);
            }
            else {
                this._boxNum++;
                this.onBoxNum();
            }
        };
        /** 创建盒子 */
        JumpView.prototype.onBoxNum = function () {
            if (this._boxNum > this._boxesScript.length) {
                var box = qc_game.add.clone(this._boxFab, this._boxFab.parent);
                this._boxFab.parent.setChildIndex(box, 0);
                box.visible = true;
                var boxScript = box.getScript(ps.JumpBox);
                this._boxesScript.push(boxScript);
                boxScript.boxType =
                    ((this._boxNum - 1) % this._boxFab.children.length) + 1;
                var isLeft = this._boxesScript.length <= 2 ? false : Math.random() > 0.5;
                boxScript.isLeft = isLeft;
                box.x = (isLeft ? -1 : 1) * this._boxAppearX;
                box.y = -(this._boxesScript.length - 1) * this._boxOffsetY;
                this._boxesTopY = box.y - this._boxOffsetY;
                this.onBoxesTopY();
                boxScript.move();
            }
            else {
                this._boxesScript.forEach(function ($b) { return $b.destroy(); });
                this._boxesScript.splice(0);
            }
        };
        /** 改变可动元素的整体高度 */
        JumpView.prototype.onBoxesTopY = function () {
            if (!this._nStage)
                return; //兼容编辑器
            var halfY = this.gameObject.height >> 1;
            var temp = this._nStage.y + this._boxesTopY;
            qc.Node.prototype["setPropertyIgnoreLayout"] &&
                this._nStage["setPropertyIgnoreLayout"]({ prop: "y" });
            if (temp < halfY) {
                var y = halfY - this._boxesTopY;
                ps.Tween.to(this._nStage, { y: y }, this._bgScrollTime);
            }
        };
        /** 初始化云 */
        JumpView.prototype.initClouds = function () {
            if (!this._cloudFab)
                return;
            this._cloudFab.imageType =
                qc.UIImage.IMAGE_TYPE_TILED;
            this._cloudFab.resetNativeSize();
            var cloudH = this._cloudFab.height;
            this._cloudFab.height =
                Math.ceil((this._boxOffsetY * this._boxMaxNum) / cloudH) *
                    cloudH;
        };
        /** 初始化线 */
        JumpView.prototype.initMeters = function () {
            var _a;
            if (this._perMeter === 0 || !this._meterFab)
                return;
            if (qc.Node.prototype["setPropertyIgnoreLayout"]) {
                this._meterFab["setPropertyIgnoreLayout"]({ prop: "y" });
                this._meterFab["setPropertyIgnoreLayout"]({
                    prop: "visible",
                    value: false,
                });
            }
            var parent = this._boxFab.parent;
            this._meterFab.visible = false;
            var meterN = (((_a = this._boxMaxNum) !== null && _a !== void 0 ? _a : 20) / 10) | 0;
            for (var i = 1; i <= meterN; i++) {
                var meter = this.game.add
                    .clone(this._meterFab, parent)
                    .getScript("ps.JumpMeter");
                this._meters.push(meter);
                meter.count = i * this._perMeter;
                meter.onInit();
            }
        };
        JumpView.prototype.gameEnd = function ($isSuccess) {
            var _this = this;
            this.gameState = JumpGameState.isEnd;
            if ($isSuccess) {
                ps.gameEnd(true);
                this._winIsToInit &&
                    ps.timer.once(this._winIsToInitTime, function () {
                        _this.nStageToInit();
                    });
                this.Event.dispatch(GEvent.gameSuccess);
            }
            else {
                ps.gameEnd(false);
                this._defeatIsToInit &&
                    ps.timer.once(this._defeatIsToInitTime, function () {
                        _this.nStageToInit();
                    });
                this.Event.dispatch(GEvent.gameDefeat);
            }
        };
        JumpView.prototype.nStageToInit = function () {
            var layout = this._nStage.getScript("ps.Layout");
            if (layout) {
                layout.ignoreProps = Object["values"](layout.ignoreProps);
                layout.ignoreProps = layout.ignoreProps.filter(function (o) { return o !== "y"; });
                layout.refresh();
            }
            else {
                this._nStage.y = this._nStageInit;
            }
        };
        // 碰撞检测
        JumpView.prototype.checkBoxHitSheep = function () {
            if (!(this._petScript.nodeJumpSize || this._petScript.nodeStandSize))
                return;
            var _a = this._isJumping
                ? this._petScript.nodeJumpSize
                : this._petScript.nodeStandSize, l = _a.l, r = _a.r, b = _a.b, t = _a.t;
            var curBox = this.curBox;
            var _b = curBox.gameObject, x = _b.x, y = _b.y;
            var _c = curBox.gameObject.children[0], width = _c.width, height = _c.height;
            var boxhw = width >> 1;
            var boxhh = height >> 1;
            var _d = this._petNode, myX = _d.x, myY = _d.y;
            var _e = this._petNode, myW = _e.width, myH = _e.height;
            var petB = myY + myH / 2 - b;
            var petT = myY - myH / 2 + t;
            var myhw = myW >> 1;
            if (myX + myhw - r > x - boxhw && //碰撞箱子左侧
                myX - myhw + l < x + boxhw && //碰撞箱子右侧
                petT <= y + boxhh &&
                petB >= y - boxhh) {
                //在箱体范围
                var isFailed = petB > y - boxhh + 20;
                if (isFailed) {
                    // 游戏失败
                    this._petScript.gameFail();
                    return;
                }
                else if (curBox.isLeft ? myX < x + boxhw : myX > x - boxhw) {
                    this.isJumping = false;
                    this.boxFinishNum = this.boxNum;
                    this._petNode.y = y - boxhh - (myH / 2 - b);
                    this.createBox();
                }
            }
        };
        JumpView.prototype.onDown = function () {
            // 点击屏幕
            if ((this.gameState === JumpGameState.isPlaying || this.isStop) &&
                !this._isJumping) {
                this.isStop = false;
                this._downNum++;
                this.gameState = JumpGameState.isPlaying;
                this.Event.dispatch(GEvent.vaildDown, this._downNum);
                this.isJumping = true;
            }
        };
        return JumpView;
    }(ps.Behaviour));
    ps.JumpView = JumpView;
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
    qc.registerBehaviour("ps.JumpView", JumpView);
    JumpView["__menu"] = "玩法模板/跳一跳玩法/全局组件（JumpView）";
})(ps || (ps = {}));
//# sourceMappingURL=JumpView.js.map