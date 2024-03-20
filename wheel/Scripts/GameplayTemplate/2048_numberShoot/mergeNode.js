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
     * 发射数字
     * @description 发射节点下落合并碰撞
     * @author yongyuan.liao
     * @date 2023/03/28 15:13:31
     */
    var mergeNode = /** @class */ (function (_super) {
        __extends(mergeNode, _super);
        function mergeNode(gameObject) {
            var _this = _super.call(this, gameObject) || this;
            _this.Event = new ps.EventDispatcher();
            /**发射节点的x坐标 */
            _this._startPointX = [];
            /**发射节点的y坐标 */
            _this._startPointY = [];
            /**发射节点的value */
            _this._startPointValue = [];
            _this.g = [];
            _this.stepEvent = [];
            _this.stepCount = 0;
            _this.flag = false;
            _this.startPointList = [];
            _this.waitTimeList = [];
            /** 序列化 */
            _this.serializableFields = {
                _gameCount: qc.Serializer.NUMBER,
                _mergeTime: qc.Serializer.NUMBER,
                _nextTime: qc.Serializer.NUMBER,
                _downTime: qc.Serializer.NUMBER,
                _startPointX: qc.Serializer.NUMBERS,
                _startPointY: qc.Serializer.NUMBERS,
                _startPointValue: qc.Serializer.NUMBERS,
            };
            return _this;
        }
        mergeNode.prototype.createGui = function () {
            return {
                _gameCount: {
                    title: "游戏次数",
                    component: "input",
                    field: {
                        type: "number",
                    },
                },
                _mergeTime: {
                    title: "合并时间",
                    component: "input",
                    field: {
                        type: "number",
                    },
                },
                _downTime: {
                    title: "下落时间",
                    component: "input",
                    field: {
                        type: "number",
                    },
                },
                _nextTime: {
                    title: "节点出现的时间",
                    component: "input",
                    field: {
                        type: "number",
                    },
                },
                _startPointX: {
                    title: "发射数字节点数量X",
                    tail: "发射数字节点数量配置X,Y,Value需要一一对应",
                    component: "input",
                    field: {
                        type: "number",
                    },
                },
                _startPointY: {
                    title: "发射数字节点数量Y",
                    tail: "发射数字节点数量配置X,Y,Value需要一一对应",
                    component: "input",
                    field: {
                        type: "number",
                    },
                },
                _startPointValue: {
                    title: "发射数字节点数量Value",
                    tail: "发射数字节点数量配置X,Y,Value需要一一对应",
                    component: "input",
                    field: {
                        type: "number",
                    },
                },
            };
        };
        /**
         * 点击事件
         */
        mergeNode.prototype.onClick = function () {
            if (!this.flag) {
                this.getDropDistance();
                this.Event.dispatch(ps.mergeEvent.Shoot);
            }
            this.flag = true;
        };
        /**
         * 获取节点下落的距离
         */
        mergeNode.prototype.getDropDistance = function () {
            var callback = this.updateMerge.bind(this);
            for (var j = 0; j < this.Graph.m; j++)
                for (var i = this.Graph.n - 1; i >= 0; i--) {
                    var u = this.g[i][j];
                    if (u !== null)
                        continue;
                    this.updateBlock(callback, i, j);
                    break;
                }
        };
        /**
         * 初始化下落节点
         */
        mergeNode.prototype.initPoint = function () {
            var _a = this.startPointList[this.stepCount], x = _a.x, y = _a.y, value = _a.value;
            var index = this.Graph.valueToIndex(value);
            this.g[x][y] = this.Graph.init(this.Graph._blockNodes[index], this.gameObject, value, x, y, 10, true);
        };
        /**
         * 递归执行判断合并
         * @param value 节点的value值
         * @param x 矩阵下的x坐标
         * @param y 矩阵下的y坐标
         * @returns 返回是否合并成功，如果没有合并返回false，如果合并成功并且创建新的节点返回true
         */
        mergeNode.prototype.updateMerge = function (value, x, y) {
            var _this = this;
            var mergeAnimation = function (u) {
                return new Promise(function (resolve) {
                    ps.xtween(u.node)
                        .to(_this._mergeTime, {
                        x: y * _this.Graph.brickWidth,
                        y: x * _this.Graph.brickHeight,
                    })
                        .call(function () {
                        u.node.destroy();
                        resolve(undefined);
                    })
                        .start();
                });
            };
            var count = 0;
            var animationPromises = [];
            var left = y - 1, right = y + 1, bottom = x + 1;
            if (left >= 0) {
                var leftNode = this.g[x][left];
                if ((leftNode === null || leftNode === void 0 ? void 0 : leftNode.value) == value) {
                    this.g[x][left] = null;
                    var p = mergeAnimation(leftNode);
                    animationPromises.push(p);
                    count += 1;
                }
            }
            if (right < this.Graph.m) {
                var rightNode = this.g[x][right];
                if ((rightNode === null || rightNode === void 0 ? void 0 : rightNode.value) == value) {
                    this.g[x][right] = null;
                    var p = mergeAnimation(rightNode);
                    animationPromises.push(p);
                    count += 1;
                }
            }
            if (bottom < this.Graph.n) {
                var bottomNode = this.g[bottom][y];
                if ((bottomNode === null || bottomNode === void 0 ? void 0 : bottomNode.value) == value) {
                    this.g[bottom][y] = null;
                    var p = mergeAnimation(bottomNode);
                    animationPromises.push(p);
                    count += 1;
                }
            }
            if (count === 0) {
                if (this.g[x][y].isStart && this.stepCount < this._gameCount) {
                    setTimeout(function () {
                        _this.gameStart();
                        _this.flag = false;
                    }, this._nextTime);
                    this.Event.dispatch(ps.mergeEvent.mergeComplete);
                }
                if (this.stepCount === this._gameCount) {
                    this.Event.dispatch(ps.mergeEvent.End);
                }
                return;
            }
            var oldNode = this.g[x][y];
            Promise.all(animationPromises).then(function () {
                oldNode.node.destroy();
                var newValue = _this.Graph.numberCombine(value, count);
                var index = _this.Graph.valueToIndex(newValue);
                _this.g[x][y] = _this.Graph.init(_this.Graph._blockNodes[index], _this.gameObject, newValue, x, y, 0, true);
                _this.Event.dispatch(ps.mergeEvent.Merge);
                _this.getDropDistance();
            });
        };
        /**
         *
         * @param callback 下落过程中开始的回调函数，合并相同value值的节点
         * @param x 矩阵下x坐标
         * @param y 矩阵下y坐标
         */
        mergeNode.prototype.updateBlock = function (callback, x, y) {
            for (var i = x - 1; i >= 0; i--) {
                var u = this.g[i][y];
                if (u === null)
                    continue;
                this.g[i][y] = null;
                var node = u.node;
                ps.xtween(node)
                    .to((x - i) * this._downTime, {
                    y: x * this.Graph.brickHeight,
                })
                    .call(callback, null, u.value, x, y)
                    .start();
                this.g[x--][y] = u;
            }
        };
        /**
         * 执行函数
         */
        mergeNode.prototype.gameStart = function () {
            this.stepEvent[this.stepCount]();
            this.stepCount++;
        };
        /** 组件被激活后执行 */
        mergeNode.prototype.awake = function () {
            // console.info("[info] mergeNode.awake");
        };
        /** 试玩初始化的处理 */
        mergeNode.prototype.onInit = function () {
            // console.info("[info] mergeNode.onInit");
            this.Graph = this.gameObject.getScript("ps.createGraph");
            this.g = this.Graph.grid;
            var len = this._startPointValue.length;
            for (var i = 0; i < len; i++) {
                var x = this._startPointX[i];
                var y = this._startPointY[i];
                var value = this._startPointValue[i];
                this.startPointList.push({ x: x, y: y, value: value });
                this.waitTimeList.push();
            }
            if (this._gameCount > len) {
                for (var i = 0; i < this._gameCount - len; i++) {
                    var x = 0;
                    var y = Math.floor(Math.random() * this.Graph.m);
                    var num = Math.floor(Math.random() * 10) + 1;
                    var value = 1 << num;
                    this.startPointList.push({ x: x, y: y, value: value });
                }
            }
            for (var i = 0; i < this._gameCount; i++) {
                this.stepEvent.push(this.initPoint.bind(this));
            }
            this.gameStart();
        };
        /** 试玩开始时的处理 */
        mergeNode.prototype.onStart = function () {
            this.Event.dispatch(ps.mergeEvent.Start);
            // console.info("[info] mergeNode.onStart");
        };
        /** 当脚本被移除时，会自动调用 */
        mergeNode.prototype.onDestroy = function () {
            // console.info("[info] mergeNode.onDestroy");
        };
        return mergeNode;
    }(ps.Behaviour));
    ps.mergeNode = mergeNode;
    qc.registerBehaviour("ps.mergeNode", mergeNode);
    mergeNode["__menu"] = "玩法模板/2048数字射击玩法/发射数字（mergeNode）";
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
//# sourceMappingURL=mergeNode.js.map