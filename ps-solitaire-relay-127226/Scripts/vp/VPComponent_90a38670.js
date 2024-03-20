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

    var VPComponent_90a38670 = /** @class */ (function (_super) {
        __extends(VPComponent_90a38670, _super);
        function VPComponent_90a38670(gameObject) {
            var _this = _super.call(this, gameObject) || this;
            _this.deviceRotate = ps.ScrFix.isP ? 'p' : 'l';
            // ## temp variable ##

             
      // temp var X2pnB7WjeBDA440
      _this._X2pnB7WjeBDA440 = true
      // temp var X2pnB7WjeBDA440
        
      // temp var tfFAcd7yQENB603
      _this._tfFAcd7yQENB603 = true
      // temp var tfFAcd7yQENB603
        
      // temp var Tjjs4w8dekNb476
      _this._Tjjs4w8dekNb476 = true
      // temp var Tjjs4w8dekNb476
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

        VPComponent_90a38670.prototype.awake = function () {
            var _this = this

            // ## awake ##

             
  // X2pnB7WjeBDA440
  
        ps.mainState.add("scenechange", async function(uuid){
          if(!0&&this._X2pnB7WjeBDA440&&this.gameObject.uuid === uuid) {
             qc_game.nodePool.find('90a38670-a89a-43e6-be2d-665aa937071b').vpCompute({"target":{"targetNode":"6d312b4e-1b7f-4049-8678-cf5b545d04d1","targetNodeScript":"ps.VPGamePlay","data":"button"},"method":"=","value":false,"valueType":"boolean"})
await qc_game.nodePool.find('90a38670-a89a-43e6-be2d-665aa937071b').vpWaitTime({"ms":0,"timerId":"timer_1"})
 qc_game.nodePool.find('7b5a042f-577a-4e51-8c22-0753914e9fa9').getScript('qc.Tween').vpPlayTween({})
 qc_game.nodePool.find('a48d21b8-0f8f-4650-9124-e1370dd25ade').getScript('qc.Tween').vpPlayTween({})
 qc_game.nodePool.find('407c8713-5e5b-4cc0-bbfb-a7a1a7bfd58e').getScript('qc.Tween').vpPlayTween({})
 qc_game.nodePool.find('0d7f53a6-4943-4fd6-84f1-9ed37cb8788a').getScript('ps.AudioNode').vpReplaySound({"loop":false,"loopNumber":1})
 qc_game.nodePool.find('a44e265b-1320-4bd9-bb36-201c674b39f4').vpPlayParticle({})
 qc_game.nodePool.find('c05b2bdf-d4f6-4050-b533-a30dd568c84c').vpPlayParticle({})
 qc_game.nodePool.find('37b0e1d8-6eea-455a-97c4-8cc940a43047').vpPlayParticle({})

          }
        }, this)
        
  // X2pnB7WjeBDA440
    
  // tfFAcd7yQENB603
  
        ps.mainState.add("DOWN", async function(uuid){
          if(!0&&this._tfFAcd7yQENB603&&'407c8713-5e5b-4cc0-bbfb-a7a1a7bfd58e' === uuid) {
             qc_game.nodePool.find('407c8713-5e5b-4cc0-bbfb-a7a1a7bfd58e').vpInstall({})

          }
        }, this)
        
  // tfFAcd7yQENB603
    
  // Tjjs4w8dekNb476
  
        ps.mainState.add("DOWN", async function(uuid){
          if(!0&&this._Tjjs4w8dekNb476&&'529d5165-ef4d-48d6-b6fd-601f5fdc0639' === uuid&&qc_game.nodePool.find('6d312b4e-1b7f-4049-8678-cf5b545d04d1').getScript('ps.VPGamePlay')._CAHtG6BFiYbM267 == true) {
             qc_game.nodePool.find('529d5165-ef4d-48d6-b6fd-601f5fdc0639').vpInstall({})

          }
        }, this)
        
  // Tjjs4w8dekNb476
   // ## awake ##

        };

        VPComponent_90a38670.prototype.update = async function () {
            var _this = this

            // ## update ##

            // ## update ##

        };

        VPComponent_90a38670.prototype.onResize = function () {
            var _this = this;
            if (ps.ScrFix.isP && this.deviceRotate === 'l') {
                this.deviceRotate = 'p';
                ps.mainState.dispatch('DEVICE_ROTATE_P');
            } else if (ps.ScrFix.isL && this.deviceRotate === 'p') {
                this.deviceRotate = 'l';
                ps.mainState.dispatch('DEVICE_ROTATE_L');
            }
        };

        return VPComponent_90a38670;
    }(ps.Behaviour));
    ps.VPComponent_90a38670 = VPComponent_90a38670;

    // ## register behaviour ##
    qc.registerBehaviour('ps.VPComponent_90a38670', VPComponent_90a38670);
    // ## register behaviour ##
})(ps || (ps = {}));
