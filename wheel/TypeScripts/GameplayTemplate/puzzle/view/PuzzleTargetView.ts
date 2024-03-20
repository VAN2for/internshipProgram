namespace ps {
    /**
     * 拼图目标
     * @description 拼图目标
     * @author bin
     * @date 2022/12/09 10:59:51
     */
    export class PuzzleTargetView extends Behaviour {
        /** 命中时是否隐藏被拖拼图 */
        public isHideTarget = true;
        /** 目标块节点 */
        public block: qc.Node;
        /** 目标块遮罩节点 */
        public blockMask: qc.Node;

        constructor(gameObject: qc.Node) {
            super(gameObject);
        }

        /** 序列化 */
        public serializableFields = {
            isHideTarget: qc.Serializer.AUTO,
            block: qc.Serializer.AUTO,
            blockMask: qc.Serializer.AUTO,
        };
        public createGui(): GuiType {
            return {
                isHideTarget: {
                    title: "命中时是否隐藏被拖拼图",
                    component: "switch",
                },
                block: {
                    title: "目标块",
                    component: "node",
                },
                blockMask: {
                    title: "目标块遮罩",
                    component: "node",
                },
            };
        }
    }
    qc.registerBehaviour("ps.PuzzleTargetView", PuzzleTargetView);
    PuzzleTargetView["__menu"] =
        "玩法模板/拼图玩法/拼图目标（PuzzleTargetView）";
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
