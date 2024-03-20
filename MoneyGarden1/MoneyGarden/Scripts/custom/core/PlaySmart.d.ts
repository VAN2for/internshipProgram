/** 版本 */
declare const PS_VERSION = "2.6.1";
/** qc接口对象 */
declare let qc_game: qc.Game;
/** phaser接口对象 */
declare let game: Phaser.Game;
/** box2d物理世界对象 */
declare let box2d: Box2DWorld;
/** 场景对象根节点 */
declare let UIRoot: qc.Node;
declare type Channel = "local" | "m" | "dsp" | "fb" | "google" | "unity" | "vungle" | "applovin" | "csj" | "toutiao" | "ironsource" | "tiktok";
/** playSmart框架 */
declare namespace ps {
    /** 渠道 */
    let channel: Channel;
    /** 环境 */
    let ENV: "EDITOR" | "DEBUG" | "RELEASE";
    /** 编辑器对象，在编辑器的模式下才有 */
    let editor: {
        /** 编辑器场景 */
        scene: {
            gameSize: {
                width: number;
                height: number;
            };
        };
    };
    /** 开始界面 */
    let startPanel: qc.Node;
    /** 结束界面 */
    let endingPanel: qc.Node;
    /** 游戏状态控制 */
    let mainState: GameState;
    /** 玩家自己gameRetry不更新动态参数。仓库在线制作、实时预览需要通过gameRetry更新动态参数 */
    let playerRetry: boolean;
    /** 项目配置 */
    let cfg: {
        AUDIO_PATH: string;
        /** 背景音名，默认为空。无背景音时不播放 */
        BGM_NAME: string;
        /** 自动播放BGM,默认自动播放 */
        AUTO_PLAY_BGM: boolean;
        /** 自动gameStart(调试用) */
        AUTO_GAMESTART: boolean;
        /** 显示fps数据 */
        SHOW_FPS: boolean;
        /** 使用gameConfig.json */
        USE_CONFIG_JSON: boolean;
        /** 拥有开始界面 */
        HAS_START_PANEL: boolean;
        /** 拥有ending界面 */
        HAS_ENDING_PANEL: boolean;
    };
    /** 调试配置(方便调试用，在调试模式下会覆盖项目配置) */
    let debugCfg: {
        /** 自动gameStart(调试用) */
        AUTO_GAMESTART: boolean;
        /** 显示fps数据 */
        SHOW_FPS: boolean;
        USE_CONFIG_JSON: boolean;
    };
    let hasReady: boolean;
    let hasStart: boolean;
    let hasLaunch: boolean;
    let loadScening: boolean;
    /** 是否自动播放 填false则需要点击才能播放,默认true */
    let withPlay: boolean;
    /** 框架全局初始化接口 */
    function init(): void;
    /** 加载结束 */
    function onLoaded(): void;
    /** 真正的启动游戏 */
    function checkLaunch(): void;
    /** 埋点接口 */
    function sendAction(action: number): void;
    /**
     * 全屏诱导点击,点击后自动跳转商店，发送GameEnd
     * @param endType null表示不弹出结束界面,默认win
     */
    function induce(endType?: "win" | "lose" | "null"): void;
    /**
     * 是否屏蔽素材内置全局可点
     * @description true: 屏蔽全局可点； false: 启动全局可点
     * @default false 默认为false, 只有头条、穿山甲、抖音、pangle渠道设置为true
     */
    function disable_global_click(): any;
    /**
     * 是否屏蔽素材内置自动跳转逻辑
     * @description true: 屏蔽自动跳转； false: 启动自动跳转
     * @default false 默认为false, 只有输出给DSP的渠道设置为true
     */
    function disable_auto_click(): any;
    /**
     * 是否屏蔽素材内置诱导跳转逻辑
     * @description true: 屏蔽诱导跳转； false: 启动诱导跳转
     * @default false 默认为false
     */
    function disable_yd_click(): any;
    /** 跳转类型 */
    enum InstallType {
        None = 1,
        Global = 2,
        Auto = 4,
        YouDao = 8
    }
    /**
     *  安装接口
     * @param {InstallType} type 触发类型，默认为：InstallType.None 正常跳转
     * @description 只需要单种情况时，可以这样传：install(false, InstallType.Global)；
     * @description 当需要多种情况都存在时，可以这样传：install(false, InstallType.Global | InstallType.Auto | InstallType.YouDao)
     */
    function install(type?: InstallType): void;
    /**
     * 试玩结束接口,调用此接口会展示ending界面
     * @param result 试玩结果（成功失败),默认为true
     * @param delayShow ending界面延迟弹出时间
     * @param showEnding 展示ending界面，默认true
     */
    function gameEnd(result?: boolean, delayShow?: number, showEnding?: boolean): qc.TimerEvent;
    function retry(): void;
    /** 打印版本信息 */
    function printVersion(): void;
}
declare function gameStart(): void;
declare function gameClose(): void;
