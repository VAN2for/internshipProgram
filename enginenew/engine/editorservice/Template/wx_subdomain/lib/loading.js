window.qici = {};
var qici = window.qici;

// 载入游戏
qici.loadGame = function() {
    var game = window[qici.config.gameInstance] = new qc.Game({
        width: '100%',
        height: '100%',
        canvas: qici.config.canvas,
        state: qici.splashState,
        editor: false,
        backgroundColor: new qc.Color(qici.config.backgroundColor),
        runInBackground: qici.config.runInBackground,
        useLanguages: qici.config.useLanguages,
        antialias: qici.config.antialias,
        resolution : qici.config.resolution,
        resolutionRatio: qici.config.resolutionRatio,
        transparent: qici.config.transparent,
        debug: qici.config.developerMode === true,
        remoteLogUrl: qici.config.remoteLogUrl,
        customSettings : qici.config.customSettings,
        dirtyRectangles: qici.config.dirtyRectangles,
        dirtyRectanglesShow: qici.config.dirtyRectanglesShow,
        renderer: Phaser.CANVAS
    });

    /**
     * 定义快捷查找对象的方法
     * 根据唯一名字查找对象
     */
    qc.N = function(uniqueName) {
        return game.nodePool.findByName(uniqueName);
    };

    game.loadingProcessCallback = qici.loadAssetsNotify;
    game.localStorageID = qici.config.localStorageID;
    game.log.important('**** [QICI Engine]Starting game: {0}', qici.config.gameName);

    return game;
}

qici.splashState = {
    init: function() {
        if (qici.config.baseUrl) window[qici.config.gameInstance].assets.baseURL = qici.config.baseUrl;
        window[qici.config.gameInstance].fullScreen();
    },
    preload: function() {
        var game = window[qici.config.gameInstance];
        if (qici.config.loadingPrefab) {
            game.assets.load('__loading_prefab__', qici.config.loadingPrefab);
        }

        var text = game.add.text();
        text.text = 'Initializing, please wait ...';
        text.setAnchor(new qc.Point(0, 0), new qc.Point(1, 1));
        text.left = 0;
        text.right = 0;
        text.top = 0;
        text.bottom = 0;
        text.alignH = qc.UIText.CENTER;
        text.alignV = qc.UIText.MIDDLE;
        text.fontSize = 24;
        text.color = new qc.Color(0xffffff);
        text.strokeThickness = 2;
        text.stroke = new qc.Color(0x000000);
        game._initText_ = text;
        game.updateScale(true);
    },
    create: function() {
        var game = window[qici.config.gameInstance];
        game.scene.entry = qici.config.entryScene;
        game.scene.list = qici.config.scene;

        // 修改默认帧率
        if (qici.config.frameRate) game.time.applyFrameRate(qici.config.frameRate);

        var node;
        if (qici.config.loadingPrefab) {
            var prefab = game.assets.find('__loading_prefab__');
            if (prefab) {
                node = game.add.clone(prefab);
                node.ignoreDestroy = true;
                node.visible = false;
            }
        }
        if (game._initText_) {
            if (node) {
                game._initText_.destroyImmediately();
            }
            delete game._initText_;
        }
        game.timer.add(1, function() { game.scene.load(game.scene.entry); });
    }
};
