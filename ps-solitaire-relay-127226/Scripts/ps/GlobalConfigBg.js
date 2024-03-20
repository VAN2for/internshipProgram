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
   * 音效
   * @author pan.xiang
   */
  var GlobalConfigBg = /** @class */ (function (_super) {
      __extends(GlobalConfigBg, _super);
      function GlobalConfigBg(gameObject) {
        var _this = _super.call(this, gameObject) || this;
        _this.bgUrl = "resource/game/texture/pb_bg.jpg";
        _this.bgHue = 0; // 背景图片滤镜
        _this.bgSaturation = 0; // 背景图片滤镜
        _this.bgLuminance = 0; // 背景图片滤镜
        _this.bgBlur = 0; // 背景图片滤镜
        _this.bgmSourceAudioDuration   = 0; // 原音效时长
        _this.bgmSourceAudioUrl   = ''; // 原音效url
        _this.bgmAudioUrl   = ''; // 当前音效 URL
        _this.bgmClipStartTime   = 0; // 上一次裁剪起始时间，单位毫秒
        _this.bgmClipEndTime   = 0; // 上一次裁剪结束时间，单位毫秒
        _this.bgmVolume   = 100; // 音量
        _this.bgmAutoPlay   = true; // 自动播放
        _this.bgmLoopNumber   = 1; // [<= 0]:循环 [>0]:次数播放
        _this.bgmLoop   = true; // 循环播放
        _this.bgmSize   = 0;  // 文件大小
          /** 序列化 */
        _this.serializableFields = {
          bgUrl: qc.Serializer.STRING,
          bgColor:qc.Serializer.STRING,
          bgHue:qc.Serializer.NUMBER,
          bgSaturation:qc.Serializer.NUMBER,
          bgLuminance:qc.Serializer.NUMBER,
          bgBlur:qc.Serializer.NUMBER,
          bgmSourceAudioDuration: qc.Serializer.NUMBER,
          bgmSourceAudioUrl: qc.Serializer.STRING,
          bgmAudioUrl: qc.Serializer.STRING,
          bgmClipStartTime: qc.Serializer.NUMBER,
          bgmClipEndTime: qc.Serializer.NUMBER,
          bgmVolume: qc.Serializer.NUMBER,
          bgmAutoPlay: qc.Serializer.BOOLEAN,
          bgmLoopNumber: qc.Serializer.NUMBER,
          bgmLoop: qc.Serializer.BOOLEAN,
          bgmSize: qc.Serializer.NUMBER
        };
        return _this;
      }
      GlobalConfigBg.prototype.awake = function (){
        ps.cfg.BGM_NAME = this.bgmAudioUrl;
        ps.cfg.AUTO_PLAY_BGM = this.bgmAutoPlay;
      }
      GlobalConfigBg.prototype.setBgmConfig = function (config) {
        Object.keys(config).forEach((key)=>{
          this[key] = config[key]
        })
      };
      GlobalConfigBg.prototype.onInit = function () {
        this.gameDiv = document.getElementById("gameDiv");
        document.body.style.backgroundColor = "#000000";
        this.gameObject.pos = qc.Dom.POS_BACK;
        this.gameObject.zIndex = -9999;
        this.initBg();
        this.initBgColor();
      }
      GlobalConfigBg.prototype.initBg = function () {
        var _this = this;
        // 兼容自研素材没有 pb_bg 的情况
        var hasBgUrl = false;
        for (var i in qc_game.assets._uuid2UrlConf) {
          if (qc_game.assets._uuid2UrlConf[i] === this.bgUrl.replace(/\.(.*)$/, '.bin')) {
            hasBgUrl = true;
          }
        }
        if (!hasBgUrl) {
          // 如果没有背景图片，直接 ready
          _this.moduleReady()
          return;
        }
        // 如果有 vPlayer 则赋值在 vPlayer 上
        var bgEle = document.querySelector('.vPlayer') || document.body;
        var urlStr = this.bgUrl;
        var url = "";
        if (window["assetsPackage"]) {
          url = window["getAssestByUrl"](urlStr);
        }
        else {
          url = urlStr + "?" + new Date().getTime();
        }
        if(bgEle){
          bgEle.style.background = "url(" + url + ")";
          bgEle.style.backgroundRepeat = "no-repeat";
          bgEle.style.backgroundPosition = "center";
          bgEle.style.backgroundSize = "cover";
          bgEle.style.webkitBackgroundSize = "cover";
          bgEle.style.backfaceVisibility = "hidden";
        }
        this.checkIsLoad(url)
      };
      GlobalConfigBg.prototype.updateBgFilter = function (config){
        var _this = this;
        Object.keys(config).forEach(key=>{
          var bgName = 'bg' + key.replace(key[0],key[0].toUpperCase())
          _this[bgName] = config[key]
        })
      }
      GlobalConfigBg.prototype.initBgColor = function (){
        var bgEle = document.querySelector('.vPlayer') || document.body;
        this.bgColor && bgEle && (bgEle.style.background = this.bgColor);
      }
      GlobalConfigBg.prototype.updateBgColor = function (color,type){
        var bgEle = document.querySelector('.vPlayer') || document.body;
        this.bgColor = color;
        bgEle && (bgEle.style.background = color);
      }
      GlobalConfigBg.prototype.removeBgColor = function(){
        var bgEle = document.querySelector('.vPlayer') || document.body;
        bgEle && (bgEle.style.background = null);
      }
      GlobalConfigBg.prototype.checkIsLoad = function(url) {
        var self = this
        var img = new Image()
        img.onload = function() {
          self.moduleReady()
          img = null
        }
        img.src = url
      }
      GlobalConfigBg.prototype.moduleReady = function() {
        ps.hasBgReady = true
        if (typeof ps.checkReady === 'function') {
          ps.checkReady()
        }
      }
      GlobalConfigBg.prototype.onResize = function() {
        // 切换横竖屏时，主动调用game.updateGameLayout，避免1s的延迟
        this.game.updateGameLayout();
      }
    return GlobalConfigBg;
  }(ps.Behaviour));
  ps.GlobalConfigBg = GlobalConfigBg;
  qc.registerBehaviour('ps.GlobalConfigBg', GlobalConfigBg);
})(ps || (ps = {}));
