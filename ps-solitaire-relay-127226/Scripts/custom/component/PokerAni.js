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
var PokerAni = /** @class */ (function (_super) {
    __extends(PokerAni, _super);
    function PokerAni(gameObject) {
        var _this = _super.call(this, gameObject) || this;
        /** 序列化 */
        _this.duration = 200;
        _this.serializableFields = {
            duration: qc.Serializer.NUMBER,
        };
        return _this;
    }
    PokerAni.prototype.onStart = function () {
        var facePic = this.gameObject.getChildAt(0); //待显示的对象
        var picBack = this.gameObject.getChildAt(1); //翻转对象
        facePic.scaleX = -0.5;
        facePic.pivotX = facePic.pivotY = 0.5;
        facePic.alpha = 0;
        picBack.pivotX = picBack.pivotY = 0.5;
        picBack.scaleY = picBack.scaleX = 0.5;
        ps.Tween.to(picBack, { scaleX: -1, alpha: 0 }, this.duration);
        ps.Tween.to(facePic, { scaleX: 1, alpha: 1 }, this.duration, undefined, 100);
    };
    return PokerAni;
}(ps.Behaviour));
qc.registerBehaviour('PokerAni', PokerAni);
//# sourceMappingURL=PokerAni.js.map