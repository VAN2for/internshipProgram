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

    var VPTimer = /** @class */ (function (_super) {
        __extends(VPTimer, _super);
        function VPTimer(gameObject) {
            var _this = _super.call(this, gameObject) || this;

            // ## scope variable ##

            // ## scope variable ##

            _this.timers = {}

            /** 序列化 */
            _this.serializableFields = {
                timers: qc.Serializer.MAPPING,
                
                // ## serialize ##

                // ## serialize ##

                
            };
            return _this;
        }

        VPTimer.prototype.awake = function () {
            var _this = this

        };

        VPTimer.prototype.onStart = function () {
        };

        VPTimer.prototype.update = function () {
            var _this = this

            // ## update ##

            // ## update ##

        };

        return VPTimer;
    }(ps.Behaviour));
    ps.VPTimer = VPTimer;

    // ## register behaviour ##
    qc.registerBehaviour('ps.VPTimer', VPTimer);
    // ## register behaviour ##
})(ps || (ps = {}));
