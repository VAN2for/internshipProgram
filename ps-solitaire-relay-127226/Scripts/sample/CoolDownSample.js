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
/** CD的名字类型 */
var cdType;
(function (cdType) {
    cdType[cdType["ctrlRemind"] = 0] = "ctrlRemind";
})(cdType || (cdType = {}));
var CoolDownSample = /** @class */ (function (_super) {
    __extends(CoolDownSample, _super);
    function CoolDownSample() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /** 序列化 */
        _this.serializableFields = {
            cdName: qc.Serializer.STRING,
            duration: qc.Serializer.NUMBER,
            uiText: qc.Serializer.NODE,
            finger: qc.Serializer.NODE,
        };
        return _this;
    }
    CoolDownSample.prototype.onStart = function () {
        var _this = this;
        this.cd = ps.cdManager.addCD(this.cdName, this.duration);
        this.cd.add(ps.CoolDown.FINISH, function () {
            _this.print("finish", true);
        });
        this.cd.add(ps.CoolDown.DO, function () {
            _this.print("do", true);
        });
        this.cd.add(ps.CoolDown.DOFALSE, function () {
            _this.print("do false", true);
        });
        //qc_game.time.timeScale =10;
        //状态切换机
        var state = new ps.SwitchState(function () {
            Tween.showAlpha(_this.finger, 300);
            ps.Print.purple("显示指引");
        }, function () {
            Tween.hideAlpha(_this.finger, 300);
            ps.Print.purple("隐藏指引");
        }, true);
        this.ctrlRemind = ps.cdManager.addCD(cdType.ctrlRemind, 3000);
        this.ctrlRemind.add(ps.CoolDown.DO, function () { return state.close(); });
        this.ctrlRemind.add(ps.CoolDown.FINISH, function () { return state.open(); });
    };
    CoolDownSample.prototype.update = function () {
        if (!this.cd)
            return;
        var str = "".concat(this.cdName, ":").concat(Math.ceil(this.cd.percentage * 100), "% ").concat(this.cd.remainingTime);
        this.uiText.text = str;
        this.uiText.color = this.cd.canDo ? new qc.Color("#00ff00") : new qc.Color("#ff0000");
    };
    CoolDownSample.prototype.print = function (text, print) {
        if (print === void 0) { print = false; }
        if (print)
            ps.Print.purple(this.cdName + ":" + text);
        else
            this.uiText.text = this.cdName + ":" + text;
    };
    return CoolDownSample;
}(ps.Behaviour));
qc.registerBehaviour('CoolDownSample', CoolDownSample);
//# sourceMappingURL=CoolDownSample.js.map