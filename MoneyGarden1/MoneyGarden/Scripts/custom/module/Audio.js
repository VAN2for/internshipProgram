/** 音频接口，使用webaudio组件进行播放 */
var ps;
(function (ps) {
    var Audio;
    (function (Audio) {
        /** 音频文件路径 */
        Audio.rootPath = "";
        var soundDt = {};
        /**
         * 播放BGM
         * @param name BGM文件名称,默认为${projectCfg.BGM_NAME}
         * @param stage 资源所属阶段 'start' | 'game' | 'ending' ，默认为 'game'
         * @param type Bgm文件类型，默认mp3
         * @param withPlay 是否自动播放 填false则需要点击才能播放,默认true
         */
        function playBGM(name, stage, type, withPlay) {
            if (name === void 0) { name = ps.cfg.BGM_NAME; }
            if (stage === void 0) { stage = 'game'; }
            if (type === void 0) { type = "mp3"; }
            if (withPlay === void 0) { withPlay = true; }
            if (!name)
                return;
            var url = Audio.rootPath + "/" + stage + "/audio/" + name + "." + type;
            playEnterSound(url, withPlay, false);
        }
        Audio.playBGM = playBGM;
        /**
         * 停止播放BGM
         */
        function stopBGM() {
            stopBgSound();
        }
        Audio.stopBGM = stopBGM;
        /**
         * 播放音效。音效可以同时播放多个。
         * @param name            声音文件名称，不是路径
         * @param stage 资源所属阶段 'start' | 'game' | 'ending' ，默认为 'game'
         * @param type          声音文件类型，默认mp3
         * @param playtime        播放次数,<=0表示无限循环。
         * @param interval        重叠播放的间隔时间，少于这个间隔时间播放相同的音效，会跳过，播放单位毫秒，默认50
         */
        function playSound(name, stage, type, playtime, interval) {
            if (stage === void 0) { stage = 'game'; }
            if (type === void 0) { type = "mp3"; }
            if (playtime === void 0) { playtime = 1; }
            if (interval === void 0) { interval = 50; }
            if (window["playsound"] === false)
                return;
            var nt = Date.now();
            var dt = soundDt[name] || 0;
            if (nt - dt < interval)
                return;
            soundDt[name] = nt;
            var url = Audio.rootPath + "/" + stage + "/audio/" + name + "." + type;
            playSoundEff(url, playtime);
        }
        Audio.playSound = playSound;
        /**
         * 停止播放音效
         * @param name 声音文件名称，不是路径
         * @param stage 资源所属阶段 'start' | 'game' | 'ending' ，默认为 'game'
         * @param type 声音文件类型，默认mp3
         */
        function stopSound(name, stage, type) {
            if (stage === void 0) { stage = 'game'; }
            if (type === void 0) { type = "mp3"; }
            var url = Audio.rootPath + "/" + stage + "/audio/" + name + "." + type;
            stopSoundEff(url);
        }
        Audio.stopSound = stopSound;
        /**
         * 切换背景音乐
         * @param name 声音文件名称，不是路径
         * @param stage 资源所属阶段 'start' | 'game' | 'ending' ，默认为 'game'
         * @param type 声音文件类型，默认mp3
         */
        function changeBg(name, stage, type) {
            if (stage === void 0) { stage = 'game'; }
            if (type === void 0) { type = "mp3"; }
            var url = Audio.rootPath + "/" + stage + "/audio/" + name + "." + type;
            changeBgMusic(url);
        }
        Audio.changeBg = changeBg;
        /**
         * 设置声音音量
         * @param name 声音文件名称
         * @param stage 资源所属阶段 'start' | 'game' | 'ending' ，默认为 'game'
         * @param volume 目标音量，取值范围0-100，默认100
         * @param type 声音文件类型，默认mp3
         */
        function setSoundVolume(name, stage, volume, type) {
            if (stage === void 0) { stage = 'game'; }
            if (type === void 0) { type = "mp3"; }
            var url = Audio.rootPath + "/" + stage + "/audio/" + name + "." + type;
            setVolume(url, volume);
        }
        Audio.setSoundVolume = setSoundVolume;
        /**
         * 强制静音
         * @param bool 是否静音
         */
        function forceSoundMuted(bool) {
            forceMuted(bool);
        }
        Audio.forceSoundMuted = forceSoundMuted;
    })(Audio = ps.Audio || (ps.Audio = {}));
})(ps || (ps = {}));
