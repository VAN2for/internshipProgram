namespace ps {
    /**
     * 拼图块
     * @description 拼图块
     * @author bin
     * @date 2022/12/09 10:59:51
     */
    export class PuzzleView extends DraggableItem {
        /** 是否自动吸附 */
        private _isAutoAdsorb = true;

        constructor(gameObject: qc.Node) {
            super(gameObject);
            /** 序列化拓展 */
            this.serializableFields["_isAutoAdsorb"] = qc.Serializer.AUTO;
        }

        public createGui(): GuiType {
            return {
                allTriggerTargets: {
                    title: "所有可命中目标",
                    component: "nodes",
                },
                returnAnimDuration: {
                    title: "缓动动画耗时(ms)",
                    component: "input",
                    field: {
                        type: "number",
                    },
                },
                diffX: {
                    title: "拖拽时x偏移值",
                    component: "input",
                    field: {
                        type: "number",
                    },
                },
                diffY: {
                    title: "拖拽时y偏移值",
                    component: "input",
                    field: {
                        type: "number",
                    },
                },
                diffS: {
                    title: "拖拽时缩放倍数",
                    component: "input",
                    field: {
                        type: "number",
                    },
                },
                missed: {
                    title: "错过目标后操作:",
                    component: "select",
                    field: {
                        // 配置下拉列表选项
                        options: [
                            {
                                value: Missed.NORMAL,
                                label: "无操作",
                            },
                            {
                                value: Missed.SET_TO_ORG,
                                label: "设置回原位",
                            },
                            {
                                value: Missed.RETURN_TO_ORG,
                                label: "缓动回原位",
                            },
                        ],
                    },
                },
                missHide: {
                    title: "错过目标后，是否隐藏",
                    component: "switch",
                },
                dragSpace: {
                    title: "是否在顶层拖拽",
                    component: "select",
                    field: {
                        // 配置下拉列表选项
                        options: [
                            {
                                value: "World",
                                label: "是",
                            },
                            {
                                value: "Local",
                                label: "否",
                            },
                        ],
                    },
                },
                _isAutoAdsorb: {
                    title: "是否自动吸附",
                    component: "switch",
                },
            };
        }
        public awake(): void {
            this.triggered = Triggered.NORMAL;
            this.triggerHide = false;
            if (this.allTriggerTargets?.length) {
                this.targetObj = this.allTriggerTargets[0];
            }
        }

        /** 试玩初始化的处理 */
        public onInit() {
            // console.info("[info] PuzzleView.onInit");
            super.onInit();
            this.itemEvent.addOnce(
                DraggableItemEvent.TriggerTarget,
                this.onTriggerTarget,
                this
            );
            if (this._isAutoAdsorb) {
                this.itemEvent.addOnce(
                    DraggableItemEvent.HitTarget,
                    this.onTriggerTarget,
                    this
                );
            }
            this.itemEvent.addOnce(
                DraggableItemEvent.toTargetComplete,
                this.onToTargetComplete,
                this
            );
        }

        private onTriggerTarget(e: qc.PointerEvent, hitTarget: qc.Node) {
            this.itemEvent.remove(
                DraggableItemEvent.TriggerTarget,
                this.onTriggerTarget,
                this
            );
            this.itemEvent.remove(
                DraggableItemEvent.HitTarget,
                this.onTriggerTarget,
                this
            );
            this.gameObject.interactive = false;
            this.returnToTarget();
        }

        private onToTargetComplete(target: qc.Node) {
            const view = target.getScript(PuzzleTargetView) as PuzzleTargetView;
            if (!view?.isHideTarget) {
                return;
            }
            if (view.block) {
                view.block.visible = true;
                this.gameObject.visible = false;
            }
            if (view.blockMask) {
                view.blockMask.visible = false;
            }
        }
    }
    qc.registerBehaviour("ps.PuzzleView", PuzzleView);
    PuzzleView["__menu"] = "玩法模板/拼图玩法/拼图块（PuzzleView）";
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
