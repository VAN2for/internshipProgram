declare class State extends qc.Behaviour {
    states: qc.Texture[];
    private serializableFields;
    constructor(gameObject: qc.Node);
    changeState(id: number, resize?: boolean): void;
    protected awake(): void;
    protected update(): void;
}
