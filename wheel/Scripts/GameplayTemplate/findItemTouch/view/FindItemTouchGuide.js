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
    /**
     * 目标物品（触控）指引
     * @description 目标物品（触控）指引
     * @author bin
     * @date 2023/04/03 11:08:23
     */
    var FindItemTouchGuide = /** @class */ (function (_super) {
        __extends(FindItemTouchGuide, _super);
        function FindItemTouchGuide(gameObject) {
            var _this = _super.call(this, gameObject) || this;
            _this.gameObject = gameObject;
            /** 是否自动开始 */
            _this._isAutoStart = true;
            /** 首次显示延迟（秒） */
            _this._firstDelay = 0;
            /**
             * 是否多次显示指引
             * @description 关闭时不再触发后续指引
             */
            _this._isShowReplay = true;
            /**
             * 后续显示延迟（秒）
             * @description 一般用于设定无操作延迟
             */
            _this._laterDelay = 3;
            _this._isFirstShow = true;
            _this._hasInit = false;
            /** 序列化 */
            _this.serializableFields = {
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
            return _this;
        }
        Object.defineProperty(FindItemTouchGuide.prototype, "isShowReplay", {
            get: function () {
                return this._isShowReplay;
            },
            set: function (value) {
                this._isShowReplay = value;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(FindItemTouchGuide.prototype, "laterDelay", {
            get: function () {
                return this._laterDelay;
            },
            set: function (value) {
                this._laterDelay = value;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(FindItemTouchGuide.prototype, "targetNodes", {
            get: function () {
                return this._targetNodes;
            },
            set: function (value) {
                this._targetNodes = value;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(FindItemTouchGuide.prototype, "isShow", {
            get: function () {
                return this._isShow;
            },
            set: function (value) {
                if (value === this._isShow) {
                    return;
                }
                this._isShow = value;
                this.onShow();
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(FindItemTouchGuide.prototype, "currTarget", {
            get: function () {
                return this._currTarget;
            },
            enumerable: false,
            configurable: true
        });
        FindItemTouchGuide.prototype.createGui = function () {
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
        };
        /** 组件被激活后执行 */
        FindItemTouchGuide.prototype.awake = function () {
            var _a, _b;
            // console.info("[info] FindItemTouchGuide.awake");
            if (!((_a = this._targetNodes) === null || _a === void 0 ? void 0 : _a.length)) {
                var findItemsScript = this._findItems.getScript(ps.FindItemsTouchView);
                this._targetNodes = (_b = findItemsScript === null || findItemsScript === void 0 ? void 0 : findItemsScript.allNodeFindItem) === null || _b === void 0 ? void 0 : _b.concat();
            }
            ps.Tools.ignoreLayoutPropsDeep(this.gameObject, [
                { prop: "x" },
                { prop: "y" },
            ]);
        };
        /** 试玩初始化的处理 */
        FindItemTouchGuide.prototype.onInit = function () {
            var _a;
            // console.info("[info] FindItemTouchGuide.onInit");
            this.isShow = this._isAutoStart && !!((_a = this._targetNodes) === null || _a === void 0 ? void 0 : _a.length);
            this._hasInit = true;
        };
        /** 试玩开始时的处理 */
        FindItemTouchGuide.prototype.onStart = function () {
            // console.info("[info] FindItemTouchGuide.onStart");
        };
        FindItemTouchGuide.prototype.findTarget = function () {
            for (var i = 0; i < this._targetNodes.length;) {
                var element = this._targetNodes[i];
                if (!(element === null || element === void 0 ? void 0 : element.parent)) {
                    this._targetNodes.splice(i, 1);
                    continue;
                }
                else {
                    var script = element.getScript(ps.FindItemTouchView);
                    if (script === null || script === void 0 ? void 0 : script.isFinded) {
                        this._targetNodes.splice(i, 1);
                        continue;
                    }
                    else {
                        return this._targetNodes[i];
                    }
                }
            }
        };
        FindItemTouchGuide.prototype.onShow = function () {
            var _this = this;
            var _a;
            var isShow = this._isShow;
            // const autoAlpha = isShow ? 1 : 0;
            // const duration = !this._hasInit ? 0 : isShow ? .2 : .3;
            var delay = !isShow ? 0 : this._isFirstShow ? this._firstDelay : this._laterDelay;
            if (isShow) {
                if (!this._isFirstShow && !this._isShowReplay) {
                    return;
                }
            }
            else {
                gsap.killTweensOf(this.gameObject);
            }
            // this.gameObject.visible = true;
            (_a = this._delayedCall) === null || _a === void 0 ? void 0 : _a.kill();
            this._delayedCall = gsap.delayedCall(delay, function () {
                var _a;
                if (isShow) {
                    _this.updatePos();
                    if (!((_a = _this._targetNodes) === null || _a === void 0 ? void 0 : _a.length)) {
                        return;
                    }
                }
                // gsap.to(this.gameObject, { autoAlpha, duration });
                if (isShow) {
                    var customEventShow = _this._isFirstShow ? _this._customEventFirstShow : _this._customEventLaterShow;
                    if (customEventShow) {
                        ps.triggerCustomEventByCustomEventField(customEventShow);
                    }
                    _this._isFirstShow = false;
                }
                else {
                    if (_this._customEventHide) {
                        ps.triggerCustomEventByCustomEventField(_this._customEventHide);
                    }
                }
            });
        };
        FindItemTouchGuide.prototype.updatePos = function () {
            var target = this._currTarget = this.findTarget();
            if (!(target === null || target === void 0 ? void 0 : target.parent)) {
                return;
            }
            var _a = this.gameObject.parent.toLocal(target.getWorldPosition()), x = _a.x, y = _a.y;
            this.gameObject.x = x;
            this.gameObject.y = y;
        };
        /** 当脚本被移除时，会自动调用 */
        FindItemTouchGuide.prototype.onDestroy = function () {
            // console.info("[info] FindItemTouchGuide.onDestroy");
        };
        FindItemTouchGuide.prototype.onResize = function () {
            if (this._isShow) {
                this.updatePos();
            }
        };
        return FindItemTouchGuide;
    }(ps.Behaviour));
    ps.FindItemTouchGuide = FindItemTouchGuide;
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
})(ps || (ps = {}));
//# sourceMappingURL=FindItemTouchGuide.js.map