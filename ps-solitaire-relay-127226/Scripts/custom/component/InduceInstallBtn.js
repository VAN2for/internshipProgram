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
    var btn;
    (function (btn) {
        /**
         * 安装按钮组件
         * @author VaMP
         */
        var InduceInstallBtn = /** @class */ (function (_super) {
            __extends(InduceInstallBtn, _super);
            function InduceInstallBtn(gameObject) {
                var _this = _super.call(this, gameObject) || this;
                /** 点击的同时自动跳转gameEnd */
                _this.autoGameEnd = false;
                /** 自动放大缩小比例，0为不缩放。默认为0 */
                _this.scale = 0;
                /** 缩放间隔时间，单位毫秒，默认500 */
                _this.duration = 500;
                _this.delay = 0;
                /** 诱导跳转下的文案Key */
                _this.youDaoText = "";
                _this.serializableFields = {
                    autoGameEnd: qc.Serializer.BOOLEAN,
                    scale: qc.Serializer.NUMBER,
                    duration: qc.Serializer.NUMBER,
                    delay: qc.Serializer.NUMBER,
                    installType: qc.Serializer.AUTO,
                    youDaoText: qc.Serializer.STRING
                };
                return _this;
            }
            InduceInstallBtn.prototype.awake = function () {
                var _this = this;
                this.gameObject.interactive = true;
                //谷歌平台不允许按钮缩放
                if (this.scale != 0 && ps.channel != "google") {
                    this.gameObject.pivotX = 0.5;
                    this.gameObject.pivotY = 0.5;
                    ps.timer.once(this.delay, function () {
                        _this.tween = ps.Tween.zoom(_this.gameObject, _this.scale, _this.duration);
                    });
                }
                var youdaotext = this.gameObject.getChildAt(0);
                if (ps.disable_yd_click() && youdaotext) {
                    languagesMgr.updateLabel(youdaotext, this.youDaoText);
                }
            };
            InduceInstallBtn.prototype.onEnable = function () {
                if (this.tween)
                    this.tween.resume();
            };
            InduceInstallBtn.prototype.onDisable = function () {
                if (this.tween)
                    this.tween.pause();
            };
            InduceInstallBtn.prototype.onDown = function () {
                var installType = ps.disable_yd_click() ? ps.InstallType.None : ps.InstallType.YouDao;
                ps.install(installType);
            };
            return InduceInstallBtn;
        }(qc.Behaviour));
        btn.InduceInstallBtn = InduceInstallBtn;
        qc.registerBehaviour("ps.InduceInstallBtn", InduceInstallBtn);
        InduceInstallBtn["__menu"] = "Btn/InduceInstallBtn";
    })(btn = ps.btn || (ps.btn = {}));
})(ps || (ps = {}));
//# sourceMappingURL=InduceInstallBtn.js.map