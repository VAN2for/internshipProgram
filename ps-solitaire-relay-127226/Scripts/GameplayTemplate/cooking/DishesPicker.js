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
    var DishesPickerEvent;
    (function (DishesPickerEvent) {
        /**
         * 提交所选菜品
         *
         * 事件负载为当前选择是否正确{@link ps.SubmitPayload}
         */
        DishesPickerEvent["SUBMIT"] = "submit";
        /**
         * 添加菜品
         *
         * 事件负载为当前选择正确情况、菜品编号和最终添加菜品的空位编号{@link ps.AddItemPayload}
         */
        DishesPickerEvent["ADD_ITEM"] = "add-item";
        /**
         * 没有位置添加菜品
         *
         * 事件负载为尝试添加的菜品编号{@link ps.SlotFullPayload}
         */
        DishesPickerEvent["SLOT_FULL"] = "slot-full";
        /** 移除所有所选菜品 */
        DishesPickerEvent["CLEAR_ITEMS"] = "clear-items";
        /**
         * 设置新菜品规则
         *
         * 事件负载为当前规则{@link ps.SetRulesPayload}
         */
        DishesPickerEvent["SET_RULES"] = "set-rules";
        /** 启用提交按钮 */
        DishesPickerEvent["SHOULD_ENABLE_SUBMIT_BUTTON"] = "should-enable-submit-button";
        /** 禁用提交按钮 */
        DishesPickerEvent["SHOULD_DISABLE_SUBMIT_BUTTON"] = "should-enable-cancel-button";
        /** 启用取消按钮 */
        DishesPickerEvent["SHOULD_ENABLE_CANCEL_BUTTON"] = "should-disable-submit-button";
        /** 禁用取消按钮 */
        DishesPickerEvent["SHOULD_DISABLE_CANCEL_BUTTON"] = "should-disable-cancel-button";
    })(DishesPickerEvent = ps.DishesPickerEvent || (ps.DishesPickerEvent = {}));
    /**
     * DishesPicker
     * @description 处理菜品选择
     */
    var DishesPicker = /** @class */ (function (_super) {
        __extends(DishesPicker, _super);
        function DishesPicker(gameObject) {
            var _this = _super.call(this, gameObject) || this;
            _this.serializableFields = {
                dishes: qc.Serializer.NODES,
            };
            /** 监听菜品事件触发的节点 */
            _this.dishes = [];
            _this.Event = new ps.EventDispatcher();
            _this.handleClickDishes = function (ev) {
                var id = ev.id;
                var _a = _this.choiceValidator.choose(id), slotIdx = _a.choiceIdx, isFull = _a.isFull;
                if (isFull) {
                    _this.Event.dispatch(DishesPickerEvent.SLOT_FULL, {
                        id: id,
                    });
                    return;
                }
                var _b = _this.choiceValidator.currentStatus, isCorrect = _b.isCorrect, partialCorrect = _b.partialCorrect;
                _this.Event.dispatch(DishesPickerEvent.ADD_ITEM, {
                    isCorrect: isCorrect,
                    partialCorrect: partialCorrect,
                    id: id,
                    slotIdx: slotIdx,
                });
                _this.updateButtons();
            };
            return _this;
        }
        DishesPicker.prototype.createGui = function () {
            return {
                dishes: {
                    title: "菜品",
                    component: "nodes",
                },
            };
        };
        DishesPicker.prototype.awake = function () {
            var _this = this;
            this.choiceValidator =
                this.gameObject.addScript("ps.ChoiceValidator");
            var n = this.dishes.length;
            for (var i = 0; i < n; i++) {
                var dishes = this.dishes[i];
                var dishesScript = dishes.getScript("ps.DishesEventDispatcher");
                dishesScript.Event.add(ps.DishesEvent.SELECT_DISHES, function (ev) { return _this.handleClickDishes(ev); });
            }
        };
        DishesPicker.prototype.onDestroy = function () {
            var _a;
            (_a = this.choiceValidator) === null || _a === void 0 ? void 0 : _a.destroy();
        };
        /**
         * 设置菜品摆放位置规则
         *
         * 数组长度会认为是菜板空位数量
         *
         * ```text
         * No.0 No.1 No.2 No.3  No.4
         * [  5,   3,   1,   0,   2]
         * ```
         *
         * @param request 客人需求，菜品编号（从`0`开始的整数）在菜板上的位置
         * @emits `DishesPickerEvent.SET_RULES` 事件负载为当前规则{@link ps.SetRulesPayload}
         */
        DishesPicker.prototype.setRules = function (request) {
            if (request.length === 0) {
                console.warn("客人需求为空");
            }
            this.choiceValidator.answer = request;
            this.updateButtons();
            this.Event.dispatch(DishesPickerEvent.SET_RULES, { request: request });
        };
        /**
         * 清空当前选择
         * @emits `DishesPickerEvent.CLEAR_ITEMS`
         */
        DishesPicker.prototype.clearChoices = function () {
            this.choiceValidator.clearChoices();
            this.updateButtons();
            this.Event.dispatch(DishesPickerEvent.CLEAR_ITEMS);
        };
        /**
         * 提示规则中下一个菜品编号
         *
         * 如果没有下一个菜品，则返回`-1`
         */
        DishesPicker.prototype.getNextDishes = function () {
            return this.choiceValidator.nextAnswer;
        };
        /**
         * 提交并检查选择菜品
         *
         * @emits `DishesPickerEvent.SUBMIT` 事件负载为当前选择是否正确{@link ps.SubmitPayload}
         */
        DishesPicker.prototype.submit = function () {
            var _a = this.choiceValidator.currentStatus, isCorrect = _a.isCorrect, partialCorrect = _a.partialCorrect;
            this.disableButtons();
            this.Event.dispatch(DishesPickerEvent.SUBMIT, {
                isCorrect: isCorrect && !partialCorrect,
            });
        };
        DishesPicker.prototype.updateButtons = function () {
            if (this.choiceValidator.chosenSize === 0) {
                this.Event.dispatch(DishesPickerEvent.SHOULD_DISABLE_SUBMIT_BUTTON);
                this.Event.dispatch(DishesPickerEvent.SHOULD_DISABLE_CANCEL_BUTTON);
            }
            else {
                this.Event.dispatch(DishesPickerEvent.SHOULD_ENABLE_SUBMIT_BUTTON);
                this.Event.dispatch(DishesPickerEvent.SHOULD_ENABLE_CANCEL_BUTTON);
            }
        };
        DishesPicker.prototype.disableButtons = function () {
            this.Event.dispatch(DishesPickerEvent.SHOULD_DISABLE_SUBMIT_BUTTON);
            this.Event.dispatch(DishesPickerEvent.SHOULD_DISABLE_CANCEL_BUTTON);
        };
        return DishesPicker;
    }(ps.Behaviour));
    ps.DishesPicker = DishesPicker;
    qc.registerBehaviour("ps.DishesPicker", DishesPicker);
    DishesPicker["__menu"] = "玩法模板/厨房玩法/厨房玩法（DishesPicker）";
})(ps || (ps = {}));
//# sourceMappingURL=DishesPicker.js.map