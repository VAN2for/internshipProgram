/** 打砖块玩法模板 砖块控制组件 编辑器扩展 */
G.extend.inspector("ps.BrickControl", function () {
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
        gui.text('打砖块玩法砖块控制组件', { align: 'center' }),
        gui.divider({ color: "#333333" })
    ]);

    gui.columnWidths = ["50+0.1", "120+0.3"];

    gui.line([
        gui.text('砖块数量'),
        gui.intInput(
            {
                value: 1,
                min: 1,
                bind: 'brickNum'
            }
        )
    ])

    gui.line([
        gui.text('世界的重力值设定'),
        gui.intInput(
            {
                value: 0,
                bind: 'Box2DGravity'
            }
        )
    ])

    gui.line([
        gui.text('像素到米的转换比率'),
        gui.intInput(
            {
                value: 100,
                bind: 'Box2DPTM'
            }
        )
    ])

    gui.line([
        gui.text('期望物理的调度帧率'),
        gui.intInput(
            {
                value: 60,
                bind: 'Box2DFrameRate'
            }
        )
    ])

});
