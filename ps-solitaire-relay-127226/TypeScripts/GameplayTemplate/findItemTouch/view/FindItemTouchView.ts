namespace ps {
    /** 
     * 目标物品（触控）事件类型
     * @param 目标物品（触控）事件参数类型 {@link FindItemTouchEventParamType}
     */
    export enum FindItemTouchEvent {
        onDown = "onDown", //触控按下
        onUp = "onUp", //触控抬起
        onClick = "onClick", //点击
        CorrectTarget = "CorrectTarget", //触控到正确目标
        ErrorTarget = "ErrorTarget", //触控到错误目标（区域）
    }

    /**
     * 目标物品（触控）事件参数类型
     */
    export type FindItemTouchEventParamType = {
        script: FindItemTouchView,
        target: qc.Node,
        event: qc.PointerEvent | qc.ClickEvent,
        globalPoint: qc.Point,
        isRelation: boolean,
    };

    /** 触控到目标（区域）后对节点的操作 */
    export enum Touched {
        NONE = 0, //无操作
        HIDE = 1, //隐藏
        DESTROY = 2, //销毁
        ONCE = 3, //不再触发
    }

    /**
     * 目标物品（触控）
     * @description 目标物品（触控）
     * @author bin
     * @date 2022/12/28 18:17:22
     */
    export class FindItemTouchView extends Behaviour {
        /** 是否克隆联动节点目标事件节点 */
        protected isCloneRelationEventNode = true;
        /** 是否保持事件节点位置与当前目标（区域）位置相同 */
        protected isCustomEventTargetNodePointToGameObj = true;

        /** 是否手指按下触发，否则为点击 */
        private _isDown = false;
        /** 触控到目标（区域）后对节点的操作 */
        private _touched: Touched = Touched.NONE;
        /** 触控到目标（区域）后的音效 */
        private _soundName = "";
        /** 触控到目标（区域）后的埋点 */
        private _action: number;
        /** 触控按下事件 */
        private _customEventOnDown: string;
        /** 触控抬起事件 */
        private _customEventOnUp: string;
        /** 点击事件 */
        private _customEventOnClick: string;
        /** 触控到目标（区域）事件 */
        private _customEventTarget: string;
        /** 触控到目标（区域）事件节点 */
        private _customEventTargetNode: qc.Node;
        /** 触控到目标（区域）联动节点。触控到目标时，联动节点的目标效果会同时触发 */
        private _customEventRelationNode: qc.Node;

        /** 事件相关 */
        public event: EventDispatcher = new EventDispatcher();

        private _findItemEventId: number;
        private _addEvented = false;
        private _isFinded = false;
        public get isFinded(): boolean {
            return this._isFinded;
        }

        constructor(gameObject: qc.Node) {
            super(gameObject);
        }

        /** 序列化 */
        public serializableFields = {
            _isDown: qc.Serializer.AUTO,
            _touched: qc.Serializer.AUTO,
            _soundName: qc.Serializer.AUTO,
            _action: qc.Serializer.AUTO,
            _customEventOnDown: qc.Serializer.CUSTOMEVENT,
            _customEventOnUp: qc.Serializer.CUSTOMEVENT,
            _customEventOnClick: qc.Serializer.CUSTOMEVENT,
            _customEventTarget: qc.Serializer.CUSTOMEVENT,
            _customEventTargetNode: qc.Serializer.NODE,
            _customEventRelationNode: qc.Serializer.NODE,
        };

        public createGui(): GuiType {
            return {
                _isDown: {
                    title: "是否手指按下触发，否则为点击",
                    component: "switch",
                },
                _touched: {
                    title: "触控到目标（区域）后对节点的操作",
                    component: "select",
                    field: {
                        options: [
                            {
                                value: Touched.NONE,
                                label: "无操作"
                            },
                            {
                                value: Touched.HIDE,
                                label: "隐藏"
                            },
                            {
                                value: Touched.DESTROY,
                                label: "销毁"
                            },
                            {
                                value: Touched.ONCE,
                                label: "不再触发"
                            }
                        ],
                        placeholder: "触控到目标（区域）后对节点的操作",
                    },
                },
                _soundName: {
                    title: "触控到目标（区域）后的音效",
                    component: "input",
                },
                _action: {
                    title: "触控到目标（区域）后的埋点",
                    component: "input",
                    field: {
                        type: "number",
                    },
                },
                _customEventOnDown: {
                    title: "触控按下事件",
                },
                _customEventOnUp: {
                    title: "触控抬起事件",
                },
                _customEventOnClick: {
                    title: "点击事件",
                },
                _customEventTarget: {
                    title: "触控到目标（区域）事件",
                },
                _customEventTargetNode: {
                    title: "触控到目标（区域）事件节点",
                },
                _customEventRelationNode: {
                    title: "触控到目标（区域）联动节点",
                    tail: "触控到目标时，联动节点的目标效果会同时触发",
                },
            };
        }

        public awake(): void {
            this.gameObject.interactive = true;
        }

        /** 试玩初始化的处理 */
        public onInit() {
            // console.info("[info] FindItemTouchView.onInit");
            this.addEvent();
        }

        public addEvent() {
            if (this._addEvented) {
                return;
            }
            this.gameObject.onDown.add(this._onDown, this);
            this.gameObject.onClick.add(this._onClick, this);
            this._addEvented = true;
        }

        public removeEvent() {
            if (!this._addEvented) {
                return;
            }
            this.gameObject.onDown.remove(this._onDown, this);
            this.gameObject.onUp.remove(this._onUp, this);
            this.gameObject.onClick.remove(this._onClick, this);
            this._addEvented = false;
        }

        /** 触发目标（区域）时，派发事件 */
        public dispatchEvent(param: FindItemTouchEventParamType) {
            this.event.dispatch(FindItemTouchEvent.CorrectTarget, param);
        }

        public triggerCustomEvent(globalPoint: qc.Point) {
            if (this._customEventTargetNode) {
                let node: qc.Node;
                if (this.isCloneRelationEventNode) {
                    node = this.game.add.clone(this._customEventTargetNode);
                    if (this._customEventTarget) {
                        const customEvent = cloneCustomEventByCustomEventFieldToNode(this._customEventTarget, {
                            from: this._customEventTargetNode,
                            to: node
                        });
                        if (customEvent) {
                            playVpActions(customEvent.action);
                        }
                    }
                } else {
                    if (this._customEventTarget) {
                        triggerCustomEventByCustomEventField(this._customEventTarget);
                    }
                    node = this._customEventTargetNode;
                }
                node?.setPropertyIgnoreLayout({ prop: "x" });
                node?.setPropertyIgnoreLayout({ prop: "y" });
                this.gameObject.addChild(node);
                // node?.parent.setChildIndex(node, node.parent.children.length - 1);
                const { x, y } = node.parent.toLocal(globalPoint);
                node.x = x;
                node.y = y;
            }
        }

        private checkAllowTouch(e: qc.PointerEvent | qc.ClickEvent) {
            if (this._findItemEventId != void 0) {
                if (this._findItemEventId !== e.source.eventId) {
                    return false;
                }
            } else {
                this._findItemEventId = e.source.eventId;
            }
            return true;
        }

        /** 触控按下时处理 */
        private _onDown(target: qc.Node, e: qc.PointerEvent): void {
            // console.info("[info] FindItemTouchView._onDown");
            if (!this.checkAllowTouch(e)) {
                return;
            }
            if (!this._isDown) {
                return;
            }
            this.event.dispatch(FindItemTouchEvent.onDown, {
                script: this,
                target,
                event: e,
                globalPoint: new qc.Point(e.source.x, e.source.y),
                isRelation: false,
            });
            this._customEventOnDown && triggerCustomEventByCustomEventField(this._customEventOnDown);
            this._onTouch(e);
            this.gameObject.onUp.remove(this._onUp, this);
            this.gameObject.onUp.addOnce(this._onUp, this);
        }

        /** 触控抬起时处理 */
        private _onUp(target: qc.Node, e: qc.PointerEvent): void {
            // console.info("[info] FindItemTouchView._onUp");
            if (!this.checkAllowTouch(e)) {
                return;
            }
            this.event.dispatch(FindItemTouchEvent.onUp, {
                script: this,
                target,
                event: e,
                globalPoint: new qc.Point(e.source.x, e.source.y),
                isRelation: false,
            });
            this._customEventOnUp && triggerCustomEventByCustomEventField(this._customEventOnUp);
            this._findItemEventId = null;
        }

        /** 点击时处理 */
        private _onClick(target: qc.Node, e: qc.ClickEvent): void {
            // console.info("[info] FindItemTouchView._onClick");
            if (!this.checkAllowTouch(e)) {
                return;
            }
            if (this._isDown) {
                return;
            }
            this.event.dispatch(FindItemTouchEvent.onClick, {
                script: this,
                target,
                event: e,
                globalPoint: new qc.Point(e.source.x, e.source.y),
                isRelation: false,
            });
            this._customEventOnClick && triggerCustomEventByCustomEventField(this._customEventOnClick);
            this._onTouch(e);
        }

        /** 音效处理 */
        private playSound() {
            if (this._soundName) {
                const nodeAudio = UIRoot.getChild(this._soundName);
                if (nodeAudio && AudioTrigger?.playSound) {
                    AudioTrigger.playSound(nodeAudio, true, false, 1);
                } else {
                    Audio.playSound(this._soundName);
                }
            }
        }

        /** 埋点处理 */
        private sendAction() {
            if (this._action) {
                sendAction(this._action);
            }
        }

        private onTouched() {
            switch (this._touched) {
                case Touched.NONE:
                    break;
                case Touched.HIDE:
                    this.gameObject.alpha = 0;
                    this.gameObject.visible = false;
                    break;
                case Touched.DESTROY:
                    this.gameObject.destroy();
                    break;
                case Touched.ONCE:
                    this.removeEvent();
                    break;
            }
        }

        private _onTouch(event: qc.PointerEvent | qc.ClickEvent) {
            const onTouch = (script: FindItemTouchView, globalPoint: qc.Point, isRelation: boolean) => {
                script.playSound();
                script.sendAction();
                script.onTouched();
                script.dispatchEvent({
                    script,
                    target: script.gameObject,
                    event,
                    globalPoint,
                    isRelation,
                });
                script.triggerCustomEvent(globalPoint);
                script._isFinded = true;
            };

            const touchPoint = this.isCustomEventTargetNodePointToGameObj ?
                this.gameObject.getWorldPosition() :
                new qc.Point(event.source.x, event.source.y);
            onTouch(this, touchPoint, false);

            // 联动节点。触控到目标时，联动节点的目标效果会同时触发
            const relationScript = this._customEventRelationNode?.getScript(FindItemTouchView) as FindItemTouchView;
            if (relationScript) {
                const relationPoint = this._customEventRelationNode.toGlobal(
                    this.gameObject.toLocal(touchPoint)
                );
                onTouch(relationScript, relationPoint, true);
            }
        }

        /** 当脚本被移除时，会自动调用 */
        public onDestroy() {
            // console.info("[info] FindItemTouchView.onDestroy");
        }
    }
    qc.registerBehaviour("ps.FindItemTouchView", FindItemTouchView);
    FindItemTouchView["__menu"] = "玩法模板/寻找物品（触控）玩法/目标物品（触控）（FindItemTouchView）";
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