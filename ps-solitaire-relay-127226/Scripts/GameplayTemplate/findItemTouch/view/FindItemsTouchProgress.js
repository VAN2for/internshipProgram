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
    /** 目标物品（触控）进度监控事件类型 */
    var FindItemsTouchProgressEvent;
    (function (FindItemsTouchProgressEvent) {
        /** 当前值变更 */
        FindItemsTouchProgressEvent["onChange"] = "onChange";
        /** 目标完成 */
        FindItemsTouchProgressEvent["onComplete"] = "onComplete";
    })(FindItemsTouchProgressEvent = ps.FindItemsTouchProgressEvent || (ps.FindItemsTouchProgressEvent = {}));
    /**
     * 目标物品（触控）进度监控
     * @description 目标物品（触控）进度监控，监控触控到目标（区域）节点的次数，到达目标时触发事件
     * @author bin
     * @date 2023/03/28 17:07:34
     */
    var FindItemsTouchProgress = /** @class */ (function (_super) {
        __extends(FindItemsTouchProgress, _super);
        function FindItemsTouchProgress(gameObject) {
            var _this = _super.call(this, gameObject) || this;
            _this.gameObject = gameObject;
            /** 当前值 */
            _this._value = 0;
            /** 最大目标值 */
            _this._maxValue = 1;
            /** 监听类型 */
            _this._listenerType = ps.FindItemTouchEvent.CorrectTarget;
            /** 目标显示风格 */
            _this._showStyle = "{0}/{1}";
            /** 事件相关 */
            _this.event = new ps.EventDispatcher();
            /** 序列化 */
            _this.serializableFields = {
                value: qc.Serializer.INT,
                maxValue: qc.Serializer.INT,
                _listenerNode: qc.Serializer.NODE,
                _listenerType: qc.Serializer.STRING,
                showStyle: qc.Serializer.STRING,
                _customEventOnChange: qc.Serializer.CUSTOMEVENT,
                _customEventOnComplete: qc.Serializer.CUSTOMEVENT,
            };
            return _this;
        }
        Object.defineProperty(FindItemsTouchProgress.prototype, "value", {
            get: function () {
                return this._value;
            },
            set: function (value) {
                if (value === this._value) {
                    return;
                }
                this._value = Math.min(value, this._maxValue);
                this.renderText();
                this.event.dispatch(FindItemsTouchProgressEvent.onChange, this);
                if (this._customEventOnChange) {
                    ps.triggerCustomEventByCustomEventField(this._customEventOnChange);
                }
                if (this.isComplete) {
                    this.event.dispatch(FindItemsTouchProgressEvent.onComplete, this);
                    if (this._customEventOnComplete) {
                        ps.triggerCustomEventByCustomEventField(this._customEventOnComplete);
                    }
                }
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(FindItemsTouchProgress.prototype, "maxValue", {
            get: function () {
                return this._maxValue;
            },
            set: function (value) {
                if (value === this.maxValue) {
                    return;
                }
                this._maxValue = value;
                this.renderText();
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(FindItemsTouchProgress.prototype, "showStyle", {
            get: function () {
                return this._showStyle;
            },
            set: function (value) {
                if (value === this._showStyle) {
                    return;
                }
                this._showStyle = value;
                this.renderText();
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(FindItemsTouchProgress.prototype, "isComplete", {
            get: function () {
                return this._value >= this._maxValue;
            },
            enumerable: false,
            configurable: true
        });
        FindItemsTouchProgress.prototype.createGui = function () {
            return {
                value: {
                    title: "当前值",
                    component: "int",
                    field: {
                        min: 0,
                    }
                },
                maxValue: {
                    title: "最大目标值",
                    component: "int",
                    field: {
                        min: 1,
                    }
                },
                _listenerNode: {
                    title: "监听节点",
                },
                _listenerType: {
                    title: "监听类型",
                    component: "select",
                    field: {
                        options: [
                            {
                                value: ps.FindItemTouchEvent.onDown,
                                label: "触控按下",
                            },
                            {
                                value: ps.FindItemTouchEvent.onUp,
                                label: "触控抬起",
                            },
                            {
                                value: ps.FindItemTouchEvent.onClick,
                                label: "点击",
                            },
                            {
                                value: ps.FindItemTouchEvent.CorrectTarget,
                                label: "触控到正确目标",
                            },
                            {
                                value: ps.FindItemTouchEvent.ErrorTarget,
                                label: "触控到错误目标（区域）",
                            },
                        ]
                    }
                },
                showStyle: {
                    title: "目标显示风格",
                    component: "select",
                    field: {
                        options: [
                            {
                                value: "{0}/{1}",
                                label: "当前值/最大目标值",
                            },
                            {
                                value: "{0}-{1}",
                                label: "当前值-最大目标值",
                            },
                            {
                                value: "{0}:{1}",
                                label: "当前值:最大目标值",
                            },
                            {
                                value: "{0} / {1}",
                                label: "当前值 / 最大目标值",
                            },
                            {
                                value: "{0} - {1}",
                                label: "当前值 - 最大目标值",
                            },
                            {
                                value: "{0} : {1}",
                                label: "当前值 : 最大目标值",
                            },
                        ]
                    },
                },
                _customEventOnChange: {
                    title: "当前值变更事件",
                },
                _customEventOnComplete: {
                    title: "目标完成事件",
                },
            };
        };
        /** 试玩初始化的处理 */
        FindItemsTouchProgress.prototype.onInit = function () {
            var script;
            script = this._listenerNode.getScript(ps.FindItemsTouchView);
            if (!script) {
                script = this._listenerNode.getScript(ps.FindItemTouchView);
            }
            script.event.add(this._listenerType, this.onTrigger, this);
        };
        FindItemsTouchProgress.prototype.onTrigger = function (param) {
            if (!param.isRelation) {
                this.value++;
            }
        };
        FindItemsTouchProgress.prototype.renderText = function () {
            this.gameObject.text = String.format(this._showStyle, this._value, this._maxValue);
        };
        /** 当脚本被移除时，会自动调用 */
        FindItemsTouchProgress.prototype.onDestroy = function () {
            // console.info("[info] FindItemsTouchProgress.onDestroy");
        };
        return FindItemsTouchProgress;
    }(ps.Behaviour));
    ps.FindItemsTouchProgress = FindItemsTouchProgress;
    qc.registerBehaviour("ps.FindItemsTouchProgress", FindItemsTouchProgress);
    FindItemsTouchProgress["__menu"] = "玩法模板/寻找物品（触控）玩法/目标物品（触控）进度（FindItemsTouchProgress）";
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
})(ps || (ps = {}));
//# sourceMappingURL=FindItemsTouchProgress.js.map