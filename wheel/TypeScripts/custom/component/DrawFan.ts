class DrawFan extends qc.Behaviour {
    /** 序列化 */
    private _Angle: number = 360;//所绘的角度
    private duration: number = 3;//绘角度度时长
    private _radius: number = 150;//半径
    private isLoop: boolean = false;//是否循环
    private isFan: boolean = true;//画扇形或圆形
    private _beginFillcolor = new qc.Color("000000");
    private _lineStylecolor = new qc.Color("ffffff");
    private serializableFields: Object = {
        duration: qc.Serializer.NUMBER,
        isLoop: qc.Serializer.BOOLEAN,
        isFan: qc.Serializer.BOOLEAN,
        _beginFillcolor: qc.Serializer.COLOR,
        _lineStylecolor: qc.Serializer.COLOR,
        _Angle: qc.Serializer.NUMBER,
        _radius: qc.Serializer.NUMBER
    }
    constructor(gameObject: qc.Node) {
        super(gameObject);
    }
    private angle = { min: 0, max: 0 };
    awake() {
        game.add.tween(this.angle).to({ max: this._Angle }, this.duration * 1000, "Linear", true, 0, -1, this.isLoop).onUpdateCallback(this.draMask2, this);
    }
    private graphics2: qc.Graphics;
    draMask2() {
        if (!this.graphics2) this.graphics2 = new qc.Graphics(qc_game, this.gameObject);
        this.graphics2.clear();
        this.graphics2.lineStyle(5, this._lineStylecolor.toNumber(true));
        this.graphics2.beginFill(this._beginFillcolor.toNumber(true));
        this.graphics2.arc(0, 0, this._radius, this.angle.min, qc_game.math.degToRad(this.angle.max), this.isFan);
        this.graphics2.endFill();
        var abby = this.gameObject.getChild('draMask');
        if (abby) {
            abby.addChild(this.graphics2);
        }
    }
}
qc.registerBehaviour('DrawFan', DrawFan);
