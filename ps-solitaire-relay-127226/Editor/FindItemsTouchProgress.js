/**
 * 目标物品（触控）进度监控 - 编辑器菜单拓展
 * @description 目标物品（触控）进度监控，监控触控到目标（区域）节点的次数，到达目标时触发事件
 * @author JingBin
 * @argument 第一个参数为自定义的脚本组件类名
 * @argument 第二个参数为重载的绘制函数
 */
G.extend.inspector('ps.FindItemsTouchProgress', function () {
    var self = this,
        target = self.target;

    var gui = qc.editor.gui;

    // 标题分割线-start
    gui.columnWidths = ['60+0.1', '60+0.1', '60+0.1'];
    gui.line([
        gui.divider({ color: "#333333" }),
        gui.text('目标物品（触控）进度监控', { align: 'center' }),
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
        gui.text('当前值'),
        gui.intInput({
            bind: 'value',
            min: 0,
        })
    ]);

    gui.columnWidths = ['60+0.1', '120+0.2'];
    gui.line([
        gui.text('最大目标值'),
        gui.intInput({ 
            bind: 'maxValue',
            min: 1,
         })
    ]);

    gui.columnWidths = ['60+0.1', '120+0.2'];
    gui.line([
        gui.text('监听节点'),
        gui.objectInput({ objectType: 'node', target, bind: '_listenerNode' })
    ]);

    var FindItemTouchEvent = {
        onDown: "onDown", //触控按下
        onUp: "onUp", //触控抬起
        onClick: "onClick", //点击
        CorrectTarget: "CorrectTarget", //触控到正确目标
        ErrorTarget: "ErrorTarget", //触控到错误目标（区域）
    }

    gui.columnWidths = ['60+0.1', '120+0.2'];
    gui.line([
        gui.text('监听类型'),
        gui.dropDownList({
            items: [
                {
                    value: FindItemTouchEvent.onDown,
                    label: "触控按下",
                },
                {
                    value: FindItemTouchEvent.onUp,
                    label: "触控抬起",
                },
                {
                    value: FindItemTouchEvent.onClick,
                    label: "点击",
                },
                {
                    value: FindItemTouchEvent.CorrectTarget,
                    label: "触控到正确目标",
                },
                {
                    value: FindItemTouchEvent.ErrorTarget,
                    label: "触控到错误目标（区域）",
                }
            ],
            bind: '_listenerType'
        }),
    ]);

    gui.columnWidths = ['60+0.1', '120+0.2'];
    gui.line([
        gui.text('目标显示风格类型'),
        gui.dropDownList({
            items: [
                {
                    value: "{0}/{1}",
                    label: "当前值/最大目标值",
                },
                {
                    value: "{0}-{1}",
                    label: "当前值-最大目标值",
                },
                {
                    value: "{0}:{1}",
                    label: "当前值:最大目标值",
                },
                {
                    value: "{0} / {1}",
                    label: "当前值 / 最大目标值",
                },
                {
                    value: "{0} - {1}",
                    label: "当前值 - 最大目标值",
                },
                {
                    value: "{0} : {1}",
                    label: "当前值 : 最大目标值",
                }
            ],
            bind: 'showStyle'
        }
        ),
    ]);

    gui.columnWidths = ['60+0.1', '120+0.2'];
    gui.line([
        gui.text('当前值变更事件'),
        gui.stringInput({ bind: '_customEventOnChange' }),
    ]);

    gui.columnWidths = ['60+0.1', '120+0.2'];
    gui.line([
        gui.text('目标完成事件'),
        gui.stringInput({ bind: '_customEventOnComplete' }),
    ]);

    // 标题分割线-end
    gui.columnWidths = ['60+0.1', '60+0.1', '60+0.1'];
    gui.line([
        gui.divider({ color: "#333333" }, { colspan: 3 })
    ]);
});