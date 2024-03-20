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
     * 指引手指组件，设置目标对象来进行移动，旋转屏幕可自动适配
     * @author VaMP
     */
    var Finger = /** @class */ (function (_super) {
        __extends(Finger, _super);
        function Finger(gameObject) {
            var _this = _super.call(this, gameObject) || this;
            /** 显示，隐藏渐变效果持续时长 */
            _this.showAniTime = 300;
            _this.isShow = false;
            //img: qc.UIImage;
            /** 序列化 */
            _this.serializableFields = {
                showAniTime: qc.Serializer.NUMBER,
            };
            return _this;
        }
        Finger.prototype.awake = function () {
            this.gameObject.visible = false;
            //     this.img = new qc.UIImage(qc_game, this.gameObject);
            //     let gb = this.gameObject as qc.UIImage;
            //     this.img.texture = gb.texture;
            //     this.img.resetNativeSize();
            //     this.img.pivotX = this.gameObject.pivotX;
            //     this.img.pivotY = this.gameObject.pivotY;
            //     gb.texture = undefined;
        };
        /** 当脚本被移除时，会自动调用 */
        Finger.prototype.onDestroy = function () {
            if (this.showTimer)
                ps.timer.remove(this.showTimer);
        };
        /**
         * 显示
         * @param resetScale 重置缩放值
         * @param delay 延迟播放时间
         */
        Finger.prototype.show = function (resetScale, delay) {
            var _this = this;
            if (resetScale === void 0) { resetScale = true; }
            if (delay === void 0) { delay = 0; }
            if (this.showTimer)
                ps.timer.remove(this.showTimer);
            if (delay > 0) {
                this.showTimer = ps.timer.once(delay, function () {
                    _this.show(resetScale);
                    _this.reset();
                });
                return;
            }
            if (this.isShow)
                return;
            this.isShow = true;
            ps.Tween.showAlpha(this, this.showAniTime);
            if (resetScale)
                this.setScale(1);
            this.reset();
        };
        /** 隐藏 */
        Finger.prototype.hide = function () {
            if (!this.isShow)
                return;
            this.isShow = false;
            this.stopScaleEffect();
            ps.Tween.hideAlpha(this, this.showAniTime, 0, "hide");
            this.clearTweener(true);
        };
        /**
         * 设置手指缩放值
         * @param x 缩放值X
         * @param y 缩放值Y
         */
        Finger.prototype.setScale = function (x, y) {
            if (y === undefined)
                y = x;
            this.gameObject.scaleX = x;
            this.gameObject.scaleY = y;
        };
        /**
         * 显示缩放效果
         * @param scale
         * @param time
         */
        Finger.prototype.showScaleEffect = function (scale, time) {
            if (scale === void 0) { scale = -0.2; }
            if (time === void 0) { time = 500; }
            ps.Tween.zoom(this, scale, time);
        };
        /**
         * 停止缩放效果
         */
        Finger.prototype.stopScaleEffect = function () {
            ps.Tween.clearAll(this);
        };
        //单次，带适配---------------------------------------------------------------------
        /**
         * 移动到目标对象位置，有适配
         * @param target 目标对象
         * @param duration 移动时间，0为瞬间到达，默认0
         * @param offset 偏移坐标值，默认（0,0）
         * @param pivot 指引轴心值，默认使用目标对象轴心
         */
        Finger.prototype.moveToTarget0 = function (target, duration, offset, pivot) {
            var _this = this;
            if (duration === void 0) { duration = 0; }
            if (offset === void 0) { offset = new qc.Point(); }
            if (pivot === void 0) { pivot = new qc.Point(target.pivotX, target.pivotY); }
            if (duration <= 0)
                duration = 1;
            this.onceCB = function () {
                var offsetPos = new qc.Point(target.width * (pivot.x - target.pivotX) + offset.x, target.height * (pivot.y - target.pivotY) + offset.y);
                var pos = ps.Tools.transPos(target, _this.gameObject, offsetPos);
                _this.moveToPoint0(pos.x, pos.y, duration);
            };
            this.reset();
        };
        /**
         * 移动到坐标位置
         * @param x
         * @param y
         * @param duration 移动时间，0为瞬间到达，默认0
         */
        Finger.prototype.moveToPoint0 = function (x, y, duration) {
            if (duration === void 0) { duration = 0; }
            if (duration > 0) {
                ps.Tween.to(this, { x: x, y: y }, duration, Phaser.Easing.Sinusoidal.InOut);
            }
            else {
                this.pos(x, y);
            }
        };
        //流程方法--------------------------------------------------------------------------------
        /**
         * 等待时间（什么都不做
         * @param duration 持续时间
         */
        Finger.prototype.waitTime = function (duration) {
            if (duration === void 0) { duration = 200; }
            return this.tweenTo({}, duration);
        };
        /**
         * 显示
         * @param duration 持续时间，默认200
         */
        Finger.prototype.showImg = function (duration) {
            if (duration === void 0) { duration = 200; }
            return this.tweenTo({ alpha: 1 }, duration);
        };
        /**
         * 隐藏
         * @param duration 持续时间，默认200
         */
        Finger.prototype.hideImg = function (duration) {
            if (duration === void 0) { duration = 200; }
            return this.tweenTo({ alpha: 0 }, duration);
        };
        /**
         * 缩放
         * @param scale 缩放到的值
         * @param duration 持续时间，默认200
         */
        Finger.prototype.scaleImg = function (scale, duration) {
            if (duration === void 0) { duration = 200; }
            return this.tweenTo({ scaleX: scale, scaleY: scale }, duration);
        };
        /**
         * 移动到目标对象的位置
         * @param target 目标对象
         * @param duration 移动时长
         * @param offset 坐标偏移量
         * @param pivot 指引轴心值，默认使用目标对象轴心
         */
        Finger.prototype.moveToTarget = function (target, duration, offset, pivot) {
            if (duration === void 0) { duration = 1; }
            if (offset === void 0) { offset = new qc.Point(); }
            if (pivot === void 0) { pivot = new qc.Point(target.pivotX, target.pivotY); }
            var offsetPos = new qc.Point(target.width * (pivot.x - target.pivotX) + offset.x, target.height * (pivot.y - target.pivotY) + offset.y);
            var pos = ps.Tools.transPos(target, this.gameObject, offsetPos);
            this.moveToPoint(pos.x, pos.y, duration);
            return this;
        };
        /**
         * 移动到目标点
         * @param x 坐标X
         * @param y 坐标Y
         * @param duration 移动时长
         */
        Finger.prototype.moveToPoint = function (x, y, duration) {
            if (duration === void 0) { duration = 1; }
            return this.tweenTo({ x: x, y: y }, duration);
        };
        /**
         * 缓动到目标参数值
         * @param props 目标参数值
         * @param duration 持续时间
         */
        Finger.prototype.tweenTo = function (props, duration, easing) {
            if (easing === void 0) { easing = Phaser.Easing.Sinusoidal.InOut; }
            if (this.tweener) {
                this.tweener.to(props, duration, easing);
            }
            else {
                this.tweener = ps.Tween.to(this, props, duration, easing, undefined, false);
            }
            return this;
        };
        /**
         * 清理缓动
         */
        Finger.prototype.clearTweener = function (clearCB) {
            if (clearCB === void 0) { clearCB = false; }
            if (this.tweener) {
                ps.Tween.clear(this.tweener);
                this.tweener = undefined;
                if (clearCB) {
                    this.onceCB = undefined;
                    this.loopCB = undefined;
                }
            }
            return this;
        };
        /**
         * 开始流程
         * @param cb
         */
        Finger.prototype.startLoop = function (cb) {
            var _this = this;
            if (cb) {
                var ncb_1 = function () {
                    _this.clearTweener();
                    cb();
                    _this.tweener.start();
                    _this.tweener.onComplete.addOnce(ncb_1);
                };
                this.onceCB = undefined;
                this.loopCB = ncb_1;
            }
            this.reset();
        };
        Finger.prototype.onResize = function () {
            var _this = this;
            //延迟一帧，避免对象坐标还未更新
            ps.timer.once(1, function () {
                _this.reset();
            });
        };
        /**
         * 重新播放
         */
        Finger.prototype.reset = function () {
            if (!this.isShow)
                return;
            if (this.onceCB) {
                this.onceCB();
            }
            else if (this.loopCB) {
                this.loopCB();
            }
        };
        return Finger;
    }(ps.Behaviour));
    ps.Finger = Finger;
    qc.registerBehaviour("ps.Finger", Finger);
    Finger["__menu"] = "Custom/Finger";
})(ps || (ps = {}));
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
//# sourceMappingURL=Finger.js.map