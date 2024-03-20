namespace ps {
    /**
     * 摄像机跟随，挂在有相机的对象上
     * @author  VaMP
     */
    export class CameraFollow extends qc.Behaviour {
        /** 序列化 */
        private serializableFields: Object = {
            followNode: qc.Serializer.NODE,
            offset: qc.Serializer.POINT,
            dumplambda: qc.Serializer.NUMBER,
        };
        followNode: qc.Node;
        offset: qc.Point = new qc.Point();
        dumplambda = 10;
        private camera: ps.Camera;
        awake() {
            this.camera = this.gameObject.getComponent(ps.Camera);
        }
        initCameraPosition(): void {
            let position = this.gameObject.getWorldPosition();
            position = this.gameObject.toLocal(position);
            this.camera.pos(position.x, position.y);
        }
        postUpdate() {
            if (this.followNode == null) return;
            let p = this.followNode.toGlobal(
                new qc.Point(
                    this.gameObject.pivotX * this.gameObject.width,
                    this.gameObject.pivotY * this.gameObject.height
                )
            );
            p = this.gameObject.toLocal(p);
            let x = p.x - this.offset.x;
            let y = p.y - this.offset.y;
            const deltaTime = qc_game.time.deltaTime / 5000;
            x = Mathf.damp(this.camera.x, x, this.dumplambda);
            y = Mathf.damp(this.camera.y, y, this.dumplambda);
            this.camera.pos(x, y);
        }
    }
    qc.registerBehaviour("CameraFollow", CameraFollow);
}
