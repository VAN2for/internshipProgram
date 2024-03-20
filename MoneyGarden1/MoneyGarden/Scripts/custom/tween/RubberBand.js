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
var RubberBand = /** @class */ (function (_super) {
    __extends(RubberBand, _super);
    function RubberBand(gameObject) {
        var _this = _super.call(this, gameObject) || this;
        /** 序列化 */
        _this.spd = 200; //缓动时长
        _this.serializableFields = {
            spd: qc.Serializer.NUMBER,
            isPlay: qc.Serializer.BOOLEAN,
            isHAni: qc.Serializer.BOOLEAN,
        };
        return _this;
    }
    RubberBand.prototype.awake = function () {
        var _this = this;
        this.gameObject.pivotX = 0.5;
        this.gameObject.pivotY = 0.5;
        if (!this.isPlay)
            return;
        this.rubberBandAni();
        qc_game.timer.loop(this.spd * 2, function () {
            _this.rubberBandAni();
        });
    };
    RubberBand.prototype.rubberBandAni = function () {
        var _this = this;
        var tar = this.gameObject;
        if (this.isHAni) {
            ps.Tween.to(tar, { scaleX: .9, scaleY: 1.1 }, this.spd, undefined, 0).onComplete.addOnce(function () {
                ps.Tween.to(tar, { scaleX: 1.1, scaleY: .9 }, _this.spd, undefined, 0).onComplete.addOnce(function () {
                });
            });
        }
        else {
            ps.Tween.to(tar, { scaleY: .9, scaleX: 1.1 }, this.spd, undefined, 0).onComplete.addOnce(function () {
                ps.Tween.to(tar, { scaleY: 1.1, scaleX: .9 }, _this.spd, undefined, 0).onComplete.addOnce(function () {
                });
            });
        }
    };
    return RubberBand;
}(qc.Behaviour));
qc.registerBehaviour('RubberBand', RubberBand);
