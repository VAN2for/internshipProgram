declare namespace ps {
    /**
     * 项目配置
     * @author VaMP
     */
    class MainConfig extends qc.Behaviour {
        /** 自动gameStart(调试用) */
        autoGameStart: boolean;
        /** 自动播放BGM */
        autoPlayBgm: boolean;
        /** 背景音乐名字，默认bm_bgm */
        bgmName: string;
        /** 显示fps */
        showFps: boolean;
        /** 使用动态参数json文件 */
        useConfigJson: boolean;
        /** 是否拥有开始界面 */
        hasStartPanel: boolean;
        /** 是否拥有ending界面 */
        hasEndingPanel: boolean;
        private serializableFields;
        constructor(gameObject: qc.Node);
        awake(): void;
        update(): void;
    }
}
