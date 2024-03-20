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
     * @description 盒子组件
     * @author jingru.wu
     * @date 2023/03/16 14:22:38
     */
    var JumpBox = /** @class */ (function (_super) {
        __extends(JumpBox, _super);
        function JumpBox(gameObject) {
            var _this = _super.call(this, gameObject) || this;
            _this.Event = new ps.EventDispatcher();
            _this._boxes = [];
            _this._boxType = 0;
            _this._isLeft = false;
            _this._t = 0;
            _this._v = 1200;
            _this._initV = 500;
            _this._firstBoxX = 250;
            _this._isNeedStop = true;
            /** 序列化 */
            _this.serializableFields = {
                _v: qc.Serializer.NUMBER,
                _jumpView: qc.Serializer.NODE,
                _isNeedStop: qc.Serializer.BOOLEAN,
                _initV: qc.Serializer.NUMBER,
                _firstBoxX: qc.Serializer.NUMBER,
            };
            return _this;
        }
        JumpBox.prototype.createGui = function () {
            return {
                _v: {
                    title: "盒子速度",
                    component: "input",
                    field: {
                        type: "number",
                    },
                },
                _jumpView: {
                    title: "挂载全局组件的节点",
                    component: "node", // 数字控件
                },
                _isNeedStop: {
                    title: "是否需要停止第一个节点",
                    component: "switch", // 数字控件
                },
                _initV: {
                    title: "第一个盒子速度",
                    component: "input",
                    field: {
                        type: "number",
                    },
                },
                _firstBoxX: {
                    title: "第一个盒子停止的x值",
                    component: "input",
                    field: {
                        type: "number",
                    },
                },
            };
        };
        JumpBox.prototype.onInit = function () {
            this.gameObject.visible = false;
            if (qc.Node.prototype["setPropertyIgnoreLayout"]) {
                this.gameObject["setPropertyIgnoreLayout"]({
                    prop: "visible",
                    value: false,
                });
                this.gameObject["setPropertyIgnoreLayout"]({ prop: "x" });
                this.gameObject["setPropertyIgnoreLayout"]({ prop: "y" });
            }
            this._boxes = this.gameObject.children;
        };
        JumpBox.prototype.move = function () {
            var _a;
            this._jumpViewScript = this._jumpView.getScript("ps.JumpView");
            if (this._jumpViewScript.boxNum === 1) {
                this._v = (_a = this._initV) !== null && _a !== void 0 ? _a : this._v;
            }
            else {
                this._v = this._v;
            }
            this.gameObject.visible = true;
            this._jumpViewScript.curBox = this;
            this.stopMove();
            this._t = Date.now();
            this.gameObject.alpha = 0;
            ps.Tween.to(this.gameObject, { alpha: 1 }, 200, Phaser.Easing.Sinusoidal.InOut);
            this._moveEvent = ps.timer.frameLoop(this.onMoveTick.bind(this));
        };
        JumpBox.prototype.onMoveTick = function () {
            var delta = Date.now() - this._t;
            this._t = Date.now();
            var _a = this._jumpViewScript, curBox = _a.curBox, boxNum = _a.boxNum;
            if (!this._isNeedStop &&
                this._jumpViewScript.gameState == ps.JumpGameState.isReady)
                this._jumpViewScript.gameState = ps.JumpGameState.isPlaying;
            if (this._jumpViewScript.gameState != ps.JumpGameState.isPlaying &&
                ((this._isNeedStop && this.gameObject.x < this._firstBoxX) ||
                    !this._isNeedStop)) {
                // 到达停止
                if (this._jumpViewScript.gameState === ps.JumpGameState.isReady) {
                    !this._jumpViewScript.isStop &&
                        this._jumpViewScript.Event.dispatch(ps.GEvent.firstBoxArrive, this.gameObject);
                    this._jumpViewScript.isStop = true;
                }
                else if (this._jumpViewScript.gameState === ps.JumpGameState.isEnd) {
                    this.stopMove();
                }
                return;
            }
            if (curBox !== this) {
                var bScript = this._jumpViewScript.boxesScript;
                var i = bScript.indexOf(this);
                if (i > 0) {
                    var preBox = bScript[i - 1];
                    if (Math.abs(preBox.gameObject.x - this.gameObject.x) < 12) {
                        // 完美重叠
                        this._jumpViewScript.Event.dispatch(ps.GEvent.pefretIntergral, preBox, this);
                    }
                }
                this.stopMove();
                return;
            }
            var toX = this.gameObject.x +
                (((this._isLeft ? 1 : -1) * delta) / 1000) * this._v;
            this.gameObject.x = toX;
            if (this._latestBoxX != toX)
                this._jumpViewScript.checkBoxHitSheep();
            this._latestBoxX = toX;
        };
        JumpBox.prototype.stopMove = function () {
            if (!this._moveEvent)
                return;
            ps.timer.removeFrameLoop(this._moveEvent);
            this._moveEvent = undefined;
        };
        Object.defineProperty(JumpBox.prototype, "boxType", {
            get: function () {
                return this._boxType;
            },
            set: function (value) {
                if (this._boxType === value)
                    return;
                this._boxType = value;
                this._boxes.forEach(function ($b, $i) { return ($b.visible = $i === value - 1); });
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(JumpBox.prototype, "isLeft", {
            get: function () {
                return this._isLeft;
            },
            set: function (value) {
                this._isLeft = value;
            },
            enumerable: false,
            configurable: true
        });
        JumpBox.prototype.destroy = function () {
            this.stopMove();
            _super.prototype.destroy.call(this);
        };
        return JumpBox;
    }(ps.Behaviour));
    ps.JumpBox = JumpBox;
    qc.registerBehaviour("ps.JumpBox", JumpBox);
    JumpBox["__menu"] = "玩法模板/跳一跳玩法/盒子组件（JumpBox）";
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
//# sourceMappingURL=JumpBox.js.map