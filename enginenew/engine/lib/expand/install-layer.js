(function() {
  // ps 制作预览页面增加安装提示层，交互视频层

  // m-sdk-util
  // 交互视频提示遮罩：common-util/ita_cover/index.js
  // 安装提示层 引用目录：common-util/previewLayer/index.js 编译
  'use strict';

  /*global __inline*/
  /*global __inline*/
  // eslint-disable-next-line no-extra-semi
  ;(function () {
    var previewLayer = {
      content: ['This page indicates that your creative has correctly setup click-through functionality.', 'When users click on your ad, they will not see this page, and will instead be sent to your destination URL.', 'Questions? Reach out to support@mindworks-creative.com.', 'Want ad inspiration? Visit our '],
      show: function show() {
        var dom = document.querySelector('.mw-preview-layer');
        if (dom) {
          dom.style.display = 'block';
        }
      },
      hide: function hide() {
        var dom = document.querySelector('.mw-preview-layer');
        dom.style.display = 'none';
      },
      init: function init() {
        // 默认事件拦截列表
        var stopPropagationEvent = ['click', 'touchmove', 'touchstart', 'touchend', 'mousedown', 'mouseup', 'pointerup', // http://www.iefans.net/zhizhen-shijian-pointer-event/ pointer事件
        'pointerdown' // http://www.iefans.net/zhizhen-shijian-pointer-event/ pointer事件
        ];
  
        var content = document.querySelector('body');
        var style = '.mw-preview-layer{position:absolute;top:0;right:0;bottom:0;left:0;background-color:#fff;z-index:1000000;display:none;overflow:auto;padding-bottom:48px;text-align:left}.mw-preview-layer a{text-decoration:none;color:#f5ae00}.mw-preview-layer *{margin:0;padding:0;font-size:12px!important;color:#333}.mw-preview-layer h3{padding:0 12.8%;height:18%;background-image:linear-gradient(to right,#fdcf14,#f6b817);margin:0;display:table;width:100%;margin-bottom:48px;box-sizing:border-box}.mw-preview-layer h3 span{color:#fff;vertical-align:middle;font-size:28px;display:table-cell}.mw-preview-layer .mw-preview-layer-content{padding:0 12.8%;font-size:14px;line-height:24px;margin-bottom:48px}.mw-preview-layer .mw-preview-layer-content .desc{margin-bottom:48px}.mw-preview-layer .mw-preview-layer-foot{padding:0 12.8%}.mw-preview-layer .mw-preview-layer-foot .back{height:40px;line-height:40px;border-radius:4px;font-size:14px;color:#666;background-color:#f6f8fb;border:1px solid #ddd;padding:8px 16px;cursor:pointer}.mw-preview-layer .mw-preview-layer-foot .back:hover{opacity:.8}';
        var self = this;
        var styleScript = document.createElement('style');
        styleScript.innerHTML = style;
        document.querySelector('head').appendChild(styleScript);
        var layer = document.createElement('div');
        layer.className = 'mw-preview-layer-wrapper';
        layer.innerHTML = this.template({
          content: this.content
        });
        content.appendChild(layer);
        // 事件拦截，避免与全局事件监听冲突
        stopPropagationEvent.map(function (eventName) {
          layer.addEventListener(eventName, function (e) {
            e.stopPropagation();
          });
        });
        var backButton = document.querySelector('.mw-preview-layer-foot .back');
        if (backButton) {
          backButton.addEventListener('click', function () {
            self.hide();
          });
        }
      },
  
      template: function template(data) {
        var __t,
            __p = '',
            __j = Array.prototype.join,
            print = function print() {
          __p += __j.call(arguments, '');
        };
        __p += '<div class="mw-preview-layer">\n  <h3><span>Success！</span></h3>\n  <div class="mw-preview-layer-content">\n    <div class="desc">\n      <p>' + ((__t = data.content[0]) == null ? '' : __t) + '</p>\n      <p>' + ((__t = data.content[1]) == null ? '' : __t) + '</p>\n    </div>\n    <div class="question">\n      <p>' + ((__t = data.content[2]) == null ? '' : __t) + '</p>\n      <p>' + ((__t = data.content[3]) == null ? '' : __t) + '<a href="https://www.mindworks-creative.com/work">Work</a>.</p>\n    </div>\n  </div>\n  <div class="mw-preview-layer-foot">\n    <span class="back">Back</span>\n  </div>\n</div>\n';
        return __p;
      }
    };
  
    window.MW_PREVIEWLAYER = previewLayer;
  })()
  
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

  if (window.MW_GET_QUERY_STRING('preview') === 'true') {
      window.MW_PREVIEWLAYER && window.MW_PREVIEWLAYER.init()
  
      // 重写安装逻辑
      window.install = (obj) => {
          window.MW_PREVIEWLAYER && window.MW_PREVIEWLAYER.show()
      }
  }

})();