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
     * 埋点组件,挂载的对象被点击时，会发送埋点信息
     * @author VaMP
     */
    var SendAction = /** @class */ (function (_super) {
        __extends(SendAction, _super);
        function SendAction() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.action = 1;
            /** 是否为点击触发 */
            _this.isClick = true;
            /** 序列化 */
            _this.serializableFields = {
                action: qc.Serializer.NUMBER,
                isClick: qc.Serializer.BOOLEAN,
            };
            return _this;
        }
        SendAction.prototype.awake = function () {
            var _this = this;
            this.gameObject.interactive = true;
        };
        SendAction.prototype.onDown = function () {
            if (this.isClick)
                return;
            ps.sendAction(this.action);
        };
        SendAction.prototype.onClick = function () {
            if (!this.isClick)
                return;
            ps.sendAction(this.action);
        };
        return SendAction;
    }(ps.Behaviour));
    ps.SendAction = SendAction;
    qc.registerBehaviour('ps.SendAction', SendAction);
    SendAction["__menu"] = 'Custom/SendAction';
})(ps || (ps = {}));
