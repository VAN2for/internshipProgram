namespace ps {
    /**
     *
     * @description 盒子组件
     * @author jingru.wu
     * @date 2023/03/16 14:22:38
     */
    export class JumpBox extends Behaviour {
        Event = new ps.EventDispatcher();
        private _boxes: qc.Node[] = [];
        private _boxType = 0;
        private _isLeft = false;
        private _moveEvent: Function;
        private _t = 0;
        private _v = 1200;
        private _initV = 500;
        private _jumpViewScript: JumpView;
        private _latestBoxX: number;
        private _jumpView: qc.Node;
        private _firstBoxX = 250;
        private _isNeedStop = true;

        constructor(gameObject: qc.Node) {
            super(gameObject);
        }

        /** 序列化 */
        private serializableFields = {
            _v: qc.Serializer.NUMBER,
            _jumpView: qc.Serializer.NODE,
            _isNeedStop: qc.Serializer.BOOLEAN,
            _initV: qc.Serializer.NUMBER,
            _firstBoxX: qc.Serializer.NUMBER,
        };
        public createGui(): GuiType {
            return {
                _v: {
                    title: "盒子速度",
                    component: "input", // 数字控件
                    field: {
                        type: "number",
                    },
                },
                _jumpView: {
                    title: "挂载全局组件的节点",
                    component: "node", // 数字控件
                },
                _isNeedStop: {
                    title: "是否需要停止第一个节点",
                    component: "switch", // 数字控件
                },
                _initV: {
                    title: "第一个盒子速度",
                    component: "input", // 数字控件
                    field: {
                        type: "number",
                    },
                },
                _firstBoxX: {
                    title: "第一个盒子停止的x值",
                    component: "input", // 数字控件
                    field: {
                        type: "number",
                    },
                },
            };
        }
        onInit() {
            this.gameObject.visible = false;
            if (qc.Node.prototype["setPropertyIgnoreLayout"]) {
                this.gameObject["setPropertyIgnoreLayout"]({
                    prop: "visible",
                    value: false,
                });
                this.gameObject["setPropertyIgnoreLayout"]({ prop: "x" });
                this.gameObject["setPropertyIgnoreLayout"]({ prop: "y" });
            }
            this._boxes = this.gameObject.children;
        }

        public move() {
            this._jumpViewScript = this._jumpView.getScript("ps.JumpView");
            if (this._jumpViewScript.boxNum === 1) {
                this._v = this._initV ?? this._v;
            } else {
                this._v = this._v;
            }
            this.gameObject.visible = true;
            this._jumpViewScript.curBox = this;
            this.stopMove();
            this._t = Date.now();
            this.gameObject.alpha = 0;
            Tween.to(
                this.gameObject,
                { alpha: 1 },
                200,
                Phaser.Easing.Sinusoidal.InOut
            );
            this._moveEvent = timer.frameLoop(this.onMoveTick.bind(this));
        }

        private onMoveTick() {
            const delta = Date.now() - this._t;
            this._t = Date.now();
            const { curBox, boxNum } = this._jumpViewScript;
            if (
                !this._isNeedStop &&
                this._jumpViewScript.gameState == JumpGameState.isReady
            )
                this._jumpViewScript.gameState = JumpGameState.isPlaying;
            if (
                this._jumpViewScript.gameState != JumpGameState.isPlaying &&
                ((this._isNeedStop && this.gameObject.x < this._firstBoxX) ||
                    !this._isNeedStop)
            ) {
                // 到达停止
                if (this._jumpViewScript.gameState === JumpGameState.isReady) {
                    !this._jumpViewScript.isStop &&
                        this._jumpViewScript.Event.dispatch(
                            GEvent.firstBoxArrive,
                            this.gameObject
                        );
                    this._jumpViewScript.isStop = true;
                } else if (
                    this._jumpViewScript.gameState === JumpGameState.isEnd
                ) {
                    this.stopMove();
                }
                return;
            }
            if (curBox !== this) {
                const bScript = this._jumpViewScript.boxesScript;
                let i = bScript.indexOf(this);
                if (i > 0) {
                    const preBox = bScript[i - 1];
                    if (
                        Math.abs(preBox.gameObject.x - this.gameObject.x) < 12
                    ) {
                        // 完美重叠
                        this._jumpViewScript.Event.dispatch(
                            GEvent.pefretIntergral,
                            preBox,
                            this
                        );
                    }
                }
                this.stopMove();
                return;
            }
            const toX =
                this.gameObject.x +
                (((this._isLeft ? 1 : -1) * delta) / 1000) * this._v;
            this.gameObject.x = toX;
            if (this._latestBoxX != toX)
                this._jumpViewScript.checkBoxHitSheep();
            this._latestBoxX = toX;
        }

        private stopMove() {
            if (!this._moveEvent) return;
            timer.removeFrameLoop(this._moveEvent);
            this._moveEvent = undefined;
        }

        public get boxType(): number {
            return this._boxType;
        }
        public set boxType(value: number) {
            if (this._boxType === value) return;
            this._boxType = value;
            this._boxes.forEach(($b, $i) => ($b.visible = $i === value - 1));
        }

        public get isLeft() {
            return this._isLeft;
        }
        public set isLeft(value) {
            this._isLeft = value;
        }

        public destroy() {
            this.stopMove();
            super.destroy();
        }
    }
    qc.registerBehaviour("ps.JumpBox", JumpBox);
    JumpBox["__menu"] = "玩法模板/跳一跳玩法/盒子组件（JumpBox）";
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
