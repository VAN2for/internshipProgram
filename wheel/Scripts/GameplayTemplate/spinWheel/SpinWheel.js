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
    var WheelState;
    (function (WheelState) {
        /** 静止 */
        WheelState[WheelState["IDLE"] = 0] = "IDLE";
        /** 加速 */
        WheelState[WheelState["ACCELERATING"] = 1] = "ACCELERATING";
        /** 匀速 */
        WheelState[WheelState["RUNNING"] = 2] = "RUNNING";
        /** 减速 */
        WheelState[WheelState["STOPPING"] = 3] = "STOPPING";
    })(WheelState = ps.WheelState || (ps.WheelState = {}));
    var SpinWheel = /** @class */ (function (_super) {
        __extends(SpinWheel, _super);
        function SpinWheel(gameObject) {
            var _this = _super.call(this, gameObject) || this;
            _this.serializableFields = {
                wheel: qc.Serializer.NODE,
                portions: qc.Serializer.NUMBER,
                secondPerCycle: qc.Serializer.NUMBER,
                accelerateDuration: qc.Serializer.NUMBER,
                accelerateAngle: qc.Serializer.NUMBER,
                stopDuration: qc.Serializer.NUMBER,
                clockWise: qc.Serializer.BOOLEAN,
            };
            /** @property 转盘块数 */
            _this.portions = 8;
            _this.secondPerCycle_ = 0.2;
            _this.clockWise_ = true;
            _this.onRunning = new qc.Signal();
            _this.onStop = new qc.Signal();
            _this.maxSpeed = (2 * Math.PI) / _this.secondPerCycle_;
            /** @property 加速阶段耗时 */
            _this.accelerateDuration = 1;
            _this.accelerateRadian_ = Math.PI;
            /** @property 停止阶段耗时 */
            _this.stopDuration = 1.33;
            _this.rotationModifierMap = {
                default: function () { return function (rotation) {
                    return _this.clockWise_
                        ? rotation + Math.PI
                        : rotation - Math.PI;
                }; },
                nth: function (n) { return function (rotation) {
                    var target = ((2 * Math.PI) / _this.portions) * n;
                    var normalized = Math.abs(rotation % (2 * Math.PI));
                    var diff = target - normalized;
                    if (_this.clockWise_) {
                        return diff >= 0 && diff >= Math.PI
                            ? rotation + diff
                            : rotation + 2 * Math.PI + diff;
                    }
                    else {
                        return diff >= 0 && diff >= Math.PI
                            ? rotation - diff
                            : rotation - (2 * Math.PI + diff);
                    }
                }; },
            };
            return _this;
        }
        SpinWheel.prototype.createGui = function () {
            return {
                wheel: {
                    title: "旋转容器",
                    component: "node",
                },
                portions: {
                    title: "转盘块数",
                    component: "input",
                    field: {
                        type: "number",
                    },
                },
                secondPerCycle: {
                    title: "转盘一圈耗时(秒)",
                    component: "input",
                    field: {
                        type: "number",
                    },
                },
                accelerateDuration: {
                    title: "加速阶段耗时(秒)",
                    component: "input",
                    field: {
                        type: "number",
                    },
                },
                accelerateAngle: {
                    title: "加速阶段目标角度(角度)",
                    component: "input",
                    field: {
                        type: "number",
                    },
                },
                stopDuration: {
                    title: "停止阶段耗时(秒)",
                    component: "input",
                    field: {
                        type: "number",
                    },
                },
                clockWise: {
                    title: "顺时针旋转",
                    component: "switch",
                },
            };
        };
        Object.defineProperty(SpinWheel.prototype, "secondPerCycle", {
            /** @property 转盘一圈耗时 */
            get: function () {
                return this.secondPerCycle_;
            },
            set: function (speed) {
                this.secondPerCycle_ = speed;
                this.maxSpeed = (2 * Math.PI) / this.secondPerCycle_;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(SpinWheel.prototype, "state", {
            /** @property 当前转盘状态 */
            get: function () {
                return this.state_;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(SpinWheel.prototype, "clockWise", {
            /** @property 是否顺时针旋转 */
            get: function () {
                return this.clockWise_;
            },
            set: function (direction) {
                this.clockWise_ = direction;
            },
            enumerable: false,
            configurable: true
        });
        SpinWheel.prototype.onInit = function () {
            if (!this.wheel) {
                SpinWheel.warn("未设置旋转容器，回退到组件挂载的节点");
                this.wheel = this.gameObject;
            }
            this.state_ = WheelState.IDLE;
            this.maxSpeed = (2 * Math.PI) / this.secondPerCycle_;
        };
        SpinWheel.prototype.play = function () {
            var _this = this;
            if (this.state_ !== WheelState.IDLE) {
                SpinWheel.warn("当前状态不可启动转盘", WheelState[this.state_]);
                return;
            }
            this.state_ = WheelState.ACCELERATING;
            this.accTween = this.createAccelerateTween(this.wheel);
            this.accTween.onComplete.addOnce(function () {
                _this.state_ = WheelState.RUNNING;
                _this.movingTween = _this.createMovingTween(_this.wheel);
                _this.movingTween.start();
                _this.onRunning.dispatch(_this);
            }, null, -1);
            this.accTween.start();
            return this;
        };
        SpinWheel.prototype.stop = function (nth) {
            var _this = this;
            if (nth === void 0) { nth = 0; }
            switch (this.state_) {
                case WheelState.ACCELERATING:
                    {
                        this.accTween.stop();
                    }
                    break;
                case WheelState.RUNNING:
                    {
                        this.movingTween.stop();
                    }
                    break;
                default: {
                    SpinWheel.warn("当前状态不可停止转盘", WheelState[this.state_]);
                    return;
                }
            }
            this.wheel.rotation %= 2 * Math.PI;
            this.state_ = WheelState.STOPPING;
            this.stoppingTween = this.createStoppingTween(this.wheel, {
                rotationModifier: this.rotationModifierMap.nth(nth),
            });
            this.stoppingTween.onComplete.addOnce(function () {
                _this.state_ = WheelState.IDLE;
                _this.onStop.dispatch(_this);
            }, null, -1);
            this.stoppingTween.start();
            return this;
        };
        Object.defineProperty(SpinWheel.prototype, "rotation", {
            get: function () {
                return Math.abs(ps.Mathf.radianToAngle(this.wheel.rotation));
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(SpinWheel.prototype, "accelerateAngle", {
            /** @property 加速阶段目标角度 角度制 */
            get: function () {
                return ps.Mathf.radianToAngle(this.accelerateRadian_);
            },
            set: function (angle) {
                this.accelerateRadian_ = ps.Mathf.angleToRadian(angle);
            },
            enumerable: false,
            configurable: true
        });
        SpinWheel.prototype.createMovingTween = function (node) {
            var end = this.clockWise_
                ? node.rotation + this.secondPerCycle_ * this.maxSpeed
                : node.rotation - this.secondPerCycle_ * this.maxSpeed;
            var tween = game.add
                .tween(node)
                .to({
                rotation: end,
            }, this.secondPerCycle_ * 1000, Phaser.Easing.Linear.None)
                .repeat(-1);
            return tween;
        };
        SpinWheel.prototype.createAccelerateTween = function (node) {
            var end = this.clockWise_
                ? node.rotation + this.accelerateRadian_
                : node.rotation - this.accelerateRadian_;
            var tween = game.add.tween(node).to({
                rotation: end,
            }, this.accelerateDuration * 1000, Phaser.Easing.Sinusoidal.In);
            tween.onComplete.addOnce(function () {
                node.rotation %= 2 * Math.PI;
            }, null, -1);
            return tween;
        };
        SpinWheel.prototype.createStoppingTween = function (node, config) {
            var end = config.rotationModifier(node.rotation);
            var tween = game.add.tween(node).to({
                rotation: end,
            }, this.stopDuration * 1000, Phaser.Easing.Back.Out);
            tween.onComplete.addOnce(function () {
                node.rotation %= 2 * Math.PI;
            }, null, -1);
            return tween;
        };
        SpinWheel.warn = function () {
            var msg = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                msg[_i] = arguments[_i];
            }
            console.warn.apply(console, __spreadArray([this.MESSAGE_PREFIX], __read(msg), false));
        };
        SpinWheel.MESSAGE_PREFIX = "[转盘组件]";
        return SpinWheel;
    }(ps.Behaviour));
    ps.SpinWheel = SpinWheel;
    qc.registerBehaviour("ps.SpinWheel", SpinWheel);
    SpinWheel["__menu"] = "玩法模板/转盘玩法/转盘玩法（SpinWheel）";
})(ps || (ps = {}));
//# sourceMappingURL=SpinWheel.js.map