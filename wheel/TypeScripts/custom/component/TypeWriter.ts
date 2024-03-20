namespace ps {
    /**
     * 打字机组件
     * @description 可用于文本，实现打字机的效果
     * @author Abby
     */
    export class TypeWriter extends ps.Behaviour {
        private interval: number = 10;
        private delay: number = 1;
        private isAutoStart: boolean = true;
        /** 序列化 */
        private serializableFields: Object = {
            interval: qc.Serializer.NUMBER,
            delay: qc.Serializer.NUMBER,
            isAutoStart: qc.Serializer.BOOLEAN

        }
        constructor(gameObject: qc.Node) {
            super(gameObject);
        }
        awake() {
            let wirteConfig = {
                interval: this.interval,//每个字符出现间隔
                delay: this.delay,//每个字符出现的延迟时间
            }
            if (!this.isAutoStart) return;
            this.typewriter(this.gameObject, wirteConfig.interval, wirteConfig.delay);
        }
        //打字机效果
        typewriter(label, interval, delay = 1) {
            let string = label.text;
            let i: number = 0;
            label.text = " ";
            qc_game.timer.add(delay, () => {
                this.setText(label, string, 0);
                qc_game.timer.loop(interval, () => {
                    i++;
                    let isFinish = this.setText(label, string, i);
                    if (isFinish) {
                    }
                })
            })
        }
        setText(label, string, index) {
            label.text = (string.slice(0, index));
            return index >= string.length;
        }

    }
    qc.registerBehaviour('ps.TypeWriter', TypeWriter);
    TypeWriter["__menu"] = 'Custom/TypeWriter';
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