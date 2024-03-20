namespace ps {
    /**
     * 重玩按钮组件
     * @author hubluesky
     */
    export class InduceRetryBtn extends qc.Behaviour {
        /** 重玩参数的Key */
        private _playAgainKey = "playAgain";

        private serializableFields = {
            induceText: qc.Serializer.STRING,
            _playAgainKey: qc.Serializer.STRING,
        };

        readonly induceText: string = "";

        constructor(gameObject: qc.Node) {
            super(gameObject);
            // Init the behaviour
            this.gameObject.interactive = true;
        }

        awake() {
            if (GAME_CFG[this._playAgainKey] <= 0) {
                if (ps.disable_yd_click()) {
                    this.gameObject.visible = false;
                } else {
                    const label = this.gameObject.getChildAt(0) as qc.UIText;
                    if (label && !String.isEmptyOrNull(this.induceText)) {
                        languagesMgr.updateLabel(label, this.induceText);
                    }
                }
            }
        }

        onUp() {
            if (GAME_CFG[this._playAgainKey] != 0) {
                ps.playerRetry = true;
                if (ps.cfg.DISABLE_RETRY_ACTIONS)
                    ps.enableAction = false;
                GAME_CFG[this._playAgainKey]--;
                ps.retry();
            } else {
                ps.install(ps.InstallType.YouDao);
            }
        }
    }
    qc.registerBehaviour("ps.InduceRetryBtn", InduceRetryBtn);
    InduceRetryBtn["__menu"] = "Btn/InduceRetryBtn";
}
