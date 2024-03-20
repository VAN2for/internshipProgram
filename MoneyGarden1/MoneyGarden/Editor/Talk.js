/**
 * 对话框组件 - 编辑器菜单拓展
 * @author JingBin
 * @argument 第一个参数为自定义的脚本组件类名
 * @argument 第二个参数为重载的绘制函数
 */
G.extend.inspector('ps.Talk', function () {
    var self = this,
        target = self.target;

    var gui = qc.editor.gui;

    // 标题分割线-start
    gui.columnWidths = ['60+0.1', '60+0.1', '60+0.1'];
    gui.line([
        gui.divider({ color: "#333333" }),
        gui.text('对话框组件', { align: 'center' }),
        gui.divider({ color: "#333333" })
    ]);

    // 绘制默认控件
    self.defaultDraw();

    // 使用冒泡组件
    if (target.UseBubble() == void 0) target.UseBubble(false)

    gui.columnWidths = ['60+0.1', '120+0.1'];
    var checkBox;
    gui.line([
        gui.text('使用冒泡组件'),
        checkBox = gui.checkBox({ selected: target.UseBubble() })
    ]);
    // 值变化回调函数
    checkBox.onValueChanged = function (newValue) {
        target.UseBubble(newValue)
    };

    // 空行
    // gui.columnWidths = ['60+0.1', '60+0.1', '60+0.1'];
    // gui.line([
    //     gui.empty({ colspan: 3 })
    // ]);

    // 刷新按钮
    gui.columnWidths = ["70+0.1"];
    gui.line([
        playBtn = gui.button('刷新'),
    ]);
    // 注册点击事件
    playBtn.on('click', function () {
        target.refresh();
    });

    // 标题分割线-end
    gui.columnWidths = ['60+0.1', '60+0.1', '60+0.1'];
    gui.line([
        gui.divider({ color: "#333333" }, { colspan: 3 })
    ]);
});