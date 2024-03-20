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
     * 液态流体
     * @description 液态流体
     * @author bin
     * @date 2023/01/30 16:37:41
     */
    var WaterFluid = /** @class */ (function (_super) {
        __extends(WaterFluid, _super);
        function WaterFluid(gameObject) {
            var _this = _super.call(this, gameObject) || this;
            _this.diffX = 0;
            _this.diffY = 100;
            _this.intervalX = 22;
            _this.intervalY = 20;
            _this.quantityRow = 4;
            _this.quantityCol = 15;
            _this.warterColor = new qc.Color("#229e11");
            _this.warterEdgeColor = new qc.Color("#000000");
            _this.warterAlpha = 100;
            _this.waterArr = [];
            _this.count = 0;
            _this.isRefreshWater = true;
            /** 序列化 */
            _this.serializableFields = {
                waterDrop: qc.Serializer.NODE,
                waterDropTexture: qc.Serializer.TEXTURE,
                waterImg: qc.Serializer.NODE,
                diffX: qc.Serializer.NUMBER,
                diffY: qc.Serializer.NUMBER,
                intervalX: qc.Serializer.NUMBER,
                intervalY: qc.Serializer.NUMBER,
                quantityRow: qc.Serializer.NUMBER,
                quantityCol: qc.Serializer.NUMBER,
                warterColor: qc.Serializer.COLOR,
                warterEdgeColor: qc.Serializer.COLOR,
            };
            return _this;
        }
        WaterFluid.prototype.createGui = function () {
            return {
                waterDrop: {
                    title: "水滴刚体节点",
                    component: "node",
                },
                waterDropTexture: {
                    title: "水滴资源Texture",
                    component: "node",
                },
                waterImg: {
                    title: "水(渲染图片)",
                    component: "node",
                },
                diffX: {
                    title: "水整体偏移值X",
                    component: "input",
                    field: {
                        type: "number",
                    },
                },
                diffY: {
                    title: "水整体偏移值Y",
                    component: "input",
                    field: {
                        type: "number",
                    },
                },
                intervalX: {
                    title: "水滴间隔X",
                    component: "input",
                    field: {
                        type: "number",
                    },
                },
                intervalY: {
                    title: "水滴间隔Y",
                    component: "input",
                    field: {
                        type: "number",
                    },
                },
                quantityRow: {
                    title: "水滴数量(横向)",
                    component: "input",
                    field: {
                        type: "number",
                    },
                },
                quantityCol: {
                    title: "水滴数量(纵向)",
                    component: "input",
                    field: {
                        type: "number",
                    },
                },
                warterColor: {
                    title: "水滴颜色",
                    component: "color-picker",
                },
                warterEdgeColor: {
                    title: "水滴边缘颜色",
                    component: "color-picker",
                },
                warterAlpha: {
                    title: "水滴透明度",
                    component: "int",
                    field: {
                        // 选填
                        min: 0,
                        max: 100,
                        step: 1, // 步长，每个整型数字间隔，默认值1
                    },
                },
            };
        };
        /** 组件被激活后执行 */
        WaterFluid.prototype.awake = function () {
            // console.info("[info] WaterFluid.awake");
        };
        /** 试玩初始化的处理 */
        WaterFluid.prototype.onInit = function () {
            // console.info("[info] WaterFluid.onInit");
            this.initWaterInfo();
        };
        WaterFluid.prototype.initWaterInfo = function () {
            // let c = new qc.Color(GAME_CFG.liquidColor);
            ps.COLOR_WATER = this.warterColor.rgb;
            // c = new qc.Color(GAME_CFG.liquidStrokeColor);
            ps.COLOR_WATER_EDGE = this.warterEdgeColor.rgb;
            this.waterImg.alpha = this.warterAlpha / 100;
            this.waterRender = new WaterRender(this.waterImg, this.waterImg.width, this.waterImg.height);
            this.waterRender.waterDropImgBin = this.waterDropTexture.atlas.url;
            this.waterImg["phaser"].loadTexture(this.waterRender.bmd);
            for (var i = 0; i < this.quantityRow; i++) {
                for (var j = 0; j < this.quantityCol; j++) {
                    var cloneDrop = qc_game.add.clone(this.waterDrop, this.gameObject);
                    cloneDrop.x = this.intervalX * j + this.diffX;
                    cloneDrop.y = this.intervalY * i + this.diffY;
                    this.waterArr.push(cloneDrop);
                }
            }
        };
        WaterFluid.prototype.update = function () {
            if (!this.isRefreshWater)
                return;
            if (this.count % 2 === 0) {
                this.waterRender.updateTexture(this.gameObject);
            }
            this.count++;
        };
        /** 试玩开始时的处理 */
        WaterFluid.prototype.onStart = function () {
            // console.info("[info] WaterFluid.onStart");
        };
        /** 当脚本被移除时，会自动调用 */
        WaterFluid.prototype.onDestroy = function () {
            // console.info("[info] WaterFluid.onDestroy");
        };
        return WaterFluid;
    }(ps.Behaviour));
    ps.WaterFluid = WaterFluid;
    qc.registerBehaviour("ps.WaterFluid", WaterFluid);
    WaterFluid["__menu"] = "玩法模板/液态流体玩法/液态流体(WaterFluid)";
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
})(ps || (ps = {}));
//# sourceMappingURL=WaterFluid.js.map