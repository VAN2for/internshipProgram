namespace ps {
  /**
   *
   * @description
   * @author zhen.liang
   * @date 2023/02/06 15:31:02
   */
  export class Brick extends Behaviour {
    constructor(gameObject: qc.Node) {
      super(gameObject);
    }

    /** 行数 */
    private line: number;
    /** 列数 */
    private column: number;
    /** 生命值 */
    private hitPoint: number = 1;
    /** 生命值在动态参数表中的key */
    private hitPointKey: string;
    /** 种类 */
    private specie: string;
    /** box2d碰撞形状 */
    private type: string = "WidthHeight";
    /** 控制器节点 */
    private BrickControlNode: qc.Node;
    /** 图片节点 */
    private imageNode: qc.Node;
    /** 文本节点 */
    private textNode: qc.UIText;
    /** 是否根据行列及宽高重设节点XY */
    private resetXYFlag: boolean = false;
    /** 撞击时播放音乐节点 */
    private contactAudio: qc.Node;

    /** 序列化 */
    private serializableFields = {
      BrickControlNode: qc.Serializer.NODE,
      textNode: qc.Serializer.NODE,
      imageNode: qc.Serializer.NODE,
      type: qc.Serializer.STRING,
      specie: qc.Serializer.STRING,
      hitPoint: qc.Serializer.NUMBER,
      hitPointKey: qc.Serializer.STRING,
      resetXYFlag: qc.Serializer.BOOLEAN,
      line: qc.Serializer.NUMBER,
      column: qc.Serializer.NUMBER,
      contactAudio: qc.Serializer.NODE,
    };

    public createGui(): GuiType {
      return {
        BrickControlNode: {
          title: "控制器节点",
          component: "node",
        },
        imageNode: {
          title: "图片节点",
          component: "node",
        },
        textNode: {
          title: "文本节点",
          component: "node",
        },
        type: {
          title: "碰撞区域及形状",
          component: "select", // 数字控件
          field: {
            options: [
              {
                value: "radio",
                label: "圆形"
              },
              {
                value: "rectangle",
                label: "矩形"
              },
              {
                value: "Edge",
                label: "实际像素"
              },
              {
                value: "WidthHeight",
                label: "实际宽高矩形"
              },
            ]
          }
        },
        specie: {
          title: "种类",
          component: "input", // 数字控件
        },
        hitPoint: {
          title: "生命值",
          component: "input",
          field: {
            type: "number"
          }
        },
        contactAudio: {
          title: "被撞击时播放音乐节点",
          component: "node", // 数字控件
        },
        hitPointKey: {
          title: "生命值key",
          component: "input", // 数字控件
        },
        resetXYFlag: {
          title: "是否根据宽高及行列设置节点位置",
          component: "switch", // 数字控件
        },
        line: {
          title: "行数",
          component: "input", // 数字控件
          field: {
            type: "number",
          },
        },
        column: {
          title: "列数",
          component: "input", // 数字控件
          field: {
            type: "number",
          },
        },
      };
    }

    public awake() {
      this.box2dBodyInit();
      if (this.resetXYFlag) {
        this.gameObject.pivotX = 0;
        this.gameObject.pivotY = 0;
        this.gameObject.anchoredX = (this.column - 1) * this.gameObject.width;
        this.gameObject.anchoredY = (this.line - 1) * this.gameObject.height;
      }
    }

    private shake: ps.Shake;
    /** 试玩初始化的处理 */
    public onInit() {
      this.BrickControl = this.BrickControlNode.getScript("ps.BrickControl");
      this.imageNode.name = this.specie;
      if (this.specie.length > 0) this.imageNode.name = this.specie;
      /** 添加震动组件 */
      this.shake = this.gameObject.addScript("ps.Shake");
    }

    private Box2d: qc.Box2D.Body;
    private BrickControl: ps.BrickControl;
    /** 试玩开始时的处理 */
    public onStart() {
      /** 砖块初始化 start */
      this.BrickControl.setBrickMap(this.line, this.column, {
        node: this.gameObject,
        specie: this.specie,
      });
      this.box2dBodyInit();
      if (this.hitPointKey && Number.isFinite(GAME_CFG?.[this.hitPointKey]))
        this.hitPoint = GAME_CFG[this.hitPointKey];
      this.textNode.text = this.hitPoint + "";
      /** 砖块初始化 end */
      let prev = this.game.time.now;
      this.Box2d.onContact.add((e) => {
        if (!e.isBeginning) return;
        if (this.game.time.now - prev < 1) return;
        prev = this.game.time.now;
        this.reduceHitPoint();
      });
    }

    /** 碰撞后处理函数 */
    private reduceHitPoint() {
      this.shake.play(0.2);
      if (this.contactAudio)
        ps.AudioTrigger.playSound(this.contactAudio, true, false, 1);
      this.hitPoint--;
      this.textNode.text = this.hitPoint + "";
      if (this.hitPoint === 0) {
        this.BrickControl.deleteBrick(this.line, this.column);
      }
    }

    /** 重新设置砖块的碰撞区域 */
    private resetPolygonVertices(key: string, number: number = 3) {
      const resetFunction = {
        /** 圆形 */
        Circle: () => {
          this.Box2d.fixtureType = qc.Box2D.FIXTURE_TYPE.CIRCLE;
          (this.Box2d as any).resetFixtureShape();
        },
        /** 实际像素 */
        Edge: () => {
          this.Box2d.fixtureType = qc.Box2D.FIXTURE_TYPE.POLYGON;
          (this.Box2d as any).resetShapeFromEdge(number);
        },
        /** 矩形 */
        Bounds: () => {
          this.Box2d.fixtureType = qc.Box2D.FIXTURE_TYPE.POLYGON;
          (this.Box2d as any).resetShapeFromBounds();
        },
        /** 实际宽高矩形 */
        WidthHeight: () => {
          this.Box2d.fixtureType = qc.Box2D.FIXTURE_TYPE.POLYGON;
          const box = this.gameObject.getChild(this.specie);
          const { width, height } = this.getWH();
          const path = [];
          const offsetXY = [
            [-1, -1],
            [1, -1],
            [1, 1],
            [-1, 1],
          ];
          for (let i = 0; i < 4; i++) {
            path.push(
              new qc.Point(
                0.5 + (width * offsetXY[i][0]) / box.width / 2,
                0.5 + (height * offsetXY[i][1]) / box.height / 2
              )
            );
          }
          const res = (this.Box2d as any).setPolygonVertices(path, true);
          if (!res) resetFunction.Bounds();
        },
        /** 节点宽高圆形 */
        WHCircle: () => {
          const { width, height } = this.getWH();
          this.gameObject.width = width;
          this.gameObject.height = height;
          this.Box2d.fixtureType = qc.Box2D.FIXTURE_TYPE.CIRCLE;
          (this.Box2d as any).resetFixtureShape();
        },
        /** 默认矩形渲染 */
        default: () => {
          resetFunction.Bounds();
        },
      };
      resetFunction[key]?.();
    }

    /** 根据图片节点获取实际宽高 */
    private getWH() {
      const box = this.imageNode;
      const geomUtil = (box2d as any).geomUtil;
      let nodes = geomUtil.marchingSquares(box) as qc.Point[];
      nodes = geomUtil.RDPsd(nodes, 3);
      let minx = 1000,
        maxx = 0,
        miny = 1000,
        maxy = 0;
      for (let i = 0; i < nodes.length; i++) {
        if (nodes[i].x < minx) minx = nodes[i].x;
        if (nodes[i].x > maxx) maxx = nodes[i].x;
        if (nodes[i].y < miny) miny = nodes[i].y;
        if (nodes[i].y > maxy) maxy = nodes[i].y;
      }
      const width = maxx - minx;
      const height = maxy - miny;
      return { width, height };
    }

    /** box2d初始化 */
    private box2dBodyInit() {
      this.gameObject.getScript("qc.Box2D.Body")?.destroy();
      this.imageNode.getScript("qc.Box2D.Body")?.destroy();
      this.Box2d =
        this.type === "Circle"
          ? this.gameObject.addScript("qc.Box2D.Body")
          : this.imageNode.addScript("qc.Box2D.Body");
      this.Box2d.onBodyCreated.addOnce(() => {
        this.resetPolygonVertices(this.type);
        this.Box2d.friction = 0;
        this.Box2d.restitution = 0;
      });
    }

    /**
     * 设置box2d.Body属性
     *
     * @param options :{box2d属性：box2d值}
     */
    public setBodyAttribute(options: any) {
      this.Box2d.onBodyCreated.addOnce(() => {
        options.keys((key) => {
          if (this.Box2d?.[key]) this.Box2d[key] = options[key];
        });
      });
    }
  }
  qc.registerBehaviour("ps.Brick", Brick);
  Brick["__menu"] = "玩法模板/打砖块玩法/砖块（Brick）";
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
