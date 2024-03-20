declare class RubberBand extends qc.Behaviour {
    /** 序列化 */
    spd: number;
    isPlay: boolean;
    isHAni: boolean;
    private serializableFields;
    constructor(gameObject: qc.Node);
    awake(): void;
    rubberBandAni(): void;
}
