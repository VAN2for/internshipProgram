namespace ps {
    /**
     * 液态流体
     * @description 液态流体
     * @author bin
     * @date 2023/01/30 16:37:41
     */
    export class WaterFluid extends Behaviour {
        private waterRender: WaterRender;
        private waterDrop: qc.Node;
        private waterDropTexture: qc.Texture;
        private waterImg: qc.Node;
        private diffX = 0;
        private diffY = 100;
        private intervalX = 22;
        private intervalY = 20;
        private quantityRow = 4;
        private quantityCol = 15;
        private warterColor: qc.Color = new qc.Color("#229e11");
        private warterEdgeColor: qc.Color = new qc.Color("#000000");
        private warterAlpha = 100;

        public waterArr: qc.Node[] = [];

        private count = 0;
        public isRefreshWater = true;

        constructor(gameObject: qc.Node) {
            super(gameObject);
        }

        /** 序列化 */
        private serializableFields: unknown = {
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
        public createGui(): GuiType {
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
                    component: "int", // 整型数控件 可选填
                    field: {
                        // 选填
                        min: 0, // 最小值，默认值0
                        max: 100, // 最大值，默认值10
                        step: 1, // 步长，每个整型数字间隔，默认值1
                    },
                },
            };
        }
        /** 组件被激活后执行 */
        public awake() {
            // console.info("[info] WaterFluid.awake");
        }

        /** 试玩初始化的处理 */
        public onInit() {
            // console.info("[info] WaterFluid.onInit");
            this.initWaterInfo();
        }

        initWaterInfo() {
            // let c = new qc.Color(GAME_CFG.liquidColor);
            ps.COLOR_WATER = this.warterColor.rgb;
            // c = new qc.Color(GAME_CFG.liquidStrokeColor);
            ps.COLOR_WATER_EDGE = this.warterEdgeColor.rgb;

            this.waterImg.alpha = this.warterAlpha / 100;
            this.waterRender = new WaterRender(
                this.waterImg,
                this.waterImg.width,
                this.waterImg.height
            );
            this.waterRender.waterDropImgBin = this.waterDropTexture.atlas.url;
            this.waterImg["phaser"].loadTexture(this.waterRender.bmd);

            for (let i = 0; i < this.quantityRow; i++) {
                for (let j = 0; j < this.quantityCol; j++) {
                    let cloneDrop = qc_game.add.clone(
                        this.waterDrop,
                        this.gameObject
                    );
                    cloneDrop.x = this.intervalX * j + this.diffX;
                    cloneDrop.y = this.intervalY * i + this.diffY;
                    this.waterArr.push(cloneDrop);
                }
            }
        }

        update() {
            if (!this.isRefreshWater) return;
            if (this.count % 2 === 0) {
                this.waterRender.updateTexture(this.gameObject);
            }
            this.count++;
        }

        /** 试玩开始时的处理 */
        public onStart() {
            // console.info("[info] WaterFluid.onStart");
        }

        /** 当脚本被移除时，会自动调用 */
        public onDestroy() {
            // console.info("[info] WaterFluid.onDestroy");
        }
    }
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
}
