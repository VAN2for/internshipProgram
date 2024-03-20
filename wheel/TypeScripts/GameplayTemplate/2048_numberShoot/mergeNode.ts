namespace ps {
    /**
     * 发射数字
     * @description 发射节点下落合并碰撞
     * @author yongyuan.liao
     * @date 2023/03/28 15:13:31
     */
    export class mergeNode extends Behaviour {
        Event = new ps.EventDispatcher();
        // this.Event.dispatch(KlotskControlEvent.Success);
        private Graph: createGraph;
        /**游戏次数 */
        private _gameCount: number;
        /**合并节点时间 */
        private _mergeTime: number;
        /**节点下落时间 */
        private _downTime: number;
        /**下个节点开始的时间 */
        private _nextTime: number;
        /**发射节点的x坐标 */
        private _startPointX: number[] = [];
        /**发射节点的y坐标 */
        private _startPointY: number[] = [];
        /**发射节点的value */
        private _startPointValue: number[] = [];

        public g: ps.GridNode[][] = [];
        private stepEvent: Action[] = [];
        private stepCount = 0;
        private flag = false;
        private startPointList: ps.PointType[] = [];
        private waitTimeList: number[] = [];
        constructor(gameObject: qc.Node) {
            super(gameObject);
        }

        /** 序列化 */
        private serializableFields = {
            _gameCount: qc.Serializer.NUMBER,
            _mergeTime: qc.Serializer.NUMBER,
            _nextTime: qc.Serializer.NUMBER,
            _downTime: qc.Serializer.NUMBER,
            _startPointX: qc.Serializer.NUMBERS,
            _startPointY: qc.Serializer.NUMBERS,
            _startPointValue: qc.Serializer.NUMBERS,
        };
        public createGui(): GuiType {
            return {
                _gameCount: {
                    title: "游戏次数",
                    component: "input",
                    field: {
                        type: "number",
                    },
                },
                _mergeTime: {
                    title: "合并时间",
                    component: "input",
                    field: {
                        type: "number",
                    },
                },
                _downTime: {
                    title: "下落时间",
                    component: "input",
                    field: {
                        type: "number",
                    },
                },
                _nextTime: {
                    title: "节点出现的时间",
                    component: "input",
                    field: {
                        type: "number",
                    },
                },
                _startPointX: {
                    title: "发射数字节点数量X",
                    tail: "发射数字节点数量配置X,Y,Value需要一一对应",
                    component: "input",
                    field: {
                        type: "number",
                    },
                },
                _startPointY: {
                    title: "发射数字节点数量Y",
                    tail: "发射数字节点数量配置X,Y,Value需要一一对应",
                    component: "input",
                    field: {
                        type: "number",
                    },
                },
                _startPointValue: {
                    title: "发射数字节点数量Value",
                    tail: "发射数字节点数量配置X,Y,Value需要一一对应",
                    component: "input",
                    field: {
                        type: "number",
                    },
                },
            };
        }
        /**
         * 点击事件
         */
        public onClick() {
            if (!this.flag) {
                this.getDropDistance();
                this.Event.dispatch(ps.mergeEvent.Shoot);
            }
            this.flag = true;
        }

        /**
         * 获取节点下落的距离
         */
        public getDropDistance() {
            const callback = this.updateMerge.bind(this);
            for (let j = 0; j < this.Graph.m; j++)
                for (let i = this.Graph.n - 1; i >= 0; i--) {
                    const u = this.g[i][j];
                    if (u !== null) continue;
                    this.updateBlock(callback, i, j);
                    break;
                }
        }

        /**
         * 初始化下落节点
         */
        public initPoint() {
            const { x, y, value } = this.startPointList[this.stepCount];
            const index = this.Graph.valueToIndex(value);
            this.g[x][y] = this.Graph.init(
                this.Graph._blockNodes[index],
                this.gameObject,
                value,
                x,
                y,
                10,
                true
            );
        }

        /**
         * 递归执行判断合并
         * @param value 节点的value值
         * @param x 矩阵下的x坐标
         * @param y 矩阵下的y坐标
         * @returns 返回是否合并成功，如果没有合并返回false，如果合并成功并且创建新的节点返回true
         */
        public updateMerge(value: number, x: number, y: number): void {
            const mergeAnimation = (u: ps.GridNode) => {
                return new Promise((resolve) => {
                    ps.xtween(u.node)
                        .to(this._mergeTime, {
                            x: y * this.Graph.brickWidth,
                            y: x * this.Graph.brickHeight,
                        })
                        .call(() => {
                            u.node.destroy();
                            resolve(undefined);
                        })
                        .start();
                });
            };

            let count = 0;
            const animationPromises = [];
            const left = y - 1,
                right = y + 1,
                bottom = x + 1;
            if (left >= 0) {
                const leftNode = this.g[x][left];
                if (leftNode?.value == value) {
                    this.g[x][left] = null;
                    const p = mergeAnimation(leftNode);
                    animationPromises.push(p);
                    count += 1;
                }
            }

            if (right < this.Graph.m) {
                const rightNode = this.g[x][right];
                if (rightNode?.value == value) {
                    this.g[x][right] = null;
                    const p = mergeAnimation(rightNode);
                    animationPromises.push(p);
                    count += 1;
                }
            }

            if (bottom < this.Graph.n) {
                const bottomNode = this.g[bottom][y];
                if (bottomNode?.value == value) {
                    this.g[bottom][y] = null;
                    const p = mergeAnimation(bottomNode);
                    animationPromises.push(p);
                    count += 1;
                }
            }

            if (count === 0) {
                if (this.g[x][y].isStart && this.stepCount < this._gameCount) {
                    setTimeout(() => {
                        this.gameStart();
                        this.flag = false;
                    }, this._nextTime);
                    this.Event.dispatch(ps.mergeEvent.mergeComplete);
                }
                if (this.stepCount === this._gameCount) {
                    this.Event.dispatch(ps.mergeEvent.End);
                }
                return;
            }

            const oldNode = this.g[x][y];
            Promise.all(animationPromises).then(() => {
                oldNode.node.destroy();
                const newValue = this.Graph.numberCombine(value, count);
                const index = this.Graph.valueToIndex(newValue);
                this.g[x][y] = this.Graph.init(
                    this.Graph._blockNodes[index],
                    this.gameObject,
                    newValue,
                    x,
                    y,
                    0,
                    true
                );
                this.Event.dispatch(ps.mergeEvent.Merge);
                this.getDropDistance();
            });
        }

        /**
         *
         * @param callback 下落过程中开始的回调函数，合并相同value值的节点
         * @param x 矩阵下x坐标
         * @param y 矩阵下y坐标
         */
        public updateBlock(
            callback: (value: number, x: number, y: number) => boolean,
            x: number,
            y: number
        ) {
            for (let i = x - 1; i >= 0; i--) {
                const u = this.g[i][y];
                if (u === null) continue;
                this.g[i][y] = null;
                const node = u.node;
                ps.xtween(node)
                    .to((x - i) * this._downTime, {
                        y: x * this.Graph.brickHeight,
                    })
                    .call(callback, null, u.value, x, y)
                    .start();
                this.g[x--][y] = u;
            }
        }

        /**
         * 执行函数
         */
        public gameStart() {
            this.stepEvent[this.stepCount]();
            this.stepCount++;
        }

        /** 组件被激活后执行 */
        public awake() {
            // console.info("[info] mergeNode.awake");
        }

        /** 试玩初始化的处理 */
        public onInit() {
            // console.info("[info] mergeNode.onInit");
            this.Graph = this.gameObject.getScript("ps.createGraph");
            this.g = this.Graph.grid;
            const len = this._startPointValue.length;
            for (let i = 0; i < len; i++) {
                const x = this._startPointX[i];
                const y = this._startPointY[i];
                const value = this._startPointValue[i];
                this.startPointList.push({ x, y, value });
                this.waitTimeList.push();
            }
            if (this._gameCount > len) {
                for (let i = 0; i < this._gameCount - len; i++) {
                    const x = 0;
                    const y = Math.floor(Math.random() * this.Graph.m);
                    const num = Math.floor(Math.random() * 10) + 1;
                    const value = 1 << num;
                    this.startPointList.push({ x, y, value });
                }
            }
            for (let i = 0; i < this._gameCount; i++) {
                this.stepEvent.push(this.initPoint.bind(this));
            }
            this.gameStart();
        }

        /** 试玩开始时的处理 */
        public onStart() {
            this.Event.dispatch(ps.mergeEvent.Start);
            // console.info("[info] mergeNode.onStart");
        }

        /** 当脚本被移除时，会自动调用 */
        public onDestroy() {
            // console.info("[info] mergeNode.onDestroy");
        }
    }
    qc.registerBehaviour("ps.mergeNode", mergeNode);
    mergeNode["__menu"] = "玩法模板/2048数字射击玩法/发射数字（mergeNode）";
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
