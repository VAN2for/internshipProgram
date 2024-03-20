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
    var BubbleEvent;
    (function (BubbleEvent) {
        BubbleEvent["SHOW_START"] = "showStart";
        BubbleEvent["HIDE_START"] = "hideStart";
        BubbleEvent["SHOW_END"] = "showEnd";
        BubbleEvent["HIDE_END"] = "hideEnd";
    })(BubbleEvent = ps.BubbleEvent || (ps.BubbleEvent = {}));
    /**
     * 冒泡组件
     * @description 可用于冒泡对话框弹出显示、收起隐藏效果
     * @author JingBin
     */
    var Bubble = /** @class */ (function (_super) {
        __extends(Bubble, _super);
        function Bubble(gameObject) {
            var _this = _super.call(this, gameObject) || this;
            /** 持续漂浮Y值（范围为0或空时，不触发漂浮） */
            _this.floatY = -30;
            /** 持续漂浮时间（每次漂浮时间）（秒） */
            _this.floatT = .5;
            _this.event = new ps.EventDispatcher();
            /** Debug模式，点击播放动画 */
            _this._debug = false;
            _this.serializableFields = {
                debug: qc.Serializer.AUTO,
                floatY: qc.Serializer.NUMBER,
                floatT: qc.Serializer.NUMBER,
            };
            _this.runInEditor = true;
            return _this;
        }
        Object.defineProperty(Bubble.prototype, "debug", {
            /** Debug模式 */
            get: function () {
                return this._debug;
            },
            set: function (v) {
                this._debug = v;
            },
            enumerable: false,
            configurable: true
        });
        Bubble.prototype.awake = function () {
            this.initScaleX = this.gameObject.scaleX || 1;
            this.initScaleY = this.gameObject.scaleY || 1;
            this.initY = this.gameObject.y || 0;
            if (this.debug) {
                this.show();
                this.gameObject.interactive = true;
            }
        };
        Bubble.prototype.onDown = function () {
            if (this.isShow) {
                this.hide();
            }
            else {
                this.show();
            }
        };
        /** 显示 */
        Bubble.prototype.show = function () {
            var _this = this;
            if (!this.gameObject.parent)
                return;
            var tw = (this.gameObject.getScript(qc.TweenScale) || this.gameObject.addScript("qc.TweenScale"));
            this.gameObject.y = this.initY;
            this.gameObject.visible = true;
            // tw.from = new qc.Point(0, 0);
            this.gameObject.scaleX = this.gameObject.scaleY = 0;
            tw.to = new qc.Point(this.initScaleX, this.initScaleY);
            tw.duration = .2;
            tw.onFinished.addOnce(function () {
                _this.isShow = true;
                tw.destroy();
                _this.float();
                _this.event.dispatch(ps.BubbleEvent.SHOW_END);
            });
            tw.enable = true;
            tw.playForward();
            this.event.dispatch(ps.BubbleEvent.SHOW_START);
        };
        /** 持续漂浮 */
        Bubble.prototype.float = function () {
            if (!this.floatY || !this.floatT || this.floatT < 0) {
                return;
            }
            var tw = this.posTw = (this.gameObject.getScript(qc.TweenPosition) || this.gameObject.addScript("qc.TweenPosition"));
            tw.from = new qc.Point(this.gameObject.x, this.initY);
            tw.to = new qc.Point(this.gameObject.x, this.initY + this.floatY);
            tw.moveAxis = qc.TweenPosition.ONLY_Y;
            tw.style = qc.Tween.STYLE_PINGPONG;
            tw.duration = this.floatT;
            tw.enable = true;
            tw.playForward();
        };
        /** 隐藏 */
        Bubble.prototype.hide = function (destory) {
            var _this = this;
            var _tw = this.gameObject.getScript(qc.TweenPosition);
            if (_tw) {
                _tw.destroy();
            }
            if (!this.gameObject.parent)
                return;
            this.gameObject.y = this.initY;
            var tw = (this.gameObject.getScript(qc.TweenScale) || this.gameObject.addScript("qc.TweenScale"));
            tw.from = new qc.Point(this.initScaleX, this.initScaleY);
            tw.to = new qc.Point(0, 0);
            tw.duration = .2;
            tw.onFinished.addOnce(function () {
                _this.isShow = false;
                tw.destroy();
                _this.gameObject.visible = false;
                _this.gameObject.y = _this.initY;
                _this.gameObject.scaleX = _this.initScaleX;
                _this.gameObject.scaleY = _this.initScaleY;
                if (destory) {
                    _this.gameObject.destroy();
                }
                if (_this.debug) {
                    _this.game.timer.add(500, _this.show, _this);
                }
                _this.event.dispatch(ps.BubbleEvent.HIDE_END);
            });
            tw.enable = true;
            tw.playForward();
            this.event.dispatch(ps.BubbleEvent.HIDE_START);
        };
        Bubble.prototype.remove = function () {
            this.posTw = this.gameObject.getScript(qc.TweenPosition);
            if (this.posTw) {
                this.posTw.resetToBeginning();
                this.posTw.destroy();
                this.posTw = null;
            }
        };
        return Bubble;
    }(ps.Behaviour));
    ps.Bubble = Bubble;
    qc.registerBehaviour('ps.Bubble', Bubble);
    Bubble["__menu"] = 'Custom/Bubble';
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
