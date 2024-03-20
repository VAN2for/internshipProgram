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

    var VPComponent_ed49659d = /** @class */ (function (_super) {
        __extends(VPComponent_ed49659d, _super);
        function VPComponent_ed49659d(gameObject) {
            var _this = _super.call(this, gameObject) || this;
            _this.deviceRotate = ps.ScrFix.isP ? 'p' : 'l';
            // ## temp variable ##

             
      // temp var r7YbBwwKpy4f340
      _this._r7YbBwwKpy4f340 = true
      // temp var r7YbBwwKpy4f340
        
      // temp var aJMB5JXDTzQi559
      _this._aJMB5JXDTzQi559 = true
      // temp var aJMB5JXDTzQi559
        
      // temp var Kk5AJwZrdkZJ491
      _this._Kk5AJwZrdkZJ491 = true
      // temp var Kk5AJwZrdkZJ491
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

        VPComponent_ed49659d.prototype.awake = function () {
            var _this = this

            // ## awake ##

             
  // r7YbBwwKpy4f340
  
        ps.mainState.add("scenechange", async function(uuid){
          if(!0&&this._r7YbBwwKpy4f340&&this.gameObject.uuid === uuid) {
             qc_game.nodePool.find('ed49659d-a7bc-4288-a64d-f9ccc1bed08f').vpCompute({"target":{"targetNode":"6d312b4e-1b7f-4049-8678-cf5b545d04d1","targetNodeScript":"ps.VPGamePlay","data":"ctat_tap"},"method":"=","value":false,"valueType":"boolean"})
 qc_game.nodePool.find('21c47f03-289a-4325-86ef-cde3fc39bf91').getScript('qc.Tween').vpPlayTween({})
 qc_game.nodePool.find('e1e5ab7b-89d2-42e8-9a82-0f9245e69216').getScript('qc.Tween').vpPlayTween({})
 qc_game.nodePool.find('5bd05063-7977-4b8e-985c-6413b258201c').getScript('qc.Tween').vpPlayTween({})
 qc_game.nodePool.find('e1b85c5d-c558-4bd5-80af-dbb3e115f5a1').vpPlayParticle({})
 qc_game.nodePool.find('b41b7e44-7dc4-4817-ad8a-66f45d31adea').vpPlayParticle({})
 qc_game.nodePool.find('53f05819-51d9-4f10-a27c-01470a8993dd').getScript('ps.AudioNode').vpReplaySound({"loop":false,"loopNumber":1})
 qc_game.nodePool.find('bbe0d3d2-5b04-4348-8411-fe1cfae3b662').getScript('ps.AudioNode').vpReplaySound({"loop":true,"loopNumber":1})
await qc_game.nodePool.find('ed49659d-a7bc-4288-a64d-f9ccc1bed08f').vpWaitTime({"ms":"0.5","timerId":"timer_3"})
 qc_game.nodePool.find('14169227-9734-4a08-a760-c2614b1c7360').getScript('qc.Tween').vpPlayTween({})
 qc_game.nodePool.find('3470c5c7-767e-4981-ad52-e5289265c734').getScript('qc.Tween').vpPlayTween({})

          }
        }, this)
        
  // r7YbBwwKpy4f340
    
  // aJMB5JXDTzQi559
  
        ps.mainState.add("DOWN", async function(uuid){
          if(!0&&this._aJMB5JXDTzQi559&&'14169227-9734-4a08-a760-c2614b1c7360' === uuid) {
             qc_game.nodePool.find('14169227-9734-4a08-a760-c2614b1c7360').vpInstall({})
 qc_game.nodePool.find('3d02f419-e4af-41bd-ae0b-c27008f09c3f').getScript('ps.AudioNode').vpReplaySound({"loop":false,"loopNumber":1})

          }
        }, this)
        
  // aJMB5JXDTzQi559
    
  // Kk5AJwZrdkZJ491
  
        ps.mainState.add("DOWN", async function(uuid){
          if(!0&&this._Kk5AJwZrdkZJ491&&'3470c5c7-767e-4981-ad52-e5289265c734' === uuid) {
             qc_game.nodePool.find('3470c5c7-767e-4981-ad52-e5289265c734').vpInstall({})
 qc_game.nodePool.find('3d02f419-e4af-41bd-ae0b-c27008f09c3f').getScript('ps.AudioNode').vpReplaySound({"loop":false,"loopNumber":1})

          }
        }, this)
        
  // Kk5AJwZrdkZJ491
   // ## awake ##

        };

        VPComponent_ed49659d.prototype.update = async function () {
            var _this = this

            // ## update ##

            // ## update ##

        };

        VPComponent_ed49659d.prototype.onResize = function () {
            var _this = this;
            if (ps.ScrFix.isP && this.deviceRotate === 'l') {
                this.deviceRotate = 'p';
                ps.mainState.dispatch('DEVICE_ROTATE_P');
            } else if (ps.ScrFix.isL && this.deviceRotate === 'p') {
                this.deviceRotate = 'l';
                ps.mainState.dispatch('DEVICE_ROTATE_L');
            }
        };

        return VPComponent_ed49659d;
    }(ps.Behaviour));
    ps.VPComponent_ed49659d = VPComponent_ed49659d;

    // ## register behaviour ##
    qc.registerBehaviour('ps.VPComponent_ed49659d', VPComponent_ed49659d);
    // ## register behaviour ##
})(ps || (ps = {}));
