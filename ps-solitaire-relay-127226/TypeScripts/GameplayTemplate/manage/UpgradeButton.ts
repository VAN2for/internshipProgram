namespace ps {
    /** 状态更新 */
    export enum UpgradeButtonEvent {
        StateUpdate = "stateUpdate",
    }
    /**
     *
     * @description
     * @author bin
     * @date 2022/12/23 17:35:55
     */
    export class UpgradeButton extends Behaviour {
        Event = new ps.EventDispatcher();
        /** 状态数值 */
        private state: number;
        /** 初始所需货币数值 */
        private initCurrency: number;
        /** 每次升级状态数值添加值 */
        private stateAddNum: number;
        /** 每次升级货币添加倍数 */
        private currencyAddMutiple: number;
        /** 状态文本节点 */
        private stateText: qc.UIText;
        /** 所需货币文本节点 */
        private currencyText: qc.UIText;
        /** 点击次数 */
        private clickNum: number = 0;
        /** 所需货币 */
        private currency: number;
        constructor(gameObject: qc.Node) {
            super(gameObject);
        }

        /** 序列化 */
        private serializableFields = {
            state: qc.Serializer.NUMBER,
            initCurrency: qc.Serializer.NUMBER,
            stateAddNum: qc.Serializer.NUMBER,
            currencyAddMutiple: qc.Serializer.NUMBER,
            stateText: qc.Serializer.NODE,
            currencyText: qc.Serializer.NODE,
        };
        public createGui(): GuiType {
            return {
                state: {
                    title: "初始状态数值",
                    component: "input",
                    field: {
                        type: "number",
                    },
                },
                stateAddNum: {
                    title: "每次升级状态添加值",
                    component: "input",
                    field: {
                        type: "number",
                    },
                },
                stateText: {
                    title: "状态数值文本节点",
                    component: "node",
                },
                initCurrency: {
                    title: "初次升级所需货币",
                    component: "input",
                    field: {
                        type: "number",
                    },
                },
                currencyAddMutiple: {
                    title: "每次升级货币添加倍数",
                    component: "input",
                    field: {
                        type: "number",
                    },
                },
                currencyText: {
                    title: "所需货币数值文本节点",
                    component: "node",
                },
            };
        }
        /** 试玩初始化的处理 */
        public onInit() {
            this.gameObject.interactive = true;
            this.currency = this.initCurrency;
            // console.info("[info] UpgradeButton.onInit");
        }

        /** 设置初始值 */
        public setInitState(initState: number) {
            this.state = initState;
        }

        public onClick() {
            this.state += this.stateAddNum;
            this.clickNum++;
            this.currency = Math.floor(
                this.initCurrency *
                    (1 + this.currencyAddMutiple * this.clickNum)
            );
            this.stateText.text = this.stateText.text.replace(
                /\d{0,}$/,
                String(this.state)
            );
            this.currencyText.text = String(this.currency);
            this.Event.dispatch(UpgradeButtonEvent.StateUpdate, {
                state: this.state,
            });
        }
    }
    qc.registerBehaviour("ps.UpgradeButton", UpgradeButton);
    UpgradeButton["__menu"] = "玩法模板/经营玩法/状态升级（UpgradeButton）";
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
