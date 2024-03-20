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
var VideoEvent;
(function (VideoEvent) {
  VideoEvent["PLAY_STAET"] = "playStart";
  VideoEvent["PLAY_COMPLETE"] = "playComplete";
})(VideoEvent || (VideoEvent = {}));
;
var VideoPlayType;
(function (VideoPlayType) {
  VideoPlayType[VideoPlayType["TOUCH_PLAY"] = 1] = "TOUCH_PLAY";
  VideoPlayType[VideoPlayType["PLAY_TOUCH"] = 2] = "PLAY_TOUCH";
  VideoPlayType[VideoPlayType["LOOP"] = 3] = "LOOP";
})(VideoPlayType || (VideoPlayType = {}));
;
/**
* 交互视频组件
* @description 交互视频组件，交互视频模板使用
* @author JingBin
*/
var VideoManager = /** @class */ (function (_super) {
  __extends(VideoManager, _super);
  function VideoManager(gameObject) {
      var _this = _super.call(this, gameObject) || this;
      _this.bgUrl = "resource/texture/pb_bg.jpg";
      _this.videoUrl = "resource/video/1.mp4";
      _this.playType = 1;
      _this.isStopBeforEnding = false;
      _this.isClickToInstall = true;
      _this.isReady = false;
      _this.curW = 0;
      _this.curH = 0;
      _this.eventDisp = new ps.EventDispatcher();
      _this.videoDic = {};
      _this.current_Playing_video_id = "";
      _this.current_Playing_video_endTime = 0;
      _this.isPlayVideoByTs = false;
      _this.playerDic = {};
      _this.videoCanvasDic = {};
      _this.styleData = {};
      _this.zIndex = {};
      _this.canvasMaxNum = 2; // 设置canvas最大数量
      _this.currentCanvasVideoNum = 0; //当前使用额外canvas的数量
      _this.canvasOtherDic = {};
      _this.canvasOtherlist = [];
      //=============end=================
      /** 序列化 */
      _this.serializableFields = {
          bgUrl: qc.Serializer.STRING,
          videoUrl: qc.Serializer.STRING,
          playType: qc.Serializer.NUMBER,
          isStopBeforEnding: qc.Serializer.BOOLEAN,
          isClickToInstall: qc.Serializer.BOOLEAN,
          // bgImg:qc.Serializer.NODE,
          bgTexture: qc.Serializer.TEXTURE,
          bgPrefab: qc.Serializer.PREFAB,
          uiRoot: qc.Serializer.NODE,
          data: qc.Serializer.MAPPING,
          styleData: qc.Serializer.MAPPING,
          zIndex: qc.Serializer.MAPPING,
          canvasMaxNum: qc.Serializer.NUMBER,
      };
      return _this;
  }
  ; //视频播放类型：0:交互后播放，1:播放后交互, 2:循环播放
  /** 试玩初始化的处理 */
  VideoManager.prototype.onInit = function () {
      //在这里初始化游戏场景需要的东西
      this.gameDiv = document.getElementById("gameDiv");
      document.body.style.backgroundColor = "#000000";
      if (qici.config.editor) {
          this.game.timer.loop(1, this._update, this);
      }
      this.initBg();
      for (var key in this.data) {
          var url = this.data[key];
          var video_type = url.split(".")[1];
          this.isPlayVideoByTs = video_type == "ts";
          this.addVideo(key, url);
      }
      this.setVideoAllHide();
  };
  VideoManager.prototype.craeteOtherCanvasAndPlay = function (key, url) {
      if (this.canvasOtherDic[key]) {
          this.canvasOtherDic[key]["canvas"].style.display = "block";
          this.canvasOtherDic[key]["player"].play();
          return;
      }
      if (this.currentCanvasVideoNum >= 2) {
          for (var k in this.canvasOtherDic) {
              if (this.canvasOtherDic[k]["canvas"].style.display == "none") {
                  this.canvasOtherDic[key] = { 
                    "canvas": this.canvasOtherDic[k]["canvas"], 
                    "player": this.canvasOtherDic[k]["player"] 
                  };
                  this.canvasOtherDic[k]["canvas"].style.display = "block";
                  this.chgVideo(this.canvasOtherDic[k]["player"], url);
                  this.canvasOtherDic[key]["player"].play();
                  delete this.canvasOtherDic[k];
              }
          }
          return;
      }
      this.currentCanvasVideoNum += 1;
      var vEle = document.createElement("canvas");
      vEle.setAttribute("videoid", key)
      var tsVideoplayer = new JSMpeg.Player(url, {
          canvas: vEle,
          disableWebAssembly: true,
          onSourceCompleted: this.loadVideoComplete.bind(this),
          progressive: false,
      });
      this.gameObject.div.appendChild(vEle);
      // vEle.style.display = "none";
      this.canvasOtherDic[key] = { "canvas": vEle, "player": tsVideoplayer };
      tsVideoplayer.play();
  };
  /** 设置视频层次 */
  VideoManager.prototype.setVideoZIndex = function (videoUUID, zIndex) {
      if (this.videoDic[videoUUID]) {
          var ele = this.videoDic[videoUUID];
          if (ele) {
              this.zIndex[videoUUID] = zIndex;
          }
          ele.style.zIndex = zIndex;
      }
      if (this.playerDic[videoUUID]) {
          var ele = this.playerDic[videoUUID];
          if (ele) {
              this.zIndex[videoUUID] = zIndex;
          }
          ele.style.zIndex = zIndex;
      }
  };
  /** 设置视频层次 */
  VideoManager.prototype.getVideoZIndex = function (videoUUID, zIndex) {
      var ele;
      if (this.videoDic[videoUUID]) {
          ele = this.videoDic[videoUUID];
      }
      if (this.playerDic[videoUUID]) {
          ele = this.playerDic[videoUUID];
      }
      return ele.style.zIndex || 1;
  };
  /** 设置视频样式 */
  VideoManager.prototype.setVideoTransform = function (videoUUID, transformSting) {
      var ele = this.videoDic[videoUUID];
      if (ele) {
          var winW = this.getWinW;
          var winH = this.getWinH;
          if (winW > winH) {
            this.styleData[videoUUID + '_horizontal'] = transformSting;
            if (!this.styleData[videoUUID + '_vertical']) this.styleData[videoUUID + '_vertical'] = transformSting;
          } else {
            this.styleData[videoUUID + '_vertical'] = transformSting;
            if (!this.styleData[videoUUID + '_horizontal']) this.styleData[videoUUID + '_horizontal'] = transformSting;
          }
      }
      ele.style.transform = ele.style.webkitTransform = transformSting;
  };
  /** 获取视频样式 */
  VideoManager.prototype.getVideoTransform = function (videoUUID) {
      var winW = this.getWinW;
      var winH = this.getWinH;
      var rotateKey = (winW > winH) ? '_horizontal' : '_vertical';
      var ele = this.videoDic[videoUUID];
      if (this.styleData[videoUUID + rotateKey]) return this.styleData[videoUUID + rotateKey]
      return ele.style.transform = ele.style.webkitTransform;
  };
  // 移除指定id的视频
  VideoManager.prototype.removeVideo = function (videoId) {
      if (this.videoDic[videoId]) {
          this.gameObject.div.removeChild(this.videoDic[videoId]);
          delete this.videoDic[videoId];
          delete this.data[videoId];
      }
  };
  /**
   * 显示某个video
   */
  VideoManager.prototype.setVideoShow = function (videoId, hideOther) {
      if (hideOther) {
        for (var key in this.videoDic) {
            this.videoDic[key].style.display = "none";
            this.videoDic[key].pause();
        }
        for (var key in this.videoCanvasDic) {
            this.videoCanvasDic[key].style.display = "none";
            this.playerDic[key].stop();
        }
      }
      if (this.videoDic[videoId]) {
          this.videoDic[videoId].style.display = "block";
          this.current_Playing_video_id = videoId;
      }
      if (this.playerDic[videoId]) {
          if (!this.playerDic[videoId].paused) this.playerDic[videoId].stop();  // 由于当前版本的jsmpeg player是单独一个对象，因此对于之前已经播放了视频的情况下，切换视频时，需要停掉之前的视频
          this.videoCanvasDic[videoId].style.display = "block";
          this.current_Playing_video_id = videoId;
      }
  };
  VideoManager.prototype.getPlayingVideo = function () {
      var dic = this.videoDic;
      if (this.isPlayVideoByTs) {
          dic = this.videoCanvasDic;
      }
      if (dic[this.current_Playing_video_id]) {
          return dic[this.current_Playing_video_id];
      }
      else {
          for (var key in dic) {
              return dic[key];
          }
      }
  };
  Object.defineProperty(VideoManager.prototype, "playingVideoWidth", {
      get: function () {
          if (this.isPlayVideoByTs) {
              var video = this.getPlayingVideo();
              return video.width;
          }
          else {
              var video = this.getPlayingVideo();
              return video.videoWidth;
          }
      },
      enumerable: false,
      configurable: true
  });
  Object.defineProperty(VideoManager.prototype, "playingVideoHeight", {
      get: function () {
          if (this.isPlayVideoByTs) {
              var video = this.getPlayingVideo();
              return video.height;
          }
          else {
              var video = this.getPlayingVideo();
              return video.videoHeight;
          }
      },
      enumerable: false,
      configurable: true
  });
  // 隐藏所有视频
  VideoManager.prototype.setVideoAllHide = function () {
      for (var key in this.videoDic) {
          this.videoDic[key].style.display = "none";
      }
      for (var key1 in this.videoCanvasDic) {
          this.videoCanvasDic[key1].style.display = "none";
      }
  };
  ;
  // 指定id的视频是否静音
  VideoManager.prototype.setVideoMuted = function (videoId, muted) {
      if (this.videoDic[videoId]) {
          this.videoDic[videoId].muted = muted;
      }
  };
  ;
  // 隐藏指定id的视频
  VideoManager.prototype.setVideoHide = function (videoId) {
      if (this.videoDic[videoId]) {
          this.videoDic[videoId].style.display = "none";
      }
      if (this.canvasOtherDic[videoId]) {
        this.canvasOtherDic[videoId]["canvas"].style.display = "none";
        this.canvasOtherDic[videoId]["player"].pause();
      } else {
        if (this.videoCanvasDic[videoId]) {
            this.videoCanvasDic[videoId].style.display = "none";
        }
      }
  };
  //设置视频src
  VideoManager.prototype.setVideoUrl = function (videoId, url, isNew) {
      // this.setVideoData(url);
      if (this.videoDic[videoId] == null) {
          this.addVideo(videoId, url);
      }
      else {
          this.setVideoData(url, this.videoDic[videoId]);
      }
      this.data[videoId] = url;
  };
  VideoManager.prototype.setVideoLoop = function (videoId, isloop) {
      if (this.videoDic[videoId]) {
          this.videoDic[videoId].loop = isloop;
      }
      if (this.canvasOtherDic[videoId]) {
          this.canvasOtherDic[videoId]["player"].loop = isloop;
      } else {
          if (this.playerDic[videoId]) {
              this.playerDic[videoId].loop = isloop;
          }
      }
  };
  VideoManager.prototype.setVideoPosition = function (videoId, transformString) {
  };
  //控制进度
  VideoManager.prototype.setVideoCurrentTime = function (videoId, seconds) {
      if (this.videoDic[videoId]) {
          this.videoDic[videoId].currentTime = seconds;
      }
  };
  //获得指定视频的总时长
  VideoManager.prototype.getVideoDuration = function (videoId) {
      if (this.videoDic[videoId]) {
          return this.videoDic[videoId].duration;
      }
      return 0;
  };
  //暂停
  VideoManager.prototype.setVideoPause = function (videoId, hideOther) {
      var _this = this;
      if (this.videoDic[videoId]) {
          this.videoDic[videoId].pause();
      }
      if (this.canvasOtherDic[videoId]) {
          this.canvasOtherDic[videoId]["canvas"].style.display = "none";
          this.canvasOtherDic[videoId]["player"].pause();
      } else {
        if (this.playerDic[videoId]) {
          // this.playerDic[videoId].pause();
          if (hideOther) {
            for (var key in this.videoCanvasDic) {
                this.videoCanvasDic[key].style.display = "none";
            }
          }
          this.videoCanvasDic[videoId].style.display = "block";
          this.current_Playing_video_id = videoId;
          this.chgVideo(this.playerDic[videoId], this.data[videoId], function () {
              _this.playerDic[videoId].pause();
          });
        }
      }
  };
  //获得video标签对象
  //播放
  VideoManager.prototype.setVideoPlay = function (videoId, isNewCreate, hideOther) {
      var _this = this;
      if (this.videoDic[videoId]) {
          if (this.videoDic[videoId].paused == true) {
              if (hideOther) {
                for (var key in this.videoDic) {
                    this.videoDic[key].style.display = "none";
                }
              }
              this.videoDic[videoId].style.display = "block";
              this.videoDic[videoId].play();
              this.current_Playing_video_id = videoId;
          }
          // this.chgVideo(this.videoDic[videoId], this.data[videoId]);
      }
      if (this.playerDic[videoId]) {
          if (isNewCreate) {
              this.craeteOtherCanvasAndPlay(videoId, this.data[videoId]);
              this.game.timer.add(1000, function () {
                  _this.initConVideo();
              });
          } else {
              this.videoCanvasDic[videoId].style.display = "block";
              this.current_Playing_video_id = videoId;
              this.chgVideo(this.playerDic[videoId], this.data[videoId]);
              this.initConVideo();
          }
          if (hideOther) {
            for (var key in this.videoCanvasDic) {
                this.videoCanvasDic[key].style.display = "none";
            }
          }
          this.current_Playing_video_id = videoId;
      }
      // document.getElementsByClassName
  };
  // 某视频是否正在播放
  VideoManager.prototype.videoIsPlaying = function (videoId) {
      if (this.playerDic[videoId]) {
          return !this.playerDic[videoId].paused;
      }
      else if (this.videoDic[videoId]) {
          return !this.videoDic[videoId].paused;
      }
      else {
          return false;
      }
  };
  //设置到某个时间后播放
  VideoManager.prototype.setVideoPlayByTime = function (videoId, seconds, end, isNewCreate) {
      // if (this.playerDic[videoId] && this.playerDic[videoId].paused && this.playerDic[videoId].currentTime < end) {
      //   isNewCreate = true
      // } else {
      //   isNewCreate = false
      // }
      // if (isNewCreate === void 0) { isNewCreate = false; }
      if ((this.playerDic[videoId] && !this.playerDic[videoId].paused) || (this.videoDic[videoId] && !this.videoDic[videoId].paused)) {
          return;
      }
      this.setVideoCurrentTime(videoId, seconds);
      this.current_Playing_video_endTime = end;
      this.setVideoPlay(videoId, isNewCreate);
  };
  //设置到某个时间后暂停
  VideoManager.prototype.setVideoPauseByTime = function (videoId, seconds) {
      this.setVideoCurrentTime(videoId, seconds);
      this.setVideoPause(videoId);
  };
  /** 试玩开始时的处理 */
  VideoManager.prototype.onStart = function () {
      // this.isGameStart = true;
      // this.gameStart();
      var ani = this.gameObject.getScript('qc.Animator');
      if (ani) {
          ani.playActionManager = ani.animators[0].json.name;
          ani.refresh();
          ani.addListener(this.gameObject.onRelayout, ani.refresh, ani);
      }
  };
  VideoManager.prototype.resetGameStart = function () {
      // this.isGameStart = true;
      // this.gameStart();
  };
  VideoManager.prototype.gameStart = function () {
      console.log("gameStart", this.playType);
      if (!this.videoLoaded) {
          console.log("视频还没加载完");
          return;
      }
      if (!this.isGameStart && !qici.config.editor) {
          console.log("不是正的gs");
          return;
      }
  };
  /** 试玩结束时的处理 */
  VideoManager.prototype.onEnd = function () {
  };
  /** 再来一次时的处理(onInit后,onStart前) */
  VideoManager.prototype.onRetry = function () {
  };
  VideoManager.prototype.update = function () {
      this._update();
  };
  VideoManager.prototype.refresh = function () {
      this.resetGameStart();
  };
  VideoManager.prototype.playComplete = function (m_video) {
      console.log(m_video.id + "视频播放结束");
      this.eventDisp.dispatch(VideoEvent.PLAY_COMPLETE);
      gameEvent.dispatch(VideoEvent.PLAY_COMPLETE);
  };
  VideoManager.prototype._update = function () {
      var offsetLen = 20;
      var winW = this.getWinW;
      var winH = this.getWinH;
      if (this.curW !== winW || this.curH !== winH) {
          this.curW = winW;
          this.curH = winH;
          this.initConVideo();
      }
  };
  Object.defineProperty(VideoManager.prototype, "getWinW", {
      get: function () {
          var winW = this.gameObject.width; // window["adWidth"] || window.innerWidth;
          return winW;
      },
      enumerable: false,
      configurable: true
  });
  Object.defineProperty(VideoManager.prototype, "getWinH", {
      get: function () {
          var winH = this.gameObject.height; // window["adHeight"] || window.innerHeight;
          return winH;
      },
      enumerable: false,
      configurable: true
  });
  VideoManager.prototype.initBg = function () {
      var _this = this;
      var bgEle = this.gameObject.div;
      var urlStr = this.bgUrl;
      var url = "";
      if (window["assetsPackage"]) {
          url = window["getAssestByUrl"](urlStr);
      }
      else {
          url = urlStr + "?" + new Date().getTime();
      }
      bgEle.style.background = "url(" + url + ")";
      bgEle.style.backgroundRepeat = "no-repeat";
      bgEle.style.backgroundPosition = "center";
      bgEle.style.backgroundSize = "cover";
      bgEle.style.webkitBackgroundSize = "cover";
      var arr = this.bgUrl.split(".");
      var binurl = arr[0] + ".bin";
      qc_game.assets.load(binurl, function (r) {
          _this.bgTexture = new qc.Texture(r);
      });
  };
  VideoManager.prototype.setVideoData = function (url, mv) {
      if (hasBase64 && hasBase64()) {
          var base64_data = window.getAssestByUrl(url);
          var blob_data = this.MakeBlob(base64_data);
          mv.src = (URL || webkitURL).createObjectURL(blob_data);
          // this.video.poster = window.getAssestByUrl(poster_url);
          // this.playerX.src({"type":"video/mp4", "src":(URL || webkitURL).createObjectURL(blob_data) });
      }
      else {
          mv.src = url;
          // this.video.poster = poster_url;
          // this.playerX.src({"type":"video/mp4", "src":url });
      }
      mv.load();
  };
  VideoManager.prototype.MakeBlob = function (e) {
      for (var t = atob(e.split(',')[1]), n = e.split(',')[0].split(':')[1].split(';')[0], i = new ArrayBuffer(t.length), r = new Uint8Array(i), o = 0; o < t.length; o++)
          r[o] = t.charCodeAt(o);
      return new Blob([i], { type: n });
  };
  /** 切换视频 */
  VideoManager.prototype.chgVideo = function (p, url, callBack, callThis) {
      // console.info("chgVideo");
      if (this.isPlayVideoByTs) {
        p.options.onEnded = null;
        // this.videoEle.style.display = "none";
        p.stop();
        p.options.onSourceEstablished = function (player) {
            // console.log("onSourceEstablished", player);
            player.onCompletedCallback = null;
            // this.videoEle.style.display = "block";
            // this.player.stop();
            p.play();
            if (callBack)
                callBack.call(callThis);
        };
        p.source = new JSMpeg.Source.AjaxProgressive(url, p.options /*{}*/);
        p.demuxer = new JSMpeg.Demuxer.TS(p.options /*{}*/);
        p.video = new JSMpeg.Decoder.MPEG1Video(p.options /*{}*/);
        p.source.connect(p.demuxer);
        p.demuxer.connect(JSMpeg.Demuxer.TS.STREAM.VIDEO_1, p.video);
        p.video.connect(p.renderer);
        p.source.start();
      } else {
        p.stop()
        p.url = url
        p.play()
      }
      
  };
  // 纯设置video数据
  VideoManager.prototype.setVideoUrlPureData = function (videoId, url) {
      this.data[videoId] = url;
  };
  VideoManager.prototype.addVideo = function (key, url) {
      var _this = this;
      if (this.isPlayVideoByTs) {
          // this.player && this.player.stop();
          var videoEle = document.createElement("canvas");
          videoEle.setAttribute("videoid", key)
          var tsVideoplayer = new JSMpeg.Player(url, {
              canvas: videoEle,
              disableWebAssembly: true,
              onSourceCompleted: this.loadVideoComplete.bind(this),
              progressive: false,
              onEnded: this.playComplete.bind(this)
          });
          this.gameObject.div.appendChild(videoEle);
          videoEle.style.display = "none";
          this.videoCanvasDic[key] = videoEle;
          this.playerDic[key] = tsVideoplayer;
      }
      else {
          var m_video;
          if (qici.config.isAutoCreateVideo == null || qici.config.isAutoCreateVideo) {
              m_video = document.createElement("video");
              this.gameObject.div.appendChild(m_video);
          }
          else {
              m_video = document.getElementById(key);
          }
          m_video.id = key;
          m_video.style.display = "none";
          this.videoDic[key] = m_video;
          this.setVideoData(url, m_video);
          m_video.addEventListener('canplaythrough', function (event) {
              var n_video = event.target;
              n_video.readyState >= 3 && _this.loadVideoComplete(n_video);
          }, !1),
              m_video.addEventListener('error', function (e) {
                  ps.Print.purple("视频加载失败");
                  if (window["renderFail"])
                      window["renderFail"]();
              }, !1);
          m_video.addEventListener('ended', function (event) {
              var n_video = event.target;
              _this.playComplete(n_video);
          }, !1);
          m_video.addEventListener('timeupdate', function (event) {
              var n_video = event.target;
              _this.timeupdate(n_video);
          }, !1);
      }
  };
  VideoManager.prototype.timeupdate = function (m_video) {
      if (m_video.id == this.current_Playing_video_id && this.current_Playing_video_endTime != undefined && this.current_Playing_video_endTime != 0 && this.videoDic[this.current_Playing_video_id]) {
          if (this.videoDic[this.current_Playing_video_id].currentTime >= this.current_Playing_video_endTime) {
              this.videoDic[this.current_Playing_video_id].pause();
          }
      }
  };
  VideoManager.prototype.loadVideoComplete = function (m_video) {
      ps.Print.purple("loadVideoComplete" + m_video.id);
      this.initConVideo();
      if (this.videoLoaded)
          return;
      this.videoLoaded = true;
      this.gameStart();
      this.initConVideo();
      window["loadVideoComplete"] = true;
      if (!qici.config.editor) {
          ps.Print.green('诱导视频gameReady');
          if (window["gameReady"])
              window["gameReady"]();
      }
  };
  VideoManager.prototype.onResize = function () {
      console.log("onResize");
      this.initConVideo();
  };
  /** 初始化视频容器 */
  VideoManager.prototype.initConVideo = function () {
      var winW = this.getWinW;
      var winH = this.getWinH;
      var rotateKey = (winW > winH)? '_horizontal' : '_vertical'
      for (var key in this.videoDic) {
          var styleData = this.styleData[key + rotateKey] ? this.styleData[key + rotateKey] : this.styleData[key]
          this.fitDOMElementInArea(this.videoDic[key], this.videoDic[key].videoWidth, this.videoDic[key].videoHeight, styleData, this.zIndex[key]);
      }
      for (var key2 in this.videoCanvasDic) {
        var styleData2 = this.styleData[key2 + rotateKey] ? this.styleData[key2 + rotateKey] : this.styleData[key2]
          this.fitDOMElementInArea(this.videoCanvasDic[key2], this.videoCanvasDic[key2].width, this.videoCanvasDic[key2].height, styleData2, this.zIndex[key2]);
      }
      for (var key3 in this.canvasOtherDic) {
        var styleData3 = this.styleData[key3 + rotateKey] ? this.styleData[key3 + rotateKey] : this.styleData[key3]
          this.fitDOMElementInArea(this.canvasOtherDic[key3]["canvas"], this.canvasOtherDic[key3]["canvas"].width, this.canvasOtherDic[key3]["canvas"].height, styleData3, this.zIndex[key3]);
      }
  };
  /** 适配 DOM 节点 */
  VideoManager.prototype.fitDOMElementInArea = function (ele, w, h, styleDes, zIndex) {
      if (!ele) {
          return;
      }
      if (w == 0 || h == 0)
          return;
      // let styleVal: stringw = "";
      // if (!ele["_fitLayaAirInitialized"]) {
      //     ele["_fitLayaAirInitialized"] = true;
      //     ele.style.transformOrigin = ele.style.webkitTransformOrigin = "left top";
      //     ele.style.position = "absolute";
      // }
      var rotate = 0;
      var winW = this.getWinW;
      var winH = this.getWinH;
      var s1 = winW / w;
      var s2 = winH / h;
      var scale = Math.min(s1, s2);
      // scale = Mathf.keepDecimal(scale, 2, "ceil");
      var left = Mathf.keepDecimal((winW) / 2, 0);
      var top = Mathf.keepDecimal((winH) / 2, 0);
      // display: flex;
      // justify-content: center;
      // align-items: center;
      this.gameObject.div.style.display = "flex";
      this.gameObject.div.style.justifyContent = "center";
      this.gameObject.div.style.alignItems = "center";
      // styleVal += "; transform: scale(" + scale + "," + scale + ") rotate(" + rotate + "deg)";
      // ele.setAttribute("style", styleVal);
      // margin-left
      ele.style.transformOrigin = "50% 50%";
      ele.style.position = "absolute";
      if (!styleDes) {
          styleDes = "scale(" + scale + "," + scale + ") rotate(" + rotate + "deg) translateX(0px) translateY(0px)";
      }
      ele.style.transform = ele.style.webkitTransform = styleDes;
      if (!isNaN(Number(zIndex))) {
        ele.style.zIndex = zIndex
      }
      // "scale(2,2) translateX(0px) translateY(0px)";
      // ele.style.width = GameMgr.stage.stageWidth + "px",
      // ele.style.height = GameMgr.stage.stageHeight + "px",
      // ele.style.left = "50%",
      // ele.style.top = "50%";
      // translateX(-50%) translateY(-50%)
      var sa = this.uiRoot.getScript("ps.ScaleAdapterMtg");
      sa.updateScreen();
  };
  return VideoManager;
}(ps.Behaviour));
qc.registerBehaviour('ps.VideoManager', VideoManager);
/**
帧回调（preUpdate、update、postUpdate）
如果实现了这几个函数，系统会自动每帧进行调度（当挂载的Node节点处于可见、并且本脚本的enable=true时）
初始化（awake）
如果实现了awake函数，系统会在Node节点构建完毕（反序列化完成后）自动调度
脚本可用/不可用（onEnable、onDisable）
当脚本的enable从false->true时，会自动调用onEnable函数；反之调用onDisable函数
ps:在awake结束时,如果当前脚本的enable为true，会自动调用onEnable函数
交互回调（onClick、onUp、onDown、onDrag、onDragStart、onDragEnd）
当挂载的Node具备交互时，一旦捕获相应的输入事件，这些函数会自动被调用
脚本析构（onDestroy）
当脚本被移除时，会自动调用onDestroy函数，用户可以定义必要的资源回收代码
//PlaySmart新增回调(继承ps.Behaviour)
pl状态回调(onInit、onStart、onEnding、onRetry)
如果实现了这几个函数，会在pl进行到相应状态的时候进行回调
*/ 
