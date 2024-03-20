var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var ps;
(function (ps) {
    var DishesEvent;
    (function (DishesEvent) {
        /**
         * 选择该菜品
         *
         * 事件负载为所设置的菜品编号{@link ps.SelectDishesPayload}
         */
        DishesEvent[DishesEvent["SELECT_DISHES"] = 0] = "SELECT_DISHES";
    })(DishesEvent = ps.DishesEvent || (ps.DishesEvent = {}));
    var DispatchType;
    (function (DispatchType) {
        DispatchType[DispatchType["ON_CLICK"] = 0] = "ON_CLICK";
        DispatchType[DispatchType["ON_DOWN"] = 1] = "ON_DOWN";
    })(DispatchType = ps.DispatchType || (ps.DispatchType = {}));
    /**
     * 菜品事件触发
     * @description 点击指定节点触发菜品事件
     */
    var DishesEventDispatcher = /** @class */ (function (_super) {
        __extends(DishesEventDispatcher, _super);
        function DishesEventDispatcher(gameObject) {
            var _this = _super.call(this, gameObject) || this;
            _this.Event = new ps.EventDispatcher();
            _this.serializableFields = {
                dishesNode: qc.Serializer.NODE,
                dishesId: qc.Serializer.NUMBER,
                dispatchType: qc.Serializer.NUMBER,
            };
            /** 菜品编号 */
            _this.dishesId = 0;
            /** 触发方式 */
            _this.dispatchType = DispatchType.ON_CLICK;
            _this.handleDispatch = function () {
                _this.Event.dispatch(DishesEvent.SELECT_DISHES, {
                    id: _this.dishesId,
                });
            };
            return _this;
        }
        DishesEventDispatcher.prototype.createGui = function () {
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
        };
        DishesEventDispatcher.prototype.awake = function () {
            var _a, _b;
            if (!this.dishesNode) {
                console.warn("DishesEventDispatcher组件没有关联相关菜品节点");
            }
            switch (this.dispatchType) {
                case DispatchType.ON_DOWN:
                    {
                        (_a = this.dishesNode) === null || _a === void 0 ? void 0 : _a.onDown.add(this.handleDispatch);
                    }
                    break;
                case DispatchType.ON_CLICK:
                    {
                        (_b = this.dishesNode) === null || _b === void 0 ? void 0 : _b.onClick.add(this.handleDispatch);
                    }
                    break;
            }
        };
        DishesEventDispatcher.prototype.onDestroy = function () {
            var _a, _b;
            switch (this.dispatchType) {
                case DispatchType.ON_DOWN:
                    {
                        (_a = this.dishesNode) === null || _a === void 0 ? void 0 : _a.onDown.remove(this.handleDispatch);
                    }
                    break;
                case DispatchType.ON_CLICK:
                    {
                        (_b = this.dishesNode) === null || _b === void 0 ? void 0 : _b.onClick.remove(this.handleDispatch);
                    }
                    break;
            }
        };
        return DishesEventDispatcher;
    }(ps.Behaviour));
    ps.DishesEventDispatcher = DishesEventDispatcher;
    qc.registerBehaviour("ps.DishesEventDispatcher", DishesEventDispatcher);
    DishesEventDispatcher["__menu"] =
        "玩法模板/厨房玩法/厨房玩法目标（DishesEventDispatcher）";
})(ps || (ps = {}));
//# sourceMappingURL=DishesEventDispatcher.js.map