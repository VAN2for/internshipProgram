namespace ps {
    /** 游戏记录 */
    export class Records {
        private static changes = [];
        private static data = {};
        private static event = new ps.EventDispatcher();
        /**
         * 获取记录的数据
         * @param key 记录名称
         */
        static getData(key: string) {
            return Records.data[key] | 0;
        }
        /**
        * 设置记录数据
        * @param key 记录名称
        * @param value 要设置的值
        */
        static setData(key: string, value: number) {
            Records.data[key] = value;
            Records.addChange("set", key, value);
        }
        /**
         * 增加记录数据
         * @param key 记录名称
         * @param value 要增加的值，默认1
         */
        static addData(key: string, value: number = 1) {
            if (!Records.data[key]) {
                Records.data[key] = value;
            } else {
                Records.data[key] += value;
            }
            Records.addChange("add", key, value);
            return this.getData(key);
        }
        /**
         * 监听记录变化事件
         * @param key 记录名称
         * @param listener 事件侦听函数
         * @param listenerContext 事件侦听函数的执行域
         */
        static listen(key: string, listener: Function, listenerContext?: Object) {
            this.event.add(key, listener, listenerContext);
        }
        private static addChange(operate: "set" | "add", key: string, value: number) {
            Records.changes.push({
                operate: operate,
                key: key,
                value: value,
                time: Date.now()
            })
            this.event.dispatch(key, value, operate);
        }
        /**
         * 打印所有数据
         */
        static printData() {
            for (let key in Records.data) {
                console.log(`${key}:${Records.data[key]}`);
            }
        }
        /**
         * 打印数据变化记录
         */
        static printChange() {
            for (let key in Records.changes) {
                console.log(`${key}:${ps.Tools.jsonToStr(Records.changes[key])}`);
            }
        }
    }
}