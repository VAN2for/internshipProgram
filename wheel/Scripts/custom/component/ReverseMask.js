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
var ps;
(function (ps) {
    /**
 * 反向遮罩组件，该组件只支持 WebGL模式
 *
 * @author badyoo
 * 需要对 graphics 属性进行绘画实现遮罩，或者往graphics里面添加显示对象
 */
    var ReverseMask = /** @class */ (function (_super) {
        __extends(ReverseMask, _super);
        function ReverseMask(gameObject) {
            var _this = _super.call(this, gameObject) || this;
            /**
             * 圆形效果遮罩的大小
             */
            _this.circleEffSize = 2000;
            _this.circleEffOffset = new qc.Point(0, 0); //原型效果原点
            _this.m_ratio = 0;
            /** 序列化 */
            _this.serializableFields = {
                circleEffSize: qc.Serializer.NUMBER,
                circleEffOffset: qc.Serializer.POINT
            };
            return _this;
        }
        Object.defineProperty(ReverseMask.prototype, "ratio", {
            get: function () {
                return this.m_ratio;
            },
            set: function (v) {
                this.m_ratio = v;
                this.graphics.clear();
                this.graphics.beginFill();
                this.graphics.drawCircle(this.circleEffOffset.x, this.circleEffOffset.y, this.circleEffSize * this.m_ratio);
                this.graphics.endFill();
                this.updateMask();
            },
            enumerable: false,
            configurable: true
        });
        ReverseMask.prototype.circleEff = function () {
            this.ratio = 1;
            game.add.tween(this).to({ ratio: 0 }, 1000, Phaser.Easing.Linear.None, true);
        };
        ReverseMask.prototype.awake = function () {
            var node = ReverseMask.newMask(this.gameObject, this.gameObject.width, this.gameObject.height);
            this.cacheAsBitmap = node.getScript('qc.CacheAsBitmap');
            this.graphics = node.find("graphics");
            this.bgGraphics = node.find("bgGraphics");
        };
        /**
         * 更新绘制对象后需要手动更新一次
         */
        ReverseMask.prototype.updateMask = function () {
            this.cacheAsBitmap.dirty = true;
        };
        ReverseMask.newMask = function (node, width, height, color, alpha) {
            if (color === void 0) { color = 0; }
            if (alpha === void 0) { alpha = 1; }
            if (PIXI["blendModesWebGL"] && PIXI["blendModesWebGL"][17] == null)
                PIXI["blendModesWebGL"][17] = [game.renderer["gl"].ZERO, game.renderer["gl"].ZERO];
            var g = new qc.Graphics(qc_game, node);
            g.name = "bgGraphics";
            // g.beginFill(0,0.7);
            // g.drawRect(-width>>1,-height>>1,width,height);
            // g.endFill();
            var g = new qc.Graphics(qc_game, node);
            g.name = "graphics";
            g.blendMode = 17;
            // g.beginFill();
            // g.drawCircle(0,0,300);
            // g.endFill();
            var cacheAsBitmap = node.addScript('qc.CacheAsBitmap');
            return node;
        };
        return ReverseMask;
    }(ps.Behaviour));
    ps.ReverseMask = ReverseMask;
    qc.registerBehaviour('ps.ReverseMask', ReverseMask);
    ReverseMask["__menu"] = 'Custom/ReverseMask';
})(ps || (ps = {}));
//# sourceMappingURL=ReverseMask.js.map