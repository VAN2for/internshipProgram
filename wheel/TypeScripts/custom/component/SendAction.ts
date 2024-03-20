namespace ps {
    /**
     * 埋点组件,挂载的对象被点击时，会发送埋点信息
     * @author VaMP
     */
    export class SendAction extends Behaviour {
        action = 1;
        private _isDown = true;
        /** 序列化 */
        private serializableFields = {
            action: qc.Serializer.NUMBER,
            _isDown: qc.Serializer.BOOLEAN,
        };

        awake() {
            this.gameObject.interactive = true;
        }
        onDown() {
            if (!this._isDown) {
                return;
            }
            sendAction(this.action);
        }
        onClick() {
            if (this._isDown) {
                return;
            }
            sendAction(this.action);
        }
    }
    qc.registerBehaviour('ps.SendAction', SendAction);
    SendAction["__menu"] = 'Custom/SendAction';
}