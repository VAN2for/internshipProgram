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
var Random = ps.Random;
var Print = ps.Print;
var Mathf = ps.Mathf;
var Tween = ps.Tween;
/** 游戏主对象 */
var main;
var gameEvent = new ps.EventDispatcher();
var MainBeh = /** @class */ (function (_super) {
    __extends(MainBeh, _super);
    function MainBeh(gameObject) {
        var _this = _super.call(this, gameObject) || this;
        _this.gameEvent = new ps.EventDispatcher();
        /** 场景节点列表 */
        _this.sceneNodes = [];
        /** 序列化 */
        _this.serializableFields = {
            sceneNodes: qc.Serializer.NODES
        };
        main = _this;
        return _this;
    }
    /** 试玩初始化的处理 */
    MainBeh.prototype.onInit = function () {
        ps.Print.purple("mainInit");
        //在这里初始化游戏场景需要的东西
        // ps.GameConfig.createTemplete();
        this.game.input.nativeMode = true;
        if (box2d) {
            //console.log(box2d);
            box2d.debugDraw = true;
            box2d.debugFlags = 17;
        }
    };
    /** 试玩开始时的处理 */
    MainBeh.prototype.onStart = function () {
        ps.Print.purple("mainStart");
        //动态参数的使用,playAgain参数会随着再玩一次而减少
        // console.log(GAME_CFG.playAgain);
    };
    /** 试玩结束时的处理 */
    MainBeh.prototype.onEnd = function ($isWin) {
        ps.Print.purple("mainEnd");
    };
    /** 再来一次时的处理(onInit后,onStart前) */
    MainBeh.prototype.onRetry = function () {
        var _a;
        ps.Print.purple("mainRetry");
        // 如果重玩的时候，场景对象没有清干净，会有tween还在运行问题。
        (_a = ps === null || ps === void 0 ? void 0 : ps.XTween) === null || _a === void 0 ? void 0 : _a.removeAllTweens();
    };
    MainBeh.prototype.update = function () {
        var _a;
        (_a = ps === null || ps === void 0 ? void 0 : ps.XTween) === null || _a === void 0 ? void 0 : _a.updateTweens();
    };
    /** 当脚本被移除时，会自动调用 */
    MainBeh.prototype.onDestroy = function () {
        ps.Print.purple("mainDestroy");
        game.tweens.removeFrom(this.gameObject, true);
    };
    return MainBeh;
}(ps.Behaviour));
qc.registerBehaviour("MainBeh", MainBeh);
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
//# sourceMappingURL=MainBeh.js.map