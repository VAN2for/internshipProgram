/**
 * 倒计时 - 编辑器菜单拓展
 * @description 倒计时，时间改变、倒计时结束时触发事件
 * @author JingBin
 * @argument 第一个参数为自定义的脚本组件类名
 * @argument 第二个参数为重载的绘制函数
 */
G.extend.inspector('ps.CountDown', function () {
    var self = this,
        target = self.target;

    var gui = qc.editor.gui;

    // 标题分割线-start
    gui.columnWidths = ['60+0.1', '60+0.1', '60+0.1'];
    gui.line([
        gui.divider({ color: "#333333" }),
        gui.text('倒计时', { align: 'center' }),
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
        gui.text('当前时间（秒）'),
        gui.intInput({ bind: 'value' })
    ]);

    gui.columnWidths = ['60+0.1', '120+0.2'];
    gui.line([
        gui.text('是否自动开始'),
        gui.checkBox({ bind: '_isAutoStart' })
    ]);

    gui.columnWidths = ['60+0.1', '120+0.2'];
    gui.line([
        gui.text('显示风格类型'),
        gui.dropDownList({
            items: [
                {
                    value: "{1}:{0}",
                    label: "分:秒"
                },
                {
                    value: "{2}:{1}:{0}",
                    label: "时:分:秒"
                },
                {
                    value: "{1} : {0}",
                    label: "分 : 秒"
                },
                {
                    value: "{2} : {1} : {0}",
                    label: "时 : 分 : 秒"
                }
            ],
            bind: 'showStyle'
        }),
    ]);

    gui.columnWidths = ['60+0.1', '120+0.2'];
    gui.line([
        gui.text('当前值变更事件'),
        gui.stringInput({ bind: '_customEventOnChange' }),
    ]);

    gui.columnWidths = ['60+0.1', '120+0.2'];
    gui.line([
        gui.text('倒计时结束事件'),
        gui.stringInput({ bind: '_customEventOnComplete' }),
    ]);

    gui.columnWidths = ['60+0.1', '120+0.2'];
    gui.line([
        gui.text('剩几秒算接近结束'),
        gui.intInput({ bind: '_nearCompleteValue' })
    ]);

    gui.columnWidths = ['60+0.1', '120+0.2'];
    gui.line([
        gui.text('倒计时接近结束事件'),
        gui.stringInput({ bind: '_customEventOnNearComplete' }),
    ]);

    gui.columnWidths = ['60+0.1', '120+0.2'];
    gui.line([
        gui.text('是否每秒触发，倒计时接近结束事件'),
        gui.checkBox({ bind: '_isLoopTriggerCustomEventOnNearComplete' })
    ]);

    // 标题分割线-end
    gui.columnWidths = ['60+0.1', '60+0.1', '60+0.1'];
    gui.line([
        gui.divider({ color: "#333333" }, { colspan: 3 })
    ]);
});