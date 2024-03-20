namespace ps {
    /**
     * 光环组件，设置enable可控制光圈的发射与停止
     * @author VaMP
     */
    export class Halo extends ps.Behaviour {
        /** 光圈纹理 */
        texture: qc.Texture;
        private _interval: number = 500;
        set interval(v: number) {
            this._interval = v;
            if (this.inPlay) this.start(true);
        }
        /** 发射间隔时间，默认为500 */
        get interval() {
            return this._interval;
        }
        /** 单个光圈持续时间，默认为1000 */
        duration: number = 1000;
        /** 光圈的缩放，X为起始缩放，默认为1，Y为结束缩放，默认为5 */
        scale = new qc.Point(0, 5);
        playOnAwake: boolean = true;
        //
        private inPlay = false;
        private timerEvent: qc.TimerEvent;
        /** 序列化 */
        private serializableFields: Object = {
            texture: qc.Serializer.TEXTURE,
            interval: qc.Serializer.NUMBER,
            duration: qc.Serializer.NUMBER,
            scale: qc.Serializer.POINT,
            playOnAwake: qc.Serializer.BOOLEAN,
        };
        constructor(gameObject: qc.Node) {
            super(gameObject);
            this.runInEditor = true;
        }

        awake() {
            this.gameObject.removeChildren();
            if (this.playOnAwake) this.start();
        }
        /**
         * 开始发射光圈
         * @param cover 强制再次发射
         */
        start(cover = false) {
            if (!cover && this.inPlay) return;
            this.stop();
            this.inPlay = true;
            this.timerEvent = ps.timer.loop(this.interval, this.createOne, this);
            this.createOne();
        }
        /** 停止发射光圈 */
        stop() {
            this.inPlay = false;
            if (this.timerEvent) {
                ps.timer.remove(this.timerEvent);
                this.timerEvent = undefined;
            }
        }
        /**
         * 创建一个光圈
         */
        createOne() {
            if (!this.enable) return;
            let halo = new qc.UIImage(qc_game);
            this.gameObject.addChild(halo);
            halo.texture = this.texture;
            halo.pivotX = 0.5;
            halo.pivotY = 0.5;
            halo.scaleX = this.scale.x;
            halo.scaleY = this.scale.x;
            Tween.to(halo, { scale: this.scale.y, alpha: 0 }, this.duration).onComplete.addOnce(() => {
                halo.removeSelf();
            });
        }
    }
    qc.registerBehaviour("ps.Halo", Halo);
    Halo["__menu"] = "Custom/Halo";
}
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
