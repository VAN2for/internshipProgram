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
var ScrollBackground = /** @class */ (function (_super) {
    __extends(ScrollBackground, _super);
    function ScrollBackground(gameObject) {
        var _this = _super.call(this, gameObject) || this;
        _this.velocity = 10;
        _this.dir = false; // 上下
        /** 序列化 */
        _this.serializableFields = {
            velocity: qc.Serializer.NUMBER,
            dir: qc.Serializer.BOOLEAN
        };
        return _this;
    }
    /** 试玩初始化的处理 */
    ScrollBackground.prototype.onInit = function () {
        if (this.dir) {
            this.actualWidth = this.gameObject.width * this.gameObject.scaleX;
            var needNum = Math.ceil(1334 / this.actualWidth);
            this.extendNum = needNum;
            needNum--;
            while (needNum > 0) {
                var extend = new qc.UIImage(this.game, this.gameObject);
                extend.width = this.gameObject.width;
                extend.height = this.gameObject.height;
                extend.texture = this.gameObject.texture;
                this.gameObject.addChild(extend);
                extend.x = extend.width * needNum;
                needNum--;
            }
            this._scrollBackground = this.game.add.clone(this.gameObject);
            this.gameObject.parent.setChildIndex(this._scrollBackground, this.gameObject.parent.getChildIndex(this.gameObject));
            this._scrollBackground.x = this.actualWidth * (this.velocity > 0 ? -1 : 1) * this.extendNum;
        }
        else {
            //在这里初始化游戏场景需要的东西
            this.actualHeight = this.gameObject.height * this.gameObject.scaleY;
            var needNum = Math.ceil(1334 / this.actualHeight);
            this.extendNum = needNum;
            needNum--;
            while (needNum > 0) {
                var extend = new qc.UIImage(this.game, this.gameObject);
                extend.width = this.gameObject.width;
                extend.height = this.gameObject.height;
                extend.texture = this.gameObject.texture;
                this.gameObject.addChild(extend);
                extend.y = extend.height * needNum;
                needNum--;
            }
            this._scrollBackground = this.game.add.clone(this.gameObject);
            this.gameObject.parent.setChildIndex(this._scrollBackground, this.gameObject.parent.getChildIndex(this.gameObject));
            this._scrollBackground.y = this.actualHeight * (this.velocity > 0 ? -1 : 1) * this.extendNum;
        }
    };
    /** 试玩开始时的处理 */
    ScrollBackground.prototype.onStart = function () {
        //动态参数的使用,playAgain参数会随着再玩一次而减少
    };
    /** 试玩结束时的处理 */
    ScrollBackground.prototype.onEnd = function () {
    };
    /** 再来一次时的处理(onInit后,onStart前) */
    ScrollBackground.prototype.onRetry = function () {
    };
    ScrollBackground.prototype.update = function () {
        this.updatePosition(this.gameObject, this._scrollBackground);
    };
    /**--------------- 框架结构结束 -------------- */
    /**----------------- 业务代码 ----------------- */
    ScrollBackground.prototype.updatePosition = function (node, _node) {
        if (!node || !_node)
            return;
        if (this.velocity === void 0)
            return;
        if (this.dir) {
            if (this.checkOutOfScreen(node)) {
                node.x += this.velocity;
            }
            else {
                node.x = -this.actualWidth * this.extendNum;
            }
            if (this.checkOutOfScreen(_node)) {
                _node.x += this.velocity;
            }
            else {
                _node.x = -this.actualWidth * this.extendNum;
            }
        }
        else {
            if (this.checkOutOfScreen(node)) {
                node.y += this.velocity;
            }
            else {
                node.y = -this.actualHeight * this.extendNum;
            }
            if (this.checkOutOfScreen(_node)) {
                _node.y += this.velocity;
            }
            else {
                _node.y = -this.actualHeight * this.extendNum;
            }
        }
    };
    ScrollBackground.prototype.checkOutOfScreen = function (node) {
        if (this.dir) {
            if (node.x + this.velocity >= this.actualWidth * this.extendNum && this.velocity > 0)
                return true;
            if (node.x + this.velocity <= this.actualWidth * this.extendNum && this.velocity < 0)
                return true;
        }
        else {
            if (node.y + this.velocity >= this.actualHeight * this.extendNum && this.velocity > 0)
                return true;
            if (node.y + this.velocity <= -this.actualHeight * this.extendNum && this.velocity < 0)
                return true;
        }
        return false;
    };
    return ScrollBackground;
}(ps.Behaviour));
qc.registerBehaviour('ScrollBackground', ScrollBackground);
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
