namespace ps {
    /**
     * 所有金钱组件
     * @description 所有金钱组件
     * @author bin
     * @date 2021/08/26 21:51:29
     */
    export class AllMoneyScript extends AbstractGameViewAsset {
        private _numScroll: NumScroll;

        private _hasInit = false;

        constructor(gameObject: qc.Node) {
            super(gameObject);
        }

        /** 序列化 */
        private serializableFields: unknown = {

        };

        /** 组件被激活后执行 */
        public awake() {
            // ps.Print.purple('AllMoneyScript.awake');
            this._numScroll = this.gameObject.getComponent(NumScroll);
            this._numScroll.prefix = this._controller.prefixMoney;
            this._numScroll.maxNum = Infinity;
        }

        /** 试玩初始化的处理 */
        public onInit() {
            // ps.Print.purple('AllMoneyScript.onInit');
            this._numScroll.prefixPosition = GAME_CFG.moneySymbolPosition;
            this._model.on("numMoney", this.onNumMoney, this, true);
            this._model.on("step", this.onStep, this, true);
            this._hasInit = true;
        }

        private onStep() {
            const { step, numMoney } = this._model;
            if (step !== "end") {
                return;
            }
            this._numScroll.curNum = numMoney;
            this._numScroll.awake();
        }

        public onNumMoney() {
            const { numMoney } = this._model;
            this._numScroll.refresh(numMoney - this._numScroll.curNum);

            if (numMoney >= Number(GAME_CFG.moneyToEnd)) {
                this._model.step = "end";
            }
        }

        /** 试玩开始时的处理 */
        public onStart() {
            // ps.Print.purple('AllMoneyScript.onStart');
        }

        /** 当脚本被移除时，会自动调用 */
        public onDestroy() {
            // ps.Print.purple('AllMoneyScript.onDestroy');
        }
    }
    qc.registerBehaviour('ps.AllMoneyScript', AllMoneyScript);
    AllMoneyScript['__menu'] = 'Custom/AllMoneyScript';
}
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