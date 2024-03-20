var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
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
            this.langConfig = {};
            this.onRefreshTarget = new qc.Signal();
            /** 序列化 */
            _this.serializableFields = {
                langKey: qc.Serializer.STRING,
                langConfig: qc.Serializer.MAPPING
            };
            _this.runInEditor = true;
            return _this;
        }
        Languages.prototype.awake = function () {
            // if (ps.ENV === 'EDITOR') this.refreshSerializer()
            this.debugConfig = main.gameObject.getScript(ps.DebugConfig);
            this.refreshTarget();
            // 如果是 PT 转 PS 的模版，并且挂载着 ps.NumScroll 脚本，需要在 language awake 之后再调用 ps.NumScroll 的脚本 awake, 不然会导致显示的是多语言的符号，并不是 0
            if (
              main.gameObject &&
              window.PlaySmartEditorData &&
              main.gameObject.getScript("playsmart.editor.data") &&
              main.gameObject.getScript("playsmart.editor.data").$data &&
              main.gameObject.getScript("playsmart.editor.data").$data.isTransformByPt &&
              this.gameObject.getScript('ps.NumScroll')
            ) {
                this.gameObject.getScript('ps.NumScroll').awake()
            }
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
            if (key != void 0) {
                console.log(this.gameObject.uuid + '节点的多语言脚本上 langKey 从' + this.langKey + '被改成' + key)
                this.langKey = key;
            }
            this.refreshTarget(hasLog);
        };
        /**
         * 刷新目标对象（文本控件、图片控件）
         * @param hasLog 是否需要打印日志提示。在编辑、调试环境下默认为 true
         * @param {RefreshType|undefined} refreshType 可选，需要刷新的类型
         */
        Languages.prototype.refreshTarget = function (hasLog, refreshType) {
            if (hasLog === void 0) { hasLog = ps.ENV === 'EDITOR' || ps.ENV === 'DEBUG'; }
            if (refreshType === void 0) { refreshType = "all"; }
            if (!this.game.config["useLanguages"])
                return;
            var lang = (ps.ENV === 'EDITOR' || ps.ENV === 'DEBUG') ? this.debugConfig.debugLang : void 0;
            if (this.gameObject instanceof qc.UIText) {
                var key = this.getVHKey(hasLog, lang);
                if (refreshType === "style") {
                    languagesMgr.updateLabelStyle(this.gameObject, key, hasLog, lang);
                } else if (refreshType === "value") {
                    languagesMgr.updateLabelValue(this.gameObject, key, hasLog, lang);
                } else {
                    languagesMgr.updateLabel(this.gameObject, key, hasLog, lang);
                }
                this.onRefreshTarget.dispatch({ type: refreshType });
            } else if (this.gameObject instanceof qc.UIImage) {
                languagesMgr.updateImage(this.gameObject, hasLog, lang);
                this.onRefreshTarget.dispatch();
            }
        };
        /** @typedef {"style"|"value"|"all"} RefreshType */
        // 判断横竖屏的内容是否有不同
        Languages.prototype.getVHDiff = function(hasLog, lang) {
            if (hasLog === void 0) { hasLog = ps.ENV === 'EDITOR' || ps.ENV === 'DEBUG'; }
            var uuid = this.langKey;
            var vKey = uuid + '_V';
            var hKey = uuid + '_H';
            var vCfg = languagesMgr.getCfg(vKey, hasLog, lang);
            var hCig = languagesMgr.getCfg(hKey, hasLog, lang);
            // 如果没有配置，可能是 gameRetry 了
            if (!vCfg) {
                vKey = uuid + '_V';
                hKey = uuid + '_H';
                vCfg = languagesMgr.getCfg(vKey, hasLog, lang);
                hCig = languagesMgr.getCfg(hKey, hasLog, lang);
            }
            /** @type {{ isDiff: boolean; type: RefreshType|undefined; }} */
            var diffResult = { isDiff: true, type: void 0 };
            if (vCfg && hCig) {
                var isStyleDiff = JSON.stringify(vCfg.style) !== JSON.stringify(hCig.style);
                var isValueDiff = vCfg.value !== hCig.value;
                if (isStyleDiff && isValueDiff) {
                    diffResult.type = "all";
                } else if (isStyleDiff) {
                    diffResult.type = "style";
                } else if (isValueDiff) {
                    diffResult.type = "value";
                }

                diffResult.isDiff = isStyleDiff || isValueDiff;
            }
            return diffResult;
        }
        // 区分横竖屏
        Languages.prototype.getVHKey = function (hasLog, lang) {
            if (hasLog === void 0) { hasLog = ps.ENV === 'EDITOR' || ps.ENV === 'DEBUG'; }
            var uuid = this.langKey;
            if (ps.ScrFix.isP) {
                var vKey = uuid + '_V';
                var cfg = languagesMgr.getCfg(vKey, hasLog, lang);
                if (cfg) {
                    return vKey;
                } else {
                    return uuid;
                }
            } else {
                var hKey = uuid + '_H';
                var cfg = languagesMgr.getCfg(hKey, hasLog, lang);
                if (cfg) {
                    return hKey;
                } else {
                    return uuid;
                }
            }
        }
        Languages.prototype.onResize = function () {
            if (ps.ENV !== 'EDITOR') {
                // 很诡异，横屏有时会先触发onResize,后再触发awake,这里做个兜底的容错
                if(!this.debugConfig){
                    this.debugConfig = main.gameObject.getScript(ps.DebugConfig);
                }
                // 切换横竖屏时不需要刷新多语言图片字,因为updateImage里的会resetNativeSize会触发回来这里的onresize,引起死循环
                if (this.gameObject instanceof qc.UIImage) {
                    return;
                }
                // 只有属性不一样才刷新
                var diffResult = this.getVHDiff();
                if (
                  diffResult.isDiff
                ) {
                    this.refreshTarget(void 0, diffResult.type);
                }
            }
        }
        return Languages;
    }(ps.Behaviour));
    ps.Languages = Languages;
    qc.registerBehaviour('ps.Languages', Languages);
    Languages["__menu"] = 'Custom/Languages';
})(ps || (ps = {}));
