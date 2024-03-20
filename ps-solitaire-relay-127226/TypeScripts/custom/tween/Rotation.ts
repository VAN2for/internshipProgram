namespace ps.tween {
    /**
     * 循环旋转组件
     * @author VaMP
     */
    export class Rotation extends TweenBase {
        /** 角速度,默认为100，1秒转100度 */
        speed: number = 100;
        /** 序列化 */
        protected serializableFields: Object = {
            playOnAwake: qc.Serializer.BOOLEAN,
            speed: qc.Serializer.NUMBER,
            delay: qc.Serializer.NUMBER,
        }
        /** 播放 */
        play() {
            if (!this.tween) {
                this.tween = Tween.rotationLoop(this.gameObject, this.speed);
            } else {
                this.resume();
            }
        }
        // awake() {
        //     //if (this.playOnAwake) this.play();
        // }
        // play() {
        //     this.playOnAwake = true;
        // }
        // update() {
        //     if (!this.playOnAwake) return ；
        //     let angle = Mathf.radianToAngle(this.gameObject.rotation);
        //     this.gameObject.rotation = Mathf.angleToRadian(angle + this.speed * qc_game.time.deltaTime / 1000);
        // }
    }
    qc.registerBehaviour('ps.tween.Rotation', Rotation);
    Rotation["__menu"] = 'CustomTween/Rotation';
}