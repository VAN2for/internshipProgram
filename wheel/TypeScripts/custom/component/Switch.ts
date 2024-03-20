namespace ps {
    export enum SwitchEvent {
        UpdateState = 'UpdateState',
    }

    /**
     * 开关组件
     * @description 开关组件
     * @author JingBin
     */
    export class Switch extends ps.Behaviour {
        /** 是否可点击 */
        active = true
        /** 开关状态 */
        state = true
        /** 开启时的纹理 */
        openTex: qc.Texture
        /** 关闭时的纹理 */
        closeTex: qc.Texture

        gameObject: qc.UIImage
        event: ps.EventDispatcher = new ps.EventDispatcher()

        constructor(gameObject: qc.UIImage) {
            super(gameObject)
        }

        /** 序列化 */
        private serializableFields: Object = {
            active: qc.Serializer.BOOLEAN,
            state: qc.Serializer.BOOLEAN,
            openTex: qc.Serializer.TEXTURE,
            closeTex: qc.Serializer.TEXTURE,
        }

        /** 试玩初始化的处理 */
        onInit() {
            // ps.Print.purple('Switch.onInit')
            this.gameObject.interactive = this.active
        }

        /** 试玩开始时的处理 */
        onStart() {
            // ps.Print.purple('Switch.onStart')
            this.updateState()
        }

        onDown() {
            this.state = !this.state
            this.updateState()
        }

        updateState(state?: boolean, dispatch = true) {
            if (state != void 0) this.state = state
            else state = this.state

            const tex = state ? this.openTex : this.closeTex
            if (tex) {
                this.gameObject.texture = tex
                this.gameObject.resetNativeSize()
            }
            if (dispatch) this.event.dispatch(ps.SwitchEvent.UpdateState, state)
        }
    }
    qc.registerBehaviour('ps.Switch', Switch)
    Switch['__menu'] = 'Custom/Switch'
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