/**
 * 拼图玩法 - 编辑器菜单拓展
 * @author JingBin
 * @argument 第一个参数为自定义的脚本组件类名
 * @argument 第二个参数为重载的绘制函数
 */
G.extend.inspector('ps.ScrapeOff', function () {
    var self = this,
        target = self.target;

    var gui = qc.editor.gui;

    // 标题分割线-start
    gui.columnWidths = ['60+0.1', '60+0.1', '60+0.1'];
    gui.line([
        gui.divider({ color: "#333333" }),
        gui.text('刮刮乐', { align: 'center' }),
        gui.divider({ color: "#333333" })
    ]);

    // 绘制默认控件
    // self.defaultDraw();
    gui.columnWidths = ['70+0.1', '100+0.2'];
    gui.line([
        gui.text('笔触大小'),
        gui.intInput({ bind: 'channelSize' }),
    ]);

    gui.columnWidths = ['100+0.1', '70+0.2'];
    gui.line([
        gui.text('是否开启纯色面板'),
        checkBoxSolidColor = gui.checkBox({ bind: 'isSolidColor' })
    ]);

    checkBoxSolidColor.syncToGame = function (value) {
        self.repaint();
        target.isSolidColor = value;
    };
    if (target.isSolidColor) {
        gui.columnWidths = ['70+0.1', '100+0.2'];
        gui.line([
            gui.text('面板颜色'),
            gui.colorPicker({ bind: 'solidColor' })
        ]);
    } else {

    }

    gui.columnWidths = ['20+0.1', '140+0.1', '20+0.1'];
    gui.line([
        gui.divider({ color: "#333333" }),
        gui.text('以下功能会影响素材性能', { align: 'center' }),
        gui.divider({ color: "#333333" })
    ]);
    gui.line([
        gui.divider({ color: "#333333" }),
        gui.text('请根据实际情况使用', { align: 'center' }),
        gui.divider({ color: "#333333" })
    ]);

    gui.columnWidths = ['100+0.1', '70+0.2'];
    gui.line([
        gui.text('是否刷新BMD数据'),
        checkBoxUpdateBMD = gui.checkBox({ bind: 'isUpdateBMD' })
    ]);

    checkBoxUpdateBMD.syncToGame = function (value) {
        self.repaint();
        target.isUpdateBMD = value;
    };

    if (target.isUpdateBMD) {
        gui.columnWidths = ['100+0.1', '70+0.2'];
        gui.line([
            gui.text('是否获取填充百分比'),
            checkBoxFilledPercentage = gui.checkBox({ bind: 'isFilledPercentage' })
        ]);
        checkBoxFilledPercentage.syncToGame = function (value) {
            self.repaint();
            target.isFilledPercentage = value;
        };
        if (target.isFilledPercentage) {
            gui.columnWidths = ['150+0.1', '30+0.2'];
            gui.line([
                gui.text('获取百分比刷新间隔时间(ms)'),
                gui.intInput({ bind: 'refrshInterval' }),
            ]);
        } else {

        }
    } else {

    }


    // // 标题分割线-end
    // gui.columnWidths = ['60+0.1', '60+0.1', '60+0.1'];
    // gui.line([
    //     gui.divider({ color: "#333333" }, { colspan: 3 })
    // ]);
});