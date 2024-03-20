namespace ps {
    /**
     * 脚本基类
     * pl状态回调(onInit、onStart、onEnding、onRetry、onResize)
     * 如果实现了这几个函数，会在pl进行到相应状态的时候进行回调
     * @author VaMP
     */
    export class Behaviour extends qc.Behaviour implements ElementGui {
        constructor(gameObject: qc.Node) {
            super(gameObject);
            this.createEvent(ps.GameState.READY, "onInit");
            this.createEvent(ps.GameState.GAMESTART, "onGameStart");
            this.createEvent(ps.GameState.START, "onStart");
            this.createEvent(ps.GameState.END, "onEnd");
            this.createEvent(ps.GameState.RETRY, "onRetry");
            this.createEvent(ps.GameState.SCENECHANGE, "onSceneChange");
            //如果有onResize方法，自动注册事件
            if (this["onResize"]) this.gameObject.addListener(this.gameObject.onRelayout, this["onResize"], this);
        }
        awake() {
            if (ps.mainState.isPlaying) {
                this.call("onInit");
                this.call("onStart");
            }
            if (ps.mainState.isEnded) {
                this.call("onEnd", ps.mainState.result);
            }
        }
        private call(funName: string, ...args) {
            if (this[funName]) this[funName](...args);
        }
        private createEvent(event: string, funName: string) {
            if (this[funName]) ps.mainState.add(event, this[funName], this);
        }
        //
        pos(x: number, y: number) {
            this.gameObject.x = x;
            this.gameObject.y = y;
        }

        createGui(): GuiType { return; }
    }
}