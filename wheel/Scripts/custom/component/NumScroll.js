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
var ps;
(function (ps) {
    /**
     * 数字滚动组件
     * @author JingBin
     */
    var NumScroll = /** @class */ (function (_super) {
        __extends(NumScroll, _super);
        function NumScroll(gameObject) {
            var _this = _super.call(this, gameObject) || this;
            _this.prefix = "";
            _this.curNum = 0; //当前数值
            _this.addNum = 0; //添加数值
            _this.chgInterval = 5; //每次翻滚数字时间间隔
            _this.chgCount = 30; //翻滚数字的次数
            _this.maxNum = 9999; //最大数值
            _this.roundCnt = 0; //保留几位小数
            /** 是否每3位加一个"," */
            _this.isComma = false;
            /** 序列化 */
            _this.serializableFields = {
                prefix: qc.Serializer.STRING,
                curNum: qc.Serializer.NUMBER,
                addNum: qc.Serializer.NUMBER,
                chgInterval: qc.Serializer.NUMBER,
                chgCount: qc.Serializer.NUMBER,
                maxNum: qc.Serializer.NUMBER,
                roundCnt: qc.Serializer.INT,
                isComma: qc.Serializer.BOOLEAN,
            };
            _this.playDelay = [];
            _this.playing = false;
            _this.roundCnt = Math.abs(_this.roundCnt);
            _this.runInEditor = true;
            return _this;
        }
        NumScroll.prototype.awake = function () {
            var num = this.curNum = ps.Mathf.keepDecimal(this.curNum, this.roundCnt);
            num = Math.min(num, this.maxNum);
            num = ps.Mathf.keepDecimal(num, this.roundCnt);
            var text = this.prefix + ps.Tools.switchNum(num, this.isComma);
            if (this.gameObject.text !== text) {
                this.gameObject.text = text;
            }
        };
        NumScroll.prototype.refresh = function (add) {
            if (this.playing) {
                return;
            }
            if (add != void 0) {
                this.addNum = add;
            }
            this.awake();
            this.playNum();
        };
        /** 播放数字切换效果 */
        NumScroll.prototype.playNum = function () {
            var _this = this;
            if (!this.addNum) {
                return;
            }
            // 最后一滚直接变成最终值
            var lastUpdate = function () {
                _this.updateRender(_this.curNum);
                _this.playing = false;
            };
            var clearDelay = function () {
                while (_this.playDelay && _this.playDelay.length) {
                    _this.game.timer.remove(_this.playDelay.shift());
                }
            };
            var change = function (random) {
                var diffNum = random - baseNum; //与原数字的差
                var changeTimes = _this.chgCount; //滚动次数
                var changeUnit = ps.Mathf.keepDecimal(diffNum / changeTimes, _this.roundCnt); //每次变化的值
                //依次变化
                var i = 0;
                var changeNum = function () {
                    if (_this.playStop) {
                        return;
                    }
                    _this.playDelay[_this.playDelay.length] = _this.game.timer.add(_this.chgInterval, function () {
                        if (_this.playStop) {
                            return;
                        }
                        //最后一步指定最终值
                        if (i == changeTimes - 1) {
                            lastUpdate.call(_this);
                            return;
                        }
                        else {
                            //过程中
                            _this.updateRender((baseNum += changeUnit));
                        }
                        i++;
                        changeNum();
                    });
                };
                changeNum();
            };
            var start = function () {
                var max;
                var min;
                if (_this.curNum > baseNum) {
                    max = _this.curNum;
                    min = baseNum;
                }
                else {
                    max = baseNum;
                    min = _this.curNum;
                }
                _this.playStop = false;
                _this.playing = true;
                change(_this.curNum);
            };
            if (this.playing) {
                this.playStop = true;
                //不清除上次的延迟，即继续上次值播放到最新
                clearDelay.call(this);
                lastUpdate.call(this);
            }
            var baseNum = this.curNum;
            this.curNum += this.addNum;
            start();
        };
        NumScroll.prototype.updateRender = function (num) {
            if (num > this.curNum) {
                return;
            }
            num = Math.min(num, this.maxNum);
            num = ps.Mathf.keepDecimal(num, this.roundCnt);
            var text = this.prefix + ps.Tools.switchNum(num, this.isComma);
            if (this.gameObject.text !== text) {
                this.gameObject.text = text;
            }
        };
        return NumScroll;
    }(ps.Behaviour));
    ps.NumScroll = NumScroll;
    qc.registerBehaviour("ps.NumScroll", NumScroll);
    NumScroll["__menu"] = "Custom/NumScroll";
})(ps || (ps = {}));
//# sourceMappingURL=NumScroll.js.map