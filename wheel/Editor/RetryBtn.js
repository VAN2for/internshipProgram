/**
 * 重玩按钮组件 - 编辑器菜单拓展
 * @description 重玩按钮组件
 * @author JingBin
 * @argument 第一个参数为自定义的脚本组件类名
 * @argument 第二个参数为重载的绘制函数
 */
G.extend.inspector('ps.RetryBtn', function () {
    var self = this,
        target = self.target;

    var gui = qc.editor.gui;

    // 标题分割线-start
    gui.columnWidths = ['60+0.1', '60+0.1', '60+0.1'];
    gui.line([
        gui.divider({ color: "#333333" }),
        gui.text('重玩按钮组件', { align: 'center' }),
        gui.divider({ color: "#333333" })
    ]);

    // 绘制默认控件
    // self.defaultDraw();

    // 空行
    // gui.columnWidths = ['60+0.1', '60+0.1', '60+0.1'];
    // gui.line([
    //     gui.empty({ colspan: 3 })
    // ]);

    gui.columnWidths = ['60+0.1', '120+0.2'];
    gui.line([
        gui.text('是否激活'),
        gui.checkBox({ bind: 'active' })
    ]);

    gui.columnWidths = ['60+0.1', '120+0.2'];
    gui.line([
        gui.text('重玩参数的Key'),
        gui.stringInput({ bind: '_playAgainKey' }),
    ]);

    gui.columnWidths = ['60+0.1', '120+0.2'];
    gui.line([
        gui.text('没有次数后点击跳转商店'),
        gui.checkBox({ bind: 'toInstall' })
    ]);
    /** 跳转类型 */
    var InstallType = {
        None: 1 << 0, //正常跳转
        Global: 1 << 1, //全局跳转
        Auto: 1 << 2, //自动跳转
        YouDao: 1 << 3, //诱导跳转
    }

    gui.columnWidths = ['60+0.1', '120+0.2'];
    gui.line([
        gui.text('跳转类型'),
        gui.dropDownList({
            items: [
                {
                    value: InstallType.None,
                    label: "正常跳转"
                },
                {
                    value: InstallType.Global,
                    label: "全局跳转"
                },
                {
                    value: InstallType.Auto,
                    label: "自动跳转"
                },
                {
                    value: InstallType.YouDao,
                    label: "诱导跳转"
                },
            ],
            bind: '_installType'
        }),
    ]);

    gui.columnWidths = ['60+0.1', '120+0.2'];
    gui.line([
        gui.text('没有次数后隐藏按钮'),
        gui.checkBox({ bind: 'autoHide' })
    ]);

    // 标题分割线-end
    gui.columnWidths = ['60+0.1', '60+0.1', '60+0.1'];
    gui.line([
        gui.divider({ color: "#333333" }, { colspan: 3 })
    ]);
});