namespace ps.btn {
    /**
     * 安装按钮组件
     * @author VaMP
     */
    export class InduceInstallBtn extends qc.Behaviour {
        /** 点击的同时自动跳转gameEnd */
        autoGameEnd = false;
        /** 自动放大缩小比例，0为不缩放。默认为0 */
        scale: number = 0;
        /** 缩放间隔时间，单位毫秒，默认500 */
        duration: number = 500;
        delay = 0;

        /** 诱导跳转下的文案Key */
        youDaoText: string = "";
        private tween: Phaser.Tween;

        private serializableFields: Object = {
            autoGameEnd: qc.Serializer.BOOLEAN,
            scale: qc.Serializer.NUMBER,
            duration: qc.Serializer.NUMBER,
            delay: qc.Serializer.NUMBER,
            installType: qc.Serializer.AUTO,
            youDaoText: qc.Serializer.STRING
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
                ps.timer.once(this.delay, () => {
                    this.tween = ps.Tween.zoom(this.gameObject, this.scale, this.duration);
                });
            }

            let youdaotext = this.gameObject.getChildAt(0) as qc.UIText;
            if (ps.disable_yd_click() && youdaotext) {
                languagesMgr.updateLabel(youdaotext, this.youDaoText);
            }

        }

        onEnable() {
            if (this.tween) this.tween.resume();
        }
        onDisable() {
            if (this.tween) this.tween.pause();
        }
        onDown() {
            let installType = ps.disable_yd_click() ? InstallType.None : InstallType.YouDao;
            ps.install(installType);
        }
    }
    qc.registerBehaviour("ps.InduceInstallBtn", InduceInstallBtn);
    InduceInstallBtn["__menu"] = "Btn/InduceInstallBtn";
}
