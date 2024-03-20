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
     * @date 2023/03/16 14:42:05
     */
    var JumpMeter = /** @class */ (function (_super) {
        __extends(JumpMeter, _super);
        function JumpMeter(gameObject) {
            var _this = _super.call(this, gameObject) || this;
            _this.Event = new ps.EventDispatcher();
            _this._count = 0;
            /** 序列化 */
            _this.serializableFields = {
                _globalNode: qc.Serializer.NODE,
            };
            return _this;
        }
        Object.defineProperty(JumpMeter.prototype, "count", {
            get: function () {
                return this._count;
            },
            set: function (v) {
                this._count = v;
            },
            enumerable: false,
            configurable: true
        });
        JumpMeter.prototype.createGui = function () {
            return {
                _globalNode: {
                    title: "挂载全局组件的节点",
                    component: "node", // 数字控件
                },
            };
        };
        JumpMeter.prototype.onInit = function () {
            this.globalScript = this._globalNode.getScript("ps.JumpView");
            qc.Node.prototype["setPropertyIgnoreLayout"] &&
                this.gameObject["setPropertyIgnoreLayout"]({ prop: "y" });
            this.gameObject.y = -(this._count * this.globalScript.boxOffsetY);
            this.gameObject.visible = true;
            this.meterHideTl = gsap
                .timeline({ paused: true })
                .to(this.gameObject, {
                alpha: 0,
                duration: 0.2,
            });
            this.globalScript &&
                this.globalScript.Event.add(ps.GEvent.boxFinishNum, this.onBoxFinishNum, this);
        };
        JumpMeter.prototype.onBoxFinishNum = function ($val) {
            if ($val === this._count) {
                this.globalScript.Event.dispatch("periodicFeedback", this._count);
                this.meterHideTl.restart();
            }
            else if ($val < this._count) {
                this.meterHideTl.pause(0);
            }
        };
        return JumpMeter;
    }(ps.Behaviour));
    ps.JumpMeter = JumpMeter;
    qc.registerBehaviour("ps.JumpMeter", JumpMeter);
    JumpMeter["__menu"] = "玩法模板/跳一跳玩法/阶段性检测组件（JumpMeter）";
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
//# sourceMappingURL=JumpMeter.js.map