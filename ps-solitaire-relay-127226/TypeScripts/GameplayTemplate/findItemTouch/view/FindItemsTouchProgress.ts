namespace ps {
    /** 目标物品（触控）进度监控事件类型 */
    export enum FindItemsTouchProgressEvent {
        /** 当前值变更 */
        onChange = "onChange",
        /** 目标完成 */
        onComplete = "onComplete",
    }

    /** 目标显示风格类型 */
    type StyleType =
        /** 当前值/最大目标值 */
        "{0}/{1}"
        /** 当前值-最大目标值 */
        | "{0}-{1}"
        /** 当前值:最大目标值 */
        | "{0}:{1}"
        /** 当前值 / 最大目标值 */
        | "{0} / {1}"
        /** 当前值 - 最大目标值 */
        | "{0} - {1}"
        /** 当前值 : 最大目标值 */
        | "{0} : {1}"
        ;

    /**
     * 目标物品（触控）进度监控
     * @description 目标物品（触控）进度监控，监控触控到目标（区域）节点的次数，到达目标时触发事件
     * @author bin
     * @date 2023/03/28 17:07:34
     */
    export class FindItemsTouchProgress extends Behaviour {
        /** 当前值 */
        private _value = 0;
        public get value(): number {
            return this._value;
        }
        public set value(value: number) {
            if (value === this._value) {
                return;
            }
            this._value = Math.min(value, this._maxValue);
            this.renderText();
            this.event.dispatch(FindItemsTouchProgressEvent.onChange, this);
            if (this._customEventOnChange) {
                triggerCustomEventByCustomEventField(this._customEventOnChange);
            }
            if (this.isComplete) {
                this.event.dispatch(FindItemsTouchProgressEvent.onComplete, this);
                if (this._customEventOnComplete) {
                    triggerCustomEventByCustomEventField(this._customEventOnComplete);
                }
            }
        }

        /** 最大目标值 */
        private _maxValue = 1;
        public get maxValue(): number {
            return this._maxValue;
        }
        public set maxValue(value: number) {
            if (value === this.maxValue) {
                return;
            }
            this._maxValue = value;
            this.renderText();
        }

        /** 监听节点 */
        private _listenerNode: qc.Node;

        /** 监听类型 */
        private _listenerType: FindItemTouchEvent = FindItemTouchEvent.CorrectTarget;

        /** 目标显示风格 */
        private _showStyle: StyleType = "{0}/{1}";
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

        /** 当前值变更事件 */
        private _customEventOnChange: string;

        /** 目标完成事件 */
        private _customEventOnComplete: string;

        /** 事件相关 */
        public event: EventDispatcher = new EventDispatcher();

        public get isComplete(): boolean {
            return this._value >= this._maxValue;
        }

        constructor(public gameObject: qc.UIText) {
            super(gameObject);
        }

        /** 序列化 */
        private serializableFields = {
            value: qc.Serializer.INT,
            maxValue: qc.Serializer.INT,
            _listenerNode: qc.Serializer.NODE,
            _listenerType: qc.Serializer.STRING,
            showStyle: qc.Serializer.STRING,
            _customEventOnChange: qc.Serializer.CUSTOMEVENT,
            _customEventOnComplete: qc.Serializer.CUSTOMEVENT,
        };

        public createGui(): GuiType {
            return {
                value: {
                    title: "当前值",
                    component: "int",
                    field: {
                        min: 0,
                    }
                },
                maxValue: {
                    title: "最大目标值",
                    component: "int",
                    field: {
                        min: 1,
                    }
                },
                _listenerNode: {
                    title: "监听节点",
                },
                _listenerType: {
                    title: "监听类型",
                    component: "select",
                    field: {
                        options: [
                            {
                                value: FindItemTouchEvent.onDown,
                                label: "触控按下",
                            },
                            {
                                value: FindItemTouchEvent.onUp,
                                label: "触控抬起",
                            },
                            {
                                value: FindItemTouchEvent.onClick,
                                label: "点击",
                            },
                            {
                                value: FindItemTouchEvent.CorrectTarget,
                                label: "触控到正确目标",
                            },
                            {
                                value: FindItemTouchEvent.ErrorTarget,
                                label: "触控到错误目标（区域）",
                            },
                        ]
                    }
                },
                showStyle: {
                    title: "目标显示风格",
                    component: "select",
                    field: {
                        options: [
                            {
                                value: "{0}/{1}",
                                label: "当前值/最大目标值",
                            },
                            {
                                value: "{0}-{1}",
                                label: "当前值-最大目标值",
                            },
                            {
                                value: "{0}:{1}",
                                label: "当前值:最大目标值",
                            },
                            {
                                value: "{0} / {1}",
                                label: "当前值 / 最大目标值",
                            },
                            {
                                value: "{0} - {1}",
                                label: "当前值 - 最大目标值",
                            },
                            {
                                value: "{0} : {1}",
                                label: "当前值 : 最大目标值",
                            },
                        ]
                    },
                },
                _customEventOnChange: {
                    title: "当前值变更事件",
                },
                _customEventOnComplete: {
                    title: "目标完成事件",
                },
            };
        }

        /** 试玩初始化的处理 */
        public onInit() {
            let script: FindItemsTouchView | FindItemTouchView;
            script = this._listenerNode.getScript(FindItemsTouchView) as FindItemsTouchView;
            if (!script) {
                script = this._listenerNode.getScript(FindItemTouchView) as FindItemTouchView;
            }
            script.event.add(this._listenerType, this.onTrigger, this);
        }

        private onTrigger(param: FindItemTouchEventParamType) {
            if (!param.isRelation) {
                this.value++;
            }
        }

        private renderText() {
            this.gameObject.text = String.format(this._showStyle, this._value, this._maxValue);
        }

        /** 当脚本被移除时，会自动调用 */
        public onDestroy() {
            // console.info("[info] FindItemsTouchProgress.onDestroy");
        }
    }
    qc.registerBehaviour("ps.FindItemsTouchProgress", FindItemsTouchProgress);
    FindItemsTouchProgress["__menu"] = "玩法模板/寻找物品（触控）玩法/目标物品（触控）进度（FindItemsTouchProgress）";
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