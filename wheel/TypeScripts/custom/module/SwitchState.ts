namespace ps {
    /**
     * 状态切换机，有开启跟关闭两个状态,切换到相应状态时会执行相应的回调函数
     * @author VaMP
     */
    export class SwitchState {
        /** 开启回调 */
        openCB: Function;
        /** 关闭回调 */
        closeCB: Function;
        private _state: boolean;
        /**
         * 状态切换机，有开启跟关闭两个状态
         * @param openCB 开启回调
         * @param closeCB 关闭回调
         * @param initialState 初始状态，默认开启
         */
        constructor(openCB?: Function, closeCB?: Function, initialState: boolean = false) {
            this.state = initialState;
            this.openCB = openCB;
            this.closeCB = closeCB;
        }
        /** 当前状态 */
        set state(v: boolean) {
            this.setState(v);
        }
        get state() {
            return this._state;
        }
        /**
         * 设置状态为开启
         * @param callCB 执行回调类型，normal为状态不同就执行，force为强制执行，no为不执行，默认为normal
         */
        open(callCB: "normal" | "force" | "no" = "normal") {
            this.setState(true, callCB);
        }
        /**
         * 设置状态为关闭
         * @param callCB 执行回调类型，normal为状态不同就执行，force为强制执行，no为不执行，默认为normal
         */
        close(callCB: "normal" | "force" | "no" = "normal") {
            this.setState(false, callCB);
        }
        /**
         * 设置状态
         * @param v 状态
         * @param callCB 执行回调类型，normal为状态不同就执行，force为强制执行，no为不执行，默认为normal
         */
        setState(v: boolean, callCB: "normal" | "force" | "no" = "normal") {
            if (callCB === "normal" && this._state === v) return;
            this._state = v;
            if (callCB != "no") this.callCB();
        }
        /**
         * 执行当前状态的回调
         */
        callCB() {
            if (this.state) {
                if (this.openCB) this.openCB();
            } else {
                if (this.closeCB) this.closeCB();
            }
        }
    }
}
/**
 * //旧代码=====================================
    private isGuide = true;
    private showGuide() {
        if (this.isGuide) return;
        this.isGuide = true;
        Tween.to(this.guideImg, { alpha: 1 }, 300);
    }
    private hideGuide() {
        if (!this.isGuide) return;
        this.isGuide = false;
        Tween.to(this.guideImg, { alpha: 0 }, 300);
    }
    //使用
    this.showGuide();

    //新代码=====================================
    private guideState = new SwitchState(() => {
        Tween.to(this.guideImg, { alpha: 1 }, 300);
    }, () => {
        Tween.to(this.guideImg, { alpha: 0 }, 300);
    })
    //使用
    this.guideState.open();

 */