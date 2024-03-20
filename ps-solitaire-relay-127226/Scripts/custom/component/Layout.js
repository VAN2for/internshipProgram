var __extends = (this && this.__extends) || (function () {
  var extendStatics = function (d, b) {
    extendStatics = Object.setPrototypeOf || ({__proto__: []} instanceof Array && function (d, b) {
      d.__proto__ = b;
    }) || function (d, b) {
      for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    };
    return extendStatics(d, b);
  };
  return function (d, b) {
    extendStatics(d, b);

    function __() {
      this.constructor = d;
    }

    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
})();
var setHistoryLayout = null
var hadHistoryLayout = (function() {
  if (ps && ps.Layout && ps.Layout.setLayout) {
    // 如果存在 setLayout 方法，当前页面使用这个 setLayout 方法进行设置布局，后续改动之后再采用新 layout 进行设置
    setHistoryLayout = ps.Layout.setLayout
    return true;
  }
  return false
})()
var ps;
(function (ps) {
  /** 布局属性优先级，先调整尺寸，再进行对齐 */
  var layoutPriority = ["pivotX", "pivotY", "x", "y", "anchoredX", "anchoredY", "rotation", "stretchw", "stretchh", "width", "height", "scaleXY", "scaleX", "scaleY", "left", "right", "top", "bottom", "centerX", "centerY", "percX", "percY", "alpha", "visible"];
  /**
   * 布局组件
   * @author VaMP
   */
  var Layout = /** @class */ (function (_super) {
    __extends(Layout, _super);

    function Layout(gameObject) {
      var _this = _super.call(this, gameObject) || this;
      _this.inited = false;
      _this.autoSize = false;
      _this.serializableFields = {
        autoSize: qc.Serializer.BOOLEAN,
        left: qc.Serializer.STRING,
        top: qc.Serializer.STRING,
        right: qc.Serializer.STRING,
        bottom: qc.Serializer.STRING,
        centerX: qc.Serializer.STRING,
        centerY: qc.Serializer.STRING,
        percX: qc.Serializer.STRING,
        percY: qc.Serializer.STRING,
        scaleXY: qc.Serializer.STRING,
        layout: qc.Serializer.MAPPING,
        ignoreProps: qc.Serializer.MAPPING  // 忽略的属性
      };
      /** 默认布局数据 */
      _this.layoutDef = new LayoutData;
      /** 布局数据 */
      _this.layout = {
        pdef: "", pipx: "", ppad: "", pipxm: "", ldef: "", lipx: "", lpad: "", lipxm: ""
      };
      _this.ignoreProps = {};
      _this.layoutData = {};
      _this.runInEditor = true;
      // 当前素材是否是旧版的 layout
      _this.runInHistoryLayout = hadHistoryLayout;
      // 是否直接过滤掉非 ldef 和 pdef 的 layout 属性值， 默认不过滤，但是如果节点又新版的 layout 信息，再做过滤。原因是因为新版 ps 不支持这些适配模式
      _this.disabledMultipleAdapter = false;
      // 缓存当前节点的 editor.data 数据
      _this.editorData = gameObject.getScript('playsmart.editor.data')
      _this.editorDataDetail = _this.editorData && _this.editorData.$data
      _this.editorDataDetailNodeOrigin = _this.editorDataDetail && _this.editorDataDetail.nodeOrigin
      _this.runHistory = false // 是否走历史的布局方式
      // Init the behaviour
      _this.addListener(gameObject.onRelayout, _this.refresh, _this, 10);
      _this.layoutSetting = false
      return _this;
    }

    /**
     * 设置布局
     * @param obj 要布局的对象
     * @param key 要设置的属性,left,right,top,bottom等
     * @param value 值
     */
    Layout.setLayout = function (obj, key, value) {
      //关键字pw为父亲宽度，ph为母亲宽度
      if (value === "pw") value = obj.parent.width;
      if (value === "ph") value = obj.parent.height;
      value = ps.Mathf.parseNumber(value);
      var realWidth = obj.width * obj.scaleX;
      var realHeight = obj.height * obj.scaleY;
      var offsetX = obj.pivotX * realWidth;
      var offsetY = obj.pivotY * realHeight;
      var parentWidth = obj.parent.width;
      var parentHeight = obj.parent.height;
      var offsetParentX = obj.parent.pivotX * parentWidth;
      var offsetParentY = obj.parent.pivotY * parentHeight;

      var targetPos = 0
      switch (key) {
        case "left":
          targetPos = obj.parent.width * value + offsetX
          obj.x = targetPos;
          break;
        case "top":
          targetPos = obj.parent.height * value + offsetY
          obj.y = targetPos;
          break;
        case "right":
          targetPos = obj.parent.width * (1 - value) - offsetX
          obj.x = targetPos;
          break;
        case "bottom":
          targetPos = obj.parent.height * (1 - value) - offsetY
          obj.y = targetPos;
          break;
        case "centerX":
          targetPos = obj.parent.width * value;
          obj.x = (obj.parent.width) / 2 + targetPos;
          break;
        case "centerY":
          targetPos = obj.parent.height * value;
          obj.y = (obj.parent.height) / 2 + targetPos;
          break;
        case "percX":
          if (obj.parent) obj.x = (obj.parent.width - realWidth) * value + offsetX - offsetParentX;
          break;
        case "percY":
          if (obj.parent) obj.y = (obj.parent.height - realHeight) * value + offsetY - offsetParentY;
          break;
        case "scaleX":
          if (obj.getScript(qc.TweenScale)) return;
          obj.scaleX = value;
          break;
        case "scaleY":
          if (obj.getScript(qc.TweenScale)) return;
          obj.scaleY = value;
          break;
        case "scaleXY":
          if (obj.getScript(qc.TweenScale)) return;
          obj.scaleX = value;
          obj.scaleY = value;
          break;
        //--------------------------------------------------------------
        case "x":
          obj.anchoredX = value;
          break;
        case "y":
          obj.anchoredY = value;
          break;
        case "rotation":
          obj.rotation = ps.Mathf.angleToRadian(value);
          break;
        case "width":
          obj.width = value;
          break;
        case "height":
          obj.height = value;
          break;
        case "visible":
          obj.visible = Boolean(value);
          break;
        case "pivotX":
          obj.pivotX = value;
          break;
        case "pivotY":
          obj.pivotY = value;
          break;
      }
    };
    /**
     * 非 PS 制作的素材设置布局，自研的设置布局方法跟 PS 的不一样
     * @param obj 要布局的对象
     * @param key 要设置的属性,left,right,top,bottom等
     * @param value 值
     */
    Layout.setHistoryLayout = setHistoryLayout;

    Layout.prototype.updateEditorDate = function() {
      // 因为可能获取 editorData 时，数据已经变更，需要重新获取
      this.editorData = this.gameObject.getScript('playsmart.editor.data')
      this.editorDataDetail = this.editorData && this.editorData.$data
      this.editorDataDetailNodeOrigin = this.editorDataDetail && this.editorDataDetail.nodeOrigin
      this.worldPosition = null
      if (this.editorDataDetail && this.editorDataDetail.worldPosition) {
        if (ps.ScrFix.isP && this.editorDataDetail.worldPosition.pdef) {
          this.worldPosition = this.editorDataDetail.worldPosition.pdef
        } else if (ps.ScrFix.isL && this.editorDataDetail.worldPosition.ldef) {
          this.worldPosition = this.editorDataDetail.worldPosition.ldef
        }
      }

      // 如果是历史 layout 并且没有在编辑器变动过的话，就走历史的设置布局函数 ，只要经过新版编辑器就会有 worldPostion; 如果 editorDataDetailNodeOrigin === 2 的话，肯定走新逻辑
      this.runHistory = Boolean(
        this.runInHistoryLayout && !this.worldPosition
      )

      if (this.runInHistoryLayout && this.editorDataDetailNodeOrigin === 2) {
        this.runHistory = false
      }

      // 如果是走历史布局的话，则允许有 Ipad 布局，如果是走新版 layout，则直接过滤其他 layoutData
      this.disabledMultipleAdapter = !this.runHistory
    }
    Layout.prototype.awake = function () {
      //因为做动画需要
      // if (this.scaleXY === undefined || this.scaleXY === null)
      //     this.scaleXY = this.gameObject.scaleX;
      //初始化参数

      if (this.inited && ps.ENV !== "EDITOR") return;

      for (var key in this.layout) {
        var data = this.parseData(this.layout[key]);
        if (!data) continue;
        this.layoutData[key] = data;
        var keys = Object.keys(data);
        //检测配置的布局数据是否合法
        for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
          var key_1 = keys_1[_i];
          if (layoutPriority.indexOf(key_1) < 0) {
            console.error("\u5BF9\u8C61\u540D\uFF1A" + this.gameObject.name + "  \u9519\u8BEF\uFF1A\u5E03\u5C40\u53C2\u6570\u91CC\u4E0D\u5B58\u5728\"" + key_1 + "\"");
          }
        }
      }
      this.inited = true;
      this.refresh();
    };
    Layout.prototype.onEnable = function () {
      // 为什么删除，因为 visible 状态改动会触发节点的 enable 事件，这样会导致在设置 visible 的时候，会导致一个循环，因此 layout 脚本的 enable 事件不能触发 refresh
      // this.refresh();
    };
    /**
     * 获取布局数据
     * @param otype
     * @param mtype
     */
    Layout.prototype.getData = function (otype, mtype) {
      if (otype === void 0) {
        otype = "def";
      }
      if (mtype === void 0) {
        mtype = "def";
      }
      return this.layoutData[otype + mtype];
    };
    Object.defineProperty(Layout.prototype, "left", {
      get: function () {
        return this.layoutDef.left;
      }, set: function (v) {
        this.layoutDef.left = ps.Mathf.parseNumber(v);
        this.refresh();
      }, enumerable: true, configurable: true
    });
    Object.defineProperty(Layout.prototype, "top", {
      get: function () {
        return this.layoutDef.top;
      }, set: function (v) {
        this.layoutDef.top = ps.Mathf.parseNumber(v);
        this.refresh();
      }, enumerable: true, configurable: true
    });
    Object.defineProperty(Layout.prototype, "right", {
      get: function () {
        return this.layoutDef.right;
      }, set: function (v) {
        this.layoutDef.right = ps.Mathf.parseNumber(v);
        this.refresh();
      }, enumerable: true, configurable: true
    });
    Object.defineProperty(Layout.prototype, "bottom", {
      get: function () {
        return this.layoutDef.bottom;
      }, set: function (v) {
        this.layoutDef.bottom = ps.Mathf.parseNumber(v);
        this.refresh();
      }, enumerable: true, configurable: true
    });
    Object.defineProperty(Layout.prototype, "centerX", {
      get: function () {
        return this.layoutDef.centerX;
      }, set: function (v) {
        this.layoutDef.centerX = ps.Mathf.parseNumber(v);
        this.refresh();
      }, enumerable: true, configurable: true
    });
    Object.defineProperty(Layout.prototype, "centerY", {
      get: function () {
        return this.layoutDef.centerY;
      }, set: function (v) {
        this.layoutDef.centerY = ps.Mathf.parseNumber(v);
        this.refresh();
      }, enumerable: true, configurable: true
    });
    Object.defineProperty(Layout.prototype, "percX", {
      get: function () {
        return this.layoutDef.percX;
      }, set: function (v) {
        this.layoutDef.percX = ps.Mathf.parseNumber(v);
        this.refresh();
      }, enumerable: true, configurable: true
    });
    Object.defineProperty(Layout.prototype, "percY", {
      get: function () {
        return this.layoutDef.percY;
      }, set: function (v) {
        this.layoutDef.percY = ps.Mathf.parseNumber(v);
        this.refresh();
      }, enumerable: true, configurable: true
    });
    Object.defineProperty(Layout.prototype, "scaleXY", {
      get: function () {
        return this.layoutDef.scaleXY;
      }, set: function (v) {
        this.layoutDef.scaleXY = ps.Mathf.parseNumber(v);
        this.refresh();
      }, enumerable: true, configurable: true
    });
    // =====更新数据==========
    Layout.prototype.updateData = function (key, v) {
      var d;
      var flag = "l"
      if (ps.ScrFix.isP) {
        flag = "p"
      }
      if (ps.ScrFix.isIPX) {
        d = this.layoutData[flag + "ipx"]
      } else if (ps.ScrFix.isPAD) {
        d = this.layoutData[flag + "pad"]
      } else if (ps.ScrFix.isIPXM) {
        d = this.layoutData[flag + "ipxm"]
      }
      d[key] = v
    }

    //===========================================================
    /** 刷新布局 */
    Layout.prototype.refresh = function () {
      if (!this.inited) return;
      if (!this.enable) return;
      this.updateEditorDate()
      var curData = this.layoutDef.clone();
      var referenceResolution_type = 'All'
      if (UIRoot && UIRoot.getScript('ps.ScaleAdapterMtg') && UIRoot.getScript('ps.ScaleAdapterMtg').referenceResolution_type) {
        referenceResolution_type = UIRoot.getScript('ps.ScaleAdapterMtg').referenceResolution_type
      }
      // 当是横竖屏适配并且是竖屏时，或者只适配竖屏模式下（不管横竖屏） 都使用竖屏的 layout
      if ((ps.ScrFix.isP && referenceResolution_type === 'All') || referenceResolution_type === 'Vertical') {
        curData.merge(this.getData("p", "def"));
        if (!this.disabledMultipleAdapter) {
          if (ps.ScrFix.isIPX) {
            curData.merge(this.getData("def", "ipx"));
            curData.merge(this.getData("p", "ipx"));
          } else if (ps.ScrFix.isPAD) {
            curData.merge(this.getData("def", "pad"));
            curData.merge(this.getData("p", "pad"));
          } else if (ps.ScrFix.isIPXM) {
            curData.merge(this.getData("def", "ipxm"));
            curData.merge(this.getData("p", "ipxm"));
          }
        }

      }
      // 当是横竖屏适配并且是横屏时，或者只适配横屏模式下（不管横竖屏） 都使用横屏的 layout
      else if ((ps.ScrFix.isL && referenceResolution_type === 'All') || referenceResolution_type === 'Horizontal') {
        curData.merge(this.getData("l", "def"));
        if (!this.disabledMultipleAdapter) {
          if (ps.ScrFix.isIPX) {
            curData.merge(this.getData("def", "ipx"));
            curData.merge(this.getData("l", "ipx"));
          } else if (ps.ScrFix.isPAD) {
            curData.merge(this.getData("def", "pad"));
            curData.merge(this.getData("l", "pad"));
          } else if (ps.ScrFix.isIPXM) {
            curData.merge(this.getData("def", "ipxm"));
            curData.merge(this.getData("l", "ipxm"));
          }
        }
      }

      this.useData(curData);
    };
    /** 使用布局数据 */
    Layout.prototype.useData = function (data) {
      if (this.autoSize) {
        this.gameObject.width = this.gameObject.parent.width;
        this.gameObject.height = this.gameObject.parent.height;
      }
      this.updateEditorDate()

      var self = this

      this.layoutSetting = true

      //根据优先级设置数据
      for (var _i = 0, layoutPriority_1 = layoutPriority; _i < layoutPriority_1.length; _i++) {
        var key = layoutPriority_1[_i];
        if (this.ignoreProps && Object.values(this.ignoreProps).includes(key)) continue; //忽略的属性设置
        var v = data[key];
        if (v != undefined && (!isNaN(v) || typeof (v) === "string")) {
          // 如果是历史 layout 节点，并且没有改动过，则直接用之前的布局函数
          if (self.runHistory) {
            Layout.setHistoryLayout(this.gameObject, key, v)
          } else {
            Layout.setLayout(this.gameObject, key, v);
          }
        }
      }
      this.layoutSetting = false
    };
    //===========================================================
    /**
     * 把字符串转换为LayoutData
     * @param rawdata 原始数据（字符串)
     */
    Layout.prototype.parseData = function (rawdata) {
      if (rawdata === undefined || rawdata === null || rawdata === "") return;
      var propertys = rawdata.split(",");
      var obj = new LayoutData;
      for (var _i = 0, propertys_1 = propertys; _i < propertys_1.length; _i++) {
        var item = propertys_1[_i];
        var a = item.split(":");
        obj[a[0]] = a[1];
      }
      return obj;
      // rawdata = "{\"" + rawdata + "}";
      // rawdata = rawdata.replace(/,/g, ",\"");
      // rawdata = rawdata.replace(/:/g, "\":");
      // let obj2 = JSON.parse(rawdata);
      // return obj2;
    };
    return Layout;
  }(qc.Behaviour));
  ps.Layout = Layout;
  qc.registerBehaviour('ps.Layout', Layout);
  Layout["__menu"] = 'Custom/Layout';
  Layout["__ability"] = layoutPriority;
  /** 布局数据 */
  var LayoutData = /** @class */ (function () {
    function LayoutData() {
    }

    /**
     * 克隆布局数据
     */
    LayoutData.prototype.clone = function () {
      var newData = new LayoutData();
      for (var _i = 0, layoutPriority_2 = layoutPriority; _i < layoutPriority_2.length; _i++) {
        var key = layoutPriority_2[_i];
        if (this[key] != undefined) newData[key] = this[key];
      }
      return newData;
    };
    /**
     * 合并布局数据
     * @param data 要合并的数据
     */
    LayoutData.prototype.merge = function (data) {
      if (data) {
        var keys = Object.keys(data);
        for (var _i = 0, keys_2 = keys; _i < keys_2.length; _i++) {
          var key = keys_2[_i];
          this[key] = data[key];
        }
      }
    };
    return LayoutData;
  }());
  ps.LayoutData = LayoutData;
})(ps || (ps = {}));
