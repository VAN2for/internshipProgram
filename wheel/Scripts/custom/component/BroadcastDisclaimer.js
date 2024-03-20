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
     * @description
     * @author bin
     * @date 2023/02/17 17:50:06
     */
    var BroadcastDisclaimer = /** @class */ (function (_super) {
        __extends(BroadcastDisclaimer, _super);
        function BroadcastDisclaimer(gameObject) {
            var _this = _super.call(this, gameObject) || this;
            _this.cloneDisclaimerArr = [];
            _this.moveSpeed = -0.3;
            _this.intervalDis = 50;
            _this.isOpen = false;
            /** 序列化 */
            _this.serializableFields = {
                disclaimerCopy: qc.Serializer.NODE,
                moveSpeed: qc.Serializer.NUMBER,
                intervalDis: qc.Serializer.NUMBER,
            };
            return _this;
        }
        /** 试玩初始化的处理 */
        BroadcastDisclaimer.prototype.onInit = function () {
            this.copyLength = this.disclaimerCopy.textPhaser.width;
            var disclaimerCopyLayout = this.disclaimerCopy.getScript('ps.Layout');
            if (disclaimerCopyLayout) {
                disclaimerCopyLayout.enable = false;
            }
            this.disclaimerCopy.x = 0;
            this.cloneAndMoveDisclaimer();
        };
        BroadcastDisclaimer.prototype.cloneAndMoveDisclaimer = function () {
            var _this = this;
            this.isOpen = true;
            this.disclaimerCopy.visible = false;
            if (this.copyLength < UIRoot.width) {
                this.disclaimerCopy.visible = true;
            }
            else {
                var disX = [];
                for (var i = 0; i < 5; i++) {
                    var clone = this.game.add.clone(this.disclaimerCopy, this.disclaimerCopy.parent);
                    clone.visible = true;
                    this.cloneDisclaimerArr.push(clone);
                    clone.x = (this.copyLength + this.intervalDis) * (i - 2);
                    disX.push(clone.x);
                }
                this.maxDisX = this.getMax(disX);
                this.minDisX = this.getMin(disX);
                this.moveTimer = ps.timer.frameLoop(function () {
                    var deltaTime = qc_game.time.deltaTime;
                    var moveDis = _this.moveSpeed * deltaTime;
                    _this.cloneDisclaimerArr.forEach(function (item) {
                        item.x += moveDis;
                        if (_this.moveSpeed > 0) {
                            if (item.x >= _this.maxDisX + _this.copyLength) {
                                var gapdis = item.x - (_this.maxDisX + _this.copyLength + _this.intervalDis);
                                item.x = _this.minDisX + gapdis;
                            }
                        }
                        else {
                            if (item.x <= _this.minDisX - _this.copyLength) {
                                var gapdis = item.x - (_this.minDisX - _this.copyLength - _this.intervalDis);
                                item.x = _this.maxDisX + gapdis;
                            }
                        }
                    });
                }, this);
            }
        };
        BroadcastDisclaimer.prototype.stopMoveAndClearCloneDisclaimer = function () {
            ps.timer.removeFrameLoop(this.moveTimer);
            this.cloneDisclaimerArr.forEach(function (item) {
                item.destroy();
            });
            this.cloneDisclaimerArr = [];
        };
        BroadcastDisclaimer.prototype.onResize = function () {
            if (this.isOpen) {
                this.stopMoveAndClearCloneDisclaimer();
                this.cloneAndMoveDisclaimer();
            }
        };
        BroadcastDisclaimer.prototype.getMax = function (arr) {
            var number = arr[0];
            for (var i = 1; i < arr.length; i++) {
                if (number < arr[i])
                    number = arr[i];
            }
            return number;
        };
        BroadcastDisclaimer.prototype.getMin = function (arr) {
            var number = arr[0];
            for (var i = 1; i < arr.length; i++) {
                if (number > arr[i])
                    number = arr[i];
            }
            return number;
        };
        return BroadcastDisclaimer;
    }(ps.Behaviour));
    ps.BroadcastDisclaimer = BroadcastDisclaimer;
    qc.registerBehaviour("ps.BroadcastDisclaimer", BroadcastDisclaimer);
    BroadcastDisclaimer["__menu"] = "Custom/BroadcastDisclaimer";
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
//# sourceMappingURL=BroadcastDisclaimer.js.map