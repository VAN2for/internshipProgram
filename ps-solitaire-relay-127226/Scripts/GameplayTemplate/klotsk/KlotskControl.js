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
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var ps;
(function (ps) {
    var KlotskControlEvent;
    (function (KlotskControlEvent) {
        /**
         * 华容道玩法成功完成
         */
        KlotskControlEvent[KlotskControlEvent["Success"] = 0] = "Success";
    })(KlotskControlEvent = ps.KlotskControlEvent || (ps.KlotskControlEvent = {}));
    /**
     *
     * 华容道控制器
     * @description 华容道控制器
     * @author zhen.liang
     * @date 2022/12/31 15:16:31
     */
    var KlotskControl = /** @class */ (function (_super) {
        __extends(KlotskControl, _super);
        function KlotskControl(gameObject) {
            var _this = _super.call(this, gameObject) || this;
            _this.Event = new ps.EventDispatcher();
            /** 目前正确碎片数量 */
            _this.correctPuzzleNumber = 0;
            /** 是否有碎片正在移动 */
            _this.puzzleMoving = false;
            /** 碎片位置图信息 */
            _this.puzzleMap = new Map();
            /** 序列化 */
            _this.serializableFields = {
                puzzleNumber: qc.Serializer.INT,
                puzzleRow: qc.Serializer.INT,
                puzzleLine: qc.Serializer.INT,
            };
            return _this;
        }
        KlotskControl.prototype.createGui = function () {
            return {
                puzzleNumber: {
                    title: "所需正确碎片数量",
                    component: "input",
                    field: {
                        type: "number",
                    },
                },
                puzzleRow: {
                    title: "行数",
                    component: "input",
                    field: {
                        type: "number",
                    },
                },
                puzzleLine: {
                    title: "列数",
                    component: "input",
                    field: {
                        type: "number",
                    },
                },
            };
        };
        /** 正确碎片数量加一 */
        KlotskControl.prototype.addCorrectPuzzle = function () {
            this.correctPuzzleNumber++;
            /** 游戏成功完成 */
            if (this.correctPuzzleNumber === this.puzzleNumber) {
                this.Event.dispatch(KlotskControlEvent.Success);
            }
        };
        /** 正确碎片数量减一 */
        KlotskControl.prototype.decrease = function () {
            this.correctPuzzleNumber--;
        };
        /** 碎片移动 */
        KlotskControl.prototype.puzzleMove = function (startXY, moveedXY, node, width, height) {
            for (var i = 0; i < width; i++)
                for (var j = 0; j < height; j++) {
                    this.puzzleMap.delete("".concat(startXY[0] + j, ",").concat(startXY[1] + i));
                }
            for (var i = 0; i < width; i++)
                for (var j = 0; j < height; j++) {
                    this.puzzleMap.set("".concat(moveedXY[0] + j, ",").concat(moveedXY[1] + i), node);
                }
        };
        /** 填入碎片 */
        KlotskControl.prototype.setPuzzleMap = function (XY, node, width, height) {
            for (var i = 0; i < width; i++)
                for (var j = 0; j < height; j++) {
                    this.puzzleMap.set("".concat(XY[0] + j, ",").concat(XY[1] + i), node);
                }
        };
        /** 根据图坐标获取节点 */
        KlotskControl.prototype.getPuzzleNode = function (XY) {
            return this.puzzleMap.get(XY.join(","));
        };
        /** 查询目标位置是否可移动 */
        KlotskControl.prototype.searchPuzzleMap = function (moveXY) {
            if (this.puzzleMoving)
                return false;
            var _a = __read(moveXY, 2), x = _a[0], y = _a[1];
            if (x < 1 || x > this.puzzleRow)
                return false;
            if (y < 1 || y > this.puzzleLine)
                return false;
            return !this.puzzleMap.has(moveXY.join(","));
        };
        /** 锁定 */
        KlotskControl.prototype.lock = function () {
            this.puzzleMoving = true;
        };
        /** 解锁 */
        KlotskControl.prototype.release = function () {
            this.puzzleMoving = false;
        };
        return KlotskControl;
    }(ps.Behaviour));
    ps.KlotskControl = KlotskControl;
    qc.registerBehaviour("ps.KlotskControl", KlotskControl);
    KlotskControl["__menu"] = "玩法模板/华容道玩法/控制组件(KlotskControl)";
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
//# sourceMappingURL=KlotskControl.js.map