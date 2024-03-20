class RubberBand extends qc.Behaviour {
    /** 序列化 */
    spd = 200;//缓动时长
    isPlay: boolean;
    isHAni: boolean;//是否横向压缩，否则竖向压缩
    private serializableFields: Object = {
        spd: qc.Serializer.NUMBER,
        isPlay: qc.Serializer.BOOLEAN,
        isHAni: qc.Serializer.BOOLEAN,
    }
    constructor(gameObject: qc.Node) {
        super(gameObject);
    }
    awake() {
        this.gameObject.pivotX = 0.5;
        this.gameObject.pivotY = 0.5;
        if (!this.isPlay) return;
        this.rubberBandAni();
        qc_game.timer.loop(this.spd * 2, () => {
            this.rubberBandAni();
        })
    }
    rubberBandAni() {
        var tar = this.gameObject;
        if (this.isHAni) {
            ps.Tween.to(tar, { scaleX: .9, scaleY: 1.1 }, this.spd, undefined, 0).onComplete.addOnce(() => {
                ps.Tween.to(tar, { scaleX: 1.1, scaleY: .9 }, this.spd, undefined, 0).onComplete.addOnce(() => {
                })
            })
        } else {
            ps.Tween.to(tar, { scaleY: .9, scaleX: 1.1 }, this.spd, undefined, 0).onComplete.addOnce(() => {
                ps.Tween.to(tar, { scaleY: 1.1, scaleX: .9 }, this.spd, undefined, 0).onComplete.addOnce(() => {
                })
            })
        }

    }
}
qc.registerBehaviour('RubberBand', RubberBand);
