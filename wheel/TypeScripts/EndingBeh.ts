class EndingBeh extends ps.Behaviour {
    /** 序列化 */
    private serializableFields: Object = {
    }
    constructor(gameObject: qc.Node) {
        super(gameObject);
    }
    awake() {
        this.gameObject.minAnchor.x = this.gameObject.minAnchor.y = 0;
        this.gameObject.maxAnchor.x = this.gameObject.maxAnchor.y = 1;
        this.gameObject.left = this.gameObject.right = this.gameObject.bottom = this.gameObject.top = 0;
    }
    /**
     * 显示结束界面
     * @param result 结果，默认为true
     */
    show(result: boolean = true) {

    }
}
qc.registerBehaviour('EndingBeh', EndingBeh);
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
*/
