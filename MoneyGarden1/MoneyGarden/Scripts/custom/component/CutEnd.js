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
var CutEnd = /** @class */ (function (_super) {
    __extends(CutEnd, _super);
    function CutEnd(gameObject) {
        var _this = _super.call(this, gameObject) || this;
        /** 序列化 */
        _this.showTime = 300; //每一小格出现时间
        _this.hideTIme = 300; //每一小格隐藏时间
        _this.showTimeDelay = 600; //转场出现延迟时间
        _this.hideTImeDelay = 1200; //转场消失延迟时间
        _this.isPlay = true;
        _this.serializableFields = {
            showTime: qc.Serializer.NUMBER,
            hideTIme: qc.Serializer.NUMBER,
            showTimeDelay: qc.Serializer.NUMBER,
            hideTImeDelay: qc.Serializer.NUMBER,
            isPlay: qc.Serializer.BOOLEAN,
        };
        _this.turn_sps = [];
        return _this;
    }
    CutEnd.prototype.awake = function () {
        var sc = qc.Point;
        this.initTurnBox();
        if (!this.isPlay)
            return;
        this.playMove();
    };
    CutEnd.prototype.playMove = function () {
        var _this = this;
        qc_game.timer.add(this.showTimeDelay, function () {
            for (var i = 0; i < _this.turn_sps.length; i++) {
                ps.Tween.to(_this.turn_sps[i], { scale: 1 }, _this.showTime, undefined);
            }
        });
        qc_game.timer.add(this.hideTImeDelay, function () {
            for (var i = 0; i < _this.turn_sps.length; i++) {
                ps.Tween.to(_this.turn_sps[i], { scale: 0 }, _this.hideTIme, undefined);
            }
        });
    };
    CutEnd.prototype.initTurnBox = function () {
        var num = 17;
        var sz = 1334 / num;
        var r = sz / 2;
        var clrs = [
            "#71FF3B",
            "#B3FF3C",
            "#49FF3C",
            "#40DCFF",
            "#3F8AFD",
            "#EA1EFF",
            "#6B24FF",
            "#FEC63E",
            "#FC2D57",
            "#F1FF3C",
        ];
        for (var i = 0; i < num; i++) {
            for (var j = 0; j < num; j++) {
                var x = j * sz + r;
                var y = i * sz + r;
                var node = qc_game.add.node();
                node.width = sz;
                node.height = sz;
                node.x = x;
                node.y = y;
                node.pivotX = 0.5;
                node.pivotY = 0.5;
                var sp = new qc.Graphics(qc_game, this.gameObject);
                var clr = clrs[Math.floor(Math.random() * clrs.length)];
                var clo = new qc.Color(clr);
                sp.clear();
                sp.beginFill(clo.toNumber());
                sp.drawRect(0, 0, sz, sz);
                sp.endFill();
                sp.x = 0;
                sp.y = 0;
                node.addChild(sp);
                this.turn_sps.push(node);
                this.gameObject.addChild(node);
                node.scaleY = node.scaleX = 0;
            }
        }
    };
    return CutEnd;
}(qc.Behaviour));
qc.registerBehaviour('CutEnd', CutEnd);
