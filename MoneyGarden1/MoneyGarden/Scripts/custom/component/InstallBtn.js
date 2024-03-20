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
        var InstallBtn = /** @class */ (function (_super) {
            __extends(InstallBtn, _super);
            function InstallBtn(gameObject) {
                var _this = _super.call(this, gameObject) || this;
                /** 点击的同时自动跳转gameEnd */
                _this.autoGameEnd = false;
                /** 自动放大缩小比例，0为不缩放。默认为0 */
                _this.scale = 0;
                /** 缩放间隔时间，单位毫秒，默认500 */
                _this.duration = 500;
                _this.delay = 0;
                _this.installType = ps.InstallType.None;
                /** 是否为点击触发 */
                _this.isClick = true;
                _this.serializableFields = {
                    autoGameEnd: qc.Serializer.BOOLEAN,
                    scale: qc.Serializer.NUMBER,
                    duration: qc.Serializer.NUMBER,
                    delay: qc.Serializer.NUMBER,
                    installType: qc.Serializer.AUTO,
                    isClick: qc.Serializer.BOOLEAN,
                };
                return _this;
            }
            InstallBtn.prototype.awake = function () {
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
            };
            InstallBtn.prototype.onEnable = function () {
                if (this.tween)
                    this.tween.resume();
            };
            InstallBtn.prototype.onDisable = function () {
                if (this.tween)
                    this.tween.pause();
            };
            InstallBtn.prototype.onDown = function () {
                if (this.isClick)
                    return;
                ps.install(this.installType);
            };
            InstallBtn.prototype.onClick = function () {
                if (!this.isClick)
                    return;
                ps.install(this.installType);
            };
            return InstallBtn;
        }(qc.Behaviour));
        btn.InstallBtn = InstallBtn;
        qc.registerBehaviour("ps.InstallBtn", InstallBtn);
        InstallBtn["__menu"] = "Btn/InstallBtn";
    })(btn = ps.btn || (ps.btn = {}));
})(ps || (ps = {}));
