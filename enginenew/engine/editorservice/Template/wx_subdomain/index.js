
// 指明为微信小游戏平台的开放数据域
require('./lib/weapp-adapter');
window.__wx = true;
window.isSubDomain = true;

// 库脚本
require('./lib/symbol');
require('./lib/phaser.js');
require('./lib/qc-core.js');
require('./lib/loading.js');

// 资源脚本
require('./meta/globalUrlMap.js');
require('./meta/assetCountMap.js');
require('./meta/assetDataMap.js');

// 全局函数
window.scrollTo = function() {}

var qici = window.qici;
qici.config = {
    gameName: '__GAME_NAME__',
    localStorageID: '__LOCAL_STORAGE_ID__',
    gameInstance: '__GAME_INSTANCE__',
    canvas: window.canvas,
    frameRate: __FRAMERATE__,
    fixedGameSize: __FIXEDGAMESIZE__,
    resolutionRatio: __RESOLUTIONRATIO__,
    customSettings: {},
    backgroundColor: __BACKGROUNDCOLOR__,
    runInBackground: __RUNINBACKGROUND__,
    useLanguages: __USE_LANGUAGES__,
    antialias: __ANTIALIAS__,
    transparent: __TRANSPARENT__,
    developerMode: __DEVELOPERMODE__,
    renderer: 'Canvas',
    scene: [
        __SCENE_LIST__
    ],
    entryScene : '__ENTRY_SCENE__',
    dirtyRectangles: __DIRTYRECTAGNLES__,
    baseUrl: '__BASE_URL__',
};
window._pluginVariables_ = {};

// 游戏入口脚本
require('./js/main.js');

// 初始化游戏
qc.gameObj = qici.loadGame();
