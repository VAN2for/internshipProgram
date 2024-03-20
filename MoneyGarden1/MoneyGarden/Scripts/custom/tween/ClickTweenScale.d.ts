declare namespace ps.tween {
    /**
     * 点击缓动缩放组件
     * @description 点击缓动缩放组件。按下缩放，抬起恢复
     * @author JingBin
     */
    class ClickTweenScale extends Behaviour {
        private _initS;
        /** 按下缩放动画比例 */
        scale: number;
        /** 按下缩放动画耗时 */
        durationDown: number;
        /** 抬起缩放动画耗时 */
        durationUp: number;
        constructor(gameObject: qc.Node);
        /** 序列化 */
        private serializableFields;
        awake(): void;
        private _downTw;
        private _upTw;
        onDown(): void;
        private onPointerUp;
        private clearTw;
        private resetScale;
        private addTween;
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
