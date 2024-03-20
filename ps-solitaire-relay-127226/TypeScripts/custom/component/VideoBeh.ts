enum VideoEvent { PLAY_STAET = "playStart", PLAY_COMPLETE = "playComplete" };

/**
 * 交互视频组件
 * @description 交互视频组件，交互视频模板使用
 * @author JingBin
 */
class VideoBeh extends ps.Behaviour {
    public gameObject: qc.Dom;

    bgUrl: string = "resource/texture/pb_bg.jpg";
    videoUrl: string = "resource/video/p_v.ts";
    /** 视频播放类型：1:交互后播放，2:播放后交互, 3:循环播放 */
    playType: number = 1;
    /** 与视频同步播放的音效 */
    smName: string = "sm_sm";

    private gameDiv: HTMLDivElement;
    private videoEle: HTMLCanvasElement;
    private player: any;

    private videoLoaded: boolean; //视频是否加载完毕

    private curW: number;
    private curH: number;
    private currentW: number;
    private currentH: number;

    public eventDisp: ps.EventDispatcher = new ps.EventDispatcher();

    /** 序列化 */
    private serializableFields: Object = {
        bgUrl: qc.Serializer.STRING,
        videoUrl: qc.Serializer.STRING,
        playType: qc.Serializer.NUMBER,
        smName: qc.Serializer.STRING,
    }

    constructor(gameObject: qc.Node) {
        super(gameObject);
    }

    /** 试玩初始化的处理 */
    onInit() {
        //在这里初始化游戏场景需要的东西
        this.gameDiv = document.getElementById("gameDiv") as HTMLDivElement;

        if (qici.config.editor || this.isChartboost) {
            this.game.timer.loop(200, this._update, this);
        }

        this.initBg();
        // this.resieBg();
        this.loadVideo();
    }

    /** 试玩开始时的处理 */
    onStart() {
        this.isGameStart = true;
        this.gameStart();
    }

    onResize() {
        // this.resieBg();
    }

    private resetGameStart() {
        this.isGameStart = false;
        this.gameStart();
    }

    private isGameStart: boolean;

    private gameStart() {
        // console.info("gameStart", this.playType);
        if (!this.player) {
            return;
        }
        if (!this.videoLoaded) {
            return;
        }
        if (!this.isGameStart) {
            return;
        }

        this.videoEle.style.display = "block";
        this.player.stop();

        if (this.playType == void 0) {
            this.playType = 1;
        }

        switch (this.playType) {
            //交互后播放
            case 1:
                this.gameObject.addListenerOnce(qc_game.input.onPointerDown, this.touchStage, this);
                break;
            //播放后交互
            case 2:
                this.playVideo();
                break;
            //循环播放
            case 3:
                this.playVideo();
                this.gameObject.addListenerOnce(qc_game.input.onPointerDown, this.touchStage, this);
                break;
        }
    }

    /** 试玩结束时的处理 */
    onEnd() {

    }

    /** 再来一次时的处理(onInit后,onStart前) */
    onRetry() {

    }

    update() {
        // console.log("update");
        if (this.isChartboost) {
            return;
        }
        this._update();
    }

    refresh() {
        // console.log("refresh");
        this.resetGameStart();
    }

    private onTouchInstallId: number;

    public playVideo() {
        this.eventDisp.dispatch(VideoEvent.PLAY_STAET);

        const player = this.player;

        player.loop = false;

        this.playContinue();

        this.game.timer.add(10, () => {
            this.onTouchInstallId = this.gameObject.addListener(qc_game.input.onPointerDown, ps.install, ps);
        });
    }

    private playContinue() {
        // console.log("playContinue", this.player);
        const player = this.player;

        player.options.onEnded = null;
        player.options.onEnded = this.playComplete.bind(this);
        player.stop();
        player.play();

        if (this.smName) {
            ps.Audio.stopSound(this.smName);
            ps.Audio.playSound(this.smName);
        }
    }

    private playComplete() {
        // console.info("playComplete");
        this.eventDisp.dispatch(VideoEvent.PLAY_COMPLETE);

        if (this.isPlayToOver) {
            return;
        }

        switch (this.playType) {
            //交互后播放
            case 1:
            //播放后交互
            case 2:
                this.playToOver();
                break;
            //循环播放
            case 3:
                this.playContinue();
                break;
        }
    }

    private isPlayToOver: boolean;

    private playToOver() {
        // console.info("playToOver");
        this.isPlayToOver = true;

        const player = this.player;

        player.options.onEnded = null;
        if (this.smName) ps.Audio.stopSound(this.smName);

        if (this.onTouchInstallId != void 0) {
            this.gameObject.removeListener(this.onTouchInstallId);
        }

        switch (this.playType) {
            //交互后播放
            case 1:
                this.startTurn();
                break;
            //播放后交互
            case 2:
                this.gameObject.addListenerOnce(qc_game.input.onPointerDown, this.touchStage, this);
                break;
            //循环播放
            case 3:
                this.startTurn();
                break;
        }
    }

    private touchStage() {
        // console.info("touchStage");

        switch (this.playType) {
            //交互后播放
            case 1:
                this.playVideo();
                break;
            //播放后交互
            case 2:
                this.startTurn();
                break;
            //循环播放
            case 3:
                this.playToOver();
                break;
        }
    }

    private startTurned: boolean; //已开始转场

    /** 开始转场 */
    private startTurn() {
        // console.info("touchStage");

        if (this.startTurned) {
            return;
        }
        this.startTurned = true;

        ps.gameEnd();
        ps.install();
        this.videoEle.style.display = "none";
    }

    private _update() {
        if (!this.videoLoaded) {
            return;
        }
        const offsetLen: number = 20;
        const winW: number = this.getWinW;
        const winH: number = this.getWinH;

        if (this.isChartboost) {
            if (winW == 0 || winH == 0) {
                return;
            }
            const minV: number = Math.min(winW, winH);
            const scale: number = 750 / minV;
            const _w: number = Math.ceil(scale * winW);
            const _h: number = Math.ceil(scale * winH);

            if (Math.abs(this.currentW - _w) + Math.abs(this.currentH - _h) < offsetLen) {
                return;
            }
            // if (this.currentW == _w && this.currentH == _h) {
            // 	return;
            // }

            if (!this.gameDiv.parentNode) {
                return;
            }

            document.body.removeChild(this.gameDiv);

            this.game.timer.add(50, this.initConVideo, this);
        } else {
            if (this.curW !== winW || this.curH !== winH) {
                // console.log(this.curW, winW);
                this.initConVideo();
                this.curW = winW;
                this.curH = winH;
            }
        }
    }

    public get getWinW(): number {
        let winW: number = this.gameObject.div.offsetWidth // window["adWidth"] || window.innerWidth;
        if (window["MW_CONFIG"]) {
            if (ps.channel == "vungle"/* || ps.channel == "dsp"*/) {
                // const vPlayer = document.getElementById("vPlayer") as HTMLCanvasElement;
                // winW = vPlayer.offsetWidth;
                // } else
                // 	if (ps.channel == "dsp") {
                const body = document.body as HTMLBodyElement;
                winW = body.offsetWidth;
            }
        }
        return winW;
    }

    public get getWinH(): number {
        let winH: number = this.gameObject.div.offsetHeight // window["adHeight"] || window.innerHeight;
        if (window["MW_CONFIG"]) {
            if (ps.channel == "vungle"/* || ps.channel == "dsp"*/) {
                // const vPlayer = document.getElementById("vPlayer") as HTMLCanvasElement;
                // winH = vPlayer.offsetHeight;
                // 	} else
                // if (ps.channel == "dsp") {
                // 		const _winH = this._getWinH;
                // 		if (_winH != void 0) {
                // 			winH = _winH;
                // 		} else {
                const body = document.body as HTMLBodyElement;
                winH = body.offsetHeight;
                // 		}
            }
        }
        return winH;
    }

    public get isChartboost(): boolean {
        return /*window["MW_CONFIG"] && ps.channel == "dsp" &&*/ window["OMG"] && window["OMG"].config && window["OMG"].config.adx === "chartboost" && typeof window["mraid"] === "undefined";
    }

    private initBg() {
        const bgEle = this.gameObject.div;
        const urlStr = this.bgUrl;
        const url = getAssestByUrl(urlStr);
        bgEle.style.background = `url(${url})`;
        bgEle.style.backgroundRepeat = "no-repeat";
        bgEle.style.backgroundPosition = "center";
        bgEle.style.backgroundSize = "cover";
        bgEle.style.webkitBackgroundSize = "cover";
    }

    // private resieBg() {
    //     const bgEle = this.gameObject.div;
    //     // console.log("resizeBg", bgEle);
    //     bgEle.style.left = "0px";
    //     bgEle.style.top = "0px";
    // }

    private loadVideo() {
        // ps.Print.purple("loadVideo");

        const urlStr = this.videoUrl;
        const url = urlStr;

        let videoEle: HTMLCanvasElement = this.videoEle;
        if (!this.videoEle) {
            videoEle = this.videoEle = document.createElement("canvas") as HTMLCanvasElement;
        }

        videoEle.style.display = "none";
        const player = this.player = videoEle["player"] = new window["JSMpeg"].Player(url, {
            canvas: videoEle,
            disableWebAssembly: true,
            onSourceCompleted: this.loadVideoComplete.bind(this),
            progressive: false,
            /* autoplay: true */
        });
        // player.loop = false;
        // player.startLoading();
        player.stop();

        this.gameObject.div.appendChild(videoEle);
    }

    private loadVideoComplete(player) {
        ps.Print.purple("loadVideoComplete");
        // console.log(player);
        this.videoLoaded = true;
        this.gameStart();
    }

    /** 初始化视频容器 */
    private initConVideo() {
        this.fitDOMElementInArea(this.videoEle);
    }

    /** 适配 DOM 节点 */
    private fitDOMElementInArea(ele: HTMLCanvasElement): void {
        if (!ele) {
            return;
        }
        // let styleVal: string = "";

        if (!ele["_fitLayaAirInitialized"]) {
            ele["_fitLayaAirInitialized"] = true;
            ele.style.transformOrigin = ele.style.webkitTransformOrigin = "left top";
            ele.style.position = "absolute";
        }

        let rotate: number = 0;

        const winW = this.getWinW;
        const winH = this.getWinH;

        const s1: number = winW / ele.width;
        const s2: number = winH / ele.height;
        let scale = Math.min(s1, s2);
        scale = Mathf.keepDecimal(scale, 2, "ceil");
        const left = Mathf.keepDecimal((winW - ele.width * scale) / 2, 0);
        const top = Mathf.keepDecimal((winH - ele.height * scale) / 2, 0);

        // styleVal += "; transform: scale(" + scale + "," + scale + ") rotate(" + rotate + "deg)";
        // ele.setAttribute("style", styleVal);
        ele.style.transform = ele.style.webkitTransform = "scale(" + scale + "," + scale + ") rotate(" + rotate + "deg)",
            // ele.style.width = GameMgr.stage.stageWidth + "px",
            // ele.style.height = GameMgr.stage.stageHeight + "px",
            ele.style.left = left + "px",
            ele.style.top = top + "px";
    }
}
qc.registerBehaviour('ps.VideoBeh', VideoBeh);
VideoBeh["__menu"] = 'Custom/VideoBeh';
/**
帧回调（preUpdate、update、postUpdate）
如果实现了这几个函数，系统会自动每帧进行调度（当挂载的Node节点处于可见、并且本脚本的enable=true时）
初始化（awake）
如果实现了awake函数，系统会在Node节点构建完毕（反序列化完成后）自动调度
脚本可用/不可用（onEnable、onDisable）
当脚本的enable从false->true时，会自动调用onEnable函数；反之调用onDisable函数
ps:在awake结束时,如果当前脚本的enable为true，会自动调用onEnable函数
交互回调（onClick、onUp、onDown、onDrag、onDragStart、onDragEnd）
当挂载的Node具备交互时，一旦捕获相应的输入事件，这些函数会自动被调用
脚本析构（onDestroy）
当脚本被移除时，会自动调用onDestroy函数，用户可以定义必要的资源回收代码
//PlaySmart新增回调(继承ps.Behaviour)
pl状态回调(onInit、onStart、onEnding、onRetry)
如果实现了这几个函数，会在pl进行到相应状态的时候进行回调
*/