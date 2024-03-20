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
var startRing = /** @class */ (function (_super) {
    __extends(startRing, _super);
    function startRing(gameObject) {
        var _this = _super.call(this, gameObject) || this;
        _this.autoPlay = true; //是否自动播放
        _this.ringNum = 10; //展示图片数量
        _this.scaleXY = 1; //展示图片的大小
        _this.moveTime = 300; //移动所花时间
        _this.serializableFields = {
            ringSkin: qc.Serializer.TEXTURES,
            moveTarget: qc.Serializer.NODE,
            autoPlay: qc.Serializer.BOOLEAN,
            ringNum: qc.Serializer.NUMBER,
            scaleXY: qc.Serializer.NUMBER,
            moveTime: qc.Serializer.NUMBER,
        };
        return _this;
    }
    startRing.prototype.awake = function () {
        if (this.autoPlay) {
            for (var i = 0; i < this.ringNum; i++) {
                this.showRing(this.gameObject);
            }
        }
    };
    startRing.prototype.playOne = function () {
        this.awake();
    };
    startRing.prototype.showRing = function (tar) {
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
        var _x = Math.random() * 180 - 90 + img.x;
        var _y = Math.random() * 180 - 90 + img.y;
        var _time = Math.random() * 200 + 200;
        ps.Tween.to(img, { x: _x, y: _y }, _time).onComplete.addOnce(function (e) {
            var _mtime = Math.random() * this.moveTime + this.moveTime + 100;
            this.moveToTarget(moveTarget, img, _mtime, true);
        }, this);
    };
    startRing.prototype.moveToTarget = function (target, img, time, result, offset) {
        if (offset === void 0) { offset = new qc.Point; }
        var pos = ps.Tools.transPos(target, img, offset);
        ps.Tween.to(img, { x: pos.x, y: pos.y }, time, Phaser.Easing.Sinusoidal.InOut).onComplete.addOnce(function () {
            if (result) {
                target.removeChild(img);
                img.visible = false;
            }
        });
    };
    return startRing;
}(qc.Behaviour));
qc.registerBehaviour('startRing', startRing);
//# sourceMappingURL=startRing.js.map