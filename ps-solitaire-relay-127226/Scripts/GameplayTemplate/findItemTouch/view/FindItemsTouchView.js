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
     * 所有目标（区域）物品（触控）
     * @description 所有目标（区域）物品（触控）
     * @author bin
     * @date 2022/12/29 11:44:31
     */
    var FindItemsTouchView = /** @class */ (function (_super) {
        __extends(FindItemsTouchView, _super);
        function FindItemsTouchView(gameObject) {
            var _this = _super.call(this, gameObject) || this;
            _this.findItems = new Set();
            /** 事件相关 */
            _this.event = new ps.EventDispatcher();
            _this._addFindItemEvented = false;
            _this._addOptionAreaEvented = false;
            /** 序列化 */
            _this.serializableFields = {
                _nodeOptionArea: qc.Serializer.NODE,
                _allNodeFindItem: qc.Serializer.NODES,
            };
            return _this;
        }
        Object.defineProperty(FindItemsTouchView.prototype, "nodeOptionArea", {
            get: function () {
                return this._nodeOptionArea;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(FindItemsTouchView.prototype, "allNodeFindItem", {
            get: function () {
                return this._allNodeFindItem;
            },
            enumerable: false,
            configurable: true
        });
        FindItemsTouchView.prototype.createGui = function () {
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
        };
        /** 试玩初始化的处理 */
        FindItemsTouchView.prototype.onInit = function () {
            // console.info("[info] FindItemsTouchView.onInit");
            this.addAllEvent();
        };
        FindItemsTouchView.prototype.addAllEvent = function () {
            this.addOptionAreaEvent();
            this.addFindItemEvent();
        };
        FindItemsTouchView.prototype.removeAllEvent = function () {
            this.removeOptionAreaEvent();
            this.removeFindItemEvent();
        };
        FindItemsTouchView.prototype._onDown = function (target, e) {
            this.event.dispatch(ps.FindItemTouchEvent.onDown, target, e);
        };
        FindItemsTouchView.prototype._onUp = function (target, e) {
            this.event.dispatch(ps.FindItemTouchEvent.onUp, target, e);
        };
        FindItemsTouchView.prototype._onClick = function (target, e) {
            this.event.dispatch(ps.FindItemTouchEvent.onClick, target, e);
        };
        FindItemsTouchView.prototype.onCorrectTarget = function (target, e) {
            this.event.dispatch(ps.FindItemTouchEvent.CorrectTarget, target, e);
        };
        FindItemsTouchView.prototype.onErrorTarget = function (target, e) {
            this.event.dispatch(ps.FindItemTouchEvent.ErrorTarget, target, e);
        };
        FindItemsTouchView.prototype.addOptionAreaEvent = function () {
            if (this._addOptionAreaEvented) {
                return;
            }
            if (this._nodeOptionArea) {
                var findItem = this._nodeOptionArea.getScript(ps.FindItemTouchView);
                findItem.addEvent();
                findItem.event.add(ps.FindItemTouchEvent.onDown, this._onDown, this);
                findItem.event.add(ps.FindItemTouchEvent.onUp, this._onUp, this);
                findItem.event.add(ps.FindItemTouchEvent.onClick, this._onClick, this);
                findItem.event.add(ps.FindItemTouchEvent.ErrorTarget, this.onErrorTarget, this);
                this.findItems.add(findItem);
            }
            this._addOptionAreaEvented = true;
        };
        FindItemsTouchView.prototype.removeOptionAreaEvent = function () {
            if (!this._addOptionAreaEvented) {
                return;
            }
            if (this._nodeOptionArea) {
                var findItem = this._nodeOptionArea.getScript(ps.FindItemTouchView);
                findItem.removeEvent();
                findItem.event.remove(ps.FindItemTouchEvent.onDown, this._onDown, this);
                findItem.event.remove(ps.FindItemTouchEvent.onUp, this._onUp, this);
                findItem.event.remove(ps.FindItemTouchEvent.onClick, this._onClick, this);
                findItem.event.remove(ps.FindItemTouchEvent.ErrorTarget, this.onErrorTarget, this);
                this.findItems.delete(findItem);
            }
            this._addOptionAreaEvented = false;
        };
        FindItemsTouchView.prototype.addFindItemEvent = function () {
            var _this = this;
            if (this._addFindItemEvented) {
                return;
            }
            this._allNodeFindItem.forEach(function (node) {
                var findItem = node === null || node === void 0 ? void 0 : node.getScript(ps.FindItemTouchView);
                if (!findItem) {
                    return;
                }
                findItem.addEvent();
                findItem.event.add(ps.FindItemTouchEvent.onDown, _this._onDown, _this);
                findItem.event.add(ps.FindItemTouchEvent.onUp, _this._onUp, _this);
                findItem.event.add(ps.FindItemTouchEvent.onClick, _this._onClick, _this);
                findItem.event.add(ps.FindItemTouchEvent.CorrectTarget, _this.onCorrectTarget, _this);
                _this.findItems.add(findItem);
            });
            this._addFindItemEvented = true;
        };
        FindItemsTouchView.prototype.removeFindItemEvent = function () {
            var _this = this;
            if (!this._addFindItemEvented) {
                return;
            }
            this._allNodeFindItem.forEach(function (node) {
                var findItem = node === null || node === void 0 ? void 0 : node.getScript(ps.FindItemTouchView);
                if (!findItem) {
                    return;
                }
                findItem.removeEvent();
                findItem.event.remove(ps.FindItemTouchEvent.onDown, _this._onDown, _this);
                findItem.event.remove(ps.FindItemTouchEvent.onUp, _this._onUp, _this);
                findItem.event.remove(ps.FindItemTouchEvent.onClick, _this._onClick, _this);
                findItem.event.remove(ps.FindItemTouchEvent.CorrectTarget, _this.onCorrectTarget, _this);
                _this.findItems.delete(findItem);
            });
            this._addFindItemEvented = false;
        };
        /** 当脚本被移除时，会自动调用 */
        FindItemsTouchView.prototype.onDestroy = function () {
            // console.info("[info] FindItemsTouchView.onDestroy");
        };
        return FindItemsTouchView;
    }(ps.Behaviour));
    ps.FindItemsTouchView = FindItemsTouchView;
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
})(ps || (ps = {}));
//# sourceMappingURL=FindItemsTouchView.js.map