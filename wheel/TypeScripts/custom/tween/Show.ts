namespace ps.tween {
    /**
     * 出现组件，目前有两种模式,放大出现与渐现出现
     * @author VaMP
     */
    export class Show extends ps.tween.TweenBase {
        type: "zoom" | "alpha" = "zoom";
        endValue = 1;
        private oldValue = { alpha: undefined, scaleX: undefined, scaleY: undefined };
        /** 序列化 */
        protected serializableFields: Object = {
            playOnAwake: qc.Serializer.BOOLEAN,
            type: qc.Serializer.STRING,
            duration: qc.Serializer.NUMBER,
            endValue: qc.Serializer.NUMBER,
            delay: qc.Serializer.NUMBER,
        }
        play() {
            if (!this.tween) {
                this.oldValue.alpha = this.gameObject.alpha;
                this.oldValue.scaleX = this.gameObject.scaleX;
                this.oldValue.scaleY = this.gameObject.scaleY;
                switch (this.type) {
                    case "zoom": this.tween = Tween.showZoom(this, this.duration, this.endValue, this.delay); break;
                    case "alpha": this.tween = Tween.showAlpha(this, this.duration, this.endValue, this.delay); break;
                }
            } else {
                if (!this.tween.isPaused) {
                    this.pause();
                } else {
                    this.resume();
                }
            }
        }
        reset() {
            this.tween = undefined;
            for (let key in this.oldValue) {
                if (this.oldValue[key] != undefined)
                    this.gameObject[key] = this.oldValue[key];
            }
        }
    }
    qc.registerBehaviour('ps.tween.Show', Show);
    Show["__menu"] = 'CustomTween/Show';
}