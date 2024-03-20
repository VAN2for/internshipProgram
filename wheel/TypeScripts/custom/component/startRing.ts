class startRing extends qc.Behaviour {
    /** 序列化 */
    ringSkin;//所展示图片资源
    moveTarget: qc.Node;//所移动到的目标对象
    autoPlay = true;//是否自动播放
    ringNum = 10;//展示图片数量
    scaleXY = 1;//展示图片的大小
    moveTime = 300;//移动所花时间
    private serializableFields: Object = {
        ringSkin: qc.Serializer.TEXTURES,
        moveTarget: qc.Serializer.NODE,
        autoPlay: qc.Serializer.BOOLEAN,
        ringNum: qc.Serializer.NUMBER,
        scaleXY: qc.Serializer.NUMBER,
        moveTime: qc.Serializer.NUMBER,
    }
    constructor(gameObject: qc.Node) {
        super(gameObject);
    }
    awake() {
        if (this.autoPlay) {
            for (var i = 0; i < this.ringNum; i++) {
                this.showRing(this.gameObject);
            }
        }
    }
    playOne() {
        this.awake();
    }
    showRing(tar) {
        var img = new qc.UIImage(qc_game, this.gameObject);
        tar.addChild(img);
        var num = ps.Random.round(0, this.ringSkin.length - 1);
        img.texture = this.ringSkin[num];
        img.pivotX = img.pivotY = .5;
        img.x = 0;
        img.y = 0;
        img.scaleY = img.scaleX = this.scaleXY;
        img.resetNativeSize();
        var moveTarget = this.moveTarget;
        var _x = Math.random() * 180 - 90 + img.x
        var _y = Math.random() * 180 - 90 + img.y
        var _time = Math.random() * 200 + 200;
        
        ps.Tween.to(img, { x: _x, y: _y }, _time).onComplete.addOnce(function (e) {
            var _mtime = Math.random() * this.moveTime + this.moveTime + 100;
            this.moveToTarget(moveTarget, img, _mtime, true);
        }, this)
    }
    moveToTarget(target: qc.Node, img, time, result: boolean, offset = new qc.Point) {
        let pos = ps.Tools.transPos(target, img, offset);
        ps.Tween.to(img, { x: pos.x, y: pos.y }, time, Phaser.Easing.Sinusoidal.InOut).onComplete.addOnce(() => {
            if (result) {
                target.removeChild(img);
                img.visible = false;
            }
        });
    }
}
qc.registerBehaviour('startRing', startRing);
