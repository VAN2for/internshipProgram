class EndingBeh extends ps.Behaviour {
    private _model = ps.GameModel.instance;
    private _controller = ps.GameController.instance;
    private _imgMask: qc.UIImage;

    /** 序列化 */
    private serializableFields: Object = {
        moneyLabel: qc.Serializer.NODE,
        moneyEffect: qc.Serializer.NODE,
        guideNode: qc.Serializer.NODE,
    }

    public readonly moneyLabel: qc.UIText;
    public readonly moneyEffect: qc.Node;
    public readonly guideNode: qc.Node;

    constructor(gameObject: qc.Node) {
        super(gameObject);
    }

    public onInit() {
        this.guideNode.visible = GAME_CFG.isShowEndGuide;

        switch (GAME_CFG.sprayEff) {
            case "强":
                this.moneyEffect["quantity"] *= 1.5;
                break;
            case "弱":
                this.moneyEffect["quantity"] *= 0.5;
                break;
        }

        (this.gameObject.getChild("imgMask").getComponent(ps.btn.InstallBtn) as ps.btn.InstallBtn).enable = GAME_CFG.isGlobalInstall;
    }

    /**
     * 显示结束界面
     * @param result 结果，默认为true
     */
    onEnd(result: boolean = true) {
        this.onInit();
        this._model.numMoney = Number(GAME_CFG.moneyToEnd);
        if (GAME_CFG.isShowEndMoney) {
            const { numMoney } = this._model;
            const numScroll = this.moneyLabel.getComponent(ps.NumScroll) as ps.NumScroll;
            numScroll.prefix = this._controller.prefixMoney;
            numScroll.maxNum = Infinity;
            numScroll.prefixPosition = GAME_CFG.moneySymbolPosition;
            numScroll.refresh(numMoney);
            ps.Audio.playSound("sm_money");
            this.moneyLabel.visible = true;
        } else {
            this.moneyLabel.visible = false;
        }

        ps.Audio.playSound("sm_reward", "ending");
        ps.Audio.playSound("sm_win", "ending");
    }
}
qc.registerBehaviour('EndingBeh', EndingBeh);