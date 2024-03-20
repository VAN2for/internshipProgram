// Polyfill: filter, map
Array.prototype.filter || (Array.prototype.filter = function (t, r) {
  "use strict"
  if ("Function" != typeof t && "function" != typeof t || !this) throw new TypeError
  var o = this.length >>> 0, n = Array(o), e = this, i = 0, a = -1
  if (void 0 === r) for (; ++a !== o;) a in this && t(e[a], a, e) && (n[i++] = e[a])
  else for (; ++a !== o;) a in this && t.call(r, e[a], a, e) && (n[i++] = e[a])
  return n.length = i, n
}), Array.prototype.map || (Array.prototype.map = function (t) {
  var r, o, n
  if (null == this) throw new TypeError("this is null or not defined")
  var e = Object(this), i = e.length >>> 0
  if ("function" != typeof t) throw new TypeError(t + " is not a function")
  for (arguments.length > 1 && (r = arguments[1]), o = Array(i), n = 0; i > n;) {
    var a, l
    n in e && (a = e[n], l = t.call(r, a, n, e), o[n] = l), n++
  }
  return o
})

function timerIdGenerator(timers) {
  var timerPrefix = 'timer_'
  if (!timers) return timerPrefix + '0'
  var timerArr = []
  for (var i in timers) {
    timerArr.push(i)
  }
  var autoTimersId = timerArr.filter(function (timer) {
    return /^timer_/.test(timer)
  }).map(function (timer) {
    return timer.replace(timerPrefix, '')
  }).filter(function (timer) {
    return !isNaN(timer)
  }).sort().pop()
  if (typeof autoTimersId !== 'undefined') {
    var timerId = timerPrefix + ++autoTimersId
    while (timerId in timers) {
      timerId = timerPrefix + ++autoTimersId
    }
    return timerId
  } else {
    return timerPrefix + '0'
  }
}

function getEventGroup(ast) {
  var eventGroup = []
  var uniqueGroup = []
  for (var i in ast) {
    var condition = ast[i].condition
    if (condition && condition.length > 0) {
      var node = qc_game.nodePool.find(condition[0].node)
      if (node) {
        var name = ''
        if (node.getScript('ps.SceneConfig')) {
          name = node.uniqueName
        } else {
          name = node.name
        }
        var indexName
        if (condition[0].type === 'event') {
          // 排除自定义事件
          if (condition[0].content === 'CUSTOM_EVENT') {
            continue
          }
          indexName = node.uuid + condition[0].content
        } else {
          indexName = node.uuid + 'compare'
        }
        if (!uniqueGroup.includes(indexName)) {
          uniqueGroup.push(indexName)
          eventGroup.push({
            label: name + ' ' + condition[0].conditionLabel,
            value: ast[i].id
          })
        }
      }
    }
  }
  return eventGroup
}

function getGamePlay (node) {
  while(1) {
    if (node.getScript('ps.VPGamePlay')) {
      break;
    }
    node = node.parent;
  }
  return node;
}

function getCurScene (node) {
  while(1) {
    if (node.parent.getScript('ps.VPGamePlay')) {
      break;
    }
    node = node.parent;
  }
  return node;
}

const creatBuiltinItem = function (list, animation) {
  const last = list[list.length - 1]
  if (last && last.builtinId && last.builtinId === animation.builtinId) {
    last.group.push(animation)
  } else {
    list.push({
      builtinId: animation.builtinId,
      builtinGroup: animation.builtinGroup,
      animationName: animation.animationName,
      group: [animation],
      uuid: animation.builtinId
    })
  }
}
// 兼容预设动画，处理动画数据列表
const cookAnimationList = function (list) {
  const animationList = []
  list.forEach(function (script) {
    if (script.builtinId) {
      creatBuiltinItem(animationList, script)
    } else {
      animationList.push(script)
    }
  })
  return animationList
}

/**
 * 可视化编程基本行为能力 =============================== 扩展tween==================
 */
function getTweenVpActionConfig() {
  var _this = this;
  return {
    vpPlayTweenByUuid: {
      type: "object",
      properties: {
        vpTweenUuid: {
          title: "选择动画",
          component: "select",
          field: {
            options: []
          }
        }
      },
      initData: {
        vpTweenUuid: ''
      },
      initFunc: function (target) {
        if (!target) return;
        var _that = this;
        _that.properties.vpTweenUuid.field.options = [];
        var targetObj = qc_game.nodePool.find(target.uuid);
        const tweenList = targetObj.getScripts('qc.Tween')
        const animationList = cookAnimationList(tweenList || [])
        animationList.forEach(function (item, index) {
          _that.properties.vpTweenUuid.field.options.push({
            label: item.animationName,
            value: item.uuid
          })
        })
        if (tweenList.length > 0) {
          _that.initData.vpTweenUuid = tweenList[0].builtinId || tweenList[0].uuid;
        } else {
          _that.initData.vpTweenUuid = '';
        }
      }
    },
    vpPlayTweenByUuidGoOn: {
      type: "object",
      properties: {
        vpTweenUuid: {
          title: "选择动画",
          component: "select",
          field: {
            options: []
          }
        }
      },
      initData: {
        vpTweenUuid: ''
      },
      initFunc: function (target) {
        if (!target) return;
        var _that = this;
        _that.properties.vpTweenUuid.field.options = [];
        var targetObj = qc_game.nodePool.find(target.uuid);
        const tweenList = targetObj.getScripts('qc.Tween')
        const animationList = cookAnimationList(tweenList || [])
        animationList.forEach(function (item, index) {
          _that.properties.vpTweenUuid.field.options.push({
            label: item.animationName,
            value: item.uuid
          })
        });
        if (tweenList.length > 0) {
          _that.initData.vpTweenUuid = tweenList[0].builtinId || tweenList[0].uuid;
        } else {
          _that.initData.vpTweenUuid = '';
        }
      }
    },
    vpStopTweenByUuid: {
      type: "object",
      properties: {
        vpTweenUuid: {
          title: "选择动画",
          component: "select",
          field: {
            options: []
          }
        }
      },
      initData: {
        vpTweenUuid: ''
      },
      initFunc: function (target) {
        if (!target) return;
        var _that = this;
        _that.properties.vpTweenUuid.field.options = [];
        var targetObj = qc_game.nodePool.find(target.uuid);
        const tweenList = targetObj.getScripts('qc.Tween')
        const animationList = cookAnimationList(tweenList || [])
        animationList.forEach(function (item, index) {
          _that.properties.vpTweenUuid.field.options.push({
            label: item.animationName,
            value: item.uuid
          })
        })
        if (tweenList.length > 0) {
          _that.initData.vpTweenUuid = tweenList[0].builtinId || tweenList[0].uuid;
        } else {
          _that.initData.vpTweenUuid = '';
        }
      }
    }
  }
}

if (!qc.Tween.prototype.vpActionConfig) {
  Object.defineProperties(qc.Tween.prototype, {
    "vpActionConfig": {
      get: getTweenVpActionConfig
    }
  });
} else {
  Object.defineProperties(qc.Tween.prototype, {
    "vpActionConfigBack": {
      get: getTweenVpActionConfig
    }
  });
}

qc.Tween.prototype.vpAction = {
  vpPlayTweenByUuid: {
    label: '播放单个动画',
    method: 'vpPlayTweenByUuid',
    category: '单个动画',
    target: true,
    paramLabel: 'target'
  },
  vpStopTweenByUuid: {
    label: '暂停播放单个动画',
    method: 'vpStopTweenByUuid',
    category: '单个动画',
    target: true,
    paramLabel: 'target'
  },
  vpPlayTweenByUuidGoOn: {
    label: '继续播放单个动画',
    method: 'vpPlayTweenByUuidGoOn',
    category: '单个动画',
    target: true,
    paramLabel: 'target'
  },
  vpPlayTween: {
    label: '从头播放全部动画',
    method: 'vpPlayTween',
    category: '全部动画',
    target: true,
    paramLabel: 'target'
  },
  vpPlayTweenGoOn: {
    label: '继续播放全部动画',
    method: 'vpPlayTweenGoOn',
    category: '全部动画',
    target: true,
    paramLabel: 'target'
  },
  vpStopTween: {
    label: '暂停播放全部动画',
    method: 'vpStopTween',
    category: '全部动画',
    target: true,
    paramLabel: 'target'
  }
}

qc.Tween.prototype.vpPlayTweenByUuid = function (param) {
  var tweens = this.getScripts('qc.Tween');
  if (tweens.length > 0) {
    for (var i in tweens) {
      if (tweens[i].uuid === param.vpTweenUuid || tweens[i].builtinId === param.vpTweenUuid) {
        tweens[i].playForward(true);
        if (!tweens[i].builtinId) break;
      }
    }
  }
}

qc.Tween.prototype.vpStopTweenByUuid = function (param) {
  var tweens = this.getScripts('qc.Tween');
  if (tweens.length > 0) {
    for (var i in tweens) {
      if (tweens[i].uuid === param.vpTweenUuid || tweens[i].builtinId === param.vpTweenUuid) {
        tweens[i].stop();
        if (!tweens[i].builtinId) break;
      }
    }
  }
}

qc.Tween.prototype.vpPlayTweenByUuidGoOn = function (param) {
  var tweens = this.getScripts('qc.Tween');
  if (tweens.length > 0) {
    for (var i in tweens) {
      if (tweens[i].uuid === param.vpTweenUuid || tweens[i].builtinId === param.vpTweenUuid) {
        tweens[i].playForward(false);
        if (!tweens[i].builtinId) break;
      }
    }
  }
}

qc.Tween.prototype.vpPlayTween = function () {
  var tweens = this.gameObject.getScripts(qc.Tween);
  tweens.forEach(function (tween) {
    tween.stop();
    tween.resetToBeginning();
    tween.playForward();
  });
}

qc.Tween.prototype.vpPlayTweenGoOn = function () {
  var tweens = this.gameObject.getScripts(qc.Tween);
  tweens.forEach(function (tween) {
    tween.stop();
    tween.playForward(false);
  });
}

qc.Tween.prototype.vpStopTween = function () {
  var tweens = this.gameObject.getScripts(qc.Tween);
  tweens.forEach(function (tween) {
    tween.stop();
  });
}

/**
 *  Aries 可视化编程基本行为能力 =============================== 扩展序列帧==================
 */
const getMovieClipVpActionConfig = function () {
  var _this = this;
  return {
    vpPlayMC: {
      type: "object",
      properties: {
        loop: {
          title: "是否循环",
          component: "switch"
        },
        hideWhenFinished: {
          title: "播放完后是否隐藏",
          component: "switch"
        },
        pingpong: {
          title: "来回播放",
          component: "switch"
        },
        playTime: {
          title: "播放次数",
          component: "input-number"
        }
      },
      initData: {
        loop: false,
        hideWhenFinished: false,
        pingpong: false,
        playTime: -1
      },
      initFunc: function () {
      }
    }
  }
}
if (!ps.MovieClip.prototype.vpActionConfig) {

  Object.defineProperties(ps.MovieClip.prototype, {
    "vpActionConfig": {
      get: getMovieClipVpActionConfig
    }
  })
} else {
  Object.defineProperties(ps.MovieClip.prototype, {
    "vpActionConfigBack": {
      get: getMovieClipVpActionConfig
    }
  })
}

ps.MovieClip.prototype.vpAction = {
  vpPlayMC: {
    label: '显示并播放序列帧',
    method: 'vpPlayMC',
    category: '序列帧',
    target: true,
    paramLabel: 'target'
  },
  vpStopMC: {
    label: '暂停序列帧',
    method: 'vpStopMC',
    category: '序列帧',
    target: true,
    paramLabel: 'target'
  }
}

ps.MovieClip.prototype.vpPlayMC = function (param) {
  var _this = this;
  var mc = this.gameObject.getScript('ps.MovieClip');
  // 循环参数优先与播放次数参数
  var t = parseInt(param.loop ? 0 : param.playTime ? param.playTime : 1);
  this.gameObject.visible = true;
  var data = this.gameObject.getScript('ps.MovieClip').data;
  var animationName = '';
  for (var i in data) {
    if (i !== 'allFramePlaySmart') {
      animationName = i;
    }
  }
  if (param.hideWhenFinished) {
    mc.gotoAndPlay(animationName, t, function () {
      _this.gameObject.visible = false;
    }, null, param.pingpong);
  } else {
    mc.gotoAndPlay(animationName, t, null, null, param.pingpong);
  }
}
ps.MovieClip.prototype.vpStopMC = function (param) {
  var mc = this.gameObject.getScript('ps.MovieClip')
  mc.stop()
}

const getSKPlayerVpActionConfig = function () {
  var _this = this;
  return {
    vpPlaySKPlayer: {
      type: "object",
      properties: {
        animationName: {
          title: "动作名字",
          component: "select",
          field: {
            options: []
          }
        },
        loop: {
          title: "是否循环",
          component: "switch"
        },
        speed: {
          title: "播放速度",
          component: 'input-number',
          field: {
            controlsPosition: 'right',
            min: 1
          }
        }
      },
      initData: {
        animationName: '',
        loop: false,
        speed: 1
      },
      initFunc: function (target) {
        if (!target) return;
        var targetObj = qc_game.nodePool.find(target.uuid);
        var _that = this;
        targetObj.animationNameList.forEach(function (item) {
          _that.properties.animationName.field.options.push({
            label: item,
            value: item
          })
        })
      }
    }
  }
}
if (!ps.SKPlayer.prototype.vpActionConfig) {

  Object.defineProperties(ps.SKPlayer.prototype, {
    "vpActionConfig": {
      get: getSKPlayerVpActionConfig
    }
  })
} else {
  Object.defineProperties(ps.SKPlayer.prototype, {
    "vpActionConfigBack": {
      get: getSKPlayerVpActionConfig
    }
  })
}

ps.SKPlayer.prototype.vpAction = {
  vpPlaySKPlayer: {
    label: '播放龙骨',
    method: 'vpPlaySKPlayer',
    category: '龙骨',
    target: true,
    paramLabel: 'target'
  },
  vpStopSKPlayer: {
    label: '暂停龙骨',
    method: 'vpStopSKPlayer',
    category: '龙骨',
    target: true,
    paramLabel: 'target'
  }
}

ps.SKPlayer.prototype.vpPlaySKPlayer = function (param) {
  var sk = this.gameObject.getScript('ps.SKPlayer');
  sk.animationName = param.animationName;
  sk.loop = param.loop;
  sk.speed = param.speed;
  sk.play();
}

ps.SKPlayer.prototype.vpStopSKPlayer = function (param) {
  this.gameObject.stop();
}

/**
 * Aries 可视化编程基本行为能力 =============================== 扩展粒子特效==================
 */
function getParticleSystemVPBasicAction() {
  var vpAction = {
    vpPlayParticle: {
      label: '显示并播放粒子特效',
      method: 'vpPlayParticle',
      category: '粒子特效',
      target: true,
      paramLabel: 'target'
    },
    vpStopParticle: {
      label: '暂停粒子特效',
      method: 'vpStopParticle',
      category: '粒子特效',
      target: true,
      paramLabel: 'target'
    },
    vpClearParticle: {
      label: '清除粒子特效',
      method: 'vpClearParticle',
      category: '粒子特效',
      target: true,
      paramLabel: 'target'
    },
    vpParticleStartColor: {
      label: '粒子出生颜色',
      method: 'vpParticleStartColor',
      category: '粒子特效',
      target: true,
      paramLabel: 'target'
    }
  };
  var vpActionConfig = {
    vpParticleStartColor: {
      type: "object",
      properties: {
        startColor: {
          title: "粒子出生颜色",
          component: "color-picker",
        }
      },
      initData: {
        startColor: "#FFFFFF"
      },
      initFunc: function () {
      }
    }
  };
  // Object.assign(vpAction, this.__proto__.VPBasicAction.vpAction);
  // Object.assign(vpActionConfig, this.__proto__.VPBasicAction.vpActionConfig);
  return {
    vpAction: vpAction,
    vpActionConfig: vpActionConfig
  };
}

if (qc.ParticleSystem) {
  if (!qc.ParticleSystem.prototype.VPBasicAction) {
    Object.defineProperties(qc.ParticleSystem.prototype, {
      'VPBasicAction': {
        get: getParticleSystemVPBasicAction,
        set: function (v) {

        }
      }
    });
  } else {
    Object.defineProperties(qc.ParticleSystem.prototype, {
      'VPBasicActionBack': {
        get: getParticleSystemVPBasicAction,
        set: function (v) {

        }
      }
    });
  }
}

/**
 * 获取节点所有后代节点，包括节点自身
 */
function getDescendants(
  node
) {
  const nodes = []

  const rec = function (qcNode) {
    nodes.push(qcNode)

    if (qcNode.children && qcNode.children.length > 0) {
      qcNode.children.forEach(function (item) {
        rec(item)
      })
    }
  }

  rec(node)
  return nodes
}

qc.Node.prototype.vpClearParticle = function (param) {
  const nodeChildren = getDescendants(this)
  nodeChildren.forEach(function (node) {
    node.clear && node.clear()
  })
}

qc.Node.prototype.vpPlayParticle = function (param) {
  const nodeChildren = getDescendants(this)
  // 因为粒子显示后要延后一定时间才layout到正确位置,所以不能显示后马上播放，不然会位置错乱。hack：先显示，暂停播放，延后0s后才播放粒子。
  nodeChildren.forEach(function (node) {
    // 先展示再播放
    !node.visible && (node.visible = true)
    node.pause && node.pause()
  });
  qc_game.timer.add(0, function () {
    nodeChildren.forEach(function (node) {
      node.reset && node.reset()
      node.start && node.start()
    });
  })
}

qc.Node.prototype.vpStopParticle = function (param) {
  const nodeChildren = getDescendants(this)
  nodeChildren.forEach(function (node) {
    node.pause && node.pause()
  })
}

qc.Node.prototype.vpParticleStartColor = function (param) {
  this.startColor = new qc.Color(param.startColor);
}

/**
 * 可视化编程基本行为能力 扩展node
 */
function getNodeVPBasicAction() {
  var _this = this;
  return {
    vpAction: {
      vpSwitchScene: {
        label: '跳转指定场景',
        method: 'vpSwitchScene',
        category: '跳转及埋点',
        target: false,
        paramLabel: 'jumpSceneId',
        paramParseFunc: function (paramInstance) {
          // 需要兼容旧数据
          var uuid = paramInstance.jumpSceneId ? paramInstance.jumpSceneId : paramInstance
          const sceneNode = qc_game.nodePool.find(uuid)
          if (sceneNode) {
            return sceneNode.uniqueName
          } else {
            return ''
          }
        }
      },
      vpSwitchNextScene: {
        label: '跳转到下一场景',
        method: 'vpSwitchNextScene',
        category: '跳转及埋点',
        target: false,
        paramLabel: 'none'
      },
      vpInstall: {
        label: '跳转应用商店',
        method: 'vpInstall',
        category: '跳转及埋点',
        target: false,
        paramLabel: 'none'
      },
      vpGameEnd: {
        label: '上报试玩结束',
        method: 'vpGameEnd',
        category: '跳转及埋点',
        target: false,
        paramLabel: 'none'
      },
      vpSendAction: {
        label: '设置埋点',
        method: 'vpSendAction',
        category: '跳转及埋点',
        target: false,
        paramLabel: 'action_id'
      },
      vpPosition: {
        label: '设置位置',
        method: 'vpPosition',
        category: '素材',
        target: true,
        paramLabel: 'target'
      },
      vpScaleXY: {
        label: '设置缩放',
        method: 'vpScaleXY',
        category: '素材',
        target: true,
        paramLabel: 'target'
      },
      vpRotate: {
        label: '设置旋转',
        method: 'vpRotate',
        category: '素材',
        target: true,
        paramLabel: 'target'
      },
      vpWidth: {
        label: '设置宽度',
        method: 'vpWidth',
        category: '素材',
        target: true,
        paramLabel: 'target'
      },
      vpHeight: {
        label: '设置高度',
        method: 'vpHeight',
        category: '素材',
        target: true,
        paramLabel: 'target'
      },
      vpShowHide: {
        label: '显示/隐藏素材',
        method: 'vpShowHide',
        category: '素材',
        target: true,
        paramLabel: 'target'
      },
      vpAlpha: {
        label: '设置透明度',
        method: 'vpAlpha',
        category: '素材',
        target: true,
        paramLabel: 'target'
      },
      vpColor: {
        label: '设置颜色',
        method: 'vpColor',
        category: '素材',
        target: true,
        paramLabel: 'target'
      },
      vpWaitTime: {
        label: '执行延迟',
        method: 'vpWaitTime',
        category: '计时器',
        target: false,
        paramLabel: 'timerId',
        paramParseFunc: function (paramInstance) {
          // 需要兼容旧数据
          return paramInstance.timerId ? paramInstance.timerId : paramInstance
        }
      },
      vpClearTime: {
        label: '取消执行延迟',
        method: 'vpClearTime',
        category: '计时器',
        target: false,
        paramLabel: 'timerId',
        paramParseFunc: function (paramInstance) {
          // 需要兼容旧数据
          return paramInstance.timerId ? paramInstance.timerId : paramInstance
        }
      },
      enabledEventActive: {
        label: '启用事件',
        method: 'enabledEventActive',
        category: '事件',
        target: false,
        paramLabel: 'eventId',
        paramParseFunc: function (paramInstance) {
          var ast = _this.getScript('playsmart.editor.data').vpAst;
          for (var i in ast) {
            if (ast[i].id === paramInstance.eventId) {
              var node = qc_game.nodePool.find(ast[i].condition[0].node)
              var name = ''
              if (node.getScript('ps.SceneConfig')) {
                name = node.uniqueName
              } else {
                name = node.name
              }
              return name + ast[i].condition[0].conditionLabel
            }
          }
          return ''
        }
      },
      enabledEventBan: {
        label: '禁用事件',
        method: 'enabledEventBan',
        category: '事件',
        target: false,
        paramLabel: 'eventId',
        paramParseFunc: function (paramInstance) {
          var ast = _this.getScript('playsmart.editor.data').vpAst;
          for (var i in ast) {
            if (ast[i].id === paramInstance.eventId) {
              var node = qc_game.nodePool.find(ast[i].condition[0].node)
              var name = ''
              if (node.getScript('ps.SceneConfig')) {
                name = node.uniqueName
              } else {
                name = node.name
              }
              return name + ast[i].condition[0].conditionLabel
            }
          }
          return ''
        }
      },
      vpReplayBgm: {
        label: '从头播放背景音乐',
        method: 'vpReplayBgm',
        category: '背景音乐',
        target: false,
        paramLabel: 'none'
      },
      vpResumeBgm: {
        label: '继续播放背景音乐',
        method: 'vpResumeBgm',
        category: '背景音乐',
        target: false,
        paramLabel: 'none'
      },
      vpStopBgm: {
        label: '暂停播放背景音乐',
        method: 'vpStopBgm',
        category: '背景音乐',
        target: false,
        paramLabel: 'none'
      },
      vpShakeScreen: {
        label: '震屏效果',
        method: 'vpShakeScreen',
        category: '其他',
        target: false,
        paramLabel: '震屏效果'
      },
      vpCompute: {
        label: '赋值',
        method: 'vpCompute',
        category: '其他',
        target: false,
        paramLabel: ['target', 'method', 'valueType', 'value'],
        paramParseFunc: function (paramInstance, actionI18nConfig) {
          var target = typeof paramInstance.target.data === 'undefined' ? paramInstance.target : paramInstance.target.data;
          var value = typeof paramInstance.value.data === 'undefined' ? paramInstance.value : paramInstance.value.data;
          if (paramInstance.valueType === 'globalVar') {
            return target + ' ' + paramInstance.method + ' ' + value + '[' + actionI18nConfig.vpCompute.paramFormConfig.target.title + ']'
          } else if (paramInstance.valueType === 'string') {
            return target + ' ' + paramInstance.method + ' "' + value + '"'
          } else {
            return target + ' ' + paramInstance.method + ' ' + value
          }
        }
      },
      vpRetry: {
        label: '重新试玩',
        method: 'vpRetry',
        category: '其他',
        target: false,
        paramLabel: 'none'
      },
    },
    vpActionConfig: {
      vpShowHide: {
        type: "object",
        properties: {
          isShow: {
            title: "显示/隐藏",
            component: "select",
            field: {
              options: [
                {
                  label: '显示',
                  value: true
                },
                {
                  label: '隐藏',
                  value: false
                }
              ]
            }
          }
        },
        initData: {
          isShow: true
        }
      },
      vpPosition: {
        type: "object",
        properties: {
          position: {
            title: "位置",
            component: 'event-position'
          }
        },
        initData: {
          position: {
            x: '',
            y: ''
          }
        },
        initFunc: function (target) {
          if (!target) return;
          var targetObj = qc_game.nodePool.find(target.uuid);
          var _that = this;
          try {
            _that.initData.position.x = targetObj.x;
            _that.initData.position.y = targetObj.y;
          } catch (e) {
            _that.initData.position.x = 0;
            _that.initData.position.y = 0;
          }
        }
      },
      vpScaleXY: {
        type: "object",
        properties: {
          scale: {
            title: "缩放比例",
            component: 'event-scale'
          }
        },
        initData: {
          scale: {
            scaleX: 1,
            scaleY: 1
          }
        },
        initFunc: function (target) {
          if (!target) return;
          var targetObj = qc_game.nodePool.find(target.uuid);
          var _that = this;
          try {
            _that.initData.scale.scaleX = targetObj.scaleX;
            _that.initData.scale.scaleY = targetObj.scaleY;
          } catch (e) {
            _that.initData.scale.scaleX = 1;
            _that.initData.scale.scaleX = 1;
          }
        }
      },
      vpColor: {
        type: "object",
        properties: {
          color: {
            title: "设置颜色",
            component: "color-picker",
          }
        },
        initData: {
          color: "#FFFFFF"
        },
        initFunc: function () {
        }
      },
      vpRotate: {
        type: "object",
        properties: {
          rotation: {
            title: "旋转角度",
            component: "input",
            field: {
              type: "number"
            }
          }
        },
        initData: {
          rotation: 0
        },
        initFunc: function (target) {
          if (!target) return;
          var targetObj = qc_game.nodePool.find(target.uuid);
          var _that = this;
          try {
            _that.initData.rotation = Math.round(ps.Mathf.radianToAngle(targetObj.rotation));
          } catch (e) {
            _that.initData.rotation = Math.round(ps.Mathf.radianToAngle(0));
          }
        }
      },
      vpWidth: {
        type: "object",
        properties: {
          width: {
            title: "设置宽度",
            component: "input",
            field: {
              type: "number",
              step: 0.1
            }
          }
        },
        initData: {
          width: 0
        },
        initFunc: function (target) {
          if (!target) return;
          var targetObj = qc_game.nodePool.find(target.uuid);
          var _that = this;
          _that.initData.width = targetObj.width;
        }
      },
      vpHeight: {
        type: "object",
        properties: {
          height: {
            title: "设置高度",
            component: "input",
            field: {
              type: "number",
              step: 0.1
            }
          }
        },
        initData: {
          height: 0
        },
        initFunc: function (target) {
          if (!target) return;
          var targetObj = qc_game.nodePool.find(target.uuid);
          var _that = this;
          _that.initData.height = targetObj.height;
        }
      },
      vpAlpha: {
        type: "object",
        properties: {
          alpha: {
            title: "设置透明度",
            component: "input-append",
            field: {
              type: "number"
            }
          }
        },
        initData: {
          alpha: 0
        },
        initFunc: function (target) {
          if (!target) return;
          var targetObj = qc_game.nodePool.find(target.uuid);
          var _that = this;
          try {
            _that.initData.alpha = targetObj.alpha * 100;
          } catch (e) {
            _that.initData.alpha = 100;
          }
        }
      },
      vpSendAction: {
        type: "object",
        properties: {
          action_id: {
            title: "设置埋点id",
            component: "input",
            field: {
              type: "number"
            }
          }
        },
        initData: {
          action_id: 1
        },
        initFunc: function () {
        }
      },
      vpSwitchScene: {
        type: "object",
        properties: {
          jumpSceneId: {
            title: "跳转的场景",
            component: "select",
            field: {
              options: []
            }
          }
        },
        initData: {
          jumpSceneId: ''
        },
        initFunc: function () {
          var that = this;
          that.properties.jumpSceneId.field.options = []
          // 跳转场景只支持跳转普通场景
          qc_game.world.children[0].children[0].children.forEach(function (item) {
            if (ps.SceneConfig.isNormalScene(item)) {
              that.properties.jumpSceneId.field.options.push({
                label: item.uniqueName,
                value: item.uuid
              })
            }
          });
        }
      },
      vpWaitTime: {
        type: "object",
        properties: {
          ms: {
            title: "延迟秒数",
            component: "input-append",
            field: {
              type: "number"
            }
          },
          timerId: {
            title: '定时器名称',
            component: 'input',
            field: {
              type: 'text'
            }
          }
        },
        initData: {
          ms: 0,
          timerId: ''
        },
        initFunc: function () {
          var vpTimer = UIRoot.getChild('gamePlay').getScript('ps.VPTimer')
          var timers = vpTimer.timers
          this.initData.timerId = timerIdGenerator(timers)
        },
        finishFunc: function (model) {
          var vpTimer = UIRoot.getChild('gamePlay').getScript('ps.VPTimer')
          var timers = vpTimer.timers
          timers[model.timerId] = null
        }
      },
      vpClearTime: {
        type: 'object',
        properties: {
          timerId: {
            title: '定时器ID',
            component: 'select',
            field: {
              options: []
            }
          }
        },
        initData: {
          timerId: null
        },
        initFunc: function () {
          var that = this
          var vpTimer = UIRoot.getChild('gamePlay').getScript('ps.VPTimer')
          var timers = vpTimer.timers
          that.properties.timerId.field.options = Object.keys(timers).map(function (key) {
            return {
              label: key,
              value: key
            }
          })
        }
      },
      enabledEventActive: {
        type: 'object',
        properties: {
          eventId: {
            title: '事件',
            component: 'select',
            field: {
              options: []
            }
          }
        },
        initData: {
          eventId: null
        },
        initFunc: function () {
          var that = this;
          var curScene = _this;
          var ast = curScene.getScript('playsmart.editor.data').vpAst
          that.properties.eventId.field.options = getEventGroup(ast)
        }
      },
      enabledEventBan: {
        type: 'object',
        properties: {
          eventId: {
            title: '事件',
            component: 'select',
            field: {
              options: []
            }
          }
        },
        initData: {
          eventId: null
        },
        initFunc: function () {
          var that = this;
          var curScene = _this;
          var ast = curScene.getScript('playsmart.editor.data').vpAst
          that.properties.eventId.field.options = getEventGroup(ast)
        }
      },
      vpShakeScreen: {
        type: "object",
        properties: {
          duration: {
            title: "持续时长",
            component: "input-append",
            field: {
              type: "number"
            }
          },
          fequence: {
            title: "抖动频率",
            component: "input-append",
            field: {
              type: "number"
            }
          },
          xy: {
            title: '抖动最大距离',
            component: 'event-xy'
          }
        },
        initData: {
          duration: 1,
          fequence: 20,
          xy: {
            x: 10,
            y: 10
          }
        }
      },
      vpCompute: {
        type: "object",
        properties: {
          target: {
            title: "全局变量",
            component: "select",
            field: {
              options: []
            }
          },
          method: {
            title: "运算方法",
            component: "select",
            field: {
              options: []
            }
          },
          value: {
            title: "运算数",
            component: "event-compute",
          }
        },
        initData: {
          target: '',
          method: '',
          value: '',
        },
        initFunc: function (globalVar) {
          var that = this
          this.properties.target.field.options = []
          globalVar.forEach(function (item) {
            that.properties.target.field.options.push({
              label: item.globalVarKey,
              value: item.globalVarKey
            })
          })
        }
      }
    }
  }
}

if (!qc.Node.prototype.VPBasicAction) {
  Object.defineProperties(qc.Node.prototype, {
    'VPBasicAction': {
      get: getNodeVPBasicAction,
      set: function (v) {

      }
    }
  });
} else {
  Object.defineProperties(qc.Node.prototype, {
    'VPBasicActionBack': {
      get: getNodeVPBasicAction,
      set: function (v) {

      }
    }
  });
}

qc.Node.prototype.vpShowHide = function (param) {
  var video = this.getScript('ps.Video');
  if (video) {
    // 视频节点显示隐藏需要特殊处理
    video.isShowHideByVp = true;
  }
  this.setPropertyIgnoreLayout({ prop: 'visible', value: param.isShow });
}

qc.Node.prototype.vpWidth = function (param) {
  var layout = this.getScript('ps.Layout');
  if (layout) {
    if (layout.layoutData.pdef && layout.layoutData.pdef.width) {
      delete layout.layoutData.pdef.width;
    }
    if (layout.layoutData.ldef && layout.layoutData.ldef.width) {
      delete layout.layoutData.ldef.width;
    }
  }
  this.width = param.width;
}

qc.Node.prototype.vpHeight = function (param) {
  var layout = this.getScript('ps.Layout');
  if (layout) {
    if (layout.layoutData.pdef && layout.layoutData.pdef.height) {
      delete layout.layoutData.pdef.height;
    }
    if (layout.layoutData.ldef && layout.layoutData.ldef.height) {
      delete layout.layoutData.ldef.height;
    }
  }
  this.height = param.height;
}

qc.Node.prototype.vpColor = function (param) {
  this.colorTint = new qc.Color(param.color);
}

qc.Node.prototype.vpInstall = function (param) {
  ps.install();
}

qc.Node.prototype.vpGameEnd = function (param) {
  ps.gameEnd();
}

qc.Node.prototype.vpSendAction = function (param) {
  ps.sendAction(param.action_id);
}

qc.Node.prototype.vpAlpha = function (param) {
  this.alpha = param.alpha / 100;
}

qc.Node.prototype.vpRotate = function (param) {
  this.rotation = ps.Mathf.angleToRadian(param.rotation);
}

qc.Node.prototype.vpPosition = function (param) {
  var layout = this.getScript("ps.Layout");
  if (layout) {
    this.removeScript(layout);
    layout.enable = false;
  }
  var x = param.position.x;
  var y = param.position.y;
  if (x === '') {
    x = 0;
  }
  if (y === '') {
    y = 0;
  }
  this.x = x;
  this.y = y;
}

qc.Node.prototype.vpScaleXY = function (param) {
  var layout = this.getScript("ps.Layout");
  if (layout) {
    this.removeScript(layout);
    layout.enable = false;
  }
  var scaleX = param.scale.scaleX;
  var scaleY = param.scale.scaleY;
  if (scaleX === '') {
    scaleX = 1;
  }
  if (scaleY === '') {
    scaleY = 1;
  }
  this.scaleX = scaleX;
  this.scaleY = scaleY;
}

qc.Node.prototype.vpSwitchScene = function (param) {
  if (param.jumpSceneId) {
    ps.mainState.dispatch(ps.GameState.SCENECHANGE, param.jumpSceneId);
  }
};

qc.Node.prototype.vpSwitchNextScene = function () {
  var gamePlay = getGamePlay(this);
  var curScene = getCurScene(this);
  var normalSceneList = gamePlay.children.filter(function(item) {
    return ps.SceneConfig.isNormalScene(item)
  })
  var scene;
  for (var i = 0; i < normalSceneList.length; i++) {
    if (normalSceneList[i].uuid === curScene.uuid) {
      scene = (i + 1 === normalSceneList.length) ? i : i + 1;
      scene = normalSceneList[scene].uuid;
      break;
    }
  }
  ps.mainState.dispatch(ps.GameState.SCENECHANGE, scene);
}

qc.Node.prototype.vpWaitTime = function (param) {
  var gamePlay = getGamePlay(this);
  return new Promise(function (resolve, reject) {
    var vpTimer = gamePlay.getScript('ps.VPTimer');
    if (vpTimer.timers[param.timerId]) {
      return;
    }
    // https://confluence.mobvista.com/pages/viewpage.action?pageId=70128726
    // 编辑器存储的是秒，所以需要乘以 1000
    var ms = param.ms * 1000
    var timeEvent = qc_game.timer.add(ms, function () {
      vpTimer.timers[param.timerId] = null;
      resolve();
    })

    var timers = vpTimer.timers
    var timerId
    if (param.timerId) {
      timerId = param.timerId
    } else {
      timerId = timerIdGenerator(timers)
    }
    if (!timers) timers = {}
    timers[timerId] = timeEvent
  });
};

qc.Node.prototype.vpClearTime = function (param) {
  var gamePlay = getGamePlay(this);
  var vpTimer = gamePlay.getScript('ps.VPTimer')
  var timers = vpTimer.timers
  var timeEvent = timers[param.timerId]
  if (timeEvent) {
    qc_game.timer.remove(timeEvent)
    timers[param.timerId] = null
  }
};

qc.Node.prototype.vpReplayBgm = function (param) {
  if (ps.audioManager.musicPath) {
    ps.audioManager.playMusic(ps.audioManager.musicPath.replace(/^resource\//, ''));
  } else {
    var match = ps.cfg.BGM_NAME.match(/(.*)\/audio\/(.*)\.mp3/);
    if (match) {
      var url = ps.cfg.BGM_NAME.replace(/^resource\//, '');
      ps.initAudioManager(url);
    }
  }
}

qc.Node.prototype.vpResumeBgm = function (param) {
  ps.audioManager.resumeMusic();
}

qc.Node.prototype.vpStopBgm = function (param) {
  ps.audioManager.pauseMusic();
}

qc.Node.prototype.vpShakeScreen = function (param) {
  var gamePlay = getGamePlay(this);
  gamePlay.children.forEach(function(scene) {
    ps.ShakeTool.shakeObj(scene, param.duration * 1000, param.fequence, param.xy.x, param.xy.y);
  });
};

qc.Node.prototype.vpCompute = function (param) {
  var gamePlay = getGamePlay(this);
  function hasPlaysmartGlobalVars() {
    return !!gamePlay.getScript('ps.VPGamePlay').serializableFields.playsmartGlobalVars;
  }

  var targetObject
  var target = param.target
  if (target.targetNode && target.targetNodeScript && target.data) {
    targetObject = qc_game.nodePool.find(target.targetNode).getScript(target.targetNodeScript)
    if (hasPlaysmartGlobalVars()) {
      var playsmartGlobalVars = gamePlay.getScript('ps.VPGamePlay').playsmartGlobalVars;
      param.target = Object.values(playsmartGlobalVars).find(function (item) {
        return item.globalVarKey === target.data
      }).id;
    } else {
      param.target = target.data;
    }
  }
  var value = param.value
  if (typeof targetObject[param.target] === 'number') {
    value = Number(value)
  }
  // 支持全局变量间的运算
  if (param.valueType === 'globalVar') {
    var obj = qc_game.nodePool.find(param.value.targetNode).getScript(param.value.targetNodeScript)
    if (hasPlaysmartGlobalVars()) {
      var playsmartGlobalVars = gamePlay.getScript('ps.VPGamePlay').playsmartGlobalVars;
      var key = Object.values(playsmartGlobalVars).find(function (item) {
        return item.globalVarKey === param.value.data
      }).id;
      value = obj[key];
    } else {
      value = obj[param.value.data];
    }
  }
  switch (param.method) {
    case '+':
      setTimeout(function () {
        targetObject[param.target] = targetObject[param.target] + value
      }, 0);
      break;
    case '-':
      setTimeout(function () {
        targetObject[param.target] = targetObject[param.target] - value
      }, 0);
      break;
    case '*':
      setTimeout(function () {
        targetObject[param.target] = targetObject[param.target] * value
      }, 0);
      break;
    case '/':
      setTimeout(function () {
        targetObject[param.target] = targetObject[param.target] / value
      }, 0);
      break;
    case '=':
      setTimeout(() => {
        targetObject[param.target] = value
      }, 0);
    default:
      break;
  }
}
qc.Node.prototype.vpRetry = function (param) {
  ps.retry();
};

// 新增qc core js发布版本，修复无发布版本之前qc core 代码中切换父节点异常问题
if (!qc.PUBLISH_VERSION) {
  /**
   * 设置孩子的位置
   *
   * @method setChildIndex
   * @param child {qc.Node} 待设置的孩子对象
   * @param index {Number} 放入的位置
   */
  qc.Node.prototype.setChildIndex = function (child, index) {
    if (child.parent !== this) {
      return;
    }
    var phaserChildren = this.phaser.children;
    var currentIndex = phaserChildren.indexOf(child.phaser);
    if (currentIndex === index) {
      return;
    }
    phaserChildren.splice(currentIndex, 1); //remove from old position
    phaserChildren.splice(index, 0, child.phaser); //add at new position
    if (this.phaser.updateZ)
      this.phaser.updateZ();

    child.phaser.displayChanged(qc.DisplayChangeStatus.ORDER);

    // 派发孩子变化事件
    this._dispatchModelChangeEvent('parent', child);

    this._dispatchChildrenChanged('order', [child]);
  };

  /**
   * 切换父节点为指定节点，并保证本节点在世界坐标系中的状态不变
   * @param parent 要切换到的父亲节点
   * @param index 所在父亲节点的孩子位置索引，为空代表插入到最后
   */
  qc.Node.prototype.switchParent = function (parent, index) {
    // 目标父节点不允许是自身或者自身的子节点
    if (parent === this || parent.isDescendantOf(this))
      return;

    var worldTransBak = this.worldTransform;
    var a = worldTransBak.a;
    var b = worldTransBak.b;
    var c = worldTransBak.c;
    var d = worldTransBak.d;
    var tx = worldTransBak.tx;
    var ty = worldTransBak.ty;

    // 设置标志避免在设置父子关系的addChildAt函数中进行relayout，
    // 我们已经通过矩阵运算保持节点状态不变了，如果进行relayout会导致状态再次变化
    this._isSwitchParent = true;
    this.parent = parent;
    delete this._isSwitchParent;

    // 设置会原来index位置
    if (typeof index !== 'undefined') {
      this.parent.setChildIndex(this, index);
    }

    this.setTransformToWithMatrix(null, a, b, c, d, tx, ty);
  };

// 低版本qc-code动画函数与ps编辑器不一致，重写动画类保证动画执行与ps一致
  const reLoadForTweenPosition = function () {
    /**
     * 正向播放(保证与线上qc-core-debug执行的动画播放方法一致)
     */
    qc.Tween.prototype.playForward = function (reset) {
      var self = this
      // this.gameObject.getScript('ps.Layout') && this.gameObject.getScript('ps.Layout').refresh()

      // console.log(self.gameObject.name, '动画播放时是否已经实例化', self.gameObject.getScript('ps.VerticalHorizontal').inited)
      var arr = self.gameObject.getScripts(qc.TweenPosition);
      var index = arr.indexOf(self)
      if (index >= 1) {
        var m = new qc.Point(self.to.x - self.from.x, self.to.y - self.from.y)
        var last_tween = arr[index - 1];
        self.from = last_tween.to;
        self.to = new qc.Point(self.from.x + m.x, self.from.y + m.y)
      }

      if (reset) self.resetToBeginning();
      self.play(false);
    };

    // 转换模板，支持动画功能
    qc.Tween.pt2ps_has_animation = true

    qc.TweenPosition.prototype.updateFromAndTo = function () {
      var offset = new qc.Point(this.to.x - this.from.x, this.to.y - this.from.y);
      this.from = new qc.Point(this.gameObject.x, this.gameObject.y);
      this.to = new qc.Point(this.gameObject.x + offset.x, this.gameObject.y + offset.y);
    }

    // 帧调度: 驱动位置
    qc.TweenPosition.prototype.onUpdate = function (factor, isFinished) {
      var self = this;
      var _from = self.from, _to = self.to;
      ((self.moveAxis & qc.TweenPosition.ONLY_X) !== 0) && (self.gameObject.x = _from.x + factor * (_to.x - _from.x));
      ((self.moveAxis & qc.TweenPosition.ONLY_Y) !== 0) && (self.gameObject.y = _from.y + factor * (_to.y - _from.y));
    };

    /**
     * 将开始位置设成当前位置
     * 由于使用 setTransformToWorld 方法，不需要重新设置 x, y 的值
     */
    qc.TweenPosition.prototype.setStartToCurrValue = function () {
      ((this.moveAxis & qc.TweenPosition.ONLY_X) !== 0) && (this.gameObject.x = this.from.x);
      ((this.moveAxis & qc.TweenPosition.ONLY_Y) !== 0) && (this.gameObject.y = this.from.y);
    };

    /**
     * 将结束位置设成当前位置
     * 由于使用 setTransformToWorld 方法，不需要重新设置 x, y 的值
     */
    qc.TweenPosition.prototype.setEndToCurrValue = function () {
      ((this.moveAxis & qc.TweenPosition.ONLY_X) !== 0) && (this.gameObject.x = this.to.x);
      ((this.moveAxis & qc.TweenPosition.ONLY_Y) !== 0) && (this.gameObject.y = this.to.y);
    };

    /**
     * 将当前位置设为开始位置
     */
    qc.TweenPosition.prototype.setCurrToStartValue = function () {
      this.from = new qc.Point(this.gameObject.x, this.gameObject.y);
    };

    /**
     * 将当前位置设置为结束位置
     */
    qc.TweenPosition.prototype.setCurrToEndValue = function () {
      this.to = new qc.Point(this.gameObject.x, this.gameObject.y);
    };


    // 重定义动画类
    const newAnimationKey = {
      addType: qc.Serializer.NUMBER,
      animationId: qc.Serializer.STRING,
      animationName: qc.Serializer.STRING,
      builtinId: qc.Serializer.STRING,
      builtinGroup: qc.Serializer.STRING
    }
    qc.TweenPosition = qc.defineBehaviour('qc.TweenPosition', qc.TweenPosition, function () {
    }, {...newAnimationKey})
    qc.TweenScale = qc.defineBehaviour('qc.TweenScale', qc.TweenScale, function () {
    }, {...newAnimationKey})
    qc.TweenColor = qc.defineBehaviour('qc.TweenColor', qc.TweenColor, function () {
    }, {...newAnimationKey})
    qc.TweenRotation = qc.defineBehaviour('qc.TweenRotation', qc.TweenRotation, function () {
    }, {...newAnimationKey})
    qc.TweenAlpha = qc.defineBehaviour('qc.TweenAlpha', qc.TweenAlpha, function () {
    }, {...newAnimationKey})

    /**
     * x，y 轴位置都进行改变
     * @constant
     * @type {number}
     */
    qc.TweenPosition.BOTH = 255;
    /**
     * 只改变 x 轴位置
     * @constant
     * @type {number}
     */
    qc.TweenPosition.ONLY_X = 1;
    /**
     * 只改变 y 轴位置
     * @constant
     * @type {number}
     */
    qc.TweenPosition.ONLY_Y = 2;
  }

  reLoadForTweenPosition()


// 新版ps暂时不支持龙骨播放事件，对基础包进行屏蔽
  if (ps.SKPlayer.prototype.vpAction) {
    ps.SKPlayer.prototype.vpAction = {}
  }
}
