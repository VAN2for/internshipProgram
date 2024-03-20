G.extend.inspector('ps.JumpMeter', function () {
    var self = this,
        target = self.target;

    var gui = qc.editor.gui;

    // 标题分割线-start
    gui.columnWidths = ['60+0.1', '60+0.1', '60+0.1'];
    gui.line([
        gui.divider({ color: "#333333" }),
        gui.text('阶段性反馈组件', { align: 'center' }),
        gui.divider({ color: "#333333" })
    ]);

    gui.columnWidths = ['120+0.2', '60+0.1'];
    gui.line([
        gui.text('挂载了全局(JumpView)组件的节点'),
        gui.objectInput({ objectType: 'node', target, bind: '_globalNode' })
    ]);
});