namespace ps {
    /**
     * 切水果底板
     * @description 切水果底板
     * @author weijia
     * @date 2023/02/02 15:59:09
     */
    export enum CutFruitArea {
        // 按下屏幕
        onDown,
        // 拖拽
        onDrag,
        // 命中目标
        correctTarget,
    }
    export class CutAreaView extends Behaviour {
        public event: EventDispatcher = new EventDispatcher();

        private _cutArea: qc.Node;
        private cutItems: qc.Node[];
        private itemList: qc.Node[] = [];

        constructor(gameObject: qc.Node) {
            super(gameObject);
        }

        /** 序列化 */
        private serializableFields = {
            _cutArea: qc.Serializer.AUTO,
            cutItems: qc.Serializer.NODES,
        };
        public createGui(): GuiType {
            return {
                cutItems: {
                    title: "剪切种类",
                    tail: "剪切种类的具体类别",
                    component: "nodes",
                },
                _cutArea: {
                    title: "切水果触控区域节点",
                    component: "node",
                },
            };
        }

        /** 组件被激活后执行 */
        public awake() {
            // console.info("[info] cutAreaView.awake");
        }

        /** 试玩初始化的处理 */
        public onInit() {
            // console.info("[info] cutAreaView.onInit");
            this._cutArea.onDown.add((node, event) => {
                this.event.dispatch(CutFruitArea.onDown, node, event);
                this.itemList = [];
                for (let i = 0; i < this.cutItems.length; i++) {
                    this.itemList = this.itemList.concat(
                        this._cutArea.getChildsByName(this.cutItems[i].name)
                    );
                }
                for (let node of this.itemList) {
                    if (node.rectContains(event.source)) {
                        let nodeJS = node.getScript("ps.CutItem") as CutItem;
                        nodeJS && nodeJS.targetItemHandle(node, event);
                        this.event.dispatch(
                            CutFruitArea.correctTarget,
                            node,
                            event
                        );
                    }
                }
            });
            this._cutArea.onDrag.add((node, event) => {
                this.event.dispatch(CutFruitArea.onDrag, node, event);
                this.itemList = [];
                for (let i = 0; i < this.cutItems.length; i++) {
                    this.itemList = this.itemList.concat(
                        this._cutArea.getChildsByName(this.cutItems[i].name)
                    );
                }
                for (let node of this.itemList) {
                    if (node.rectContains(event.source)) {
                        let nodeJS = node.getScript("ps.CutItem") as CutItem;
                        nodeJS && nodeJS.targetItemHandle(node, event);
                        this.event.dispatch(
                            CutFruitArea.correctTarget,
                            node,
                            event
                        );
                    }
                }
            });
        }

        /** 试玩开始时的处理 */
        public onStart() {
            // console.info("[info] cutAreaView.onStart");
        }

        /** 当脚本被移除时，会自动调用 */
        public onDestroy() {
            // console.info("[info] cutAreaView.onDestroy");
        }
    }
    qc.registerBehaviour("ps.CutAreaView", CutAreaView);
    CutAreaView["__menu"] = "玩法模板/切水果玩法/（CutAreaView）";
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
