/** 滚动方向 */
enum DireScroll {
  /** 向上/左 */
  UP_OR_LEFT = -1,
  /** 向下/右 */
  DOWN_OR_RIGHT = 1,
}

/** 布局类型 */
enum ListLayout {
  /** 水平 */
  HORIZONTAL = 0,
  /** 垂直 */
  VERTICAL = 1,
}

/** 滚动列表事件 */
enum ListScrollEvent {
  /** 滚动完成起步阶段 */
  PLAY_FINISHED_FIRST = "playFinishedFirst",
  /** 滚动完成第一步骤阶段 */
  PLAY_FINISHED_TW0 = "playFinishedTw0",
  /** 滚动完成收尾阶段 */
  PLAY_FINISHED_LAST = "playFinishedLast",
}

/** 滚动列表当前状态 */
enum ListScrollState {
  /** 待机静止状态 */
  IDLE,
  /** 滚动起步阶段 */
  PLAYING_FIRST,
  /** 滚动收尾阶段 */
  PLAYING_LAST,
}

namespace ps {
  /**
   * 滚动列表组件
   * @description 滚动列表组件，可用于如：摇奖、老虎机、关卡楼层等需要滚动列表
   * @author JingBin
   */
  export class ListScroll extends ps.Behaviour {
    /** 所有用到的图片纹理 */
    textures: qc.Texture[];
    /** 图片索引，按顺序渲染 */
    textureIdxs: number[];
    /** 间距 */
    space: number = 0;
    /** 滚动方向: -1:向上/左 1:向下/右 */
    direScroll: DireScroll = DireScroll.DOWN_OR_RIGHT;
    /** 布局: 0:水平 1:垂直 */
    listLayout: ListLayout = ListLayout.VERTICAL;
    /** 滚动时间 */
    duration: number = 1;
    /** 滚动圈数 */
    scrollCnt: number = 2;
    /** 最终停在的图片索引 */
    stopToIdx: number = 0;
    /** 启用速度模糊 */
    isSpeedBlur: boolean = true;
    /** 速度模糊 */
    speedBlur: number = 1;
    /** 启用Debug模式，点击对象即滚动 */
    debug: boolean = false;

    /** 滚动列表过程中循环播放的音效 */
    smPlaying: string = "";
    /** 滚动列表过程中循环播放的音效，时间间隔 */
    smPlayingInterval: number = 80;
    /** 滚动列表完成音效 */
    smFinish: string = "";

    /** 发光索引 */
    lightIdx: number;

    /** 斜光特效节点 */
    msk: qc.Node;
    /** 随机出现斜光特效，时间间隔 */
    idleLightEffInterval: number = 2000;

    private scrollCnt0: number = 1;
    private scrollCnt1: number = 1;

    private xy: "x" | "y";
    private xyBack: "x" | "y";
    private wh: "width" | "height";
    private whBack: "width" | "height";

    private orgXY: number;
    private orgXYBack: number;
    private stopToXY: number = 0;

    eventDisp: ps.EventDispatcher = new ps.EventDispatcher();
    state: ListScrollState = ListScrollState.IDLE;

    set scrollTime(time: number) {
      this.duration = time;
    }

    set stopIndex(index: number) {
      this.stopToIdx = index;
    }

    set SpeedBlurFlag(flag: boolean) {
      this.isSpeedBlur = flag;
    }

    /** 序列化 */
    private serializableFields: Object = {
      textures: qc.Serializer.TEXTURES,
      textureIdxs: qc.Serializer.INTS,
      space: qc.Serializer.NUMBER,
      direScroll: qc.Serializer.AUTO,
      listLayout: qc.Serializer.AUTO,
      duration: qc.Serializer.NUMBER,
      scrollCnt: qc.Serializer.NUMBER,
      stopToIdx: qc.Serializer.INT,
      isSpeedBlur: qc.Serializer.BOOLEAN,
      speedBlur: qc.Serializer.NUMBER,
      debug: qc.Serializer.BOOLEAN,

      smPlaying: qc.Serializer.STRING,
      smPlayingInterval: qc.Serializer.NUMBER,
      smFinish: qc.Serializer.STRING,

      lightIdx: qc.Serializer.NUMBER,

      msk: qc.Serializer.NODE,
      idleLightEffInterval: qc.Serializer.NUMBER,

      orgXY: qc.Serializer.AUTO,
    };

    constructor(gameObject: qc.Node) {
      super(gameObject);
    }

    awake(resetToEnd: boolean = void 0 /*  ps.ENV === 'EDITOR' */) {
      this.state = ListScrollState.IDLE;
      this.xy = this.listLayout === ListLayout.HORIZONTAL ? "x" : "y";
      this.xyBack = this.listLayout === ListLayout.HORIZONTAL ? "y" : "x";
      this.wh = this.listLayout === ListLayout.HORIZONTAL ? "width" : "height";
      this.whBack =
        this.listLayout === ListLayout.HORIZONTAL ? "height" : "width";

      if (this.orgXY != void 0) this.gameObject[this.xy] = this.orgXY;
      else this.orgXY = this.gameObject[this.xy];

      if (this.orgXYBack != void 0)
        this.gameObject[this.xyBack] = this.orgXYBack;
      else this.orgXYBack = this.gameObject[this.xyBack];

      this.scrollCnt0 = Math.ceil(this.scrollCnt / 2);
      this.scrollCnt1 = this.scrollCnt - this.scrollCnt0;

      // if (ps.ENV === 'EDITOR') {
      this.renderList();
      this.cloneListBox(this.listBox0);
      // }

      this.initTw0();
      this.initTw1();
      if (!!resetToEnd) this.resetToEndTw1();
      else this.resetTw0();
      this.stopBlur();

      if (this.showLightE) this.game.timer.remove(this.showLightE);

      if (this.msk && this.idleLightEffInterval > 0)
        this.showLightE = this.game.timer.loop(
          this.idleLightEffInterval,
          this.showLight,
          this
        );
    }

    private showLightE: qc.TimerEvent;

    private showLight(idx?: number) {
      if (idx == void 0) {
        if (this.state !== ListScrollState.IDLE) {
          return;
        }
        idx = Random.floor(this.listBox0.children.length);
      }
      const img = this.listBox0.getChildAt(idx);
      if (!img) return;
      let msk = img.getChildByName("msk");
      let light: qc.UIImage;
      if (!msk) {
        msk = this.game.add.clone(this.msk);
        msk.name = "msk";
        img.addChild(msk);
        msk.x = msk.y = 0;
        light = msk.getChildByName("light") as qc.UIImage;
      }
      msk.visible = true;
      light.x = 274;
      light.y = -70;
      const tw = light.getScript(qc.TweenPosition) as qc.TweenPosition;
      tw.playForward(true);
    }

    /** 试玩初始化的处理 */
    onInit() {}

    /** 试玩开始时的处理 */
    onStart() {
      if (!this.debug) return;
      this.gameObject.addListener(
        this.game.input.onPointerDown,
        this.play,
        this
      );
    }

    listBox0: qc.Node;
    listBox1: qc.Node;

    private renderList() {
      // this.listBox0 = this.gameObject.getChild('listBox0')
      // if (!this.listBox0) {
      this.gameObject.removeChildren();
      this.listBox0 = this.game.add.node(this.gameObject);
      this.listBox0.name = "listBox0";
      this.listBox0.x = 0;
      this.listBox0.y = 0;
      this.listBox0.width = 0;
      this.listBox0.height = 0;
      // }
      let nextImgXY = 0;
      if (this.direScroll === DireScroll.DOWN_OR_RIGHT) {
        const min = new qc.Point();
        const max = new qc.Point();
        min[this.xy] = max[this.xy] = 1;
        min[this.xyBack] = max[this.xyBack] = 0;
        this.listBox0[`pivot${this.xy.toUpperCase()}`] = 1;
        this.listBox0.setAnchor(min, max);
      }
      let whBackMax = 0;
      for (let i = 0; i < this.textureIdxs.length; i++) {
        let textureIdx = this.textureIdxs[i];
        if (textureIdx < 0) {
          console.warn("图片索引值不能小于“0”！暂时使用“0”取代");
          textureIdx = 0;
        } else if (textureIdx > this.textures.length - 1) {
          console.warn(
            "图片索引值不能大于“所有用到的图片纹理数组长度”！暂时使用“所有用到的图片纹理数组长度”取代"
          );
          textureIdx = this.textures.length - 1;
        }
        const texture = this.textures[textureIdx];
        if (!texture) {
          console.error(`当前图片索引${textureIdx}在序列化中未定义值！`);
          continue;
        }
        const img: qc.UIImage =
          (this.listBox0.getChildAt(i) as qc.UIImage) ||
          new qc.UIImage(this.game, this.listBox0);
        img.texture = texture;
        img.resetNativeSize();
        if (this.direScroll === DireScroll.DOWN_OR_RIGHT) {
          img[`pivot${this.xy.toUpperCase()}`] = 1;
          const min = new qc.Point();
          const max = new qc.Point();
          min[this.xy] = max[this.xy] = 1;
          min[this.xyBack] = max[this.xyBack] = 0;
          img.setAnchor(min, max);
        }
        const space = this.space;
        const addSpace = space; // i === this.textureIdxs.length - 1 ? 0 : space
        img[`anchored${this.xy.toUpperCase()}`] = nextImgXY; // (i * (img[this.wh] + space)) * -this.direScroll
        nextImgXY =
          img["anchored" + this.xy.toUpperCase()] +
          (img[this.wh] + space) * -this.direScroll;
        if (i === this.stopToIdx) this.stopToXY = img[this.xy];
        this.listBox0[this.wh] += img[this.wh] + addSpace;
        whBackMax = Math.max(this.listBox0[this.whBack], img[this.whBack]);
      }
      this.listBox0[this.whBack] = whBackMax;
      this.gameObject[this.wh] = this.listBox0[this.wh];
      this.gameObject[this.whBack] = this.listBox0[this.whBack];
    }

    private cloneListBox(listBox: qc.Node) {
      if (!listBox) return;
      // this.listBox1 = this.gameObject.getChild('listBox1')
      // if (this.listBox1 && this.listBox1.parent) return
      this.listBox1 = this.game.add.clone(listBox);
      this.listBox1.name = "listBox1";
      this.listBox1[this.xy] =
        listBox[this.xy] +
        Math.max(this.space, 0) +
        listBox[this.wh] * -this.direScroll;
    }

    get tw0() {
      const tws = this.gameObject.getScripts(
        qc.TweenPosition
      ) as qc.TweenPosition[];
      if (!tws || tws.length <= 0) return;
      return tws[0];
    }

    initTw0(resetFrom = true) {
      let tw0 = this.tw0;
      if (!tw0) {
        tw0 = this.gameObject.addScript("qc.TweenPosition");
        tw0.tweenGroup = 1;
      }
      tw0.moveAxis =
        this.xy === "x" ? qc.TweenPosition.ONLY_X : qc.TweenPosition.ONLY_Y;
      tw0.from[this.xy] = resetFrom ? this.orgXY : this.gameObject[this.xy];
      tw0.from[this.xyBack] = resetFrom
        ? this.orgXYBack
        : this.gameObject[this.xyBack];
      tw0.to[this.xy] =
        tw0.from[this.xy] + this.gameObject[this.wh] * this.direScroll;
      tw0.style = qc.Tween.STYLE_LOOP;
      tw0.duration = this.duration;
    }

    private resetTw0() {
      const tw0 = this.tw0;
      if (!tw0) {
        return;
      }
      tw0.resetToBeginning();
    }

    playCnt: number = 0;
    private playSoundE: qc.TimerEvent;

    /** 滚动起来 */
    play(reset) {
      if (this.smPlaying) {
        // this.playSoundE = this.game.timer.loop(this.smPlayingInterval, () => {
        // ps.Audio.playSound(this.smPlaying, void 0, void 0, 1, Math.max(50, this.smPlayingInterval - 10))
        const nodeAudio = UIRoot.getChild(this.smPlaying);
        if (nodeAudio && AudioTrigger?.playSound) {
          AudioTrigger.playSound(nodeAudio, true, false, 1);
        } else {
          Audio.playSound(this.smPlaying);
        }
        // })
      }

      this.state = ListScrollState.PLAYING_FIRST;
      this.playCnt = 0;
      const tw0 = this.tw0;
      if (!tw0) return;
      if (reset) this.resetTw0();
      tw0.onLoopFinished.remove(this.playFinishedTw0, this);
      tw0.onLoopFinished.add(this.playFinishedTw0, this);
      tw0.playForward(!!reset);
      this.startBlur();
    }

    private startBlur() {
      //速度模糊
      const speedBlur = this.speedBlur;
      if (this.isSpeedBlur) {
        let filter = this.gameObject.getScript(
          qc.FilterGroup
        ) as qc.FilterGroup;
        if (!filter) filter = this.gameObject.addScript("qc.FilterGroup");
        const BlurXY = this.xy === "x" ? qc.Filter.BlurX : qc.Filter.BlurY;
        const blurs = filter.findFilter(BlurXY) as any[];
        let blur = blurs && blurs.length > 0 ? blurs[0] : null;
        if (!blur) {
          blur = new BlurXY(game, void 0, void 0);
          blur = filter.addFilter(blur);
        }
        blur.blur = speedBlur;
        filter.enable = true;
      }
    }

    private stopBlur() {
      const filter = this.gameObject.getScript(
        qc.FilterGroup
      ) as qc.FilterGroup;
      if (!filter) {
        return;
      }
      filter.enable = false;
    }

    private playFinishedTw0() {
      this.playCnt++;
      if (this.scrollCnt < 0) return;
      if (this.playCnt >= this.scrollCnt) {
        this.eventDisp.dispatch(ListScrollEvent.PLAY_FINISHED_TW0);
        const tw0 = this.tw0;
        tw0.onLoopFinished.remove(this.playFinishedTw0, this);
        tw0.stop();
        this.playTw1();
      } else if (this.playCnt >= this.scrollCnt0) {
        this.eventDisp.dispatch(ListScrollEvent.PLAY_FINISHED_FIRST);
        this.state = ListScrollState.PLAYING_LAST;
      }
    }

    get tw1() {
      const tws = this.gameObject.getScripts(
        qc.TweenPosition
      ) as qc.TweenPosition[];
      if (!tws || tws.length <= 1) return;
      return tws[1];
    }

    initTw1(resetFrom = true) {
      let tw1 = this.tw1;
      if (!tw1) {
        tw1 = this.gameObject.addScript("qc.TweenPosition");
        tw1.tweenGroup = 1;
      }
      tw1.moveAxis =
        this.xy === "x" ? qc.TweenPosition.ONLY_X : qc.TweenPosition.ONLY_Y;
      tw1.from[this.xy] = resetFrom ? this.orgXY : this.gameObject[this.xy];
      tw1.from[this.xyBack] = resetFrom
        ? this.orgXYBack
        : this.gameObject[this.xyBack];

      const base = this.stopToIdx / (this.textures.length - 1);
      if (resetFrom)
        tw1.to[this.xy] = tw1.from[this.xy] + this.stopToXY * -this.direScroll;
      // else if (tw1.to[this.xy] * -this.direScroll < tw1.from[this.xy] * -this.direScroll) tw1.to[this.xy] += this.gameObject[this.wh] * this.direScroll
      tw1.duration = Math.max(this.duration * base, 0.001);
    }

    private resetTw1() {
      const tw1 = this.tw1;
      if (!tw1) {
        return;
      }
      tw1.resetToBeginning();
    }

    resetToEndTw1() {
      const tw1 = this.tw1;
      if (!tw1) {
        return;
      }
      this.gameObject[this.xy] = tw1.to[this.xy];
      this.gameObject[this.xyBack] = tw1.to[this.xyBack];
    }

    /** 滚动总时长（毫秒） */
    get scrollTime() {
      if (!this.tw0 || !this.tw1) return;
      return (this.tw0.duration * this.scrollCnt + this.tw1.duration) * 1000;
    }

    resetToStopPot() {
      const tw1 = this.tw1;
      if (!tw1) {
        return;
      }
      this.gameObject[this.xy] = tw1.to[this.xy];
    }

    playTw1() {
      const tw1 = this.tw1;
      if (!tw1) return;
      this.resetTw1();
      tw1.onFinished.addOnce(this.playFinishedTw1, this);
      tw1.playForward();
    }

    private playFinishedTw1() {
      if (this.playSoundE) this.game.timer.remove(this.playSoundE);
      if (this.smPlaying) {
        const nodeAudio = UIRoot.getChild(this.smPlaying);
        if (nodeAudio && AudioTrigger?.stopSound) {
          AudioTrigger.stopSound(nodeAudio);
        } else {
          Audio.stopSound(this.smPlaying);
        }
      }
      if (this.smFinish) {
        const nodeAudio = UIRoot.getChild(this.smFinish);
        if (nodeAudio && AudioTrigger?.playSound) {
          AudioTrigger.playSound(nodeAudio, true, false, 1);
        } else {
          Audio.playSound(this.smFinish);
        }
      }

      this.resetToStopPot();
      this.eventDisp.dispatch(ListScrollEvent.PLAY_FINISHED_LAST);
      this.state = ListScrollState.IDLE;
      this.stopBlur();
    }

    playLight() {
      if (this.lightIdx != void 0) this.showLight(this.lightIdx);
    }
  }
  qc.registerBehaviour("ps.ListScroll", ListScroll);
  ListScroll["__menu"] = "Custom/ListScroll";
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
