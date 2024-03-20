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
     * 摄像机，挂在容器上
     * @author  VaMP
     */
    var Camera = /** @class */ (function (_super) {
        __extends(Camera, _super);
        function Camera() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            /** 序列化 */
            _this.serializableFields = {
                x: qc.Serializer.NUMBER,
                y: qc.Serializer.NUMBER,
                limitEdgeX: qc.Serializer.BOOLEAN,
                limitEdgeY: qc.Serializer.BOOLEAN,
            };
            /** 是否限制边缘 */
            _this.limitEdgeX = true;
            _this.limitEdgeY = true;
            _this._x = 0;
            _this._y = 0;
            return _this;
        }
        Object.defineProperty(Camera.prototype, "x", {
            get: function () {
                return this._x;
            },
            set: function (v) {
                this.pos(v, this.y);
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Camera.prototype, "y", {
            get: function () {
                return this._y;
            },
            set: function (v) {
                this.pos(this.x, v);
            },
            enumerable: false,
            configurable: true
        });
        Camera.prototype.pos = function (x, y) {
            this._x = x;
            this._y = y;
            var sw = ps.ScrFix.width / this.gameObject.scaleX;
            var sh = ps.ScrFix.height / this.gameObject.scaleY;
            var tx = -this.x + sw / 2;
            var ty = -this.y + sh / 2;
            if (this.limitEdgeX) {
                if (tx > 0)
                    tx = 0;
                if (tx < -this.gameObject.width + sw)
                    tx = -this.gameObject.width + sw;
            }
            if (this.limitEdgeY) {
                if (ty > 0)
                    ty = 0;
                if (ty < -this.gameObject.height + sh)
                    ty = -this.gameObject.height + sh;
            }
            //中心点位置偏移
            tx += this.gameObject.pivotX * this.gameObject.width;
            ty += this.gameObject.pivotY * this.gameObject.height;
            //缩放
            tx *= this.gameObject.scaleX;
            ty *= this.gameObject.scaleY;
            //
            this.gameObject.x = tx;
            this.gameObject.y = ty;
        };
        Camera.prototype.onResize = function () {
            this.pos(this.x, this.y);
        };
        return Camera;
    }(ps.Behaviour));
    ps.Camera = Camera;
    qc.registerBehaviour("Camera", Camera);
})(ps || (ps = {}));
//# sourceMappingURL=Camera.js.map