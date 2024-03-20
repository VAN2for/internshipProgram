namespace ps {
    /**
     * 创建数字棋盘
     * @description 把对应节点创建到棋盘中
     * @author yongyuan.liao
     * @date 2023/03/28 11:09:02
     */

    export class createGraph extends Behaviour {
        public grid: ps.GridNode[][] = [];
        public g: number[][] = [];
        public n: number;
        public m: number;
        public diffX: number;
        public diffY: number;
        public brickWidth: number;
        public brickHeight: number;
        public _blockNodes: qc.Node[] = [];
        public _node: qc.Node;
        public _col: number;
        public _row: number;
        public _button: boolean;
        constructor(gameObject: qc.Node) {
            super(gameObject);
        }

        /** 序列化 */
        private serializableFields = {
            _blockNodes: qc.Serializer.NODES,
            _node: qc.Serializer.NODE,
            _col: qc.Serializer.NUMBER,
            _row: qc.Serializer.NUMBER,
            _button: qc.Serializer.BOOLEAN,
        };
        public createGui(): GuiType {
            return {
                _blockNodes: {
                    title: "绑定数字节点",
                    component: "nodes",
                },
                _node: {
                    title: "获取节点数据",
                    component: "node",
                },
                _row: {
                    title: "行数",
                    component: "input",
                    field: {
                        type: "number",
                    },
                },
                _col: {
                    title: "列数",
                    component: "input",
                    field: {
                        type: "number",
                    },
                },
                _button: {
                    title: "随机数据",
                    component: "switch",
                },
            };
        }

        public valueToIndex(value: number): number {
            return Math.log2(value) - 1;
        }

        public numberCombine(value: number, count: number): number {
            return value * Math.pow(2, count);
        }

        /** 试玩初始化的处理 */
        public onInit() {
            // console.info("[info] createGraph.onInit");
            this.gameObject.interactive = true;
            this.n = this._row;
            this.m = this._col;
            this.diffX =
                (this.gameObject.width - this._blockNodes[0].width * this.m) /
                this.m;
            this.diffY =
                (this.gameObject.height - this._blockNodes[0].height * this.n) /
                this.n;
            this.brickWidth =
                this._blockNodes[0].width + Math.floor(this.diffX);
            this.brickHeight =
                this._blockNodes[0].height + Math.floor(this.diffY);
            for (let i = 0; i < this.n; i++) {
                this.g[i] = new Array(this.m).fill(0);
            }
            if (this._button) {
                for (let i = 0; i < this.n; i++) {
                    this.g[i] = new Array(this.m).fill(0);
                }
                for (let i = 0; i < this._node.children.length; i++) {
                    const child = this._node.children[i];
                    child.visible = false;
                }
                this.initData();
            } else {
                for (let i = 0; i < this._node.children.length; i++) {
                    const child = this._node.children[i];
                    child.visible = false;
                    const node = child.getScript("ps.createNode");
                    if (typeof node !== "undefined") {
                        const x = node._row;
                        const y = node._col;
                        const value = node._value;
                        this.g[x][y] = value;
                    }
                }
            }
            for (const node of this._blockNodes) {
                node.visible = false;
                (node as any).setPropertyIgnoreLayout({
                    prop: "visible",
                    value: false,
                });
            }
            for (let i = 0; i < this.n; i++) {
                this.grid[i] = [];
                for (let j = 0; j < this.m; j++) {
                    const value = this.g[i][j];
                    const index = this.valueToIndex(value);
                    this.grid[i][j] = this.init(
                        this._blockNodes[index],
                        this.gameObject,
                        value,
                        i,
                        j,
                        0,
                        false
                    );
                }
            }
        }

        public initData() {
            for (let j = 0; j < this.m; j++) {
                let cnt = Math.floor(Math.random() * this.n);
                if (cnt > Math.floor(this.n / 2)) cnt = Math.floor(this.n / 2);
                for (let i = this.n - 1; cnt; cnt--, i--) {
                    const index = Math.floor(Math.random() * 10) + 1;
                    this.g[i][j] = 1 << index;
                }
            }
        }

        public init(
            root: qc.Node,
            content: qc.Node,
            value: number,
            x: number,
            y: number,
            diff: number,
            isStart: boolean
        ) {
            if (!value) return null;
            const node = qc_game.add.clone(root, content);
            (node as any).setPropertyIgnoreLayout({
                prop: "x",
                value: this.brickWidth * y + this.diffX / 2,
            });
            (node as any).setPropertyIgnoreLayout({
                prop: "y",
                value: this.brickHeight * x + diff,
            });
            node.visible = true;
            return { value, node, isStart };
        }

        /** 试玩开始时的处理 */
        public onStart() {
            // console.info("[info] createGraph.onStart");
        }

        /** 当脚本被移除时，会自动调用 */
        public onDestroy() {
            // console.info("[info] createGraph.onDestroy");
        }
    }
    qc.registerBehaviour("ps.createGraph", createGraph);
    createGraph["__menu"] = "玩法模板/2048数字射击玩法/数字棋盘（createGraph）";
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
