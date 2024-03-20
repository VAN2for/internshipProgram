
const base64decode = function (base64) {
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
    var arraybuffer = new ArrayBuffer(bufferLength),
        bytes = new Uint8Array(arraybuffer);
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

function httpLoadAsset(url: string, onComplete: (error: Error, audioData?: ArrayBuffer) => void): void {
    const xhr = new XMLHttpRequest();
    const errInfo = `download failed: ${url}, status: `;
    xhr.open("GET", url, true);
    xhr.responseType = "arraybuffer";
    xhr.onload = () => {
        if (xhr.status === 200 || xhr.status === 0) {
            if (onComplete) { onComplete(null, xhr.response); }
        } else if (onComplete) { onComplete(new Error(`${errInfo}${xhr.status}(no response)`)); }
    };

    xhr.onerror = () => {
        if (onComplete) { onComplete(new Error(`${errInfo}${xhr.status}(error)`)); }
    };

    xhr.ontimeout = () => {
        if (onComplete) { onComplete(new Error(`${errInfo}${xhr.status}(time out)`)); }
    };

    xhr.onabort = () => {
        if (onComplete) { onComplete(new Error(`${errInfo}${xhr.status}(abort)`)); }
    };

    xhr.send(null);
}

function loadAudioClip(url: string, onComplete: (error: Error, audioData?: ArrayBuffer) => void): void {
    if (globalThis.hasBase64 && globalThis.hasBase64() && globalThis.getAssestByUrl) {
        let base64 = globalThis.getAssestByUrl(url);
        if (base64 != null) onComplete(undefined, base64decode(base64));
    } else if (globalThis.assetsPackage) {
        let urlkey = url.split("/");
        let houzhui = urlkey[urlkey.length - 1];
        houzhui = houzhui.replace(".", "_");
        let base64 = globalThis.assetsPackage[houzhui];
        if (base64 != null) onComplete(undefined, base64decode(base64));
    } else {
        httpLoadAsset(url, onComplete);
    }
}

type AudioID = {};

function onGestureClicked(callback?: () => void): void {
    const canvas = (document.getElementById("GameCanvas") as HTMLCanvasElement) ?? document;
    if (canvas == null) console.error("Can not find document or canvas in your browser");
    const onGesture = () => {
        canvas.removeEventListener("touchstart", onGesture);
        canvas.removeEventListener("touchend", onGesture);
        canvas.removeEventListener("mousedown", onGesture);
        callback?.();
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
class AudioAssembler {
    private readonly assemblerList: AudioNode[] = [];
    private audioSourceNode: AudioBufferSourceNode;
    private startedAt: number;
    private pausedAt: number;

    public constructor(public readonly audioContext: AudioContext, public readonly audioBuffer: AudioBuffer, readonly onCompleted?: () => void) { }

    private createBufferSource(): void {
        this.audioSourceNode = this.audioContext.createBufferSource();
        this.audioSourceNode.buffer = this.audioBuffer;
        this.audioSourceNode.onended = () => {
            if (this.pausedAt == null)
                this.startedAt = null;
            this.onCompleted?.();
        }
    }

    public addAudioNode<T extends AudioNode>(audioNode: T): T {
        this.assemblerList.push(audioNode);
        return audioNode;
    }

    public getAudioNode<T extends AudioNode>(classType: new (...args: any[]) => T): T {
        for (let assembler of this.assemblerList) {
            if (assembler instanceof classType)
                return assembler;
        }
    }

    public removeAudioNode(audioNode: AudioNode): void {
        let index = this.assemblerList.indexOf(audioNode);
        if (index != -1) this.assemblerList.splice(index, 1);
    }

    public play(loop: boolean = false, playbackRate: number = 1, startOffset: number = 0): void {
        if (this.startedAt != null) return;
        this.createBufferSource();
        let lastAudioNode: AudioNode = this.audioSourceNode;
        for (let audioNode of this.assemblerList)
            lastAudioNode = lastAudioNode.connect(audioNode);
        lastAudioNode.connect(ps.audioManager.assemblerGain);
        this.audioSourceNode.loop = loop;
        this.audioSourceNode.playbackRate.value = playbackRate;
        this.audioSourceNode.start(0, startOffset);

        this.startedAt = this.audioContext.currentTime - startOffset;
    }

    public pause(): void {
        if (this.startedAt == null || this.pausedAt != null) return;
        this.pausedAt = this.audioContext.currentTime;
        this.audioSourceNode.disconnect();
        this.audioSourceNode.stop();
    }

    public resume(): void {
        if (this.pausedAt == null || this.audioBuffer == null) return;
        let lastDuration = this.pausedAt - this.startedAt;
        this.startedAt = this.pausedAt = null;
        this.play(this.audioSourceNode.loop, this.audioSourceNode.playbackRate.value, lastDuration % this.audioBuffer.duration);
    }

    public stop(): void {
        if (this.startedAt == null && this.pausedAt == null) return;
        for (let audioNode of this.assemblerList)
            audioNode.disconnect();
        this.audioSourceNode.disconnect();
        this.audioSourceNode.stop();
        this.startedAt = this.pausedAt = null;
    }
}

class AudioManager {
    public readonly version = "v2.0.0";
    private audioAssets = new Map<string, AudioBuffer | Promise<AudioBuffer>>();
    private _audioRootPath: string = 'resource/';
    public get audioRootPath() { return this._audioRootPath; }
    private _audioContext: AudioContext;
    public get audioContext() { return this._audioContext; }
    private _music: AudioBufferSourceNode;
    public get music(): AudioBufferSourceNode { return this._music; }
    private _musicGain: GainNode;
    public get musicGain(): GainNode { return this._musicGain; }
    private _musicAudioBuffer: AudioBuffer;
    public get musicAudioBuffer(): AudioBuffer { return this._musicAudioBuffer; }
    private musicStartedAt: number;
    private musicPausedAt: number;
    private _effectGain: GainNode;
    public get effectGain(): GainNode { return this._effectGain; }
    private _assemblerGain: GainNode;
    public get assemblerGain(): GainNode { return this._assemblerGain; }
    private _musicVolume: number = 1;
    private _effectVolume: number = 1;
    private _assemblerVolume: number = 1;
    private _enableSounds: boolean = true;
    private stopSoundByLogicMap = new Map<string, boolean>();
    private musicPath: string;
    private soundStartAt = new Map<string, number>();
    private soundPauseAt = new Map<string, number>();
    private soundTotalRepeatTimes = new Map<string, number|boolean>();
    private soundHasRepeatTimes = new Map<string, number>();
    private soundOnComplete = new Map<string, Function>();
    private soundPlaying = new Map<string, boolean>();
    private hasInitialize = false;

    /** 音乐的音量 */
    public get musicVolume(): number { return this._musicVolume; }
    public set musicVolume(value) {
        this._musicVolume = value;
        this.setVolume(this.musicGain, value);
    }
    /** 音效的音量 */
    public get effectVolume(): number { return this._effectVolume; }
    public set effectVolume(value) {
        this._effectVolume = value;
        this.setVolume(this.effectGain, value);
    }
    /** 混合器的音量 */
    public get assemblerVolume(): number {
      return this._assemblerVolume;
    }
    public set assemblerVolume(value: number) {
      this._assemblerVolume = value;
      this.setVolume(this.assemblerGain, value);
    }

    /** 开关所有声音 @deprecated 此接口名可能会改 */
    public get enableSounds() { return this._enableSounds; }
    public set enableSounds(value) {
        if (this._enableSounds == value) return;
        this._enableSounds = value;

        this.setVolume(this.musicGain, value ? this.musicVolume : 0);
        this.setVolume(this.effectGain, value ? this.effectVolume : 0);
        this.setVolume(this.assemblerGain, value ? this.assemblerVolume : 0);
    }

    public initialize(audioRootPath: string = "audio/"): void {
        if (this.hasInitialize) {
            // 防止多次initialize
            return;
        }
        this.hasInitialize = true;
        this._audioRootPath = audioRootPath;

        try {
            this._audioContext = new (globalThis.AudioContext || globalThis.webkitAudioContext || globalThis.mozAudioContext)();
        } catch (error) {
            console.error("Your browser does not support AudioContext", error);
        }

        this._musicGain = this.audioContext.createGain();
        this.musicGain.connect(this.audioContext.destination);

        this._effectGain = this.audioContext.createGain();
        this.effectGain.connect(this.audioContext.destination);

        this._assemblerGain = this.audioContext.createGain();
        this.assemblerGain.connect(this.audioContext.destination);
        this.checkVisibilitychange((hidden) => {
            if (hidden) {
                this.audioContext.suspend();
            } else {
                // IOS14 resume is bad, has not callback immediately
                let resume = () => {
                    let handle = setTimeout(resume, 50);
                    this.audioContext.resume().then(() => clearTimeout(handle));
                };
                resume();
            }
        });
    }

    private checkVisibilitychange(callback: (hidden: boolean) => void): void {
        function onChange() { callback(document.hidden ?? document["mozHidden"] ?? document["webkitHidden"] ?? document["msHidden"]); }
        // Standards:
        if (document?.hidden != void 0)
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
    }
    /**
     * 等待context可运行
     * @returns
     */
    public runContext(): Promise<void> {
        return new Promise((resolve) => {
            const context = this.audioContext;
            if (!context.resume)
                return resolve();

            if (context.state === 'running')
                return resolve();

            context.resume().catch((e) => console.warn("runContext resume", e));
            if (<string>context.state !== 'running') {
                // promise rejection cannot be caught, need to check running state again
                onGestureClicked(() => {
                    context.resume().then(resolve).catch((e) => console.warn("runContext onGesture", e));
                });
            }
        });
    }
    /**
     * 设置声音音量
     * @param gain 声音gain对象
     * @param volume 音量（范围0~1）
     */
    public setVolume(gain: GainNode, volume: number): void {
        if (!gain || !gain.gain) return
        if (gain.gain.setTargetAtTime) {
            try {
                gain.gain.setTargetAtTime(volume, this.audioContext.currentTime, 0);
            } catch (e) {
                // Some unknown browsers may crash if timeConstant is 0
                gain.gain.setTargetAtTime(volume, this.audioContext.currentTime, 0.01);
            }
        } else {
            gain.gain.value = volume;
        }
    }

    /**
     * 播放音乐，音乐默认是循环播放。音乐永远只有一个，如果重复调用，会停止旧的音乐。
     * @param audioPath
     * @param onCompleted
     * @returns 返回音频ID
     */
    public async playMusic(audioPath: string, onCompleted?: () => void): Promise<AudioID> {
        this.stopMusic();
        this._musicAudioBuffer = await this.loadAudioBuffer(audioPath);
        this.musicPath = this.audioRootPath + audioPath;
        return this.playMusicByAudioBuffer(this.musicAudioBuffer, 0, onCompleted);
    }
   /**
     * 播放背景音乐
     * @param audioBuffer audioBuffer
     * @param startOffset
     * @param onCompleted
     * @returns
     */
    public async playMusicByAudioBuffer(audioBuffer: AudioBuffer, startOffset: number, onCompleted?: () => void): Promise<AudioID> {
        await this.runContext();
        const source = this.audioContext.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(this.musicGain);
        source.loop = true;
        if (onCompleted) source.onended = () => onCompleted();
        source.start(0, startOffset);
        this.musicStartedAt = this.audioContext.currentTime - startOffset;
        this._music = source;
        return source;
    }

    /**
     * 停止音乐
     */
    public stopMusic(): void {
        if (this.music == null) return;
        this.music.disconnect();
        this.music.stop();
        this._music = null;
        this.musicPausedAt = null;
    }

    /**
     * 暂停背景音乐
     */
    public pauseMusic(): void {
        this.stopMusic();
        this.musicPausedAt = this.audioContext.currentTime;
    }

    /**
     * 恢复音乐
     */
    public async resumeMusic(): Promise<AudioID> {
        if (this.musicPausedAt == null || this.musicAudioBuffer == null || this.musicPausedAt - this.musicStartedAt < 0) return;
        let result = this.playMusicByAudioBuffer(this.musicAudioBuffer, (this.musicPausedAt - this.musicStartedAt) % this.musicAudioBuffer.duration);
        this.musicPausedAt = null;
        return result;
    }

    /**
     * 播放音效
     * @param audioPath 音频路径
     * @param repeatTimes 重复次数，重复次数必须 > 0，如果是loop的话，填true。
     * @param onCompleted 完成回调
     * @returns 返回音频ID
     */
    public async playEffect(audioPath: string, repeatTimes: number | boolean = false, onCompleted?: () => void): Promise<AudioID> {
        this.stopSoundByLogicMap.set(audioPath, false);
        this.soundTotalRepeatTimes.set(audioPath, repeatTimes);
        this.soundHasRepeatTimes.set(audioPath, 0);
        this.soundOnComplete.set(audioPath, onCompleted);
        return this.playEffectByAudioBuffer(audioPath, 0, repeatTimes, onCompleted);
    }

    private async playEffectByAudioBuffer(audioPath: string, startOffset: number, repeatTimes: number | boolean = false, onCompleted?: Function): Promise<AudioID> {
        this.soundPlaying.set(audioPath, true);
        let audioBuffer = await this.loadAudioBuffer(audioPath);
        await this.runContext();
        const source = this.audioContext.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(this.effectGain);
        source.loop = repeatTimes !== false;
        source.start(this.audioContext.currentTime, startOffset);
        this.soundStartAt.set(audioPath, this.audioContext.currentTime - startOffset);
        if (typeof repeatTimes === `number`)
            source.stop(this.audioContext.currentTime + audioBuffer.duration * repeatTimes - startOffset);
        if (onCompleted) {
            source.onended = () => {
                this.soundPlaying.set(audioPath, false);
                if (this.stopSoundByLogicMap.get(audioPath)) {
                    this.stopSoundByLogicMap.set(audioPath, false);
                    return;
                }
                onCompleted();
            }
        }
        return source;
    }

    /**
     * 停止播放音频
     * @param audioID 音频ID
     */
    public async stopAudio(audioID: AudioID | Promise<AudioID>, audioPath) {
        this.stopSoundByLogicMap.set(audioPath, true);
        this.soundPlaying.set(audioPath, false);
        if (audioID instanceof Promise)
            audioID = await audioID;
        const source = audioID as AudioBufferSourceNode;
        if (source == null) return;
        source.disconnect();
        source.stop();
    }

    /**
     * 暂停音效
     */
    public async pauseAudio(audioID: AudioID | Promise<AudioID>, audioPath) {
        if (audioID instanceof Promise)
            audioID = await audioID;
        const source = audioID as AudioBufferSourceNode;
        if (source == null) return;
        this.stopAudio(audioID, audioPath);
        this.soundPauseAt.set(audioPath, this.audioContext.currentTime);
    }

    /**
     * 恢复音效
     */
    public async resumeAudio(audioPath): Promise<AudioID> {
        const audioBuffer = await this.loadAudioBuffer(audioPath);
        const pauseAt: number = this.soundPauseAt.get(audioPath);
        const startAt: number = this.soundStartAt.get(audioPath);
        const _soundPlaying = this.soundPlaying.get(audioPath);
        if (_soundPlaying || pauseAt === null || audioBuffer == null || (typeof pauseAt === 'number' && typeof startAt === 'number' && pauseAt - startAt < 0)) {
            return;
        }
        let startOffset = (pauseAt - startAt) % audioBuffer.duration;
        let repeatTimes = this.soundTotalRepeatTimes.get(audioPath);
        if (typeof repeatTimes === 'number') {
            let hasRepeatTimes = this.soundHasRepeatTimes.get(audioPath);
            hasRepeatTimes += Math.floor((pauseAt - startAt) / audioBuffer.duration);
            this.soundHasRepeatTimes.set(audioPath, hasRepeatTimes);
            repeatTimes = repeatTimes - hasRepeatTimes;
        }
        const onComplete: Function = this.soundOnComplete.get(audioPath);
        if (isNaN(startOffset)) {
            startOffset = 0;
        }
        if (isNaN(repeatTimes as number)) {
            repeatTimes = 1;
        }
        let result = this.playEffectByAudioBuffer(audioPath, startOffset, repeatTimes, onComplete);
        this.soundPauseAt.set(audioPath, null);
        return result;
    }

    /**
     * 设置音频循环
     * @param audioID 音频ID
     * @param loop 是否循环
     */
    public setAudioLoop(audioID: AudioID, loop: boolean): void {
        const source = audioID as AudioBufferSourceNode;
        if (source != null)
            source.loop = loop;
    }

    /**
     * 获得音频时长
     * @param audioID 音频ID
     * @returns 音频时长
     */
    public getAudioDuration(audioID: AudioID): number {
        const source = audioID as AudioBufferSourceNode;
        return source?.buffer.duration;
    }
   /**
     * 加载一个声音
     * @param audioName 声音名称
     * @returns
     */
    public async loadAudioBuffer(audioName: string): Promise<AudioBuffer> {
        const IsUrl = (url): boolean => {
            return /^(https?:\/\/(([a-zA-Z0-9]+-?)+[a-zA-Z0-9]+\.)+[a-zA-Z]+)(:\d+)?(\/.*)?(\?.*)?(#.*)?$/.test(url)
        }
        let path = IsUrl(audioName) ? audioName : this.audioRootPath + audioName;
        let audioBuffer = this.audioAssets.get(path);
        if (audioBuffer != null) return audioBuffer;

        let loadPromise = new Promise<AudioBuffer>((resolve, reject) => {
            loadAudioClip(path, async (error, audioData) => {
                if (error) return reject("load audio failed:" + audioName + error);
                let audioBuffer = await this.replaceAudioBuffer(path, audioData);
                resolve(audioBuffer);
            });
        });
        this.audioAssets.set(path, loadPromise);
        return loadPromise;
    }

    public async replaceAudioBuffer(path: string, audioData: ArrayBuffer): Promise<AudioBuffer> {
      const audioBuffer = await this.decodeAudioData(audioData);
      const oldAudioBuffer = this.audioAssets.get(path);
      if (oldAudioBuffer instanceof AudioBuffer) {
          const anotherArray = new Float32Array(audioBuffer.length);
          for (let channel = 0; channel < audioBuffer.numberOfChannels; channel++) {
              audioBuffer.copyFromChannel(anotherArray, channel, 0);
              oldAudioBuffer.copyToChannel(anotherArray, channel, 0);
          }
          return oldAudioBuffer;
      }
      this.audioAssets.set(path, audioBuffer);
      return audioBuffer;
  }

    public decodeAudioData(audioData: ArrayBuffer): Promise<AudioBuffer> {
        return new Promise((resolve) => {
            const promise = this.audioContext.decodeAudioData(audioData, resolve, (err) => {
                console.warn('failed to decode web audio data', err);
            })
            promise?.catch((reason) => console.warn('failed to load Web Audio', reason, audioData));
        });
    }
}
const AudioAssembler2 = AudioAssembler;
namespace ps {
    /** 声音管理器 */
    export const audioManager = new AudioManager();
    export const AudioAssembler = AudioAssembler2;
    export function initAudioManager(musicName: string, startSounds: boolean = true): void {
        audioManager.initialize(`${ps.cfg.AUDIO_PATH}/`);
        audioManager.playMusic(musicName);
        if (!startSounds && document) {
            audioManager.enableSounds = false;
            onGestureClicked(() => {
                audioManager.enableSounds = true;
            });
        }
    }
    const ctx = audioManager;
    window.forceMuted = (muted: boolean = true) => (ctx.enableSounds = !muted);
    window.stopAllSound = () => (ctx.enableSounds = false);
    window.recoveryAllSound = () => (ctx.enableSounds = true);
    // 兼容新版ps编辑器消费的旧的webaudio api
    window.stopBgSound = () => {
        ctx.pauseMusic();
        return ctx.audioContext.currentTime;
    };
    window.playSoundEff = (url: string, playTime: number) => {
        url = url.slice(url.lastIndexOf('/') + 1).replace(/\.mp3/i, '').replace(/\?t=[\d]*/i, '');
        ps.Audio.playSound(url, 'game', 'mp3', playTime);
    };
    window.stopSoundEff = (url: string) => {
        url = url.slice(url.lastIndexOf('/') + 1).replace(/\.mp3/i, '').replace(/\?t=[\d]*/i, '');
        ps.Audio.stopSound(url, 'game', 'mp3');
    }

    window.changeBgMusic = (url) => (ctx.playMusic(url));
    window.replaceAudioData = (name: string, audioData: ArrayBuffer) => {
      ctx.replaceAudioBuffer(ctx.audioRootPath + name + ".mp3", audioData);
    }
}
