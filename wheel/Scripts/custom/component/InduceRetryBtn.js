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
     * @author hubluesky
     */
    var InduceRetryBtn = /** @class */ (function (_super) {
        __extends(InduceRetryBtn, _super);
        function InduceRetryBtn(gameObject) {
            var _this = _super.call(this, gameObject) || this;
            /** 重玩参数的Key */
            _this._playAgainKey = "playAgain";
            _this.serializableFields = {
                induceText: qc.Serializer.STRING,
                _playAgainKey: qc.Serializer.STRING,
            };
            _this.induceText = "";
            // Init the behaviour
            _this.gameObject.interactive = true;
            return _this;
        }
        InduceRetryBtn.prototype.awake = function () {
            if (GAME_CFG[this._playAgainKey] <= 0) {
                if (ps.disable_yd_click()) {
                    this.gameObject.visible = false;
                }
                else {
                    var label = this.gameObject.getChildAt(0);
                    if (label && !String.isEmptyOrNull(this.induceText)) {
                        languagesMgr.updateLabel(label, this.induceText);
                    }
                }
            }
        };
        InduceRetryBtn.prototype.onUp = function () {
            if (GAME_CFG[this._playAgainKey] != 0) {
                ps.playerRetry = true;
                if (ps.cfg.DISABLE_RETRY_ACTIONS)
                    ps.enableAction = false;
                GAME_CFG[this._playAgainKey]--;
                ps.retry();
            }
            else {
                ps.install(ps.InstallType.YouDao);
            }
        };
        return InduceRetryBtn;
    }(qc.Behaviour));
    ps.InduceRetryBtn = InduceRetryBtn;
    qc.registerBehaviour("ps.InduceRetryBtn", InduceRetryBtn);
    InduceRetryBtn["__menu"] = "Btn/InduceRetryBtn";
})(ps || (ps = {}));
//# sourceMappingURL=InduceRetryBtn.js.map