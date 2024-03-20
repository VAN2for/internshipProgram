let __retryCount = 0;
namespace ps {

    const __retry = ps.retry;//把retry函数hook一下
    ps.retry = (...$args) => {
        GameModel.instance.destroy();
        GameController.instance.destroy();
        __retry(...$args);
    };
    /**
     * 
     * @author: hs.lin
     * @date: 2021/05/06 13:52:50
     */
    export class GameController {
        private _model = GameModel.instance;

        // private constructor() {
        // }

        // public initGameCfg() {
        // }

        public beginGame() {
            this._model.step = "ready";
            this._model.step = "step1";

            this._model.on("step", this.onStep, this, true);
        }

        public endGame() {
            gameEnd();
        }

        public get prefixMoney(): string {
            return languagesMgr.getCfg("moneySymbol").value;
        }

        private get mergeCntToEnd(): number {
            switch (GAME_CFG.mergeCntToEnd) {
                case "3次":
                    return 3;
                case "2次":
                    return 2;
                default:
                    return 1;
            }
        }

        public get moneyToEnd(): string {
            return Mathf.keepDecimal(Number(GAME_CFG.moneyToEnd) / this.mergeCntToEnd, 4);
        }

        private onStep() {
            const { step, numLastTargetIdx } = this._model;
            switch (step) {
                case "ready":
                    // for (let i = 0; i < ItemsTotalCnt; i++) {
                    //     const lv = Random.round(LvMin, LvMin);
                    //     this._model.arrItemsLv.push(lv);
                    //     const itemsLv = this._model.mapItemsLv.get(lv) ?? [];
                    //     itemsLv.push(i);
                    //     this._model.mapItemsLv.set(lv, itemsLv);
                    // }
                    // this._model.isRenderItems = true;
                    break;
                case "step1":
                    this._model.isStartAutoGetMoney = true;
                    this._model.targetItemsIdx = [0, 1];
                    this._model.isShowGuide = true;
                    break;
                case "step2":
                    this._model.targetItemsIdx = [numLastTargetIdx, 4];
                    this._model.isShowGuide = true;
                    break;
                case "step3":
                    this._model.targetItemsIdx = [7, 11];
                    this._model.isShowGuide = true;
                    break;
                case "end":
                    this._model.isShowGuide = false;
                    this.endGame();
                    break;
            }
        }

        public get nextStep(): StepType {
            const { step, numMergeCnt, numMoney } = this._model;
            if (numMergeCnt >= this.mergeCntToEnd || numMoney >= Number(GAME_CFG.moneyToEnd)) {
                return "end";
            }
            switch (step) {
                case "step1":
                    return "step2";
                case "step2":
                    return "step3";
                case "step3":
                    return "end";
            }
        }

        public checkNextStep() {
            this._model.step = this.nextStep;
        }

        public getOtherTargetIdx(currIdx: number): number {
            const { targetItemsIdx } = this._model;
            const idx = targetItemsIdx.indexOf(currIdx);
            if (idx === -1) {
                return idx;
            }
            return idx == 0 ? targetItemsIdx[1] : targetItemsIdx[0];
        }

        public get canRetry() {
            return GAME_CFG["playAgain"] < 0 || __retryCount < GAME_CFG["playAgain"];
        }

        public retry() {
            if (this.canRetry) {
                retry();
                __retryCount++;
                if (!disable_yd_click()) {//重玩按钮的诱导跳转
                    install();
                }
            } else {
                install();
            }
        }

        public destroy() {
            GameController._instance = undefined;
        }

        private static _instance: GameController;
        public static get instance(): GameController {
            return this._instance || (this._instance = new GameController());
        }
    }
}