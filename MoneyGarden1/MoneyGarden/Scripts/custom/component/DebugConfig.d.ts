declare namespace ps {
    enum DebugEvent {
        UPDATE_LANG = "UpdateLang"
    }
    /**
     *
     * @author VaMP
     */
    class DebugConfig extends ps.Behaviour {
        /** 自动gameStart */
        autoGameStart: boolean;
        /** 显示fps */
        showFps: boolean;
        /** 使用动态参数json文件 */
        useConfigJson: boolean;
        /** 多语言系统，调试语言 */
        debugLang: string;
        /** 事件对象 */
        eventDisp: EventDispatcher;
        /** 序列化 */
        private serializableFields;
        constructor(gameObject: qc.Node);
        awake(): void;
        update(): void;
        onDown(): void;
        /**
         * 获取多语言配置
         * @returns {Object} 当前多语言配置
         */
        getRes(): Object;
        /** 当前使用语言 */
        language(): string;
        /**
         * 更新调试语言
         * @param lang 调试语言
         * @param updateAll 是否更新所有多语言控件（文本控件、图片控件）
         * @param hasLog 是否需要打印日志提示。默认为: false
         */
        updateLang(lang: string, updateAll?: boolean, hasLog?: boolean): void;
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
