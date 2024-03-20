namespace ps {
    /** 倒计时事件类型 */
    export enum CountDownEvent {
        /** 当前值变更 */
        onChange = "onChange",
        /** 目标完成 */
        onComplete = "onComplete",
        /** 倒计时接近结束 */
        onNearComplete = "onNearComplete",
    }

    /** 显示风格类型 */
    type StyleType =
        /** 分:秒 */
        "{1}:{0}"
        /** 时:分:秒 */
        | "{2}:{1}:{0}"
        /** 分 : 秒 */
        | "{1} : {0}"
        /** 时 : 分 : 秒 */
        | "{2} : {1} : {0}"
        ;

    /**
     * 倒计时
     * @description 倒计时，时间改变、倒计时结束时触发事件
     * @author bin
     * @date 2023/03/30 14:10:23
     */
    export class CountDown extends Behaviour {
        /** 当前时间（秒） */
        private _value = 10;
        public get value(): number {
            return this._value;
        }
        public set value(value: number) {
            if (value === this._value) {
                return;
            }
            value = Math.max(0, value);
            this._value = value;
            this._secondsValue = value * 1000;

            this.renderText();
            this.event.dispatch(CountDownEvent.onChange, this);
            if (this._customEventOnChange) {
                triggerCustomEventByCustomEventField(this._customEventOnChange);
            }
            if (this._value <= 0) {
                this.event.dispatch(CountDownEvent.onComplete, this);
                if (this._customEventOnComplete) {
                    triggerCustomEventByCustomEventField(this._customEventOnComplete);
                }
            }
            const isTriggerCustomEventOnNearComplete =
                this._isLoopTriggerCustomEventOnNearComplete ?
                    this._value <= this._nearCompleteValue :
                    this._value == this._nearCompleteValue;
            if (isTriggerCustomEventOnNearComplete) {
                this.event.dispatch(CountDownEvent.onNearComplete, this);
                if (this._customEventOnNearComplete) {
                    triggerCustomEventByCustomEventField(this._customEventOnNearComplete);
                }
            }
        }
        private _secondsValue: number;
        /** 显示风格 */
        private _showStyle: StyleType = "{1}:{0}";
        public get showStyle(): StyleType {
            return this._showStyle;
        }
        public set showStyle(value: StyleType) {
            if (value === this._showStyle) {
                return;
            }
            this._showStyle = value;
            this.renderText();
        }
        /** 是否自动开始 */
        private _isAutoStart = true;
        /** 当前值变更事件 */
        private _customEventOnChange: string;
        /** 倒计时结束事件 */
        private _customEventOnComplete: string;
        /** 
         * 剩几秒算接近结束
         * @description 剩几秒算接近结束的值，小于等于0时，不触发该事件
         */
        private _nearCompleteValue = 0;
        /** 
         * 倒计时接近结束事件
         * @description 剩几秒算接近结束的值，小于等于0时，不触发该事件
         */
        private _customEventOnNearComplete: string;
        /** 是否每秒触发，倒计时接近结束事件 */
        private _isLoopTriggerCustomEventOnNearComplete = false;

        private _isStart = false;
        public set isStart(value: boolean) {
            if (value === this._isStart) {
                return;
            }
            this._isStart = value;
        }

        /** 事件相关 */
        public event: EventDispatcher = new EventDispatcher();

        constructor(public gameObject: qc.UIText) {
            super(gameObject);
        }

        /** 序列化 */
        private serializableFields = {
            value: qc.Serializer.INT,
            showStyle: qc.Serializer.STRING,
            _isAutoStart: qc.Serializer.BOOLEAN,
            _customEventOnChange: qc.Serializer.CUSTOMEVENT,
            _customEventOnComplete: qc.Serializer.CUSTOMEVENT,
            _nearCompleteValue: qc.Serializer.INT,
            _customEventOnNearComplete: qc.Serializer.CUSTOMEVENT,
            _isLoopTriggerCustomEventOnNearComplete: qc.Serializer.BOOLEAN,
        };

        public createGui(): GuiType {
            return {
                value: {
                    title: "当前值",
                    component: "int",
                    field: {
                        min: 0,
                        max: 100,
                    }
                },
                showStyle: {
                    title: "显示风格",
                    component: "select",
                    field: {
                        options: [
                            {
                                value: "{1}:{0}",
                                label: "分:秒"
                            },
                            {
                                value: "{2}:{1}:{0}",
                                label: "时:分:秒"
                            },
                            {
                                value: "{1} : {0}",
                                label: "分 : 秒"
                            },
                            {
                                value: "{2} : {1} : {0}",
                                label: "时 : 分 : 秒"
                            },
                        ]
                    }
                },
                _isAutoStart: {
                    title: "是否自动开始",
                    component: "switch"
                },
                _customEventOnChange: {
                    title: "当前值变更事件",
                    component: "input"
                },
                _customEventOnComplete: {
                    title: "倒计时结束事件",
                    component: "input"
                },
                _nearCompleteValue: {
                    title: "剩几秒算接近结束",
                    tail: "剩几秒算接近结束的值，小于等于0时，不触发该事件",
                    component: "int",
                    field: {
                        min: 0,
                        max: 100,
                    }
                },
                _customEventOnNearComplete: {
                    title: "倒计时接近结束事件",
                    tail: "剩几秒算接近结束的值，小于等于0时，不触发该事件",
                    component: "input"
                },
                _isLoopTriggerCustomEventOnNearComplete: {
                    title: "是否每秒触发，倒计时接近结束事件",
                    component: "switch"
                },
            };
        }

        /** 组件被激活后执行 */
        public awake() {
            // console.info("[info] CountDown.awake");
        }

        /** 试玩初始化的处理 */
        public onInit() {
            // console.info("[info] CountDown.onInit");
        }

        /** 试玩开始时的处理 */
        public onStart() {
            // console.info("[info] CountDown.onStart");
            this._secondsValue = this._value * 1000;
            if (this._isAutoStart && this._value > 0) {
                this._isStart = true;
            }
        }

        private renderText() {
            if (
                this._showStyle === "{1}:{0}" ||
                this._showStyle === "{1} : {0}"
            ) {
                const { minutes: m, seconds: s } = Tools.formatMilliseconds(this._value * 1000);
                this.gameObject.text = String.format(this._showStyle, s, m);
            } else if (
                this._showStyle === "{2}:{1}:{0}" ||
                this._showStyle === "{2} : {1} : {0}"
            ) {
                const { hours: h, minutes: m, seconds: s } = Tools.formatTime(this._value * 1000);
                this.gameObject.text = String.format(this._showStyle, s, m, h);
            }
        }

        private updateValue() {
            if (!this._value || this._value < 0) {
                return;
            }
            const { deltaTime: delta } = this.game.time;
            this._secondsValue -= delta;
            const value = Math.ceil(this._secondsValue / 1000);
            this.value = value;
        }

        public update() {
            if (!this._isStart) {
                return;
            }
            this.updateValue();
        }

        /** 当脚本被移除时，会自动调用 */
        public onDestroy() {
            // console.info("[info] CountDown.onDestroy");
        }
    }
    qc.registerBehaviour("ps.CountDown", CountDown);
    CountDown["__menu"] = "玩法模板/玩法组件/倒计时（CountDown）";
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