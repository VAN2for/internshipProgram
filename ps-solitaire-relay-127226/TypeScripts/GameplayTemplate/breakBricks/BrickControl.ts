namespace ps {
  export enum BrickControlEvent {
    /** 砖块全部消灭完成 */
    Success,
    /**
     * 打砖块进度更新
     *
     * 事件负载为
     * {
     * @var node: 被消灭砖块节点,
     * @var specie: 被消灭的砖块类型,
     * @var line: 行数,
     * @var column: 列数,
     * }
     */
    Update,
  }

  /**
   *
   * @description
   * @author zhen.liang
   * @date 2023/02/06 15:31:25
   */
  export class BrickControl extends Behaviour {
    Event = new ps.EventDispatcher();
    private BrickMap: Map<string, { node: qc.Node; specie: string }>;
    constructor(gameObject: qc.Node) {
      super(gameObject);
    }

    /** 砖块数量 */
    private brickNum: number;
    /** 世界的重力值设定 */
    private Box2DGravity: number = 0;
    /** 像素到米的转换比率 */
    private Box2DPTM: number = 100;
    /** 期望物理的调度帧率 */
    private Box2DFrameRate: number = 60;
    /** 序列化 */
    private serializableFields = {
      brickNum: qc.Serializer.NUMBER,
      Box2DGravity: qc.Serializer.INT,
      Box2DPTM: qc.Serializer.INT,
      Box2DFrameRate: qc.Serializer.INT,
    };

    public createGui(): GuiType {
      return {
        brickNum: {
          title: "砖块数量",
          component: "input", // 数字控件
        },
        Box2DGravity: {
          title: "世界的重力值设定",
          component: "input", // 数字控件
        },
        Box2DPTM: {
          title: "像素到米的转换比率",
          component: "input", // 数字控件
        },
        Box2DFrameRate: {
          title: "期望物理的调度帧率",
          component: "input", // 数字控件
        },
      };
    }

    /** 已销毁砖块数量 */
    private deleteBrickNum = 0;
    /** 试玩初始化的处理 */
    public onInit() {
      this.BrickMap = new Map();
      box2d.PTM = this.Box2DPTM;
      box2d.gravity = this.Box2DGravity;
      box2d.frameRate = this.Box2DFrameRate;
    }

    /** 砖块写入 */
    public setBrickMap(
      line: number,
      column: number,
      value: { node: qc.Node; specie: string }
    ) {
      this.BrickMap.set(this.getKey(line, column), value);
    }

    /** 砖块销毁 */
    public deleteBrick(line: number, column: number) {
      if (!this.BrickMap.has(this.getKey(line, column))) return;
      const { node, specie } = this.BrickMap.get(this.getKey(line, column));
      node.visible = false;
      this.BrickMap.delete(this.getKey(line, column));
      this.deleteBrickNum++;
      this.Event.dispatch(BrickControlEvent.Update, {
        node,
        specie,
        line,
        column,
      });
      const progress = this.deleteBrickNum / this.brickNum;
      if (progress >= 1) this.Event.dispatch(BrickControlEvent.Success);
    }

    private getKey(line: number, column: number) {
      return line + "," + column;
    }
  }
  qc.registerBehaviour("ps.BrickControl", BrickControl);
  BrickControl["__menu"] = "玩法模板/打砖块玩法/砖块控制器（BrickControl）";
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
}
