var _svgPathExp = /[achlmqstvz]|(-?\d*\.?\d*(?:e[\-+]?\d+)?)[0-9]/ig;
var _scientific = /[\+\-]?\d*\.?\d+e[\+\-]?\d+/ig;
var _DEG2RAD = Math.PI / 180;
var sin = Math.sin;
var cos = Math.cos;
var abs = Math.abs;
var sqrt = Math.sqrt;
var ps;
(function (ps) {
    var ease;
    (function (ease) {
        var SvgPath = /** @class */ (function () {
            function SvgPath() {
            }
            SvgPath.stringToRawPath = function (d) {
                var a = (d + "").replace(_scientific, function (m) {
                    var n = +m;
                    return n < 0.0001 && n > -0.0001 ? 0 : n;
                }).match(_svgPathExp) || [];
                //some authoring programs spit out very small numbers in scientific notation like "1e-5", so make sure we round that down to 0 first.
                var path = [];
                var relativeX = 0;
                var relativeY = 0;
                var twoThirds = 2 / 3;
                var elements = a.length;
                var points = 0;
                var errorMessage = "ERROR: malformed path: " + d;
                var command;
                var isRelative;
                var segment;
                var startX;
                var startY;
                var difX;
                var difY;
                var line = function line(sx, sy, ex, ey) {
                    difX = (ex - sx) / 3;
                    difY = (ey - sy) / 3;
                    segment.push(sx + difX, sy + difY, ex - difX, ey - difY, ex, ey);
                };
                if (!d || !isNaN(a[0]) || isNaN(a[1])) {
                    console.log(errorMessage);
                    return path;
                }
                for (var i_1 = 0; i_1 < elements; i_1++) {
                    var prevCommand = command;
                    if (isNaN(a[i_1])) {
                        command = a[i_1].toUpperCase();
                        isRelative = command !== a[i_1]; //lower case means relative
                    }
                    else {
                        //commands like "C" can be strung together without any new command characters between.
                        i_1--;
                    }
                    var x = +a[i_1 + 1];
                    var y = +a[i_1 + 2];
                    if (isRelative) {
                        x += relativeX;
                        y += relativeY;
                    }
                    if (!i_1) {
                        startX = x;
                        startY = y;
                    } // "M" (move)
                    if (command === "M") {
                        if (segment) {
                            if (segment.length < 8) {
                                //if the path data was funky and just had a M with no actual drawing anywhere, skip it.
                                path.length -= 1;
                            }
                            else {
                                points += segment.length;
                            }
                        }
                        relativeX = startX = x;
                        relativeY = startY = y;
                        segment = [x, y];
                        path.push(segment);
                        i_1 += 2;
                        command = "L"; //an "M" with more than 2 values gets interpreted as "lineTo" commands ("L").
                        // "C" (cubic bezier)
                    }
                    else if (command === "C") {
                        if (!segment) {
                            segment = [0, 0];
                        }
                        if (!isRelative) {
                            relativeX = relativeY = 0;
                        } //note: "*1" is just a fast/short way to cast the value as a Number. WAAAY faster in Chrome, slightly slower in Firefox.
                        segment.push(x, y, relativeX + a[i_1 + 3] * 1, relativeY + a[i_1 + 4] * 1, relativeX += a[i_1 + 5] * 1, relativeY += a[i_1 + 6] * 1);
                        i_1 += 6; // "S" (continuation of cubic bezier)
                    }
                    else if (command === "S") {
                        difX = relativeX;
                        difY = relativeY;
                        if (prevCommand === "C" || prevCommand === "S") {
                            difX += relativeX - segment[segment.length - 4];
                            difY += relativeY - segment[segment.length - 3];
                        }
                        if (!isRelative) {
                            relativeX = relativeY = 0;
                        }
                        segment.push(difX, difY, x, y, relativeX += a[i_1 + 3] * 1, relativeY += a[i_1 + 4] * 1);
                        i_1 += 4; // "Q" (quadratic bezier)
                    }
                    else if (command === "Q") {
                        difX = relativeX + (x - relativeX) * twoThirds;
                        difY = relativeY + (y - relativeY) * twoThirds;
                        if (!isRelative) {
                            relativeX = relativeY = 0;
                        }
                        relativeX += a[i_1 + 3] * 1;
                        relativeY += a[i_1 + 4] * 1;
                        segment.push(difX, difY, relativeX + (x - relativeX) * twoThirds, relativeY + (y - relativeY) * twoThirds, relativeX, relativeY);
                        i_1 += 4; // "T" (continuation of quadratic bezier)
                    }
                    else if (command === "T") {
                        difX = relativeX - segment[segment.length - 4];
                        difY = relativeY - segment[segment.length - 3];
                        segment.push(relativeX + difX, relativeY + difY, x + (relativeX + difX * 1.5 - x) * twoThirds, y + (relativeY + difY * 1.5 - y) * twoThirds, relativeX = x, relativeY = y);
                        i_1 += 2; // "H" (horizontal line)
                    }
                    else if (command === "H") {
                        line(relativeX, relativeY, relativeX = x, relativeY);
                        i_1 += 1; // "V" (vertical line)
                    }
                    else if (command === "V") {
                        //adjust values because the first (and only one) isn't x in this case, it's y.
                        line(relativeX, relativeY, relativeX, relativeY = x + (isRelative ? relativeY - relativeX : 0));
                        i_1 += 1; // "L" (line) or "Z" (close)
                    }
                    else if (command === "L" || command === "Z") {
                        if (command === "Z") {
                            x = startX;
                            y = startY;
                            // segment.closed = true;
                        }
                        if (command === "L" || abs(relativeX - x) > 0.5 || abs(relativeY - y) > 0.5) {
                            line(relativeX, relativeY, x, y);
                            if (command === "L") {
                                i_1 += 2;
                            }
                        }
                        relativeX = x;
                        relativeY = y; // "A" (arc)
                    }
                    else if (command === "A") {
                        var flag1 = a[i_1 + 4];
                        var flag2 = a[i_1 + 5];
                        var difX_1 = a[i_1 + 6];
                        var difY_1 = a[i_1 + 7];
                        var j = 7;
                        if (flag1.length > 1) {
                            // for cases when the flags are merged, like "a8 8 0 018 8" (the 0 and 1 flags are WITH the x value of 8, but it could also be "a8 8 0 01-8 8" so it may include x or not)
                            if (flag1.length < 3) {
                                difY_1 = difX_1;
                                difX_1 = flag2;
                                j--;
                            }
                            else {
                                difY_1 = flag2;
                                difX_1 = flag1.substr(2);
                                j -= 2;
                            }
                            flag2 = flag1.charAt(1);
                            flag1 = flag1.charAt(0);
                        }
                        var beziers = SvgPath.arcToSegment(relativeX, relativeY, +a[i_1 + 1], +a[i_1 + 2], +a[i_1 + 3], +flag1, +flag2, (isRelative ? relativeX : 0) + difX_1 * 1, (isRelative ? relativeY : 0) + difY_1 * 1);
                        i_1 += j;
                        if (beziers) {
                            for (j = 0; j < beziers.length; j++) {
                                segment.push(beziers[j]);
                            }
                        }
                        relativeX = segment[segment.length - 2];
                        relativeY = segment[segment.length - 1];
                    }
                    else {
                        console.log(errorMessage);
                    }
                }
                var i = segment.length;
                if (i < 6) {
                    //in case there's odd SVG like a M0,0 command at the very end.
                    path.pop();
                    i = 0;
                }
                else if (segment[0] === segment[i - 2] && segment[1] === segment[i - 1]) {
                    // segment.closed = true;
                }
                // path.totalPoints = points + i;
                return path;
            };
            SvgPath.arcToSegment = function (lastX, lastY, rx, ry, angle, largeArcFlag, sweepFlag, x, y) {
                if (lastX === x && lastY === y)
                    return null;
                rx = abs(rx);
                ry = abs(ry);
                var angleRad = angle % 360 * _DEG2RAD;
                var cosAngle = cos(angleRad);
                var sinAngle = sin(angleRad);
                var PI = Math.PI;
                var TWOPI = PI * 2;
                var dx2 = (lastX - x) / 2;
                var dy2 = (lastY - y) / 2;
                var x1 = cosAngle * dx2 + sinAngle * dy2;
                var y1 = -sinAngle * dx2 + cosAngle * dy2;
                var x1_sq = x1 * x1;
                var y1_sq = y1 * y1;
                var radiiCheck = x1_sq / (rx * rx) + y1_sq / (ry * ry);
                if (radiiCheck > 1) {
                    rx = sqrt(radiiCheck) * rx;
                    ry = sqrt(radiiCheck) * ry;
                }
                var rx_sq = rx * rx;
                var ry_sq = ry * ry;
                var sq = (rx_sq * ry_sq - rx_sq * y1_sq - ry_sq * x1_sq) / (rx_sq * y1_sq + ry_sq * x1_sq);
                if (sq < 0) {
                    sq = 0;
                }
                var coef = (largeArcFlag === sweepFlag ? -1 : 1) * sqrt(sq);
                var cx1 = coef * (rx * y1 / ry);
                var cy1 = coef * -(ry * x1 / rx);
                var sx2 = (lastX + x) / 2;
                var sy2 = (lastY + y) / 2;
                var cx = sx2 + (cosAngle * cx1 - sinAngle * cy1);
                var cy = sy2 + (sinAngle * cx1 + cosAngle * cy1);
                var ux = (x1 - cx1) / rx;
                var uy = (y1 - cy1) / ry;
                var vx = (-x1 - cx1) / rx;
                var vy = (-y1 - cy1) / ry;
                var temp = ux * ux + uy * uy;
                var angleStart = (uy < 0 ? -1 : 1) * Math.acos(ux / sqrt(temp));
                var angleExtent = (ux * vy - uy * vx < 0 ? -1 : 1) * Math.acos((ux * vx + uy * vy) / sqrt(temp * (vx * vx + vy * vy)));
                isNaN(angleExtent) && (angleExtent = PI); //rare edge case. Math.cos(-1) is NaN.
                if (!sweepFlag && angleExtent > 0) {
                    angleExtent -= TWOPI;
                }
                else if (sweepFlag && angleExtent < 0) {
                    angleExtent += TWOPI;
                }
                angleStart %= TWOPI;
                angleExtent %= TWOPI;
                var segments = Math.ceil(abs(angleExtent) / (TWOPI / 4));
                var rawPath = [];
                var angleIncrement = angleExtent / segments;
                var controlLength = 4 / 3 * sin(angleIncrement / 2) / (1 + cos(angleIncrement / 2));
                var ma = cosAngle * rx;
                var mb = sinAngle * rx;
                var mc = sinAngle * -ry;
                var md = cosAngle * ry;
                for (var i = 0; i < segments; i++) {
                    angle = angleStart + i * angleIncrement;
                    x1 = cos(angle);
                    y1 = sin(angle);
                    ux = cos(angle += angleIncrement);
                    uy = sin(angle);
                    rawPath.push(x1 - controlLength * y1, y1 + controlLength * x1, ux + controlLength * uy, uy - controlLength * ux, ux, uy);
                } //now transform according to the actual size of the ellipse/arc (the beziers were noramlized, between 0 and 1 on a circle).
                for (var i = 0; i < rawPath.length; i += 2) {
                    x1 = rawPath[i];
                    y1 = rawPath[i + 1];
                    rawPath[i] = x1 * ma + y1 * mc + cx;
                    rawPath[i + 1] = x1 * mb + y1 * md + cy;
                }
                var length = rawPath.length;
                rawPath[length - 2] = x; //always set the end to exactly where it's supposed to be
                rawPath[length - 1] = y;
                return rawPath;
            };
            return SvgPath;
        }());
        ease.SvgPath = SvgPath;
    })(ease = ps.ease || (ps.ease = {}));
})(ps || (ps = {}));
//# sourceMappingURL=SvgPath.js.map