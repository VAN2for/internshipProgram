namespace ps {
    /**
     * 控制面板，进行触摸操作会发送GameEvent事件
     * @author VaMP
     */
    class CtrlPanel extends ps.Behaviour {
        /** 序列化 */
        private serializableFields: Object = {
            clickEvent: qc.Serializer.STRING,
            downEvent: qc.Serializer.STRING,
            upEvent: qc.Serializer.STRING,
            dragEvent: qc.Serializer.STRING,
        };
        clickEvent: string;
        downEvent: string;
        upEvent: string;
        dragEvent: string;
        constructor(gameObject: qc.Node) {
            super(gameObject);
        }
        onClick(e: qc.PointerEvent) {
            if (this.clickEvent && this.clickEvent != "") gameEvent.event(this.clickEvent, e);
        }
        onDown(e: qc.PointerEvent) {
            if (this.downEvent && this.downEvent != "") gameEvent.event(this.downEvent, e);
        }
        onUp(e: qc.PointerEvent) {
            if (this.upEvent && this.upEvent != "") gameEvent.event(this.upEvent, e);
        }
        onDrag(e: qc.PointerEvent) {
            if (this.dragEvent && this.dragEvent != "") gameEvent.event(this.dragEvent, e);
        }
    }
    qc.registerBehaviour("CtrlPanel", CtrlPanel);
}
