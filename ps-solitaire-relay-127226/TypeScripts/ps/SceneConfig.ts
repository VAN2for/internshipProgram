namespace ps {
  // 自定义事件类型
  type CustomEvent = {
    // 自定义事件唯一标识，设计师在自定义事件命名时填写的小驼峰英文
    id: string
    // 自定义事件描述信息，告知研发该事件是什么时机触发
    desc: string
    label: {
      // 不同语言下的展示文案
      [key: string]: string
    }
  }

  // 自定义事件映射表
  type GameConfigMap = {
    // 记录自定义事件映射关系
    // 如果复制场景时，会改动这个 value 值，以达到 gameConfig 独立配置的目的
    [key: string]: string
  }

  enum SceneType {
    // 普通场景
    NORMAL = 0,
    // 全局场景
    GLOBAL = 1,
    // 玩法场景
    PLAY = 2,
  }

  enum GlobalLevel {
    // 全局配置场景的层级，0 代表底部（默认值）
    BOTTOM = 0,
    // 1 代表顶部
    TOP = 1,
  }

  // 部分编辑器层面使用的扩展字段
  type editorData = {
    // 玩法场景会有值，放置的是玩法场景绑定的普通场景的 uuid 集合
    normalUUID?: string[]
  }

  /**
   * Playsmart专用场景数据文件,挂在每个场景根节点上,用于记录持久化自定义数据
   * @author yaoquan.wu
   */
  export class SceneConfig extends Behaviour {
    /** 是否是结束场景 */
    public isEnding = false

    // 记录设计师填写的自定义事件集合
    public customEventSet: CustomEvent[] = []

    // 记录当前场景使用到的动态参数变量
    public gameConfigMap: GameConfigMap = {}

    // 如果是该场景挂载了玩法组件，挂载的玩法组件 UUID
    public playUUID: string = ''

    // 是否显示全局场景
    public isShowGlobal: boolean = false

    // 记录场景类型
    public sceneType: SceneType = SceneType.NORMAL

    // 记录全局场景显示的层级关系
    public globalLevel: GlobalLevel = GlobalLevel.TOP

    public $data: editorData = {}

    /** 序列化 */
    private serializableFields = {
      isEnding: qc.Serializer.BOOLEAN,
      customEventSet: qc.Serializer.MAPPING,
      gameConfigMap: qc.Serializer.MAPPING,
      sceneType: qc.Serializer.NUMBER,
      playUUID: qc.Serializer.STRING,
      isShowGlobal: qc.Serializer.BOOLEAN,
      globalLevel: qc.Serializer.NUMBER,
      $data: qc.Serializer.MAPPING,
    }
  }

  qc.registerBehaviour('ps.SceneConfig', SceneConfig)
  SceneConfig['_menu'] = 'Custom/SceneConfig'
  SceneConfig['__ability'] = 'global,play'
  SceneConfig['isNormalScene'] = function(node: qc.Node) {
    const sceneConfig = (node as any).SceneConfig
    return (
      (sceneConfig &&
        sceneConfig.sceneType === SceneType.NORMAL) ||
      (sceneConfig &&
        typeof sceneConfig.sceneType === 'undefined')
    )
  }
  SceneConfig['isGlobalScene'] = function(node: qc.Node) {
    const sceneConfig = (node as any).SceneConfig
    return sceneConfig && sceneConfig.sceneType === SceneType.GLOBAL
  }
  SceneConfig['isPlayScene'] = function(node: qc.Node) {
    const sceneConfig = (node as any).SceneConfig
    return sceneConfig && sceneConfig.sceneType === SceneType.PLAY
  }
  SceneConfig['SceneType'] = SceneType
}
