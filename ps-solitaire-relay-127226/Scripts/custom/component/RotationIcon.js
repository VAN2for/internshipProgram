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
var RotationIcon = /** @class */ (function (_super) {
    __extends(RotationIcon, _super);
    function RotationIcon(gameObject) {
        var _this = _super.call(this, gameObject) || this;
        /** 序列化 */
        _this.isClick = true; // 是否支持点击
        _this.isDrag = true; // 是否支持拖拽
        _this.saveDown = Math.PI * 2;
        _this.saveDrag = 0; // 总的拖拽角度 逆时针会抵消
        _this.serializableFields = {
            isClick: qc.Serializer.BOOLEAN,
            isDrag: qc.Serializer.BOOLEAN,
            node: qc.Serializer.NODE
        };
        return _this;
    }
    RotationIcon.prototype.awake = function () {
        this.gameObject.interactive = true;
    };
    RotationIcon.prototype.onDrag = function (e) {
        if (!this.isDrag)
            return;
        var p = e.source;
        var localPosition = this.node.parent.toLocal(new qc.Point(p.x, p.y)); // 转化为本地坐标
        var lastAngle = this.positiveAngle(this.node.rotation);
        var rotation = Math.atan2(localPosition.y, localPosition.x);
        var curAngle = this.positiveAngle(rotation);
        var deltaAngle = this.deltaAngle(curAngle, lastAngle);
        if (deltaAngle > Math.PI) {
            this.saveDrag += deltaAngle - Math.PI * 2;
        }
        else {
            this.saveDrag += deltaAngle;
        }
        this.node.rotation = rotation;
    };
    RotationIcon.prototype.onDown = function (e) {
        if (!this.isClick)
            return;
        var p = e.source;
        var localPosition = this.node.parent.toLocal(new qc.Point(p.x, p.y));
        var lastAngle = this.positiveAngle(this.saveDown);
        var rotation = Math.atan2(localPosition.y, localPosition.x);
        var curAngle = this.positiveAngle(rotation);
        var deltaAngle = this.deltaAngle(curAngle, lastAngle);
        if (deltaAngle > Math.PI) {
            this.saveDown += deltaAngle - Math.PI * 2;
        }
        else {
            this.saveDown += deltaAngle;
        }
        this.saveDown = this.saveDown % (Math.PI * 2);
        ps.XTween.removeTargetTweens(this.node);
        ps.xtween(this.node).to(150, { rotation: this.saveDown }).start();
    };
    RotationIcon.prototype.deltaAngle = function (target, current) {
        if (target < current)
            target += Math.PI * 2;
        var d = (target - current) % (Math.PI * 2);
        return this.positiveAngle(d);
    };
    RotationIcon.prototype.positiveAngle = function (radian) {
        return radian > 0 ? radian : radian + Math.PI * 2;
    };
    return RotationIcon;
}(ps.Behaviour));
qc.registerBehaviour('RotationIcon', RotationIcon);
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
*/ 
//# sourceMappingURL=RotationIcon.js.map