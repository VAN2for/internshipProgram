namespace ps {
    /**
     * 开始按钮组件
     * @author VaMP
     */
    export class StartBtn extends ps.Behaviour {
        /** 序列化 */
        private serializableFields: Object = {
        }
        constructor(gameObject: qc.Node) {
            super(gameObject);
        }
        awake() {
            this.gameObject.interactive = true;
        }
        onDown() {
            ps.Tween.hideAlpha(startPanel, 300, 0, "remove");
            ps.mainState.start();
        }
    }
    qc.registerBehaviour('ps.StartBtn', StartBtn);
    StartBtn["__menu"] = 'Btn/StartBtn';
}