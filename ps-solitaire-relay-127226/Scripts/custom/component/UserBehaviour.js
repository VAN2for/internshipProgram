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
  /**
   * 可以运行代码的组件
   * @author VaMP
   */
  var UserBehaviour = /** @class */ (function (_super) {
      __extends(UserBehaviour, _super);
      function UserBehaviour() {
          var _this = _super !== null && _super.apply(this, arguments) || this;
          _this.awakeCode = "";
          _this.onStartCode = "";
          _this.onDownCode = "";
          _this.onEndCode = "";
          _this.onEnableDone = false;
          /** 序列化 */
          _this.serializableFields = {
              awakeCode: qc.Serializer.STRING,
              onStartCode: qc.Serializer.STRING,
              onDownCode: qc.Serializer.STRING,
              onEndCode: qc.Serializer.STRING
          };
          return _this;
      }
      UserBehaviour.prototype.showUIAfterVideo = function () {
        this.gameObject.visible = false;
        var self = this;
        gameEvent.add("playComplete",function(sceneId){
          var gamePlay = qc.gameOb.world.children[0]._findByName('gamePlay');
          var vb = gamePlay.getScript('ps.VideoBeh');
          if (typeof vb !== 'undefined' && vb.isEcPlus) {
            var node = self.gameObject;
            while(node.parent.name !== 'gamePlay') {
              node = node.parent;
            }
            if (node.uuid === sceneId) {
              self.gameObject.visible = true;
            }
          } else {
            self.gameObject.visible = true;

          }
          
          var mc = self.gameObject.getScript('ps.MovieClip');
          if(mc)
          {
            mc.stop();
            mc.playBefore();
          }
        });
      };
      UserBehaviour.prototype.hideUIAfterVideo = function () {
        var self = this;
        gameEvent.add("playComplete",function(sceneId){
          var gamePlay = qc.gameOb.world.children[0]._findByName('gamePlay');
          var vb = gamePlay.getScript('ps.VideoBeh');
          if (typeof vb !== 'undefined' && vb.isEcPlus) {
            var node = self.gameObject;
            while(node.parent.name !== 'gamePlay') {
              node = node.parent;
            }
            if (node.uuid === sceneId) {
              self.gameObject.visible = false;
            }
          } else {
            self.gameObject.visible = false;
          }
        });
      };
      UserBehaviour.prototype.directEndAfterVideo = function () {
        var self = this;
        gameEvent.add("playComplete",function(sceneId){
          var gamePlay = qc.gameOb.world.children[0]._findByName('gamePlay');
          var vb = gamePlay.getScript('ps.VideoBeh');
          if (typeof vb !== 'undefined' && vb.isEcPlus) {
            var node = self.gameObject;
            while(node.parent.name !== 'gamePlay') {
              node = node.parent;
            }
            if (node.uuid === sceneId) {
              vb.startTurn();
            }
          }
        });
      };
      UserBehaviour.prototype.switchNextSceneAfterVideo = function () {
        var self = this;
        gameEvent.add("playComplete",function(sceneId){
          var gamePlay = qc.gameOb.world.children[0]._findByName('gamePlay');
          var vb = gamePlay.getScript('ps.VideoBeh');
          if (typeof vb !== 'undefined' && vb.isEcPlus) {
            var node = self.gameObject;
            while(node.parent.name !== 'gamePlay') {
              node = node.parent;
            }
            if (node.uuid === sceneId) {
              var gamePlay = node.parent;
              var nextScene;
              for (var i = 0; i < gamePlay.children.length; i++) {
                if (gamePlay.children[i].uuid === sceneId) {
                  gamePlay.children[i].visible = false;
                  if (i === gamePlay.children.length - 1) {
                    vb.startTurn();
                    ps.mainState.dispatch(ps.GameState.SCENECHANGE, 'end');
                  } else {
                    nextScene = gamePlay.children[i + 1];
                    nextScene.visible = true;
                    ps.mainState.dispatch(ps.GameState.SCENECHANGE, nextScene.uuid);
                  }
                  break;
                }
              }
            }
          }
        });
      };
      UserBehaviour.prototype.hideUIWhenEnding = function () {
        var self = this; ps.mainState.addOnce(ps.GameState.END,function(){ self.gameObject.visible = false;});
      };
      UserBehaviour.prototype.hideUIWhenClickScreen = function () {
        var self = this; qc_game.input.onPointerDown.add(function(){ self.gameObject.visible = false; });
      };
      UserBehaviour.prototype.showUIWhenClickScreen = function () {
        this.gameObject.visible = false;
        var self = this; qc_game.input.onPointerDown.add(function(){ self.gameObject.visible = true; })
      };
      UserBehaviour.prototype.hideUIAfterItWasClicked = function () {
        this.gameObject.visible = false;
      };
      UserBehaviour.prototype.doInstallAfterInstall = function () {
        ps.install();
      };
      UserBehaviour.prototype.installWhenDisabledGlobalClick = function () {
        if (window.MW_CONFIG && window.MW_CONFIG["disable_global_click"]) {
          ps.install();
        }
      };
      UserBehaviour.prototype.intoEndingAfterClick = function () {
        ps.gameEnd();
      };
      UserBehaviour.prototype.postEndingWhenClick = function () {
        ps.gameEnd && ps.gameEnd();
      };
      UserBehaviour.prototype.postAndInstallEndingWhenClick = function () {
        ps.gameEnd && ps.gameEnd();
        ps.install();
      };
      UserBehaviour.prototype.customizeBehaviour = function () {
        // do something for customizes
      };
      UserBehaviour.prototype.playTweenWhenClick = function () {
        this.gameObject.alpha = 1;
        var tweens = this.gameObject.getScripts(qc.Tween);
        tweens.forEach(function (tween) {
            tween.stop();
            tween.resetToBeginning();
            tween.playForward();
        });
        this.gameObject.children.forEach(function (child) {
            var skp = child.getScript(ps.SKPlayer)
            if(skp)
            {
              skp.play();
            }

            var tweens2 = child.getScripts(qc.Tween);
            tweens2.forEach(function (tween2) {
                tween2.stop();
                tween2.resetToBeginning();
                tween2.playForward();
            });
        });
      };
      UserBehaviour.prototype.onEnable = function () {
          if(this.onEnableDone)return;
          this.onEnableDone = true;
          if (this.awakeCode === 'showUIAfterVideo') {
            this.showUIAfterVideo();
          }
          if (this.awakeCode === 'hideUIAfterVideo') {
            this.hideUIAfterVideo();
          }
          if (this.awakeCode === 'hideUIWhenEnding') {
            this.hideUIWhenEnding();
          }
          if (this.awakeCode === 'hideUIWhenClickScreen') {
            this.hideUIWhenClickScreen();
          }
          if (this.awakeCode === 'showUIWhenClickScreen') {
            this.showUIWhenClickScreen();
          }
          if (this.onDownCode != "")
              this.gameObject.interactive = true;

          if(this.onDownCode === 'playTweenWhenClick')
          {
            this.gameObject.visible = true;
            this.gameObject.alpha = 0;
            var gl = this.gameObject.getScript("qc.TweenAlpha");
            if(gl)
            {
              this.gameObject.alpha = gl.from;
            }
            this.setTween(this.gameObject);
            var self = this;
            this.gameObject.children.forEach(function (child) {
                var skp = child.getScript(ps.SKPlayer)
                if(skp)
                {
                  skp.playOnAwake=false;
                }
                // self.setTween(child);
            });
          }

          if (this.awakeCode === 'directEndAfterVideo') {
            this.directEndAfterVideo();
          }
          if (this.awakeCode === 'switchNextSceneAfterVideo') {
            this.switchNextSceneAfterVideo();
          }
      };
      UserBehaviour.prototype.setTween = function (node) {
        var tweens = node.getScripts(qc.Tween);
          var self = node;
          tweens.forEach(function (tween) {
              tween.playOnAwake = false;
              if(tween.class == "qc.TweenScale")
              {
                self.scaleX = self.scaleY = 1;
              }
              if(tween.class == "qc.TweenAlpha")
              {
                self.alpha = tween.from;
              }
              tween.stop();
              tween.resetToBeginning();
              tween.onFinished.add(function (tw) {
                  self.visible = true;
                  if(tw.class != "qc.TweenAlpha")
                  {
                    self.alpha = 0;
                    tw.resetToBeginning();
                  }
                  // 
                  // tw.stop();
                  // tw.resetToBeginning();
              });
        });
      };
      UserBehaviour.prototype.onStart = function () {
      };
      UserBehaviour.prototype.onDown = function () {
          if (this.onDownCode === 'hideUIAfterItWasClicked') {
            this.hideUIAfterItWasClicked();
          }
          if (this.onDownCode === 'doInstallAfterInstall') {
            this.doInstallAfterInstall();
          }
          if (this.onDownCode === 'intoEndingAfterClick') {
            this.intoEndingAfterClick();
          }
          if (this.onDownCode === 'intoEndingAfterClick') {
            this.intoEndingAfterClick();
          }
          if (this.onDownCode === 'postAndInstallEndingWhenClick') {
            this.postAndInstallEndingWhenClick();
          }
          if (this.onDownCode === 'customizeBehaviour') {
            this.customizeBehaviour();
          }
          if(this.onDownCode === 'playTweenWhenClick') {
            this.playTweenWhenClick();
          }
          if (this.onDownCode === 'installWhenDisabledGlobalClick') {
            this.installWhenDisabledGlobalClick();
          }
      };
      UserBehaviour.prototype.onUp = function (e) {
        
      }
      UserBehaviour.prototype.onEnd = function (result) {
      };
      return UserBehaviour;
  }(ps.Behaviour));
  ps.UserBehaviour = UserBehaviour;
  qc.registerBehaviour('ps.UserBehaviour', UserBehaviour);
  UserBehaviour["__menu"] = 'Custom/UserBehaviour';
})(ps || (ps = {}));

// qc.Tween.prototype.awake = function() {
//   var self = this;
//   console.log("qc.Tween.prototype.awake");
  
//   // 已经被人激活了
//   if (self._started) return;

//     self._enable = true;

//   // 默认未激活行为
//   // self.enable = false;
//   // if (self.playOnAwake) {
//   //     self.resetToBeginning();
//   //     self.playForward();
//   // }
// };

// qc.Tween.prototype.onEnable = function() {
//   var self = this;
//   console.log("qc.Tween.prototype.onEnable");
  
//   // 已经被人激活了
//   if (self._started) return;
//   // 默认未激活行为
//   // self.enable = false;
//   if (self.playOnAwake) {
//       self.resetToBeginning();
//       self.playForward();
//   }
// };

// qc.Tween.prototype.play = function(reverse) {
//   this._amountPerDelta = Math.abs(this.amountPerDelta) * (reverse ? -1 : 1);
//   this.enable = true;
//   this.canRunInEditor = true;
//   this.update();
// };
