var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var DrawFan = /** @class */ (function (_super) {
    __extends(DrawFan, _super);
    function DrawFan(gameObject) {
        var _this = _super.call(this, gameObject) || this;
        /** 序列化 */
        _this._Angle = 360; //所绘的角度
        _this.duration = 3; //绘角度度时长
        _this._radius = 150; //半径
        _this.isLoop = false; //是否循环
        _this.isFan = true; //画扇形或圆形
        _this._beginFillcolor = new qc.Color("000000");
        _this._lineStylecolor = new qc.Color("ffffff");
        _this.serializableFields = {
            duration: qc.Serializer.NUMBER,
            isLoop: qc.Serializer.BOOLEAN,
            isFan: qc.Serializer.BOOLEAN,
            _beginFillcolor: qc.Serializer.COLOR,
            _lineStylecolor: qc.Serializer.COLOR,
            _Angle: qc.Serializer.NUMBER,
            _radius: qc.Serializer.NUMBER
        };
        _this.angle = { min: 0, max: 0 };
        return _this;
    }
    DrawFan.prototype.awake = function () {
        game.add.tween(this.angle).to({ max: this._Angle }, this.duration * 1000, "Linear", true, 0, -1, this.isLoop).onUpdateCallback(this.draMask2, this);
    };
    DrawFan.prototype.draMask2 = function () {
        if (!this.graphics2)
            this.graphics2 = new qc.Graphics(qc_game, this.gameObject);
        this.graphics2.clear();
        this.graphics2.lineStyle(5, this._lineStylecolor.toNumber(true));
        this.graphics2.beginFill(this._beginFillcolor.toNumber(true));
        this.graphics2.arc(0, 0, this._radius, this.angle.min, qc_game.math.degToRad(this.angle.max), this.isFan);
        this.graphics2.endFill();
        var abby = this.gameObject.getChild('draMask');
        if (abby) {
            abby.addChild(this.graphics2);
        }
    };
    return DrawFan;
}(qc.Behaviour));
qc.registerBehaviour('DrawFan', DrawFan);
