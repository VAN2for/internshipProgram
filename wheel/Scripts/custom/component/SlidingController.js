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
     * 滑动控制器
     * @author  VaMP
     */
    var SlidingController = /** @class */ (function (_super) {
        __extends(SlidingController, _super);
        function SlidingController() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            /** 序列化 */
            _this.serializableFields = {
                pointer: qc.Serializer.POINT,
                spd: qc.Serializer.POINT,
                damp: qc.Serializer.POINT,
                areaX: qc.Serializer.POINT,
                areaY: qc.Serializer.POINT,
            };
            /** 摇杆点数据（起始位置） */
            _this.pointer = new qc.Point();
            /** 滑动速度比例 */
            _this.spd = new qc.Point(1, 1);
            /** 阻尼效果值 */
            _this.damp = new qc.Point(4, 4);
            /** X操作范围(两个都0则不限制) */
            _this.areaX = new qc.Point();
            /** Y操作范围(两个都0则不限制) */
            _this.areaY = new qc.Point();
            /** 是否正在操作 */
            _this.inTouch = false;
            _this.canCtrl = true;
            _this.tx = 0;
            _this.ty = 0;
            _this.lastMouseX = 0;
            _this.lastMouseY = 0;
            _this.singal = new qc.Signal();
            _this.singalDown = new qc.Signal();
            _this.singalUp = new qc.Signal();
            return _this;
        }
        Object.defineProperty(SlidingController.prototype, "px", {
            //-----------------------
            /** 当前滑动控制器位置X */
            get: function () {
                return this.pointer.x;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(SlidingController.prototype, "py", {
            /** 当前滑动控制器位置Y */
            get: function () {
                return this.pointer.y;
            },
            enumerable: false,
            configurable: true
        });
        SlidingController.prototype.awake = function () {
            this.tx = this.pointer.x;
            this.ty = this.pointer.y;
            this.gameObject.interactive = true;
        };
        SlidingController.prototype.setPointer = function (x, y) {
            this.pointer.x = x;
            this.pointer.y = y;
            this.tx = x;
            this.ty = y;
        };
        /** 设置X范围 */
        SlidingController.prototype.setAreaX = function (min, max) {
            this.areaX.x = min;
            this.areaX.y = max;
            this.checkArea();
        };
        /** 设置Y范围 */
        SlidingController.prototype.setAreaY = function (min, max) {
            this.areaY.x = min;
            this.areaY.y = max;
            this.checkArea();
        };
        /** 检测范围 */
        SlidingController.prototype.checkArea = function () {
            if (this.areaX.x != this.areaX.y) {
                this.tx = Math.max(this.tx, this.areaX.x);
                this.tx = Math.min(this.tx, this.areaX.y);
            }
            if (this.areaY.x != this.areaY.y) {
                this.ty = Math.max(this.ty, this.areaY.x);
                this.ty = Math.min(this.ty, this.areaY.y);
            }
        };
        /**
         * 监听移动事件
         * @param type
         * @param listener
         * @param caller
         */
        SlidingController.prototype.listen = function (type, listener, caller, isOnce) {
            if (type === void 0) { type = "move"; }
            if (isOnce === void 0) { isOnce = false; }
            if (isOnce) {
                this.once(type, listener, caller);
            }
            else {
                this.on(type, listener, caller);
            }
        };
        /**
         * 监听移动事件
         * @param type
         * @param listener
         * @param caller
         */
        SlidingController.prototype.on = function (type, listener, caller) {
            if (type === void 0) { type = "move"; }
            switch (type) {
                case "move":
                    this.singal.add(listener, caller);
                    break;
                case "up":
                    this.singalUp.add(listener, caller);
                    break;
                case "down":
                    this.singalDown.add(listener, caller);
                    break;
            }
        };
        /**
         * 监听移动事件
         * @param type
         * @param listener
         * @param caller
         */
        SlidingController.prototype.once = function (type, listener, caller) {
            if (type === void 0) { type = "move"; }
            switch (type) {
                case "move":
                    this.singal.addOnce(listener, caller);
                    break;
                case "up":
                    this.singalUp.addOnce(listener, caller);
                    break;
                case "down":
                    this.singalDown.add(listener, caller);
                    break;
            }
        };
        SlidingController.prototype.onDown = function (e) {
            this.inTouch = true;
            this.lastMouseX = e.source.x;
            this.lastMouseY = e.source.y;
            this.singalDown.dispatch();
        };
        SlidingController.prototype.onDrag = function (e) {
            if (!this.inTouch)
                return;
            if (this.canCtrl) {
                this.tx += (e.source.x - this.lastMouseX) * this.spd.x;
                this.ty += (e.source.y - this.lastMouseY) * this.spd.y;
                this.checkArea();
                this.lastMouseX = e.source.x;
                this.lastMouseY = e.source.y;
            }
        };
        SlidingController.prototype.onUp = function (e) {
            this.inTouch = false;
            this.singalUp.dispatch();
        };
        SlidingController.prototype.update = function () {
            this.pointer.x = ps.Mathf.damp(this.pointer.x, this.tx, this.damp.x);
            this.pointer.y = ps.Mathf.damp(this.pointer.y, this.ty, this.damp.y);
            //发送事件
            if (this.pointer.x != this.tx || this.pointer.y != this.tx) {
                this.singal.dispatch(this.pointer.x, this.pointer.y);
            }
        };
        return SlidingController;
    }(ps.Behaviour));
    qc.registerBehaviour("SlidingController", SlidingController);
})(ps || (ps = {}));
//# sourceMappingURL=SlidingController.js.map