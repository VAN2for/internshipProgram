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
var FingerSample = /** @class */ (function (_super) {
    __extends(FingerSample, _super);
    function FingerSample(gameObject) {
        var _this = _super.call(this, gameObject) || this;
        /** 序列化 */
        _this.serializableFields = {
            btn1: qc.Serializer.NODE,
            btn2: qc.Serializer.NODE,
            btn3: qc.Serializer.NODE,
            btn4: qc.Serializer.NODE,
            btn5: qc.Serializer.NODE,
        };
        return _this;
    }
    FingerSample.prototype.onStart = function () {
        this.finger = UIRoot.getChild("Finger").getComponent(ps.Finger);
        this.target1 = UIRoot.getChild("Target1");
        this.target2 = UIRoot.getChild("Target2");
        this.target3 = UIRoot.getChild("Target3");
        this.target4 = UIRoot.getChild("Target4");
        //
        this.btn1.onClick.add(this.showSample1, this);
        this.btn2.onClick.add(this.showSample2, this);
        this.btn3.onClick.add(this.showSample22, this);
        this.btn4.onClick.add(this.showSample3, this);
        this.btn5.onClick.add(this.showSample4, this);
        this.showSample1();
    };
    FingerSample.prototype.showSample1 = function () {
        //指向某个目标
        this.finger.hide();
        this.finger.show();
        this.finger.moveToTarget0(this.target1);
        this.finger.showScaleEffect();
    };
    FingerSample.prototype.showSample2 = function () {
        var _this = this;
        this.finger.hide();
        this.finger.show();
        this.finger.startLoop(function () {
            _this.finger.moveToTarget(_this.target1)
                .showImg()
                .scaleImg(0.8)
                .moveToTarget(_this.target2, 1000)
                .scaleImg(1)
                .hideImg();
        });
    };
    FingerSample.prototype.showSample22 = function () {
        var _this = this;
        this.finger.hide();
        this.finger.show();
        this.finger.startLoop(function () {
            _this.finger.moveToTarget(_this.target3, 1)
                .moveToTarget(_this.target4, 1000)
                .moveToTarget(_this.target3, 1000);
        });
    };
    FingerSample.prototype.showSample3 = function () {
        var _this = this;
        this.finger.hide();
        this.finger.show();
        this.finger.startLoop(function () {
            _this.finger.moveToTarget(_this.target1, 1)
                .moveToTarget(_this.target2, 1000)
                .moveToTarget(_this.target3, 1000)
                .moveToTarget(_this.target4, 1000)
                .moveToTarget(_this.target1, 1000);
        });
    };
    FingerSample.prototype.showSample4 = function () {
        var _this = this;
        this.finger.hide();
        this.finger.show();
        this.finger.startLoop(function () {
            _this.finger.moveToTarget(_this.target1, 1)
                .showImg(200)
                .moveToTarget(_this.target2, 1000)
                .hideImg(200)
                .moveToTarget(_this.target3, 1)
                .showImg(200)
                .moveToTarget(_this.target4, 1000)
                .hideImg(200);
        });
    };
    return FingerSample;
}(ps.Behaviour));
qc.registerBehaviour('FingerSample', FingerSample);
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
pl状态回调(onInit、onStart、onEnding、onRetry、onResize)
如果实现了这几个函数，会在pl进行到相应状态的时候进行回调
*/ 
//# sourceMappingURL=FingerSample.js.map