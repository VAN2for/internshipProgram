namespace ps {
    /**
     * 背景颜色组件
     * @author VaMP
     */
    export class BgMask extends qc.Behaviour {
        private _color = new qc.Color("000000");
        /** 序列化 */
        private serializableFields: Object = {
            color: qc.Serializer.COLOR
        }
        constructor(gameObject: qc.Node) {
            super(gameObject);
            this.runInEditor = true;
        }
        awake() {
            this.refresh();
        }
        set color(c: qc.Color) {
            this._color = c;
            this.refresh();
        }
        get color() {
            return this._color;
        }
        private refresh() {
            let graphics = this.gameObject as qc.Graphics;
            graphics.clear();
            graphics.beginFill(this.color.toNumber(false));
            graphics.drawRect(0, 0, DESIGN_LONG, DESIGN_LONG);
            graphics.endFill();
        }
    }
    qc.registerBehaviour('ps.BgMask', BgMask);
    BgMask["__menu"] = 'Custom/BgMask';
}