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
    var utils;
    (function (utils) {
        // 播放声音
        function playSound(soundName) {
            if (soundName) {
                var nodeAudio = UIRoot.getChild(soundName);
                if (nodeAudio && (ps.AudioTrigger === null || ps.AudioTrigger === void 0 ? void 0 : ps.AudioTrigger.playSound)) {
                    ps.AudioTrigger.playSound(nodeAudio, true, false, 1);
                }
                else {
                    ps.Audio.playSound(soundName);
                }
            }
        }
        utils.playSound = playSound;
        // 抛出异常
        function debugAssert(cond) {
            var data = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                data[_i - 1] = arguments[_i];
            }
            if (ps.ENV === "DEBUG") {
                console.assert.apply(console, __spreadArray([cond], __read(data), false));
            }
        }
        utils.debugAssert = debugAssert;
        // 翻卡牌
        function changeCard(open, close) {
            close.scaleX = 0;
            close.visible = true;
            open.scaleX = 1;
            close.visible = true;
            gsap.to(open, { scaleX: 0, duration: 0.1, ease: 'none' }).then(function () {
                open.visible = false;
                gsap.to(close, {
                    scaleX: 1, duration: 0.1, ease: 'none'
                });
            });
        }
        utils.changeCard = changeCard;
    })(utils = ps.utils || (ps.utils = {}));
})(ps || (ps = {}));
//# sourceMappingURL=Utils.js.map