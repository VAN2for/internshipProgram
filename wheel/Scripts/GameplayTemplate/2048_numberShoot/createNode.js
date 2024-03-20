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
     * 数字节点
     * @description 创建数字节点
     * @author yongyuan.liao
     * @date 2023/03/28 13:47:40
     */
    var createNode = /** @class */ (function (_super) {
        __extends(createNode, _super);
        function createNode(gameObject) {
            var _this = _super.call(this, gameObject) || this;
            /** 序列化 */
            _this.serializableFields = {
                _col: qc.Serializer.NUMBER,
                _row: qc.Serializer.NUMBER,
                _value: qc.Serializer.NUMBER,
            };
            return _this;
        }
        createNode.prototype.createGui = function () {
            return {
                _row: {
                    title: "行坐标",
                    component: "input",
                    field: {
                        type: "number",
                    },
                },
                _col: {
                    title: "列坐标",
                    component: "input",
                    field: {
                        type: "number",
                    },
                },
                _value: {
                    title: "数值",
                    component: "input",
                    field: {
                        type: "number",
                    },
                },
            };
        };
        /** 组件被激活后执行 */
        createNode.prototype.awake = function () {
            // console.info("[info] createNode.awake");
        };
        /** 试玩初始化的处理 */
        createNode.prototype.onInit = function () {
            // console.info("[info] createNode.onInit");
        };
        /** 试玩开始时的处理 */
        createNode.prototype.onStart = function () {
            // console.info("[info] createNode.onStart");
        };
        /** 当脚本被移除时，会自动调用 */
        createNode.prototype.onDestroy = function () {
            // console.info("[info] createNode.onDestroy");
        };
        return createNode;
    }(ps.Behaviour));
    ps.createNode = createNode;
    qc.registerBehaviour("ps.createNode", createNode);
    createNode["__menu"] = "玩法模板/2048数字射击玩法/数字节点（createNode）";
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
//# sourceMappingURL=createNode.js.map