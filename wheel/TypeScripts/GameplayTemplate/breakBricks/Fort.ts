namespace ps {
  /**
   *
   * @description
   * @author zhen.liang
   * @date 2023/02/07 15:34:59
   */
  export class Fort extends Behaviour {
    constructor(gameObject: qc.Node) {
      super(gameObject);
    }

    /** 小球数量文本节点 */
    private bulletNumNode: qc.UIText;
    /** 引导小球节点 */
    private guidebulletNode: qc.Node;
    /** 引导小球父节点 */
    private guidebulletParent: qc.Node;
    /** 回收节点 */
    private recycleNode: qc.Node;
    /** 触控节点 */
    private DragNode: qc.Node;
    /** 小球数量在动态参数中的key */
    private bulletNumKey: string;
    /** 小球原始数量 */
    private bulletStartNum: number;
    /** 小球数量 */
    private bulletNumber: number;
    /** 最小偏转角 */
    private minRadian: number;
    /** 最大偏转角 */
    private maxRadian: number;
    /** 小球发射速度 */
    private speedBase: number;
    /** 小球节点 */
    private bulletNode: qc.Node;
    /** 是否启用速度检查 */
    private speedCheckFlag: Boolean = true;
    /** 引导线反弹次数 */
    private reflectionNum: number;

    /** 序列化 */
    private serializableFields = {
      bulletNode: qc.Serializer.NODE,
      bulletNumNode: qc.Serializer.NODE,
      guidebulletNode: qc.Serializer.NODE,
      DragNode: qc.Serializer.NODE,
      recycleNode: qc.Serializer.NODE,
      bulletNumKey: qc.Serializer.STRING,
      bulletNumber: qc.Serializer.NUMBER,
      minRadian: qc.Serializer.NUMBER,
      maxRadian: qc.Serializer.NUMBER,
      speedBase: qc.Serializer.NUMBER,
      speedCheckFlag: qc.Serializer.BOOLEAN,
      reflectionNum: qc.Serializer.INT,
    };

    public createGui(): GuiType {
      return {
        bulletNode: {
          title: "小球节点",
          component: "node", // 数字控件
        },
        bulletNumNode: {
          title: "小球数量文本节点",
          component: "node", // 数字控件
        },
        guidebulletNode: {
          title: "引导小球节点",
          component: "node", // 数字控件
        },
        DragNode: {
          title: "触控节点",
          component: "node", // 数字控件
        },
        recycleNode: {
          title: "碰撞回收节点",
          component: "node", // 数字控件
        },
        bulletNumber: {
          title: "小球数量",
          component: "input", // 数字控件
        },
        minRadian: {
          title: "最小偏转角",
          component: "input", // 数字控件
        },
        maxRadian: {
          title: "最大偏转角",
          component: "input", // 数字控件
        },
        speedBase: {
          title: "小球发射速度(m/s)",
          component: "input", // 数字控件
        },
        reflectionNum: {
          title: "引导小球反弹次数",
          component: "input", // 数字控件
        },
        bulletNumKey: {
          title: "小球数量key",
          component: "input", // 数字控件
        },
        speedCheckFlag: {
          title: "是否启用速度检查",
          component: "switch", // 数字控件
        },
      };
    }

    /** 小球节点池子 */
    private bulletArr = [];
    /** 是否可玩 */
    private canPlay = true;

    /** 试玩初始化的处理 */
    public onInit() {
      /** 小球数量初始化 */
      if (this.bulletNumKey && Number.isFinite(GAME_CFG?.[this.bulletNumKey]))
        this.bulletNumber = GAME_CFG[this.bulletNumKey];
      if (Number.isNaN(this.bulletNumber) || this.bulletNumber < 0)
        console.warn("小球数量小于0或小球数量为NaN");
      this.bulletStartNum = this.bulletNumber;
      this.bulletNumNode.text = String(this.bulletStartNum);

      /** 小球池子初始化 */
      const bullet = this.bulletNode;
      bullet.visible = false;
      this.bulletArr.push(bullet);
      for (let i = 1; i < this.bulletStartNum; i++) {
        const bulletClone = this.game.add.clone(bullet);
        this.bulletArr.push(bulletClone);
      }

      /** 引导小球初始化 */
      const index = this.guidebulletNode.parent.getChildIndex(
        this.guidebulletNode
      );
      this.guidebulletParent = this.game.add.node(this.guidebulletNode.parent);
      this.guidebulletParent.parent.setChildIndex(
        this.guidebulletParent,
        index
      );
      this.guidebulletNode.parent.removeChild(this.guidebulletNode);
      this.guidebulletParent.addChild(this.guidebulletNode);
      this.guideBulletArr.push(this.guidebulletNode);
    }

    /** 试玩开始时的处理 */
    public onStart() {
      /** 手指按下 */
      this.DragNode.onDown.add(() => { });

      /** 手指滑动 */
      this.DragNode.onDrag.add((node: qc.Node, e) => {
        if (!this.canPlay) return;
        const { x, y } = this.gameObject.getWorldPosition();
        /** 当前偏转角 */
        const Radian =
          Mathf.getRadian(x, y, e.source.x, e.source.y) +
          Mathf.angleToRadian(90);
        if (
          Radian <= Mathf.angleToRadian(this.maxRadian) &&
          Radian >= Mathf.angleToRadian(this.minRadian)
        ) {
          this.gameObject.rotation = Radian;
          this.generatingPaths(Radian);
        }
      });

      /** 手指抬起 */
      this.DragNode.onUp.add(() => {
        this.guidebulletParent.visible = false;
        if (this.canPlay) {
          this.bulletStartXY = [this.gameObject.x, this.gameObject.y];
          this.launchBullet();
        }
      });
    }

    /** 小球发射起始位置 */
    private bulletStartXY = [this.gameObject.x, this.gameObject.y];

    /** 发射所有球 */
    private launchBullet() {
      this.canPlay = false;
      this.bulletNumber = this.bulletStartNum;
      /** 发射速度 */
      const speed = this.speedBase;
      /** 发射角度 */
      const rotation = this.gameObject.rotation;
      /** 发射线速度 */
      const linearVelocity = new Phaser.Point(
        Mathf.keepDecimal(speed * Math.sin(rotation), 5),
        -Mathf.keepDecimal(speed * Math.cos(rotation), 5)
      );
      /** 小球发射位置 */
      const x = this.bulletStartXY[0] + 100 * Math.sin(rotation);
      const y = this.bulletStartXY[1] - 100 * Math.cos(rotation);
      /** 小球发射器 */
      let i = 1;
      const bulletTimer = timer.loop(20, () => {
        if (i > this.bulletStartNum || this.bulletArr.length < 1) {
          timer.remove(bulletTimer);
          this.fortBackRotationAni(this.gameObject).start();
          return;
        }
        i++;
        this.launchABullet(x, y, linearVelocity);
      });
    }

    /** 炮台位置 */
    private fortX = this.gameObject.x;

    /** 发射单个球 */
    private launchABullet(x: number, y: number, linearVelocity: Phaser.Point) {
      this.bulletNumNode.text = String(--this.bulletNumber);
      const bullet = this.bulletArr.shift() as qc.Node;
      bullet.parent.setChildIndex(bullet, 0);
      bullet.x = x;
      bullet.y = y;
      bullet.visible = true;
      const box = bullet.getScript("qc.Box2D.Body") as qc.Box2D.Body;
      box.onBodyCreated.add(() => {
        (box as any).groupIndex = -1;
      });
      box.linearVelocity = linearVelocity;

      let prev = this.game.time.now;
      let end = false;
      /** 碰撞后处理函数 */
      const handler = (e) => {
        if (!e.isBeginning) return;
        if (this.game.time.now - prev < 1) return;
        prev = this.game.time.now;
        // 速度和方向保底机制
        box.linearVelocity = this.speedCheck(box.linearVelocity);

        const object =
          e.gameObjectA.name === this.bulletNode.name
            ? e.gameObjectB
            : e.gameObjectA;
        /** 回收球结束 */
        if (this.recycleNode && object.name === this.recycleNode.name) {
          box.onContact.remove(handler);
          end = true;
          const oldLinearVelocity = box.linearVelocity;
          /** 速度相对倍率 */
          const MoveSpeed =
            Math.sqrt(oldLinearVelocity.x ** 2 + oldLinearVelocity.y ** 2) /
            this.speedBase;
          box.linearVelocity = new Phaser.Point(0, 0);
          /** 小球位移回炮台 */
          this.moveAni(bullet, this.fortX, MoveSpeed)
            .call(() => {
              bullet.visible = false;
              this.bulletArr.push(bullet);
              this.bulletNumNode.text = String(++this.bulletNumber);
              if (this.bulletNumber === this.bulletStartNum) {
                this.canPlay = true;
              }
            })
            .start();
        }
      };

      box.onContact.add(handler);

      box.onPreSolve.add(() => {
        if (end) return;
        box.linearVelocity = this.speedCheck(box.linearVelocity);
        this.recycleBullet(bullet);
      });
    }

    /** 引导小球池子 */
    private guideBulletArr = [];

    /** 生成总引导线路 */
    private generatingPaths(Radian: number) {
      this.guidebulletParent.visible = true;

      let launchPoint = this.gameObject.getWorldPosition(), //发射点坐标
        normal, //法向量
        radian = Radian, //发射角度
        lenSum = 0; //引导小球总数

      for (let i = 0; i < this.reflectionNum + 1; i++) {
        let len;
        ({
          len,
          CollisionPoint: launchPoint,
          normal,
        } = this.generatingPath(launchPoint, radian, lenSum));
        radian = this.calculateReflectionRadian(radian, normal);
        lenSum += len;
      }

      /** 对于引导小球池子中未使用到的小球进行隐藏 */
      for (let i = lenSum; i < this.guideBulletArr.length; i++)
        this.guideBulletArr[i].visible = false;
    }

    /** 生成引导一条线路 */
    private generatingPath(Point: qc.Point, Radian: number, start: number) {
      const CollisionEvent = this.getFirstCollisionPoint(Point, Radian);
      const CollisionNode = CollisionEvent.gameObject;
      const CollisionPoint = CollisionEvent.point;
      const normal = CollisionEvent.normal;
      const fortPath = Mathf.pointListByDensity(
        Point.x,
        Point.y,
        CollisionPoint.x,
        CollisionPoint.y,
        10
      );
      /** 当引导小球池子中小球不够时进行补充 */
      if (this.guideBulletArr.length < fortPath.length + start) {
        const guidebulletBase = this.guideBulletArr[0];
        for (
          let i = this.guideBulletArr.length;
          i <= fortPath.length + start;
          i++
        ) {
          const guidebulletClone = this.game.add.clone(guidebulletBase);
          this.guideBulletArr.push(guidebulletClone);
        }
      }

      for (let i = 0; i < fortPath.length; i++) {
        const guideBullet = this.guideBulletArr[i + start] as qc.Node;
        const xy = guideBullet.parent.toLocal(
          new qc.Point(fortPath[i].x, fortPath[i].y)
        );
        guideBullet.x = xy.x;
        guideBullet.y = xy.y;
        guideBullet.visible = true;
      }
      return { CollisionPoint, CollisionNode, len: fortPath.length, normal };
    }

    /** 速度检查 保底机制 */
    private speedCheck(speedPoint: Phaser.Point) {
      if (!this.speedCheckFlag) return speedPoint;
      const newSpeed = new Phaser.Point(speedPoint.x, speedPoint.y);
      const speed = Math.sqrt(speedPoint.x ** 2 + speedPoint.y ** 2);
      if (speed < this.speedBase) {
        newSpeed.x = (this.speedBase * speedPoint.x) / speed;
        newSpeed.y = (this.speedBase * speedPoint.y) / speed;
      }
      if (Math.abs(speedPoint.y) < 0.5) {
        newSpeed.y = speedPoint.y > 0 ? 1 : -1;
      }
      return newSpeed;
    }

    /** 小球飞出世界回收 */
    private recycleBullet(bullet: qc.Node) {
      const bulletWorldXY = bullet.getWorldPosition();
      if (
        bulletWorldXY.x < -20 ||
        bulletWorldXY.x > this.game.width + 20 ||
        bulletWorldXY.y < -20 ||
        bulletWorldXY.y > this.game.height + 20
      ) {
        const point = bullet.parent.toLocal(this.gameObject.getWorldPosition());
        bullet.visible = false;
        bullet.x = point.x;
        bullet.y = point.y;
        this.bulletNumNode.text = String(++this.bulletNumber);
        this.bulletArr.push(bullet);
      }
    }

    /**
     * 获取第一个碰撞点
     * @param Point qc.Point 起始点坐标（世界坐标）
     * @param rotation number 入射角
     * @returns
     */
    private getFirstCollisionPoint(
      Point: qc.Point,
      rotation: number
    ): { gameObject: qc.Node; point: Phaser.Point; normal: Phaser.Point } {
      const startPos = Point;
      // 设置射线的终点:
      const offsetY = -ps.Mathf.keepDecimal(Math.cos(rotation) * 3000, 3);
      const offsetX = ps.Mathf.keepDecimal(Math.sin(rotation) * 3000, 3);
      const endPos = new qc.Point(startPos.x + offsetX, startPos.y + offsetY);
      // 创建出射线，射线的返回值是射线与刚体碰撞的数组：
      const arr = box2d.raycast(
        startPos.x,
        startPos.y,
        endPos.x,
        endPos.y,
        true,
        undefined
      );
      return arr?.[0];
    }

    /**
     * 计算反射角（弧度）
     * @param radian 入射角
     * @param normal 法向量
     * @returns number 反射角
     */
    private calculateReflectionRadian(radian: number, normal: Phaser.Point) {
      const inVector = new Phaser.Point(
        Math.cos(radian + 1.5 * Math.PI),
        Math.sin(radian + 1.5 * Math.PI)
      );
      const outVector = new Phaser.Point(
        inVector.x - 2 * inVector.x * normal.x * normal.x,
        inVector.y - 2 * inVector.y * normal.y * normal.y
      );
      /** 向量归一 */
      outVector.x =
        outVector.x / Math.sqrt(outVector.x ** 2 + outVector.y ** 2);
      outVector.y =
        outVector.y / Math.sqrt(outVector.x ** 2 + outVector.y ** 2);

      let outRadian = Math.acos(outVector.x);
      if (outVector.y < 0) outRadian = 2 * Math.PI - outRadian;
      return outRadian - 1.5 * Math.PI;
    }

    /** 位移动画 */
    private moveAni(node: qc.Node, toX: number, speed: number = 1) {
      const xt = xtween(node);
      const time =
        Math.abs(ps.Mathf.keepDecimal((toX - node.x) / 800, 3)) / speed;
      xt.to(
        time * 1000,
        { x: toX, rotation: 0 },
        { easing: XTween.Easing.Sinusoidal.Out }
      );
      return xt;
    }

    /** 炮台回正动画 */
    private fortBackRotationAni(node: qc.Node) {
      const nodeXt = xtween(node);
      const time = 0.3;
      nodeXt.to(
        time * 1000,
        { rotation: 0 },
        { easing: XTween.Easing.Quintic.In }
      );
      return nodeXt;
    }
  }
  qc.registerBehaviour("ps.Fort", Fort);
  Fort["__menu"] = "玩法模板/打砖块玩法/炮台（Fort）";
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
