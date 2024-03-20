namespace ps {
    /**
     *
     * 华容道碎片块
     * @description 华容道碎片块
     * @author zhen.liang
     * @date 2022/12/31 15:16:24
     */
    export class KlotskiPuzzl extends Behaviour {
        private KlotskControl: ps.KlotskControl;
        /** 挂载控制器的节点 */
        private controlNode: qc.Node;
        /** 宽度 */
        private width: number;
        /** 高度 */
        private height: number;
        /** 图中起始X坐标 */
        private startX: number;
        /** 图中起始Y坐标 */
        private startY: number;
        /** 图中目标X坐标 */
        private targetX: number;
        /** 图中目标Y坐标 */
        private targetY: number;
        /** 正确时播放的音乐名称 */
        private goodAudioName: string;
        /** 无法移动时播放的音乐名称 */
        private waringAudioName: string;
        /** 移动时播放的音乐名称 */
        private moveAudioName: string;
        private shake: ps.Shake;
        constructor(gameObject: qc.Node) {
            super(gameObject);
        }

        /** 序列化 */
        private serializableFields = {
            controlNode: qc.Serializer.NODE,
            width: qc.Serializer.INT,
            height: qc.Serializer.INT,
            startX: qc.Serializer.INT,
            startY: qc.Serializer.INT,
            targetX: qc.Serializer.INT,
            targetY: qc.Serializer.INT,
            goodAudioName: qc.Serializer.STRING,
            waringAudioName: qc.Serializer.STRING,
            moveAudioName: qc.Serializer.STRING,
        };
        public createGui(): GuiType {
            return {
                controlNode: {
                    title: "控制器节点",
                    component: "node",
                },
                width: {
                    title: "宽度",
                    component: "input",
                    field: {
                        type: "number",
                    },
                },
                height: {
                    title: "高度",
                    component: "input",
                    field: {
                        type: "number",
                    },
                },
                startX: {
                    title: "起始X坐标",
                    component: "input",
                    field: {
                        type: "number",
                    },
                },
                startY: {
                    title: "起始Y坐标",
                    component: "input",
                    field: {
                        type: "number",
                    },
                },
                targetX: {
                    title: "目标X坐标",
                    component: "input",
                    field: {
                        type: "number",
                    },
                },
                targetY: {
                    title: "目标Y坐标",
                    component: "input",
                    field: {
                        type: "number",
                    },
                },
                goodAudioName: {
                    title: "正确时播放的音乐名称",
                    component: "input",
                },
                waringAudioName: {
                    title: "无法移动时播放的音乐名称",
                    component: "input",
                },
                moveAudioName: {
                    title: "移动时播放的音乐名称",
                    component: "input",
                },
            };
        }
        /** 试玩初始化的处理 */
        public onInit() {
            this.gameObject.interactive = true;
            this.KlotskControl = this.controlNode.getScript("ps.KlotskControl");
            this.KlotskControl.setPuzzleMap(
                [this.startX, this.startY],
                this.gameObject,
                this.width,
                this.height
            );
            if (Number.isNaN(this.startY) || Number.isNaN(this.startX))
                console.warn("没有配置初始坐标");
            if (Number.isNaN(this.targetX)) this.targetX = 0;
            if (Number.isNaN(this.targetY)) this.targetY = 0;
            /** 添加震动组件 */
            this.shake = this.gameObject.addScript("ps.Shake");
        }

        private moving = false;
        public onUp(e: qc.PointerEvent) {
            if (this.moving) return;
            const moveXY = this.compulteToXY(e.source);
            if (this.searchCanMove(moveXY)) {
                this.move(moveXY);
            } else {
                this.shake.play(0.2);
                this.playSound(this.waringAudioName);
            }
        }

        /** 获取移动后的位置与目标位置差值 */
        public getTargetGap(endXY: number[]) {
            return (
                Math.abs(endXY[0] - this.targetX) +
                Math.abs(endXY[1] - this.targetY)
            );
        }

        /** 查询目标位置是否可移动 */
        private searchCanMove(moveXY: number[]) {
            const offsetXY = [moveXY[0] - this.startX, moveXY[1] - this.startY];
            if (offsetXY[0] !== 0) {
                const offsetX = offsetXY[0] > 0 ? this.height - 1 : 0;
                for (let i = 0; i < this.width; i++)
                    if (
                        !this.KlotskControl.searchPuzzleMap([
                            moveXY[0] + offsetX,
                            moveXY[1] + i,
                        ])
                    )
                        return false;
            } else {
                const offsetY = offsetXY[1] > 0 ? this.width - 1 : 0;
                for (let i = 0; i < this.height; i++)
                    if (
                        !this.KlotskControl.searchPuzzleMap([
                            moveXY[0] + i,
                            moveXY[1] + offsetY,
                        ])
                    )
                        return false;
            }
            return true;
        }

        /** 移动 */
        private move(moveXY: number[]) {
            this.moving = true;
            this.KlotskControl.lock();
            const offsetXY = [moveXY[0] - this.startX, moveXY[1] - this.startY];
            this.playSound(this.moveAudioName);
            const nodeXt = xtween(this.gameObject);
            nodeXt
                .to(0.1 * 1000, {
                    x:
                        this.gameObject.x +
                        offsetXY[1] * (this.gameObject.width / this.width),
                    y:
                        this.gameObject.y +
                        offsetXY[0] * (this.gameObject.height / this.height),
                })
                .call(() => {
                    this.KlotskControl.release();
                    this.moving = false;
                    this.KlotskControl.puzzleMove(
                        [this.startX, this.startY],
                        moveXY,
                        this.gameObject,
                        this.width,
                        this.height
                    );
                    if (
                        this.startX === this.targetX &&
                        this.startY === this.targetY
                    )
                        this.KlotskControl.decrease();
                    if (
                        moveXY[0] === this.targetX &&
                        moveXY[1] === this.targetY
                    ) {
                        this.KlotskControl.addCorrectPuzzle();
                        this.playSound(this.goodAudioName);
                    }
                    this.startX = moveXY[0];
                    this.startY = moveXY[1];
                });
            nodeXt.start();
        }

        /** 计算位移后XY */
        private compulteToXY(source: qc.Pointer) {
            const offsetX = source.x - source.startX,
                offsetY = source.y - source.startY;
            if (Math.abs(offsetX) < Math.abs(offsetY))
                return [
                    offsetY > 0 ? this.startX + 1 : this.startX - 1,
                    this.startY,
                ];
            return [
                this.startX,
                offsetX > 0 ? this.startY + 1 : this.startY - 1,
            ];
        }

        /** 播放音乐 */
        private playSound(soundName: string) {
            if (typeof soundName !== "string" || soundName.length < 1) return;
            ps.Audio.playSound(soundName);
        }
    }
    qc.registerBehaviour("ps.KlotskiPuzzl", KlotskiPuzzl);
    KlotskiPuzzl["__menu"] = "玩法模板/华容道玩法/碎片组件(KlotskiPuzzl)";
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
