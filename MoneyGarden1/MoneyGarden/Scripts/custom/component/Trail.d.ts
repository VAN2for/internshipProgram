declare namespace ps {
    /**
     * 拖尾组件
     * @description 用于游戏中的拖尾效果，如：拖拽屏幕拖尾、指引拖尾
     * @author JingBin
     */
    class Trail extends ps.Behaviour {
        /** 是否拖拽屏幕拖尾 */
        isDragEff: boolean;
        /** 每帧跟随目标拖尾 */
        target: qc.Node;
        /** 目标透明度小于多少时不跟随 */
        alphaMinNotEff: number;
        /** 效果宽度 */
        width: number;
        /** 效果颜色 */
        color: qc.Color;
        /** 消失时间 */
        duration: number;
        /** 延迟消失时间 */
        delay: number;
        /** 是否Y轴缩小消失 */
        scaleYEffect: boolean;
        /** 是否透明度降低消失 */
        alphaEffect: boolean;
        /** 前一次X轴 */
        private preX;
        /** 前一次Y轴 */
        private preY;
        constructor(gameObject: qc.Node);
        /** 序列化 */
        private serializableFields;
        awake(): void;
        update(): void;
        /** 试玩初始化的处理 */
        onInit(): void;
        /** 试玩开始时的处理 */
        onStart(): void;
        onDown(): void;
        onDrag(e: qc.DragEvent): void;
        reset(): void;
        /** 设置新位置 */
        pos(x: number, y: number): this;
        private emit;
    }
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
