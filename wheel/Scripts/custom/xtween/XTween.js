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
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var ps;
(function (ps) {
    var CallFunction = /** @class */ (function () {
        function CallFunction(callback, thisArg, argArray) {
            this.callback = callback;
            this.thisArg = thisArg;
            this.argArray = argArray;
        }
        CallFunction.prototype.call = function () {
            var _a;
            var argArray = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                argArray[_i] = arguments[_i];
            }
            if (this.argArray)
                argArray.unshift.apply(argArray, __spreadArray([], __read(this.argArray), false));
            return (_a = this.callback) === null || _a === void 0 ? void 0 : _a.call.apply(_a, __spreadArray([this.thisArg], __read(argArray), false));
        };
        return CallFunction;
    }());
    var TweenSetAction = /** @class */ (function () {
        function TweenSetAction(properties) {
            this.valuesEnd = Object.assign({}, properties);
        }
        TweenSetAction.prototype.onInitialize = function (target) {
            if (this.valuesStart == null) {
                this.valuesStart = {};
                TweenSetAction.setupProperties(target, this.valuesStart, this.valuesEnd);
            }
        };
        TweenSetAction.prototype.onStart = function (target) { };
        TweenSetAction.prototype.reverseValues = function (target) {
            var temp = this.valuesStart;
            this.valuesStart = this.valuesEnd;
            this.valuesEnd = temp;
        };
        TweenSetAction.prototype.onUpdate = function (target, deltaTime) {
            TweenSetAction.updateProperties(target, this.valuesStart, this.valuesEnd);
            return true;
        };
        TweenSetAction.prototype.onCompleted = function (target) { };
        TweenSetAction.prototype.onCleared = function () { };
        TweenSetAction.setupProperties = function (target, valuesStart, valuesEnd) {
            var _a;
            for (var property in valuesEnd) {
                var startValue = target[property];
                var propType = (_a = typeof startValue) !== null && _a !== void 0 ? _a : typeof valuesEnd[property];
                if (propType === 'object') {
                    if (valuesStart[property] == null)
                        valuesStart[property] = {};
                    TweenSetAction.setupProperties(startValue, valuesStart[property], valuesEnd[property]);
                }
                else {
                    valuesStart[property] = startValue;
                }
            }
        };
        TweenSetAction.updateProperties = function (target, valuesStart, valuesEnd) {
            var _a;
            for (var property in valuesEnd) {
                var end = valuesEnd[property];
                var propType = (_a = typeof valuesStart[property]) !== null && _a !== void 0 ? _a : typeof end;
                if (propType === 'object') {
                    TweenSetAction.updateProperties(target[property], valuesStart, end);
                    target[property] = target[property];
                }
                else {
                    target[property] = end;
                }
            }
        };
        return TweenSetAction;
    }());
    var TweenAction = /** @class */ (function () {
        function TweenAction(duration, isBy, properties, options) {
            this.options = {};
            this.duration = duration;
            this.lerpFunction = isBy ? TweenAction.byLerp : TweenAction.toLerp;
            this.setupValueFunction = isBy ? TweenAction.byValue : TweenAction.toValue;
            this.reverseValuesFunction = isBy ? TweenAction.reverseByValues : TweenAction.reverseToValues;
            this.valuesEnd = Object.assign({}, properties);
            Object.assign(this.options, options);
            if (options.easing == null)
                this.options.easing = XTween.Easing.Linear.None;
            if (options.progress == null)
                this.options.progress = TweenAction.progress;
        }
        TweenAction.progress = function (start, end, t) {
            return start + (end - start) * t;
        };
        TweenAction.prototype.onInitialize = function (target) {
            if (this.valuesStart == null) {
                this.valuesStart = {};
                TweenAction.setupProperties(target, this.valuesStart, this.valuesEnd, this.setupValueFunction);
            }
        };
        TweenAction.prototype.onStart = function (target) {
            this.elapsedTime = 0;
            if (this.options.onStart)
                this.options.onStart(target);
            if (this.setupValueFunction == TweenAction.byValue)
                TweenAction.setupProperties(target, this.valuesStart, this.valuesEnd, TweenAction.byValue);
        };
        TweenAction.prototype.reverseValues = function (target) {
            this.reverseValuesFunction(this);
        };
        TweenAction.prototype.onUpdate = function (target, deltaTime) {
            this.elapsedTime += deltaTime;
            var ratio = this.elapsedTime / this.duration;
            ratio = ratio > 1 ? 1 : ratio;
            var value = this.options.easing(ratio);
            TweenAction.updateProperties(target, this.valuesStart, this.valuesEnd, value, this.lerpFunction, this.options.progress);
            if (this.options.onUpdate)
                this.options.onUpdate(target, ratio);
            return ratio >= 1;
        };
        TweenAction.prototype.onCompleted = function (target) {
            if (this.options.onComplete)
                this.options.onComplete(target);
        };
        TweenAction.prototype.onCleared = function () { };
        TweenAction.resetProperties = function (target, valuesStart, valuesEnd) {
            var _a;
            for (var property in valuesEnd) {
                var startValue = target[property];
                var propType = (_a = typeof startValue) !== null && _a !== void 0 ? _a : typeof valuesEnd[property];
                if (propType === 'object') {
                    if (valuesStart[property] == null)
                        valuesStart[property] = {};
                    TweenAction.resetProperties(startValue, valuesStart[property], valuesEnd[property]);
                }
                else if (propType === 'number') {
                    valuesStart[property] = 0;
                }
            }
        };
        TweenAction.setupProperties = function (target, valuesStart, valuesEnd, call) {
            var _a;
            for (var property in valuesEnd) {
                var startValue = target[property];
                var propType = (_a = typeof startValue) !== null && _a !== void 0 ? _a : typeof valuesEnd[property];
                if (propType === 'object') {
                    if (valuesStart[property] == null)
                        valuesStart[property] = {};
                    TweenAction.setupProperties(startValue, valuesStart[property], valuesEnd[property], call);
                }
                else if (propType === 'number') {
                    valuesStart[property] = call(startValue);
                }
            }
        };
        TweenAction.flipProperties = function (valuesEnd) {
            for (var property in valuesEnd) {
                var propType = typeof valuesEnd[property];
                if (propType === 'object') {
                    TweenAction.flipProperties(valuesEnd[property]);
                }
                else if (propType === 'number') {
                    valuesEnd[property] = -valuesEnd[property];
                }
            }
        };
        TweenAction.updateProperties = function (target, valuesStart, valuesEnd, ratio, lerpFunc, interpolation) {
            var _a;
            for (var property in valuesEnd) {
                var start = valuesStart[property] || 0;
                var end = valuesEnd[property];
                var propType = (_a = typeof end) !== null && _a !== void 0 ? _a : typeof start;
                if (propType === 'object') {
                    TweenAction.updateProperties(target[property], start, end, ratio, lerpFunc, interpolation);
                    target[property] = target[property];
                }
                else if (propType === 'number') {
                    lerpFunc(target, property, valuesStart, start, end, ratio, interpolation);
                }
            }
        };
        TweenAction.reverseByValues = function (self) {
            TweenAction.flipProperties(self.valuesEnd);
        };
        TweenAction.reverseToValues = function (self) {
            var temp = self.valuesStart;
            self.valuesStart = self.valuesEnd;
            self.valuesEnd = temp;
        };
        TweenAction.toValue = function (value) { return value; };
        TweenAction.byValue = function (value) { return 0; };
        TweenAction.toLerp = function (target, property, valuesStart, start, end, ratio, interpolation) {
            var finalValue = interpolation(start, end, ratio);
            target[property] = finalValue;
        };
        TweenAction.byLerp = function (target, property, valuesStart, start, end, ratio, interpolation) {
            var finalValue = interpolation(0, end, ratio);
            target[property] += finalValue - start;
            valuesStart[property] = finalValue;
        };
        return TweenAction;
    }());
    var DelayAction = /** @class */ (function () {
        function DelayAction(duration) {
            this.duration = duration;
        }
        DelayAction.prototype.onInitialize = function (target) { };
        DelayAction.prototype.onStart = function (target) {
            this.elapsedTime = 0;
        };
        DelayAction.prototype.reverseValues = function (target) { };
        DelayAction.prototype.onUpdate = function (target, deltaTime) {
            this.elapsedTime += deltaTime;
            return this.elapsedTime >= this.duration;
        };
        DelayAction.prototype.onCompleted = function (target) { };
        DelayAction.prototype.onCleared = function () { };
        return DelayAction;
    }());
    var CallAction = /** @class */ (function (_super) {
        __extends(CallAction, _super);
        function CallAction() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        CallAction.prototype.onInitialize = function (target) { };
        CallAction.prototype.onStart = function (target) { };
        CallAction.prototype.reverseValues = function (target) { };
        CallAction.prototype.onUpdate = function (target, deltaTime) {
            this.call();
            return true;
        };
        CallAction.prototype.onCompleted = function (target) { };
        CallAction.prototype.onCleared = function () { };
        return CallAction;
    }(CallFunction));
    var TweenManager = /** @class */ (function () {
        function TweenManager() {
            var _this = this;
            this.tweenList = [];
            this.updateTweens = function () {
                _this.lastTime = Date.now() * XTween.TIME_UNIT;
                _this.updateTweens = _this.update.bind(_this);
            };
        }
        TweenManager.prototype.add = function (tween) {
            this.tweenList.push(tween);
        };
        TweenManager.prototype.remove = function (tween) {
            var index = this.tweenList.indexOf(tween);
            if (index != -1)
                this.tweenList[index] = null;
        };
        TweenManager.prototype.removeTarget = function (target) {
            var _a;
            for (var i = this.tweenList.length - 1; i >= 0; i--) {
                if (((_a = this.tweenList[i]) === null || _a === void 0 ? void 0 : _a.target) == target) {
                    this.tweenList[i]._clear();
                    this.tweenList[i] = null;
                }
            }
        };
        TweenManager.prototype.containTweens = function (target) {
            var _a;
            for (var i = this.tweenList.length - 1; i >= 0; i--) {
                if (((_a = this.tweenList[i]) === null || _a === void 0 ? void 0 : _a.target) == target)
                    return true;
            }
            return false;
        };
        TweenManager.prototype.removeAll = function () {
            var e_1, _a;
            try {
                for (var _b = __values(this.tweenList), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var tween_1 = _c.value;
                    tween_1 === null || tween_1 === void 0 ? void 0 : tween_1._clear();
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
            }
            this.tweenList.length = 0;
        };
        TweenManager.prototype.update = function (time) {
            if (time === void 0) { time = Date.now() * XTween.TIME_UNIT; }
            var deltaTime = time - this.lastTime;
            this.lastTime = time;
            for (var i = this.tweenList.length - 1; i >= 0; i--) {
                var tween_2 = this.tweenList[i];
                if (tween_2 == null)
                    this.tweenList.splice(i, 1);
                else if (tween_2._updateActions(deltaTime)) {
                    tween_2._clear();
                    this.tweenList.splice(i, 1);
                }
            }
        };
        return TweenManager;
    }());
    var tweenManager = new TweenManager();
    var TweenEasing = {
        Linear: {
            None: function (amount) {
                return amount;
            },
        },
        Quadratic: {
            In: function (amount) {
                return amount * amount;
            },
            Out: function (amount) {
                return amount * (2 - amount);
            },
            InOut: function (amount) {
                if ((amount *= 2) < 1)
                    return 0.5 * amount * amount;
                return -0.5 * (--amount * (amount - 2) - 1);
            },
        },
        Cubic: {
            In: function (amount) {
                return amount * amount * amount;
            },
            Out: function (amount) {
                return --amount * amount * amount + 1;
            },
            InOut: function (amount) {
                if ((amount *= 2) < 1)
                    return 0.5 * amount * amount * amount;
                return 0.5 * ((amount -= 2) * amount * amount + 2);
            },
        },
        Quartic: {
            In: function (amount) {
                return amount * amount * amount * amount;
            },
            Out: function (amount) {
                return 1 - --amount * amount * amount * amount;
            },
            InOut: function (amount) {
                if ((amount *= 2) < 1)
                    return 0.5 * amount * amount * amount * amount;
                return -0.5 * ((amount -= 2) * amount * amount * amount - 2);
            },
        },
        Quintic: {
            In: function (amount) {
                return amount * amount * amount * amount * amount;
            },
            Out: function (amount) {
                return --amount * amount * amount * amount * amount + 1;
            },
            InOut: function (amount) {
                if ((amount *= 2) < 1)
                    return 0.5 * amount * amount * amount * amount * amount;
                return 0.5 * ((amount -= 2) * amount * amount * amount * amount + 2);
            },
        },
        Sinusoidal: {
            In: function (amount) {
                return 1 - Math.cos((amount * Math.PI) / 2);
            },
            Out: function (amount) {
                return Math.sin((amount * Math.PI) / 2);
            },
            InOut: function (amount) {
                return 0.5 * (1 - Math.cos(Math.PI * amount));
            },
        },
        Exponential: {
            In: function (amount) {
                return amount === 0 ? 0 : Math.pow(1024, amount - 1);
            },
            Out: function (amount) {
                return amount === 1 ? 1 : 1 - Math.pow(2, -10 * amount);
            },
            InOut: function (amount) {
                if (amount === 0 || amount === 1)
                    return amount;
                if ((amount *= 2) < 1)
                    return 0.5 * Math.pow(1024, amount - 1);
                return 0.5 * (-Math.pow(2, -10 * (amount - 1)) + 2);
            },
        },
        Circular: {
            In: function (amount) {
                return 1 - Math.sqrt(1 - amount * amount);
            },
            Out: function (amount) {
                return Math.sqrt(1 - --amount * amount);
            },
            InOut: function (amount) {
                if ((amount *= 2) < 1)
                    return -0.5 * (Math.sqrt(1 - amount * amount) - 1);
                return 0.5 * (Math.sqrt(1 - (amount -= 2) * amount) + 1);
            },
        },
        Elastic: {
            In: function (amount) {
                if (amount === 0 || amount === 1)
                    return amount;
                return -Math.pow(2, 10 * (amount - 1)) * Math.sin((amount - 1.1) * 5 * Math.PI);
            },
            Out: function (amount) {
                if (amount === 0 || amount === 1)
                    return amount;
                return Math.pow(2, -10 * amount) * Math.sin((amount - 0.1) * 5 * Math.PI) + 1;
            },
            InOut: function (amount) {
                if (amount === 0 || amount === 1)
                    return amount;
                amount *= 2;
                if (amount < 1)
                    return -0.5 * Math.pow(2, 10 * (amount - 1)) * Math.sin((amount - 1.1) * 5 * Math.PI);
                return 0.5 * Math.pow(2, -10 * (amount - 1)) * Math.sin((amount - 1.1) * 5 * Math.PI) + 1;
            },
        },
        Back: {
            In: function (amount) {
                var s = 1.70158;
                return amount * amount * ((s + 1) * amount - s);
            },
            Out: function (amount) {
                var s = 1.70158;
                return --amount * amount * ((s + 1) * amount + s) + 1;
            },
            InOut: function (amount) {
                var s = 1.70158 * 1.525;
                if ((amount *= 2) < 1)
                    return 0.5 * (amount * amount * ((s + 1) * amount - s));
                return 0.5 * ((amount -= 2) * amount * ((s + 1) * amount + s) + 2);
            },
        },
        Bounce: {
            In: function (amount) {
                return 1 - XTween.Easing.Bounce.Out(1 - amount);
            },
            Out: function (amount) {
                if (amount < 1 / 2.75) {
                    return 7.5625 * amount * amount;
                }
                else if (amount < 2 / 2.75) {
                    return 7.5625 * (amount -= 1.5 / 2.75) * amount + 0.75;
                }
                else if (amount < 2.5 / 2.75) {
                    return 7.5625 * (amount -= 2.25 / 2.75) * amount + 0.9375;
                }
                else {
                    return 7.5625 * (amount -= 2.625 / 2.75) * amount + 0.984375;
                }
            },
            InOut: function (amount) {
                if (amount < 0.5)
                    return XTween.Easing.Bounce.In(amount * 2) * 0.5;
                return XTween.Easing.Bounce.Out(amount * 2 - 1) * 0.5 + 0.5;
            },
        },
    };
    /**
     * version 1.2
     * 这是一个补间动画
     * 支持对象的number属性
     * 支持自定义插值，默认是线性插值。可以自定义为贝塞尔等。
     * 支持每一个动作进行onStart, onUpdate, onComplete事件回调。
     * 支持泛型参数推导。可以对要补间的动画参数进行语法检查和补全。
     * 支持连续拼接动作。
     *
     * ```
     *  // 注意使用时需要每帧更新一下
     *  setInterval(XTween.updateTweens, 1);
     *
     *  class Target {
     *      visable: boolean = false;
     *      position = { x: 0, y: 0, z: 0 };
     *      rotation: number = 0;
     *      alpha: number = 0;
     *      width: number = 100;
     *      height: number = 200;
     *  }
     *
     *  let target = new Target();
     *  let target2 = new Target();
     *
     *  xtween(target)
     *      .to(1000, { width: 500, rotation: 360 }, { easing: XTween.Easing.Back.Out })
     *      .to(1500, { height: 600 }, {
     *          onComplete: (target) => {
     *              console.log("onComplete 1", target);
     *          }
     *      })
     *      .delay(1000)
     *      .repeat(4, true, xtween(target).to(300, { alpha: 1 }).to(300, { alpha: 0 }))
     *      .sequence(xtween(target).to(1000, { rotation: 100 }), xtween(target2).to(1000, { rotation: 100 }))
     *      .call(() => {
     *          console.log("Call 1", target, target2);
     *      })
     *      .to(1500, { position: { x: 10, y: 20, z: 30 } }, {
     *          onStart: (target) => {
     *              console.log("onStart ", target);
     *          }
     *      })
     *      .set({ visable: false })
     *      .call(() => {
     *          console.log("Call 2", target, target2);
     *      })
     *      .start();
     * ```
     */
    var XTween = /** @class */ (function () {
        /**
         * 创建一个补间动画
         * @param target 要补间的目标对象
         */
        function XTween(target) {
            this.actionList = [];
            this.timeScale = 1;
            this._isPlaying = false;
            this._isPaused = false;
            this.target = target;
        }
        Object.defineProperty(XTween.prototype, "isPlaying", {
            get: function () { return this._isPlaying; },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(XTween.prototype, "isPaused", {
            get: function () { return this._isPaused; },
            enumerable: false,
            configurable: true
        });
        /**
         * 设置时间缩放，默认是1
         * @param timeScale 时间缩放比例
         */
        XTween.prototype.setTimeScale = function (timeScale) {
            this.timeScale = timeScale;
            return this;
        };
        /**
         * 对目标对象属性进行补间动作
         * @param duration 补间时长
         * @param properties 属性集
         * @param options 补间可选参数
         * @returns 返回当前补间动画实例
         */
        XTween.prototype.to = function (duration, properties, options) {
            var action = new TweenAction(duration, false, properties, options || {});
            this.actionList.push(action);
            return this;
        };
        /**
          * 对目标对象属性进行补间动作
          * @param duration 补间时长
          * @param properties 属性集
          * @param options 补间可选参数
          * @returns 返回当前补间动画实例
          */
        XTween.prototype.by = function (duration, properties, options) {
            var action = new TweenAction(duration, true, properties, options || {});
            this.actionList.push(action);
            return this;
        };
        /**
         * 对目录对象属性进行设置
         * @param properties 属性集
         * @returns 返回当前补间动画实例
         */
        XTween.prototype.set = function (properties) {
            var action = new TweenSetAction(properties);
            this.actionList.push(action);
            return this;
        };
        /**
         * 对当前补间动作进行延迟
         * @param duration 补间时长
         * @returns 返回当前补间动画实例
         */
        XTween.prototype.delay = function (duration) {
            var action = new DelayAction(duration);
            this.actionList.push(action);
            return this;
        };
        /**
         * 在当前补间动作执行函数回调
         * @param callback 函数对象
         * @param thisArg 函数的this对象
         * @param argArray 函数的参数
         * @returns 返回当前补间动画实例
         */
        XTween.prototype.call = function (callback, thisArg) {
            var argArray = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                argArray[_i - 2] = arguments[_i];
            }
            var action = new CallAction(callback, thisArg, argArray);
            this.actionList.push(action);
            return this;
        };
        /**
         * 在当前补间动作加入一个按顺序执行的Tween集合
         * @param tweens Tween集合，该集合的Tween的target不需要与当前的target类型相同，每个Tween的target类型都可以不相同。
         * @returns 返回当前补间动画实例
         */
        XTween.prototype.sequence = function () {
            var tweens = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                tweens[_i] = arguments[_i];
            }
            var action = new SequenceAction(tweens);
            this.actionList.push(action);
            return this;
        };
        /**
         * 在当前补间动作加入一个同时执行的Tween集合
         * @param tweens Tween集合，该集合的Tween的target不需要与当前的target类型相同，每个Tween的target类型都可以不相同。
         * @returns 返回当前补间动画实例
         */
        XTween.prototype.parallel = function () {
            var tweens = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                tweens[_i] = arguments[_i];
            }
            var action = new ParallelAction(tweens);
            this.actionList.push(action);
            return this;
        };
        /**
         * 在当前补间动作加入一个重复执行的Tween
         * @param repeatTimes 重复次数，无限次数使用Infinity
         * @param pingPong 是否来回缓动
         * @param repeatTween 需要被重复执行的Tween
         * @returns 返回当前补间动画实例
         */
        XTween.prototype.repeat = function (repeatTimes, pingPong, repeatTween) {
            var action = new RepeatAction(repeatTimes, pingPong, repeatTween);
            this.actionList.push(action);
            return this;
        };
        /**
         * 在当前补间动作加入一个无限重复执行的Tween
         * @param pingPong 是否来回缓动
         * @param repeatTween 需要被重复执行的Tween
         * @returns 返回当前补间动画实例
         */
        XTween.prototype.repeatForever = function (pingPong, repeatTween) {
            var action = new RepeatAction(Infinity, pingPong, repeatTween);
            this.actionList.push(action);
            return this;
        };
        /**
         * 在当前补间动作加入一个Tween
         * @param thenTween 要插入执行的Tween
         * @returns 返回当前补间动画实例
         */
        XTween.prototype.then = function (thenTween) {
            var action = new ThenAction(thenTween);
            this.actionList.push(action);
            return this;
        };
        /**
         * 开始当前Tween的所有动作
         * @returns 返回当前补间动画实例
         */
        XTween.prototype.start = function () {
            if (this.isPlaying || this.isPaused)
                return this;
            this._isPlaying = true;
            this._isPaused = false;
            this._intializeActions();
            this._startActions();
            tweenManager.add(this);
            return this;
        };
        /**
         * 暂停当前Tween的所有动作
         * @returns 返回当前补间动画实例
         */
        XTween.prototype.pause = function () {
            if (!this.isPlaying || this.isPaused)
                return this;
            this._isPlaying = false;
            this._isPaused = true;
            tweenManager.remove(this);
            return this;
        };
        /**
         * 恢复当前Tween的所有动作
         * @returns 返回当前补间动画实例
         */
        XTween.prototype.resume = function () {
            if (!this.isPaused || this.isPlaying)
                return this;
            this._isPlaying = true;
            this._isPaused = false;
            tweenManager.add(this);
            return this;
        };
        /**
         * 停止当前Tween的所有动作
         * @returns 返回当前补间动画实例
         */
        XTween.prototype.stop = function () {
            if (!this.isPaused && !this.isPlaying)
                return this;
            this._isPlaying = false;
            this._isPaused = false;
            tweenManager.remove(this);
            this._clear();
            return this;
        };
        /**
         * 设置tween最终结果回调，如果tween是正常结束，返回参数为true，如果是非正常结束，返回参数为false。
         * @param callback 回调函数
         * @returns 返回当前补间动画实例
         */
        XTween.prototype.onFinally = function (callback, thisArg) {
            this.onFinallyFunc = new CallFunction(callback, thisArg);
            return this;
        };
        /**
         * 初始化所有Action，这是内部函数，请不要外部调用
         */
        XTween.prototype._intializeActions = function () {
            this.indexAction = 0;
            if (this.actionList.length > 0)
                this.actionList[0].onInitialize(this.target);
        };
        /**
         * 开始所有Action，这是内部函数，请不要外部调用
         */
        XTween.prototype._startActions = function () {
            if (this.actionList.length > 0)
                this.actionList[0].onStart(this.target);
        };
        /**
         * 翻转所有Action，这是内部函数，请不要外部调用
         */
        XTween.prototype._reverseActions = function () {
            var e_2, _a;
            this.actionList.reverse();
            try {
                for (var _b = __values(this.actionList), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var action = _c.value;
                    action.reverseValues(this.target);
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_2) throw e_2.error; }
            }
        };
        /**
         * 更新所有Action。这是内部函数，请不要外部调用
         * @returns 返回true表示执行所有Action完毕。false表示下一帧继续。
         */
        XTween.prototype._updateActions = function (deltaTime) {
            if (this.indexAction < this.actionList.length) {
                var action = this.actionList[this.indexAction];
                if (!action.onUpdate(this.target, deltaTime * this.timeScale))
                    return false;
                action.onCompleted(this.target);
                this.indexAction++;
                var nextAction = this.actionList[this.indexAction];
                if (nextAction != null) {
                    nextAction.onInitialize(this.target);
                    nextAction.onStart(this.target);
                }
            }
            return this.indexAction >= this.actionList.length;
        };
        /**
         * 清理tween状态。这是内部函数，请不要外部调用
         */
        XTween.prototype._clear = function () {
            var e_3, _a;
            try {
                for (var _b = __values(this.actionList), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var action = _c.value;
                    action.onCleared();
                }
            }
            catch (e_3_1) { e_3 = { error: e_3_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_3) throw e_3.error; }
            }
            this._isPlaying = false;
            this._isPaused = false;
            if (this.onFinallyFunc != null) {
                this.onFinallyFunc.call(this.indexAction >= this.actionList.length);
                this.onFinallyFunc = null;
            }
        };
        //----------------------------------------------------------------------------------------------------------------------------
        /**
         * 创建一个重复执行的Tween
         * @param repeatTimes 重复次数，无限次数使用Infinity
         * @param pingPong 是否来回缓动
         * @param repeatTween 需要被重复执行的Tween
         * @returns 返回补间动画实例
         */
        XTween.repeat = function (repeatTimes, pingPong, repeatTween) {
            return new XTween(repeatTween.target).repeat(repeatTimes, pingPong, repeatTween);
        };
        /**
         * 创建一个无限重复执行的Tween
         * @param pingPong 是否来回缓动
         * @param repeatTween 需要被重复执行的Tween
         * @returns 返回补间动画实例
         */
        XTween.repeatForever = function (pingPong, repeatTween) {
            return new XTween(repeatTween.target).repeatForever(pingPong, repeatTween);
        };
        /**
         * 创建一个按顺序执行的Tween集合
         * @param tweens Tween集合，每个Tween的target类型都可以不相同。
         * @returns 返回补间动画实例
         */
        XTween.sequence = function () {
            var _a;
            var tweens = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                tweens[_i] = arguments[_i];
            }
            return (_a = new XTween({})).sequence.apply(_a, __spreadArray([], __read(tweens), false));
        };
        /**
         * 创建一个同时执行的Tween集合
         * @param tweens Tween集合，每个Tween的target类型都可以不相同。
         * @returns 返回补间动画实例
         */
        XTween.parallel = function () {
            var _a;
            var tweens = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                tweens[_i] = arguments[_i];
            }
            return (_a = new XTween({})).parallel.apply(_a, __spreadArray([], __read(tweens), false));
        };
        /**
         * 删除所有的Tween
         */
        XTween.removeAllTweens = function () {
            return tweenManager.removeAll();
        };
        /**
         * 删除目标身上所有的Tween
         * @param target 目标对象
         */
        XTween.removeTargetTweens = function (target) {
            tweenManager.removeTarget(target);
        };
        /**
         * 目标是否包含Tween
         * @param target 目标对象
         */
        XTween.containTweens = function (target) {
            return tweenManager.containTweens(target);
        };
        /**
         * Tween的更新函数
         * @example
         * setInterval(XTween.updateTweens, 1);
         */
        XTween.updateTweens = function () {
            tweenManager.updateTweens();
        };
        /** 时间默认单位（秒） */
        XTween.TIME_UNIT = 1;
        XTween.Easing = TweenEasing;
        return XTween;
    }());
    ps.XTween = XTween;
    var ThenAction = /** @class */ (function () {
        function ThenAction(tween) {
            this.tween = tween;
        }
        ThenAction.prototype.onInitialize = function (target) {
            this.tween._intializeActions();
        };
        ThenAction.prototype.onStart = function (target) {
            this.tween._startActions();
        };
        ThenAction.prototype.reverseValues = function (target) {
            this.tween._reverseActions();
        };
        ThenAction.prototype.onUpdate = function (target, deltaTime) {
            return this.tween._updateActions(deltaTime);
        };
        ThenAction.prototype.onCompleted = function (target) { };
        ThenAction.prototype.onCleared = function () {
            this.tween._clear();
        };
        return ThenAction;
    }());
    var SequenceAction = /** @class */ (function () {
        function SequenceAction(tweens) {
            this.tweens = tweens;
            this.currentIndex = 0;
        }
        SequenceAction.prototype.onInitialize = function (target) {
            this.currentIndex = 0;
            this.tweens[this.currentIndex]._intializeActions();
        };
        SequenceAction.prototype.onStart = function (target) {
            this.tweens[this.currentIndex]._startActions();
        };
        SequenceAction.prototype.reverseValues = function (target) {
            var e_4, _a;
            this.tweens.reverse();
            try {
                for (var _b = __values(this.tweens), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var tween_3 = _c.value;
                    tween_3._reverseActions();
                }
            }
            catch (e_4_1) { e_4 = { error: e_4_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_4) throw e_4.error; }
            }
        };
        SequenceAction.prototype.onUpdate = function (target, deltaTime) {
            if (this.currentIndex < this.tweens.length) {
                var tween_4 = this.tweens[this.currentIndex];
                if (!tween_4._updateActions(deltaTime))
                    return false;
                this.currentIndex++;
                if (this.currentIndex < this.tweens.length) {
                    var nextTween = this.tweens[this.currentIndex];
                    nextTween._intializeActions();
                    nextTween._startActions();
                }
            }
            return this.currentIndex >= this.tweens.length;
        };
        SequenceAction.prototype.onCompleted = function (target) { };
        SequenceAction.prototype.onCleared = function () {
            var e_5, _a;
            try {
                for (var _b = __values(this.tweens), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var tween_5 = _c.value;
                    tween_5._clear();
                }
            }
            catch (e_5_1) { e_5 = { error: e_5_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_5) throw e_5.error; }
            }
        };
        return SequenceAction;
    }());
    var ParallelAction = /** @class */ (function () {
        function ParallelAction(tweens) {
            this.tweens = tweens;
        }
        ParallelAction.prototype.onInitialize = function (target) {
            var e_6, _a;
            this.updateTweens = Array.from(this.tweens);
            try {
                for (var _b = __values(this.tweens), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var tween_6 = _c.value;
                    tween_6._intializeActions();
                }
            }
            catch (e_6_1) { e_6 = { error: e_6_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_6) throw e_6.error; }
            }
        };
        ParallelAction.prototype.onStart = function (target) {
            var e_7, _a;
            try {
                for (var _b = __values(this.tweens), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var tween_7 = _c.value;
                    tween_7._startActions();
                }
            }
            catch (e_7_1) { e_7 = { error: e_7_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_7) throw e_7.error; }
            }
        };
        ParallelAction.prototype.reverseValues = function (target) {
            var e_8, _a;
            try {
                for (var _b = __values(this.tweens), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var tween_8 = _c.value;
                    tween_8._reverseActions();
                }
            }
            catch (e_8_1) { e_8 = { error: e_8_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_8) throw e_8.error; }
            }
        };
        ParallelAction.prototype.onUpdate = function (target, deltaTime) {
            for (var i = this.updateTweens.length - 1; i >= 0; i--) {
                if (this.updateTweens[i]._updateActions(deltaTime))
                    this.updateTweens.splice(i, 1);
            }
            return this.updateTweens.length == 0;
        };
        ParallelAction.prototype.onCompleted = function (target) { };
        ParallelAction.prototype.onCleared = function () {
            var e_9, _a;
            try {
                for (var _b = __values(this.tweens), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var tween_9 = _c.value;
                    tween_9._clear();
                }
            }
            catch (e_9_1) { e_9 = { error: e_9_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_9) throw e_9.error; }
            }
        };
        return ParallelAction;
    }());
    var RepeatAction = /** @class */ (function () {
        function RepeatAction(repeatTimes, pingPong, repeatTween) {
            this.repeatTimes = repeatTimes;
            this.pingPong = pingPong;
            this.repeatTween = repeatTween;
            this.repeatCount = 0;
            this.repeatTimes = repeatTimes;
            this.pingPong = pingPong;
            this.repeatTween = repeatTween;
        }
        RepeatAction.prototype.onInitialize = function (target) {
            this.repeatTween._intializeActions();
        };
        RepeatAction.prototype.onStart = function (target) {
            this.repeatCount = 0;
            this.repeatTween._startActions();
        };
        RepeatAction.prototype.reverseValues = function (target) {
            this.repeatTween._reverseActions();
        };
        RepeatAction.prototype.onUpdate = function (target, deltaTime) {
            if (this.repeatTween._updateActions(deltaTime)) {
                if (this.pingPong)
                    this.repeatTween._reverseActions();
                this.repeatTween._intializeActions();
                this.repeatTween._startActions();
                this.repeatCount++;
            }
            return this.repeatCount >= this.repeatTimes;
        };
        RepeatAction.prototype.onCompleted = function (target) { };
        RepeatAction.prototype.onCleared = function () {
            this.repeatTween._clear();
        };
        return RepeatAction;
    }());
    function xtween(target) {
        return new XTween(target);
    }
    ps.xtween = xtween;
})(ps || (ps = {}));
//# sourceMappingURL=XTween.js.map