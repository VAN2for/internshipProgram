var __extends =
  (this && this.__extends) ||
  (function () {
    var extendStatics = function (d, b) {
      extendStatics =
        Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array &&
          function (d, b) {
            d.__proto__ = b
          }) ||
        function (d, b) {
          for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]
        }
      return extendStatics(d, b)
    }
    return function (d, b) {
      extendStatics(d, b)

      function __() {
        this.constructor = d
      }

      d.prototype =
        b === null ? Object.create(b) : ((__.prototype = b.prototype), new __())
    }
  })()

var ps
;(function (ps) {
  var VPGamePlay = /** @class */ (function (_super) {
    __extends(VPGamePlay, _super)

    function VPGamePlay(gameObject) {
      var _this = _super.call(this, gameObject) || this

      // ## scope variable ##
// undefined
_this._CAHtG6BFiYbM267 = true
// ## scope variable ##

      _this.timers = {}

      /** 序列化 */
      _this.serializableFields = {
        timers: qc.Serializer.MAPPING,
        playsmartGlobalVars: qc.Serializer.MAPPING,

        // ## serialize ##
_CAHtG6BFiYbM267: qc.Serializer.BOOLEAN

// ## serialize ##
      }
      return _this
    }

    VPGamePlay.prototype.awake = function () {
      const self = this
      self.normalScene = self.gameObject.children
      // 如果是支持全局配置的话，普通场景需要通过 sceneType 去获取
      if (ps.SceneConfig.__ability.indexOf('global') !== -1) {
        self.normalScene = self.gameObject.children.filter((item) => {
          return ps.SceneConfig.isNormalScene(item)
        })
      }
      const globalScene = self.gameObject.children.find((item) => {
        return ps.SceneConfig.isGlobalScene(item)
      })
      const playScene = self.gameObject.children.filter((item) => {
        return ps.SceneConfig.isPlayScene(item)
      })

      const toggleGlobalSceneLevel = (level) => {
        const maxLevel = self.gameObject.children.length - 1
        if (level) {
          globalScene.switchParent(self.gameObject, maxLevel)
        } else {
          globalScene.switchParent(self.gameObject, playScene.length)
        }
      }
      // 缓存起来已经显示的场景
      self.showSceneUUID = {}
      // 通过派送事件的方式显示，确保进场事件和动画正常执行
      const showScene = (node) => {
        // 在第一次时，不需要判断 visible 直接派送
        if (node && (!self.showSceneUUID[node.uuid] || !node.visible)) {
          self.showSceneUUID[node.uuid] = 1
          ps.mainState.dispatch(ps.GameState.SCENECHANGE, node.uuid)
        }
      }
      const hideScene = (node) => {
        if (node && node.visible) {
          node.visible = false
        }
      }
      ps.mainState.add(
        ps.GameState.SCENECHANGE,
        function (uuid) {
          const sceneNode = this.game.nodePool.find(uuid)
          const SceneConfig = sceneNode.SceneConfig
          const normalSceneExecution = () => {
            self.normalScene.forEach(function (item, index) {
              if (item.uuid === uuid) {
                item.visible = true
                if (ps.sendPSScene && typeof ps.sendPSScene === 'function') {
                  ps.sendPSScene('scene' + (index + 1))
                }
                if (SceneConfig.isShowGlobal) {
                  // 如果需要显示全局场景，但是全局场景当前是隐藏状态，则显示
                  showScene(globalScene)
                  // 调整全局场景的层级
                  toggleGlobalSceneLevel(SceneConfig.globalLevel)
                } else {
                  hideScene(globalScene)
                }
                if (SceneConfig.playUUID) {
                  playScene &&
                    playScene.length &&
                    playScene.forEach((node) => {
                      if (node.uuid === SceneConfig.playUUID) {
                        showScene(node)
                      } else {
                        hideScene(node)
                      }
                    })
                } else {
                  playScene.forEach((unit) => {
                    hideScene(unit)
                  })
                }
                // 结束场景自动发送gameEnd
                if (SceneConfig.isEnding) {
                  ps.gameEnd()
                }
              } else {
                hideScene(item)
              }
            })
          }
          const globalSceneExecution = () => {
            sceneNode.visible = true
          }
          const playSceneExecution = () => {
            sceneNode.visible = true
          }
          // 不同场景执行不同事件
          switch (SceneConfig.sceneType) {
            case ps.SceneConfig.SceneType.GLOBAL:
              globalSceneExecution()
              break
            case ps.SceneConfig.SceneType.PLAY:
              playSceneExecution()
              break
            case ps.SceneConfig.SceneType.NORMAL:
              normalSceneExecution()
              break
            default:
              normalSceneExecution()
              break
          }
        },
        this,
      )
      // 防止一开始时其他场景显示闪一下
      if (self.normalScene && self.normalScene.length) {
        self.normalScene.forEach(function(scene, index) {
          if (index === 0) {
            scene.visible = true;
            // 如果需要显示全局场景
            if (scene.SceneConfig && scene.SceneConfig.isShowGlobal) {
              globalScene.visible = true
            }
            if (scene.SceneConfig && scene.SceneConfig.playUUID) {
              playScene &&
                    playScene.length &&
                    playScene.forEach((node) => {
                      if (node.uuid === scene.SceneConfig.playUUID) {
                        node.visible = true
                      } else {
                        node.visible = false
                      }
                    })
            }
          } else {
            scene.visible = false
          }
        })
      }
    }

    VPGamePlay.prototype.onStart = function () {
      const self = this
      if (self.normalScene && self.normalScene.length) {
        ps.mainState.dispatch(
          ps.GameState.SCENECHANGE,
          self.normalScene[0].uuid,
        )
      }
    }

    VPGamePlay.prototype.update = function () {
      var _this = this

      // ## update ##

      // ## update ##
    }

    return VPGamePlay
  })(ps.Behaviour)
  ps.VPGamePlay = VPGamePlay

  // ## register behaviour ##
  qc.registerBehaviour('ps.VPGamePlay', VPGamePlay)
  // ## register behaviour ##
  VPGamePlay["__ability"] = 'playsmartGlobalVars';
})(ps || (ps = {}))
