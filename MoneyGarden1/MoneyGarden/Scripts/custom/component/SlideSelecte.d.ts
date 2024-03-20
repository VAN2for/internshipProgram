declare class SlideSelecte extends ps.Behaviour {
    /** 序列化 */
    tarArr: any;
    distance: number;
    checkTar: any;
    private serializableFields;
    constructor(gameObject: qc.Node);
    onStart(): void;
    private ox;
    private oy;
    onMouseDown(id: any, x: any, y: any): void;
    onMouseMove(id: any, x: any, y: any): void;
    pointList: any[];
    pickWood(x: any, y: any): void;
    getTar(): any;
}
