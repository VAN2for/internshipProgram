/**
 * 所有目标（区域）物品（触控） - 编辑器菜单拓展
 * @author JingBin
 * @argument 第一个参数为自定义的脚本组件类名
 * @argument 第二个参数为重载的绘制函数
 */
G.extend.inspector('ps.FindItemsTouchView', function () {
    var self = this,
        target = self.target;

    var gui = qc.editor.gui;

    // 标题分割线-start
    gui.columnWidths = ['30+0.1', '120+0.2', '30+0.1'];
    gui.line([
        gui.divider({ color: "#333333" }),
        gui.text('所有目标（区域）物品（触控）', { align: 'center' }),
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
        gui.text('寻找物品（触控）可操作区域节点'),
        gui.objectInput({ objectType: 'node', target: target, bind: '_nodeOptionArea' }),
    ]);

    // 标题分割线-end
    gui.columnWidths = ['60+0.1', '60+0.1', '60+0.1'];
    gui.line([
        gui.divider({ color: "#333333" }, { colspan: 3 })
    ]);
});