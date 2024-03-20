var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var ps;
(function (ps) {
    /**
     * 定时器模块，有单次，多次，循环定时器
     * @author VaMP
     */
    var Timer = /** @class */ (function () {
        function Timer() {
            //===================================
            this.frameList = [];
        }
        /**
            * 添加一个定时器，执行一次后即刻销毁
            * @param delay 延迟执行的时间，单位：毫秒
            * @param cb 定时器到了后的处理
            * @param context 回调上下文
            * @param params 定时器的参数列表，回调时会原样带回
            * @return {qc.TimerEvent} 定时器对象
            */
        Timer.prototype.once = function (delay, cb, context) {
            var _a;
            var params = [];
            for (var _i = 3; _i < arguments.length; _i++) {
                params[_i - 3] = arguments[_i];
            }
            return (_a = qc_game.timer).add.apply(_a, __spreadArray([delay, cb, context], __read(params), false));
        };
        /**
         * 添加一个定时器，循环不休止的调用
         * @param delay 延迟执行的时间，单位：毫秒
         * @param cb 定时器到了后的处理
         * @param context 回调上下文
         * @param params 定时器的参数列表，回调时会原样带回
         * @return {qc.TimerEvent} 定时器对象
         */
        Timer.prototype.loop = function (delay, cb, context) {
            var _a;
            var params = [];
            for (var _i = 3; _i < arguments.length; _i++) {
                params[_i - 3] = arguments[_i];
            }
            return (_a = qc_game.timer).loop.apply(_a, __spreadArray([delay, cb, context], __read(params), false));
        };
        /**
         * 添加一个定时器，执行数次后销毁
         * @param times 要执行的次数,0或-1为无限次循环
         * @param delay 延迟执行的时间，单位：毫秒
         * @param cb 定时器到了后的处理
         * @param context 回调上下文
         * @param params 定时器的参数列表，回调时会原样带回
         */
        Timer.prototype.times = function (times, delay, cb, context) {
            var _a;
            var params = [];
            for (var _i = 4; _i < arguments.length; _i++) {
                params[_i - 4] = arguments[_i];
            }
            if (times === 1)
                return this.once.apply(this, __spreadArray([delay, cb, context], __read(params), false));
            if (times <= 0)
                return this.loop.apply(this, __spreadArray([delay, cb, context], __read(params), false));
            var timeEvent = (_a = qc_game.timer).loop.apply(_a, __spreadArray([delay, function () {
                    cb.apply(context, params);
                    times--;
                    if (times === 0)
                        qc_game.timer.remove(timeEvent);
                }, context], __read(params), false));
            return timeEvent;
        };
        /**
         * 移除定时器
         * @param timeEvent
         */
        Timer.prototype.remove = function (timeEvent) {
            qc_game.timer.remove(timeEvent);
        };
        /**
         * 更新列表
         * @param delta 离上一帧的间隔时间
         */
        Timer.prototype.update = function (delta) {
            this.frameList.forEach(function (cb) {
                cb(delta);
            });
        };
        /**
         * 添加一个定时器，每帧调用
         * 返回绑定this之后的函数
         * @param cb
         */
        Timer.prototype.frameLoop = function (cb, context) {
            if (context)
                cb = cb.bind(context);
            this.frameList.push(cb);
            return cb;
        };
        /**
         * 移除帧定时器
         * @param cb 对象
         */
        Timer.prototype.removeFrameLoop = function (cb) {
            ps.Tools.deleteElement(this.frameList, cb);
        };
        /**
         * 清除所有帧定时器
         */
        Timer.prototype.clearFrameLoop = function () {
            this.frameList = [];
        };
        Timer.prototype.clearAll = function () {
            var head = qc_game.timer["events"].head;
            while (head) {
                qc_game.timer.remove(head);
                head = head.next;
            }
            head = qc_game.timer["loopEvents"].head;
            while (head) {
                qc_game.timer.remove(head);
                head = head.next;
            }
            this.clearFrameLoop();
            // qc_game.timer.remove(timeEvent);
        };
        return Timer;
    }());
    /** 定时器实例 */
    ps.timer = new Timer();
})(ps || (ps = {}));
//# sourceMappingURL=Timer.js.map