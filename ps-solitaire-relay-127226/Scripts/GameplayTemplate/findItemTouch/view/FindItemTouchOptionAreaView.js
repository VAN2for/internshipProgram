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
     * 寻找物品（触控）可操作区域
     * @description 寻找物品（触控）可操作区域，包含所有正确、错误目标
     * @author bin
     * @date 2022/12/29 11:11:00
     */
    var FindItemTouchOptionAreaView = /** @class */ (function (_super) {
        __extends(FindItemTouchOptionAreaView, _super);
        function FindItemTouchOptionAreaView(gameObject) {
            var _this = _super.call(this, gameObject) || this;
            /** 是否克隆联动节点目标事件节点 */
            _this.isCloneRelationEventNode = false;
            /** 是否保持事件节点位置与当前目标（区域）位置相同 */
            _this.isCustomEventTargetNodePointToGameObj = false;
            return _this;
        }
        /** 触发目标（区域）时，派发事件 */
        FindItemTouchOptionAreaView.prototype.dispatchEvent = function (param) {
            this.event.dispatch(ps.FindItemTouchEvent.ErrorTarget, param);
        };
        return FindItemTouchOptionAreaView;
    }(ps.FindItemTouchView));
    ps.FindItemTouchOptionAreaView = FindItemTouchOptionAreaView;
    qc.registerBehaviour("ps.FindItemTouchOptionAreaView", FindItemTouchOptionAreaView);
    FindItemTouchOptionAreaView["__menu"] = "玩法模板/寻找物品（触控）玩法/寻找物品（触控）可操作区域（FindItemTouchOptionAreaView）";
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
//# sourceMappingURL=FindItemTouchOptionAreaView.js.map