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
    var tween;
    (function (tween) {
        /**
         * 点击缓动缩放组件
         * @description 点击缓动缩放组件。按下缩放，抬起恢复
         * @author JingBin
         */
        var ClickTweenScale = /** @class */ (function (_super) {
            __extends(ClickTweenScale, _super);
            function ClickTweenScale(gameObject) {
                var _this = _super.call(this, gameObject) || this;
                _this._initS = new qc.Point();
                /** 按下缩放动画比例 */
                _this.scale = .95;
                /** 按下缩放动画耗时 */
                _this.durationDown = 50;
                /** 抬起缩放动画耗时 */
                _this.durationUp = 100;
                /** 序列化 */
                _this.serializableFields = {
                    scale: qc.Serializer.NUMBER,
                    durationDown: qc.Serializer.NUMBER,
                    durationUp: qc.Serializer.NUMBER,
                };
                return _this;
            }
            ClickTweenScale.prototype.awake = function () {
                this._initS.x = this.gameObject.scaleX;
                this._initS.y = this.gameObject.scaleY;
            };
            ClickTweenScale.prototype.onDown = function () {
                this.clearTw();
                this.resetScale();
                if (this.durationDown > 0) {
                    this._downTw = this.addTween({
                        scaleX: this._initS.x * this.scale,
                        scaleY: this._initS.y * this.scale,
                    }, this.durationDown, Phaser.Easing.Sinusoidal.In);
                    qc_game.input.onPointerUp.remove(this.onPointerUp, this);
                    qc_game.input.onPointerUp.addOnce(this.onPointerUp, this);
                }
            };
            ClickTweenScale.prototype.onPointerUp = function () {
                this.clearTw();
                if (this.durationDown > 0) {
                    this._upTw = this.addTween({
                        scaleX: this._initS.x,
                        scaleY: this._initS.y,
                    }, this.durationDown, Phaser.Easing.Sinusoidal.Out);
                }
            };
            ClickTweenScale.prototype.clearTw = function () {
                ps.Tween.clear(this._downTw);
                ps.Tween.clear(this._upTw);
            };
            ClickTweenScale.prototype.resetScale = function () {
                this.gameObject.scaleX = this._initS.x;
                this.gameObject.scaleY = this._initS.y;
            };
            ClickTweenScale.prototype.addTween = function (props, duration, ease) {
                return ps.Tween.to(this.gameObject, props, duration, ease);
            };
            return ClickTweenScale;
        }(ps.Behaviour));
        tween.ClickTweenScale = ClickTweenScale;
        qc.registerBehaviour('ps.tween.ClickAnswerScript', ClickTweenScale);
        ClickTweenScale['__menu'] = 'CustomTween/ClickTweenScale';
    })(tween = ps.tween || (ps.tween = {}));
})(ps || (ps = {}));
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
//# sourceMappingURL=ClickTweenScale.js.map