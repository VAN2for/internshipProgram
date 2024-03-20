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
    var ScrollFindItemEvent;
    (function (ScrollFindItemEvent) {
        ScrollFindItemEvent["onDown"] = "onDown";
        ScrollFindItemEvent["onUp"] = "onUp";
        ScrollFindItemEvent["onClick"] = "onClick";
        ScrollFindItemEvent["onDrag"] = "onDrag";
        ScrollFindItemEvent["onDragStart"] = "onDragStart";
        ScrollFindItemEvent["onDragEnd"] = "onDragEnd";
        ScrollFindItemEvent["ItemTouched"] = "ItemTouched";
        ScrollFindItemEvent["TargetItemTouched"] = "TargetItemTouched";
        ScrollFindItemEvent["OtherItemTouched"] = "OtherItemTouched";
    })(ScrollFindItemEvent = ps.ScrollFindItemEvent || (ps.ScrollFindItemEvent = {}));
    /**
     * 挂载在寻找目标上的组件
     * @description 挂载在寻找目标上的组件父类
     * @author QiaoSen.huang
     * @date 2023/01/03 15:32:39
     */
    var ScrollFindItemView = /** @class */ (function (_super) {
        __extends(ScrollFindItemView, _super);
        function ScrollFindItemView(gameObject) {
            var _this = _super.call(this, gameObject) || this;
            /** 是否手指按下触发，否则为点击 */
            _this._isDown = false;
            /** 触控到目标（区域）后的音效 */
            _this._soundName = "";
            /** 事件相关 */
            _this.event = new ps.EventDispatcher();
            /** 控制组件所在节点 */
            _this._isTouched = false;
            _this._isChangedTouched = false;
            /** 序列化 */
            _this.serializableFields = {
                _isDown: qc.Serializer.AUTO,
                _soundName: qc.Serializer.AUTO,
                _action: qc.Serializer.AUTO,
                _managerNode: qc.Serializer.NODE,
            };
            return _this;
        }
        Object.defineProperty(ScrollFindItemView.prototype, "isTouched", {
            get: function () {
                return this._isTouched;
            },
            set: function ($value) {
                if (this._isChangedTouched)
                    return;
                this._isTouched = $value;
                this._isChangedTouched = true;
            },
            enumerable: false,
            configurable: true
        });
        ScrollFindItemView.prototype.createGui = function () {
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
        };
        /** 组件被激活后执行 */
        ScrollFindItemView.prototype.awake = function () {
            this._manager = this._managerNode.getScript("ps.ScrollFindItemsManagerView");
            var event = this._manager.event;
            event.add(ps.ScrollFindItemAreaEvent.onDrag, this._onDrag, this);
            event.add(ps.ScrollFindItemAreaEvent.onDragStart, this._onDragStart, this);
            event.add(ps.ScrollFindItemAreaEvent.onDragEnd, this._onDragEnd, this);
            event.add(ps.ScrollFindItemAreaEvent.onDown, this._onDown, this);
            event.add(ps.ScrollFindItemAreaEvent.onUp, this._onUp, this);
            event.add(ps.ScrollFindItemAreaEvent.onClick, this._onClick, this);
            // console.info("[info] ScrollFindItemTargetTouchView.awake");
        };
        /** 试玩初始化的处理 */
        ScrollFindItemView.prototype.onInit = function () {
            // console.info("[info] ScrollFindItemTargetTouchView.onInit");
        };
        ScrollFindItemView.prototype._onDragStart = function (node, e) {
            // console.log("ddd", e)
            var point = new qc.Point(e.source.x, e.source.y);
            if (!this.checkIsTouch(point))
                return;
            this._onTouch(e);
            this.event.dispatch(ScrollFindItemEvent.onDragStart, this.gameObject, e);
        };
        ScrollFindItemView.prototype._onDrag = function (node, e) {
            // console.log("ddd", e)
            var point = new qc.Point(e.source.x, e.source.y);
            if (!this.checkIsTouch(point))
                return;
            this._onTouch(e);
            this.event.dispatch(ScrollFindItemEvent.onDrag, this.gameObject, e);
        };
        ScrollFindItemView.prototype._onDragEnd = function (node, e) {
            // console.log("ddd", e)
            var point = new qc.Point(e.source.x, e.source.y);
            if (!this.checkIsTouch(point))
                return;
            this._onTouch(e);
            this.event.dispatch(ScrollFindItemEvent.onDragEnd, this.gameObject, e);
        };
        ScrollFindItemView.prototype._onDown = function (node, e) {
            if (!this._isDown) {
                return;
            }
            var point = new qc.Point(e.source.x, e.source.y);
            if (!this.checkIsTouch(point))
                return;
            this._onTouch(e);
            this.event.dispatch(ScrollFindItemEvent.onDown, this.gameObject, e);
        };
        ScrollFindItemView.prototype._onClick = function (node, e) {
            if (this._isDown) {
                return;
            }
            var point = new qc.Point(e.source.x, e.source.y);
            if (!this.checkIsTouch(point))
                return;
            this._onTouch(e);
            this.event.dispatch(ScrollFindItemEvent.onClick, this.gameObject, e);
        };
        ScrollFindItemView.prototype._onUp = function (node, e) {
            var point = new qc.Point(e.source.x, e.source.y);
            if (!this.checkIsTouch(point))
                return;
            this._onTouch(e);
            this.event.dispatch(ScrollFindItemEvent.onUp, this.gameObject, e);
        };
        ScrollFindItemView.prototype.checkIsTouch = function (point) {
            return this.gameObject.rectContains(point);
        };
        ScrollFindItemView.prototype._onTouch = function (e) {
            if (this.isTouched)
                return;
            this.isTouched = true;
            // 音效处理
            if (this._soundName) {
                var nodeAudio = UIRoot.getChild(this._soundName);
                if (nodeAudio && (ps.AudioTrigger === null || ps.AudioTrigger === void 0 ? void 0 : ps.AudioTrigger.playSound)) {
                    ps.AudioTrigger.playSound(nodeAudio, true, false, 1);
                }
                else {
                    ps.Audio.playSound(this._soundName);
                }
            }
            // 埋点处理
            if (this._action) {
                ps.sendAction(this._action);
            }
            // 对外派发事件
            this.dispatchEvent(e);
        };
        ScrollFindItemView.prototype.dispatchEvent = function (e) {
            // 对外派发的事件，子类可以重新该方法，派发出不同的事件
            this.event.dispatch(ScrollFindItemEvent.ItemTouched, this.gameObject, e);
        };
        /** 试玩开始时的处理 */
        ScrollFindItemView.prototype.onStart = function () {
            // console.info("[info] ScrollFindItemTargetTouchView.onStart");
        };
        /** 当脚本被移除时，会自动调用 */
        ScrollFindItemView.prototype.onDestroy = function () {
            // console.info("[info] ScrollFindItemTargetTouchView.onDestroy");
        };
        return ScrollFindItemView;
    }(ps.Behaviour));
    ps.ScrollFindItemView = ScrollFindItemView;
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
})(ps || (ps = {}));
//# sourceMappingURL=ScrollFindItemView.js.map