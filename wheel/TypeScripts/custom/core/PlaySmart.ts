/** 版本 */
// @ts-ignore
let PS_VERSION = '2.7.0'
/** qc接口对象 */
let qc_game: qc.Game
/** phaser接口对象 */
let game: Phaser.Game
/** box2d物理世界对象 */
let box2d: Box2DWorld
/** 场景对象根节点 */
let UIRoot: qc.Node

type Channel =
  | 'local'
  | 'm'
  | 'dsp'
  | 'fb'
  | 'google'
  | 'unity'
  | 'vungle'
  | 'applovin'
  | 'csj'
  | 'toutiao'
  | 'ironsource'
  | 'tiktok'

/** playSmart框架 */
namespace ps {
  /** 渠道 */
  export let channel: Channel = 'local'
  /** 环境 */
  export let ENV: 'EDITOR' | 'DEBUG' | 'RELEASE' = 'RELEASE'
  /** 编辑器对象，在编辑器的模式下才有 */
  export let editor: {
    /** 编辑器场景 */
    scene: {
      gameSize: { width: number; height: number }
    }
  }
  /** 开始界面 */
  export let startPanel: qc.Node
  /** 结束界面 */
  export let endingPanel: qc.Node
  /** 全屏触摸遮罩 */
  let touchMask: qc.Node
  /** 游戏状态控制 */
  export let mainState = new ps.GameState()
  /** 玩家自己gameRetry不更新动态参数。仓库在线制作、实时预览需要通过gameRetry更新动态参数 */
  export let playerRetry = false
  export let enableAction = true
  export let enablePSScene = true // 是否发 scene 埋点
  /** 项目配置 */
  export let cfg = {
    AUDIO_PATH: 'resource',
    /** 背景音名，默认为空。无背景音时不播放 */
    BGM_NAME: '',
    /** 自动播放BGM,默认自动播放 */
    AUTO_PLAY_BGM: true,
    /** 自动gameStart(调试用) */
    AUTO_GAMESTART: true,
    /** 显示fps数据 */
    SHOW_FPS: true,
    /** 使用gameConfig.json */
    USE_CONFIG_JSON: true,
    /** 拥有开始界面 */
    HAS_START_PANEL: true,
    /** 拥有ending界面 */
    HAS_ENDING_PANEL: true,
    /** 重玩援关闭埋点记录 */
    DISABLE_RETRY_ACTIONS: false,
  }
  /** 调试配置(方便调试用，在调试模式下会覆盖项目配置) */
  export let debugCfg = {
    /** 自动gameStart(调试用) */
    AUTO_GAMESTART: true,
    /** 显示fps数据 */
    SHOW_FPS: false,
    USE_CONFIG_JSON: false,
  }
  //-----------------------------------------------------
  export let hasReady = false
  export let hasVideosReady = false
  export let hasBgReady = false
  export let hasStart = false
  export let hasLaunch = false
  export let loadScening = false
  /** 是否自动播放 填false则需要点击才能播放,默认true */
  export let withPlay = true
  /** 框架全局初始化接口 */
  export const init = () => {
    if (ps.hasLaunch) return
    game = qc_game['phaser']
    box2d = qc_game['box2d']
    if (qici.config.editor) ps.editor = window.parent['G']
    const urlChannel = getQueryString('channel') as Channel
    //渠道优先用url上channel参数值
    if (urlChannel) {
      channel = urlChannel
    }
    //MW配置信息
    if (window['MW_CONFIG']) {
      if (!urlChannel) channel = MW_CONFIG.channel
    }
    if (window['playsound'] === false) {
      Print.orange('playsound:false')
    }
    //打印信息
    printVersion()
    ps.audioManager.initialize(ps.cfg.AUDIO_PATH + '/')
  }
  /** 加载结束 */
  export let onLoaded = () => {
    console.log('config', ps.cfg)
    ps.Audio.rootPath = ps.cfg.AUDIO_PATH
    //根节点
    UIRoot = qc_game.world.getChildAt(0)
    //编辑器模式下
    if (qici.config.editor) {
      Print.green('gameReady')
      if (window['gameReady']) {
        try {
          window['gameReady']()
        } catch (error) {
          console.error(error)
        }
      }
      return
    }
    UIRoot.visible = false
    //创建开始界面
    createStartPanel()
  }
  /**
   * 是否可以发 gameReady
   * 发 gameReady 需要等待资源加载完毕才可以发
   * 如果有视频的话，需要等待视频加载完毕，再发
   * 如果有背景图片的话，需要等待背景图片加载完毕，再发
   */
  let hasSendGameReady = false;
  export let checkReady = () => {
    // 如果 UIRoot 没有准备好 或者已经触发过 gameReady，直接 return
    if (!UIRoot || hasSendGameReady) return
    const gamePlay = UIRoot.getChild('gamePlay')
    const videosManager =
      gamePlay &&
      (gamePlay as any).VideosManager &&
      gamePlay.getScript('ps.VideosManager')
    const globalConfig =
      gamePlay &&
      (gamePlay as any).GlobalConfigBg &&
      gamePlay.getScript('ps.GlobalConfigBg')
    // 如果有 videosManager ，需要判断 ps.hasVideosReady
    // 如果有 globalConfig ，需要判断 ps.hasBgReady
    const flag =
      ps.hasReady &&
      (!videosManager || ps.hasVideosReady) &&
      (!globalConfig || ps.hasBgReady)
    if (flag) {
      ps.Print.green('gameReady')
      hasSendGameReady = true
      if (window['gameReady']) {
        try {
          window['gameReady']()
        } catch (error) {
          console.error(error)
        }
      }
      checkLaunch()
    }
  }
  /** 创建开始界面 */
  function createStartPanel() {
    if (!cfg.HAS_START_PANEL) {
      onStartPanelLoaded()
      return
    }
    //动态加载开始界面
    qc_game.assets.maxRetryTimes = 0
    qc_game.assets.load('resource/start/start.bin', function (r: qc.Prefab) {
      if (r) {
        startPanel = qc_game.add.clone(r, UIRoot)
      } else {
        ps.Print.red('start开始界面不存在')
      }
      onStartPanelLoaded()
    })
  }
  /** 开始界面加载结束 */
  function onStartPanelLoaded() {
    //调试参数
    if (ps.ENV === 'DEBUG') {
      ps.cfg.AUTO_GAMESTART = ps.debugCfg.AUTO_GAMESTART
      ps.cfg.SHOW_FPS = ps.debugCfg.SHOW_FPS
      ps.cfg.USE_CONFIG_JSON = ps.debugCfg.USE_CONFIG_JSON
    }
    if (ps.cfg.AUTO_GAMESTART) {
      Print.orange('AUTO_GAMESTART')
      window['gameStart']()
    }
    //初始化动态参数
    if (ps.cfg.USE_CONFIG_JSON) ps.GameConfig.init()
    console.log('GAME_CFG', ps.cfg.USE_CONFIG_JSON, GAME_CFG)
    //初始化完成
    ps.hasReady = true
    ps.mainState.ready()
    checkReady()
    //FPS工具
    if (ps.cfg.SHOW_FPS) {
      qc_game.assets.load('resource/prefab/FPS.bin', function (r: qc.Node) {
        qc_game.add.clone(r, UIRoot)
      })
    }
  }
  /** 真正的启动游戏 */
  export let checkLaunch = () => {
    if (qici.config.editor) return
    if (ps.hasLaunch) return
    if (ps.hasReady && ps.hasStart) {
      Print.green('gameLaunch')
      ps.hasLaunch = true
      //自动播放BGM
      if (ps.cfg.AUTO_PLAY_BGM != false) {
        const match = ps.cfg.BGM_NAME.match(/(.*)\/audio\/(.*)\.mp3/)
        if (match) {
          const url = ps.cfg.BGM_NAME.replace(/^resource\//, '')
          ps.initAudioManager(url, ps.withPlay)
        } else {
          // 没有背景音乐也需要play空bgm,兼容gameStart(false)的渠道一进游戏就播放其他音效的问题
          ps.initAudioManager('game/audio/bm_bgm0.mp3', ps.withPlay)
        }
      }
      UIRoot.visible = true
      //开始游戏
      gameStart()
    }
  }
  //PL接口集===============================================================
  /** 已发送埋点列表 */
  let actionRecords = {}
  /** 埋点接口 */
  export let sendAction = (action: number, force: boolean = false) => {
    if (!ps.enableAction && !force) return
    if (actionRecords[action]) return
    actionRecords[action] = true
    ps.Print.blue('sendAction ' + action)
    if (window['HttpAPI']) {
      try {
        window['HttpAPI'].sendPoint('action&action=' + action)
      } catch (error) {
        console.error(error)
      }
    }
  }
  /** 场景埋点接口 */
  export let sendPSScene = (scene: number, force: boolean = false) => {
    if (!ps.enablePSScene && !force) return
    ps.Print.blue('sendPSScene' + scene)
    if (window['HttpAPI']) {
      try {
        window['HttpAPI'].sendPoint(scene)
      } catch (error) {
        console.error(error)
      }
    }
  }

  // 如果是 PT 转进来的模版，不允许发 ps 内置的 sendPSScene 方法
  if (
    UIRoot &&
    UIRoot.scripts &&
    UIRoot.scripts.length &&
    UIRoot.scripts.some(function (item) {
      return item.class == 'playsmart.editor.data'
    })
  ) {
    ps.enablePSScene = !(
      UIRoot.getScript('playsmart.editor.data').$data &&
      UIRoot.getScript('playsmart.editor.data').$data.isTransformByPt
    )
  }

  /**
   * 全屏诱导点击,点击后自动跳转商店，发送GameEnd
   * @param endType null表示不弹出结束界面,默认win
   */
  export let induce = (endType: 'win' | 'lose' | 'null' = 'win') => {
    qc_game.input.onPointerDown.add(() => {
      ps.install(InstallType.Global)
      if (endType) {
        switch (endType) {
          case 'win':
            ps.gameEnd()
            break
          case 'lose':
            ps.gameEnd(false)
            break
          case 'null':
            ps.gameEnd(true, 0, false)
            break
        }
      }
    })
  }
  /**
   * 是否屏蔽素材内置全局可点
   * @description true: 屏蔽全局可点； false: 启动全局可点
   * @default false 默认为false, 只有头条、穿山甲、抖音、pangle渠道设置为true
   */
  export let disable_global_click = () => {
    return (
      (window.MW_CONFIG && window.MW_CONFIG['disable_global_click']) ||
      getQueryString('disable_global_click') == 'true'
    )
  }
  /**
   * 是否屏蔽素材内置自动跳转逻辑
   * @description true: 屏蔽自动跳转； false: 启动自动跳转
   * @default false 默认为false, 只有输出给DSP的渠道设置为true
   */
  export let disable_auto_click = () => {
    return (
      (window.MW_CONFIG && window.MW_CONFIG['disable_auto_click']) ||
      getQueryString('disable_auto_click') == 'true'
    )
  }
  /**
   * 是否屏蔽素材内置诱导跳转逻辑
   * @description true: 屏蔽诱导跳转； false: 启动诱导跳转
   * @default false 默认为false
   */
  export let disable_yd_click = () => {
    return (
      (window.MW_CONFIG && window.MW_CONFIG['disable_yd_click']) ||
      getQueryString('disable_yd_click') == 'true'
    )
  }
  /** 跳转类型 */
  export enum InstallType {
    None = 1 << 0, //正常跳转
    Global = 1 << 1, //全局跳转
    Auto = 1 << 2, //自动跳转
    YouDao = 1 << 3, //诱导跳转
  }
  /** 要转成仓库的类型 */
  const installTypeWrap: string[] = []
  installTypeWrap[InstallType.Global] = 'globalClick'
  installTypeWrap[InstallType.Auto] = 'autoClick'
  installTypeWrap[InstallType.YouDao] = 'youdaoClick'

  /**
   *  安装接口
   * @param {InstallType} type 触发类型，默认为：InstallType.None 正常跳转
   * @description 只需要单种情况时，可以这样传：install(false, InstallType.Global)；
   * @description 当需要多种情况都存在时，可以这样传：install(false, InstallType.Global | InstallType.Auto | InstallType.YouDao)
   */
  export let install = (type: InstallType = InstallType.None) => {
    const installType = installTypeWrap[type & -type] // 只取最右边第一个1的位。
    ps.Print.blue('install：' + installType)
    if (ps.ENV === 'DEBUG') ps.PopBox.popLabel(UIRoot, 'install', 60, '#FFFFFF')
    if (window['install']) {
      try {
        window['install']({ type: installType })
      } catch (error) {
        console.error(error)
      }
    }
  }
  /**
   * 试玩真正开始的接口
   */
  function gameStart() {
    if (touchMask) touchMask.visible = false
    ps.mainState.dispatch(ps.GameState.GAMESTART)
    if (!startPanel) ps.mainState.start()
  }
  /**
   * 试玩结束接口,调用此接口会展示ending界面
   * @param result 试玩结果（成功失败),默认为true
   * @param delayShow ending界面延迟弹出时间
   * @param showEnding 展示ending界面，默认true
   */
  export let gameEnd = (
    result: boolean = true,
    delayShow = 0,
    showEnding = true,
  ): qc.TimerEvent => {
    if (!ps.mainState.end(result)) return
    ps.Print.blue(`gameEnd ${result} ${delayShow} ${showEnding}`)
    if (window['gameEnd']) {
      try {
        window['gameEnd'](result)
      } catch (error) {
        console.error(error)
      }
    }
    if (!showEnding) return
    //
    return ps.timer.once(delayShow, () => {
      createEndingPanel()
    })
  }
  /** 创建ending界面 */
  function createEndingPanel() {
    if (!cfg.HAS_ENDING_PANEL) return
    //动态加载
    qc_game.assets.load('resource/ending/ending.bin', function (r: qc.Prefab) {
      endingPanel = qc_game.add.clone(r, UIRoot)
    })
  }
  //游戏开始或者重新开始的时候调用
  export let retry = () => {
    ps.Print.blue('retry')
    if (window['gameRetry']) {
      try {
        window['gameRetry']()
      } catch (error) {
        console.error(error)
      }
    }
    if (!ps.loadScening) ps.timer.clearAll()
    if (game.tweens['_tweens'] && game.tweens['_tweens'].length) {
      game.tweens['_tweens'].forEach((tween) => {
        if (tween) Tween.clear(tween)
      })
      game.tweens['_tweens'] = []
    }
    //关闭EndingSmart做的结束页
    window['closeEnding'] && window['closeEnding']()
    if (gameEvent && gameEvent.removeAll) gameEvent.removeAll()
    box2d?.getBodyList().forEach(body => { body.behaviour.destroy() });
    //重新加载场景
    ps.mainState.reset()
    // 重玩前需要删除节点池里的节点,再重新加载场景,不然重新加载场景后节点的uuid会全变
    UIRoot.removeChildren()
    // @ts-ignore
    Object.keys(qc_game.nodePool._nodes).forEach(function (uuid) {
      if (uuid !== UIRoot.uuid) {
        // @ts-ignore
        qc_game.nodePool.remove(uuid)
      }
    })
    ps.loadScening = true
    qc_game.scene.load(qc_game.scene.current, false, undefined, () => {
      ps.loadScening = false
      ps.hasReady = false
      ps.hasLaunch = false
      hasSendGameReady = false
      //重置状态
      ps.mainState.retry()
      createStartPanel()
    })
  }

  //==============================================================
  /** 打印版本信息 */
  export let printVersion = () => {
    let str = ` PlaySmart v${PS_VERSION} `
    str += `| Channel ${ps.channel} `
    str += `| Env ${ps.ENV} `
    if (hasBase64()) str += '| base64 '
    let colorList = ['#fb8cb3', '#d44a52', '#871905']
    console.log(
      `%c %c %c${str}%c %c `,
      `background: ${colorList[0]}`,
      `background: ${colorList[1]}`,
      `color:#fff;background: ${colorList[2]};`,
      `background: ${colorList[1]}`,
      `background: ${colorList[0]}`,
    );
  };

  /** VP事件行为类型 */
  type VpActionType = {
    id: string,
    label: string,
    method: string,
    node: string,
    script: string,
    target: boolean,
    targetLabel: string,
    uuid: string,
    param?: Record<string, unknown>,
    properties?: Record<string, unknown>,
    paramLabel?: string,
    paramLabelUI?: string,
  };

  /** VP事件类型 */
  type VpAstType = {
    id: string,
    action: VpActionType[],
    condition: any[],
    disabled: boolean
    sceneUuid?: string,
  } & CustomEventParamType;

  /** 获取事件参数类型 */
  export type CustomEventParamType = {
    /** 自定义事件触发的场景节点 */
    scene: qc.Node,
    /** 自定义事件中文名字 */
    eventName: string,
    /** 自定义事件英文名字 */
    eventNameEn?: string,
  };

  /** 获取事件参数序号类型 */
  type CustomEventParamIndexType = {
    /** 自定义事件响应动作序号 */
    index?: number,
  };

  /**
   * 通过自定义事件字段获取自定义对象数据
   * @param param 自定义事件字段
   * @returns 自定义事件对象数据
   */
  export function getCustomEventByParam(param: CustomEventParamType): VpAstType {
    const eventName = param.eventName;
    const eventNameEn = param.eventNameEn;
    const currentScene = param.scene;
    const asts = currentScene.getScript('playsmart.editor.data').vpAst;
    const vpAst = (Object as any).values(asts) as VpAstType[];
    const ast = vpAst.find(ast => {
      let isMatchCn = !eventName;
      let isMatchEn = !eventNameEn;
      if (!isMatchCn) {
        isMatchCn = ast.eventName === eventName;
      }
      if (!isMatchEn) {
        isMatchEn = ast.eventNameEn === eventNameEn;
      }
      return isMatchCn && isMatchEn && ast.condition[0].content === 'CUSTOM_EVENT';
    });
    if (!ast) {
      console.error('没有设置对应名字的自定义事件');
    }
    return ast;
  }

  /**
   * 通过自定义事件字段获取自定义对象数据
   * @param param 自定义事件字段
   * @returns 自定义事件对象数据
   */
  export function getCustomEventByCustomEventField(param: string | VpAstType): VpAstType {
    const obj = typeof (param) === "string" ? JSON.parse(param) as VpAstType : param;
    const eventName = obj.eventName;
    const eventNameEn = obj.eventNameEn;
    const sceneUuid = typeof (param) === "string" ? obj.sceneUuid : obj.condition[0].node;
    const scene = qc_game.nodePool.find(sceneUuid);

    return getCustomEventByParam({ scene, eventName, eventNameEn });
  }

  /**
   * 通过自定义事件参数，触发对应场景的自定义事件
   * @param param 自定义事件参数
   */
  export const triggerCustomEvent = (param: CustomEventParamType) => {
    const ast = getCustomEventByParam(param);
    if (ast) {
      ps.mainState.dispatch('CUSTOM_EVENT', ast.id);
    }
  };

  /**
   * 通过自定义事件字符串参数，触发对应场景的自定义事件
   * @param param 自定义事件字符串参数
   */
  export const triggerCustomEventByCustomEventField = (param: string) => {
    const ast = getCustomEventByCustomEventField(param);
    if (ast) {
      ps.mainState.dispatch('CUSTOM_EVENT', ast.id);
    }
  };

  /**
   * 获取自定义事件响应动作的参数
   * @param param.scene  自定义事件的场景节点
   * @param param.eventName 自定义事件名字
   * @param param.index 自定义事件响应动作序号
   */
  export const getCustomEventParam = (param: CustomEventParamType & CustomEventParamIndexType) => {
    const ast = getCustomEventByParam(param);
    if (ast) {
      return ast.action[param.index].param;
    }
  };

  /**
   * 播放PS可视化平台（VisualProgram）自定义事件行为
   * @param action 事件行为
   */
  export async function playVpAction(action: VpActionType) {
    const node: qc.Node = qc_game.nodePool.find(`${action.node}`);
    const script = action.script ? node.getScript(`${action.script}`) : null;
    const method = script?.[`${action.method}`] || node[`${action.method}`];
    await method.call(script || node, action.param);
  }

  /**
   * 播放PS可视化平台（VisualProgram）自定义事件行为数组
   * @param action 事件行为数组
   */
  export async function playVpActions(actions: VpActionType[]) {
    for (let i = 0; i < actions.length; i++) {
      await playVpAction(actions[i]);
    }
  }

  /**
   * 克隆一个事件对象
   * @param param 事件字符串参数
   * @returns 深度克隆后的事件对象
   */
  export function cloneCustomEventByCustomEventField(param: string | VpAstType): VpAstType {
    return Tools.deepClone(getCustomEventByCustomEventField(param));
  }

  /**
   * 克隆一个事件对象，并一一映射新的节点数据
   * @param param 事件字符串参数
   * @param nodes 要映射的新旧节点
   * @returns 深度克隆后的事件对象（映射成新节点后）
   */
  export function cloneCustomEventByCustomEventFieldToNode(param: string | VpAstType, nodes: { from: qc.Node, to: qc.Node }): VpAstType {
    const result = cloneCustomEventByCustomEventField(param);
    const { action } = result;

    const findActionByNode = (node: qc.Node) => {
      return action.find(a => a.node === node.uuid);
    };

    const updateActionNodeUuid = (from: qc.Node, to: qc.Node) => {
      const act = findActionByNode(from);
      if (act) act.node = to.uuid;
      from.children.forEach((element: qc.Node, i: number) => {
        updateActionNodeUuid(element, to.getChildAt(i));
      });
    };

    updateActionNodeUuid(nodes.from, nodes.to);
    return result;
  }
}

//SDK调用,游戏开始，一般用来播放背景音乐
function gameStart() {
  if (ps.hasStart) {
    ps.Print.red('ERROR:重复调用gameStart')
    return
  }
  document?.addEventListener(
    'PLAYABLE:switchScene',
    function (customEvent: Event) {
      // 需要跳转的场景
      const scene = (customEvent as any).detail.scene
      // 素材跳转逻辑
      const mainBeh = UIRoot.getScript(MainBeh) as MainBeh
      const sceneNodes =
        mainBeh && mainBeh.sceneNodes && mainBeh.sceneNodes.length > 0
          ? mainBeh.sceneNodes
          : UIRoot.children[0].children
      sceneNodes.forEach(function (sceneNode) {
        sceneNode.visible = sceneNode.name === scene
      })
    },
  )
  document?.addEventListener(
    'PLAYABLE:redirect',
    (e: Event & { detail: { type: 'ending'; params: [boolean] } }) => {
      if (e.detail.type == 'ending') {
        ps.gameEnd(e.detail.params[0])
      }
    },
  )
  ps.Print.green('gameStart')
  ps.hasStart = true
  ps.withPlay = arguments[0]
  //需要在gamestart的时候初始化webaudio
  ps.Audio.rootPath = ps.cfg.AUDIO_PATH
  ps.checkLaunch()
}
//SDK调用,游戏结束
function gameClose() {
  //sdk关闭的时候调用js的这个方法，一定要加上！不然安卓可能无法销毁音乐
  //停止所有音乐音效
  window['destorySound']()
}
