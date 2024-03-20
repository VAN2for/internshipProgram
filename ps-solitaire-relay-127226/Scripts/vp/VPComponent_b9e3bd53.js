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

    var VPComponent_b9e3bd53 = /** @class */ (function (_super) {
        __extends(VPComponent_b9e3bd53, _super);
        function VPComponent_b9e3bd53(gameObject) {
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

        VPComponent_b9e3bd53.prototype.awake = function () {
            var _this = this

            // ## awake ##

            // ## awake ##

        };

        VPComponent_b9e3bd53.prototype.update = async function () {
            var _this = this

            // ## update ##

            // ## update ##

        };

        VPComponent_b9e3bd53.prototype.onResize = function () {
            var _this = this;
            if (ps.ScrFix.isP && this.deviceRotate === 'l') {
                this.deviceRotate = 'p';
                ps.mainState.dispatch('DEVICE_ROTATE_P');
            } else if (ps.ScrFix.isL && this.deviceRotate === 'p') {
                this.deviceRotate = 'l';
                ps.mainState.dispatch('DEVICE_ROTATE_L');
            }
        };

        return VPComponent_b9e3bd53;
    }(ps.Behaviour));
    ps.VPComponent_b9e3bd53 = VPComponent_b9e3bd53;

    // ## register behaviour ##
    qc.registerBehaviour('ps.VPComponent_b9e3bd53', VPComponent_b9e3bd53);
    // ## register behaviour ##
})(ps || (ps = {}));
