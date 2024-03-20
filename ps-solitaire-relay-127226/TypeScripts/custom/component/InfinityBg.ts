namespace ps {
    /**
     * 无限循环背景，需配合Camera使用
     */
    export class InfinityBg extends ps.Behaviour {
        /** 序列化 */
        private serializableFields: Object = {
            cameraNode: qc.Serializer.NODE,
            imgScale: qc.Serializer.NUMBER,
        };
        private cameraNode: qc.Node;
        private imgScale = 1;
        //
        private camera: ps.Camera;
        private imgWidth: number;
        private imgHeight: number;

        awake() {
            if (this.cameraNode) this.cameraNode = this.gameObject.parent;
            this.camera = this.cameraNode.getComponent(ps.Camera);
            this.imgWidth = this.gameObject.width;
            this.imgHeight = this.gameObject.height;
            this.gameObject.width *= 3 * this.imgScale;
            this.gameObject.height *= 3 * this.imgScale;
            (this.gameObject as qc.UIImage).imageType = qc.UIImage.IMAGE_TYPE_TILED;
        }
        update() {
            //TODO 限制摄像机边缘的该如何更新位置
            if (!this.camera.limitEdgeX)
                this.gameObject.x = Math.ceil(this.camera.x / this.imgWidth) * this.imgWidth;
            if (!this.camera.limitEdgeY)
                this.gameObject.y = Math.ceil(this.camera.y / this.imgHeight) * this.imgHeight;
        }
    }
    qc.registerBehaviour("ps.InfinityBg", InfinityBg);
    InfinityBg["__menu"] = "Custom/InfinityBg";
}
