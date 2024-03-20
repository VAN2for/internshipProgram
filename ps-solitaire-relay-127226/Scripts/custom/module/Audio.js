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
/** 音频接口，使用webaudio组件进行播放 */
var ps;
(function (ps) {
    var Audio;
    (function (Audio) {
        Audio.rootPath = "";
        var soundMap = {};
        var defaultStage = 'common';
        /**
         * 播放BGM
         * @param name BGM文件名称,默认为${projectCfg.BGM_NAME}
         * @param stage 资源所属阶段 'start' | 'game' | 'ending' ，默认为 'common'
         * @param type Bgm文件类型，默认mp3
         */
        function playBGM(name, stage, type) {
            if (name === void 0) { name = ps.cfg.BGM_NAME; }
            if (stage === void 0) { stage = defaultStage; }
            if (type === void 0) { type = "mp3"; }
            if (!name)
                return;
            var url = "".concat(stage, "/audio/").concat(name, ".").concat(type);
            ps.audioManager.playMusic(url);
        }
        Audio.playBGM = playBGM;
        /**
         * 停止播放BGM
         */
        function stopBGM() {
            ps.audioManager.stopMusic();
        }
        Audio.stopBGM = stopBGM;
        /**
         * 播放音效。音效可以同时播放多个。
         * @param name            声音文件名称，不是路径
         * @param stage 资源所属阶段 'start' | 'game' | 'ending' ，默认为 'common'
         * @param type          声音文件类型，默认mp3
         * @param playtime        播放次数,<=0表示无限循环。
         * @param onCompleted     结束时的回调函数
         * @param uuid 音效节点的uuid
         */
        function playSound(name, stage, type, playtime, onCompleted, uuid) {
            if (stage === void 0) { stage = defaultStage; }
            if (type === void 0) { type = "mp3"; }
            if (playtime === void 0) { playtime = 1; }
            var url = "".concat(stage, "/audio/").concat(name, ".").concat(type);
            var audioId = ps.audioManager.playEffect(url, playtime <= 0 ? true : playtime, onCompleted);
            soundMap[url] = audioId;
            main && main.gameEvent && main.gameEvent.dispatch(ps.AudioEvent.AUDIO_PLAY_START, uuid);
        }
        Audio.playSound = playSound;
        /**
         * 停止播放音效
         * @param name 声音文件名称，不是路径
         * @param stage 资源所属阶段 'start' | 'game' | 'ending' ，默认为 'common'
         * @param type 声音文件类型，默认mp3
         */
        function stopSound(name, stage, type) {
            if (stage === void 0) { stage = defaultStage; }
            if (type === void 0) { type = "mp3"; }
            var url = "".concat(stage, "/audio/").concat(name, ".").concat(type);
            var audioId = soundMap[url];
            ps.audioManager.stopAudio(audioId, url);
            soundMap[url] = null;
        }
        Audio.stopSound = stopSound;
        /**
         * 暂停播放音效
         * @param name 声音文件名称，不是路径
         * @param stage 资源所属阶段 'start' | 'game' | 'ending' ，默认为 'common'
         * @param type 声音文件类型，默认mp3
         */
        function pauseSound(name, stage, type) {
            if (stage === void 0) { stage = defaultStage; }
            if (type === void 0) { type = "mp3"; }
            var url = "".concat(stage, "/audio/").concat(name, ".").concat(type);
            var audioId = soundMap[url];
            ps.audioManager.pauseAudio(audioId, url);
            soundMap[url] = null;
        }
        Audio.pauseSound = pauseSound;
        /**
         * 恢复播放音效
         * @param name 声音文件名称，不是路径
         * @param stage 资源所属阶段 'start' | 'game' | 'ending' ，默认为 'common'
         * @param type 声音文件类型，默认mp3
         */
        function resumeSound(name, stage, type) {
            if (stage === void 0) { stage = defaultStage; }
            if (type === void 0) { type = "mp3"; }
            return __awaiter(this, void 0, void 0, function () {
                var url, audioId;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            url = "".concat(stage, "/audio/").concat(name, ".").concat(type);
                            return [4 /*yield*/, ps.audioManager.resumeAudio(url)];
                        case 1:
                            audioId = _a.sent();
                            if (audioId) {
                                soundMap[url] = audioId;
                            }
                            return [2 /*return*/];
                    }
                });
            });
        }
        Audio.resumeSound = resumeSound;
        /**
         * 切换背景音乐
         * @param name 声音文件名称，不是路径
         * @param stage 资源所属阶段 'start' | 'game' | 'ending' ，默认为 'common'
         * @param type 声音文件类型，默认mp3
         */
        function changeBg(name, stage, type) {
            if (stage === void 0) { stage = defaultStage; }
            if (type === void 0) { type = "mp3"; }
            var url = "".concat(stage, "/audio/").concat(name, ".").concat(type);
            ps.audioManager.playMusic(url);
        }
        Audio.changeBg = changeBg;
        /**
         * @deprecated
         * 设置声音音量，不支持修改单个声音
         */
        function setSoundVolume(name, stage, volume, type) {
            if (stage === void 0) { stage = defaultStage; }
            if (type === void 0) { type = "mp3"; }
        }
        Audio.setSoundVolume = setSoundVolume;
        /**
         * 强制静音
         * @param bool 是否静音
         */
        function forceSoundMuted(bool) {
            ps.audioManager.enableSounds = !bool;
        }
        Audio.forceSoundMuted = forceSoundMuted;
        /**
         * 全部音效静音
         */
        function stopAllSound() {
            for (var i in soundMap) {
                ps.audioManager.pauseAudio(soundMap[i], i);
                soundMap[i] = null;
            }
        }
        Audio.stopAllSound = stopAllSound;
    })(Audio = ps.Audio || (ps.Audio = {}));
})(ps || (ps = {}));
//# sourceMappingURL=Audio.js.map