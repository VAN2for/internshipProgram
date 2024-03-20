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
    var SceneType;
    (function (SceneType) {
        // 普通场景
        SceneType[SceneType["NORMAL"] = 0] = "NORMAL";
        // 全局场景
        SceneType[SceneType["GLOBAL"] = 1] = "GLOBAL";
        // 玩法场景
        SceneType[SceneType["PLAY"] = 2] = "PLAY";
    })(SceneType || (SceneType = {}));
    var GlobalLevel;
    (function (GlobalLevel) {
        // 全局配置场景的层级，0 代表底部（默认值）
        GlobalLevel[GlobalLevel["BOTTOM"] = 0] = "BOTTOM";
        // 1 代表顶部
        GlobalLevel[GlobalLevel["TOP"] = 1] = "TOP";
    })(GlobalLevel || (GlobalLevel = {}));
    /**
     * Playsmart专用场景数据文件,挂在每个场景根节点上,用于记录持久化自定义数据
     * @author yaoquan.wu
     */
    var SceneConfig = /** @class */ (function (_super) {
        __extends(SceneConfig, _super);
        function SceneConfig() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            /** 是否是结束场景 */
            _this.isEnding = false;
            // 记录设计师填写的自定义事件集合
            _this.customEventSet = [];
            // 记录当前场景使用到的动态参数变量
            _this.gameConfigMap = {};
            // 如果是该场景挂载了玩法组件，挂载的玩法组件 UUID
            _this.playUUID = '';
            // 是否显示全局场景
            _this.isShowGlobal = false;
            // 记录场景类型
            _this.sceneType = SceneType.NORMAL;
            // 记录全局场景显示的层级关系
            _this.globalLevel = GlobalLevel.TOP;
            _this.$data = {};
            /** 序列化 */
            _this.serializableFields = {
                isEnding: qc.Serializer.BOOLEAN,
                customEventSet: qc.Serializer.MAPPING,
                gameConfigMap: qc.Serializer.MAPPING,
                sceneType: qc.Serializer.NUMBER,
                playUUID: qc.Serializer.STRING,
                isShowGlobal: qc.Serializer.BOOLEAN,
                globalLevel: qc.Serializer.NUMBER,
                $data: qc.Serializer.MAPPING,
            };
            return _this;
        }
        return SceneConfig;
    }(ps.Behaviour));
    ps.SceneConfig = SceneConfig;
    qc.registerBehaviour('ps.SceneConfig', SceneConfig);
    SceneConfig['_menu'] = 'Custom/SceneConfig';
    SceneConfig['__ability'] = 'global,play';
    SceneConfig['isNormalScene'] = function (node) {
        var sceneConfig = node.SceneConfig;
        return ((sceneConfig &&
            sceneConfig.sceneType === SceneType.NORMAL) ||
            (sceneConfig &&
                typeof sceneConfig.sceneType === 'undefined'));
    };
    SceneConfig['isGlobalScene'] = function (node) {
        var sceneConfig = node.SceneConfig;
        return sceneConfig && sceneConfig.sceneType === SceneType.GLOBAL;
    };
    SceneConfig['isPlayScene'] = function (node) {
        var sceneConfig = node.SceneConfig;
        return sceneConfig && sceneConfig.sceneType === SceneType.PLAY;
    };
    SceneConfig['SceneType'] = SceneType;
})(ps || (ps = {}));
//# sourceMappingURL=SceneConfig.js.map