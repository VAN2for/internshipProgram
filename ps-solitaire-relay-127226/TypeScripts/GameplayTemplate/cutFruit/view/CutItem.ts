namespace ps {
    /**
     * 切水果
     * @description 切水果
     * @author weijia
     * @date 2023/02/03 16:28:31
     */
    export enum CutFruitItem {
        // 命中目标物品
        correctTarget,
        // 抵达终点位置
        arriveDestination,
        // 降落到终点位置
        dropDestination,
    }

    export enum CutFruitItemEffect {
        NONE = 0,
        HIDE = 1,
        DESTROY = 2,
    }

    enum ItemState {
        RISE,
        DROP,
        END,
    }

    export class CutItem extends Behaviour {
        public event: EventDispatcher = new EventDispatcher();

        private audioName: string; //音效名称
        private canRepeat: boolean = false; //是否可以重复触发
        private _touched: CutFruitItemEffect = CutFruitItemEffect.NONE; //被命中后的效果

        private minTargetY: number = 0; //终点位置Y轴最小值
        private maxTargetY: number = 0; //终点位置Y轴最大值

        private needDrop: boolean = false; //到达目标位置后是否需要降落
        private needDestination: boolean = false; //到达目标位置后是否需要降落

        private sendMinSpeedX: number = 0; //发射X轴速度最小值
        private sendMaxSpeedX: number = 0; //发射X轴速度最大值
        private sendSpeedX: number = 0; //发射X轴速度
        private sendSpeedY: number = 0; //发射Y轴速度
        private acceleration: number = 0; //加速度
        private moveTime: number = 0; //运动时间

        private isTarget: boolean = false; //是否被触发
        private _arrive: CutFruitItemEffect = CutFruitItemEffect.NONE; //到达终点位置的效果
        private _drop: CutFruitItemEffect = CutFruitItemEffect.NONE; //降落终点后的效果
        private moveState: ItemState = ItemState.RISE; //运动状态

        private targetY: number = 0; //上升过程终点位置
        private dropTargetY: number = 0; //下降过程终点位置

        constructor(gameObject: qc.Node) {
            super(gameObject);
        }

        /** 序列化 */
        private serializableFields = {
            audioName: qc.Serializer.STRING,
            canRepeat: qc.Serializer.BOOLEAN,
            _touched: qc.Serializer.AUTO,
            _arrive: qc.Serializer.AUTO,
            _drop: qc.Serializer.AUTO,

            needDrop: qc.Serializer.BOOLEAN,
            needDestination: qc.Serializer.BOOLEAN,

            minTargetY: qc.Serializer.NUMBER,
            maxTargetY: qc.Serializer.NUMBER,
            sendMinSpeedX: qc.Serializer.NUMBER,
            sendMaxSpeedX: qc.Serializer.NUMBER,

            sendSpeedY: qc.Serializer.NUMBER,
            dropSpeedX: qc.Serializer.NUMBER,
            dropSpeedY: qc.Serializer.NUMBER,
        };

        public createGui(): GuiType {
            return {
                _touched: {
                    title: "命中目标后对节点的操作",
                    component: "select",
                    field: {
                        options: [
                            {
                                value: "noAction",
                                label: "无操作",
                            },
                            {
                                value: "hide",
                                label: "隐藏",
                            },
                            {
                                value: "destroy",
                                label: "销毁",
                            },
                        ],
                    },
                },
                _drop: {
                    title: "到达降落终点对节点的操作：",
                    component: "select",
                    field: {
                        options: [
                            {
                                value: "noAction",
                                label: "无操作",
                            },
                            {
                                value: "hide",
                                label: "隐藏",
                            },
                            {
                                value: "destroy",
                                label: "销毁",
                            },
                        ],
                    },
                },
                _arrive: {
                    title: "到达终点后对节点的操作",
                    component: "select",
                    field: {
                        options: [
                            {
                                value: "noAction",
                                label: "无操作",
                            },
                            {
                                value: "hide",
                                label: "隐藏",
                            },
                            {
                                value: "destroy",
                                label: "销毁",
                            },
                        ],
                    },
                },
                needDestination: {
                    title: "是否需要发射终点位置",
                    component: "switch",
                },
                canRepeat: {
                    title: "是否可重复触发",
                    component: "switch",
                },
                needDrop: {
                    title: "到达发射终点位置后是否降落",
                    component: "switch",
                },
                sendMinSpeedX: {
                    title: "X轴最小发射速度",
                    component: "input",
                    field: {
                        type: "number",
                    },
                },
                sendMaxSpeedX: {
                    title: "X轴最大发射速度",
                    component: "input",
                    field: {
                        type: "number",
                    },
                },
                sendSpeedY: {
                    title: "Y轴发射速度",
                    component: "input",
                    field: {
                        type: "number",
                    },
                },
                minTargetY: {
                    title: "发射终点位置Y最小偏移",
                    component: "input",
                    field: {
                        type: "number",
                    },
                },
                maxTargetY: {
                    title: "发射终点位置Y最大偏移",
                    component: "input",
                    field: {
                        type: "number",
                    },
                },
                audioName: {
                    title: "命中时播放音效",
                    component: "input",
                    field: {
                        type: "number",
                    },
                },
            };
        }
        public playAudio() {
            this.audioName &&
                ps.AudioTrigger.playSound(
                    UIRoot.getChild(this.audioName),
                    true,
                    false,
                    1
                );
        }

        public targetItemHandle(node, event) {
            if (!this.canRepeat && this.isTarget) return;
            this.isTarget = true;
            this.playAudio();
            this.event.dispatch(CutFruitItem.correctTarget, node, event);
            switch (this._touched) {
                case CutFruitItemEffect.NONE:
                    break;
                case CutFruitItemEffect.HIDE:
                    this.gameObject.alpha = 0;
                    this.gameObject.visible = false;
                    break;
                case CutFruitItemEffect.DESTROY:
                    XTween.removeTargetTweens(this.gameObject);
                    this.gameObject.destroy();
                    break;
            }
        }

        /** 组件被激活后执行 */
        public awake() {}

        private onResize() {
            if (!this.needDestination) {
                this.targetY =
                    this.sendSpeedY > 0
                        ? (this.game as any).stage.phaser.height +
                          this.gameObject.height
                        : 0 - this.gameObject.height;
            }
            this.dropTargetY = UIRoot.height + this.gameObject.height;
        }

        public initProps() {
            if (this.needDestination) {
                this.targetY =
                    this.gameObject.y +
                    Math.random() * (this.maxTargetY - this.minTargetY) +
                    this.minTargetY;
            } else {
                this.targetY =
                    this.sendSpeedY > 0
                        ? (this.game as any).stage.phaser.height +
                          this.gameObject.height
                        : 0;
            }
            this.dropTargetY = UIRoot.height + this.gameObject.height;
            this.moveTime =
                Math.abs(this.targetY - this.gameObject.y) /
                (this.sendSpeedY / 2);
            this.acceleration = this.sendSpeedY / this.moveTime;
            this.sendSpeedX =
                Math.random() * (this.sendMaxSpeedX - this.sendMinSpeedX) +
                this.sendMinSpeedX;
        }

        /** 试玩初始化的处理 */
        public onInit() {
            // console.info("[info] CutItem.onInit");
        }

        public update() {
            if (this.moveState == ItemState.RISE) {
                const time = this.game.time.deltaTime;
                this.gameObject.x += (this.sendSpeedX * time) / 1000;
                const oldSpeedY = this.sendSpeedY;
                this.sendSpeedY =
                    this.sendSpeedY + (this.acceleration * time) / 1000;
                this.gameObject.y += (this.sendSpeedY * time) / 1000;
                if (!this.needDestination) {
                    const pos_y = this.gameObject.getWorldPosition().y;
                    if (
                        (this.sendSpeedY > 0 && pos_y > this.targetY) ||
                        (this.sendSpeedY <= 0 && pos_y < 0)
                    ) {
                        this.moveState = ItemState.DROP;
                        this.event.dispatch(
                            CutFruitItem.arriveDestination,
                            this.gameObject
                        );
                        switch (this._arrive) {
                            case CutFruitItemEffect.NONE:
                                break;
                            case CutFruitItemEffect.HIDE:
                                this.gameObject.alpha = 0;
                                this.gameObject.visible = false;
                                break;
                            case CutFruitItemEffect.DESTROY:
                                XTween.removeTargetTweens(this.gameObject);
                                this.gameObject.destroy();
                                break;
                        }
                    }
                }
                if (
                    (this.needDestination &&
                        this.sendSpeedY < 0 &&
                        this.gameObject.y <= this.targetY) ||
                    (this.sendSpeedY > 0 &&
                        this.gameObject.y >= this.targetY) ||
                    oldSpeedY * this.sendSpeedY <= 0
                ) {
                    this.moveState = ItemState.DROP;
                    this.event.dispatch(
                        CutFruitItem.arriveDestination,
                        this.gameObject
                    );
                    switch (this._arrive) {
                        case CutFruitItemEffect.NONE:
                            break;
                        case CutFruitItemEffect.HIDE:
                            this.gameObject.alpha = 0;
                            this.gameObject.visible = false;
                            break;
                        case CutFruitItemEffect.DESTROY:
                            XTween.removeTargetTweens(this.gameObject);
                            this.gameObject.destroy();
                            break;
                    }
                }
            } else if (this.moveState == ItemState.DROP && this.needDrop) {
                const time = this.game.time.deltaTime;
                this.gameObject.x += (this.sendSpeedX * time) / 1000;
                this.sendSpeedY =
                    this.sendSpeedY + (this.acceleration * time) / 1000;
                this.gameObject.y += (this.sendSpeedY * time) / 1000;
                const pos_y = this.gameObject.getWorldPosition().y;
                if (pos_y > this.dropTargetY) {
                    this.moveState = ItemState.END;
                    this.event.dispatch(
                        CutFruitItem.dropDestination,
                        this.gameObject
                    );
                    switch (this._drop) {
                        case CutFruitItemEffect.NONE:
                            break;
                        case CutFruitItemEffect.HIDE:
                            this.gameObject.alpha = 0;
                            this.gameObject.visible = false;
                            break;
                        case CutFruitItemEffect.DESTROY:
                            XTween.removeTargetTweens(this.gameObject);
                            this.gameObject.destroy();
                            break;
                    }
                }
            }
        }
        /** 试玩开始时的处理 */
        public onStart() {
            // console.info("[info] CutItem.onStart");
        }

        /** 当脚本被移除时，会自动调用 */
        public onDestroy() {
            // console.info("[info] CutItem.onDestroy");
        }
    }
    qc.registerBehaviour("ps.CutItem", CutItem);
    CutItem["__menu"] = "玩法模板/切水果玩法/（CutItem）";
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
