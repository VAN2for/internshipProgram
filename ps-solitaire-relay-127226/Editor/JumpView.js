G.extend.inspector('ps.JumpView', function () {
    var self = this,
        target = self.target;

    var gui = qc.editor.gui;

    // 标题分割线-start
    gui.columnWidths = ['60+0.1', '60+0.1', '60+0.1'];
    gui.line([
        gui.divider({ color: "#333333" }),
        gui.text('全局组件', { align: 'center' }),
        gui.divider({ color: "#333333" })
    ]);

    gui.columnWidths = ['120+0.2', '60+0.1'];
    gui.line([
        gui.text(' 挂载了盒子(JumpBox)组件的节点'),
        gui.objectInput({ objectType: 'node', target, bind: '_boxFab' })
    ]);

    gui.line([
        gui.text('挂载了角色(JumpSheep)组件的节点'),
        gui.objectInput({ objectType: 'node', target, bind: '_petNode' })
    ]);

    gui.line([
        gui.text("静态背景节点"),
        gui.objectInput({ objectType: "node", target, bind: '_bg' })
    ])

    gui.columnWidths = ['60+0.1', '60+0.1', '60+0.1'];
    let fixAnchored;
    gui.line([
        gui.text('动态背景'),
        gui.objectInput({ objectType: 'node', target, bind: '_cloudFab' }),
        fixAnchored = gui.button('修改动态背景锚点')
    ]);

    fixAnchored.on('click', () => {
        target.fixAnchored();
    });


    gui.columnWidths = ['120+0.2', '60+0.1'];
    gui.line([
        gui.text('挂载了阶段性反馈(JumpMeter)组件的节点'),
        gui.objectInput({ objectType: 'node', target, bind: '_meterFab' })
    ]);

    gui.line([
        gui.text('移动节点'),
        gui.objectInput({ objectType: 'node', target, bind: '_nStage' })
    ]);

    gui.line([
        gui.text('游戏开始倒计时(ms)'),
        gui.numberInput({ bind: '_countdown', min: 0 }),
    ]);

    gui.line([
        gui.text("游戏过程中背景每次滚动的时间(ms)"),
        gui.numberInput({ bind: '_bgScrollTime', min: 0 })
    ])

    gui.line([
        gui.text("盒子生成距中心位置的x轴距离"),
        gui.numberInput({ bind: '_boxAppearX', min: 0 })
    ])

    gui.line([
        gui.text('阶段性胜利层数'),
        gui.numberInput({ bind: '_perMeter', min: 0 }),
    ]);

    gui.line([
        gui.text('胜利层数'),
        gui.numberInput({ bind: '_boxMaxNum', min: 1 }),
    ]);

    gui.line([
        gui.text('胜利后背景回到初始位置'),
        gui.checkBox({ bind: '_winIsToInit' }),
    ])

    gui.line([
        gui.text('胜利后间隔多久开始滚动(ms)'),
        gui.numberInput({ bind: '_winIsToInitTime' }),
    ])

    gui.line([
        gui.text('失败后背景回到初始位置'),
        gui.checkBox({ bind: '_defeatIsToInit' })
    ])

    gui.line([
        gui.text('失败后间隔多久开始滚动(ms)'),
        gui.numberInput({ bind: '_defeatIsToInitTime' }),
    ])
});