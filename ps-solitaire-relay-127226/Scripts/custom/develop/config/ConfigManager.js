var ps;
(function (ps) {
    var ConfigManager = /** @class */ (function () {
        function ConfigManager() {
        }
        ConfigManager.prototype.init = function () {
            var configNode = qc.N("config");
            var arr = configNode.getScripts("ps.config.ConfigSlider");
            var obj = {};
            arr.forEach(function (config) {
                obj[config.cfgName] = config.value;
            });
            console.log(obj);
        };
        return ConfigManager;
    }());
    ps.ConfigManager = ConfigManager;
})(ps || (ps = {}));
