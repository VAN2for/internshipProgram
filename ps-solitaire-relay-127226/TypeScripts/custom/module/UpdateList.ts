namespace ps {
    interface IUpdate {
        update: Function
    }
    /**
     * 更新列表,用于对象或方法的每帧更新
     * 对象需实现update方法,参数为delta
     * 方法直接传入即可，需自己先绑定或包装一层
     * @author  VaMP
     */
    class UpdateList {
        private list: any[] = [];
        /**
         * 添加对象，会每帧自动调用对象的update方法
         * @param target 对象,需实现update方法,参数为delta
         */
        add(target: IUpdate) {
            this.list.push(target);
        }
        /**
         * 移除对象
         * @param target 对象
         */
        remove(target: IUpdate) {
            Tools.deleteElement(this.list, target);
        }
        /**
         * 更新列表
         * @param delta 离上一帧的间隔时间
         */
        update(delta: number) {
            this.list.forEach(target => {
                target.update(delta)
            });
        }
    }
    /** 更新列表实例 */
    export let updateList = new UpdateList();
}