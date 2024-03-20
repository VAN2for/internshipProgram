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
    var SwitchEvent;
    (function (SwitchEvent) {
        SwitchEvent["UpdateState"] = "UpdateState";
    })(SwitchEvent = ps.SwitchEvent || (ps.SwitchEvent = {}));
    /**
     * 开关组件
     * @description 开关组件
     * @author JingBin
     */
    var Switch = /** @class */ (function (_super) {
        __extends(Switch, _super);
        function Switch(gameObject) {
            var _this = _super.call(this, gameObject) || this;
            /** 是否可点击 */
            _this.active = true;
            /** 开关状态 */
            _this.state = true;
            _this.event = new ps.EventDispatcher();
            /** 序列化 */
            _this.serializableFields = {
                active: qc.Serializer.BOOLEAN,
                state: qc.Serializer.BOOLEAN,
                openTex: qc.Serializer.TEXTURE,
                closeTex: qc.Serializer.TEXTURE,
            };
            return _this;
        }
        /** 试玩初始化的处理 */
        Switch.prototype.onInit = function () {
            // ps.Print.purple('Switch.onInit')
            this.gameObject.interactive = this.active;
        };
        /** 试玩开始时的处理 */
        Switch.prototype.onStart = function () {
            // ps.Print.purple('Switch.onStart')
            this.updateState();
        };
        Switch.prototype.onDown = function () {
            this.state = !this.state;
            this.updateState();
        };
        Switch.prototype.updateState = function (state, dispatch) {
            if (dispatch === void 0) { dispatch = true; }
            if (state != void 0)
                this.state = state;
            else
                state = this.state;
            var tex = state ? this.openTex : this.closeTex;
            if (tex) {
                this.gameObject.texture = tex;
                this.gameObject.resetNativeSize();
            }
            if (dispatch)
                this.event.dispatch(ps.SwitchEvent.UpdateState, state);
        };
        return Switch;
    }(ps.Behaviour));
    ps.Switch = Switch;
    qc.registerBehaviour('ps.Switch', Switch);
    Switch['__menu'] = 'Custom/Switch';
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
