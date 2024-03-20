G.extend.inspector('ps.SpinWheel', function () {
    var self = this,
        target = self.target;

    var gui = qc.editor.gui;

    gui.columnWidths = ['60+0.1', '60+0.1', '60+0.1'];
    gui.line([
        gui.divider({ color: "#333333" }),
        gui.text('转盘玩法', { align: 'center' }),
        gui.divider({ color: "#333333" })
    ]);

    gui.line([
        gui.text('旋转容器'),
        gui.objectInput({
            objectType: 'node',
            target: target,
            bind: 'wheel'
        })
    ]);

    gui.line([
        gui.text('转盘块数'),
        gui.intInput({
            min: 1,
            max: 360,
            bind: 'portions'
        })
    ]);

    gui.line([
        gui.text('转盘一圈耗时（秒）'),
        gui.numberInput({
            min: 0.01,
            max: 100,
            bind: 'secondPerCycle'
        })
    ]);

    gui.line([
        gui.text('加速阶段耗时（秒）'),
        gui.numberInput({
            min: 0.01,
            max: 100,
            bind: 'accelerateDuration'
        })
    ]);

    gui.line([
        gui.text('加速阶段目标角度（角度）'),
        gui.intInput({
            min: 1,
            max: 3600,
            bind: 'accelerateAngle'
        })
    ]);

    gui.line([
        gui.text('停止阶段耗时（秒）'),
        gui.numberInput({
            min: 0.01,
            max: 100,
            bind: 'stopDuration'
        })
    ]);

    gui.line([
        gui.text('旋转方向'),
        gui.buttonGroup([
            {
                text: '顺时针',
                value: true
            },
            {
                text: '逆时针',
                value: false
            },

        ], { bind: 'clockWise' })
    ]);

    gui.line([
        gui.divider({ color: "#333333" })
    ]);

    // 绘制默认控件
    // self.defaultDraw();
});