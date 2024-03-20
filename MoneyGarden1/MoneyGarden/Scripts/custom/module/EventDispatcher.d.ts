declare namespace ps {
    /**
     * 事件侦听器
     * @author VaMP
     */
    class EventDispatcher {
        /** 调试打印 */
        debugPrint: boolean;
        static ALL: string;
        private singalList;
        /**
         * 监听一个事件
         * @param type 事件的类型。
         * @param listener 事件侦听函数。
         * @param caller （可选）事件侦听函数的执行域。
         */
        on(type: string, listener: Function, caller?: any): qc.SignalBinding;
        /**
         * 注册指定类型的事件侦听器对象，以使侦听器能够接收事件通知。
         * @param type		事件的类型。
         * @param listener	事件侦听函数。
         * @param listenerContext	事件侦听函数的执行域。
         * @param priority		优先级
         */
        add(type: string | number, listener: Function, listenerContext?: Object, priority?: number): qc.SignalBinding;
        /**
         * 只监听一次
         * @param type 事件的类型。
         * @param listener 事件侦听函数。
         * @param caller （可选）事件侦听函数的执行域。
         */
        once(type: string, listener: Function, caller?: any): qc.SignalBinding;
        /**
         * 注册指定类型的事件侦听器对象，以使侦听器能够接收事件通知，此侦听事件响应一次后自动移除。
         * @param type		事件的类型。
         * @param listener	事件侦听函数。
         * @param listenerContext	事件侦听函数的执行域。
         * @param priority		优先级
         */
        addOnce(type: string | number, listener: Function, listenerContext?: Object, priority?: number): qc.SignalBinding;
        /**
         * 检测是否注册了侦听器
         * @param type		事件的类型。
         * @param listener	事件侦听函数。
         * @param listenerContext	事件侦听函数的执行域。
         */
        has(type: string | number, listener: Function, listenerContext?: Object): boolean;
        /** 取消监听
         * @param type 事件的类型。
         * @param listener 事件侦听函数。
         * @param caller （可选）事件侦听函数的执行域。
         */
        off(type: string, listener: Function, caller?: any): void;
        /**
         * 移除侦听器
         * @param type 事件的类型。
         * @param listener	事件侦听函数。
         * @param listenerContext	事件侦听函数的执行域。
         */
        remove(type: string | number, listener: Function, listenerContext?: Object): void;
        /**
         * 取消同一个类型的所有监听
         * @param type 事件类型，如果值为 null，则移除本对象所有类型的侦听器。
         * @return 此 EventDispatcher 对象。
         */
        offAll(type?: string): void;
        /**
         * 移除指定类型的所有侦听器
         * @param type 事件的类型。不指定则为全部
         */
        removeAll(type?: string | number): void;
        /**
         * 派发事件。
         * @param type 事件类型。
         * @param params （可选）回调数据
         */
        event(type: string, ...params: any[]): void;
        /**
         * 派发事件。(同Event)
         * @param type	事件类型。
         * @param params	回调数据。
         */
        dispatch(type: string | number, ...params: any[]): void;
        /**
         * 获取指定类型的侦听器
         * @param type 	事件类型。
         * @param autoCreate 是否自动创建
         */
        getSingal(type: string | number, autoCreate?: boolean): qc.Signal;
        destroy(): void;
    }
}
