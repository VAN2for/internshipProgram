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
     *
     * @description 纸牌映射关系
     * @author jingru.wu
     * @date 2023/03/02 15:23:14
     */
    var CardMap = /** @class */ (function (_super) {
        __extends(CardMap, _super);
        function CardMap(gameObject) {
            var _this = _super.call(this, gameObject) || this;
            /** 序列化 */
            _this.serializableFields = {
                cardNum: qc.Serializer.NUMBER,
                back: qc.Serializer.NODE,
                front: qc.Serializer.NODE,
            };
            return _this;
        }
        CardMap.prototype.createGui = function () {
            return {
                cardNum: {
                    title: "纸牌对应的数值",
                    component: "input",
                    field: {
                        type: "number",
                    },
                },
                front: {
                    title: "正面",
                    tail: "若是暗牌设置背面与正面",
                    component: "node",
                },
                back: {
                    title: "背面",
                    tail: "若是暗牌设置背面与正面",
                    component: "node",
                },
            };
        };
        /** 组件被激活后执行 */
        CardMap.prototype.awake = function () {
            // console.info("[info] CardMap.awake");
        };
        /** 试玩初始化的处理 */
        CardMap.prototype.onInit = function () {
            // console.info("[info] CardMap.onInit");
        };
        /** 试玩开始时的处理 */
        CardMap.prototype.onStart = function () {
            // console.info("[info] CardMap.onStart");
        };
        /** 当脚本被移除时，会自动调用 */
        CardMap.prototype.onDestroy = function () {
            // console.info("[info] CardMap.onDestroy");
        };
        return CardMap;
    }(ps.Behaviour));
    ps.CardMap = CardMap;
    qc.registerBehaviour("ps.CardMap", CardMap);
    CardMap["__menu"] = "玩法模板/2048纸牌玩法/纸牌组件（CardMap）";
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
//# sourceMappingURL=CardMap.js.map