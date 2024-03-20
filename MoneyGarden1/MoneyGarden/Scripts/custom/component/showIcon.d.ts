declare class showIcon extends qc.Behaviour {
    /** 序列化 */
    iconSKin: any;
    _scale: number;
    disappearTime: number;
    showTime: number;
    private serializableFields;
    constructor(gameObject: qc.Node);
    awake(): void;
    onClick(e: qc.PointerEvent): void;
}
