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
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var ps;
(function (ps) {
    /**
     * 切水果底板
     * @description 切水果底板
     * @author weijia
     * @date 2023/02/02 15:59:09
     */
    var CutFruitArea;
    (function (CutFruitArea) {
        // 按下屏幕
        CutFruitArea[CutFruitArea["onDown"] = 0] = "onDown";
        // 拖拽
        CutFruitArea[CutFruitArea["onDrag"] = 1] = "onDrag";
        // 命中目标
        CutFruitArea[CutFruitArea["correctTarget"] = 2] = "correctTarget";
    })(CutFruitArea = ps.CutFruitArea || (ps.CutFruitArea = {}));
    var CutAreaView = /** @class */ (function (_super) {
        __extends(CutAreaView, _super);
        function CutAreaView(gameObject) {
            var _this = _super.call(this, gameObject) || this;
            _this.event = new ps.EventDispatcher();
            _this.itemList = [];
            /** 序列化 */
            _this.serializableFields = {
                _cutArea: qc.Serializer.AUTO,
                cutItems: qc.Serializer.NODES,
            };
            return _this;
        }
        CutAreaView.prototype.createGui = function () {
            return {
                cutItems: {
                    title: "剪切种类",
                    tail: "剪切种类的具体类别",
                    component: "nodes",
                },
                _cutArea: {
                    title: "切水果触控区域节点",
                    component: "node",
                },
            };
        };
        /** 组件被激活后执行 */
        CutAreaView.prototype.awake = function () {
            // console.info("[info] cutAreaView.awake");
        };
        /** 试玩初始化的处理 */
        CutAreaView.prototype.onInit = function () {
            var _this = this;
            // console.info("[info] cutAreaView.onInit");
            this._cutArea.onDown.add(function (node, event) {
                var e_1, _a;
                _this.event.dispatch(CutFruitArea.onDown, node, event);
                _this.itemList = [];
                for (var i = 0; i < _this.cutItems.length; i++) {
                    _this.itemList = _this.itemList.concat(_this._cutArea.getChildsByName(_this.cutItems[i].name));
                }
                try {
                    for (var _b = __values(_this.itemList), _c = _b.next(); !_c.done; _c = _b.next()) {
                        var node_1 = _c.value;
                        if (node_1.rectContains(event.source)) {
                            var nodeJS = node_1.getScript("ps.CutItem");
                            nodeJS && nodeJS.targetItemHandle(node_1, event);
                            _this.event.dispatch(CutFruitArea.correctTarget, node_1, event);
                        }
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
            });
            this._cutArea.onDrag.add(function (node, event) {
                var e_2, _a;
                _this.event.dispatch(CutFruitArea.onDrag, node, event);
                _this.itemList = [];
                for (var i = 0; i < _this.cutItems.length; i++) {
                    _this.itemList = _this.itemList.concat(_this._cutArea.getChildsByName(_this.cutItems[i].name));
                }
                try {
                    for (var _b = __values(_this.itemList), _c = _b.next(); !_c.done; _c = _b.next()) {
                        var node_2 = _c.value;
                        if (node_2.rectContains(event.source)) {
                            var nodeJS = node_2.getScript("ps.CutItem");
                            nodeJS && nodeJS.targetItemHandle(node_2, event);
                            _this.event.dispatch(CutFruitArea.correctTarget, node_2, event);
                        }
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                    }
                    finally { if (e_2) throw e_2.error; }
                }
            });
        };
        /** 试玩开始时的处理 */
        CutAreaView.prototype.onStart = function () {
            // console.info("[info] cutAreaView.onStart");
        };
        /** 当脚本被移除时，会自动调用 */
        CutAreaView.prototype.onDestroy = function () {
            // console.info("[info] cutAreaView.onDestroy");
        };
        return CutAreaView;
    }(ps.Behaviour));
    ps.CutAreaView = CutAreaView;
    qc.registerBehaviour("ps.CutAreaView", CutAreaView);
    CutAreaView["__menu"] = "玩法模板/切水果玩法/（CutAreaView）";
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
//# sourceMappingURL=CutAreaView.js.map