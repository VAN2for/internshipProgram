// 字体加载模块：前置插入到 ps 项目入口文件中，包括编辑器入口文件与预览入口文件

// 字体加载脚本
// 代码源：https://gitlab.mobvista.com/playable/m-sdk-util
'use strict';

/*global __inline */
(function () {
  /*global __inline */
  /*global is */
  /*global dataURLsPrefix */
  // 这个模板用在 pt 与 ps 项目中，改动时要兼容两个项目
  // 后端项目也引用了该模块打包后的代码，详见 https://gitlab.mobvista.com/playable/portal-backend

  (function (window, document) {
    // 引用该模块时，不要讲其放在全局执行环境下
    function isBase64(value) {
      var base64Regex = /^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{4}|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)$/;
      return typeof value === 'string' && value && base64Regex.test(value);
    }

    function isPlainObject(value) {
      return Object.prototype.toString.call(value) === '[object Object]';
    }

    function isString(value) {
      return typeof value === 'string';
    }

    function isFunction(value) {
      return typeof value === 'function';
    }

    // eslint-disable-next-line no-unused-vars
    var is = {
      base64: isBase64,
      plainObject: isPlainObject,
      string: isString,
      function: isFunction

      // 引用该模块时，不要讲其放在全局执行环境下
      // eslint-disable-next-line no-unused-vars
    };var dataURLsPrefix = {
      png: 'data:image/png;base64,',
      ttf: 'data:font/truetype;charset=utf-8;base64,'

      // MW_FONT_LIST 的声明由素材仓库后台打包时动态插入
    };var fontList = window.MW_FONT_LIST || {}
    // AIGDT: {
    //   name: "AIGDT",
    //   url: "resource/font/AIGDT.ttf",
    // },
    // Thumb: {
    //   name: "Thumb",
    //   url: "resource/font/Thumb.ttf",
    // }

    // const loadedFontList = {}

    /**
     * 检测字体文件是否已加载
     * @param {string} name
     */
    ;function isFontLoaded(name) {
      var values = document.fonts.values();
      var isLoaded = false;
      var item = values.next();
      while (!item.done && !isLoaded) {
        var fontFace = item.value;
        if (fontFace.family === name) {
          isLoaded = true;
        }
        item = values.next();
      }
      return isLoaded;
    }

    /**
     * downloadFont
     * @param {{name: string, url: string}} font
     */
    function downloadFont(font) {
      var fontName = font.name;
      var url = font.url;

      var base64Prefix = dataURLsPrefix.ttf;
      // window.assetsPackage 文件命名格式是将后缀的 . 改成 _。如 test.ttf 被改成 test_ttf
      var fontInDataJS = window.assetsPackage && window.assetsPackage[fontName + '_ttf'];
      if (fontInDataJS) {
        url = '' + base64Prefix + window.assetsPackage[fontName + '_ttf'];
      } else if (is.base64(url)) {
        url = '' + base64Prefix + url;
      }

      return new Promise(function (resolve, reject) {
        if (!document.fonts) reject(new Error('不支持 document.fonts'));

        var fontFace = new FontFace(fontName, 'url(\'' + url + '\') format(\'truetype\')');
        fontFace.load().then(function (loadedFontFace) {
          document.fonts.add(loadedFontFace);
          resolve({
            font: font,
            loadedFontFace: loadedFontFace
          });
        }).catch(function (err) {
          reject(err);
        });
      });
    }

    /**
     * loadFont
     * @param {{name: string, url: string}|string|[{name: string, url: string}]} font
     * @param {function} [onSuccess]
     * @param {function} [onFail]
     */
    function loadFont(font, onSuccess, onFail) {
      if (!FontFace || !document.fonts || !Promise || !Promise.all) {
        console.warn('浏览器不支持 FontFace');
        is.function(onFail) && onFail();
        return;
      }

      if (!is.string(font) && !is.plainObject(font) && !Array.isArray(font)) {
        console.warn('font 只支持字符串或对象或数组');
        return;
      }

      var fontList = [];
      // 如果是字符串，则默认补齐资源路径
      if (is.string(font)) {
        fontList = [{
          name: font,
          url: 'resource/font/' + font + '.ttf'
        }];
      } else if (is.plainObject(font)) {
        fontList = [font];
      } else {
        fontList = font;
      }

      if (fontList.some(function (item) {
        return !item.name;
      })) {
        console.warn('参数异常，缺少字体名字');
      }

      fontList = fontList.map(function (item) {
        if (item.name && item.url) {
          return item;
        }
        if (item.name && !item.url) {
          return {
            name: item.name,
            url: 'resource/font/' + item.name + '.ttf'
          };
        }
        return item;
      }).filter(function (item) {
        return item.name && item.url;
      });

      var promiseList = fontList.map(function (item) {
        return downloadFont(item);
      });
      Promise.all(promiseList).then(function (data) {
        console.log('load font success.', data);
        is.function(onSuccess) && onSuccess(data);
      }).catch(function (err) {
        console.warn('load font fail!', err.message);
        is.function(onFail) && onFail();
      });
    }

    function loadFontList() {
      var list = [];
      for (var key in fontList) {
        if (Object.hasOwnProperty.call(fontList, key)) {
          var font = fontList[key];
          list.push(font);
        }
      }
      loadFont(list);
    }
    loadFontList();

    window.MW_LOAD_FONT = loadFont;
    window.MW_FONT_LOADER = {
      version: 'v4.4.14.0',
      // 判断某字体是否已加载
      has: isFontLoaded,
      // 加载字体
      fetch: loadFont,
      // 字体列表
      fontList: fontList
    };
    console.log(window.MW_FONT_LOADER);

    // var style = document.createElement('style')
    // style.innerHTML = '@font-face {font-family:"Thumb";src:url("./resource/font/Thumb.ttf");}.download {font-family: Thumb;}'
    // document.body.appendChild(style)
  })(window, document);
})();