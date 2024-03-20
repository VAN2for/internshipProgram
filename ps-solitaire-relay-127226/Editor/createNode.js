/** 2048数字射击玩法模板 数字棋盘模板 */
G.extend.inspector('ps.createNode', function () {
    var self = this,
        target = self.target;

    // 调用默认的绘制方法
    // self.defaultDraw();

    // 调用自己的绘制
    var gui = qc.editor.gui;

    // 标题分割线-start
    gui.columnWidths = ['60+0.3', '120+0.1', '60+0.3'];
    gui.line([
        gui.divider({ color: "#333333" }),
        gui.text('2048数字射击玩法控制组件', { align: 'center' }),
        gui.divider({ color: "#333333" })
    ]);

    gui.columnWidths = ["110+0.1", "60+0.5"];

    gui.line([
        gui.text('行坐标'),
        gui.intInput({
            value: 8,
            bind: "_row",
        }),
    ]);

    gui.line([
        gui.text('列坐标'),
        gui.intInput({
            value: 5,
            bind: "_col",
        }),
    ]);

    gui.line([
        gui.text('数值'),
        gui.intInput({
            value: 5,
            bind: "_value",
        }),
    ]);
});
