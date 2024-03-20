namespace ps.tween {
    /**
     * 点击缓动缩放组件
     * @description 点击缓动缩放组件。按下缩放，抬起恢复
     * @author JingBin
     */
    export class ClickTweenScale extends Behaviour {
        private _initS: qc.Point = new qc.Point();
        /** 按下缩放动画比例 */
        public scale = .95;
        /** 按下缩放动画耗时 */
        public durationDown = 50;
        /** 抬起缩放动画耗时 */
        public durationUp = 100;

        constructor(gameObject: qc.Node) {
            super(gameObject);
        }

        /** 序列化 */
        private serializableFields: unknown = {
            scale: qc.Serializer.NUMBER,
            durationDown: qc.Serializer.NUMBER,
            durationUp: qc.Serializer.NUMBER,
        };

        awake() {
            this._initS.x = this.gameObject.scaleX;
            this._initS.y = this.gameObject.scaleY;
        }

        private _downTw: Phaser.Tween;
        private _upTw: Phaser.Tween;

        public onDown() {
            this.clearTw();
            this.resetScale();
            if (this.durationDown > 0) {
                this._downTw = this.addTween({
                    scaleX: this._initS.x * this.scale,
                    scaleY: this._initS.y * this.scale,
                }, this.durationDown, Phaser.Easing.Sinusoidal.In);

                qc_game.input.onPointerUp.remove(this.onPointerUp, this);
                qc_game.input.onPointerUp.addOnce(this.onPointerUp, this);
            }
        }

        private onPointerUp() {
            this.clearTw();
            if (this.durationDown > 0) {
                this._upTw = this.addTween({
                    scaleX: this._initS.x,
                    scaleY: this._initS.y,
                }, this.durationDown, Phaser.Easing.Sinusoidal.Out);
            }
        }

        private clearTw() {
            Tween.clear(this._downTw);
            Tween.clear(this._upTw);
        }

        private resetScale() {
            this.gameObject.scaleX = this._initS.x;
            this.gameObject.scaleY = this._initS.y;
        }

        private addTween(props: { scaleX: number, scaleY: number }, duration: number, ease: Function | string): Phaser.Tween {
            return Tween.to(this.gameObject, props, duration, ease);
        }
    }
    qc.registerBehaviour('ps.tween.ClickAnswerScript', ClickTweenScale);
    ClickTweenScale['__menu'] = 'CustomTween/ClickTweenScale';
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