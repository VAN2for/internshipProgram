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
     * 无限循环背景，需配合Camera使用
     */
    var InfinityBg = /** @class */ (function (_super) {
        __extends(InfinityBg, _super);
        function InfinityBg() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            /** 序列化 */
            _this.serializableFields = {
                cameraNode: qc.Serializer.NODE,
                imgScale: qc.Serializer.NUMBER,
            };
            _this.imgScale = 1;
            return _this;
        }
        InfinityBg.prototype.awake = function () {
            if (this.cameraNode)
                this.cameraNode = this.gameObject.parent;
            this.camera = this.cameraNode.getComponent(ps.Camera);
            this.imgWidth = this.gameObject.width;
            this.imgHeight = this.gameObject.height;
            this.gameObject.width *= 3 * this.imgScale;
            this.gameObject.height *= 3 * this.imgScale;
            this.gameObject.imageType = qc.UIImage.IMAGE_TYPE_TILED;
        };
        InfinityBg.prototype.update = function () {
            //TODO 限制摄像机边缘的该如何更新位置
            if (!this.camera.limitEdgeX)
                this.gameObject.x = Math.ceil(this.camera.x / this.imgWidth) * this.imgWidth;
            if (!this.camera.limitEdgeY)
                this.gameObject.y = Math.ceil(this.camera.y / this.imgHeight) * this.imgHeight;
        };
        return InfinityBg;
    }(ps.Behaviour));
    ps.InfinityBg = InfinityBg;
    qc.registerBehaviour("ps.InfinityBg", InfinityBg);
    InfinityBg["__menu"] = "Custom/InfinityBg";
})(ps || (ps = {}));
//# sourceMappingURL=InfinityBg.js.map