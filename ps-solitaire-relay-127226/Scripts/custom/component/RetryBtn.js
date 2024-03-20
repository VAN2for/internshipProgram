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
     * 重玩按钮组件
     * @author VaMP
     */
    var RetryBtn = /** @class */ (function (_super) {
        __extends(RetryBtn, _super);
        function RetryBtn(gameObject) {
            var _this = _super.call(this, gameObject) || this;
            /** 是否激活 */
            _this.active = true;
            /** 重玩参数的Key */
            _this._playAgainKey = "playAgain";
            /** 没有次数后点击跳转商店 */
            _this.toInstall = false;
            /**
             * 跳转商店类型
             * @description 没有次数后点击跳转商店
             */
            _this._installType = ps.InstallType.YouDao;
            /** 没有次数后隐藏按钮 */
            _this.autoHide = true;
            _this.serializableFields = {
                active: qc.Serializer.BOOLEAN,
                _playAgainKey: qc.Serializer.STRING,
                toInstall: qc.Serializer.BOOLEAN,
                _installType: qc.Serializer.INT,
                autoHide: qc.Serializer.BOOLEAN,
            };
            // Init the behaviour
            _this.gameObject.interactive = true;
            return _this;
        }
        RetryBtn.prototype.awake = function () {
            this.updateStatus();
        };
        RetryBtn.prototype.onUp = function () {
            if (!this.active)
                return;
            if (GAME_CFG[this._playAgainKey] != 0) {
                ps.playerRetry = true;
                if (ps.cfg.DISABLE_RETRY_ACTIONS)
                    ps.enableAction = false;
                ps.retry();
                GAME_CFG[this._playAgainKey]--;
                this.updateStatus();
            }
            else if (this.toInstall) {
                ps.install(this._installType);
            }
        };
        /** 更新按钮状态 */
        RetryBtn.prototype.updateStatus = function () {
            if (this.autoHide)
                this.gameObject.visible = GAME_CFG[this._playAgainKey] > 0;
        };
        return RetryBtn;
    }(qc.Behaviour));
    ps.RetryBtn = RetryBtn;
    qc.registerBehaviour("ps.RetryBtn", RetryBtn);
    RetryBtn["__menu"] = "Btn/Retry";
})(ps || (ps = {}));
//# sourceMappingURL=RetryBtn.js.map