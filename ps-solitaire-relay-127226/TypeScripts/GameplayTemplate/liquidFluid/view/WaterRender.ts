class WaterRender {
    public bmd: Phaser.BitmapData;
    public waterDropImgBin: string;

    constructor(private waterImg: qc.Node, private width: number, private height: number) {
        this.bmd = game.make.bitmapData(width, height);
    }
    /**
     *
     * @param drawSprite 要绘制的图片
     * @param texture2d 被绘制的纹理2D
     * @returns
     */
    updateTexture(root: qc.Node) {
        //更新BMD
        this.bmd.clear();
        for (let drop of root.children) {
            const pos = this.waterImg.toLocal(drop.getWorldPosition());
            this.bmd.draw(this.waterDropImgBin, pos.x - 50, pos.y - 50);
        }
        this.bmd.update();
        this.process();
    }
    process() {
        this.bmd.processPixelRGB(this.ppp, this);
    }
    private ppp(pixel: { a: number; r: number; g: number; b: number }) {
        if (pixel.a === 0) return;
        var a = pixel.a;
        if (a >= ps.METACLIP2) {
            pixel.r = ps.COLOR_WATER[0];
            pixel.g = ps.COLOR_WATER[1];
            pixel.b = ps.COLOR_WATER[2];
            pixel.a = 255;
        } else if (a >= ps.METACLIP) {
            pixel.r = ps.COLOR_WATER_EDGE[0];
            pixel.g = ps.COLOR_WATER_EDGE[1];
            pixel.b = ps.COLOR_WATER_EDGE[2];
            pixel.a = 255;
        } else {
            pixel.a = 0;
        }
        return pixel;
    }
}
