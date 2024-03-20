class CircleRing extends qc.Behaviour {
    /** 序列化 */
    interval=300;//一个圆圈扩散时间
    private serializableFields: Object = {
        interval: qc.Serializer.NUMBER,
    }
    constructor(gameObject: qc.Node) {
        super(gameObject);
    }
    awake() {
        var tar = this.gameObject as qc.UIImage;
        var _scaleX = this.gameObject.scaleX;
        var _scaleY = this.gameObject.scaleY;
        _scaleX = 0;
        _scaleY = 0;
        tar.pivotX = 0.5;
        tar.pivotY = 0.5;
        var aniScal = this.gameObject.scaleY;
        this.newImg(1);
        this.newImg(0.7);
        this.showRingBig(tar, 1, aniScal);
        qc_game.timer.loop(this.interval * 3 + 200, () => {
            this.showRingBig(tar, 1, aniScal);
        })
    }
    newImg(_scale) {
        var tar = this.gameObject as qc.UIImage;
        var pic = tar.texture;
        var img = qc_game.add.image();
        img.texture = pic;
        tar.addChild(img);

        img.pivotX = 0.5;
        img.pivotY = 0.5;
        img.x = 0;
        img.y = 0;
        img.scaleX = _scale;
        img.scaleY = _scale;
    }
    showRingBig(tar, _scale, aniScal) {
        ps.Tween.to(tar, { scaleX: _scale + aniScal, scaleY: _scale + aniScal, alpha: .6 }, this.interval, undefined, 0).onComplete.addOnce(() => {
            ps.Tween.to(tar, { scaleX: _scale + aniScal + 2, scaleY: _scale + aniScal + 2, alpha: .3 }, this.interval, undefined, 0).onComplete.addOnce(() => {
                ps.Tween.to(tar, { scaleX: _scale + aniScal + 7, scaleY: _scale + aniScal + 7, alpha: 0 }, this.interval, undefined, 0).onComplete.addOnce(() => {
                    tar.scaleX = 0;
                    tar.scaleY = 0;
                    tar.alpha = 1;
                })
            })
        })
    }

}
qc.registerBehaviour('CircleRing', CircleRing);
