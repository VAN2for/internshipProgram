/**
 * 切水果触控底板 - 编辑器菜单拓展
 * @author weijia
 * @argument 第一个参数为自定义的脚本组件类名
 * @argument 第二个参数为重载的绘制函数
 */
 G.extend.inspector('ps.CutAreaView', function () {
    var self = this,
        target = self.target;

    var gui = qc.editor.gui;

    // 标题分割线-start
    gui.columnWidths = ['60+0.1', '60+0.1', '60+0.1'];
    gui.line([
        gui.divider({ color: "#333333" }),
        gui.text('切水果触控区域', { align: 'center' }),
        gui.divider({ color: "#333333" })
    ]);

    // 绘制默认控件
    self.defaultDraw();

    gui.columnWidths = ['90+0.1', '90+0.2'];
    gui.line([
        gui.text('切水果触控区域节点'),
        gui.objectInput({ objectType: 'node', target: target, bind: '_cutArea' }),
    ]);

    

    // 标题分割线-end
    gui.columnWidths = ['60+0.1', '60+0.1', '60+0.1'];
    gui.line([
        gui.divider({ color: "#333333" }, { colspan: 3 })
    ]);
});