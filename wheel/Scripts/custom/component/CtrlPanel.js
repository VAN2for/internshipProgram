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
     * 控制面板，进行触摸操作会发送GameEvent事件
     * @author VaMP
     */
    var CtrlPanel = /** @class */ (function (_super) {
        __extends(CtrlPanel, _super);
        function CtrlPanel(gameObject) {
            var _this = _super.call(this, gameObject) || this;
            /** 序列化 */
            _this.serializableFields = {
                clickEvent: qc.Serializer.STRING,
                downEvent: qc.Serializer.STRING,
                upEvent: qc.Serializer.STRING,
                dragEvent: qc.Serializer.STRING,
            };
            return _this;
        }
        CtrlPanel.prototype.onClick = function (e) {
            if (this.clickEvent && this.clickEvent != "")
                gameEvent.event(this.clickEvent, e);
        };
        CtrlPanel.prototype.onDown = function (e) {
            if (this.downEvent && this.downEvent != "")
                gameEvent.event(this.downEvent, e);
        };
        CtrlPanel.prototype.onUp = function (e) {
            if (this.upEvent && this.upEvent != "")
                gameEvent.event(this.upEvent, e);
        };
        CtrlPanel.prototype.onDrag = function (e) {
            if (this.dragEvent && this.dragEvent != "")
                gameEvent.event(this.dragEvent, e);
        };
        return CtrlPanel;
    }(ps.Behaviour));
    qc.registerBehaviour("CtrlPanel", CtrlPanel);
})(ps || (ps = {}));
//# sourceMappingURL=CtrlPanel.js.map