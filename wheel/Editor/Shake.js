/**
 * 震动组件 - 编辑器菜单拓展
 * @author JingBin
 * @argument 第一个参数为自定义的脚本组件类名
 * @argument 第二个参数为重载的绘制函数
 */
G.extend.inspector('ps.Shake', function () {
    var self = this,
        target = self.target;

    var gui = qc.editor.gui;

    // 标题分割线-start
    gui.columnWidths = ['60+0.1', '60+0.1', '60+0.1'];
    gui.line([
        gui.divider({ color: "#333333" }),
        gui.text('震动组件', { align: 'center' }),
        gui.divider({ color: "#333333" })
    ]);

    // 震动坐标轴
    var ShakeXY = {
        X: 0, //X
        Y: 1, //Y
        XY: 2, //XY
    }

    gui.columnWidths = ['100+0.1', '120+0.2', '1+0.01', '5+0.1', '5+0.1'];
    gui.line([
        gui.text('震动坐标轴：'),
        gui.buttonGroup([
            {
                text: 'X',
                value: ShakeXY.X
            },
            {
                text: 'Y',
                value: ShakeXY.Y
            },
            {
                text: 'XY',
                value: ShakeXY.XY
            }
        ], { bind: 'shakeXY' }), //绑定属性
    ]);

    // 绘制默认控件
    self.defaultDraw();

    // 标题分割线-end
    gui.columnWidths = ['60+0.1', '60+0.1', '60+0.1'];
    gui.line([
        gui.divider({ color: "#333333" }, { colspan: 3 })
    ]);
});