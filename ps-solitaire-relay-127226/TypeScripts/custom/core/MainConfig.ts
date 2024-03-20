namespace ps {
    /**
     * 项目配置
     * @author VaMP
     */
    export class MainConfig extends qc.Behaviour {
        /** 自动gameStart(调试用) */
        autoGameStart = true;
        /** 自动播放BGM */
        autoPlayBgm = true;
        /** 背景音乐名字，默认bm_bgm */
        bgmName = "bm_bgm";
        /** 显示fps */
        showFps = false;
        /** 使用动态参数json文件 */
        useConfigJson = true;
        /** 是否拥有开始界面 */
        hasStartPanel = true;
        /** 是否拥有ending界面 */
        hasEndingPanel = true;
        /** 重玩援关闭埋点记录 */
        disableRetryActions = false;
        /** 结束场景节点 */
        endingScene = null;

        private serializableFields: Object = {
            autoGameStart: qc.Serializer.BOOLEAN,
            showFps: qc.Serializer.BOOLEAN,
            useConfigJson: qc.Serializer.BOOLEAN,
            bgmName: qc.Serializer.STRING,
            autoPlayBgm: qc.Serializer.BOOLEAN,
            hasStartPanel: qc.Serializer.BOOLEAN,
            hasEndingPanel: qc.Serializer.BOOLEAN,
            disableRetryActions: qc.Serializer.BOOLEAN,
            endingScene: qc.Serializer.NODE
        }

        constructor(gameObject: qc.Node) {
            super(gameObject);
            this.runInEditor = true;
        }

        awake() {
            ps.cfg.AUTO_GAMESTART = this.autoGameStart;
            ps.cfg.SHOW_FPS = this.showFps;
            ps.cfg.USE_CONFIG_JSON = this.useConfigJson;
            //
            // ps.cfg.BGM_NAME = this.bgmName;
            // ps.cfg.AUTO_PLAY_BGM = this.autoPlayBgm;
            ps.cfg.HAS_START_PANEL = this.hasStartPanel;
            ps.cfg.HAS_ENDING_PANEL = this.hasEndingPanel;
            ps.cfg.DISABLE_RETRY_ACTIONS = this.disableRetryActions;
            //根节点
            UIRoot = this.gameObject;
            const gamePlay = UIRoot.getChild('gamePlay');
            gamePlay.children.forEach((scene) => {
                if (/^scene[0-9]+_ending$/.test(scene.name)) {
                  this.endingScene = scene.name;
                }
            });
        }
        update() {
            ps.timer.update(this.game.time.deltaTime);
            ps.updateList.update(this.game.time.deltaTime);
        }
    }
    qc.registerBehaviour('ps.MainConfig', MainConfig);
    MainConfig["__menu"] = 'Custom/MainConfig';
}
