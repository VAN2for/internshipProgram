namespace ps {
    interface Idle {
        play(): Accelerating & CommonWheel;
    }

    interface Accelerating {
        /**
         * 进入匀速阶段时派发事件
         *
         * 如果转盘已经进入匀速阶段，不会派发事件
         */
        onRunning: qc.Signal;
    }

    interface Running {
        /**
         * 停止在拼图的第n块上
         *
         * 如果不传参数`nth`，则停在第`0`块
         */
        stop(nth?: number): Stopping & CommonWheel;
    }

    interface Stopping {
        /**
         * 转盘停止时派发事件
         *
         * 如果转盘已经停止，不会派发事件
         */
        onStop: qc.Signal;
    }

    type CommonWheel = {
        /** @property 当前转盘偏转角，角度制 */
        rotation: number;
        /** @property 当前转盘状态 */
        state: WheelState;
    } & Behaviour;

    export type IdleSpinWheel = Idle & CommonWheel;
    export type AcceleratingSpinWheel = Accelerating & CommonWheel;
    export type RunningSpinWheel = Running & CommonWheel;
    export type StoppingSpinWheel = Stopping & CommonWheel;

    export enum WheelState {
        /** 静止 */
        IDLE,
        /** 加速 */
        ACCELERATING,
        /** 匀速 */
        RUNNING,
        /** 减速 */
        STOPPING,
    }

    export class SpinWheel
        extends Behaviour
        implements Idle, Accelerating, Running, Stopping, CommonWheel
    {
        constructor(gameObject: qc.Node) {
            super(gameObject);
        }

        private serializableFields: Record<string, unknown> = {
            wheel: qc.Serializer.NODE,
            portions: qc.Serializer.NUMBER,
            secondPerCycle: qc.Serializer.NUMBER,
            accelerateDuration: qc.Serializer.NUMBER,
            accelerateAngle: qc.Serializer.NUMBER,
            stopDuration: qc.Serializer.NUMBER,
            clockWise: qc.Serializer.BOOLEAN,
        };
        public createGui(): GuiType {
            return {
                wheel: {
                    title: "旋转容器",
                    component: "node",
                },
                portions: {
                    title: "转盘块数",
                    component: "input",
                    field: {
                        type: "number",
                    },
                },
                secondPerCycle: {
                    title: "转盘一圈耗时(秒)",
                    component: "input",
                    field: {
                        type: "number",
                    },
                },
                accelerateDuration: {
                    title: "加速阶段耗时(秒)",
                    component: "input",
                    field: {
                        type: "number",
                    },
                },
                accelerateAngle: {
                    title: "加速阶段目标角度(角度)",
                    component: "input",
                    field: {
                        type: "number",
                    },
                },

                stopDuration: {
                    title: "停止阶段耗时(秒)",
                    component: "input",
                    field: {
                        type: "number",
                    },
                },
                clockWise: {
                    title: "顺时针旋转",
                    component: "switch",
                },
            };
        }
        public wheel: qc.Node;

        /** @property 转盘块数 */
        public portions = 8;
        private secondPerCycle_ = 0.2;
        public set secondPerCycle(speed: number) {
            this.secondPerCycle_ = speed;
            this.maxSpeed = (2 * Math.PI) / this.secondPerCycle_;
        }
        /** @property 转盘一圈耗时 */
        public get secondPerCycle() {
            return this.secondPerCycle_;
        }

        private state_: WheelState;
        /** @property 当前转盘状态 */
        public get state() {
            return this.state_;
        }

        /** @property 是否顺时针旋转 */
        public get clockWise() {
            return this.clockWise_;
        }
        public set clockWise(direction: boolean) {
            this.clockWise_ = direction;
        }
        private clockWise_ = true;

        public onInit() {
            if (!this.wheel) {
                SpinWheel.warn("未设置旋转容器，回退到组件挂载的节点");
                this.wheel = this.gameObject;
            }

            this.state_ = WheelState.IDLE;
            this.maxSpeed = (2 * Math.PI) / this.secondPerCycle_;
        }

        private movingTween: Phaser.Tween;
        private accTween: Phaser.Tween;
        private stoppingTween: Phaser.Tween;
        public play(): Accelerating & CommonWheel {
            if (this.state_ !== WheelState.IDLE) {
                SpinWheel.warn("当前状态不可启动转盘", WheelState[this.state_]);
                return;
            }

            this.state_ = WheelState.ACCELERATING;

            this.accTween = this.createAccelerateTween(this.wheel);
            this.accTween.onComplete.addOnce(
                () => {
                    this.state_ = WheelState.RUNNING;
                    this.movingTween = this.createMovingTween(this.wheel);
                    this.movingTween.start();

                    this.onRunning.dispatch(this);
                },
                null,
                -1
            );
            this.accTween.start();

            return this;
        }

        public stop(nth = 0): Stopping & CommonWheel {
            switch (this.state_) {
                case WheelState.ACCELERATING:
                    {
                        this.accTween.stop();
                    }
                    break;
                case WheelState.RUNNING:
                    {
                        this.movingTween.stop();
                    }
                    break;

                default: {
                    SpinWheel.warn(
                        "当前状态不可停止转盘",
                        WheelState[this.state_]
                    );
                    return;
                }
            }

            this.wheel.rotation %= 2 * Math.PI;

            this.state_ = WheelState.STOPPING;

            this.stoppingTween = this.createStoppingTween(this.wheel, {
                rotationModifier: this.rotationModifierMap.nth(nth),
            });
            this.stoppingTween.onComplete.addOnce(
                () => {
                    this.state_ = WheelState.IDLE;

                    this.onStop.dispatch(this);
                },
                null,
                -1
            );
            this.stoppingTween.start();

            return this;
        }

        public onRunning = new qc.Signal();
        public onStop = new qc.Signal();

        public get rotation() {
            return Math.abs(Mathf.radianToAngle(this.wheel.rotation));
        }

        private maxSpeed = (2 * Math.PI) / this.secondPerCycle_;
        /** @property 加速阶段耗时 */
        public accelerateDuration = 1;
        /** @property 加速阶段目标角度 角度制 */
        public get accelerateAngle() {
            return Mathf.radianToAngle(this.accelerateRadian_);
        }
        public set accelerateAngle(angle: number) {
            this.accelerateRadian_ = Mathf.angleToRadian(angle);
        }
        private accelerateRadian_ = Math.PI;

        /** @property 停止阶段耗时 */
        public stopDuration = 1.33;

        private createMovingTween(node: qc.Node) {
            const end = this.clockWise_
                ? node.rotation + this.secondPerCycle_ * this.maxSpeed
                : node.rotation - this.secondPerCycle_ * this.maxSpeed;
            const tween = game.add
                .tween(node)
                .to(
                    {
                        rotation: end,
                    },
                    this.secondPerCycle_ * 1000,
                    Phaser.Easing.Linear.None
                )
                .repeat(-1);

            return tween;
        }

        private createAccelerateTween(node: qc.Node) {
            const end = this.clockWise_
                ? node.rotation + this.accelerateRadian_
                : node.rotation - this.accelerateRadian_;
            const tween = game.add.tween(node).to(
                {
                    rotation: end,
                },
                this.accelerateDuration * 1000,
                Phaser.Easing.Sinusoidal.In
            );

            tween.onComplete.addOnce(
                () => {
                    node.rotation %= 2 * Math.PI;
                },
                null,
                -1
            );

            return tween;
        }

        public readonly rotationModifierMap = {
            default: () => (rotation: number) => {
                return this.clockWise_
                    ? rotation + Math.PI
                    : rotation - Math.PI;
            },
            nth: (n: number) => (rotation: number) => {
                const target = ((2 * Math.PI) / this.portions) * n;
                const normalized = Math.abs(rotation % (2 * Math.PI));

                const diff = target - normalized;
                if (this.clockWise_) {
                    return diff >= 0 && diff >= Math.PI
                        ? rotation + diff
                        : rotation + 2 * Math.PI + diff;
                } else {
                    return diff >= 0 && diff >= Math.PI
                        ? rotation - diff
                        : rotation - (2 * Math.PI + diff);
                }
            },
        };

        private createStoppingTween(node: qc.Node, config: StopConfig) {
            const end = config.rotationModifier(node.rotation);

            const tween = game.add.tween(node).to(
                {
                    rotation: end,
                },
                this.stopDuration * 1000,
                Phaser.Easing.Back.Out
            );

            tween.onComplete.addOnce(
                () => {
                    node.rotation %= 2 * Math.PI;
                },
                null,
                -1
            );

            return tween;
        }

        private static readonly MESSAGE_PREFIX = "[转盘组件]";
        private static warn(...msg: unknown[]) {
            console.warn(this.MESSAGE_PREFIX, ...msg);
        }
    }
    qc.registerBehaviour("ps.SpinWheel", SpinWheel);
    SpinWheel["__menu"] = "玩法模板/转盘玩法/转盘玩法（SpinWheel）";

    interface StopConfig {
        rotationModifier: (rotation: number) => number;
        ease?: (k: number) => number;
    }

    export type RotationModifier = (rotation: number) => number;
}
