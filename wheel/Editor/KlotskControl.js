/** 华容道玩法模板 控制组件 编辑器扩展 */
G.extend.inspector('ps.KlotskControl', function () {
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
        gui.text('华容道玩法控制组件', { align: 'center' }),
        gui.divider({ color: "#333333" })
    ]);

    gui.columnWidths = ["110+0.1", "60+0.5"];

    gui.line([
        gui.text('所需正确碎片数量'),
        gui.intInput({
            value: 1,
            min: 1,
            bind: "puzzleNumber",
        }),
    ]);

    gui.line([
        gui.text('行数'),
        gui.intInput({
            value: 1,
            min: 1,
            bind: "puzzleRow",
        }),
    ]);

    gui.line([
        gui.text('列数'),
        gui.intInput({
            value: 1,
            min: 1,
            bind: "puzzleLine",
        }),
    ]);

});