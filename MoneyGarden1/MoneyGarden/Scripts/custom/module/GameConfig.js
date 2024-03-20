var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var ps;
(function (ps) {
    /**
     * 游戏配置管理类
     */
    var GameConfig = /** @class */ (function () {
        function GameConfig() {
        }
        /** 初始化游戏配置数据 */
        GameConfig.init = function () {
            if (ps.playerRetry) {
                ps.playerRetry = false;
                return;
            }
            if (!ps.Tools.objIsNull(this.config)) {
                GAME_CFG = {};
                for (var key in this.config) {
                    var item = this.config[key];
                    if (item.items && item.items.length) {
                        for (var i = 0; i < item.items.length; i++) {
                            // value.push(item.items[i].value);
                            GAME_CFG[item.items[i]["pl_key"]] = item.items[i].value;
                        }
                    }
                    else {
                        GAME_CFG[key] = item.value;
                    }
                }
            }
            GAME_CFG["playAgain"] = GameConfig.playAgain;
            if (GameConfig.autoEndTime !== void 0)
                GAME_CFG["autoEndTime"] = GameConfig.autoEndTime;
            //颜色数据
            if (this.colorConfig) {
                COLOR_CFG = {};
                for (var key in this.colorConfig) {
                    var item = this.colorConfig[key];
                    COLOR_CFG[key] = item.value;
                }
            }
        };
        GameConfig.getConfig = function (key) {
            if (this.config[key])
                return this.config[key];
            else {
                for (var k in this.config) {
                    if (this.config[k].items && this.config[k].items) {
                        for (var _i = 0, _a = this.config[k].items; _i < _a.length; _i++) {
                            var con = _a[_i];
                            if (con.pl_key === key)
                                return con;
                        }
                    }
                }
            }
        };
        Object.defineProperty(GameConfig, "data", {
            /** 整个数据 */
            get: function () {
                var config = game.cache.getJSON("gameConfig");
                if (ps.Tools.objIsNull(config)) {
                    console.error("没有gameConfig文件 或 gameConfig文件配置为空");
                    return config;
                }
                var data = config;
                if (dcoData) {
                    if (!dcoData.param) {
                        data = ps.Tools.strToJson(config[Object.keys(config)[0]]);
                    }
                    else {
                        data = ps.Tools.strToJson(config[dcoData.param]);
                        if (ps.Tools.objIsNull(data))
                            data = ps.Tools.strToJson(config[Object.keys(config)[0]]);
                    }
                    // if (!ps.Tools.objIsNull(data) && !ps.Tools.objIsNull(data.value)) {
                    //     data = data.value;
                    // } else {
                    //     data = config;
                    // }
                }
                // else if (config.gameConfig == void 0) {
                //     data = ps.Tools.strToJson(config[Object.keys(config)[0]]);
                // }
                return data;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(GameConfig, "colorConfig", {
            /** 获取颜色配置数据 */
            get: function () {
                var data = this.data;
                if (data == void 0)
                    return;
                var colorConfig = data.colorConfig;
                return colorConfig;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(GameConfig, "config", {
            /** 获取当前难度配置数据 */
            get: function () {
                var data = this.data;
                if (data == void 0)
                    return;
                var gameConfig = data.gameConfig;
                if (!gameConfig || typeof gameConfig != "object") {
                    console.error("游戏配置gameConfig字段有误！gameConfig == " + gameConfig);
                    return;
                }
                return gameConfig;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(GameConfig, "autoEndTime", {
            /** 游戏自动结束时间，0代表不会自动结束 */
            get: function () {
                var data = this.data;
                if (data == void 0)
                    return;
                if (data.autoEndTime < 0)
                    return 0;
                return data.autoEndTime;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(GameConfig, "playAgain", {
            /** 游戏可重玩次数，大于等于0为指定次数，-1为无限次数 */
            get: function () {
                var data = this.data;
                if (data == void 0 || !data.playAgain)
                    return 0;
                return data.playAgain;
            },
            enumerable: false,
            configurable: true
        });
        /**
         * [已过时，请使用GAME_CFG.key] 获取值
         * @param key 参数名
         * @param rounding 取整，默认不取整
         */
        GameConfig.getValue = function (key, rounding) {
            if (rounding === void 0) { rounding = false; }
            if (!this.config[key]) {
                console.error("\u52A8\u6001\u53C2\u6570\u91CC\u9762\u6CA1\u6709" + key + "\u5B57\u6BB5");
                return;
            }
            if (rounding)
                return Math.round(this.config[key].value);
            return this.config[key].value;
        };
        /** 创建动态参数模板 */
        GameConfig.createTemplete = function () {
            var gb = {};
            gb.autoEndTime = GAME_CFG["autoEndTime"];
            gb.playAgain = GAME_CFG["playAgain"];
            if (window["COLOR_CFG"])
                gb.colorConfig = this.exportColor();
            if (window["GAME_CFG"])
                gb.gameConfig = this.exportConfig();
            console.log(ps.Tools.jsonToStr(gb));
            console.log("可使用用户代码片段创建，指令如下");
            console.log("cfgSlider,cfgInput,cfgSwitch,cfgRadio,cfgCheckbox,cfgArray");
            console.log("说明文档：http://confluence.mobvista.com/pages/viewpage.action?pageId=30346816");
        };
        /** 生成动态参数 gameConfig 模板 */
        GameConfig.exportConfig = function () {
            var config = this.config;
            var gb = {};
            var i = 0;
            for (var key in GAME_CFG) {
                if (key === "playAgain")
                    continue;
                i++;
                var value = GAME_CFG[key];
                //旧数据
                var min = 0;
                var max = value * 2;
                var interval = 1;
                var desc = "";
                var title = "";
                if (config[key]) {
                    if (config[key].min != void 0)
                        min = config[key].min;
                    if (config[key].max != void 0)
                        max = config[key].max;
                    if (config[key].interval != void 0)
                        interval = config[key].interval;
                    desc = config[key].desc;
                    title = config[key].title;
                }
                //读取GAME_CFG_DESC信息
                if (window["GAME_CFG_DESC"] && window["GAME_CFG_DESC"][key]) {
                    var cfgDesc = window["GAME_CFG_DESC"][key];
                    if (cfgDesc.min != void 0)
                        min = cfgDesc.min;
                    if (cfgDesc.max != void 0)
                        max = cfgDesc.max;
                    if (cfgDesc.interval != void 0)
                        interval = cfgDesc.interval;
                    desc = cfgDesc.desc;
                    title = cfgDesc.title;
                }
                switch (typeof value) {
                    /** Slider */
                    case "number":
                        gb[key] = {
                            type: "slider",
                            value: value,
                            min: min,
                            max: max,
                            interval: interval,
                            desc: desc,
                            title: title,
                            priority: i,
                        };
                        break;
                    /** 字符串 */
                    case "string":
                        /** 单选 */
                        gb[key] = {
                            type: "radio",
                            value: value,
                            options: [value],
                            desc: desc,
                            title: title,
                            priority: i,
                        };
                        /** 文本输入框 */
                        gb[key + "_input"] = {
                            type: "input:text",
                            value: value,
                            desc: desc,
                            title: title,
                            priority: i,
                        };
                        break;
                    /** 开关 */
                    case "boolean":
                        gb[key] = {
                            type: "switch",
                            value: value,
                            desc: desc,
                            title: title,
                            priority: i,
                        };
                        break;
                    /** 数组 */
                    case "object":
                        if (Array.isArray(value)) {
                            if (value.length <= 0) {
                                value[0] = 0;
                            }
                            switch (typeof value[0]) {
                                /** Slider数组 */
                                case "number":
                                    var minVal = Math.min.apply(Math, value);
                                    var maxVal = Math.max.apply(Math, value);
                                    gb[key] = {
                                        type: "array",
                                        subtype: "slider",
                                        min: minVal,
                                        max: maxVal,
                                        value: value,
                                        desc: desc,
                                        title: title,
                                        priority: i,
                                    };
                                    break;
                                /** 字符串数组 */
                                case "string":
                                    /** 文本输入框数组 */
                                    gb[key] = {
                                        type: "array",
                                        subtype: "input:text",
                                        value: value,
                                        desc: desc,
                                        title: title,
                                        priority: i,
                                    };
                                    /** 复选 */
                                    gb[key + "_checkbox"] = {
                                        type: "checkbox",
                                        value: value,
                                        options: value,
                                        desc: desc,
                                        title: title,
                                        priority: i,
                                    };
                                    break;
                            }
                        }
                        break;
                    default:
                }
            }
            return gb;
        };
        /** 生成动态参数 colorConfig 模板 */
        GameConfig.exportColor = function () {
            var gb = {};
            //生成动态参数模板
            var i = 0;
            for (var key in COLOR_CFG) {
                var desc = "";
                var title = "";
                if (this.colorConfig && this.colorConfig[key]) {
                    desc = this.colorConfig[key].desc;
                    title = this.colorConfig[key].title;
                }
                if (window["COLOR_CFG_DESC"] && window["COLOR_CFG_DESC"][key]) {
                    desc = window["COLOR_CFG_DESC"][key].desc;
                    title = window["COLOR_CFG_DESC"][key].title;
                }
                //
                gb[key] = {
                    value: COLOR_CFG[key],
                    desc: desc,
                    title: title,
                    priority: i,
                };
                i++;
            }
            return gb;
        };
        __decorate([
            ObsoleteMethod("GAME_CFG.key", "GameConfig.getValue")
        ], GameConfig, "getValue", null);
        return GameConfig;
    }());
    ps.GameConfig = GameConfig;
})(ps || (ps = {}));
