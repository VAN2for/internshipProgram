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
   * 横竖屏适配
   * @author yaoquan.wu
   */
  var VerticalHorizontal = /** @class */ (function (_super) {
    __extends(VerticalHorizontal, _super);
    function VerticalHorizontal(gameObject) {
      var _this = _super.call(this, gameObject) || this;
      this.adapterData = {
        tweenPosition: {
          // [uuid]: {
          //     from: {
          //         'pdef': {
          //             x: null, y: null,
          //             centerX: null, centerY: null,
          //             left: null, top: null,
          //             right: null, bottom: null
          //         },
          //         'ldef': {
          //             x: null, y: null,
          //             centerX: null, centerY: null,
          //             left: null, top: null,
          //             right: null, bottom: null
          //         }
          //     },
          //     to: {
          //         'pdef': {
          //             x: null, y: null,
          //             centerX: null, centerY: null,
          //             left: null, top: null,
          //             right: null, bottom: null
          //         },
          //         'ldef': {
          //             x: null, y: null,
          //             centerX: null, centerY: null,
          //             left: null, top: null,
          //             right: null, bottom: null
          //         }
          //     }
          // }
        },
        startScale: {
          'pdef': null,
          'ldef': null
        },
        startScaleMin: {
          'pdef': null,
          'ldef': null
        },
        startScaleMax: {
          'pdef': null,
          'ldef': null
        },
        dragonBoneAnimation: { // 龙骨动画，区分横竖屏
          'pdef': null,
          'ldef': null
        },
      };
      _this.serializableFields = {
        adapterData: qc.Serializer.MAPPING
      };
      _this.runInEditor = true;
      _this.inited = false
      return _this;
    }
    VerticalHorizontal.prototype.awake = function () {
      this.refreshAdapter()
    }
    VerticalHorizontal.prototype.onResize = function () {
      this.refreshAdapter()
    }
    // 获取当前屏幕下的适配数据
    VerticalHorizontal.prototype.getAdapterData = function (uuid, type) {
      if (
        this.adapterData.tweenPosition[uuid] &&
        this.adapterData.tweenPosition[uuid].from &&
        this.adapterData.tweenPosition[uuid].to &&
        this.adapterData.tweenPosition[uuid].from[type] &&
        this.adapterData.tweenPosition[uuid].to[type]
      ) {
        return {
          from: this.adapterData.tweenPosition[uuid].from[type],
          to: this.adapterData.tweenPosition[uuid].to[type]
        }
      }
      return null;
    }
    // 设置当前脚本的适配数据
    VerticalHorizontal.prototype.setAdapterData = function (uuid, type, data) {
      if (!this.adapterData.tweenPosition[uuid]) {
        this.adapterData.tweenPosition[uuid] = {
          from: {},
          to: {}
        };
      }
      this.adapterData.tweenPosition[uuid].from[type] = data.from;
      this.adapterData.tweenPosition[uuid].to[type] = data.to;
    }
    // 获取位移动画的差距值
    VerticalHorizontal.prototype.getPosGap = function (from, to) {
      return {
        x: to.x - from.x,
        y: to.y - from.y
      }
    }
    VerticalHorizontal.prototype.refreshAdapter = function () {
      var _this = this;
      var tps = this.gameObject.getScripts('qc.TweenPosition');
      _this.inited = false
      // 位移动画
      if (tps.length > 0) {
        tps.forEach(function (tp) {
          var uuid = tp.uuid;
          if (_this.adapterData.tweenPosition[uuid]) {
            // 根据适配信息更新动画参数
            var referenceResolution_type = 'All'
            if (UIRoot && UIRoot.getScript('ps.ScaleAdapterMtg') && UIRoot.getScript('ps.ScaleAdapterMtg').referenceResolution_type) {
              referenceResolution_type = UIRoot.getScript('ps.ScaleAdapterMtg').referenceResolution_type
            }
            const getResolution = function(isOtherResolution) {
              if (referenceResolution_type === 'All') {
                return ps.ScrFix.isP && !isOtherResolution ? 'pdef' : 'ldef'
              } else if (referenceResolution_type === 'Vertical') {
                return 'pdef'
              } else {
                return 'ldef'
              }
            }
            const resolution = getResolution()
            const otherResolution = getResolution(true)
            const adapterData = _this.getAdapterData(uuid, resolution) || _this.getAdapterData(uuid, otherResolution)
            var fromPos = _this.calPosition(adapterData ? adapterData.from : tp.from)
            var toPos = _this.calPosition(adapterData ? adapterData.to : tp.to)
            tp.from = new qc.Point(fromPos.x, fromPos.y)
            tp.to = new qc.Point(toPos.x, toPos.y)
          }
        })
      }
      // 粒子大小
      if (this.gameObject.class === 'qc.ParticleSystem') {
        if (ps.ScrFix.isP) {
          if (this.adapterData.startScale.pdef) {
            this.gameObject.startScale = this.adapterData.startScale.pdef
            this.gameObject.startScaleMin = this.adapterData.startScaleMin.pdef
            this.gameObject.startScaleMax = this.adapterData.startScaleMax.pdef
          } else if (this.adapterData.startScale.ldef) {
            this.gameObject.startScale = this.adapterData.startScale.ldef
            this.gameObject.startScaleMin = this.adapterData.startScaleMin.ldef
            this.gameObject.startScaleMax = this.adapterData.startScaleMax.ldef
          }
        } else {
          if (this.adapterData.startScale.ldef) {
            this.gameObject.startScale = this.adapterData.startScale.ldef
            this.gameObject.startScaleMin = this.adapterData.startScaleMin.ldef
            this.gameObject.startScaleMax = this.adapterData.startScaleMax.ldef
          } else if (this.adapterData.startScale.pdef) {
            this.gameObject.startScale = this.adapterData.startScale.pdef
            this.gameObject.startScaleMin = this.adapterData.startScaleMin.pdef
            this.gameObject.startScaleMax = this.adapterData.startScaleMax.pdef
          }
        }
      }
      // 龙骨动画
      var skplayer = this.gameObject.getScript('ps.SKPlayer')
      if (skplayer) {
        var skDataPdef = this.adapterData.dragonBoneAnimation.pdef
        var skDataLdef = this.adapterData.dragonBoneAnimation.ldef
        if (ps.ScrFix.isP) {
          if (skDataPdef) {
            skplayer.animationName = skDataPdef.animationName || skplayer.animationName
            if (typeof skDataPdef.loop === 'boolean') {
              skplayer.loop = skDataPdef.loop
            }
            skplayer.speed = skDataPdef.speed || skplayer.speed
          } else if (skDataLdef) {
            skplayer.animationName = skDataLdef.animationName || skplayer.animationName
            if (typeof skDataLdef.loop === 'boolean') {
              skplayer.loop = skDataLdef.loop
            }
            skplayer.speed = skDataLdef.speed || skplayer.speed
          }
        } else {
          if (skDataLdef) {
            skplayer.animationName = skDataLdef.animationName || skplayer.animationName
            if (typeof skDataLdef.loop === 'boolean') {
              skplayer.loop = skDataLdef.loop
            }
            skplayer.speed = skDataLdef.speed || skplayer.speed
          } else if (skDataPdef) {
            skplayer.animationName = skDataPdef.animationName || skplayer.animationName
            if (typeof skDataPdef.loop === 'boolean') {
              skplayer.loop = skDataPdef.loop
            }
            skplayer.speed = skDataPdef.speed || skplayer.speed
          }
        }
        if (this.gameObject.visible) {
          skplayer.play && skplayer.play()
        }
      }

      _this.inited = true
    }
    // 位移动画计算xy
    VerticalHorizontal.prototype.calPosition = function (posData) {
      var realWidth = this.gameObject.width * this.gameObject.scaleX;
      var realHeight = this.gameObject.height * this.gameObject.scaleY;
      var offsetX = this.gameObject.pivotX * realWidth;
      var offsetY = this.gameObject.pivotY * realHeight;
      // 判断节点是否是一级节点
      var isFirstLevelNodeInScene = function(node) {
        if (node && node.parent && node.parent.parent && node.parent.parent.name === 'gamePlay' && node.parent.parent.getScript('ps.VPGamePlay')) {
          return true
        }
        return false
      }
      var x,y;
      // 通过left,right,centerX,top,bottom,centerY,x,y计算x,y.和Layout.js的setLayout算法一样
      if (posData.left !== null && typeof posData.left !== 'undefined') {
        targetPos = this.gameObject.parent.width * posData.left + offsetX
        x = targetPos;
      } else if (posData.right !== null && typeof posData.right !== 'undefined') {
        targetPos = this.gameObject.parent.width * (1 - posData.right ) - offsetX
        x =  targetPos;
      } else if (posData.centerX !== null && typeof posData.centerX !== 'undefined') {
        targetPos = this.gameObject.parent.width * posData.centerX;
        x = (this.gameObject.parent.width) / 2 + targetPos;
      } else if (posData.x !== null && typeof posData.x !== 'undefined') {
        if (isFirstLevelNodeInScene(this.gameObject) && posData.rootWidth) {
          x = posData.x + ((this.gameObject.parent.width - posData.rootWidth) / 2);
        } else {
          x = posData.x;
        }
      }

      if (posData.top !== null && typeof posData.top !== 'undefined') {
        targetPos = this.gameObject.parent.height * posData.top + offsetY
        y = targetPos;
      } else if (posData.bottom !== null && typeof posData.bottom !== 'undefined') {
        targetPos = this.gameObject.parent.height * (1 - posData.bottom) - offsetY
        y = targetPos;
      } else if (posData.centerY !== null && typeof posData.centerY !== 'undefined') {
        targetPos = this.gameObject.parent.height * posData.centerY;
        y = (this.gameObject.parent.height) / 2 + targetPos;
      } else if (posData.y !== null && typeof posData.y !== 'undefined') {
        y = posData.y;
        if (isFirstLevelNodeInScene(this.gameObject) && posData.rootHeight) {
          y = posData.y + ((this.gameObject.parent.height - posData.rootHeight) / 2);
        } else {
          y = posData.y;
        }
      }
      return  {
        x: x,
        y: y
      }
    }
    return VerticalHorizontal;
  }(ps.Behaviour));
  ps.VerticalHorizontal = VerticalHorizontal;
  qc.registerBehaviour('ps.VerticalHorizontal', VerticalHorizontal);
})(ps || (ps = {}));
