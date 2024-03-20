namespace ps {
    export enum DishesEvent {
        /**
         * 选择该菜品
         *
         * 事件负载为所设置的菜品编号{@link ps.SelectDishesPayload}
         */
        SELECT_DISHES,
    }

    export type SelectDishesPayload = {
        id: number;
    };

    export enum DispatchType {
        ON_CLICK = 0,
        ON_DOWN = 1,
    }
    /**
     * 菜品事件触发
     * @description 点击指定节点触发菜品事件
     */
    export class DishesEventDispatcher extends Behaviour {
        Event = new ps.EventDispatcher();

        constructor(gameObject: qc.Node) {
            super(gameObject);
        }

        private serializableFields: unknown = {
            dishesNode: qc.Serializer.NODE,
            dishesId: qc.Serializer.NUMBER,
            dispatchType: qc.Serializer.NUMBER,
        };
        public createGui(): GuiType {
            return {
                dispatchType: {
                    title: "触发方式",
                    component: "select",
                    field: {
                        // 配置下拉列表选项
                        options: [
                            {
                                value: DispatchType.ON_CLICK,
                                label: "点击时",
                            },
                            {
                                value: DispatchType.ON_DOWN,
                                label: "按下时",
                            },
                        ],
                    },
                },
                dishesNode: {
                    title: "触发事件节点",
                    component: "node",
                },
                dishesId: {
                    title: "菜品编号",
                    component: "input",
                    field: {
                        type: "number",
                    },
                },
            };
        }
        /** 触发事件节点 */
        public readonly dishesNode: qc.Node;
        /** 菜品编号 */
        public readonly dishesId: number = 0;
        /** 触发方式 */
        public readonly dispatchType: DispatchType = DispatchType.ON_CLICK;

        public awake() {
            if (!this.dishesNode) {
                console.warn("DishesEventDispatcher组件没有关联相关菜品节点");
            }

            switch (this.dispatchType) {
                case DispatchType.ON_DOWN:
                    {
                        this.dishesNode?.onDown.add(this.handleDispatch);
                    }
                    break;
                case DispatchType.ON_CLICK:
                    {
                        this.dishesNode?.onClick.add(this.handleDispatch);
                    }
                    break;
            }
        }

        public onDestroy() {
            switch (this.dispatchType) {
                case DispatchType.ON_DOWN:
                    {
                        this.dishesNode?.onDown.remove(this.handleDispatch);
                    }
                    break;
                case DispatchType.ON_CLICK:
                    {
                        this.dishesNode?.onClick.remove(this.handleDispatch);
                    }
                    break;
            }
        }

        private handleDispatch = () => {
            this.Event.dispatch(DishesEvent.SELECT_DISHES, {
                id: this.dishesId,
            });
        };
    }
    qc.registerBehaviour("ps.DishesEventDispatcher", DishesEventDispatcher);
    DishesEventDispatcher["__menu"] =
        "玩法模板/厨房玩法/厨房玩法目标（DishesEventDispatcher）";
}
