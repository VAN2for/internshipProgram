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

    var VPComponent_f88c3409 = /** @class */ (function (_super) {
        __extends(VPComponent_f88c3409, _super);
        function VPComponent_f88c3409(gameObject) {
            var _this = _super.call(this, gameObject) || this;
            _this.deviceRotate = ps.ScrFix.isP ? 'p' : 'l';
            // ## temp variable ##

            // ## temp variable ##

            // ## scope variable ##

            // ## scope variable ##

            /** 序列化 */
            _this.serializableFields = {

                // ## serialize ##

                // ## serialize ##
            };
            return _this;
        }

        VPComponent_f88c3409.prototype.awake = function () {
            var _this = this

            // ## awake ##

            // ## awake ##

        };

        VPComponent_f88c3409.prototype.update = async function () {
            var _this = this

            // ## update ##

            // ## update ##

        };

        VPComponent_f88c3409.prototype.onResize = function () {
            var _this = this;
            if (ps.ScrFix.isP && this.deviceRotate === 'l') {
                this.deviceRotate = 'p';
                ps.mainState.dispatch('DEVICE_ROTATE_P');
            } else if (ps.ScrFix.isL && this.deviceRotate === 'p') {
                this.deviceRotate = 'l';
                ps.mainState.dispatch('DEVICE_ROTATE_L');
            }
        };

        return VPComponent_f88c3409;
    }(ps.Behaviour));
    ps.VPComponent_f88c3409 = VPComponent_f88c3409;

    // ## register behaviour ##
    qc.registerBehaviour('ps.VPComponent_f88c3409', VPComponent_f88c3409);
    // ## register behaviour ##
})(ps || (ps = {}));
