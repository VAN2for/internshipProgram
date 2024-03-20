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

    var VPComponent_c970ab2f = /** @class */ (function (_super) {
        __extends(VPComponent_c970ab2f, _super);
        function VPComponent_c970ab2f(gameObject) {
            var _this = _super.call(this, gameObject) || this;
            _this.deviceRotate = ps.ScrFix.isP ? 'p' : 'l';
            // ## temp variable ##

             
      // temp var p3ZHG8dPr8AX064
      _this._p3ZHG8dPr8AX064 = true
      // temp var p3ZHG8dPr8AX064
        
      // temp var MCf8GGsKxHfx045
      _this._MCf8GGsKxHfx045 = true
      // temp var MCf8GGsKxHfx045
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

        VPComponent_c970ab2f.prototype.awake = function () {
            var _this = this

            // ## awake ##

             
  // p3ZHG8dPr8AX064
  
        ps.mainState.add("DOWN", async function(uuid){
          if(!0&&this._p3ZHG8dPr8AX064&&'2a3f6bd9-e0b4-46b3-9ef4-6cb2d4651510' === uuid&&qc_game.nodePool.find('6d312b4e-1b7f-4049-8678-cf5b545d04d1').getScript('ps.VPGamePlay')._m7Qj5ysCsjip634 == true) {
             qc_game.nodePool.find('2a3f6bd9-e0b4-46b3-9ef4-6cb2d4651510').vpInstall({})
 qc_game.nodePool.find('9c092769-ae41-4654-9922-0754cadb7b47').getScript('ps.AudioNode').vpReplaySound({"loop":false,"loopNumber":1})

          }
        }, this)
        
  // p3ZHG8dPr8AX064
    
  // MCf8GGsKxHfx045
  
        ps.mainState.add("DOWN", async function(uuid){
          if(!0&&this._MCf8GGsKxHfx045&&'00db6e32-5f03-4720-90c8-74c76ddfe6cd' === uuid&&qc_game.nodePool.find('6d312b4e-1b7f-4049-8678-cf5b545d04d1').getScript('ps.VPGamePlay')._m7Qj5ysCsjip634 == true) {
             qc_game.nodePool.find('00db6e32-5f03-4720-90c8-74c76ddfe6cd').vpInstall({})
 qc_game.nodePool.find('9c092769-ae41-4654-9922-0754cadb7b47').getScript('ps.AudioNode').vpReplaySound({"loop":false,"loopNumber":1})

          }
        }, this)
        
  // MCf8GGsKxHfx045
   // ## awake ##

        };

        VPComponent_c970ab2f.prototype.update = async function () {
            var _this = this

            // ## update ##

            // ## update ##

        };

        VPComponent_c970ab2f.prototype.onResize = function () {
            var _this = this;
            if (ps.ScrFix.isP && this.deviceRotate === 'l') {
                this.deviceRotate = 'p';
                ps.mainState.dispatch('DEVICE_ROTATE_P');
            } else if (ps.ScrFix.isL && this.deviceRotate === 'p') {
                this.deviceRotate = 'l';
                ps.mainState.dispatch('DEVICE_ROTATE_L');
            }
        };

        return VPComponent_c970ab2f;
    }(ps.Behaviour));
    ps.VPComponent_c970ab2f = VPComponent_c970ab2f;

    // ## register behaviour ##
    qc.registerBehaviour('ps.VPComponent_c970ab2f', VPComponent_c970ab2f);
    // ## register behaviour ##
})(ps || (ps = {}));
