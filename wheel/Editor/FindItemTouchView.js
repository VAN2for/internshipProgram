/**
 * 目标物品（触控） - 编辑器菜单拓展
 * @author JingBin
 * @argument 第一个参数为自定义的脚本组件类名
 * @argument 第二个参数为重载的绘制函数
 */
G.extend.inspector('ps.FindItemTouchView', function () {
    var self = this,
        target = self.target;

    var gui = qc.editor.gui;

    // 标题分割线-start
    gui.columnWidths = ['60+0.1', '60+0.1', '60+0.1'];
    gui.line([
        gui.divider({ color: "#333333" }),
        gui.text('目标物品（触控）', { align: 'center' }),
        gui.divider({ color: "#333333" })
    ]);

    // 绘制默认控件
    // self.defaultDraw();

    // 空行
    // gui.columnWidths = ['60+0.1', '60+0.1', '60+0.1'];
    // gui.line([
    //     gui.empty({ colspan: 3 })
    // ]);


    gui.columnWidths = ['120+0.2', '60+0.1'];
    gui.line([
        gui.text('是否为手指按下正确目标时触发，否则为点击'),
        gui.checkBox({ bind: '_isDown' })
    ]);

    // 触控到正确目标后对节点的操作
    var Touched = {
        NONE: 0, //无操作
        HIDE: 1, //隐藏
        DESTROY: 2, //销毁
        ONCE: 3, //不再触发
    }

    gui.columnWidths = ['120+0.2', '60+0.1'];
    gui.line([
        gui.text('触控到正确目标后对节点的操作：'),
        gui.dropDownList({
            items: [
                {
                    value: Touched.NONE,
                    label: "无操作"
                },
                {
                    value: Touched.HIDE,
                    label: "隐藏"
                },
                {
                    value: Touched.DESTROY,
                    label: "销毁"
                },
                {
                    value: Touched.ONCE,
                    label: "不再触发"
                }
            ],
            bind: '_touched'
        }),
    ]);

    gui.columnWidths = ['120+0.2', '60+0.1'];
    gui.line([
        gui.text('触控到正确目标后的音效'),
        gui.stringInput({ bind: '_soundName' }),
    ]);

    gui.columnWidths = ['120+0.2', '60+0.1'];
    gui.line([
        gui.text('触控到正确目标后的埋点'),
        gui.intInput({ bind: '_action' }),
    ]);

    gui.columnWidths = ['60+0.1', '120+0.2'];
    gui.line([
        gui.text('触控按下事件'),
        gui.stringInput({ bind: '_customEventOnDown' }),
    ]);

    gui.columnWidths = ['60+0.1', '120+0.2'];
    gui.line([
        gui.text('触控抬起事件'),
        gui.stringInput({ bind: '_customEventOnUp' }),
    ]);

    gui.columnWidths = ['60+0.1', '120+0.2'];
    gui.line([
        gui.text('点击事件'),
        gui.stringInput({ bind: '_customEventOnClick' }),
    ]);

    gui.columnWidths = ['60+0.1', '120+0.2'];
    gui.line([
        gui.text('触控到目标（区域）事件'),
        gui.stringInput({ bind: '_customEventTarget' }),
    ]);

    gui.columnWidths = ['60+0.1', '120+0.2'];
    gui.line([
        gui.text('触控到目标（区域）事件节点'),
        gui.objectInput({ objectType: 'node', target, bind: '_customEventTargetNode' })
    ]);

    gui.columnWidths = ['60+0.1', '120+0.2'];
    gui.line([
        gui.text('触控到目标（区域）联动节点'),
        gui.objectInput({ objectType: 'node', target, bind: '_customEventRelationNode' })
    ]);

    // 标题分割线-end
    gui.columnWidths = ['60+0.1', '60+0.1', '60+0.1'];
    gui.line([
        gui.divider({ color: "#333333" }, { colspan: 3 })
    ]);
});