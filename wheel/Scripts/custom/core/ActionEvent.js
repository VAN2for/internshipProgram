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
/**
 * 这是一个事件派发器，提供了Action的泛型推导功能。
 * @example
 * let event = new ActionEvent<number, string>();
 * let action1:Action<number, string>;
 * // 添加事件
 * event.AddEvent(action1);
 * // 删除事件
 * event.RemoveEvent(action1);
 * // 派发事件
 * event.DispatchAction(1, "t");
 * @author hubluesky
 * @see Action
 * @todo If have any questions, just call me.
 */
var ActionEvent = /** @class */ (function () {
    function ActionEvent() {
        this.eventList = [];
    }
    Object.defineProperty(ActionEvent.prototype, "isEmpty", {
        get: function () { return this.eventList.length == 0; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ActionEvent.prototype, "length", {
        get: function () { return this.eventList.length; },
        enumerable: false,
        configurable: true
    });
    ActionEvent.prototype.AddEvent = function (event, target) {
        this.eventList.push({ event: event, target: target });
    };
    ActionEvent.prototype.Contains = function (event, target) {
        return this.eventList.find(function (x) { return x.event == event && x.target == target; }) != null;
    };
    ActionEvent.prototype.RemoveEvent = function (event, target) {
        var index = this.eventList.findIndex(function (x) { return x.event == event && x.target == target; });
        if (index != -1)
            this.eventList.splice(index, 1);
    };
    ActionEvent.prototype.ClearEvents = function () {
        this.eventList.length = 0;
    };
    ActionEvent.prototype.DispatchAction = function () {
        var _a;
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        for (var i = this.eventList.length - 1; i >= 0; i--) {
            var action = this.eventList[i];
            (_a = action.event).call.apply(_a, __spreadArray([action.target], __read(args), false));
        }
    };
    return ActionEvent;
}());
//# sourceMappingURL=ActionEvent.js.map