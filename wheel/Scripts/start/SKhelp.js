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
    var SKhelp = /** @class */ (function (_super) {
        __extends(SKhelp, _super);
        function SKhelp(gameObject) {
            return _super.call(this, gameObject) || this;
        }
        SKhelp.prototype.awake = function () {
            this.gameObject.interactive = true;
            var sk = this.gameObject;
            sk.playAnimation("fail", 2, true);
        };
        SKhelp.prototype.update = function () {
        };
        SKhelp.prototype.onDown = function () {
        };
        return SKhelp;
    }(qc.Behaviour));
    ps.SKhelp = SKhelp;
    qc.registerBehaviour('ps.SKhelp', SKhelp);
})(ps || (ps = {}));
//# sourceMappingURL=SKhelp.js.map