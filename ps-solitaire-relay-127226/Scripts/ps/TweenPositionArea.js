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
    var TweenPositionArea = /** @class */ (function (_super) {
        __extends(TweenPositionArea, _super);
        function TweenPositionArea(gameObject) {
            var _this = _super.call(this, gameObject) || this;
            _this.serializableFields = {};
            // this.gameObject.alpha = 0;
            return _this;
        }
        TweenPositionArea.prototype.awake = function () {
        };
        TweenPositionArea.prototype.onStart = function () {
        };
        TweenPositionArea.prototype.onDragSuccess = function () {
            console.log("onDragSuccess");
        };
        TweenPositionArea.prototype.update = function () {
        };
        return TweenPositionArea;
    }(ps.Behaviour));
    ps.TweenPositionArea = TweenPositionArea;
    qc.registerBehaviour('ps.TweenPositionArea', TweenPositionArea);
})(ps || (ps = {}));
//# sourceMappingURL=DragTarget.js.map
