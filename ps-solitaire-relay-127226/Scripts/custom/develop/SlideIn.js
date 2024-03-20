var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var ps;
(function (ps) {
    var tween;
    (function (tween) {
        var SlideIn = /** @class */ (function (_super) {
            __extends(SlideIn, _super);
            function SlideIn(gameObject) {
                var _this = _super.call(this, gameObject) || this;
                _this.direction = "up";
                _this.value = 100;
                /** 序列化 */
                _this.serializableFields = {
                    playOnAwake: qc.Serializer.BOOLEAN,
                    type: qc.Serializer.STRING,
                    duration: qc.Serializer.NUMBER,
                    direction: qc.Serializer.NUMBER,
                    value: qc.Serializer.STRING,
                    delay: qc.Serializer.NUMBER,
                };
                return _this;
            }
            return SlideIn;
        }(ps.tween.TweenBase));
        tween.SlideIn = SlideIn;
        qc.registerBehaviour('ps.tween.SlideIn', SlideIn);
        SlideIn["__menu"] = 'CustomTween/SlideIn';
    })(tween = ps.tween || (ps.tween = {}));
})(ps || (ps = {}));
