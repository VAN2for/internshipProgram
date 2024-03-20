namespace ps {
    export enum KlotskControlEvent {
        /**
         * 华容道玩法成功完成
         */
        Success,
    }
    /**
     *
     * 华容道控制器
     * @description 华容道控制器
     * @author zhen.liang
     * @date 2022/12/31 15:16:31
     */
    export class KlotskControl extends Behaviour {
        Event = new ps.EventDispatcher();
        /** 所需正确碎片数量 */
        private puzzleNumber: number;
        /** 目前正确碎片数量 */
        private correctPuzzleNumber: number = 0;
        /** 行数 */
        private puzzleRow: number;
        /** 列数 */
        private puzzleLine: number;
        /** 是否有碎片正在移动 */
        private puzzleMoving: boolean = false;
        /** 碎片位置图信息 */
        private puzzleMap: Map<String, qc.Node> = new Map();
        constructor(gameObject: qc.Node) {
            super(gameObject);
        }

        /** 序列化 */
        private serializableFields = {
            puzzleNumber: qc.Serializer.INT,
            puzzleRow: qc.Serializer.INT,
            puzzleLine: qc.Serializer.INT,
        };
        public createGui(): GuiType {
            return {
                puzzleNumber: {
                    title: "所需正确碎片数量",
                    component: "input",
                    field: {
                        type: "number",
                    },
                },
                puzzleRow: {
                    title: "行数",
                    component: "input",
                    field: {
                        type: "number",
                    },
                },
                puzzleLine: {
                    title: "列数",
                    component: "input",
                    field: {
                        type: "number",
                    },
                },
            };
        }
        /** 正确碎片数量加一 */
        public addCorrectPuzzle() {
            this.correctPuzzleNumber++;
            /** 游戏成功完成 */
            if (this.correctPuzzleNumber === this.puzzleNumber) {
                this.Event.dispatch(KlotskControlEvent.Success);
            }
        }

        /** 正确碎片数量减一 */
        public decrease() {
            this.correctPuzzleNumber--;
        }

        /** 碎片移动 */
        public puzzleMove(
            startXY: number[],
            moveedXY: number[],
            node: qc.Node,
            width: number,
            height: number
        ) {
            for (let i = 0; i < width; i++)
                for (let j = 0; j < height; j++) {
                    this.puzzleMap.delete(
                        `${startXY[0] + j},${startXY[1] + i}`
                    );
                }
            for (let i = 0; i < width; i++)
                for (let j = 0; j < height; j++) {
                    this.puzzleMap.set(
                        `${moveedXY[0] + j},${moveedXY[1] + i}`,
                        node
                    );
                }
        }

        /** 填入碎片 */
        public setPuzzleMap(
            XY: number[],
            node: qc.Node,
            width: number,
            height: number
        ) {
            for (let i = 0; i < width; i++)
                for (let j = 0; j < height; j++) {
                    this.puzzleMap.set(`${XY[0] + j},${XY[1] + i}`, node);
                }
        }

        /** 根据图坐标获取节点 */
        public getPuzzleNode(XY: number[]) {
            return this.puzzleMap.get(XY.join(","));
        }

        /** 查询目标位置是否可移动 */
        public searchPuzzleMap(moveXY: number[]) {
            if (this.puzzleMoving) return false;
            const [x, y] = moveXY;
            if (x < 1 || x > this.puzzleRow) return false;
            if (y < 1 || y > this.puzzleLine) return false;
            return !this.puzzleMap.has(moveXY.join(","));
        }

        /** 锁定 */
        public lock() {
            this.puzzleMoving = true;
        }

        /** 解锁 */
        public release() {
            this.puzzleMoving = false;
        }
    }
    qc.registerBehaviour("ps.KlotskControl", KlotskControl);
    KlotskControl["__menu"] = "玩法模板/华容道玩法/控制组件(KlotskControl)";
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
