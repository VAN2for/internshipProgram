namespace ps {
    export enum BubbleEvent {
        SHOW_START = 'showStart',
        HIDE_START = 'hideStart',
        SHOW_END = 'showEnd',
        HIDE_END = 'hideEnd',
    }
    /**
     * 冒泡组件
     * @description 可用于冒泡对话框弹出显示、收起隐藏效果
     * @author JingBin
     */
    export class Bubble extends ps.Behaviour {
        /** 持续漂浮Y值（范围为0或空时，不触发漂浮） */
        floatY: number = -30;
        /** 持续漂浮时间（每次漂浮时间）（秒） */
        floatT: number = .5;

        event: ps.EventDispatcher = new ps.EventDispatcher()

        /** 目标初始缩放X值 */
        private initScaleX: number;
        /** 目标初始缩放Y值 */
        private initScaleY: number;
        /** 目标初始Y值 */
        private initY: number;

        /** Debug模式，点击播放动画 */
        private _debug: boolean = false;

        /** Debug模式 */
        public get debug(): boolean {
            return this._debug
        }
        public set debug(v: boolean) {
            this._debug = v;
        }

        private posTw: qc.TweenPosition

        private serializableFields: Object = {
            debug: qc.Serializer.AUTO,
            floatY: qc.Serializer.NUMBER,
            floatT: qc.Serializer.NUMBER,
        }

        constructor(gameObject: qc.Node) {
            super(gameObject);
            this.runInEditor = true;
        }

        awake() {
            this.initScaleX = this.gameObject.scaleX || 1;
            this.initScaleY = this.gameObject.scaleY || 1;
            this.initY = this.gameObject.y || 0;
            if (this.debug) {
                this.show()
                this.gameObject.interactive = true
            }
        }

        public isShow: boolean;

        onDown() {
            if (this.isShow) {
                this.hide();
            } else {
                this.show();
            }
        }

        /** 显示 */
        show() {
            if (!this.gameObject.parent) return
            const tw = (this.gameObject.getScript(qc.TweenScale) || this.gameObject.addScript("qc.TweenScale")) as qc.TweenScale;
            this.gameObject.y = this.initY;
            this.gameObject.visible = true;
            // tw.from = new qc.Point(0, 0);
            this.gameObject.scaleX = this.gameObject.scaleY = 0;
            tw.to = new qc.Point(this.initScaleX, this.initScaleY);
            tw.duration = .2;
            tw.onFinished.addOnce(() => {
                this.isShow = true;
                tw.destroy();
                this.float();
                this.event.dispatch(ps.BubbleEvent.SHOW_END)
            });
            tw.enable = true;
            tw.playForward()
            this.event.dispatch(ps.BubbleEvent.SHOW_START)
        }

        /** 持续漂浮 */
        private float() {
            if (!this.floatY || !this.floatT || this.floatT < 0) {
                return;
            }
            const tw = this.posTw = (this.gameObject.getScript(qc.TweenPosition) || this.gameObject.addScript("qc.TweenPosition")) as qc.TweenPosition;
            tw.from = new qc.Point(this.gameObject.x, this.initY);
            tw.to = new qc.Point(this.gameObject.x, this.initY + this.floatY);
            tw.moveAxis = qc.TweenPosition.ONLY_Y;
            tw.style = qc.Tween.STYLE_PINGPONG;
            tw.duration = this.floatT;
            tw.enable = true;
            tw.playForward()
        }

        /** 隐藏 */
        hide(destory?: boolean) {
            const _tw = this.gameObject.getScript(qc.TweenPosition) as qc.TweenPosition;
            if (_tw) {
                _tw.destroy();
            }
            if (!this.gameObject.parent) return
            this.gameObject.y = this.initY;

            const tw = (this.gameObject.getScript(qc.TweenScale) || this.gameObject.addScript("qc.TweenScale")) as qc.TweenScale;
            tw.from = new qc.Point(this.initScaleX, this.initScaleY);
            tw.to = new qc.Point(0, 0);
            tw.duration = .2;
            tw.onFinished.addOnce(() => {
                this.isShow = false;
                tw.destroy();
                this.gameObject.visible = false;
                this.gameObject.y = this.initY;
                this.gameObject.scaleX = this.initScaleX;
                this.gameObject.scaleY = this.initScaleY;
                if (destory) {
                    this.gameObject.destroy();
                }
                if (this.debug) {
                    this.game.timer.add(500, this.show, this);
                }
                this.event.dispatch(ps.BubbleEvent.HIDE_END)
            });
            tw.enable = true;
            tw.playForward()
            this.event.dispatch(ps.BubbleEvent.HIDE_START)
        }

        remove() {
            this.posTw = this.gameObject.getScript(qc.TweenPosition)
            if (this.posTw) {
                this.posTw.resetToBeginning()
                this.posTw.destroy()
                this.posTw = null
            }
        }
    }
    qc.registerBehaviour('ps.Bubble', Bubble);
    Bubble["__menu"] = 'Custom/Bubble';
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