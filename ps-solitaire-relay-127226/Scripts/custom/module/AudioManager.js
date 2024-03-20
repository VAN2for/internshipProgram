var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
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
var base64decode = function (base64) {
    var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    var lookup = new Uint8Array(256);
    for (var i = 0; i < chars.length; i++) {
        lookup[chars.charCodeAt(i)] = i;
    }
    var bufferLength = base64.length * 0.75;
    var len = base64.length;
    var p = 0;
    var encoded1 = 0;
    var encoded2 = 0;
    var encoded3 = 0;
    var encoded4 = 0;
    if (base64[base64.length - 1] === "=") {
        bufferLength--;
        if (base64[base64.length - 2] === "=") {
            bufferLength--;
        }
    }
    var arraybuffer = new ArrayBuffer(bufferLength), bytes = new Uint8Array(arraybuffer);
    for (var i = 0; i < len; i += 4) {
        encoded1 = lookup[base64.charCodeAt(i)];
        encoded2 = lookup[base64.charCodeAt(i + 1)];
        encoded3 = lookup[base64.charCodeAt(i + 2)];
        encoded4 = lookup[base64.charCodeAt(i + 3)];
        bytes[p++] = (encoded1 << 2) | (encoded2 >> 4);
        bytes[p++] = ((encoded2 & 15) << 4) | (encoded3 >> 2);
        bytes[p++] = ((encoded3 & 3) << 6) | (encoded4 & 63);
    }
    return arraybuffer;
};
function httpLoadAsset(url, onComplete) {
    var xhr = new XMLHttpRequest();
    var errInfo = "download failed: ".concat(url, ", status: ");
    xhr.open("GET", url, true);
    xhr.responseType = "arraybuffer";
    xhr.onload = function () {
        if (xhr.status === 200 || xhr.status === 0) {
            if (onComplete) {
                onComplete(null, xhr.response);
            }
        }
        else if (onComplete) {
            onComplete(new Error("".concat(errInfo).concat(xhr.status, "(no response)")));
        }
    };
    xhr.onerror = function () {
        if (onComplete) {
            onComplete(new Error("".concat(errInfo).concat(xhr.status, "(error)")));
        }
    };
    xhr.ontimeout = function () {
        if (onComplete) {
            onComplete(new Error("".concat(errInfo).concat(xhr.status, "(time out)")));
        }
    };
    xhr.onabort = function () {
        if (onComplete) {
            onComplete(new Error("".concat(errInfo).concat(xhr.status, "(abort)")));
        }
    };
    xhr.send(null);
}
function loadAudioClip(url, onComplete) {
    if (globalThis.hasBase64 && globalThis.hasBase64() && globalThis.getAssestByUrl) {
        var base64 = globalThis.getAssestByUrl(url);
        if (base64 != null)
            onComplete(undefined, base64decode(base64));
    }
    else if (globalThis.assetsPackage) {
        var urlkey = url.split("/");
        var houzhui = urlkey[urlkey.length - 1];
        houzhui = houzhui.replace(".", "_");
        var base64 = globalThis.assetsPackage[houzhui];
        if (base64 != null)
            onComplete(undefined, base64decode(base64));
    }
    else {
        httpLoadAsset(url, onComplete);
    }
}
function onGestureClicked(callback) {
    var _a;
    var canvas = (_a = document.getElementById("GameCanvas")) !== null && _a !== void 0 ? _a : document;
    if (canvas == null)
        console.error("Can not find document or canvas in your browser");
    var onGesture = function () {
        canvas.removeEventListener("touchstart", onGesture);
        canvas.removeEventListener("touchend", onGesture);
        canvas.removeEventListener("mousedown", onGesture);
        callback === null || callback === void 0 ? void 0 : callback();
    };
    canvas.addEventListener("touchstart", onGesture, { once: true });
    canvas.addEventListener("touchend", onGesture, { once: true });
    canvas.addEventListener("mousedown", onGesture, { once: true });
}
/**
 * 音频组合器
 * 使用示例
 * ``` ts
    let audioAssembler = new AudioAssembler(audioContext, audioBuffer);
    var analyser = audioAssembler.addAudioNode(audioContext.createAnalyser());
    var analyser2 = audioAssembler.addAudioNode(audioContext.createAnalyser());
    var gain = audioAssembler.addAudioNode(audioContext.createGain());

    analyser.fftSize = 128;
    analyser2.fftSize = 2048;
    analyser2.smoothingTimeConstant = 1;
    gain.gain.linearRampToValueAtTime(1, 3);
    audioAssembler.play(true, 1);
 * ```
 */
var AudioAssembler = /** @class */ (function () {
    function AudioAssembler(audioContext, audioBuffer, onCompleted) {
        this.audioContext = audioContext;
        this.audioBuffer = audioBuffer;
        this.onCompleted = onCompleted;
        this.assemblerList = [];
    }
    AudioAssembler.prototype.createBufferSource = function () {
        var _this = this;
        this.audioSourceNode = this.audioContext.createBufferSource();
        this.audioSourceNode.buffer = this.audioBuffer;
        this.audioSourceNode.onended = function () {
            var _a;
            if (_this.pausedAt == null)
                _this.startedAt = null;
            (_a = _this.onCompleted) === null || _a === void 0 ? void 0 : _a.call(_this);
        };
    };
    AudioAssembler.prototype.addAudioNode = function (audioNode) {
        this.assemblerList.push(audioNode);
        return audioNode;
    };
    AudioAssembler.prototype.getAudioNode = function (classType) {
        var e_1, _a;
        try {
            for (var _b = __values(this.assemblerList), _c = _b.next(); !_c.done; _c = _b.next()) {
                var assembler = _c.value;
                if (assembler instanceof classType)
                    return assembler;
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
    };
    AudioAssembler.prototype.removeAudioNode = function (audioNode) {
        var index = this.assemblerList.indexOf(audioNode);
        if (index != -1)
            this.assemblerList.splice(index, 1);
    };
    AudioAssembler.prototype.play = function (loop, playbackRate, startOffset) {
        var e_2, _a;
        if (loop === void 0) { loop = false; }
        if (playbackRate === void 0) { playbackRate = 1; }
        if (startOffset === void 0) { startOffset = 0; }
        if (this.startedAt != null)
            return;
        this.createBufferSource();
        var lastAudioNode = this.audioSourceNode;
        try {
            for (var _b = __values(this.assemblerList), _c = _b.next(); !_c.done; _c = _b.next()) {
                var audioNode = _c.value;
                lastAudioNode = lastAudioNode.connect(audioNode);
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_2) throw e_2.error; }
        }
        lastAudioNode.connect(ps.audioManager.assemblerGain);
        this.audioSourceNode.loop = loop;
        this.audioSourceNode.playbackRate.value = playbackRate;
        this.audioSourceNode.start(0, startOffset);
        this.startedAt = this.audioContext.currentTime - startOffset;
    };
    AudioAssembler.prototype.pause = function () {
        if (this.startedAt == null || this.pausedAt != null)
            return;
        this.pausedAt = this.audioContext.currentTime;
        this.audioSourceNode.disconnect();
        this.audioSourceNode.stop();
    };
    AudioAssembler.prototype.resume = function () {
        if (this.pausedAt == null || this.audioBuffer == null)
            return;
        var lastDuration = this.pausedAt - this.startedAt;
        this.startedAt = this.pausedAt = null;
        this.play(this.audioSourceNode.loop, this.audioSourceNode.playbackRate.value, lastDuration % this.audioBuffer.duration);
    };
    AudioAssembler.prototype.stop = function () {
        var e_3, _a;
        if (this.startedAt == null && this.pausedAt == null)
            return;
        try {
            for (var _b = __values(this.assemblerList), _c = _b.next(); !_c.done; _c = _b.next()) {
                var audioNode = _c.value;
                audioNode.disconnect();
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_3) throw e_3.error; }
        }
        this.audioSourceNode.disconnect();
        this.audioSourceNode.stop();
        this.startedAt = this.pausedAt = null;
    };
    return AudioAssembler;
}());
var AudioManager = /** @class */ (function () {
    function AudioManager() {
        this.version = "v2.0.0";
        this.audioAssets = new Map();
        this._audioRootPath = 'resource/';
        this._musicVolume = 1;
        this._effectVolume = 1;
        this._assemblerVolume = 1;
        this._enableSounds = true;
        this.stopSoundByLogicMap = new Map();
        this.soundStartAt = new Map();
        this.soundPauseAt = new Map();
        this.soundTotalRepeatTimes = new Map();
        this.soundHasRepeatTimes = new Map();
        this.soundOnComplete = new Map();
        this.soundPlaying = new Map();
        this.hasInitialize = false;
    }
    Object.defineProperty(AudioManager.prototype, "audioRootPath", {
        get: function () { return this._audioRootPath; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AudioManager.prototype, "audioContext", {
        get: function () { return this._audioContext; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AudioManager.prototype, "music", {
        get: function () { return this._music; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AudioManager.prototype, "musicGain", {
        get: function () { return this._musicGain; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AudioManager.prototype, "musicAudioBuffer", {
        get: function () { return this._musicAudioBuffer; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AudioManager.prototype, "effectGain", {
        get: function () { return this._effectGain; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AudioManager.prototype, "assemblerGain", {
        get: function () { return this._assemblerGain; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AudioManager.prototype, "musicVolume", {
        /** 音乐的音量 */
        get: function () { return this._musicVolume; },
        set: function (value) {
            this._musicVolume = value;
            this.setVolume(this.musicGain, value);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AudioManager.prototype, "effectVolume", {
        /** 音效的音量 */
        get: function () { return this._effectVolume; },
        set: function (value) {
            this._effectVolume = value;
            this.setVolume(this.effectGain, value);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AudioManager.prototype, "assemblerVolume", {
        /** 混合器的音量 */
        get: function () {
            return this._assemblerVolume;
        },
        set: function (value) {
            this._assemblerVolume = value;
            this.setVolume(this.assemblerGain, value);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AudioManager.prototype, "enableSounds", {
        /** 开关所有声音 @deprecated 此接口名可能会改 */
        get: function () { return this._enableSounds; },
        set: function (value) {
            if (this._enableSounds == value)
                return;
            this._enableSounds = value;
            this.setVolume(this.musicGain, value ? this.musicVolume : 0);
            this.setVolume(this.effectGain, value ? this.effectVolume : 0);
            this.setVolume(this.assemblerGain, value ? this.assemblerVolume : 0);
        },
        enumerable: false,
        configurable: true
    });
    AudioManager.prototype.initialize = function (audioRootPath) {
        var _this = this;
        if (audioRootPath === void 0) { audioRootPath = "audio/"; }
        if (this.hasInitialize) {
            // 防止多次initialize
            return;
        }
        this.hasInitialize = true;
        this._audioRootPath = audioRootPath;
        try {
            this._audioContext = new (globalThis.AudioContext || globalThis.webkitAudioContext || globalThis.mozAudioContext)();
        }
        catch (error) {
            console.error("Your browser does not support AudioContext", error);
        }
        this._musicGain = this.audioContext.createGain();
        this.musicGain.connect(this.audioContext.destination);
        this._effectGain = this.audioContext.createGain();
        this.effectGain.connect(this.audioContext.destination);
        this._assemblerGain = this.audioContext.createGain();
        this.assemblerGain.connect(this.audioContext.destination);
        this.checkVisibilitychange(function (hidden) {
            if (hidden) {
                _this.audioContext.suspend();
            }
            else {
                // IOS14 resume is bad, has not callback immediately
                var resume_1 = function () {
                    var handle = setTimeout(resume_1, 50);
                    _this.audioContext.resume().then(function () { return clearTimeout(handle); });
                };
                resume_1();
            }
        });
    };
    AudioManager.prototype.checkVisibilitychange = function (callback) {
        function onChange() { var _a, _b, _c; callback((_c = (_b = (_a = document.hidden) !== null && _a !== void 0 ? _a : document["mozHidden"]) !== null && _b !== void 0 ? _b : document["webkitHidden"]) !== null && _c !== void 0 ? _c : document["msHidden"]); }
        // Standards:
        if ((document === null || document === void 0 ? void 0 : document.hidden) != void 0)
            document.addEventListener("visibilitychange", onChange);
        else if ("mozHidden" in document)
            document.addEventListener("mozvisibilitychange", onChange);
        else if ("webkitHidden" in document)
            document.addEventListener("webkitvisibilitychange", onChange);
        else if ("msHidden" in document)
            document.addEventListener("msvisibilitychange", onChange);
        // IE 9 and lower:
        else if ("onfocusin" in document)
            document["onfocusin"] = document["onfocusout"] = onChange;
        // All others:
        else
            window.onpageshow = window.onpagehide = window.onfocus = window.onblur = onChange;
    };
    /**
     * 等待context可运行
     * @returns
     */
    AudioManager.prototype.runContext = function () {
        var _this = this;
        return new Promise(function (resolve) {
            var context = _this.audioContext;
            if (!context.resume)
                return resolve();
            if (context.state === 'running')
                return resolve();
            context.resume().catch(function (e) { return console.warn("runContext resume", e); });
            if (context.state !== 'running') {
                // promise rejection cannot be caught, need to check running state again
                onGestureClicked(function () {
                    context.resume().then(resolve).catch(function (e) { return console.warn("runContext onGesture", e); });
                });
            }
        });
    };
    /**
     * 设置声音音量
     * @param gain 声音gain对象
     * @param volume 音量（范围0~1）
     */
    AudioManager.prototype.setVolume = function (gain, volume) {
        if (!gain || !gain.gain)
            return;
        if (gain.gain.setTargetAtTime) {
            try {
                gain.gain.setTargetAtTime(volume, this.audioContext.currentTime, 0);
            }
            catch (e) {
                // Some unknown browsers may crash if timeConstant is 0
                gain.gain.setTargetAtTime(volume, this.audioContext.currentTime, 0.01);
            }
        }
        else {
            gain.gain.value = volume;
        }
    };
    /**
     * 播放音乐，音乐默认是循环播放。音乐永远只有一个，如果重复调用，会停止旧的音乐。
     * @param audioPath
     * @param onCompleted
     * @returns 返回音频ID
     */
    AudioManager.prototype.playMusic = function (audioPath, onCompleted) {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        this.stopMusic();
                        _a = this;
                        return [4 /*yield*/, this.loadAudioBuffer(audioPath)];
                    case 1:
                        _a._musicAudioBuffer = _b.sent();
                        this.musicPath = this.audioRootPath + audioPath;
                        return [2 /*return*/, this.playMusicByAudioBuffer(this.musicAudioBuffer, 0, onCompleted)];
                }
            });
        });
    };
    /**
      * 播放背景音乐
      * @param audioBuffer audioBuffer
      * @param startOffset
      * @param onCompleted
      * @returns
      */
    AudioManager.prototype.playMusicByAudioBuffer = function (audioBuffer, startOffset, onCompleted) {
        return __awaiter(this, void 0, void 0, function () {
            var source;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.runContext()];
                    case 1:
                        _a.sent();
                        source = this.audioContext.createBufferSource();
                        source.buffer = audioBuffer;
                        source.connect(this.musicGain);
                        source.loop = true;
                        if (onCompleted)
                            source.onended = function () { return onCompleted(); };
                        source.start(0, startOffset);
                        this.musicStartedAt = this.audioContext.currentTime - startOffset;
                        this._music = source;
                        return [2 /*return*/, source];
                }
            });
        });
    };
    /**
     * 停止音乐
     */
    AudioManager.prototype.stopMusic = function () {
        if (this.music == null)
            return;
        this.music.disconnect();
        this.music.stop();
        this._music = null;
        this.musicPausedAt = null;
    };
    /**
     * 暂停背景音乐
     */
    AudioManager.prototype.pauseMusic = function () {
        this.stopMusic();
        this.musicPausedAt = this.audioContext.currentTime;
    };
    /**
     * 恢复音乐
     */
    AudioManager.prototype.resumeMusic = function () {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                if (this.musicPausedAt == null || this.musicAudioBuffer == null || this.musicPausedAt - this.musicStartedAt < 0)
                    return [2 /*return*/];
                result = this.playMusicByAudioBuffer(this.musicAudioBuffer, (this.musicPausedAt - this.musicStartedAt) % this.musicAudioBuffer.duration);
                this.musicPausedAt = null;
                return [2 /*return*/, result];
            });
        });
    };
    /**
     * 播放音效
     * @param audioPath 音频路径
     * @param repeatTimes 重复次数，重复次数必须 > 0，如果是loop的话，填true。
     * @param onCompleted 完成回调
     * @returns 返回音频ID
     */
    AudioManager.prototype.playEffect = function (audioPath, repeatTimes, onCompleted) {
        if (repeatTimes === void 0) { repeatTimes = false; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.stopSoundByLogicMap.set(audioPath, false);
                this.soundTotalRepeatTimes.set(audioPath, repeatTimes);
                this.soundHasRepeatTimes.set(audioPath, 0);
                this.soundOnComplete.set(audioPath, onCompleted);
                return [2 /*return*/, this.playEffectByAudioBuffer(audioPath, 0, repeatTimes, onCompleted)];
            });
        });
    };
    AudioManager.prototype.playEffectByAudioBuffer = function (audioPath, startOffset, repeatTimes, onCompleted) {
        if (repeatTimes === void 0) { repeatTimes = false; }
        return __awaiter(this, void 0, void 0, function () {
            var audioBuffer, source;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.soundPlaying.set(audioPath, true);
                        return [4 /*yield*/, this.loadAudioBuffer(audioPath)];
                    case 1:
                        audioBuffer = _a.sent();
                        return [4 /*yield*/, this.runContext()];
                    case 2:
                        _a.sent();
                        source = this.audioContext.createBufferSource();
                        source.buffer = audioBuffer;
                        source.connect(this.effectGain);
                        source.loop = repeatTimes !== false;
                        source.start(this.audioContext.currentTime, startOffset);
                        this.soundStartAt.set(audioPath, this.audioContext.currentTime - startOffset);
                        if (typeof repeatTimes === "number")
                            source.stop(this.audioContext.currentTime + audioBuffer.duration * repeatTimes - startOffset);
                        if (onCompleted) {
                            source.onended = function () {
                                _this.soundPlaying.set(audioPath, false);
                                if (_this.stopSoundByLogicMap.get(audioPath)) {
                                    _this.stopSoundByLogicMap.set(audioPath, false);
                                    return;
                                }
                                onCompleted();
                            };
                        }
                        return [2 /*return*/, source];
                }
            });
        });
    };
    /**
     * 停止播放音频
     * @param audioID 音频ID
     */
    AudioManager.prototype.stopAudio = function (audioID, audioPath) {
        return __awaiter(this, void 0, void 0, function () {
            var source;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.stopSoundByLogicMap.set(audioPath, true);
                        this.soundPlaying.set(audioPath, false);
                        if (!(audioID instanceof Promise)) return [3 /*break*/, 2];
                        return [4 /*yield*/, audioID];
                    case 1:
                        audioID = _a.sent();
                        _a.label = 2;
                    case 2:
                        source = audioID;
                        if (source == null)
                            return [2 /*return*/];
                        source.disconnect();
                        source.stop();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 暂停音效
     */
    AudioManager.prototype.pauseAudio = function (audioID, audioPath) {
        return __awaiter(this, void 0, void 0, function () {
            var source;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(audioID instanceof Promise)) return [3 /*break*/, 2];
                        return [4 /*yield*/, audioID];
                    case 1:
                        audioID = _a.sent();
                        _a.label = 2;
                    case 2:
                        source = audioID;
                        if (source == null)
                            return [2 /*return*/];
                        this.stopAudio(audioID, audioPath);
                        this.soundPauseAt.set(audioPath, this.audioContext.currentTime);
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 恢复音效
     */
    AudioManager.prototype.resumeAudio = function (audioPath) {
        return __awaiter(this, void 0, void 0, function () {
            var audioBuffer, pauseAt, startAt, _soundPlaying, startOffset, repeatTimes, hasRepeatTimes, onComplete, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.loadAudioBuffer(audioPath)];
                    case 1:
                        audioBuffer = _a.sent();
                        pauseAt = this.soundPauseAt.get(audioPath);
                        startAt = this.soundStartAt.get(audioPath);
                        _soundPlaying = this.soundPlaying.get(audioPath);
                        if (_soundPlaying || pauseAt === null || audioBuffer == null || (typeof pauseAt === 'number' && typeof startAt === 'number' && pauseAt - startAt < 0)) {
                            return [2 /*return*/];
                        }
                        startOffset = (pauseAt - startAt) % audioBuffer.duration;
                        repeatTimes = this.soundTotalRepeatTimes.get(audioPath);
                        if (typeof repeatTimes === 'number') {
                            hasRepeatTimes = this.soundHasRepeatTimes.get(audioPath);
                            hasRepeatTimes += Math.floor((pauseAt - startAt) / audioBuffer.duration);
                            this.soundHasRepeatTimes.set(audioPath, hasRepeatTimes);
                            repeatTimes = repeatTimes - hasRepeatTimes;
                        }
                        onComplete = this.soundOnComplete.get(audioPath);
                        if (isNaN(startOffset)) {
                            startOffset = 0;
                        }
                        if (isNaN(repeatTimes)) {
                            repeatTimes = 1;
                        }
                        result = this.playEffectByAudioBuffer(audioPath, startOffset, repeatTimes, onComplete);
                        this.soundPauseAt.set(audioPath, null);
                        return [2 /*return*/, result];
                }
            });
        });
    };
    /**
     * 设置音频循环
     * @param audioID 音频ID
     * @param loop 是否循环
     */
    AudioManager.prototype.setAudioLoop = function (audioID, loop) {
        var source = audioID;
        if (source != null)
            source.loop = loop;
    };
    /**
     * 获得音频时长
     * @param audioID 音频ID
     * @returns 音频时长
     */
    AudioManager.prototype.getAudioDuration = function (audioID) {
        var source = audioID;
        return source === null || source === void 0 ? void 0 : source.buffer.duration;
    };
    /**
      * 加载一个声音
      * @param audioName 声音名称
      * @returns
      */
    AudioManager.prototype.loadAudioBuffer = function (audioName) {
        return __awaiter(this, void 0, void 0, function () {
            var IsUrl, path, audioBuffer, loadPromise;
            var _this = this;
            return __generator(this, function (_a) {
                IsUrl = function (url) {
                    return /^(https?:\/\/(([a-zA-Z0-9]+-?)+[a-zA-Z0-9]+\.)+[a-zA-Z]+)(:\d+)?(\/.*)?(\?.*)?(#.*)?$/.test(url);
                };
                path = IsUrl(audioName) ? audioName : this.audioRootPath + audioName;
                audioBuffer = this.audioAssets.get(path);
                if (audioBuffer != null)
                    return [2 /*return*/, audioBuffer];
                loadPromise = new Promise(function (resolve, reject) {
                    loadAudioClip(path, function (error, audioData) { return __awaiter(_this, void 0, void 0, function () {
                        var audioBuffer;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (error)
                                        return [2 /*return*/, reject("load audio failed:" + audioName + error)];
                                    return [4 /*yield*/, this.replaceAudioBuffer(path, audioData)];
                                case 1:
                                    audioBuffer = _a.sent();
                                    resolve(audioBuffer);
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                });
                this.audioAssets.set(path, loadPromise);
                return [2 /*return*/, loadPromise];
            });
        });
    };
    AudioManager.prototype.replaceAudioBuffer = function (path, audioData) {
        return __awaiter(this, void 0, void 0, function () {
            var audioBuffer, oldAudioBuffer, anotherArray, channel;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.decodeAudioData(audioData)];
                    case 1:
                        audioBuffer = _a.sent();
                        oldAudioBuffer = this.audioAssets.get(path);
                        if (oldAudioBuffer instanceof AudioBuffer) {
                            anotherArray = new Float32Array(audioBuffer.length);
                            for (channel = 0; channel < audioBuffer.numberOfChannels; channel++) {
                                audioBuffer.copyFromChannel(anotherArray, channel, 0);
                                oldAudioBuffer.copyToChannel(anotherArray, channel, 0);
                            }
                            return [2 /*return*/, oldAudioBuffer];
                        }
                        this.audioAssets.set(path, audioBuffer);
                        return [2 /*return*/, audioBuffer];
                }
            });
        });
    };
    AudioManager.prototype.decodeAudioData = function (audioData) {
        var _this = this;
        return new Promise(function (resolve) {
            var promise = _this.audioContext.decodeAudioData(audioData, resolve, function (err) {
                console.warn('failed to decode web audio data', err);
            });
            promise === null || promise === void 0 ? void 0 : promise.catch(function (reason) { return console.warn('failed to load Web Audio', reason, audioData); });
        });
    };
    return AudioManager;
}());
var AudioAssembler2 = AudioAssembler;
var ps;
(function (ps) {
    /** 声音管理器 */
    ps.audioManager = new AudioManager();
    ps.AudioAssembler = AudioAssembler2;
    function initAudioManager(musicName, startSounds) {
        if (startSounds === void 0) { startSounds = true; }
        ps.audioManager.initialize("".concat(ps.cfg.AUDIO_PATH, "/"));
        ps.audioManager.playMusic(musicName);
        if (!startSounds && document) {
            ps.audioManager.enableSounds = false;
            onGestureClicked(function () {
                ps.audioManager.enableSounds = true;
            });
        }
    }
    ps.initAudioManager = initAudioManager;
    var ctx = ps.audioManager;
    window.forceMuted = function (muted) {
        if (muted === void 0) { muted = true; }
        return (ctx.enableSounds = !muted);
    };
    window.stopAllSound = function () { return (ctx.enableSounds = false); };
    window.recoveryAllSound = function () { return (ctx.enableSounds = true); };
    // 兼容新版ps编辑器消费的旧的webaudio api
    window.stopBgSound = function () {
        ctx.pauseMusic();
        return ctx.audioContext.currentTime;
    };
    window.playSoundEff = function (url, playTime) {
        url = url.slice(url.lastIndexOf('/') + 1).replace(/\.mp3/i, '').replace(/\?t=[\d]*/i, '');
        ps.Audio.playSound(url, 'game', 'mp3', playTime);
    };
    window.stopSoundEff = function (url) {
        url = url.slice(url.lastIndexOf('/') + 1).replace(/\.mp3/i, '').replace(/\?t=[\d]*/i, '');
        ps.Audio.stopSound(url, 'game', 'mp3');
    };
    window.changeBgMusic = function (url) { return (ctx.playMusic(url)); };
    window.replaceAudioData = function (name, audioData) {
        ctx.replaceAudioBuffer(ctx.audioRootPath + name + ".mp3", audioData);
    };
})(ps || (ps = {}));
//# sourceMappingURL=AudioManager.js.map