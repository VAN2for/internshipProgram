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
     * 切水果
     * @description 切水果
     * @author weijia
     * @date 2023/02/17 13:54:58
     */
    var CutFruitEmitter;
    (function (CutFruitEmitter) {
        CutFruitEmitter[CutFruitEmitter["createItem"] = 0] = "createItem";
    })(CutFruitEmitter = ps.CutFruitEmitter || (ps.CutFruitEmitter = {}));
    var CutItemEmitter = /** @class */ (function (_super) {
        __extends(CutItemEmitter, _super);
        function CutItemEmitter(gameObject) {
            var _this = _super.call(this, gameObject) || this;
            _this.event = new ps.EventDispatcher();
            _this.frequency = 1000; //生成频率
            _this.needRepeat = false; //是否需要重复生成
            _this.minOffsetX = 0; //生成物品时X的最小偏移值
            _this.maxOffsetX = 0; //生成物品时X的最大偏移值
            _this.minOffsetY = 0; //生成物品时Y的最小偏移值
            _this.maxOffsetY = 0; //生成物品时Y的最大偏移值
            _this.isSend = false;
            _this.time = 0;
            _this.item = null;
            /** 序列化 */
            _this.serializableFields = {
                cutArea: qc.Serializer.NODE,
                itemList: qc.Serializer.NODES,
                probabilitys: qc.Serializer.NUMBERS,
                frequency: qc.Serializer.NUMBER,
                minOffsetX: qc.Serializer.NUMBER,
                maxOffsetX: qc.Serializer.NUMBER,
                minOffsetY: qc.Serializer.NUMBER,
                maxOffsetY: qc.Serializer.NUMBER,
                needRepeat: qc.Serializer.BOOLEAN,
            };
            return _this;
        }
        CutItemEmitter.prototype.createGui = function () {
            return {
                itemList: {
                    title: "生成物品数组",
                    component: "nodes",
                },
                probabilitys: {
                    title: "物品权重数组",
                    component: "nodes",
                },
                cutArea: {
                    title: "物品生成区域节点",
                    component: "node",
                },
                needRepeat: {
                    title: "是否需要重复生成",
                    component: "switch",
                },
                frequency: {
                    title: "物品生成频率",
                    component: "input",
                    field: {
                        type: "number",
                    },
                },
                minOffsetX: {
                    title: "生成物品X最小偏移",
                    component: "input",
                    field: {
                        type: "number",
                    },
                },
                minOffsetY: {
                    title: "生成物品Y最小偏移",
                    component: "input",
                    field: {
                        type: "number",
                    },
                },
                maxOffsetX: {
                    title: "生成物品X最大偏移",
                    component: "input",
                    field: {
                        type: "number",
                    },
                },
                maxOffsetY: {
                    title: "生成物品Y最大偏移",
                    component: "input",
                    field: {
                        type: "number",
                    },
                },
            };
        };
        /** 组件被激活后执行 */
        CutItemEmitter.prototype.awake = function () {
            // console.info("[info] CutItemsEmitter.awake");
        };
        /** 试玩初始化的处理 */
        CutItemEmitter.prototype.onInit = function () {
            // console.info("[info] CutItemEmitter.onInit");`
        };
        CutItemEmitter.prototype.update = function () {
            if (this.isSend && this.needRepeat) {
                if (this.time >= this.frequency) {
                    if (this.item) {
                        this.createItem(this.item);
                    }
                    else {
                        this.createItem();
                    }
                    this.time = 0;
                }
                this.time += this.game.time.deltaTime;
            }
        };
        /**
         * 生成发射物品
         * @param item  需要生成的物品，当不传入参数时，将会根据物品数组和比重数组随机生成某一个物品
         */
        CutItemEmitter.prototype.sendItem = function (item) {
            this.isSend = true;
            if (item) {
                this.createItem(item);
                this.item = item;
            }
            else {
                this.createItem();
            }
        };
        /**
         * 停止自动生成发射物品
         */
        CutItemEmitter.prototype.stopSend = function () {
            this.isSend = false;
            this.item = null;
        };
        //停止重复生成
        CutItemEmitter.prototype.stopRepeat = function () {
            this.needRepeat = false;
            this.item = null;
        };
        //开始重复生成
        CutItemEmitter.prototype.repeatSend = function (item) {
            this.needRepeat = true;
            this.isSend = true;
            if (item) {
                this.createItem(item);
                this.item = item;
            }
            else {
                this.createItem();
            }
        };
        CutItemEmitter.prototype.createItem = function (item) {
            var e_1, _a;
            var node;
            if (item) {
                node = item;
            }
            else {
                var sum = this.probabilitys.reduce(function (a, b) { return a + b; });
                var nums = [];
                var pre = 0;
                try {
                    for (var _b = __values(this.probabilitys), _c = _b.next(); !_c.done; _c = _b.next()) {
                        var prob = _c.value;
                        nums.push(pre + prob);
                        pre += prob;
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
                var random = Math.random() * sum;
                for (var i = 0; i < nums.length; i++) {
                    if (random < nums[i]) {
                        if (i > 0) {
                            if (random >= nums[i - 1]) {
                                node = this.itemList[i];
                                break;
                            }
                        }
                        else {
                            node = this.itemList[i];
                            break;
                        }
                    }
                }
            }
            var offsetX = Math.random() * (this.maxOffsetX - this.minOffsetX) +
                this.minOffsetX;
            var offsetY = Math.random() * (this.maxOffsetY - this.minOffsetY) +
                this.minOffsetY;
            var _node = this.game.add.clone(node, this.cutArea);
            var pos_world = this.gameObject.getWorldPosition();
            var pos_local = this.cutArea.toLocal(pos_world);
            _node.x = pos_local.x + offsetX;
            _node.y = pos_local.y + offsetY;
            _node.visible = true;
            var _nodeJS = _node.getScript("ps.CutItem");
            _nodeJS.initProps();
            this.event.dispatch(CutFruitEmitter.createItem, _node);
        };
        /** 试玩开始时的处理 */
        CutItemEmitter.prototype.onStart = function () {
            // console.info("[info] CutItemEmitter.onStart");
        };
        /** 当脚本被移除时，会自动调用 */
        CutItemEmitter.prototype.onDestroy = function () {
            // console.info("[info] CutItemEmitter.onDestroy");
        };
        return CutItemEmitter;
    }(ps.Behaviour));
    ps.CutItemEmitter = CutItemEmitter;
    qc.registerBehaviour("ps.CutItemEmitter", CutItemEmitter);
    CutItemEmitter["__menu"] = "玩法模板/切水果玩法/（CutItemEmitter）";
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
//# sourceMappingURL=CutItemEmitter.js.map