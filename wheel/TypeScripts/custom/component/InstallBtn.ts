namespace ps.btn {
    /**
     * 安装按钮组件
     * @author VaMP
     */
    export class InstallBtn extends qc.Behaviour {
        /** 点击的同时自动跳转gameEnd */
        autoGameEnd = false;
        /** 自动放大缩小比例，0为不缩放。默认为0 */
        scale: number = 0;
        /** 缩放间隔时间，单位毫秒，默认500 */
        duration: number = 500;
        delay = 0;
        installType: InstallType = InstallType.None;
        private _isEaseQuadInOut = false;
        private _isDown = true;
        private tween: Phaser.Tween;

        private serializableFields: Object = {
            autoGameEnd: qc.Serializer.BOOLEAN,
            scale: qc.Serializer.NUMBER,
            duration: qc.Serializer.NUMBER,
            delay: qc.Serializer.NUMBER,
            installType: qc.Serializer.AUTO,
            _isEaseQuadInOut: qc.Serializer.BOOLEAN,
            _isDown: qc.Serializer.BOOLEAN,
        };

        constructor(gameObject: qc.Node) {
            super(gameObject);
        }
        awake() {
            this.gameObject.interactive = true;
            //谷歌平台不允许按钮缩放
            if (this.scale != 0 && channel != "google") {
                this.gameObject.pivotX = 0.5;
                this.gameObject.pivotY = 0.5;
                const easing = this._isEaseQuadInOut ? XTween.Easing.Quadratic.InOut : XTween.Easing.Linear.None;
                ps.xtween(this.gameObject).delay(this.delay).repeatForever(true,
                    ps.xtween(this.gameObject).by(this.duration, { scaleX: this.scale, scaleY: this.scale }, { easing })
                ).start();
            }
        }
        onEnable() {
            if (this.tween) this.tween.resume();
        }
        onDisable() {
            if (this.tween) this.tween.pause();
        }
        onDown() {
            if (!this._isDown) {
                return;
            }
            install(this.installType);
        }
        onClick() {
            if (this._isDown) {
                return;
            }
            install(this.installType);
        }
    }
    qc.registerBehaviour("ps.InstallBtn", InstallBtn);
    InstallBtn["__menu"] = "Btn/InstallBtn";
}
