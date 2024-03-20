namespace ps {
    /**
     * 所有目标（区域）物品（触控）
     * @description 所有目标（区域）物品（触控）
     * @author bin
     * @date 2022/12/29 11:44:31
     */
    export class FindItemsTouchView extends Behaviour {
        /** 寻找物品（触控）可操作区域节点 */
        private _nodeOptionArea: qc.Node;
        public get nodeOptionArea(): qc.Node {
            return this._nodeOptionArea;
        }
        /** 所有目标物品（触控） */
        private _allNodeFindItem: qc.Node[];
        public get allNodeFindItem(): qc.Node[] {
            return this._allNodeFindItem;
        }

        private findItems: Set<FindItemTouchView> = new Set();
        /** 事件相关 */
        public event: EventDispatcher = new EventDispatcher();

        private _addFindItemEvented = false;
        private _addOptionAreaEvented = false;

        constructor(gameObject: qc.Node) {
            super(gameObject);
        }

        /** 序列化 */
        private serializableFields = {
            _nodeOptionArea: qc.Serializer.NODE,
            _allNodeFindItem: qc.Serializer.NODES,
        };

        public createGui(): GuiType {
            return {
                _nodeOptionArea: {
                    title: "寻找物品（触控）可操作区域节点",
                    component: "node",
                },
                _allNodeFindItem: {
                    title: "所有目标物品（触控）",
                    component: "nodes",
                },
            };
        }

        /** 试玩初始化的处理 */
        public onInit() {
            // console.info("[info] FindItemsTouchView.onInit");
            this.addAllEvent();
        }

        public addAllEvent() {
            this.addOptionAreaEvent();
            this.addFindItemEvent();
        }

        public removeAllEvent() {
            this.removeOptionAreaEvent();
            this.removeFindItemEvent();
        }

        private _onDown(target: qc.Node, e: qc.PointerEvent): void {
            this.event.dispatch(FindItemTouchEvent.onDown, target, e);
        }

        private _onUp(target: qc.Node, e: qc.PointerEvent): void {
            this.event.dispatch(FindItemTouchEvent.onUp, target, e);
        }

        private _onClick(target: qc.Node, e: qc.ClickEvent): void {
            this.event.dispatch(FindItemTouchEvent.onClick, target, e);
        }

        private onCorrectTarget(target: qc.Node, e: qc.PointerEvent | qc.ClickEvent): void {
            this.event.dispatch(FindItemTouchEvent.CorrectTarget, target, e);
        }

        private onErrorTarget(target: qc.Node, e: qc.PointerEvent | qc.ClickEvent): void {
            this.event.dispatch(FindItemTouchEvent.ErrorTarget, target, e);
        }

        private addOptionAreaEvent() {
            if (this._addOptionAreaEvented) {
                return;
            }
            if (this._nodeOptionArea) {
                const findItem = this._nodeOptionArea.getScript(FindItemTouchView) as FindItemTouchView;
                findItem.addEvent();
                findItem.event.add(FindItemTouchEvent.onDown, this._onDown, this);
                findItem.event.add(FindItemTouchEvent.onUp, this._onUp, this);
                findItem.event.add(FindItemTouchEvent.onClick, this._onClick, this);
                findItem.event.add(FindItemTouchEvent.ErrorTarget, this.onErrorTarget, this);
                this.findItems.add(findItem);
            }
            this._addOptionAreaEvented = true;
        }

        private removeOptionAreaEvent() {
            if (!this._addOptionAreaEvented) {
                return;
            }
            if (this._nodeOptionArea) {
                const findItem = this._nodeOptionArea.getScript(FindItemTouchView) as FindItemTouchView;
                findItem.removeEvent();
                findItem.event.remove(FindItemTouchEvent.onDown, this._onDown, this);
                findItem.event.remove(FindItemTouchEvent.onUp, this._onUp, this);
                findItem.event.remove(FindItemTouchEvent.onClick, this._onClick, this);
                findItem.event.remove(FindItemTouchEvent.ErrorTarget, this.onErrorTarget, this);
                this.findItems.delete(findItem);
            }
            this._addOptionAreaEvented = false;
        }

        private addFindItemEvent() {
            if (this._addFindItemEvented) {
                return;
            }
            this._allNodeFindItem.forEach(node => {
                const findItem = node?.getScript(FindItemTouchView) as FindItemTouchView;
                if (!findItem) {
                    return;
                }
                findItem.addEvent();
                findItem.event.add(FindItemTouchEvent.onDown, this._onDown, this);
                findItem.event.add(FindItemTouchEvent.onUp, this._onUp, this);
                findItem.event.add(FindItemTouchEvent.onClick, this._onClick, this);
                findItem.event.add(FindItemTouchEvent.CorrectTarget, this.onCorrectTarget, this);
                this.findItems.add(findItem);
            });
            this._addFindItemEvented = true;
        }

        private removeFindItemEvent() {
            if (!this._addFindItemEvented) {
                return;
            }
            this._allNodeFindItem.forEach(node => {
                const findItem = node?.getScript(FindItemTouchView) as FindItemTouchView;
                if (!findItem) {
                    return;
                }
                findItem.removeEvent();
                findItem.event.remove(FindItemTouchEvent.onDown, this._onDown, this);
                findItem.event.remove(FindItemTouchEvent.onUp, this._onUp, this);
                findItem.event.remove(FindItemTouchEvent.onClick, this._onClick, this);
                findItem.event.remove(FindItemTouchEvent.CorrectTarget, this.onCorrectTarget, this);
                this.findItems.delete(findItem);
            });
            this._addFindItemEvented = false;
        }

        /** 当脚本被移除时，会自动调用 */
        public onDestroy() {
            // console.info("[info] FindItemsTouchView.onDestroy");
        }
    }
    qc.registerBehaviour("ps.FindItemsTouchView", FindItemsTouchView);
    FindItemsTouchView["__menu"] = "玩法模板/寻找物品（触控）玩法/所有目标（区域）物品（触控）（FindItemsTouchView）";
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