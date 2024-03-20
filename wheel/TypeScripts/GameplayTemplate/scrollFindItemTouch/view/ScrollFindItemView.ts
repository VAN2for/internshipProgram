namespace ps {
    export enum ScrollFindItemEvent {
        onDown = "onDown", //触控按下
        onUp = "onUp", //触控抬起
        onClick = "onClick", //点击
        onDrag = "onDrag", //拖拽
        onDragStart = "onDragStart", //拖拽开始
        onDragEnd = "onDragEnd", //拖拽开始
        ItemTouched = "ItemTouched", // 接触
        TargetItemTouched = "TargetItemTouched", //触控到正确目标
        OtherItemTouched = "OtherItemTouched", //触控到错误目标（区域）
    }

    /**
     * 挂载在寻找目标上的组件
     * @description 挂载在寻找目标上的组件父类
     * @author QiaoSen.huang
     * @date 2023/01/03 15:32:39
     */
    export class ScrollFindItemView extends Behaviour {
        /** 是否手指按下触发，否则为点击 */
        private _isDown = false;
        /** 触控到目标（区域）后的音效 */
        private _soundName = "";
        /** 触控到目标（区域）后的埋点 */
        private _action: number;
        /** 控制组件所在节点 */
        private _managerNode: qc.Node;

        private _manager: ScrollFindItemsManagerView;

        /** 事件相关 */
        public event: EventDispatcher = new EventDispatcher();

        /** 控制组件所在节点 */
        private _isTouched = false;

        public get isTouched(): boolean {
            return this._isTouched;
        }
        private _isChangedTouched = false;
        public set isTouched($value: boolean) {
            if (this._isChangedTouched) return;
            this._isTouched = $value;
            this._isChangedTouched = true;
        }

        constructor(gameObject: qc.Node) {
            super(gameObject);
        }

        /** 序列化 */
        public serializableFields: unknown = {
            _isDown: qc.Serializer.AUTO,
            _soundName: qc.Serializer.AUTO,
            _action: qc.Serializer.AUTO,
            _managerNode: qc.Serializer.NODE,
        };
        public createGui(): GuiType {
            return {
                _managerNode: {
                    title: "控制组件所在节点",
                    component: "node",
                },
                _isDown: {
                    title: "是否手指按下触发，否则为点击",
                    component: "switch",
                },
                _soundName: {
                    title: "触控到正确目标后的音效",
                    component: "input",
                },
                _action: {
                    title: "触控到正确目标后到埋点",
                    component: "input",
                    field: {
                        type: "number",
                    },
                },
            };
        }
        /** 组件被激活后执行 */
        public awake() {
            this._manager = this._managerNode.getScript(
                "ps.ScrollFindItemsManagerView"
            ) as ps.ScrollFindItemsManagerView;
            const event = this._manager.event;
            event.add(ScrollFindItemAreaEvent.onDrag, this._onDrag, this);
            event.add(
                ScrollFindItemAreaEvent.onDragStart,
                this._onDragStart,
                this
            );
            event.add(ScrollFindItemAreaEvent.onDragEnd, this._onDragEnd, this);
            event.add(ScrollFindItemAreaEvent.onDown, this._onDown, this);
            event.add(ScrollFindItemAreaEvent.onUp, this._onUp, this);
            event.add(ScrollFindItemAreaEvent.onClick, this._onClick, this);
            // console.info("[info] ScrollFindItemTargetTouchView.awake");
        }

        /** 试玩初始化的处理 */
        public onInit() {
            // console.info("[info] ScrollFindItemTargetTouchView.onInit");
        }

        protected _onDragStart(node: qc.Node, e: qc.PointerEvent) {
            // console.log("ddd", e)
            const point = new qc.Point(e.source.x, e.source.y);
            if (!this.checkIsTouch(point)) return;
            this._onTouch(e);
            this.event.dispatch(
                ScrollFindItemEvent.onDragStart,
                this.gameObject,
                e
            );
        }

        protected _onDrag(node: qc.Node, e: qc.PointerEvent) {
            // console.log("ddd", e)
            const point = new qc.Point(e.source.x, e.source.y);
            if (!this.checkIsTouch(point)) return;
            this._onTouch(e);
            this.event.dispatch(ScrollFindItemEvent.onDrag, this.gameObject, e);
        }

        protected _onDragEnd(node: qc.Node, e: qc.PointerEvent) {
            // console.log("ddd", e)
            const point = new qc.Point(e.source.x, e.source.y);
            if (!this.checkIsTouch(point)) return;
            this._onTouch(e);
            this.event.dispatch(
                ScrollFindItemEvent.onDragEnd,
                this.gameObject,
                e
            );
        }

        protected _onDown(node: qc.Node, e: qc.ClickEvent) {
            if (!this._isDown) {
                return;
            }
            const point = new qc.Point(e.source.x, e.source.y);
            if (!this.checkIsTouch(point)) return;
            this._onTouch(e);
            this.event.dispatch(ScrollFindItemEvent.onDown, this.gameObject, e);
        }

        protected _onClick(node: qc.Node, e: qc.ClickEvent) {
            if (this._isDown) {
                return;
            }
            const point = new qc.Point(e.source.x, e.source.y);
            if (!this.checkIsTouch(point)) return;
            this._onTouch(e);
            this.event.dispatch(
                ScrollFindItemEvent.onClick,
                this.gameObject,
                e
            );
        }

        protected _onUp(node: qc.Node, e: qc.ClickEvent) {
            const point = new qc.Point(e.source.x, e.source.y);
            if (!this.checkIsTouch(point)) return;
            this._onTouch(e);
            this.event.dispatch(ScrollFindItemEvent.onUp, this.gameObject, e);
        }

        protected checkIsTouch(point: qc.Point) {
            return this.gameObject.rectContains(point);
        }

        protected _onTouch(e: qc.PointerEvent) {
            if (this.isTouched) return;
            this.isTouched = true;
            // 音效处理
            if (this._soundName) {
                const nodeAudio = UIRoot.getChild(this._soundName);
                if (nodeAudio && AudioTrigger?.playSound) {
                    AudioTrigger.playSound(nodeAudio, true, false, 1);
                } else {
                    Audio.playSound(this._soundName);
                }
            }
            // 埋点处理
            if (this._action) {
                sendAction(this._action);
            }
            // 对外派发事件
            this.dispatchEvent(e);
        }

        protected dispatchEvent(e: qc.PointerEvent | qc.ClickEvent) {
            // 对外派发的事件，子类可以重新该方法，派发出不同的事件
            this.event.dispatch(
                ScrollFindItemEvent.ItemTouched,
                this.gameObject,
                e
            );
        }

        /** 试玩开始时的处理 */
        public onStart() {
            // console.info("[info] ScrollFindItemTargetTouchView.onStart");
        }

        /** 当脚本被移除时，会自动调用 */
        public onDestroy() {
            // console.info("[info] ScrollFindItemTargetTouchView.onDestroy");
        }
    }
    qc.registerBehaviour("ps.ScrollFindItemView", ScrollFindItemView);
    ScrollFindItemView["__menu"] =
        "玩法模板/寻找物品（滑动）玩法模板/可触摸物品组件 ScrollFindItemView";
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
