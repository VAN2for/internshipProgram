namespace ps {
    /**
     * 
     * @description 
     * @author bin
     * @date 2021/08/26 17:12:41
     */
    export class GameView extends AbstractGameViewAsset {
        private _nodeItemes: qc.Node;
        private _nodeDisclamer: qc.Node;
        private _finger: Finger;
        private _twBg: qc.TweenColor;

        private _hasInit = false;

        constructor(gameObject: qc.Node) {
            super(gameObject);
        }

        /** 序列化 */
        private serializableFields: unknown = {

        };

        /** 组件被激活后执行 */
        public awake() {
            // ps.Print.purple('GameView.awake');
            this._nodeItemes = this.gameObject.getChild("nodeItemes");
            this._nodeDisclamer = this.gameObject.getChild("nodeDisclamer");
            this._finger = this.gameObject.getChild("gf_hand").getComponent(Finger);
            this._twBg = this.gameObject.getChild("pb_bg").getComponent(qc.TweenColor);
            this._twBg.resetToBeginning();
        }

        /** 试玩初始化的处理 */
        public onInit() {
            // ps.Print.purple('GameView.onInit');
            this._nodeDisclamer.visible = GAME_CFG.isShowDisclaimer;
            this._model.on("isShowGuide", this.onIsShowGuide, this, true);
            this._model.on("targetItemsIdx", this.onTargetItemsIdx, this, true);
            this._hasInit = true;
        }

        private onTargetItemsIdx() {
            if (!this._hasInit) {
                return;
            }
            const { targetItemsIdx, isShowGuide } = this._model;
            if (targetItemsIdx.length <= 0 && !isShowGuide) {
                this._twBg.playReverse(true);
            }
        }

        private onIsShowGuide() {
            const { isShowGuide, targetItemsIdx } = this._model;
            const isShow = !!isShowGuide;
            XTween.removeTargetTweens(this.gameObject);
            if (!isShow || targetItemsIdx.length <= 0) {
                this._finger.hide();
                // if (targetItemsIdx.length <= 0) {
                //     this._twBg.playReverse(true);
                // }
            } else {
                const target0 = this._nodeItemes.getChildAt(targetItemsIdx[0])?.getChild("nodeItem");
                const target1 = this._nodeItemes.getChildAt(targetItemsIdx[1])?.getChild("nodeItem");
                if (target0 && target1) {
                    this._finger.show();
                    this._finger.startLoop(() => {
                        this._finger
                            .moveToTarget(target0)
                            .showImg(200)
                            .moveToTarget(target1, 300)
                            .waitTime(100)
                            .hideImg(200);
                    });
                } else if (target0) {
                    this._finger.show();
                    this._finger.moveToTarget0(target0);
                    this._finger.showScaleEffect(-.1);
                }
                if (isShow && targetItemsIdx.length > 0) {
                    this._twBg.playForward();
                }
            }
        }

        /** 试玩开始时的处理 */
        public onStart() {
            // ps.Print.purple('GameView.onStart');
        }

        /** 当脚本被移除时，会自动调用 */
        public onDestroy() {
            // ps.Print.purple('GameView.onDestroy');
        }
    }
    qc.registerBehaviour('ps.GameView', GameView);
    GameView['__menu'] = 'Custom/GameView';
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