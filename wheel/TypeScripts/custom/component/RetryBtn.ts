namespace ps {
    /**
     * 重玩按钮组件
     * @author VaMP
     */
    export class RetryBtn extends qc.Behaviour {
        /** 是否激活 */
        active = true;
        /** 重玩参数的Key */
        private _playAgainKey = "playAgain";
        /** 没有次数后点击跳转商店 */
        toInstall = false;
        /**
         * 跳转商店类型
         * @description 没有次数后点击跳转商店
         */
        private _installType: InstallType = InstallType.YouDao;
        /** 没有次数后隐藏按钮 */
        autoHide = true;

        private serializableFields = {
            active: qc.Serializer.BOOLEAN,
            _playAgainKey: qc.Serializer.STRING,
            toInstall: qc.Serializer.BOOLEAN,
            _installType: qc.Serializer.INT,
            autoHide: qc.Serializer.BOOLEAN,
        };

        constructor(gameObject: qc.Node) {
            super(gameObject);
            // Init the behaviour
            this.gameObject.interactive = true;
        }

        awake() {
            this.updateStatus();
        }

        onUp() {
            if (!this.active) return;
            if (GAME_CFG[this._playAgainKey] != 0) {
                ps.playerRetry = true;
                if (ps.cfg.DISABLE_RETRY_ACTIONS)
                    ps.enableAction = false;
                ps.retry();
                GAME_CFG[this._playAgainKey]--;
                this.updateStatus();
            } else if (this.toInstall) {
                ps.install(this._installType);

            }
        }
        /** 更新按钮状态 */
        private updateStatus() {
            if (this.autoHide) this.gameObject.visible = GAME_CFG[this._playAgainKey] > 0;
        }
    }
    qc.registerBehaviour("ps.RetryBtn", RetryBtn);
    RetryBtn["__menu"] = "Btn/Retry";
}
