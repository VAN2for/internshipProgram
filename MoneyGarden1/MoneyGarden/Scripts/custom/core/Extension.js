/**
 * @author hubluesky
 * @see Func
 * @todo If have any questions, just call me.
 */
//----------------------------------------------------------------------------------------------------------------------------------------------------------------
// Math
Math.TwoPI = Math.PI * 2;
Math.DegreeToRadian = Math.PI / 180;
Math.RadianToDegree = 1 / Math.PI * 180;
Math.minmax = function (min, max, value) {
    return Math.min(max, Math.max(min, value));
};
Math.randomSign = function () {
    return Math.random() < 0.5 ? +1 : -1;
};
Math.randomRange = function (min, max) {
    return min + Math.random() * (max - min);
};
Math.randomIntRange = function (min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
};
Math.randomIntBetween = function (start, end) {
    return Math.floor(Math.random() * (end - start + 1)) + start;
};
Math.randomArrayValue = function (array) {
    var index = Math.randomIntRange(0, array.length);
    return array[index];
};
Math.randomArrayValues = function (array, count) {
    if (count === void 0) { count = array.length; }
    count = Math.min(count, array.length);
    var temp = Array.from(array);
    var result = [];
    for (var i = 0; i < count; i++) {
        var index = Math.randomIntRange(0, temp.length);
        result.push(temp[index]);
        temp.splice(index, 1);
    }
    return result;
};
Math.lerp = function (start, end, t) {
    // return start * (1.0 - t) + end * t;
    return (end - start) * t + start;
};
Math.damp = function (source, target, lambda, delayTime) {
    return Math.lerp(source, target, 1 - Math.exp(-lambda * delayTime));
};
Math.deltaAngle = function (current, target) {
    var d = (target - current) % 360;
    return d > 180 ? d - 360 : d < -180 ? d + 360 : d;
};
Math.dampAngle = function (current, target, smoothingTime, maxSpeed, delayTime) {
    var a = Math.deltaAngle(current, target);
    smoothingTime *= 0.2;
    if (delayTime < smoothingTime)
        a = Math.lerp(0, a, delayTime / smoothingTime);
    maxSpeed *= delayTime;
    if (a > maxSpeed)
        a = maxSpeed;
    else if (a < -maxSpeed)
        a = -maxSpeed;
    return (current + a) % 360;
};
Math.inverseLerp = function (min, max, value) {
    if (Math.abs(max - min) < 0.001)
        return min;
    return (value - min) / (max - min);
};
Math.clamp = function (value, min, max) {
    return value < min ? min : value > max ? max : value;
};
Math.saturate = function (value) {
    return Math.clamp(value, 0, 1);
};
Math.fraction = function (angle) {
    return angle - Math.trunc(angle);
};
Math.mergeInterval = function (high, low) {
    return high << 16 | low & 0xFFFF;
};
Math.splitInterval = function (value) {
    return { high: value >> 16, low: value & 0xFFFF };
};
Math.naturalToInteger = function (index) {
    var half = (index + 1) * 0.5;
    var fixed = Math.trunc(half);
    var sign = (half - fixed) * 4 - 1;
    return fixed * sign;
};
Math.toHash = function (str) {
    // from https://github.com/darkskyapp/string-hash/blob/master/index.js
    var hash = 5381, i = str.length;
    while (i)
        hash = (hash * 33) ^ str.charCodeAt(--i);
    /* JavaScript does bitwise operations (like XOR, above) on 32-bit signed
     * integers. Since we want the results to be always positive, convert the
     * signed int to an unsigned by doing an unsigned bitshift. */
    return hash >>> 0;
};
// Date
Date.getTimeSeconds = function () {
    return Date.now() / 1000;
};
// Array
// Array.prototype.first = function <T>(this: T[]): T | null {
//     return this.length > 0 ? this[0] : null;
// }
// Array.prototype.last = function <T>(this: T[]): T | null {
//     return this.length > 0 ? this[this.length - 1] : null;
// }
// Array.prototype.isEmpty = function <T>(this: T[]): boolean {
//     return this.length == 0;
// }
// Array.prototype.erase = function <T>(this: T[], item: T): T {
//     let index = this.indexOf(item);
//     if (index == -1) return null;
//     return this.splice(index, 1)[0];
// }
// Array.prototype.removeAt = function <T>(this: T[], index: number): T {
//     return this.splice(index, 1)[0];
// }
// Array.prototype.contains = function <T>(this: T[], item: T): boolean {
//     return this.indexOf(item) != -1;
// }
// Array.prototype.clear = function <T>(this: T[]): void {
//     this.length = 0;
// }
// String
String.isEmptyOrNull = function (value) {
    return value == null || value == "";
};
String.format = function (format) {
    var params = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        params[_i - 1] = arguments[_i];
    }
    return format.replace(/{(\d+)}/g, function (match, number) {
        return typeof params[number] != 'undefined' ? params[number] : match;
    });
};
// Object
Object.createInstance = function (prototype) {
    var newInstance = Object.create(prototype);
    return newInstance.constructor.apply(newInstance);
};
Object.createClass = function (className) {
    var params = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        params[_i - 1] = arguments[_i];
    }
    var newClass = new window[className](params);
    return newClass;
    // let instance = Object.create(window[className].prototype);
    // instance.constructor.apply(instance, params);
    // return instance;
};
Object.hasProperty = function (instance, property) {
    return property in instance;
};
/**
 *  有些比较老的版本或者机器没有values函数，这里把它补上。
 */
if (Object["values"] == null) {
    Object["values"] = function (o) {
        return Object.keys(o).map(function (key) { return o[key]; });
    };
}
// Function
Function.prototype.before = function (func) {
    var __self = this;
    return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (func.apply(this, args) === false)
            return undefined;
        return __self.apply(this, args);
    };
};
Function.prototype.after = function (func) {
    var __self = this;
    return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var result = __self.apply(this, args);
        return func.apply(this, args) || result;
    };
};
//---------------------------------------------------------------------------------------------------------------------------
