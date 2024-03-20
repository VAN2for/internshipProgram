namespace ps {
    export enum ClockEvent { TIME_UP, TIME_START }
    enum PrecisionType { INTEGER, HUNDRED_MS, TEN_MS }
    
    export class Clock extends ps.Behaviour {

        clockEvent: ps.EventDispatcher = new ps.EventDispatcher()

        time: number = 10 // 秒
        clockText: qc.UIText
        reverse: boolean = false
        template: string = '{0}s'
        precision: PrecisionType
        autoStart: boolean = false


        updateInterval: number
        last: number
        showTimeMS: number
        started: boolean = false
        paused: boolean = false

        /** 序列化 */
        private serializableFields: Object = {
            time: qc.Serializer.NUMBER, // 时间目标值，单位秒
            clockText: qc.Serializer.NODE, // 显示时间的UIText
            reverse: qc.Serializer.BOOLEAN, // 是否倒计时
            autoStart: qc.Serializer.BOOLEAN, // 是否自动开始
            template: qc.Serializer.STRING, // 时间显示模板，如：{0}s，会自动替换{0}为时间数字
            precision: qc.Serializer.AUTO // 精确度，意为精确到小数点后几位，0为个位数，
        }

        constructor(gameObject: qc.Node) {
            super(gameObject);
        }

        onInit() {
            let precision: number = this.precision
            this.updateInterval = precision > 0 ? parseInt('1000'.substr(0, precision)) : 1000
            if (this.reverse) {
                this.showTimeMS = this.time * 1000
            } else {
                this.showTimeMS = 0
            }
            this.updateText(this.showTimeMS)
        }

        onStart() {
            if (this.autoStart) this.start()
        }

        update() {
            if (!this.started) return
            if (this.showTimeMS <= 0 && this.reverse) {
                this.showTimeMS = 0
                this.timeUp()
                return
            } else if (this.showTimeMS >= this.time * 1000 && !this.reverse) {
                this.showTimeMS = this.time * 1000
                this.timeUp()
                return
            }
            let now: number = Date.now()
            if (this.last === void 0) this.last = now
            let deltaTime: number = now - this.last
            if (deltaTime >= this.updateInterval) {
                this.last = now
                if (this.reverse) {
                    this.showTimeMS -= deltaTime
                } else {
                    this.showTimeMS += deltaTime
                }
                this.updateText(this.showTimeMS)
            }
        }

        start() {
            this.clockEvent.dispatch(ClockEvent.TIME_START)
            this.started = true
        }

        stop() {
            this.started = false
        }

        private timeUp() {
            this.clockEvent.dispatch(ClockEvent.TIME_UP)
            this.started = false
            this.paused = true
            this.updateText(this.showTimeMS)
        }

        updateText(time: number) {
            this.clockText.text = this.template.replace('{0}', `${(Math.abs(time) / 1000).toFixed(this.precision)}`)
        }
    }

    qc.registerBehaviour('ps.Clock', Clock)
    Clock["__menu"] = 'Custom/Clock';
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