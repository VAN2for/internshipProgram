declare class DrawFan extends qc.Behaviour {
    /** 序列化 */
    private _Angle;
    private duration;
    private _radius;
    private isLoop;
    private isFan;
    private _beginFillcolor;
    private _lineStylecolor;
    private serializableFields;
    constructor(gameObject: qc.Node);
    private angle;
    awake(): void;
    private graphics2;
    draMask2(): void;
}
