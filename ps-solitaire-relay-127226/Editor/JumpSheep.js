G.extend.inspector('ps.JumpSheep', function () {
    var self = this,
        target = self.target;

    var gui = qc.editor.gui;

    // 标题分割线-start
    gui.columnWidths = ['60+0.1', '60+0.1', '60+0.1'];
    gui.line([
        gui.divider({ color: "#333333" }),
        gui.text('角色组件', { align: 'center' }),
        gui.divider({ color: "#333333" })
    ]);


    gui.columnWidths = ['120+0.2', '60+0.1'];
    gui.line([
        gui.text('重力'),
        gui.numberInput({ bind: '_g', min: 0 }),
    ]);

    gui.line([
        gui.text('角色竖直方向的初始速度'),
        gui.numberInput({ bind: '_vyInit' }),
    ]);

    gui.line([
        gui.text('角色被撞飞时水平方向的速度'),
        gui.numberInput({ bind: '_vx', min: 0 }),
    ]);

    gui.line([
        gui.text('角色站着的节点'),
        gui.objectInput({ objectType: 'node', target, bind: '_nodeStand' })
    ]);

    gui.line([
        gui.text('角色跳着的节点'),
        gui.objectInput({ objectType: 'node', target, bind: '_nodeJump' })
    ]);

    gui.line([
        gui.text('角色躺着的节点'),
        gui.objectInput({ objectType: 'node', target, bind: '_nodeDie' })
    ]);

    gui.line([
        gui.text('挂载了全局(JumpView)组件的节点'),
        gui.objectInput({ objectType: 'node', target, bind: '_jumpView' })
    ]);
});