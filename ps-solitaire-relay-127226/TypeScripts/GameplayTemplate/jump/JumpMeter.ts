namespace ps {
    /**
     *
     * @description
     * @author jingru.wu
     * @date 2023/03/16 14:42:05
     */
    export class JumpMeter extends Behaviour {
        Event = new ps.EventDispatcher();
        private _count = 0;
        private meterHideTl: gsap.core.Timeline;
        private _globalNode: qc.Node;
        private globalScript: JumpView;

        public set count(v: number) {
            this._count = v;
        }

        public get count() {
            return this._count;
        }

        constructor(gameObject: qc.Node) {
            super(gameObject);
        }

        /** 序列化 */
        private serializableFields = {
            _globalNode: qc.Serializer.NODE,
        };
        public createGui(): GuiType {
            return {
                _globalNode: {
                    title: "挂载全局组件的节点",
                    component: "node", // 数字控件
                },
            };
        }
        onInit() {
            this.globalScript = this._globalNode.getScript("ps.JumpView");
            qc.Node.prototype["setPropertyIgnoreLayout"] &&
                this.gameObject["setPropertyIgnoreLayout"]({ prop: "y" });
            this.gameObject.y = -(this._count * this.globalScript.boxOffsetY);
            this.gameObject.visible = true;
            this.meterHideTl = gsap
                .timeline({ paused: true })
                .to(this.gameObject, {
                    alpha: 0,
                    duration: 0.2,
                });

            this.globalScript &&
                this.globalScript.Event.add(
                    GEvent.boxFinishNum,
                    this.onBoxFinishNum,
                    this
                );
        }

        public onBoxFinishNum($val: number) {
            if ($val === this._count) {
                this.globalScript.Event.dispatch(
                    "periodicFeedback",
                    this._count
                );
                this.meterHideTl.restart();
            } else if ($val < this._count) {
                this.meterHideTl.pause(0);
            }
        }
    }
    qc.registerBehaviour("ps.JumpMeter", JumpMeter);
    JumpMeter["__menu"] = "玩法模板/跳一跳玩法/阶段性检测组件（JumpMeter）";
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
