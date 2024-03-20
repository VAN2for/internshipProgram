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
     * 项目配置
     * @author VaMP
     */
    var MainConfig = /** @class */ (function (_super) {
        __extends(MainConfig, _super);
        function MainConfig(gameObject) {
            var _this = _super.call(this, gameObject) || this;
            /** 自动gameStart(调试用) */
            _this.autoGameStart = true;
            /** 自动播放BGM */
            _this.autoPlayBgm = true;
            /** 背景音乐名字，默认bm_bgm */
            _this.bgmName = "bm_bgm";
            /** 显示fps */
            _this.showFps = false;
            /** 使用动态参数json文件 */
            _this.useConfigJson = true;
            /** 是否拥有开始界面 */
            _this.hasStartPanel = true;
            /** 是否拥有ending界面 */
            _this.hasEndingPanel = true;
            _this.serializableFields = {
                autoGameStart: qc.Serializer.BOOLEAN,
                showFps: qc.Serializer.BOOLEAN,
                useConfigJson: qc.Serializer.BOOLEAN,
                bgmName: qc.Serializer.STRING,
                autoPlayBgm: qc.Serializer.BOOLEAN,
                hasStartPanel: qc.Serializer.BOOLEAN,
                hasEndingPanel: qc.Serializer.BOOLEAN,
            };
            _this.runInEditor = true;
            return _this;
        }
        MainConfig.prototype.awake = function () {
            ps.cfg.AUTO_GAMESTART = this.autoGameStart;
            ps.cfg.SHOW_FPS = this.showFps;
            ps.cfg.USE_CONFIG_JSON = this.useConfigJson;
            //
            ps.cfg.BGM_NAME = this.bgmName;
            ps.cfg.AUTO_PLAY_BGM = this.autoPlayBgm;
            ps.cfg.HAS_START_PANEL = this.hasStartPanel;
            ps.cfg.HAS_ENDING_PANEL = this.hasEndingPanel;
            //根节点
            UIRoot = this.gameObject;
        };
        MainConfig.prototype.update = function () {
            ps.timer.update(this.game.time.deltaTime);
            ps.updateList.update(this.game.time.deltaTime);
        };
        return MainConfig;
    }(qc.Behaviour));
    ps.MainConfig = MainConfig;
    qc.registerBehaviour('ps.MainConfig', MainConfig);
    MainConfig["__menu"] = 'Custom/MainConfig';
})(ps || (ps = {}));
