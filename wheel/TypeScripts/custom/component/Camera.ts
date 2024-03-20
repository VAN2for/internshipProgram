namespace ps {
    /**
     * 摄像机，挂在容器上
     * @author  VaMP
     */
    export class Camera extends ps.Behaviour {
        /** 序列化 */
        private serializableFields: Object = {
            x: qc.Serializer.NUMBER,
            y: qc.Serializer.NUMBER,
            limitEdgeX: qc.Serializer.BOOLEAN,
            limitEdgeY: qc.Serializer.BOOLEAN,
        };
        /** 是否限制边缘 */
        limitEdgeX = true;
        limitEdgeY = true;
        set x(v: number) {
            this.pos(v, this.y);
        }
        get x() {
            return this._x;
        }
        set y(v: number) {
            this.pos(this.x, v);
        }
        get y() {
            return this._y;
        }
        private _x: number = 0;
        private _y: number = 0;

        pos(x: number, y: number) {
            this._x = x;
            this._y = y;
            let sw = ScrFix.width / this.gameObject.scaleX;
            let sh = ScrFix.height / this.gameObject.scaleY;
            let tx = -this.x + sw / 2;
            let ty = -this.y + sh / 2;
            if (this.limitEdgeX) {
                if (tx > 0) tx = 0;
                if (tx < -this.gameObject.width + sw) tx = -this.gameObject.width + sw;
            }
            if (this.limitEdgeY) {
                if (ty > 0) ty = 0;
                if (ty < -this.gameObject.height + sh) ty = -this.gameObject.height + sh;
            }
            //中心点位置偏移
            tx += this.gameObject.pivotX * this.gameObject.width;
            ty += this.gameObject.pivotY * this.gameObject.height;
            //缩放
            tx *= this.gameObject.scaleX;
            ty *= this.gameObject.scaleY;
            //
            this.gameObject.x = tx;
            this.gameObject.y = ty;
        }
        onResize() {
            this.pos(this.x, this.y);
        }
    }
    qc.registerBehaviour("Camera", Camera);
}
