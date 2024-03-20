class DraggableItemSample extends ps.Behaviour {
    constructor(gameObject: qc.Node) {
        super(gameObject)
    }
    onStart() {
        this.addListen()
    }

    addListen() {
        const messageText: qc.UIText = UIRoot.getChild('messageText') as qc.UIText
        for (let i = 1; i < 5; i++) {
            let item = UIRoot.getChild('item' + i)
            let DraggableItem = item.getScript(ps.DraggableItem) as ps.DraggableItem
            DraggableItem.itemEvent.add(ps.DraggableItemEvent.MissTarget, (endPoint: qc.Point) => { messageText.text = `item${i}归位。\n错误位置为${endPoint.x.toFixed(0)},${endPoint.y.toFixed(0)}` })
            DraggableItem.itemEvent.add(ps.DraggableItemEvent.TriggerTarget, () => { messageText.text = `item${i}触发目标！` })
        }
    }

}

qc.registerBehaviour('DraggableItemSample', DraggableItemSample)