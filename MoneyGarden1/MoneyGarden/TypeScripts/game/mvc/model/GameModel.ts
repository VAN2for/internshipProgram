namespace ps {
    /**
     * 
     * @author: hs.lin
     * @date: 2021/05/06 13:51:55
     */
    //@ts-ignore
    export class GameModel extends AbstractModel<GameModel>{
        private _step: StepType = "unknown";
        private _resBindings: GameResBindings;
        // private _isRenderItems = false;
        // private _arrItemsLv: number[] = [];
        // private _mapItemsLv: Map<number, number[]> = new Map();
        private _targetItemsIdx: number[] = [];
        private _numMoney = 0;
        private _isShowGuide = false;
        private _isShowGetMoneyView = false;
        private _numMergeCnt = 0;
        private _numLastTargetIdx = 0;
        private _isStartAutoGetMoney = false;


        /**
         * 
         * @emits "isStartAutoGetMoney" (赋值成功后会派发事件，并带上IEventPayload作为参数)
         * @description 
         */
        public get isStartAutoGetMoney(): boolean {
            return this._isStartAutoGetMoney;
        }

        public set isStartAutoGetMoney($value: boolean) {
            this.try2Set("isStartAutoGetMoney", $value);
        }


        /**
         * 
         * @emits "numLastTargetIdx" (赋值成功后会派发事件，并带上IEventPayload作为参数)
         * @description 
         */
        public get numLastTargetIdx(): number {
            return this._numLastTargetIdx;
        }

        public set numLastTargetIdx($value: number) {
            this.try2Set("numLastTargetIdx", $value);
        }


        /**
         * 
         * @emits "numMergeCnt" (赋值成功后会派发事件，并带上IEventPayload作为参数)
         * @description 
         */
        public get numMergeCnt(): number {
            return this._numMergeCnt;
        }

        public set numMergeCnt($value: number) {
            this.try2Set("numMergeCnt", $value);
        }


        /**
         * 
         * @emits "isShowGetMoneyView" (赋值成功后会派发事件，并带上IEventPayload作为参数)
         * @description 
         */
        public get isShowGetMoneyView(): boolean {
            return this._isShowGetMoneyView;
        }

        public set isShowGetMoneyView($value: boolean) {
            this.try2Set("isShowGetMoneyView", $value);
        }


        /**
         * 
         * @emits "isShowGuide" (赋值成功后会派发事件，并带上IEventPayload作为参数)
         * @description 
         */
        public get isShowGuide(): boolean {
            return this._isShowGuide;
        }

        public set isShowGuide($value: boolean) {
            this.try2Set("isShowGuide", $value);
        }


        /**
         * 
         * @emits "numMoney" (赋值成功后会派发事件，并带上IEventPayload作为参数)
         * @description 
         */
        public get numMoney(): number {
            return this._numMoney;
        }

        public set numMoney($value: number) {
            this.try2Set("numMoney", $value);
        }


        /**
         * 
         * @emits "targetItemsIdx" (赋值成功后会派发事件，并带上IEventPayload作为参数)
         * @description 
         */
        public get targetItemsIdx(): number[] {
            return this._targetItemsIdx;
        }

        public set targetItemsIdx($value: number[]) {
            this.try2Set("targetItemsIdx", $value);
        }


        // /**
        //  * 
        //  * @emits "mapItemsLv" (赋值成功后会派发事件，并带上IEventPayload作为参数)
        //  * @description 
        //  */
        // public get mapItemsLv(): Map<number, number[]> {
        //     return this._mapItemsLv;
        // }

        // public set mapItemsLv($value: Map<number, number[]>) {
        //     this.try2Set("mapItemsLv", $value);
        // }


        // /**
        //  * 
        //  * @emits "arrItemsLv" (赋值成功后会派发事件，并带上IEventPayload作为参数)
        //  * @description 
        //  */
        // public get arrItemsLv(): number[] {
        //     return this._arrItemsLv;
        // }

        // public set arrItemsLv($value: number[]) {
        //     this.try2Set("arrItemsLv", $value);
        // }

        // /**
        //  * 
        //  * @emits "isRenderItems" (赋值成功后会派发事件，并带上IEventPayload作为参数)
        //  * @description 
        //  */
        // public get isRenderItems(): boolean {
        //     return this._isRenderItems;
        // }

        // public set isRenderItems($value: boolean) {
        //     this.try2Set("isRenderItems", $value);
        // }


        /**
         * 游戏步骤
         * @emits "step" (赋值成功后会派发事件，并带上IEventPayload作为参数)
         */
        public get step(): StepType {
            return this._step;
        }

        public set step($value: StepType) {
            this.try2Set("step", $value);
        }

        public get resBindings(): GameResBindings {
            return this._resBindings;
        }
        public set resBindings(value: GameResBindings) {
            this._resBindings = value;
        }


        public destroy() {
            super.destroy();
            GameModel._instance = undefined;
        }

        private static _instance: GameModel;
        public static get instance(): GameModel {
            return this._instance || (this._instance = new GameModel());
        }
    }
}