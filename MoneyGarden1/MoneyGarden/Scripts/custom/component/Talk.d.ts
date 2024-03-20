declare namespace ps {
    /**
     * 对话框组件
     * @description 可用于游戏对话框。传不同ID切换不同对话内容；勾选使用冒泡组件，可做弹出、收起、持续漂浮动画效果
     * @author JingBin
     */
    class Talk extends ps.Behaviour {
        /** 对话背景框纹理 */
        BgTex: qc.Texture;
        /** 所有对话内容纹理 */
        Texs: qc.Texture[];
        /** 所有对话内容节点 */
        Nodes: qc.Node[];
        /** 当前对话内容纹理索引 */
        TalkIdx: number;
        /** 对话框锚点，一般用于对话弹出冒泡效果顶点 */
        TalkPivot: qc.Point;
        /** 对话背景框 */
        Bg: qc.UIImage;
        /** 对话内容 */
        Talk: qc.UIImage;
        /** 冒泡组件 */
        Bubble: ps.Bubble;
        orgX: number;
        orgY: number;
        /** 序列化 */
        private serializableFields;
        constructor(gameObject: qc.Node);
        private _UseBubble;
        awake(): void;
        refresh(): void;
        UseBubble(b?: boolean): boolean;
        /**
         * 显示对话
         * @param {number} idx 对话内容索引
         */
        show(idx?: number): void;
        /** 隐藏对话 */
        hide(): void;
        private showCurrHideOther;
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
