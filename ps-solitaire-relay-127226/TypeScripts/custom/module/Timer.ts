namespace ps {
    /**
     * 定时器模块，有单次，多次，循环定时器
     * @author VaMP
     */
    class Timer {
        /**
            * 添加一个定时器，执行一次后即刻销毁
            * @param delay 延迟执行的时间，单位：毫秒
            * @param cb 定时器到了后的处理
            * @param context 回调上下文
            * @param params 定时器的参数列表，回调时会原样带回
            * @return {qc.TimerEvent} 定时器对象
            */
        once(delay: number, cb: Function, context?: Object, ...params: any[]): qc.TimerEvent {
            return qc_game.timer.add(delay, cb, context, ...params);
        }
        /**
         * 添加一个定时器，循环不休止的调用
         * @param delay 延迟执行的时间，单位：毫秒
         * @param cb 定时器到了后的处理
         * @param context 回调上下文
         * @param params 定时器的参数列表，回调时会原样带回
         * @return {qc.TimerEvent} 定时器对象
         */
        loop(delay: number, cb: Function, context?: Object, ...params: any[]) {
            return qc_game.timer.loop(delay, cb, context, ...params);
        }
        /**
         * 添加一个定时器，执行数次后销毁
         * @param times 要执行的次数,0或-1为无限次循环
         * @param delay 延迟执行的时间，单位：毫秒
         * @param cb 定时器到了后的处理
         * @param context 回调上下文
         * @param params 定时器的参数列表，回调时会原样带回
         */
        times(times: number, delay: number, cb: Function, context?: Object, ...params: any[]) {
            if (times === 1) return this.once(delay, cb, context, ...params);
            if (times <= 0) return this.loop(delay, cb, context, ...params);
            let timeEvent = qc_game.timer.loop(delay, () => {
                cb.apply(context, params);
                times--;
                if (times === 0) qc_game.timer.remove(timeEvent);
            }, context, ...params);
            return timeEvent;
        }
        /**
         * 移除定时器
         * @param timeEvent
         */
        remove(timeEvent: qc.TimerEvent) {
            qc_game.timer.remove(timeEvent);
        }
        //===================================
        private frameList: Function[] = [];
        /**
         * 更新列表
         * @param delta 离上一帧的间隔时间
         */
        update(delta: number) {
            this.frameList.forEach(cb => {
                cb(delta);
            });
        }
        /**
         * 添加一个定时器，每帧调用
         * 返回绑定this之后的函数
         * @param cb
         */
        frameLoop(cb: Function, context?: Object) {
            if (context) cb = cb.bind(context);
            this.frameList.push(cb);
            return cb
        }
        /**
         * 移除帧定时器
         * @param cb 对象
         */
        removeFrameLoop(cb: Function) {
            Tools.deleteElement(this.frameList, cb);
        }
        /**
         * 清除所有帧定时器
         */
        clearFrameLoop() {
            this.frameList = []
        }

        clearAll():void
        {
          var head = qc_game.timer["events"].head;
          while(head)
          {
            qc_game.timer.remove(head);
            head = head.next;
          }

          head = qc_game.timer["loopEvents"].head;
          while(head)
          {
            qc_game.timer.remove(head);
            head = head.next;
          }

          this.clearFrameLoop();



          // qc_game.timer.remove(timeEvent);
        }
    }
    /** 定时器实例 */
    export let timer = new Timer();
}
