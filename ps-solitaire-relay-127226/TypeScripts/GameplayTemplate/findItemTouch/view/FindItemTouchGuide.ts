namespace ps {
    /**
     * 目标物品（触控）指引
     * @description 目标物品（触控）指引
     * @author bin
     * @date 2023/04/03 11:08:23
     */
    export class FindItemTouchGuide extends Behaviour {
        /** 统筹目标节点 */
        private _findItems: qc.Node;
        /** 是否自动开始 */
        private _isAutoStart = true;
        /** 首次显示延迟（秒） */
        private _firstDelay = 0;
        /** 
         * 是否多次显示指引
         * @description 关闭时不再触发后续指引
         */
        private _isShowReplay = true;
        public get isShowReplay() {
            return this._isShowReplay;
        }
        public set isShowReplay(value) {
            this._isShowReplay = value;
        }
        /**
         * 后续显示延迟（秒）
         * @description 一般用于设定无操作延迟
         */
        private _laterDelay = 3;
        public get laterDelay(): number {
            return this._laterDelay;
        }
        public set laterDelay(value: number) {
            this._laterDelay = value;
        }
        /** 
         * 指引目标节点
         * @description 用户配置时优先用配置的，无配置时，监听统筹面板上的所有目标节点
         */
        private _targetNodes: qc.Node[];
        public get targetNodes(): qc.Node[] {
            return this._targetNodes;
        }
        public set targetNodes(value: qc.Node[]) {
            this._targetNodes = value;
        }

        private _isShow: boolean;
        public get isShow(): boolean {
            return this._isShow;
        }
        public set isShow(value: boolean) {
            if (value === this._isShow) {
                return;
            }
            this._isShow = value;
            this.onShow();
        }

        /** 首次显示指引事件 */
        private _customEventFirstShow: string;
        /** 后续显示指引事件 */
        private _customEventLaterShow: string;
        /** 隐藏指引事件 */
        private _customEventHide: string;

        private _isFirstShow = true;
        private _hasInit = false;
        private _delayedCall: gsap.core.Tween;
        private _currTarget: qc.Node;
        public get currTarget(): qc.Node {
            return this._currTarget;
        }

        constructor(public gameObject: qc.Node) {
            super(gameObject);
        }

        /** 序列化 */
        private serializableFields = {
            _findItems: qc.Serializer.NODE,
            _isAutoStart: qc.Serializer.BOOLEAN,
            _firstDelay: qc.Serializer.NUMBER,
            _isShowReplay: qc.Serializer.BOOLEAN,
            _laterDelay: qc.Serializer.NUMBER,
            _targetNodes: qc.Serializer.NODES,
            _customEventFirstShow: qc.Serializer.CUSTOMEVENT,
            _customEventLaterShow: qc.Serializer.CUSTOMEVENT,
            _customEventHide: qc.Serializer.CUSTOMEVENT,
        };

        public createGui(): GuiType {
            return {
                _findItems: {
                    title: "统筹目标节点",
                },
                _isAutoStart: {
                    title: "是否自动开始",
                },
                _firstDelay: {
                    title: "首次显示延迟（秒）",
                },
                _isShowReplay: {
                    title: "是否多次显示指引",
                    tail: "关闭时不再触发后续指引",
                },
                _laterDelay: {
                    title: "后续显示延迟（秒）",
                },
                _targetNodes: {
                    title: "指引目标节点",
                    tail: "用户配置时优先用配置的，无配置时，监听统筹面板上的所有目标节点",
                },
                _customEventFirstShow: {
                    title: "首次显示指引事件",
                },
                _customEventLaterShow: {
                    title: "后续显示指引事件",
                },
                _customEventHide: {
                    title: "隐藏指引事件",
                },
            };
        }

        /** 组件被激活后执行 */
        public awake() {
            // console.info("[info] FindItemTouchGuide.awake");
            if (!this._targetNodes?.length) {
                const findItemsScript = this._findItems.getScript(FindItemsTouchView) as FindItemsTouchView;
                this._targetNodes = findItemsScript?.allNodeFindItem?.concat();
            }

            Tools.ignoreLayoutPropsDeep(this.gameObject, [
                { prop: "x" },
                { prop: "y" },
            ]);
        }

        /** 试玩初始化的处理 */
        public onInit() {
            // console.info("[info] FindItemTouchGuide.onInit");
            this.isShow = this._isAutoStart && !!this._targetNodes?.length;
            this._hasInit = true;
        }

        /** 试玩开始时的处理 */
        public onStart() {
            // console.info("[info] FindItemTouchGuide.onStart");
        }

        private findTarget(): qc.Node {
            for (let i = 0; i < this._targetNodes.length;) {
                const element = this._targetNodes[i];
                if (!element?.parent) {
                    this._targetNodes.splice(i, 1);
                    continue;
                } else {
                    const script = element.getScript(FindItemTouchView) as FindItemTouchView;
                    if (script?.isFinded) {
                        this._targetNodes.splice(i, 1);
                        continue;
                    } else {
                        return this._targetNodes[i];
                    }
                }
            }
        }

        private onShow() {
            const isShow = this._isShow;
            // const autoAlpha = isShow ? 1 : 0;
            // const duration = !this._hasInit ? 0 : isShow ? .2 : .3;
            const delay = !isShow ? 0 : this._isFirstShow ? this._firstDelay : this._laterDelay;
            if (isShow) {
                if (!this._isFirstShow && !this._isShowReplay) {
                    return;
                }
            } else {
                gsap.killTweensOf(this.gameObject);
            }
            // this.gameObject.visible = true;
            this._delayedCall?.kill();
            this._delayedCall = gsap.delayedCall(delay, () => {
                if (isShow) {
                    this.updatePos();
                    if (!this._targetNodes?.length) {
                        return;
                    }
                }
                // gsap.to(this.gameObject, { autoAlpha, duration });
                if (isShow) {
                    const customEventShow = this._isFirstShow ? this._customEventFirstShow : this._customEventLaterShow;
                    if (customEventShow) {
                        triggerCustomEventByCustomEventField(customEventShow);
                    }
                    this._isFirstShow = false;
                } else {
                    if (this._customEventHide) {
                        triggerCustomEventByCustomEventField(this._customEventHide);
                    }
                }
            });
        }

        private updatePos() {
            const target = this._currTarget = this.findTarget();
            if (!target?.parent) {
                return;
            }
            const { x, y } = this.gameObject.parent.toLocal(target.getWorldPosition());
            this.gameObject.x = x;
            this.gameObject.y = y;
        }

        /** 当脚本被移除时，会自动调用 */
        public onDestroy() {
            // console.info("[info] FindItemTouchGuide.onDestroy");
        }

        public onResize() {
            if (this._isShow) {
                this.updatePos();
            }
        }
    }
    qc.registerBehaviour("ps.FindItemTouchGuide", FindItemTouchGuide);
    FindItemTouchGuide["__menu"] = "玩法模板/目标物品（触控）玩法/目标物品（触控）指引（FindItemTouchGuide）";
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