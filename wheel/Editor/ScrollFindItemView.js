/**
 * 目标物品（触控） - 编辑器菜单拓展
 * @author QiaoSen.huang
 * @argument 第一个参数为自定义的脚本组件类名
 * @argument 第二个参数为重载的绘制函数
 */
 G.extend.inspector('ps.ScrollFindItemView', function () {
    var self = this,
        target = self.target;

    var gui = qc.editor.gui;

    // 标题分割线-start
    gui.columnWidths = ['60+0.1', '60+0.1', '60+0.1'];
    gui.line([
        gui.divider({ color: "#333333" }),
        gui.text('目标物品（触控）', { align: 'center' }),
        gui.divider({ color: "#333333" })
    ]);

    // 绘制默认控件
    self.defaultDraw();

    // 空行
    // gui.columnWidths = ['60+0.1', '60+0.1', '60+0.1'];
    // gui.line([
    //     gui.empty({ colspan: 3 })
    // ]);


    gui.columnWidths = ['120+0.2', '60+0.1'];
    gui.line([
        gui.text('是否手指按下触发，否则为点击'),
        gui.checkBox({ bind: '_isDown' })
    ]);

    gui.columnWidths = ['120+0.2', '60+0.1'];
    gui.line([
        gui.text('触控到正确目标后的音效'),
        gui.stringInput({ bind: '_soundName' }),
    ]);

    gui.columnWidths = ['120+0.2', '60+0.1'];
    gui.line([
        gui.text('触控到正确目标后的埋点'),
        gui.intInput({ bind: '_action' }),
    ]);

    // 标题分割线-end
    gui.columnWidths = ['60+0.1', '60+0.1', '60+0.1'];
    gui.line([
        gui.divider({ color: "#333333" }, { colspan: 3 })
    ]);
});