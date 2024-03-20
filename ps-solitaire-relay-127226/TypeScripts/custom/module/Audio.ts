/** 音频接口，使用webaudio组件进行播放 */
namespace ps.Audio {
    export let rootPath = "";
    let soundMap = {};
    const defaultStage = 'common';

    /**
     * 播放BGM
     * @param name BGM文件名称,默认为${projectCfg.BGM_NAME}
     * @param stage 资源所属阶段 'start' | 'game' | 'ending' ，默认为 'common'
     * @param type Bgm文件类型，默认mp3
     */
    export function playBGM(name: string = ps.cfg.BGM_NAME, stage: 'start' | 'game' | 'ending' | 'common' = defaultStage, type = "mp3") {
        if (!name) return;
        let url = `${stage}/audio/${name}.${type}`;
        ps.audioManager.playMusic(url);
    }
    /**
     * 停止播放BGM
     */
    export function stopBGM() {
        ps.audioManager.stopMusic();
    }
    /**
     * 播放音效。音效可以同时播放多个。
     * @param name            声音文件名称，不是路径
     * @param stage 资源所属阶段 'start' | 'game' | 'ending' ，默认为 'common'
     * @param type          声音文件类型，默认mp3
     * @param playtime        播放次数,<=0表示无限循环。
     * @param onCompleted     结束时的回调函数
     * @param uuid 音效节点的uuid
     */
    export function playSound(name: string, stage: 'start' | 'game' | 'ending' | 'common' = defaultStage, type = "mp3", playtime: number = 1, onCompleted?: () => void, uuid?: string) {
        let url = `${stage}/audio/${name}.${type}`;
        let audioId = ps.audioManager.playEffect(url, playtime <= 0 ? true : playtime, onCompleted);
        soundMap[url] = audioId;
        main && main.gameEvent && main.gameEvent.dispatch(ps.AudioEvent.AUDIO_PLAY_START, uuid);
    }
    /**
     * 停止播放音效
     * @param name 声音文件名称，不是路径
     * @param stage 资源所属阶段 'start' | 'game' | 'ending' ，默认为 'common'
     * @param type 声音文件类型，默认mp3
     */
    export function stopSound(name: string, stage: 'start' | 'game' | 'ending' | 'common' = defaultStage, type = "mp3") {
        let url = `${stage}/audio/${name}.${type}`;
        let audioId = soundMap[url];
        ps.audioManager.stopAudio(audioId, url);
        soundMap[url] = null;
    }
    /**
     * 暂停播放音效
     * @param name 声音文件名称，不是路径
     * @param stage 资源所属阶段 'start' | 'game' | 'ending' ，默认为 'common'
     * @param type 声音文件类型，默认mp3
     */
    export function pauseSound(name: string, stage: 'start' | 'game' | 'ending' | 'common' = defaultStage, type = "mp3") {
        let url = `${stage}/audio/${name}.${type}`;
        let audioId = soundMap[url];
        ps.audioManager.pauseAudio(audioId, url);
        soundMap[url] = null;
    }
    /**
     * 恢复播放音效
     * @param name 声音文件名称，不是路径
     * @param stage 资源所属阶段 'start' | 'game' | 'ending' ，默认为 'common'
     * @param type 声音文件类型，默认mp3
     */
    export async function resumeSound(name: string, stage: 'start' | 'game' | 'ending' | 'common' = defaultStage, type = "mp3") {
        let url = `${stage}/audio/${name}.${type}`;
        const audioId = await ps.audioManager.resumeAudio(url);
        if (audioId) {
            soundMap[url] = audioId;
        }
    }
    /**
     * 切换背景音乐
     * @param name 声音文件名称，不是路径
     * @param stage 资源所属阶段 'start' | 'game' | 'ending' ，默认为 'common'
     * @param type 声音文件类型，默认mp3
     */
    export function changeBg(name: string, stage: 'start' | 'game' | 'ending' | 'common' = defaultStage, type = "mp3") {
        let url = `${stage}/audio/${name}.${type}`;
        ps.audioManager.playMusic(url);
    }

    /**
     * @deprecated
     * 设置声音音量，不支持修改单个声音
     */
    export function setSoundVolume(name: string, stage: 'start' | 'game' | 'ending' | 'common' = defaultStage, volume: number, type = "mp3") {
    }

    /**
     * 强制静音
     * @param bool 是否静音
     */
    export function forceSoundMuted(bool: boolean) {
        ps.audioManager.enableSounds = !bool;
    }
    /**
     * 全部音效静音
     */
    export function stopAllSound() {
        for (var i in soundMap) {
            ps.audioManager.pauseAudio(soundMap[i], i);
            soundMap[i] = null;
        }
    }
}