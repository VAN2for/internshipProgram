namespace ps.tween {
    /**
     * 循环旋转组件(帧更新类型)
     * @author VaMP
     */
    export class RotationFrame extends qc.Behaviour {
        playOnAwake = true;
        /** 角速度,默认为100，1秒转100度 */
        speed = 100;
        // 延迟执行时间，默认0
        delay: number = 0;
        /** 序列化 */
        protected serializableFields: Object = {
            playOnAwake: qc.Serializer.BOOLEAN,
            speed: qc.Serializer.NUMBER,
            delay: qc.Serializer.NUMBER,
        }
        play() {
            if (this.delay) {
                ps.timer.once(this.delay, () => {
                    this.playOnAwake = true;
                })
            } else {
                this.playOnAwake = true;
            }
        }
        update() {
            if (!this.playOnAwake) return;
            let angle = Mathf.radianToAngle(this.gameObject.rotation);
            this.gameObject.rotation = Mathf.angleToRadian(angle + this.speed * this.game.time.deltaTime / 1000);
        }
    }
    qc.registerBehaviour('ps.tween.RotationFrame', RotationFrame);
    RotationFrame["__menu"] = 'CustomTween/RotationFrame';
}