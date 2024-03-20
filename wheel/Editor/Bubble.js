/**
 * 冒泡组件 - 编辑器菜单拓展
 * @author JingBin
 * @argument 第一个参数为自定义的脚本组件类名
 * @argument 第二个参数为重载的绘制函数
 */
G.extend.inspector('ps.Bubble', function () {
    var self = this,
        target = self.target;

    var gui = qc.editor.gui;

    // 标题分割线-start
    gui.columnWidths = ['60+0.1', '60+0.1', '60+0.1'];
    gui.line([
        gui.divider({ color: "#333333" }),
        gui.text('冒泡组件', { align: 'center' }),
        gui.divider({ color: "#333333" })
    ]);

    // 绘制默认控件
    self.defaultDraw();

    // 使用冒泡组件
    if (target.debug == void 0) target.debug = false

    gui.columnWidths = ['120+0.1', '60+0.1'];
    var checkBox;
    gui.line([
        gui.text('Debug模式，点击播放动画'),
        checkBox = gui.checkBox({ selected: target.debug })
    ]);
    // 值变化回调函数
    checkBox.onValueChanged = function (newValue) {
        target.debug = newValue
    };

    // 空行
    // gui.columnWidths = ['60+0.1', '60+0.1', '60+0.1'];
    // gui.line([
    //     gui.empty({ colspan: 3 })
    // ]);

    gui.columnWidths = ["60+0.1", '60+0.1'];
    gui.line([
        // 弹出按钮
        playBtn1 = gui.button('弹出'),
        // 收起按钮
        playBtn2 = gui.button('收起'),
    ]);
    // 注册点击事件
    playBtn1.on('click', function () {
        target.show();
    });
    playBtn2.on('click', function () {
        target.hide();
    });

    // 标题分割线-end
    gui.columnWidths = ['60+0.1', '60+0.1', '60+0.1'];
    gui.line([
        gui.divider({ color: "#333333" }, { colspan: 3 })
    ]);
});