namespace ps {
    export enum DishesPickerEvent {
        /**
         * 提交所选菜品
         *
         * 事件负载为当前选择是否正确{@link ps.SubmitPayload}
         */
        SUBMIT = "submit",

        /**
         * 添加菜品
         *
         * 事件负载为当前选择正确情况、菜品编号和最终添加菜品的空位编号{@link ps.AddItemPayload}
         */
        ADD_ITEM = "add-item",

        /**
         * 没有位置添加菜品
         *
         * 事件负载为尝试添加的菜品编号{@link ps.SlotFullPayload}
         */
        SLOT_FULL = "slot-full",

        /** 移除所有所选菜品 */
        CLEAR_ITEMS = "clear-items",

        /**
         * 设置新菜品规则
         *
         * 事件负载为当前规则{@link ps.SetRulesPayload}
         */
        SET_RULES = "set-rules",

        /** 启用提交按钮 */
        SHOULD_ENABLE_SUBMIT_BUTTON = "should-enable-submit-button",

        /** 禁用提交按钮 */
        SHOULD_DISABLE_SUBMIT_BUTTON = "should-enable-cancel-button",

        /** 启用取消按钮 */
        SHOULD_ENABLE_CANCEL_BUTTON = "should-disable-submit-button",

        /** 禁用取消按钮 */
        SHOULD_DISABLE_CANCEL_BUTTON = "should-disable-cancel-button",
    }

    export type AddItemPayload = ChoiceCurrentStatus & {
        /** 菜品编号 */
        id: number;
        /** 最终添加菜品的空位编号 */
        slotIdx: number;
    };

    export type SubmitPayload = { isCorrect: boolean };

    export type SlotFullPayload = {
        /** 尝试添加的菜品编号 */
        id: number;
    };

    export type SetRulesPayload = {
        /** 当前规则 */
        request: number[];
    };

    /**
     * DishesPicker
     * @description 处理菜品选择
     */
    export class DishesPicker extends Behaviour {
        constructor(gameObject: qc.Node) {
            super(gameObject);
        }

        private serializableFields: unknown = {
            dishes: qc.Serializer.NODES,
        };
        public createGui(): GuiType {
            return {
                dishes: {
                    title: "菜品",
                    component: "nodes",
                },
            };
        }
        /** 监听菜品事件触发的节点 */
        private dishes: qc.Node[] = [];

        private choiceValidator: ChoiceValidator;
        public awake() {
            this.choiceValidator =
                this.gameObject.addScript("ps.ChoiceValidator");

            const n = this.dishes.length;
            for (let i = 0; i < n; i++) {
                const dishes = this.dishes[i];
                const dishesScript: DishesEventDispatcher = dishes.getScript(
                    "ps.DishesEventDispatcher"
                );
                dishesScript.Event.add(
                    DishesEvent.SELECT_DISHES,
                    (ev: { id: number }) => this.handleClickDishes(ev)
                );
            }
        }

        public onDestroy() {
            this.choiceValidator?.destroy();
        }

        public Event = new EventDispatcher();

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
        public setRules(request: number[]) {
            if (request.length === 0) {
                console.warn("客人需求为空");
            }

            this.choiceValidator.answer = request;
            this.updateButtons();

            this.Event.dispatch(DishesPickerEvent.SET_RULES, { request });
        }

        /**
         * 清空当前选择
         * @emits `DishesPickerEvent.CLEAR_ITEMS`
         */
        public clearChoices() {
            this.choiceValidator.clearChoices();
            this.updateButtons();

            this.Event.dispatch(DishesPickerEvent.CLEAR_ITEMS);
        }

        /**
         * 提示规则中下一个菜品编号
         *
         * 如果没有下一个菜品，则返回`-1`
         */
        public getNextDishes() {
            return this.choiceValidator.nextAnswer;
        }

        /**
         * 提交并检查选择菜品
         *
         * @emits `DishesPickerEvent.SUBMIT` 事件负载为当前选择是否正确{@link ps.SubmitPayload}
         */
        public submit() {
            const { isCorrect, partialCorrect } =
                this.choiceValidator.currentStatus;
            this.disableButtons();
            this.Event.dispatch(DishesPickerEvent.SUBMIT, {
                isCorrect: isCorrect && !partialCorrect,
            });
        }

        private handleClickDishes = (ev: { id: number }) => {
            const { id } = ev;
            const { choiceIdx: slotIdx, isFull } =
                this.choiceValidator.choose(id);
            if (isFull) {
                this.Event.dispatch(DishesPickerEvent.SLOT_FULL, {
                    id,
                });
                return;
            }

            const { isCorrect, partialCorrect } =
                this.choiceValidator.currentStatus;
            this.Event.dispatch(DishesPickerEvent.ADD_ITEM, {
                isCorrect,
                partialCorrect,

                id,
                slotIdx,
            });

            this.updateButtons();
        };

        private updateButtons() {
            if (this.choiceValidator.chosenSize === 0) {
                this.Event.dispatch(
                    DishesPickerEvent.SHOULD_DISABLE_SUBMIT_BUTTON
                );
                this.Event.dispatch(
                    DishesPickerEvent.SHOULD_DISABLE_CANCEL_BUTTON
                );
            } else {
                this.Event.dispatch(
                    DishesPickerEvent.SHOULD_ENABLE_SUBMIT_BUTTON
                );
                this.Event.dispatch(
                    DishesPickerEvent.SHOULD_ENABLE_CANCEL_BUTTON
                );
            }
        }

        private disableButtons() {
            this.Event.dispatch(DishesPickerEvent.SHOULD_DISABLE_SUBMIT_BUTTON);
            this.Event.dispatch(DishesPickerEvent.SHOULD_DISABLE_CANCEL_BUTTON);
        }
    }
    qc.registerBehaviour("ps.DishesPicker", DishesPicker);
    DishesPicker["__menu"] = "玩法模板/厨房玩法/厨房玩法（DishesPicker）";
}
