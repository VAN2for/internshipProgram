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
     * 挂载在滑动寻找物品模板其他物品对象上的组件
     * @description 挂载在滑动寻找物品模板其他物品对象上的组件
     * @author QiaoSen.huang
     * @date 2023/01/03 19:19:01
     */
    var ScrollFindItemOtherTouchView = /** @class */ (function (_super) {
        __extends(ScrollFindItemOtherTouchView, _super);
        function ScrollFindItemOtherTouchView(gameObject) {
            return _super.call(this, gameObject) || this;
            // console.log(this.gameObject.parent.name)
        }
        ScrollFindItemOtherTouchView.prototype.dispatchEvent = function (e) {
            // 对外派发的事件，子类可以重写该方法，派发出不同的事件
            _super.prototype.dispatchEvent.call(this, e);
            this.event.dispatch(ps.ScrollFindItemEvent.OtherItemTouched, this.gameObject, e);
        };
        ScrollFindItemOtherTouchView.prototype._onTouch = function (e) {
            // 对外派发的事件，子类可以重新该方法，派发出不同的事件
            _super.prototype._onTouch.call(this, e);
        };
        return ScrollFindItemOtherTouchView;
    }(ps.ScrollFindItemView));
    ps.ScrollFindItemOtherTouchView = ScrollFindItemOtherTouchView;
    qc.registerBehaviour("ps.ScrollFindItemOtherTouchView", ScrollFindItemOtherTouchView);
    ScrollFindItemOtherTouchView["__menu"] =
        "玩法模板/寻找物品（滑动）玩法模板/其他物品组件ScrollFindItemOtherTouchView";
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
//# sourceMappingURL=ScrollFindItemOtherTouchView.js.map