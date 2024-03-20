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
    var BtnControl = /** @class */ (function (_super) {
        __extends(BtnControl, _super);
        function BtnControl(gameObject) {
            var _this = _super.call(this, gameObject) || this;
            _this.serializableFields = {
                targetMc: qc.Serializer.NODE,
                yaogan: qc.Serializer.NODE
            };
            return _this;
        }
        BtnControl.prototype.awake = function () {
            this.gameObject.interactive = true;
            var yaoganCtr = this.yaogan.getScript("ps.virtual.VirtualJoystick");
            yaoganCtr.signal.add(this.yaoganCtr, this);
        };
        BtnControl.prototype.yaoganCtr = function (eventName, data) {
            if (eventName == "VirtualJoystick_UPDATE") {
                this.gameObject.rotation = data;
            }
        };
        BtnControl.prototype.update = function () {
        };
        BtnControl.prototype.onDown = function () {
            var mc = this.targetMc.getScript("ps.MovieClip");
            if (mc.isPlaying) {
                mc.stop();
            }
            else {
                mc.resume();
            }
        };
        BtnControl.prototype.playCom = function (aaa) {
            console.log(123);
            //this.targetMc.destroy();
        };
        return BtnControl;
    }(qc.Behaviour));
    ps.BtnControl = BtnControl;
    qc.registerBehaviour('ps.BtnControl', BtnControl);
})(ps || (ps = {}));
//# sourceMappingURL=BtnControl.js.map