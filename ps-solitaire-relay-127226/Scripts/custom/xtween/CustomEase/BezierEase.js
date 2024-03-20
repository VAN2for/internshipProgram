var ps;
(function (ps) {
    var ease;
    (function (ease) {
        var BezierEase = /** @class */ (function () {
            function BezierEase(x1, y1, x2, y2) {
                var _this = this;
                this.easeFunc = function (progress) {
                    if (x1 === y1 && x2 === y2)
                        return progress;
                    if (progress === 0)
                        return 0;
                    if (progress === 1)
                        return 1;
                    var val = [];
                    for (var i = 0; i < 11; ++i)
                        val[i] = _this.bezierCalc(i * 0.1, x1, x2);
                    return _this.bezierCalc(_this.bezierX(x1, x2, progress, val), y1, y2);
                };
            }
            BezierEase.create = function (x1, y1, x2, y2) {
                return new BezierEase(x1, y1, x2, y2).easeFunc;
            };
            BezierEase.prototype.bezierCalc = function (progress, x1, x2) {
                return ((this.bezierA(x1, x2) * progress + this.bezierB(x1, x2)) * progress + this.bezierC(x1)) * progress;
            };
            BezierEase.prototype.bezierA = function (x1, x2) {
                return 1.0 - 3.0 * x2 + 3.0 * x1;
            };
            BezierEase.prototype.bezierB = function (x1, x2) {
                return 3.0 * x2 - 6.0 * x1;
            };
            BezierEase.prototype.bezierC = function (x1) {
                return 3.0 * x1;
            };
            BezierEase.prototype.bezierX = function (x1, x2, progress, val) {
                var start = 0;
                var current = 1;
                for (; current !== 10 && val[current] <= progress; ++current) {
                    start += 0.1;
                }
                --current;
                var dist = (progress - val[current]) / (val[current + 1] - val[current]);
                var guessForT = start + dist * 0.1;
                var initialSlope = this.bezierSlope(guessForT, x1, x2);
                if (initialSlope >= 0.001) {
                    return this.bezierNewtonRaphsonIterate(progress, guessForT, x1, x2);
                }
                if (initialSlope === 0.0) {
                    return guessForT;
                }
                return this.bezierBinarySubdivide(progress, start, start + 0.1, x1, x2);
            };
            BezierEase.prototype.bezierSlope = function (progress, x1, x2) {
                return 3.0 * this.bezierA(x1, x2) * progress * progress + 2.0 * this.bezierB(x1, x2) * progress + this.bezierC(x1);
            };
            BezierEase.prototype.bezierNewtonRaphsonIterate = function (progress, guessForT, x1, x2) {
                for (var i = 0; i < 4; ++i) {
                    var currentSlope = this.bezierSlope(guessForT, x1, x2);
                    if (currentSlope === 0.0) {
                        return guessForT;
                    }
                    var currentX = this.bezierCalc(guessForT, x1, x2) - progress;
                    guessForT -= currentX / currentSlope;
                }
                return guessForT;
            };
            BezierEase.prototype.bezierBinarySubdivide = function (progress, a, b, x1, x2) {
                var currentX;
                var currentT;
                var i = 0;
                do {
                    currentT = a + (b - a) / 2.0;
                    currentX = this.bezierCalc(currentT, x1, x2) - progress;
                    if (currentX > 0.0) {
                        b = currentT;
                    }
                    else {
                        a = currentT;
                    }
                } while (Math.abs(currentX) > 0.0000001 && ++i < 10);
                return currentT;
            };
            return BezierEase;
        }());
        ease.BezierEase = BezierEase;
    })(ease = ps.ease || (ps.ease = {}));
})(ps || (ps = {}));
//# sourceMappingURL=BezierEase.js.map