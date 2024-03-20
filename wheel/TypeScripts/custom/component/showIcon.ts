class showIcon extends qc.Behaviour {
    /** 序列化 */
    iconSKin;//icon皮肤
    _scale = 1;//缩放值
    disappearTime = 300;//消失时间
    showTime = 300;//出现时间
    private serializableFields: Object = {
        iconSKin: qc.Serializer.TEXTURE,
        _scale: qc.Serializer.NUMBER,
        disappearTime: qc.Serializer.NUMBER,
        showTime: qc.Serializer.NUMBER,
    }
    constructor(gameObject: qc.Node) {
        super(gameObject);
    }
    awake() {
    }
    onClick(e: qc.PointerEvent) {
        //点击出现icon
        let x = (e.source as qc.Pointer).x;
        let y = (e.source as qc.Pointer).y;
        let icon = new qc.UIImage(qc_game);
        var gamePlay = this.gameObject;
        gamePlay.addChild(icon);
        var abby = gamePlay.parent;//获取缩放值
        icon.x = x / abby.scaleX;
        icon.y = y / abby.scaleY;
        icon.texture = this.iconSKin;
        icon.pivotX = 0.5;
        icon.pivotY = 0.5;
        icon.scaleX = 0;
        icon.scaleY = 0;
        icon.resetNativeSize();
        ps.Tween.to(icon, { scaleX: this._scale, scaleY: this._scale }, this.showTime, Phaser.Easing.Back.Out, 0).onComplete.addOnce(
            () => {
                ps.Tween.to(icon, { scaleX: 0, scaleY: 0 }, this.showTime, undefined, this.disappearTime).onComplete.addOnce(
                    () => {
                        this.gameObject.removeChild(icon);
                    }
                );
            }
        );
    }
}
qc.registerBehaviour('showIcon', showIcon);
