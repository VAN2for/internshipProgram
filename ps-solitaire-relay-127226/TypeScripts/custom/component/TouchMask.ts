namespace ps {
    /**
     * 全屏触摸遮罩
     * @author VaMP
     */
    export class TouchMask extends ps.Behaviour {
        /** 序列化 */
        private serializableFields: Object = {
        }
        constructor(gameObject: qc.Node) {
            super(gameObject);
            this.gameObject.interactive = true;
        }
        onDown() {
            ps.Print.red("游戏未开始,请调用gameStart()");
        }
    }
    qc.registerBehaviour('ps.TouchMask', TouchMask);
    TouchMask["__menu"] = 'Custom/TouchMask';
}