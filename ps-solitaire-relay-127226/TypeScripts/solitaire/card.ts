namespace ps {
    /**
     *
     * @description
     * @author yongyuan.liao
     * @date 2023/10/09 10:22:47
     */
    export class card extends Behaviour {

        public list_num: number     //第几列
        public arr_index: number    //第几个
        public color: boolean       //颜色,红为true
        public rank: number         //点数
        public pre_card: qc.Node    //上一张
        public next_card: qc.Node   //下一张
        public draggable: boolean   //是否可拖拽

        constructor(gameObject: qc.Node) {
            super(gameObject);
        }

        /** 序列化 */
        private serializableFields = {
        };

        /** 组件被激活后执行 */
        public awake() {
            // console.info("[info] card.awake");
        }

        /** 试玩初始化的处理 */
        public onInit() {
            // console.info("[info] card.onInit");

        }

        /** 试玩开始时的处理 */
        public onStart() {
            // console.info("[info] card.onStart");
        }

        /** 当脚本被移除时，会自动调用 */
        public onDestroy() {
            // console.info("[info] card.onDestroy");
        }
    }
    qc.registerBehaviour("ps.card", card);
    card["__menu"] = "玩法模板/玩法/（card）";
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
