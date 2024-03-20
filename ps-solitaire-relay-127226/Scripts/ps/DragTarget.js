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
    var DragTarget = /** @class */ (function (_super) {
        __extends(DragTarget, _super);
        function DragTarget(gameObject) {
            var _this = _super.call(this, gameObject) || this;
            _this.serializableFields = {};
            this.gameObject.alpha = 0;
            return _this;
        }
        DragTarget.prototype.awake = function () {
        };
        DragTarget.prototype.onStart = function () {
        };
        DragTarget.prototype.onDragSuccess = function () {
            console.log("onDragSuccess");
        };
        DragTarget.prototype.update = function () {
        };
        return DragTarget;
    }(ps.Behaviour));
    ps.DragTarget = DragTarget;
    qc.registerBehaviour('ps.DragTarget', DragTarget);
})(ps || (ps = {}));
//# sourceMappingURL=DragTarget.js.map
