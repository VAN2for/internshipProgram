namespace ps {
    /**
     * 获得金钱页面
     * @description 获得金钱页面
     * @author bin
     * @date 2021/08/27 10:22:14
     */
    export class GetMoneyView extends AbstractGameViewAsset {
        private _txtMoney: qc.UIText;
        private _showNodeCard: tween.Show;
        private _showTxtExcellent: tween.Show;
        private _partCouponLine: qc.Node;
        private _imgCard: qc.UIImage;

        private _flyToNode: qc.Node;

        private _hasInit = false;

        constructor(gameObject: qc.Node) {
            super(gameObject);
        }

        /** 序列化 */
        private serializableFields: unknown = {
            _flyToNode: qc.Serializer.NODE,
        };

        /** 组件被激活后执行 */
        public awake() {
            // ps.Print.purple('GetMoneyView.awake');
            this._txtMoney = this.gameObject.getChild("txtMoney") as qc.UIText;
            this._showNodeCard = this.gameObject.getChild("nodeCard").getComponent(tween.Show);
            this._showTxtExcellent = this.gameObject.getChild("txtExcellent").getComponent(tween.Show);
            this._partCouponLine = this.gameObject.getChild("partCouponLine");
            this._imgCard = this.gameObject.getChild("imgCard") as qc.UIImage;
        }

        /** 试玩初始化的处理 */
        public onInit() {
            // ps.Print.purple('GetMoneyView.onInit');
            this._txtMoney.text = GAME_CFG.moneySymbolPosition === "后" ? `${this._controller.moneyToEnd}${this._controller.prefixMoney}` : `${this._controller.prefixMoney}${this._controller.moneyToEnd}`;

            this._model.on("isShowGetMoneyView", this.onIsShowGetMoneyView, this, true);

            switch (GAME_CFG.getMoneyEff) {
                case "强":
                    this._partCouponLine["quantity"] *= 1.5;
                    break;
                case "弱":
                    this._partCouponLine["quantity"] *= 0.5;
                    break;
            }

            this._hasInit = true;
        }

        private timerHideDelay: qc.TimerEvent;

        private onIsShowGetMoneyView() {
            const { isShowGetMoneyView } = this._model;
            const isShow = !!isShowGetMoneyView;
            const alpha = isShow ? 1 : 0;
            XTween.removeTargetTweens(this.gameObject);
            if (!this._hasInit) {
                this.gameObject.visible = isShow;
                this.gameObject.alpha = alpha;
            } else {
                this.gameObject.visible = true;
                xtween(this.gameObject).to(200, { alpha }).call(() => {
                    this.gameObject.visible = isShow;
                    if (isShow) {
                        this.timerHideDelay = timer.once(GetMoneyViewAutoHideDelay, this.hideGetMoneyView, this);
                    }
                }).start();
                if (isShow) {
                    this._showNodeCard.play();
                    this._showTxtExcellent.play();
                    Audio.playSound("sm_excellent");
                    this._partCouponLine["reset"]();
                    this._partCouponLine["start"]();
                    Audio.playSound("sm_congrats");
                }
            }
        }

        /** 试玩开始时的处理 */
        public onStart() {
            // ps.Print.purple('GetMoneyView.onStart');
        }

        /** 当脚本被移除时，会自动调用 */
        public onDestroy() {
            // ps.Print.purple('GetMoneyView.onDestroy');
        }

        public onClick() {
            this.hideGetMoneyView();
        }

        private hideGetMoneyView() {
            if (this.timerHideDelay) {
                timer.remove(this.timerHideDelay);
            }
            const { isShowGetMoneyView } = this._model;
            if (!isShowGetMoneyView) {
                return;
            }
            this._model.isShowGetMoneyView = false;
            this.onFlyCard();
        }

        private onFlyCard() {
            const scale = .1;
            const parent = UIRoot.getChild("gamePlay");
            const pos = parent.toLocal(this._imgCard.getWorldPosition());
            const card = this.game.add.clone(this._imgCard, parent);
            card.x = pos.x;
            card.y = pos.y;
            const { x, y } = parent.toLocal(this._flyToNode.getWorldPosition());
            Audio.playSound("sm_coin");
            xtween(card).to(500, { x, y, scaleX: scale, scaleY: scale }, { easing: XTween.Easing.Sinusoidal.InOut }).to(100, { alpha: 0 }).call(() => {
                card.destroy();
                const money = Number(this._controller.moneyToEnd);
                this._model.numMoney += money;
                this._controller.checkNextStep();
            }).start();
        }
    }
    qc.registerBehaviour('ps.GetMoneyView', GetMoneyView);
    GetMoneyView['__menu'] = 'Custom/GetMoneyView';
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