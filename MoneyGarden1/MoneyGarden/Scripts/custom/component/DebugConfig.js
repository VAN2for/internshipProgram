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
    var DebugEvent;
    (function (DebugEvent) {
        DebugEvent["UPDATE_LANG"] = "UpdateLang";
    })(DebugEvent = ps.DebugEvent || (ps.DebugEvent = {}));
    /**
     *
     * @author VaMP
     */
    var DebugConfig = /** @class */ (function (_super) {
        __extends(DebugConfig, _super);
        function DebugConfig(gameObject) {
            var _this = _super.call(this, gameObject) || this;
            /** 自动gameStart */
            _this.autoGameStart = true;
            /** 显示fps */
            _this.showFps = false;
            /** 使用动态参数json文件 */
            _this.useConfigJson = false;
            /** 多语言系统，调试语言 */
            _this.debugLang = '';
            /** 事件对象 */
            _this.eventDisp = new ps.EventDispatcher();
            /** 序列化 */
            _this.serializableFields = {
                autoGameStart: qc.Serializer.BOOLEAN,
                showFps: qc.Serializer.BOOLEAN,
                useConfigJson: qc.Serializer.BOOLEAN,
                debugLang: qc.Serializer.AUTO,
            };
            _this.runInEditor = true;
            return _this;
        }
        DebugConfig.prototype.awake = function () {
            ps.debugCfg.AUTO_GAMESTART = this.autoGameStart;
            ps.debugCfg.SHOW_FPS = this.showFps;
            ps.debugCfg.USE_CONFIG_JSON = this.useConfigJson;
            // if (this.game.config["useLanguages"]) this.debugLang = languagesMgr.language;
        };
        DebugConfig.prototype.update = function () { };
        DebugConfig.prototype.onDown = function () { };
        /**
         * 获取多语言配置
         * @returns {Object} 当前多语言配置
         */
        DebugConfig.prototype.getRes = function () {
            if (!this.game.config["useLanguages"])
                return;
            return languagesMgr.getRes();
        };
        /** 当前使用语言 */
        DebugConfig.prototype.language = function () {
            if (!this.game.config["useLanguages"])
                return;
            return languagesMgr.language;
        };
        /**
         * 更新调试语言
         * @param lang 调试语言
         * @param updateAll 是否更新所有多语言控件（文本控件、图片控件）
         * @param hasLog 是否需要打印日志提示。默认为: false
         */
        DebugConfig.prototype.updateLang = function (lang, updateAll, hasLog) {
            if (updateAll === void 0) { updateAll = false; }
            if (hasLog === void 0) { hasLog = false; }
            if (lang != void 0)
                this.debugLang = lang;
            if (updateAll)
                this.eventDisp.dispatch(ps.DebugEvent.UPDATE_LANG, hasLog);
        };
        return DebugConfig;
    }(ps.Behaviour));
    ps.DebugConfig = DebugConfig;
    qc.registerBehaviour('ps.DebugConfig', DebugConfig);
    DebugConfig["__menu"] = 'Custom/DebugConfig';
})(ps || (ps = {}));
/**
帧回调（preUpdate、update、postUpdate）
如果实现了这几个函数，系统会自动每帧进行调度（当挂载的Node节点处于可见、并且本脚本的enable=true时）
初始化（awake）
如果实现了awake函数，系统会在Node节点构建完毕（反序列化完成后）自动调度
脚本可用/不可用（onEnable、onDisable）
当脚本的enable从false->true时，会自动调用onEnable函数；反之调用onDisable函数
ps:在awake结束时,如果当前脚本的enable为true，会自动调用onEnable函数
交互回调（onClick、onUp、onDown、onDrag、onDragStart、onDragEnd）
当挂载的Node具备交互时，一旦捕获相应的输入事件，这些函数会自动被调用
脚本析构（onDestroy）
当脚本被移除时，会自动调用onDestroy函数，用户可以定义必要的资源回收代码
//PlaySmart新增回调(继承ps.Behaviour)
pl状态回调(onInit、onStart、onEnding、onRetry)
如果实现了这几个函数，会在pl进行到相应状态的时候进行回调
*/ 
