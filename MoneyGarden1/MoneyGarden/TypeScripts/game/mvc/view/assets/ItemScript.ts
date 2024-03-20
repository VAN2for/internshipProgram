namespace ps {
    /**
     * 
     * @description 
     * @author bin
     * @date 2021/08/26 16:12:51
     */
    export class ItemScript extends AbstractGameViewAsset {
        private _lv: number;
        private _stateLevel: State;
        private _txtLevel: qc.UIText;
        private _nodeMoney: qc.Node;
        private _nodeItem: qc.Node;
        private _isDark: boolean = false;
        private _twColor: qc.TweenColor;
        private _idx: number = 0;
        private _itemDraggable: DraggableItem;
        private _twImgLevel: qc.TweenRotation;
        private _partBoom: qc.Node;
        private _isEmpty = false;

        private _hasInit = false;

        constructor(gameObject: qc.Node) {
            super(gameObject);
            this.runInEditor = true;
        }

        /** 序列化 */
        private serializableFields: unknown = {
            lv: qc.Serializer.NUMBER,
        };

        /** 组件被激活后执行 */
        public awake() {
            // ps.Print.purple('ItemScript.awake');
            this._stateLevel = this.gameObject.getChild("imgLevel").getComponent(State);
            this._txtLevel = this.gameObject.getChild("txtLevel") as qc.UIText;
            this._nodeMoney = this.gameObject.getChild("nodeMoney");
            this._nodeMoney.visible = false;
            this._nodeItem = this.gameObject.getChild("nodeItem");
            this._twColor = this.gameObject.getComponent(qc.TweenColor);
            this._itemDraggable = this.gameObject.getChild("nodeItem").getComponent(DraggableItem);
            this._twImgLevel = this.gameObject.getChild("imgLevel").getComponent(qc.TweenRotation);
            this._partBoom = this.gameObject.getChild("partBoom");

            if (this.gameObject.parent) {
                this.idx = this.gameObject.parent.getChildIndex(this.gameObject);
            }
            if (!this.lv) {
                this.lv = Random.round(LvMin, LvMax);
            } else {
                this.renderUiLevel();
            }
        }

        /** 试玩初始化的处理 */
        public onInit() {
            // ps.Print.purple('ItemScript.onInit');
            this._model.on("targetItemsIdx", this.onTargetItemsIdx, this, true);
            this._itemDraggable.itemEvent.add(DraggableItemEvent.TriggerTarget, this.onTriggerTarget, this);
            this._itemDraggable.itemEvent.add(DraggableItemEvent.onDown, this.onDownDragItem, this);
            this._itemDraggable.itemEvent.add(DraggableItemEvent.onUp, this.onUpDragItem, this);
            this._itemDraggable.itemEvent.add(DraggableItemEvent.onClick, this.onClickDragItem, this);
            this._itemDraggable.itemEvent.add(DraggableItemEvent.toOrgComplete, this.onToOrgCompleteDragItem, this);

            switch (GAME_CFG.clickEff) {
                case "强":
                    this._partBoom["quantity"] *= 1.5;
                    break;
                case "弱":
                    this._partBoom["quantity"] *= 0.5;
                    break;
            }

            this._hasInit = true;
        }

        public get isEmpty() {
            return this._isEmpty;
        }
        public set isEmpty(value) {
            this._isEmpty = value;
        }

        public update() {
            this.checkAutoGetMoney();
        }

        private _lastAutoGetMoneyTime = 0;
        private _nextAutoGetMoneyTime = 0;

        private checkAutoGetMoney() {
            const { isStartAutoGetMoney, step } = this._model;
            if (!isStartAutoGetMoney) {
                return;
            }
            if (step === "end" || this.isEmpty) {
                return;
            }
            if (!this._nextAutoGetMoneyTime) {
                this._nextAutoGetMoneyTime = Random.round(AutoGetMoneyDelayMin, AutoGetMoneyDelayMax);
            }
            this._lastAutoGetMoneyTime += this.game.time.deltaTime;
            if (this._lastAutoGetMoneyTime < this._nextAutoGetMoneyTime) {
                return;
            }

            this.getMoney();
            this._lastAutoGetMoneyTime = 0;
            this._nextAutoGetMoneyTime = 0;
        }

        private onToOrgCompleteDragItem() {
            this._model.isShowGuide = true;
        }

        private onClickDragItem() {
            this._twImgLevel.playForward(true);
            this.game.add.clone(this._partBoom).visible = true;
            this.getMoney(GAME_CFG.onceMoney, true);
        }

        private onDownDragItem() {
            this._model.isShowGuide = false;
        }

        private onUpDragItem() {
            this._model.isShowGuide = true;
        }

        private onTriggerTarget(event: qc.PointerEvent, target: qc.Node) {
            this._model.isShowGuide = false;
            this.isEmpty = true;
            const itemScript = target.getComponent(ItemScript) as ItemScript;
            itemScript.onMerge(this._nodeItem);
            this._itemDraggable.destroy();
            // console.log("onTriggerTarget", this.idx, itemScript.idx);
        }

        public onMerge(target: qc.Node) {
            // console.log("onMerge", this.idx);
            const diffX = 100;
            const duration = 200;
            this.gameObject.addChild(target);
            target.x = target.y = 0;
            this._itemDraggable.targetAreas = [];
            this._model.numLastTargetIdx = this.idx;
            xtween(this._nodeItem)
                .to(duration, { x: -diffX }, { easing: XTween.Easing.Sinusoidal.In })
                .to(duration, { x: 0 }, { easing: XTween.Easing.Sinusoidal.Out })
                .call(() => {
                    this.lv += 1;
                    XTween.repeat(2, true,
                        xtween(this._nodeItem)
                            .to(duration / 2, { scaleX: 1.2, scaleY: 1.2 }, { easing: XTween.Easing.Sinusoidal.InOut })
                    ).call(this.onMergeFinish, this).start();
                })
                .start();
            xtween(target)
                .to(duration, { x: diffX }, { easing: XTween.Easing.Sinusoidal.In })
                .to(duration, { x: 0 }, { easing: XTween.Easing.Sinusoidal.Out })
                .call(() => {
                    target.destroy();
                })
                .start();

            this._model.targetItemsIdx = [];
            Audio.playSound("sm_click");
        }

        private onMergeFinish() {
            this._model.numMergeCnt++;
            if (this._model.numMergeCnt <= 3) {
                sendAction(this._model.numMergeCnt);
            }
            this._model.isShowGetMoneyView = true;
        }

        private onTargetItemsIdx() {
            const { targetItemsIdx } = this._model;
            if (targetItemsIdx.length <= 0) {
                this.isDark = false;
                if (this._hasInit) {
                    this._itemDraggable.enable = false;
                    this._itemDraggable.targetAreas = [];
                }
                return;
            }
            const idx = this._controller.getOtherTargetIdx(this.idx);
            if (idx !== -1) {
                this.isDark = false;
                this._itemDraggable.targetAreas = [this.gameObject.parent.getChildAt(idx)];
            } else {
                this.isDark = true;
            }
        }

        public get idx(): number {
            return this._idx;
        }
        public set idx(value: number) {
            this._idx = value;
        }

        public get isDark(): boolean {
            return this._isDark;
        }
        public set isDark(value: boolean) {
            this._itemDraggable.enable = !value;
            if (value == this._isDark) {
                return;
            }
            this._isDark = value;
            // if (!this._hasInit) {
            //     this._twColor.resetGroupToBeginning();
            // } else {
            if (value) {
                this._twColor.playGroupForward(true);
            } else {
                this._twColor.playGroupReverse(true);
            }
            // }
        }

        private getMoney(money: number = GAME_CFG.onceMoney, isPlaySm = false) {
            const { step } = this._model;
            if (step === "end" || this.isEmpty) {
                return;
            }

            const nodeMoney = this.game.add.clone(this._nodeMoney);
            const tw = nodeMoney.getChild("nodeTw").getComponent(qc.TweenAlpha) as qc.TweenAlpha;
            tw.onFinished.addOnce(() => {
                nodeMoney.destroy();
            });
            const txtMoney = nodeMoney.getChild("txtMoney") as qc.UIText;
            txtMoney.text = `${money}`;
            nodeMoney.visible = true;
            this._model.numMoney += money;
            if (isPlaySm) {
                Audio.playSound("sm_money");
            }
        }

        public get lv(): number {
            return this._lv;
        }
        public set lv(value: number) {
            if (value === this._lv) {
                return;
            }

            this._lv = value;
            this.renderUiLevel();
        }

        private renderUiLevel() {
            const lv = Math.max(Math.min(this.lv, LvMax), LvMin);
            this._stateLevel?.changeState(lv - 1);
            this._txtLevel && (this._txtLevel.text = `${lv}`);
        }

        /** 试玩开始时的处理 */
        public onStart() {
            // ps.Print.purple('ItemScript.onStart');
        }

        /** 当脚本被移除时，会自动调用 */
        public onDestroy() {
            // ps.Print.purple('ItemScript.onDestroy');
        }
    }
    qc.registerBehaviour('ps.ItemScript', ItemScript);
    ItemScript['__menu'] = 'Custom/ItemScript';
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