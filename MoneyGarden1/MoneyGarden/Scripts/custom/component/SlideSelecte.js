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
var SlideSelecte = /** @class */ (function (_super) {
    __extends(SlideSelecte, _super);
    function SlideSelecte(gameObject) {
        var _this = _super.call(this, gameObject) || this;
        _this.distance = 20; //滑动接触成功距离
        _this.serializableFields = {
            tarArr: qc.Serializer.NODES,
            distance: qc.Serializer.NUMBER,
        };
        //起始位置
        _this.ox = 0;
        _this.oy = 0;
        _this.pointList = [];
        return _this;
    }
    SlideSelecte.prototype.onStart = function () {
        qc_game.input.onPointerMove.add(this.onMouseMove, this); //鼠标开始滑动
        qc_game.input.onPointerDown.add(this.onMouseDown, this); //鼠标按下
    };
    SlideSelecte.prototype.onMouseDown = function (id, x, y) {
        this.ox = x;
        this.oy = y;
        this.pickWood(x, y);
    };
    SlideSelecte.prototype.onMouseMove = function (id, x, y) {
        this.pickWood(x, y);
    };
    SlideSelecte.prototype.pickWood = function (x, y) {
        var pos;
        var dis;
        this.pointList = ps.Mathf.pointListByDensity(this.ox, this.oy, x, y);
        for (var i = 0; i < this.tarArr.length; i++) {
            pos = ps.Tools.transPos(this.tarArr[i], this.gameObject);
            var tar = this.tarArr[i];
            for (var i_1 = 0; i_1 < this.pointList.length; i_1++) {
                dis = ps.Mathf.getDistance(this.pointList[i_1].x, this.pointList[i_1].y, pos.x, pos.y);
                if (dis < this.distance && dis >= 0) {
                    this.checkTar = tar;
                    break;
                }
            }
        }
    };
    SlideSelecte.prototype.getTar = function () {
        if (!this.checkTar)
            return;
        return this.checkTar;
    };
    return SlideSelecte;
}(ps.Behaviour));
qc.registerBehaviour('SlideSelecte', SlideSelecte);
