class PokerAni extends ps.Behaviour {
    /** 序列化 */
    private duration: number = 200;
    private serializableFields: Object = {
        duration: qc.Serializer.NUMBER,
    }
    constructor(gameObject: qc.Node) {
        super(gameObject);
    }
    onStart() {
        let facePic = this.gameObject.getChildAt(0);//待显示的对象
        let picBack = this.gameObject.getChildAt(1);//翻转对象
        facePic.scaleX = -0.5;
        facePic.pivotX = facePic.pivotY = 0.5;
        facePic.alpha = 0;
        picBack.pivotX = picBack.pivotY = 0.5;
        picBack.scaleY = picBack.scaleX = 0.5;
        ps.Tween.to(picBack, { scaleX: -1, alpha: 0 }, this.duration);
        ps.Tween.to(facePic, { scaleX: 1, alpha: 1 }, this.duration, undefined, 100);
    }
}
qc.registerBehaviour('PokerAni', PokerAni);