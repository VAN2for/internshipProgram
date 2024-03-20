var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
     * 脚本基类
     * pl状态回调(onInit、onStart、onEnding、onRetry、onResize)
     * 如果实现了这几个函数，会在pl进行到相应状态的时候进行回调
     * @author VaMP
     */
    var Behaviour = /** @class */ (function (_super) {
        __extends(Behaviour, _super);
        function Behaviour(gameObject) {
            var _this = _super.call(this, gameObject) || this;
            _this.createEvent(ps.GameState.READY, "onInit");
            _this.createEvent(ps.GameState.GAMESTART, "onGameStart");
            _this.createEvent(ps.GameState.START, "onStart");
            _this.createEvent(ps.GameState.END, "onEnd");
            _this.createEvent(ps.GameState.RETRY, "onRetry");
            _this.createEvent(ps.GameState.SCENECHANGE, "onSceneChange");
            //如果有onResize方法，自动注册事件
            if (_this["onResize"])
                _this.gameObject.addListener(_this.gameObject.onRelayout, _this["onResize"], _this);
            return _this;
        }
        Behaviour.prototype.awake = function () {
            if (ps.mainState.isPlaying) {
                this.call("onInit");
                this.call("onStart");
            }
            if (ps.mainState.isEnded) {
                this.call("onEnd", ps.mainState.result);
            }
        };
        Behaviour.prototype.call = function (funName) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            if (this[funName])
                this[funName].apply(this, __spreadArray([], __read(args), false));
        };
        Behaviour.prototype.createEvent = function (event, funName) {
            if (this[funName])
                ps.mainState.add(event, this[funName], this);
        };
        //
        Behaviour.prototype.pos = function (x, y) {
            this.gameObject.x = x;
            this.gameObject.y = y;
        };
        Behaviour.prototype.createGui = function () { return; };
        return Behaviour;
    }(qc.Behaviour));
    ps.Behaviour = Behaviour;
})(ps || (ps = {}));
//# sourceMappingURL=Behaviour.js.map