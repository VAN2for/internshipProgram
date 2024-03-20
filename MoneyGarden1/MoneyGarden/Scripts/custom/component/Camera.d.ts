declare namespace ps {
    /**
     * 摄像机，挂在容器上
     * @author  VaMP
     */
    class Camera extends ps.Behaviour {
        /** 序列化 */
        private serializableFields;
        /** 是否限制边缘 */
        limitEdgeX: boolean;
        limitEdgeY: boolean;
        set x(v: number);
        get x(): number;
        set y(v: number);
        get y(): number;
        private _x;
        private _y;
        pos(x: number, y: number): void;
        onResize(): void;
    }
}
