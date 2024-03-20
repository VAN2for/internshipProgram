declare namespace ps {
    enum DraggableItemEvent {
        onDown = "onDown",
        onUp = "onUp",
        onClick = "onClick",
        onDragStart = "onDragStart",
        onDragEnd = "onDragEnd",
        TriggerTarget = "TriggerTarget",
        MissTarget = "MissTarget",
        toOrgComplete = "toOrgComplete",
        toTargetComplete = "toTargetComplete",
        HitTarget = "HitTarget",
        AwayTarget = "AwayTarget"
    }
    enum DragSpace {
        World = "World",
        Local = "Local"
    }
    enum Triggered {
        NORMAL = 0,
        SET_TO_ORG = 1,
        RETURN_TO_ORG = 2
    }
    /**
     * 拖拽组件
     */
    class DraggableItem extends ps.Behaviour {
        itemEvent: ps.EventDispatcher;
        /** 目标区域，用于拖拽检查是否命中，可存在多个区域，遍历命中一个则返回 */
        targetAreas: qc.Node[];
        /** 目标对象，用于回到或设置到目标对象位置 */
        targetObj: qc.Node;
        worldObj: qc.Node;
        returnAnimTime: number;
        diffX: number;
        diffY: number;
        diffS: number;
        triggered: Triggered;
        triggerHide: boolean;
        dragSpace: DragSpace;
        orgX: number;
        orgY: number;
        orgS: number;
        orgParent: qc.Node;
        orgIndex: number;
        /** 序列化 */
        private serializableFields;
        constructor(gameObject: qc.Node);
        awake(): void;
        onInit(): void;
        onDown(e: qc.PointerEvent): void;
        onDragStart(e: qc.DragEndEvent): void;
        onDrag(e: qc.DragEvent): void;
        private lastHitTarget;
        checkHitTargetArea(globalPoint: qc.Point): qc.Node;
        onDragEnd(e: qc.DragEndEvent): void;
        onUp(e: qc.PointerEvent): void;
        onClick(e: qc.PointerEvent): void;
        dragEnd(e: qc.DragEndEvent | qc.PointerEvent): void;
        /** 回到原处 */
        returnToOrgPos(): void;
        /** 设置到原处 */
        setToOrgPos(): void;
        /** 回到目标位 */
        returnToTarget(offset?: qc.Node, target?: qc.Node): void;
        /** 设置到目标位 */
        setToTarget(offset?: qc.Node, target?: qc.Node): void;
    }
}
