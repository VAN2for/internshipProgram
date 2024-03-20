namespace ps.tween {
    /**
     * 循环缓动组件基类
     * @author VaMP
     */
    export class TweenBase extends ps.Behaviour {
        playOnAwake: boolean = true;
        // 花费的时间
        duration: number = 500;
        // 延迟执行时间，默认0
        delay: number = 0;
        //缓动对象
        protected tween: Phaser.Tween;
        /** 序列化 */
        protected serializableFields: Object = {
            playOnAwake: qc.Serializer.BOOLEAN,
            playOnStart: qc.Serializer.BOOLEAN,
            duration: qc.Serializer.NUMBER,
            delay: qc.Serializer.NUMBER,
        }
        awake() {
            if (this.playOnAwake) this.play();
        }
        onEnable() {
            if (this.tween) this.resume();
        }
        onDisable() {
            if (this.tween) this.pause();
        }
        /**
         * 播放
         */
        play() {

        }
        /**
         * 暂停
         */
        pause() {
            if (this.tween) this.tween.pause();
        }
        /**
         * 恢复
         */
        resume() {
            if (this.tween) this.tween.resume();
        }
        onDestroy() {
            if (this.tween) this.tween.stop();
        }
    }
}