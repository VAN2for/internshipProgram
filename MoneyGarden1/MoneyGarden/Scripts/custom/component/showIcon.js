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
var showIcon = /** @class */ (function (_super) {
    __extends(showIcon, _super);
    function showIcon(gameObject) {
        var _this = _super.call(this, gameObject) || this;
        _this._scale = 1; //缩放值
        _this.disappearTime = 300; //消失时间
        _this.showTime = 300; //出现时间
        _this.serializableFields = {
            iconSKin: qc.Serializer.TEXTURE,
            _scale: qc.Serializer.NUMBER,
            disappearTime: qc.Serializer.NUMBER,
            showTime: qc.Serializer.NUMBER,
        };
        return _this;
    }
    showIcon.prototype.awake = function () {
    };
    showIcon.prototype.onClick = function (e) {
        var _this = this;
        //点击出现icon
        var x = e.source.x;
        var y = e.source.y;
        var icon = new qc.UIImage(qc_game);
        var gamePlay = this.gameObject;
        gamePlay.addChild(icon);
        var abby = gamePlay.parent; //获取缩放值
        icon.x = x / abby.scaleX;
        icon.y = y / abby.scaleY;
        icon.texture = this.iconSKin;
        icon.pivotX = 0.5;
        icon.pivotY = 0.5;
        icon.scaleX = 0;
        icon.scaleY = 0;
        icon.resetNativeSize();
        ps.Tween.to(icon, { scaleX: this._scale, scaleY: this._scale }, this.showTime, Phaser.Easing.Back.Out, 0).onComplete.addOnce(function () {
            ps.Tween.to(icon, { scaleX: 0, scaleY: 0 }, _this.showTime, undefined, _this.disappearTime).onComplete.addOnce(function () {
                _this.gameObject.removeChild(icon);
            });
        });
    };
    return showIcon;
}(qc.Behaviour));
qc.registerBehaviour('showIcon', showIcon);
