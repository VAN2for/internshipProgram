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

    var VPComponent_52c4b54a = /** @class */ (function (_super) {
        __extends(VPComponent_52c4b54a, _super);
        function VPComponent_52c4b54a(gameObject) {
            var _this = _super.call(this, gameObject) || this;
            _this.deviceRotate = ps.ScrFix.isP ? 'p' : 'l';
            // ## temp variable ##

             
      // temp var yim4y5HzJmSE467
      _this._yim4y5HzJmSE467 = true
      // temp var yim4y5HzJmSE467
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

        VPComponent_52c4b54a.prototype.awake = function () {
            var _this = this

            // ## awake ##

             
  // yim4y5HzJmSE467
  
        ps.mainState.add("DOWN", async function(uuid){
          if(!0&&this._yim4y5HzJmSE467&&'15fb376e-60e7-4798-81d8-26bfd03dc9d3' === uuid&&qc_game.nodePool.find('6d312b4e-1b7f-4049-8678-cf5b545d04d1').getScript('ps.VPGamePlay')._CAHtG6BFiYbM267 == true) {
             qc_game.nodePool.find('15fb376e-60e7-4798-81d8-26bfd03dc9d3').vpInstall({})

          }
        }, this)
        
  // yim4y5HzJmSE467
   // ## awake ##

        };

        VPComponent_52c4b54a.prototype.update = async function () {
            var _this = this

            // ## update ##

            // ## update ##

        };

        VPComponent_52c4b54a.prototype.onResize = function () {
            var _this = this;
            if (ps.ScrFix.isP && this.deviceRotate === 'l') {
                this.deviceRotate = 'p';
                ps.mainState.dispatch('DEVICE_ROTATE_P');
            } else if (ps.ScrFix.isL && this.deviceRotate === 'p') {
                this.deviceRotate = 'l';
                ps.mainState.dispatch('DEVICE_ROTATE_L');
            }
        };

        return VPComponent_52c4b54a;
    }(ps.Behaviour));
    ps.VPComponent_52c4b54a = VPComponent_52c4b54a;

    // ## register behaviour ##
    qc.registerBehaviour('ps.VPComponent_52c4b54a', VPComponent_52c4b54a);
    // ## register behaviour ##
})(ps || (ps = {}));
