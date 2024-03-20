namespace ps {
    /**
     * 可以运行代码的组件
     * @author VaMP
     */
    export class RunCode extends ps.Behaviour {
        awakeCode = "";
        onStartCode = "";
        onDownCode = "";
        onEndCode = "";
        /** 序列化 */
        private serializableFields: Object = {
            awakeCode: qc.Serializer.STRING,
            onStartCode: qc.Serializer.STRING,
            onDownCode: qc.Serializer.STRING,
            onEndCode: qc.Serializer.STRING
        }
        awake() {
            new Function(this.awakeCode).bind(this)();
            if (this.onDownCode != "") this.gameObject.interactive = true;
        }
        onStart() {
            new Function(this.onStartCode).bind(this)();
        }
        onDown() {
            new Function(this.onDownCode).bind(this)();
        }
        onEnd(result: boolean) {
            new Function("result", this.onEndCode).bind(this)(result);
        }
    }
    qc.registerBehaviour('ps.RunCode', RunCode);
    RunCode["__menu"] = 'Custom/RunCode';
}