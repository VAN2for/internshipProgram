declare namespace ps {
    enum BubbleEvent {
        SHOW_START = "showStart",
        HIDE_START = "hideStart",
        SHOW_END = "showEnd",
        HIDE_END = "hideEnd"
    }
    /**
     * 冒泡组件
     * @description 可用于冒泡对话框弹出显示、收起隐藏效果
     * @author JingBin
     */
    class Bubble extends ps.Behaviour {
        /** 持续漂浮Y值（范围为0或空时，不触发漂浮） */
        floatY: number;
        /** 持续漂浮时间（每次漂浮时间）（秒） */
        floatT: number;
        event: ps.EventDispatcher;
        /** 目标初始缩放X值 */
        private initScaleX;
        /** 目标初始缩放Y值 */
        private initScaleY;
        /** 目标初始Y值 */
        private initY;
        /** Debug模式，点击播放动画 */
        private _debug;
        /** Debug模式 */
        get debug(): boolean;
        set debug(v: boolean);
        private posTw;
        private serializableFields;
        constructor(gameObject: qc.Node);
        awake(): void;
        isShow: boolean;
        onDown(): void;
        /** 显示 */
        show(): void;
        /** 持续漂浮 */
        private float;
        /** 隐藏 */
        hide(destory?: boolean): void;
        remove(): void;
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
}
