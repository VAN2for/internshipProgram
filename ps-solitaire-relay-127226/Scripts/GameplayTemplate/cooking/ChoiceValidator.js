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
     * ChoiceValidator
     * @description ChoiceValidator
     * @author bin
     * @date 2022/12/19 23:20:31
     */
    var ChoiceValidator = /** @class */ (function (_super) {
        __extends(ChoiceValidator, _super);
        function ChoiceValidator(gameObject) {
            var _this = _super.call(this, gameObject) || this;
            _this.serializableFields = {};
            _this.answer_ = [];
            _this.choices = [];
            _this.chosenSize_ = 0;
            return _this;
        }
        Object.defineProperty(ChoiceValidator.prototype, "answer", {
            set: function (next) {
                this.answer_ = next;
                this.clearChoices();
            },
            enumerable: false,
            configurable: true
        });
        ChoiceValidator.prototype.clearChoices = function () {
            this.choices = Array.from({ length: this.answer_.length }, function (_v, _k) { return ({
                chosen: false,
                id: -1,
            }); });
            this.chosenSize_ = 0;
        };
        /**
         * 选择编号为`id`的选项
         * @param id 选项编号，从`0`开始
         * @returns 最终放入空位的结果
         */
        ChoiceValidator.prototype.choose = function (id) {
            debugAssert(id >= 0, "选项编号 %d 不符合要求", id);
            if (this.chosenSize_ === this.answer_.length) {
                return {
                    choiceIdx: -1,
                    isFull: true,
                };
            }
            var availableRecords = this.getAvailableChoices(id);
            if (availableRecords.length === 0) {
                // 对应编号的所有答案中的位置都被占用或者选项不在答案中
                return this.placeInNextEmptyChoice(id);
            }
            var _a = __read(availableRecords, 1), fst = _a[0];
            return this.placeInChoice(id, fst.choiceIdx);
        };
        ChoiceValidator.prototype.placeInNextEmptyChoice = function (id) {
            var nextEmptyChoiceIdx = -1;
            var n = this.choices.length;
            for (var i = 0; i < n; i++) {
                if (this.choices[i].chosen) {
                    continue;
                }
                nextEmptyChoiceIdx = i;
                break;
            }
            return this.placeInChoice(id, nextEmptyChoiceIdx);
        };
        ChoiceValidator.prototype.placeInChoice = function (id, choiceIdx) {
            var choice = this.choices[choiceIdx];
            choice.chosen = true;
            choice.id = id;
            this.chosenSize_ += 1;
            return {
                choiceIdx: choiceIdx,
                isFull: false,
            };
        };
        ChoiceValidator.prototype.getAvailableChoices = function (id) {
            var _this = this;
            return this.answer_
                .map(function (id, i) { return ({
                id: id,
                choiceIdx: i,
            }); })
                .filter(function (_a) {
                var answerId = _a.id, choiceIdx = _a.choiceIdx;
                return answerId === id && !_this.choices[choiceIdx].chosen;
            });
        };
        Object.defineProperty(ChoiceValidator.prototype, "currentStatus", {
            /**
             * 返回当前选择是否正确
             */
            get: function () {
                var e_1, _a;
                if (this.chosenSize_ > this.answer_.length) {
                    return {
                        isCorrect: false,
                        partialCorrect: false,
                    };
                }
                var counter = new Map();
                this.answer_.forEach(function (ans) {
                    var _a;
                    counter.set(ans, ((_a = counter.get(ans)) !== null && _a !== void 0 ? _a : 0) + 1);
                });
                try {
                    for (var _b = __values(this.choices.filter(function (choice) { return choice.chosen; })), _c = _b.next(); !_c.done; _c = _b.next()) {
                        var id = _c.value.id;
                        if (!counter.has(id) || counter.get(id) === 0) {
                            return {
                                isCorrect: false,
                                partialCorrect: false,
                            };
                        }
                        counter.set(id, counter.get(id) - 1);
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
                var partialCorrect = __spreadArray([], __read(counter.values()), false).some(function (n) { return n > 0; });
                return {
                    isCorrect: true,
                    partialCorrect: partialCorrect,
                };
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(ChoiceValidator.prototype, "nextAnswer", {
            /**
             * 获取下一个正确答案
             *
             * 如果没有下一个正确答案，则返回`-1`
             */
            get: function () {
                var e_2, _a, e_3, _b;
                var answerCounter = new Map();
                this.answer_.forEach(function (ans) {
                    var _a;
                    answerCounter.set(ans, ((_a = answerCounter.get(ans)) !== null && _a !== void 0 ? _a : 0) + 1);
                });
                var choiceCounter = new Map();
                this.choices
                    .filter(function (choice) { return choice.chosen; })
                    .forEach(function (_a) {
                    var _b;
                    var id = _a.id;
                    choiceCounter.set(id, ((_b = choiceCounter.get(id)) !== null && _b !== void 0 ? _b : 0) + 1);
                });
                try {
                    for (var choiceCounter_1 = __values(choiceCounter), choiceCounter_1_1 = choiceCounter_1.next(); !choiceCounter_1_1.done; choiceCounter_1_1 = choiceCounter_1.next()) {
                        var _c = __read(choiceCounter_1_1.value, 2), id = _c[0], count = _c[1];
                        if (!answerCounter.has(id)) {
                            continue;
                        }
                        answerCounter.set(id, answerCounter.get(id) - count);
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (choiceCounter_1_1 && !choiceCounter_1_1.done && (_a = choiceCounter_1.return)) _a.call(choiceCounter_1);
                    }
                    finally { if (e_2) throw e_2.error; }
                }
                try {
                    for (var answerCounter_1 = __values(answerCounter), answerCounter_1_1 = answerCounter_1.next(); !answerCounter_1_1.done; answerCounter_1_1 = answerCounter_1.next()) {
                        var _d = __read(answerCounter_1_1.value, 2), id = _d[0], count = _d[1];
                        if (count > 0) {
                            return id;
                        }
                    }
                }
                catch (e_3_1) { e_3 = { error: e_3_1 }; }
                finally {
                    try {
                        if (answerCounter_1_1 && !answerCounter_1_1.done && (_b = answerCounter_1.return)) _b.call(answerCounter_1);
                    }
                    finally { if (e_3) throw e_3.error; }
                }
                return -1;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(ChoiceValidator.prototype, "chosenSize", {
            /**
             * 当前已选择数量
             */
            get: function () {
                return this.chosenSize_;
            },
            enumerable: false,
            configurable: true
        });
        return ChoiceValidator;
    }(ps.Behaviour));
    ps.ChoiceValidator = ChoiceValidator;
    qc.registerBehaviour("ps.ChoiceValidator", ChoiceValidator);
    function debugAssert(cond) {
        var data = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            data[_i - 1] = arguments[_i];
        }
        if (ps.ENV === "DEBUG") {
            console.assert.apply(console, __spreadArray([cond], __read(data), false));
        }
    }
})(ps || (ps = {}));
//# sourceMappingURL=ChoiceValidator.js.map