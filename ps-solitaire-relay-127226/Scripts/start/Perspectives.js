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
    var Perspectives = /** @class */ (function (_super) {
        __extends(Perspectives, _super);
        function Perspectives(gameObject) {
            var _this = _super.call(this, gameObject) || this;
            _this.serializableFields = {
            // Put your fields here
            };
            // Init the behaviour here
            console.log("drawcomplete");
            return _this;
        }
        Perspectives.prototype.awake = function () {
            var sp = new qc.Graphics(qc_game, this.gameObject);
            sp.beginFill(0x000000, 0.8);
            sp.drawCircle(0, 0, 500);
            sp.endFill();
            // sp.blendMode = PIXI.blendModes.DIFFERENCE;
        };
        Perspectives.prototype.update = function () {
        };
        return Perspectives;
    }(qc.Behaviour));
    ps.Perspectives = Perspectives;
    qc.registerBehaviour('ps.Perspectives', Perspectives);
})(ps || (ps = {}));
//# sourceMappingURL=Perspectives.js.map