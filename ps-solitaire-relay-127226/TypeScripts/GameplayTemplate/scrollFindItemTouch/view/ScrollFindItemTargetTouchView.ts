namespace ps {
    /**
     * 挂载在寻找目标上的组件
     * @description 挂载在寻找目标上的组件
     * @author QiaoSen.huang
     * @date 2023/01/03 15:32:39
     */
    export class ScrollFindItemTargetTouchView extends ps.ScrollFindItemView {

        constructor(gameObject: qc.Node) {
            super(gameObject);
        }

        public dispatchEvent(e: qc.PointerEvent | qc.ClickEvent) {
            // 对外派发的事件，子类可以重新该方法，派发出不同的事件
            super.dispatchEvent(e)
            this.event.dispatch(ScrollFindItemEvent.TargetItemTouched, this.gameObject, e);
        }

        public _onTouch(e: qc.PointerEvent | qc.ClickEvent){
            // 触碰到对象后执行的函数，子类可以重写，执行不同的操作
            super._onTouch(e)
        }

        
    }
    qc.registerBehaviour("ps.ScrollFindItemTargetTouchView", ScrollFindItemTargetTouchView);
    ScrollFindItemTargetTouchView["__menu"] = "玩法模板/寻找物品（滑动）玩法模板/目标物品组件ScrollFindItemTargetTouchView";
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