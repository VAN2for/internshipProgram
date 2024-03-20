var ps;
(function (ps) {
    var ease;
    (function (ease) {
        ;
        var _bigNum = 1e20;
        var _numExp = /[-+=\.]*\d+[\.e\-\+]*\d*[e\-\+]*\d*/gi;
        // finds any numbers, including ones that start with += or -=, negative numbers, and ones in scientific notation like 1e-8.
        var _needsParsingExp = /[cLlsSaAhHvVtTqQ]/g;
        var SvgPathEase = /** @class */ (function () {
            function SvgPathEase(data) {
                this.easeFunc = this.initData(data);
            }
            SvgPathEase.create = function (data) {
                return new SvgPathEase(data).easeFunc;
            };
            SvgPathEase.prototype.initData = function (data, config) {
                if (data === void 0) { data = "0,0,1,1"; }
                if (config === void 0) { config = { precision: 1, height: undefined, originY: undefined }; }
                var values = data.match(_numExp);
                var closest = 1;
                var points = [];
                var lookup = [];
                var precision = config.precision || 1;
                var fast = precision <= 1;
                if (_needsParsingExp.test(data) || ~data.indexOf("M") && data.indexOf("C") < 0) {
                    values = ease.SvgPath.stringToRawPath(data)[0];
                }
                var length = values.length;
                if (length === 4) {
                    values.unshift(0, 0);
                    values.push(1, 1);
                    length = 8;
                }
                else if ((length - 2) % 6) {
                    throw "Invalid CustomEase";
                }
                if (+values[0] !== 0 || +values[length - 2] !== 1) {
                    this.normalize(values, config.height, config.originY);
                }
                for (var i = 2; i < length; i += 6) {
                    var a1 = { x: +values[i - 2], y: +values[i - 1] };
                    var a2 = { x: +values[i + 4], y: +values[i + 5] };
                    points.push(a1, a2);
                    this.bezierToPoints(a1.x, a1.y, +values[i], +values[i + 1], +values[i + 2], +values[i + 3], a2.x, a2.y, 1 / (precision * 200000), points, points.length - 1);
                }
                length = points.length;
                for (var i = 0; i < length; i++) {
                    var point_1 = points[i];
                    var prevPoint = points[i - 1] || point_1;
                    if ((point_1.x > prevPoint.x || prevPoint.y !== point_1.y && prevPoint.x === point_1.x || point_1 === prevPoint) && point_1.x <= 1) {
                        //if a point goes BACKWARD in time or is a duplicate, just drop it. Also it shouldn't go past 1 on the x axis, as could happen in a string like "M0,0 C0,0 0.12,0.68 0.18,0.788 0.195,0.845 0.308,1 0.32,1 0.403,1.005 0.398,1 0.5,1 0.602,1 0.816,1.005 0.9,1 0.91,1 0.948,0.69 0.962,0.615 1.003,0.376 1,0 1,0".
                        prevPoint.cx = point_1.x - prevPoint.x; //change in x between this point and the next point (performance optimization)
                        prevPoint.cy = point_1.y - prevPoint.y;
                        prevPoint.n = point_1;
                        prevPoint.nx = point_1.x; //next point's x value (performance optimization, making lookups faster in getRatio()). Remember, the lookup will always land on a spot where it's either this point or the very next one (never beyond that)
                        if (fast && i > 1 && Math.abs(prevPoint.cy / prevPoint.cx - points[i - 2].cy / points[i - 2].cx) > 2) {
                            //if there's a sudden change in direction, prioritize accuracy over speed. Like a bounce ease - you don't want to risk the sampling chunks landing on each side of the bounce anchor and having it clipped off.
                            fast = false;
                        }
                        if (prevPoint.cx < closest) {
                            if (!prevPoint.cx) {
                                prevPoint.cx = 0.001; //avoids math problems in getRatio() (dividing by zero)
                                if (i === length - 1) {
                                    //in case the final segment goes vertical RIGHT at the end, make sure we end at the end.
                                    prevPoint.x -= 0.001;
                                    closest = Math.min(closest, 0.001);
                                    fast = false;
                                }
                            }
                            else {
                                closest = prevPoint.cx;
                            }
                        }
                    }
                    else {
                        points.splice(i--, 1);
                        length--;
                    }
                }
                length = 1 / closest + 1 | 0;
                var inc = 1 / length;
                var j = 0;
                var point = points[0];
                if (fast) {
                    var a1 = void 0;
                    for (var i = 0; i < length; i++) {
                        //for fastest lookups, we just sample along the path at equal x (time) distance. Uses more memory and is slightly less accurate for anchors that don't land on the sampling points, but for the vast majority of eases it's excellent (and fast).
                        var p = i * inc;
                        if (point.nx < p) {
                            point = points[++j];
                        }
                        a1 = point.y + (p - point.x) / point.cx * point.cy;
                        lookup[i] = { x: p, cx: inc, y: a1, cy: 0, nx: 9 };
                        if (i) { // check i is not 0
                            lookup[i - 1].cy = a1 - lookup[i - 1].y;
                        }
                    }
                    lookup[length - 1].cy = points[points.length - 1].y - a1;
                }
                else {
                    //this option is more accurate, ensuring that EVERY anchor is hit perfectly. Clipping across a bounce, for example, would never happen.
                    for (var i = 0; i < length; i++) {
                        //build a lookup table based on the smallest distance so that we can instantly find the appropriate point (well, it'll either be that point or the very next one). We'll look up based on the linear progress. So it's it's 0.5 and the lookup table has 100 elements, it'd be like lookup[Math.floor(0.5 * 100)]
                        if (point.nx < i * inc) {
                            point = points[++j];
                        }
                        lookup[i] = point;
                    }
                    if (j < points.length - 1) {
                        lookup[length - 1] = points[points.length - 2];
                    }
                } //this._calcEnd = (points[points.length-1].y !== 1 || points[0].y !== 0); //ensures that we don't run into floating point errors. As long as we're starting at 0 and ending at 1, tell GSAP to skip the final calculation and use 0/1 as the factor.
                return function (p) {
                    var point = lookup[p * length | 0] || lookup[length - 1];
                    if (point.nx < p) {
                        point = point.n;
                    }
                    return point.y + (p - point.x) / point.cx * point.cy;
                };
            };
            SvgPathEase.prototype.findMinimum = function (values) {
                var l = values.length;
                var min = _bigNum;
                for (var i = 1; i < l; i += 6) {
                    +values[i] < min && (min = +values[i]);
                }
                return min;
            };
            SvgPathEase.prototype.normalize = function (values, height, originY) {
                if (!originY && originY !== 0) {
                    originY = Math.max(+values[values.length - 1], +values[1]);
                }
                var tx = +values[0] * -1;
                var ty = -originY;
                var l = values.length;
                var sx = 1 / (+values[l - 2] + tx);
                var sy = -height || (Math.abs(+values[l - 1] - +values[1]) < 0.01 * (+values[l - 2] - +values[0]) ? this.findMinimum(values) + ty : +values[l - 1] + ty);
                if (sy) {
                    //typically y ends at 1 (so that the end values are reached)
                    sy = 1 / sy;
                }
                else {
                    //in case the ease returns to its beginning value, scale everything proportionally
                    sy = -sx;
                }
                for (var i = 0; i < l; i += 2) {
                    values[i] = (+values[i] + tx) * sx;
                    values[i + 1] = (+values[i + 1] + ty) * sy;
                }
            };
            SvgPathEase.prototype.bezierToPoints = function (x1, y1, x2, y2, x3, y3, x4, y4, threshold, points, index) {
                var x12 = (x1 + x2) / 2;
                var y12 = (y1 + y2) / 2;
                var x23 = (x2 + x3) / 2;
                var y23 = (y2 + y3) / 2;
                var x34 = (x3 + x4) / 2;
                var y34 = (y3 + y4) / 2;
                var x123 = (x12 + x23) / 2;
                var y123 = (y12 + y23) / 2;
                var x234 = (x23 + x34) / 2;
                var y234 = (y23 + y34) / 2;
                var x1234 = (x123 + x234) / 2;
                var y1234 = (y123 + y234) / 2;
                var dx = x4 - x1;
                var dy = y4 - y1;
                var d2 = Math.abs((x2 - x4) * dy - (y2 - y4) * dx);
                var d3 = Math.abs((x3 - x4) * dy - (y3 - y4) * dx);
                if (!points) {
                    points = [{ x: x1, y: y1 }, { x: x4, y: y4 }];
                    index = 1;
                }
                points.splice(index || points.length - 1, 0, { x: x1234, y: y1234 });
                if ((d2 + d3) * (d2 + d3) > threshold * (dx * dx + dy * dy)) {
                    var length_1 = points.length;
                    this.bezierToPoints(x1, y1, x12, y12, x123, y123, x1234, y1234, threshold, points, index);
                    this.bezierToPoints(x1234, y1234, x234, y234, x34, y34, x4, y4, threshold, points, index + 1 + (points.length - length_1));
                }
                return points;
            };
            return SvgPathEase;
        }());
        ease.SvgPathEase = SvgPathEase;
    })(ease = ps.ease || (ps.ease = {}));
})(ps || (ps = {}));
//# sourceMappingURL=SvgPathEase.js.map