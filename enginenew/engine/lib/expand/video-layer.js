  /*global __inline */
  // eslint-disable-next-line no-extra-semi
  ;(function (window, document) {
    function getQueryString(name) {
      var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
      var r = window.location.search.substr(1).match(reg);
      if (r != null) {
        return decodeURIComponent(r[2]);
      }
      return null;
    }
    window.MW_GET_QUERY_STRING = getQueryString;
  })(window, document);

  window.MW_ITA_COVER = {
    isItaVideo: function isItaVideo() {
      // 判断当前素材是否交互素材
      if (Number(window.MW_GET_QUERY_STRING('itavideo')) === 1) {
        return true;
      }
      return false;
    },
    addCover: function addCover() {
      var div = document.createElement('div');
      var style = document.createElement('style');
      var html = '<div class="click-layer">' + '<div class="hand">' + '<img src="data:image/png;base64,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" alt="">' + '<div class="tips">Click to play</div>' + '</div>' + '</div>';
      // eslint-disable-next-line no-undef
      var css = '.click-layer{position:fixed;top:0;left:0;bottom:0;right:0;z-index:999999;opacity:.8;background:-moz-linear-gradient(-45deg,rgba(250,190,80,0.8) 0,rgba(249,129,59,0.8) 100%);background:-webkit-linear-gradient(-45deg,rgba(250,190,80,0.8) 0,rgba(249,129,59,0.8) 100%);background:linear-gradient(135deg,rgba(250,190,80,0.8) 0,rgba(249,129,59,0.8) 100%)}.hand{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);text-align:center;color:#fff;font-size:30px;font-weight:700}@-webkit-keyframes guideMove{0%{opacity:0;-webkit-transform:translateY(0) translateZ(10px);transform:translateY(0)}20%{opacity:.6;-webkit-transform:translateY(-5px) translateZ(10px);transform:translateY(-5px)}50%{opacity:.8;-webkit-transform:translateY(-10px) translateZ(10px);transform:translateY(-10px)}70%{opacity:.6;-webkit-transform:translateY(-15px) translateZ(10px);transform:translateY(-15px)}100%{opacity:0;-webkit-transform:translateY(-20px) translateZ(10px);transform:translateY(-20px)}}@-moz-keyframes guideMove{0%{opacity:0;-moz-transform:translateY(0) translateZ(10px);transform:translateY(0)}20%{opacity:.6;-moz-transform:translateY(-5px) translateZ(10px);transform:translateY(-5px)}50%{opacity:.8;-moz-transform:translateY(-10px) translateZ(10px);transform:translateY(-10px)}70%{opacity:.6;-moz-transform:translateY(-15px) translateZ(10px);transform:translateY(-15px)}100%{opacity:0;-moz-transform:translateY(-20px) translateZ(10px);transform:translateY(-20px)}}@keyframes guideMove{0%{opacity:0;transform:translateY(0) translateZ(10px)}20%{opacity:.6;transform:translateY(-5px) translateZ(10px)}50%{opacity:.8;transform:translateY(-10px) translateZ(10px)}70%{opacity:.6;transform:translateY(-15px) translateZ(10px)}100%{opacity:0;transform:translateY(-20px) translateZ(10px)}}.hand img{position:relative;display:block;margin:0 auto;animation:guideMove 1.5s linear infinite;-webkit-animation:guideMove 1.5s linear infinite}';
      div.innerHTML = html;
      style.innerHTML = css;
      document.querySelector('body').appendChild(div);
      document.querySelector('head').appendChild(style);
      document.querySelector('.click-layer').addEventListener('click', function () {
        if (window.showView) {
          window.showView();
        } else {
          window.gameStart();
        }
        document.querySelector('.click-layer').remove();
      });
    }
  };

  document.addEventListener('PLAYABLE:gameReady', function() {
    const videos = document.getElementsByTagName('video') || []
    if (window.MW_GET_QUERY_STRING('itavideo') == 1 || videos.length) {
        window.MW_ITA_COVER.addCover()
    }
  })