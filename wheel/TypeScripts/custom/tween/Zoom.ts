namespace ps.tween {
    /**
     * 循环缩放组件
     * @author VaMP
     */
    export class Zoom extends TweenBase {
        /** 自动放大缩小比例，0为不缩放。默认为0.1 */
        scale: number = 0.1;
        /** 序列化 */
        protected serializableFields: Object = {
            playOnAwake: qc.Serializer.BOOLEAN,
            scale: qc.Serializer.NUMBER,
            duration: qc.Serializer.NUMBER,
            delay: qc.Serializer.NUMBER,
        }
        /** 播放 */
        play() {
            if (!this.tween) {
                this.tween = Tween.zoom(this.gameObject, this.scale, this.duration, this.delay);
            } else {
                this.resume();
            }
        }
    }
    qc.registerBehaviour('ps.tween.Zoom', Zoom);
    Zoom["__menu"] = 'CustomTween/Zoom';
}