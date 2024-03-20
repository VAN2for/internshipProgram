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
     * 多语言系统组件
     * @author JingBin
     */
    var Languages = /** @class */ (function (_super) {
        __extends(Languages, _super);
        function Languages(gameObject) {
            var _this = _super.call(this, gameObject) || this;
            /** 序列化 */
            _this.serializableFields = {
                langKey: qc.Serializer.STRING,
                // texs: this.gameObject instanceof qc.UIImage ? qc.Serializer.TEXTURES : qc.Serializer.AUTO,
            };
            _this.runInEditor = true;
            return _this;
        }
        Languages.prototype.awake = function () {
            // if (ps.ENV === 'EDITOR') this.refreshSerializer()
            this.debugConfig = main.gameObject.getScript(ps.DebugConfig);
            this.refreshTarget();
            if (ps.ENV === 'EDITOR' || ps.ENV === 'DEBUG')
                this.debugConfig.eventDisp.add(ps.DebugEvent.UPDATE_LANG, this.refreshTarget, this);
        };
        /**
         * 获取多语言配置
         * @returns {Object} 当前多语言配置
         */
        Languages.prototype.getRes = function () {
            if (!this.game.config["useLanguages"])
                return;
            return languagesMgr.getRes();
        };
        /**
         * 刷新
         * @param key 对应文案，配置中的key
         * @param hasLog 是否需要打印日志提示。在编辑、调试环境下默认为 true
         */
        Languages.prototype.refresh = function (key, hasLog) {
            if (hasLog === void 0) { hasLog = ps.ENV === 'EDITOR' || ps.ENV === 'DEBUG'; }
            if (!this.game.config["useLanguages"])
                return;
            if (key != void 0)
                this.langKey = key;
            this.refreshTarget(hasLog);
        };
        /**
         * 刷新目标对象（文本控件、图片控件）
         * @param hasLog 是否需要打印日志提示。在编辑、调试环境下默认为 true
         */
        Languages.prototype.refreshTarget = function (hasLog) {
            if (hasLog === void 0) { hasLog = ps.ENV === 'EDITOR' || ps.ENV === 'DEBUG'; }
            if (!this.game.config["useLanguages"])
                return;
            var lang = (ps.ENV === 'EDITOR' || ps.ENV === 'DEBUG') ? this.debugConfig.debugLang : void 0;
            if (this.gameObject instanceof qc.UIText) {
                languagesMgr.updateLabel(this.gameObject, this.langKey, hasLog, lang);
            }
            else if (this.gameObject instanceof qc.UIImage) {
                languagesMgr.updateImage(this.gameObject, hasLog, lang);
            }
        };
        return Languages;
    }(ps.Behaviour));
    ps.Languages = Languages;
    qc.registerBehaviour('ps.Languages', Languages);
    Languages["__menu"] = 'Custom/Languages';
})(ps || (ps = {}));
