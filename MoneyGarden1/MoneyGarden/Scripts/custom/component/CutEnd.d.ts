declare class CutEnd extends qc.Behaviour {
    /** 序列化 */
    showTime: number;
    hideTIme: number;
    showTimeDelay: number;
    hideTImeDelay: number;
    isPlay: boolean;
    private serializableFields;
    constructor(gameObject: qc.Node);
    awake(): void;
    playMove(): void;
    turn_sps: any[];
    initTurnBox(): void;
}
