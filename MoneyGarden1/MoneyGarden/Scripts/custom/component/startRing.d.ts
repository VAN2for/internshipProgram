declare class startRing extends qc.Behaviour {
    /** 序列化 */
    ringSkin: any;
    moveTarget: qc.Node;
    autoPlay: boolean;
    ringNum: number;
    scaleXY: number;
    moveTime: number;
    private serializableFields;
    constructor(gameObject: qc.Node);
    awake(): void;
    playOne(): void;
    showRing(tar: any): void;
    moveToTarget(target: qc.Node, img: any, time: any, result: boolean, offset?: qc.Point): void;
}
