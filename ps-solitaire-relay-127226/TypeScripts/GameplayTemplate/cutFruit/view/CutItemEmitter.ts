namespace ps {
    /**
     * 切水果
     * @description 切水果
     * @author weijia
     * @date 2023/02/17 13:54:58
     */
    export enum CutFruitEmitter {
        createItem, //生成物品时
    }
    export class CutItemEmitter extends Behaviour {
        public event: EventDispatcher = new EventDispatcher();

        private cutArea: qc.Node; //物品生成区域的节点
        private itemList: qc.Node; //生成物品数组
        private probabilitys: number[]; //物品生成的概率

        private frequency: number = 1000; //生成频率
        private needRepeat: boolean = false; //是否需要重复生成
        private minOffsetX: number = 0; //生成物品时X的最小偏移值
        private maxOffsetX: number = 0; //生成物品时X的最大偏移值
        private minOffsetY: number = 0; //生成物品时Y的最小偏移值
        private maxOffsetY: number = 0; //生成物品时Y的最大偏移值

        private isSend: boolean = false;
        private time: number = 0;
        private item: qc.Node = null;

        constructor(gameObject: qc.Node) {
            super(gameObject);
        }

        /** 序列化 */
        private serializableFields = {
            cutArea: qc.Serializer.NODE,
            itemList: qc.Serializer.NODES,
            probabilitys: qc.Serializer.NUMBERS,
            frequency: qc.Serializer.NUMBER,
            minOffsetX: qc.Serializer.NUMBER,
            maxOffsetX: qc.Serializer.NUMBER,
            minOffsetY: qc.Serializer.NUMBER,
            maxOffsetY: qc.Serializer.NUMBER,
            needRepeat: qc.Serializer.BOOLEAN,
        };

        public createGui(): GuiType {
            return {
                itemList: {
                    title: "生成物品数组",
                    component: "nodes",
                },
                probabilitys: {
                    title: "物品权重数组",
                    component: "nodes",
                },
                cutArea: {
                    title: "物品生成区域节点",
                    component: "node",
                },
                needRepeat: {
                    title: "是否需要重复生成",
                    component: "switch",
                },
                frequency: {
                    title: "物品生成频率",
                    component: "input",
                    field: {
                        type: "number",
                    },
                },
                minOffsetX: {
                    title: "生成物品X最小偏移",
                    component: "input",
                    field: {
                        type: "number",
                    },
                },
                minOffsetY: {
                    title: "生成物品Y最小偏移",
                    component: "input",
                    field: {
                        type: "number",
                    },
                },
                maxOffsetX: {
                    title: "生成物品X最大偏移",
                    component: "input",
                    field: {
                        type: "number",
                    },
                },
                maxOffsetY: {
                    title: "生成物品Y最大偏移",
                    component: "input",
                    field: {
                        type: "number",
                    },
                },
            };
        }

        /** 组件被激活后执行 */
        public awake() {
            // console.info("[info] CutItemsEmitter.awake");
        }

        /** 试玩初始化的处理 */
        public onInit() {
            // console.info("[info] CutItemEmitter.onInit");`
        }

        public update() {
            if (this.isSend && this.needRepeat) {
                if (this.time >= this.frequency) {
                    if (this.item) {
                        this.createItem(this.item);
                    } else {
                        this.createItem();
                    }
                    this.time = 0;
                }
                this.time += this.game.time.deltaTime;
            }
        }

        /**
         * 生成发射物品
         * @param item  需要生成的物品，当不传入参数时，将会根据物品数组和比重数组随机生成某一个物品
         */
        public sendItem(item?: qc.Node) {
            this.isSend = true;
            if (item) {
                this.createItem(item);
                this.item = item;
            } else {
                this.createItem();
            }
        }

        /**
         * 停止自动生成发射物品
         */
        public stopSend() {
            this.isSend = false;
            this.item = null;
        }

        //停止重复生成
        public stopRepeat() {
            this.needRepeat = false;
            this.item = null;
        }

        //开始重复生成
        public repeatSend(item?: qc.Node) {
            this.needRepeat = true;
            this.isSend = true;
            if (item) {
                this.createItem(item);
                this.item = item;
            } else {
                this.createItem();
            }
        }

        private createItem(item?: qc.Node) {
            let node: qc.Node;
            if (item) {
                node = item;
            } else {
                let sum = this.probabilitys.reduce((a, b) => a + b);
                let nums = [];
                let pre = 0;
                for (let prob of this.probabilitys) {
                    nums.push(pre + prob);
                    pre += prob;
                }
                let random = Math.random() * sum;
                for (let i = 0; i < nums.length; i++) {
                    if (random < nums[i]) {
                        if (i > 0) {
                            if (random >= nums[i - 1]) {
                                node = this.itemList[i];
                                break;
                            }
                        } else {
                            node = this.itemList[i];
                            break;
                        }
                    }
                }
            }
            const offsetX =
                Math.random() * (this.maxOffsetX - this.minOffsetX) +
                this.minOffsetX;
            const offsetY =
                Math.random() * (this.maxOffsetY - this.minOffsetY) +
                this.minOffsetY;
            const _node = this.game.add.clone(node, this.cutArea);
            const pos_world = this.gameObject.getWorldPosition();
            const pos_local = this.cutArea.toLocal(pos_world);
            _node.x = pos_local.x + offsetX;
            _node.y = pos_local.y + offsetY;
            _node.visible = true;
            const _nodeJS = _node.getScript("ps.CutItem") as CutItem;
            _nodeJS.initProps();
            this.event.dispatch(CutFruitEmitter.createItem, _node);
        }

        /** 试玩开始时的处理 */
        public onStart() {
            // console.info("[info] CutItemEmitter.onStart");
        }

        /** 当脚本被移除时，会自动调用 */
        public onDestroy() {
            // console.info("[info] CutItemEmitter.onDestroy");
        }
    }
    qc.registerBehaviour("ps.CutItemEmitter", CutItemEmitter);
    CutItemEmitter["__menu"] = "玩法模板/切水果玩法/（CutItemEmitter）";
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
