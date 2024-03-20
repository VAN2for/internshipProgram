namespace ps.tween {
    /**
     * 隐藏组件，目前有两种模式,缩小消失与渐隐消失
     * @author VaMP
     */
    export class Hide extends ps.tween.TweenBase {
        type: "zoom" | "alpha" = "zoom";
        private oldValue = { alpha: undefined, scaleX: undefined, scaleY: undefined };
        /** 序列化 */
        protected serializableFields: Object = {
            playOnAwake: qc.Serializer.BOOLEAN,
            type: qc.Serializer.STRING,
            duration: qc.Serializer.NUMBER,
            delay: qc.Serializer.NUMBER,
        }

        play() {
            if (!this.tween) {
                this.oldValue.alpha = this.gameObject.alpha;
                this.oldValue.scaleX = this.gameObject.scaleX;
                this.oldValue.scaleY = this.gameObject.scaleY;
                this.tween = Tween.hide(this.type, this, this.duration, this.delay);
            } else {
                if (!this.tween.isPaused) {
                    this.pause();
                } else {
                    this.resume();
                }
            }
        }
        reset() {
            this.tween = undefined;
            for (let key in this.oldValue) {
                if (this.oldValue[key] != undefined)
                    this.gameObject[key] = this.oldValue[key];
            }
        }
    }
    qc.registerBehaviour('ps.tween.Hide', Hide);
    Hide["__menu"] = 'CustomTween/Hide';
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