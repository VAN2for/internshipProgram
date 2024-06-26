namespace ps {
    /**
     * 所有Item
     * @description 所有Item
     * @author bin
     * @date 2021/08/26 17:58:26
     */
    export class ItemsScript extends AbstractGameViewAsset {

        constructor(gameObject: qc.Node) {
            super(gameObject);
            this.runInEditor = true;
        }

        /** 序列化 */
        private serializableFields: unknown = {

        };

        /** 组件被激活后执行 */
        public awake() {
            // ps.Print.purple('ItemsScript.awake');
            const arr = [
                3, 3, 1, 1,
                4, 2, 3, 4,
                3, 1, 1, 4,
                2, 4, 3, 4,
            ];
            for (let i = 0; i < arr.length && i < this.gameObject.children.length; i++) {
                (this.gameObject.getChildAt(i).getComponent(ItemScript) as ItemScript).lv = arr[i];
            }
        }

        /** 试玩初始化的处理 */
        public onInit() {
            // ps.Print.purple('ItemsScript.onInit');
            // this._model.on("isRenderItems", this.onIsRenderItems, this, true);
        }


        // private onIsRenderItems() {
        //     const { isRenderItems, arrItemsLv } = this._model;
        //     if (!isRenderItems) {
        //         return;
        //     }
        //     for (let i = 0; i < arrItemsLv.length; i++) {
        //         const lv = arrItemsLv[i];
        //     }
        // }

        /** 试玩开始时的处理 */
        public onStart() {
            // ps.Print.purple('ItemsScript.onStart');
        }

        /** 当脚本被移除时，会自动调用 */
        public onDestroy() {
            // ps.Print.purple('ItemsScript.onDestroy');
        }
    }
    qc.registerBehaviour('ps.ItemsScript', ItemsScript);
    ItemsScript['__menu'] = 'Custom/ItemsScript';
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