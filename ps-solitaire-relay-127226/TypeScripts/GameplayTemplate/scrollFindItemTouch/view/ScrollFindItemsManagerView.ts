namespace ps {
    export enum ScrollFindItemAreaEvent {
        onDragStart = "onDragStart", //拖拽
        onDrag = "onDrag", //拖拽
        onDragEnd = "onDragEnd", //拖拽
        onDown = "onDown", //触控按下
        onUp = "onUp", //触控抬起
        onClick = "onClick", //点击
        allFound = "allFound", // 全部找到
    }
    /**
     * 滑动寻找物品模板的总控制组件
     * @description 滑动寻找物品模板的总控制组件
     * @author QiaoSen.huang
     * @date 2023/01/03 17:20:09
     */
    export class ScrollFindItemsManagerView extends Behaviour {
        // 所有寻找物品的集合
        public _targetItems: qc.Node[] = [];
        // 是否所有物品都找到

        /** 事件相关 */
        public event: EventDispatcher = new EventDispatcher();

        private _isAddEvent = false;
        private _isAddItemEvent = false;
        private _isItemAllFound = false;
        constructor(gameObject: qc.Node) {
            super(gameObject);
        }

        /** 序列化 */
        private serializableFields: unknown = {
            _targetItems: qc.Serializer.NODES,
        };
        public createGui(): GuiType {
            return {
                _targetItems: {
                    title: "所有寻找物品的集合",
                    component: "nodes",
                },
            };
        }
        /** 组件被激活后执行 */
        public awake() {
            this.addEvent();
            this.addItemEvent();
            // console.info("[info] ScrollFindItemsTouchView.awake");
        }

        /** 试玩初始化的处理 */
        public onInit() {
            // console.info("[info] ScrollFindItemsTouchView.onInit");
        }

        /** 试玩开始时的处理 */
        public onStart() {
            // console.info("[info] ScrollFindItemsTouchView.onStart");
        }

        private addEvent() {
            if (this._isAddEvent) return;
            this.gameObject.onClick.add(this._onClick, this);
            this.gameObject.onDown.add(this._onDown, this);
            this.gameObject.onUp.add(this._onUp, this);
            this.gameObject.onDrag.add(this._onDrag, this);
            this.gameObject.onDragStart.add(this._onDragStart, this);
            this.gameObject.onDragEnd.add(this._onDragEnd, this);
            this._isAddEvent = true;
        }

        private removeEvent() {
            if (!this._isAddEvent) return;
            this.gameObject.onClick.remove(this._onClick, this);
            this.gameObject.onDown.remove(this._onDown, this);
            this.gameObject.onUp.remove(this._onUp, this);
            this.gameObject.onDrag.remove(this._onDrag, this);
            this.gameObject.onDragStart.remove(this._onDragStart, this);
            this.gameObject.onDragEnd.remove(this._onDragEnd, this);
            this._isAddEvent = false;
        }

        private addItemEvent() {
            if (this._isAddItemEvent) return;
            if (this._targetItems.length === 0) return;
            this._targetItems.forEach((item, idx) => {
                const itemScript = item.getScript(
                    ScrollFindItemView
                ) as ScrollFindItemView;
                const event = itemScript.event;
                event.add(
                    ScrollFindItemEvent.ItemTouched,
                    this._onItemTouched,
                    this
                );
            });
            this._isAddItemEvent = true;
        }

        private removeItemEvent() {
            if (!this._isAddItemEvent) return;
            if (this._targetItems.length === 0) return;
            this._targetItems.forEach((item, idx) => {
                const itemScript = item.getScript(
                    ScrollFindItemView
                ) as ScrollFindItemView;
                const event = itemScript.event;
                event.remove(
                    ScrollFindItemEvent.ItemTouched,
                    this._onItemTouched,
                    this
                );
            });
            this._isAddItemEvent = false;
        }

        private _onItemTouched() {
            if (this._isItemAllFound) return;
            for (let i = 0; i < this._targetItems.length; i++) {
                const item = this._targetItems[i];
                const itemScript = item.getScript(
                    ScrollFindItemView
                ) as ScrollFindItemView;
                if (itemScript.isTouched === false) {
                    return;
                }
            }
            this.event.dispatch(ScrollFindItemAreaEvent.allFound);
            this._isItemAllFound = true;
        }

        public _onDrag(node: qc.Node, e: qc.PointerEvent) {
            // console.log("drag", e)
            this.event.dispatch(ScrollFindItemAreaEvent.onDrag, node, e);
        }
        public _onDragStart(node: qc.Node, e: qc.PointerEvent) {
            this.event.dispatch(ScrollFindItemAreaEvent.onDragStart, node, e);
        }
        public _onDragEnd(node: qc.Node, e: qc.PointerEvent) {
            this.event.dispatch(ScrollFindItemAreaEvent.onDragEnd, node, e);
        }

        public _onDown(node: qc.Node, e: qc.PointerEvent) {
            this.event.dispatch(ScrollFindItemAreaEvent.onDown, node, e);
        }
        public _onUp(node: qc.Node, e: qc.PointerEvent) {
            this.event.dispatch(ScrollFindItemAreaEvent.onUp, node, e);
        }
        public _onClick(node: qc.Node, e: qc.ClickEvent) {
            this.event.dispatch(ScrollFindItemAreaEvent.onClick, node, e);
        }

        /** 当脚本被移除时，会自动调用 */
        public onDestroy() {
            this.removeEvent();
            this.removeItemEvent();
        }
    }
    qc.registerBehaviour(
        "ps.ScrollFindItemsManagerView",
        ScrollFindItemsManagerView
    );
    ScrollFindItemsManagerView["__menu"] =
        "玩法模板/寻找物品（滑动）玩法模板/寻找物品（滑动）控制组件 ScrollFindItemsManagerView";
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
