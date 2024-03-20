namespace ps {
    /**
     *
     * @description 纸牌映射关系
     * @author jingru.wu
     * @date 2023/03/02 15:23:14
     */
    export class CardMap extends Behaviour {
        private cardNum: number;
        private back: qc.Node;
        private front: qc.Node;
        constructor(gameObject: qc.Node) {
            super(gameObject);
        }

        /** 序列化 */
        private serializableFields = {
            cardNum: qc.Serializer.NUMBER,
            back: qc.Serializer.NODE,
            front: qc.Serializer.NODE,
        };
        public createGui(): GuiType {
            return {
                cardNum: {
                    title: "纸牌对应的数值",
                    component: "input",
                    field: {
                        type: "number",
                    },
                },
                front: {
                    title: "正面",
                    tail: "若是暗牌设置背面与正面",
                    component: "node",
                },
                back: {
                    title: "背面",
                    tail: "若是暗牌设置背面与正面",
                    component: "node",
                },
            };
        }
        /** 组件被激活后执行 */
        public awake() {
            // console.info("[info] CardMap.awake");
        }

        /** 试玩初始化的处理 */
        public onInit() {
            // console.info("[info] CardMap.onInit");
        }

        /** 试玩开始时的处理 */
        public onStart() {
            // console.info("[info] CardMap.onStart");
        }

        /** 当脚本被移除时，会自动调用 */
        public onDestroy() {
            // console.info("[info] CardMap.onDestroy");
        }
    }
    qc.registerBehaviour("ps.CardMap", CardMap);
    CardMap["__menu"] = "玩法模板/2048纸牌玩法/纸牌组件（CardMap）";
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
