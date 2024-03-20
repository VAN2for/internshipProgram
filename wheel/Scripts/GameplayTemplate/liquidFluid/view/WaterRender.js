var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var WaterRender = /** @class */ (function () {
    function WaterRender(waterImg, width, height) {
        this.waterImg = waterImg;
        this.width = width;
        this.height = height;
        this.bmd = game.make.bitmapData(width, height);
    }
    /**
     *
     * @param drawSprite 要绘制的图片
     * @param texture2d 被绘制的纹理2D
     * @returns
     */
    WaterRender.prototype.updateTexture = function (root) {
        var e_1, _a;
        //更新BMD
        this.bmd.clear();
        try {
            for (var _b = __values(root.children), _c = _b.next(); !_c.done; _c = _b.next()) {
                var drop = _c.value;
                var pos = this.waterImg.toLocal(drop.getWorldPosition());
                this.bmd.draw(this.waterDropImgBin, pos.x - 50, pos.y - 50);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
        this.bmd.update();
        this.process();
    };
    WaterRender.prototype.process = function () {
        this.bmd.processPixelRGB(this.ppp, this);
    };
    WaterRender.prototype.ppp = function (pixel) {
        if (pixel.a === 0)
            return;
        var a = pixel.a;
        if (a >= ps.METACLIP2) {
            pixel.r = ps.COLOR_WATER[0];
            pixel.g = ps.COLOR_WATER[1];
            pixel.b = ps.COLOR_WATER[2];
            pixel.a = 255;
        }
        else if (a >= ps.METACLIP) {
            pixel.r = ps.COLOR_WATER_EDGE[0];
            pixel.g = ps.COLOR_WATER_EDGE[1];
            pixel.b = ps.COLOR_WATER_EDGE[2];
            pixel.a = 255;
        }
        else {
            pixel.a = 0;
        }
        return pixel;
    };
    return WaterRender;
}());
//# sourceMappingURL=WaterRender.js.map