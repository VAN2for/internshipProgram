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
    var BrickControlEvent;
    (function (BrickControlEvent) {
        /** 砖块全部消灭完成 */
        BrickControlEvent[BrickControlEvent["Success"] = 0] = "Success";
        /**
         * 打砖块进度更新
         *
         * 事件负载为
         * {
         * @var node: 被消灭砖块节点,
         * @var specie: 被消灭的砖块类型,
         * @var line: 行数,
         * @var column: 列数,
         * }
         */
        BrickControlEvent[BrickControlEvent["Update"] = 1] = "Update";
    })(BrickControlEvent = ps.BrickControlEvent || (ps.BrickControlEvent = {}));
    /**
     *
     * @description
     * @author zhen.liang
     * @date 2023/02/06 15:31:25
     */
    var BrickControl = /** @class */ (function (_super) {
        __extends(BrickControl, _super);
        function BrickControl(gameObject) {
            var _this = _super.call(this, gameObject) || this;
            _this.Event = new ps.EventDispatcher();
            /** 世界的重力值设定 */
            _this.Box2DGravity = 0;
            /** 像素到米的转换比率 */
            _this.Box2DPTM = 100;
            /** 期望物理的调度帧率 */
            _this.Box2DFrameRate = 60;
            /** 序列化 */
            _this.serializableFields = {
                brickNum: qc.Serializer.NUMBER,
                Box2DGravity: qc.Serializer.INT,
                Box2DPTM: qc.Serializer.INT,
                Box2DFrameRate: qc.Serializer.INT,
            };
            /** 已销毁砖块数量 */
            _this.deleteBrickNum = 0;
            return _this;
        }
        BrickControl.prototype.createGui = function () {
            return {
                brickNum: {
                    title: "砖块数量",
                    component: "input", // 数字控件
                },
                Box2DGravity: {
                    title: "世界的重力值设定",
                    component: "input", // 数字控件
                },
                Box2DPTM: {
                    title: "像素到米的转换比率",
                    component: "input", // 数字控件
                },
                Box2DFrameRate: {
                    title: "期望物理的调度帧率",
                    component: "input", // 数字控件
                },
            };
        };
        /** 试玩初始化的处理 */
        BrickControl.prototype.onInit = function () {
            this.BrickMap = new Map();
            box2d.PTM = this.Box2DPTM;
            box2d.gravity = this.Box2DGravity;
            box2d.frameRate = this.Box2DFrameRate;
        };
        /** 砖块写入 */
        BrickControl.prototype.setBrickMap = function (line, column, value) {
            this.BrickMap.set(this.getKey(line, column), value);
        };
        /** 砖块销毁 */
        BrickControl.prototype.deleteBrick = function (line, column) {
            if (!this.BrickMap.has(this.getKey(line, column)))
                return;
            var _a = this.BrickMap.get(this.getKey(line, column)), node = _a.node, specie = _a.specie;
            node.visible = false;
            this.BrickMap.delete(this.getKey(line, column));
            this.deleteBrickNum++;
            this.Event.dispatch(BrickControlEvent.Update, {
                node: node,
                specie: specie,
                line: line,
                column: column,
            });
            var progress = this.deleteBrickNum / this.brickNum;
            if (progress >= 1)
                this.Event.dispatch(BrickControlEvent.Success);
        };
        BrickControl.prototype.getKey = function (line, column) {
            return line + "," + column;
        };
        return BrickControl;
    }(ps.Behaviour));
    ps.BrickControl = BrickControl;
    qc.registerBehaviour("ps.BrickControl", BrickControl);
    BrickControl["__menu"] = "玩法模板/打砖块玩法/砖块控制器（BrickControl）";
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
//# sourceMappingURL=BrickControl.js.map