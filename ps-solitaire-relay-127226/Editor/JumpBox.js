G.extend.inspector('ps.JumpBox', function () {
    var self = this,
        target = self.target;

    var gui = qc.editor.gui;

    // 标题分割线-start
    gui.columnWidths = ['60+0.1', '60+0.1', '60+0.1'];
    gui.line([
        gui.divider({ color: "#333333" }),
        gui.text('盒子组件', { align: 'center' }),
        gui.divider({ color: "#333333" })
    ]);


    gui.columnWidths = ['120+0.2', '60+0.1'];
    gui.line([
        gui.text('盒子速度'),
        gui.numberInput({ bind: '_v' }),
    ]);

    gui.line([
        gui.text('挂载了全局(JumpView)组件的节点'),
        gui.objectInput({ objectType: 'node', target, bind: '_jumpView' })
    ]);

    gui.columnWidths = ['180+0.2', '10+0.1'];
    gui.line([
        gui.text('第一个盒子是否需要停止(需停设以下属性)'),
        gui.checkBox({ bind: '_isNeedStop' })// 设置其选中
    ]);

    gui.columnWidths = ['120+0.2', '60+0.1'];
    gui.line([
        gui.text('第一个盒子速度'),
        gui.numberInput({ bind: '_initV' }),
    ]);

    gui.line([
        gui.text('第一个盒子停止的x值'),
        gui.numberInput({ bind: '_firstBoxX' }),
    ]);
});