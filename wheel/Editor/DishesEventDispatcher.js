/**
 * 厨房玩法目标 - 编辑器菜单拓展
 */
G.extend.inspector("ps.DishesEventDispatcher", function () {
    var self = this,
        target = self.target;

    // 先调用默认的绘制方法
    // self.defaultDraw();

    // 调用自己的绘制
    var gui = qc.editor.gui;
    gui.columnWidths = ["70+0.1", "60+0.5"];
    gui.line([
        gui.text("触发方式"),
        gui.buttonGroup(
            [
                {
                    text: "点击时",
                    value: 0,
                },
                {
                    text: "按下时",
                    value: 1,
                },
            ],
            { bind: "dispatchType", value: 0 }
        ),
    ]);
    gui.line([
        gui.text("触发事件节点"),
        gui.objectInput({
            objectType: "node",
            target: target,
            bind: "dishesNode",
        }),
    ]);
    gui.line([
        gui.text("菜品编号"),
        gui.intInput({
            value: 0,
            bind: "dishesId",
        }),
    ]);
});
