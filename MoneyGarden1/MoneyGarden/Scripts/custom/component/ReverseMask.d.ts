declare namespace ps {
    /**
 * 反向遮罩组件，该组件只支持 WebGL模式
 *
 * @author badyoo
 * 需要对 graphics 属性进行绘画实现遮罩，或者往graphics里面添加显示对象
 */
    class ReverseMask extends ps.Behaviour {
        /**
         * 遮罩的绘制对象
         */
        graphics: qc.Graphics;
        /**
         * 遮罩背景的绘制对象
         */
        bgGraphics: qc.Graphics;
        /**
         * 圆形效果遮罩的大小
         */
        circleEffSize: number;
        circleEffOffset: qc.Point;
        private cacheAsBitmap;
        private m_ratio;
        /** 序列化 */
        private serializableFields;
        constructor(gameObject: qc.Node);
        get ratio(): number;
        set ratio(v: number);
        circleEff(): void;
        awake(): void;
        /**
         * 更新绘制对象后需要手动更新一次
         */
        updateMask(): void;
        static newMask(node: qc.Node, width: number, height: number, color?: number, alpha?: number): qc.Node;
    }
}
