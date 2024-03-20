declare function ratioYtoAxisY(y: number): number;
declare class KLine extends ps.Behaviour {
    randomMin: number;
    randomMax: number;
    /** 序列化 */
    private serializableFields;
    constructor(gameObject: qc.Node);
    onResize(): void;
    onStart(): void;
    drawingPoint: {
        startX: number;
        _x: number;
        _y: number;
        ratioY: number;
        vertexPoints: {
            x: number;
            y: number;
        }[];
        render: Function;
    };
    defineKLine(): void;
    currentX: number;
    moveInterval: number;
    tweenTime: number;
    xStep: number;
    focusOnAxisX: number;
    needMoveCamera: boolean;
    kLineTimer: qc.TimerEvent;
    initRandomRange: {
        minNum: number;
        maxNum: number;
    };
    drawKLine(points?: number[], finishCallBack?: Function, stepCallBack?: Function): void;
    resumeKline(): void;
    stopLine(): void;
}
