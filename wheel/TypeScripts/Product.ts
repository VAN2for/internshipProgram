namespace ps {
  /**
   * 
   * @description 
   * @author mande.Huang
   * @date 2023/11/03 10:55:25
   */
  export class Product extends Behaviour {
    public wheel: qc.Node;
    public btn: qc.Node;
    public btnNot: qc.Node;
    public clickNum: qc.UIText;
    public clickNumNot: qc.UIText;
    public download: qc.Node;
    public withdraw: qc.Node;
    public download2: qc.Node;
    public withdraw2: qc.Node;
    public textList: qc.UIText[];
    public reward: qc.Node[];
    public endMoneyText: qc.UIText;

    public secondPerCycle: number = 500;
    public lastClickTime: number = 0;
    public arrTarget: number[] = [0, 1, 9]
    public currIndex: number = 0;
    public spinCount: number = 0;
    public turn = false;
    public config1 = 3;//可以点击多少次
    public timer: number;
    public isGuide: boolean = false;

    constructor(gameObject: qc.Node) {
      super(gameObject);
    }
    /** 序列化 */
    private serializableFields = {
      wheel: qc.Serializer.NODE,
      btn: qc.Serializer.NODE,
      btnNot: qc.Serializer.NODE,
      textList: qc.Serializer.NODES,
      clickNum: qc.Serializer.NODE,
      clickNumNot: qc.Serializer.NODE,
      reward: qc.Serializer.NODES,
      download: qc.Serializer.NODE,
      withdraw: qc.Serializer.NODE,
      endMoneyText: qc.Serializer.NODE,
      download2: qc.Serializer.NODE,
      withdraw2: qc.Serializer.NODE,
    };
    turnFuc(index) {
      if (!this.turn) {
        this.turn = true;
        this.btn.visible = false;
        triggerCustomEvent({
          scene: main.sceneNodes[1],
          eventName: "点击转动反馈",
        });
        xtween(this.wheel)
          .to(CustomEventsTools.getEventDelayTime({
            scene: main.sceneNodes[1],
            eventName: "点击转动反馈"
          }) * 1000, { rotation: this.wheel.rotation + Mathf.angleToRadian(360 * 3) + Mathf.angleToRadian(Math.abs(this.arrTarget[index] - this.currIndex) * 360 / 10) }
            , { easing: ease.SvgPathEase.create("M0,0,C0,0,0.438,0.566,0.578,0.968,0.724,1.354,1,1,1,1,") })
          .call(() => {
            this.moneyChange()
            this.btn.visible = true;
            if (this.spinCount === GAME_CFG.config1) {
              this.btn.visible = false;
            }
            console.log(CustomEventsTools.getEventDelayTime({
              scene: main.sceneNodes[1],
              eventName: "点击转动反馈"
            }))
            if (this.spinCount === GAME_CFG.config1) {
              switch (this.spinCount) {
                case 1:
                  this.endMoneyText.text = "$100";
                  break;
                case 2:
                  this.endMoneyText.text = "$300";
                  break;
                case 3:
                  this.endMoneyText.text = "$600";
                  break;
              }
              triggerCustomEvent({
                scene: main.sceneNodes[1],
                eventName: "跳转结束页",
              });
            }
          })
          .start();
        this.turn = false
        this.currIndex = this.arrTarget[index];
      }
    }


    /** 组件被激活后执行 */
    public awake() {
      // console.info("[info] Product.awake");
    }

    /** 试玩初始化的处理 */
    public onInit() {
      console.log("验证是否更行")
      console.log(CustomEventsTools.getEventDelayTime({
        scene: main.sceneNodes[1],
        eventName: "点击转动反馈"
      }))
      this.textList.forEach((item) => { (item as any).setPropertyIgnoreLayout({ prop: "visible" }) });
      this.reward.forEach((item) => { (item as any).setPropertyIgnoreLayout({ prop: "visible" }) });
      (this.wheel).setPropertyIgnoreLayout({ prop: "visible" });
      (this.btn).setPropertyIgnoreLayout({ prop: "visible" });

      for (let i = 0; i < this.textList.length; i++) {
        this.textList[i].visible = false;
      }
      this.textList[0].alpha = 1;
      this.textList[0].visible = true;
      this.clickNum.text = GAME_CFG.config1.toString();
      this.clickNumNot.text = GAME_CFG.config1.toString();
      this.endMoneyText.text = "$0"
      // for (let i = 0; i < this.reward.length; i++) {
      //   this.reward[i].visible = false;
      // }

      triggerCustomEvent({
        scene: main.sceneNodes[1],
        eventName: "指引入场",
      });
      this.withdraw.interactive = true;
      this.download.interactive = true;
      this.withdraw2.interactive = true;
      this.download2.interactive = true;
      this.withdraw.onClick.add(() => {
        ps.sendAction(6);
      })
      this.download.onClick.add(() => {
        ps.sendAction(7);
      })

      this.withdraw2.onClick.add(() => {
        ps.sendAction(4);
        ps.install(ps.InstallType.None)
      })
      this.download2.onClick.add(() => {
        ps.sendAction(5);
        ps.install(ps.InstallType.None)
      })

      this.btn.interactive = true
      this.btn.onDown.add(() => {
        if (this.turn) return
        if (this.spinCount < GAME_CFG.config1) {
          clearInterval(this.timer);
          this.timer = null;

          //指引退场
          if (this.isGuide) {
            triggerCustomEvent({
              scene: main.sceneNodes[1],
              eventName: "无操作指引退场",
            });
          }
          if (this.spinCount == 0) {

            triggerCustomEvent({
              scene: main.sceneNodes[1],
              eventName: "指引退场",
            });
          }

          this.turnFuc(this.spinCount);//开启转动
          this.spinCount++;

        }

        if (GAME_CFG.config != 0 && this.spinCount == GAME_CFG.config) {//额外跳转次数
          ps.install(ps.InstallType.None)
        }
      });
    }

    public moneyChange() {
      this.textList[this.spinCount].alpha = 0;
      this.textList[this.spinCount].visible = true;
      ps.sendAction(this.spinCount);
      xtween(this.textList[this.spinCount - 1])
        .to(200, { alpha: 0 })
        .call(() => {
          xtween(this.textList[this.spinCount])
            .to(200, { alpha: 1 }).start()
          xtween(this.textList[this.spinCount])
            .to(200, { scaleX: 1, scaleY: 1.1 }, { easing: ease.SvgPathEase.create("M0, 0, C0.208, 0, 0.298, 1, 0.5, 1, 0.69, 1, 0.796, 0, 1, 0,") }).start()


        })
        .call(() => {
          triggerCustomEvent({
            scene: main.sceneNodes[1],
            eventName: `第${this.spinCount}次奖励反馈`,
          });
        })
        .delay(CustomEventsTools.getEventDelayTime({
          scene: main.sceneNodes[1],
          eventName: `第${this.spinCount}次奖励反馈`,
        }) * 1000)
        .call(() => {
          this.lastClickTime = Date.now();
          if (GAME_CFG.config2 !== 0) {
            this.timer = setInterval(() => {
              if (Date.now() - this.lastClickTime > GAME_CFG.config2 * 1000) {
                this.isGuide = true;
                triggerCustomEvent({
                  scene: main.sceneNodes[1],
                  eventName: "无操作指引入场",
                })
                clearInterval(this.timer);
              }
            }, 100)//每一百毫秒执行一次  如果有1秒钟没点击就让事件函数触发，和手指按钮触发
          }
        })
        .start()


      this.btn.visible = false;




      this.clickNum.text = (GAME_CFG.config1 - this.spinCount).toString();
      this.clickNumNot.text = (GAME_CFG.config1 - this.spinCount).toString();
    }

    /** 试玩开始时的处理 */
    public onStart() {
      // console.info("[info] Product.onStart");
    }

    /** 当脚本被移除时，会自动调用 */
    public onDestroy() {
      // console.info("[info] Product.onDestroy");
    }
  }
  qc.registerBehaviour("ps.Product", Product);
  Product["__menu"] = "玩法模板/玩法/（Product）";
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




// .to(this.secondPerCycle * 3 + Math.abs(this.arrTarget[index] - this.currIndex) * this.secondPerCycle / 10, { rotation: this.wheel.rotation + Mathf.angleToRadian(360 * 3) + Mathf.angleToRadian(Math.abs(this.arrTarget[index] - this.currIndex) * 360 / 10) }
// , { easing: ease.SvgPathEase.create("M0,0,C0,0,0.438,0.566,0.578,0.968,0.724,1.354,1,1,1,1,") })