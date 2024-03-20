var ps;
(function (ps) {
    /** 水滴资源图 */
    ps.WATER_IMG_BIN = "resource/common/drop.bin";
    /** 根据资源图的透明度来融合成水和水的边缘，水 */
    ps.METACLIP = 230;
    /** 根据资源图的透明度来融合成水和水的边缘，水的边缘 */
    ps.METACLIP2 = 240;
    /** 水的RGB值 */
    ps.COLOR_WATER = [48, 238, 255];
    /** 水边缘的RGB值 */
    ps.COLOR_WATER_EDGE = [255, 255, 255];
})(ps || (ps = {}));
//# sourceMappingURL=WaterDefs.js.map