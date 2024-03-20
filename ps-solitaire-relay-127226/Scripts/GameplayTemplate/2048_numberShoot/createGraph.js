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
     * 创建数字棋盘
     * @description 把对应节点创建到棋盘中
     * @author yongyuan.liao
     * @date 2023/03/28 11:09:02
     */
    var createGraph = /** @class */ (function (_super) {
        __extends(createGraph, _super);
        function createGraph(gameObject) {
            var _this = _super.call(this, gameObject) || this;
            _this.grid = [];
            _this.g = [];
            _this._blockNodes = [];
            /** 序列化 */
            _this.serializableFields = {
                _blockNodes: qc.Serializer.NODES,
                _node: qc.Serializer.NODE,
                _col: qc.Serializer.NUMBER,
                _row: qc.Serializer.NUMBER,
                _button: qc.Serializer.BOOLEAN,
            };
            return _this;
        }
        createGraph.prototype.createGui = function () {
            return {
                _blockNodes: {
                    title: "绑定数字节点",
                    component: "nodes",
                },
                _node: {
                    title: "获取节点数据",
                    component: "node",
                },
                _row: {
                    title: "行数",
                    component: "input",
                    field: {
                        type: "number",
                    },
                },
                _col: {
                    title: "列数",
                    component: "input",
                    field: {
                        type: "number",
                    },
                },
                _button: {
                    title: "随机数据",
                    component: "switch",
                },
            };
        };
        createGraph.prototype.valueToIndex = function (value) {
            return Math.log2(value) - 1;
        };
        createGraph.prototype.numberCombine = function (value, count) {
            return value * Math.pow(2, count);
        };
        /** 试玩初始化的处理 */
        createGraph.prototype.onInit = function () {
            var e_1, _a;
            // console.info("[info] createGraph.onInit");
            this.gameObject.interactive = true;
            this.n = this._row;
            this.m = this._col;
            this.diffX =
                (this.gameObject.width - this._blockNodes[0].width * this.m) /
                    this.m;
            this.diffY =
                (this.gameObject.height - this._blockNodes[0].height * this.n) /
                    this.n;
            this.brickWidth =
                this._blockNodes[0].width + Math.floor(this.diffX);
            this.brickHeight =
                this._blockNodes[0].height + Math.floor(this.diffY);
            for (var i = 0; i < this.n; i++) {
                this.g[i] = new Array(this.m).fill(0);
            }
            if (this._button) {
                for (var i = 0; i < this.n; i++) {
                    this.g[i] = new Array(this.m).fill(0);
                }
                for (var i = 0; i < this._node.children.length; i++) {
                    var child = this._node.children[i];
                    child.visible = false;
                }
                this.initData();
            }
            else {
                for (var i = 0; i < this._node.children.length; i++) {
                    var child = this._node.children[i];
                    child.visible = false;
                    var node = child.getScript("ps.createNode");
                    if (typeof node !== "undefined") {
                        var x = node._row;
                        var y = node._col;
                        var value = node._value;
                        this.g[x][y] = value;
                    }
                }
            }
            try {
                for (var _b = __values(this._blockNodes), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var node = _c.value;
                    node.visible = false;
                    node.setPropertyIgnoreLayout({
                        prop: "visible",
                        value: false,
                    });
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
            }
            for (var i = 0; i < this.n; i++) {
                this.grid[i] = [];
                for (var j = 0; j < this.m; j++) {
                    var value = this.g[i][j];
                    var index = this.valueToIndex(value);
                    this.grid[i][j] = this.init(this._blockNodes[index], this.gameObject, value, i, j, 0, false);
                }
            }
        };
        createGraph.prototype.initData = function () {
            for (var j = 0; j < this.m; j++) {
                var cnt = Math.floor(Math.random() * this.n);
                if (cnt > Math.floor(this.n / 2))
                    cnt = Math.floor(this.n / 2);
                for (var i = this.n - 1; cnt; cnt--, i--) {
                    var index = Math.floor(Math.random() * 10) + 1;
                    this.g[i][j] = 1 << index;
                }
            }
        };
        createGraph.prototype.init = function (root, content, value, x, y, diff, isStart) {
            if (!value)
                return null;
            var node = qc_game.add.clone(root, content);
            node.setPropertyIgnoreLayout({
                prop: "x",
                value: this.brickWidth * y + this.diffX / 2,
            });
            node.setPropertyIgnoreLayout({
                prop: "y",
                value: this.brickHeight * x + diff,
            });
            node.visible = true;
            return { value: value, node: node, isStart: isStart };
        };
        /** 试玩开始时的处理 */
        createGraph.prototype.onStart = function () {
            // console.info("[info] createGraph.onStart");
        };
        /** 当脚本被移除时，会自动调用 */
        createGraph.prototype.onDestroy = function () {
            // console.info("[info] createGraph.onDestroy");
        };
        return createGraph;
    }(ps.Behaviour));
    ps.createGraph = createGraph;
    qc.registerBehaviour("ps.createGraph", createGraph);
    createGraph["__menu"] = "玩法模板/2048数字射击玩法/数字棋盘（createGraph）";
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
//# sourceMappingURL=createGraph.js.map