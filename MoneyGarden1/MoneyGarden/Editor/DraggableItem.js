G.extend.inspector('DraggableItem', function () {
    var self = this,
        target = self.target;

    var gui = qc.editor.gui;

    // 标题分割线-start
    gui.columnWidths = ['60+0.1', '60+0.1', '60+0.1'];
    gui.line([
        gui.divider({ color: "#333333" }),
        gui.text('拖拽组件', { align: 'center' }),
        gui.divider({ color: "#333333" })
    ]);

    // 绘制默认控件
    self.defaultDraw();

    // 空行
    // gui.columnWidths = ['60+0.1', '60+0.1', '60+0.1'];
    // gui.line([
    //     gui.empty({ colspan: 3 })
    // ]);

    // 命中目标后的操作
    var Triggered = {
        NORMAL: 0, //无操作
        SET_TO_ORG: 1, //设置回原位
        RETURN_TO_ORG: 2, //缓动回原位
    }

    gui.columnWidths = ['100+0.1', '120+0.2', '1+0.01', '5+0.1', '5+0.1'];
    gui.line([
        gui.text('命中目标后：'),
        gui.buttonGroup([
            {
                text: '无操作',
                value: Triggered.NORMAL
            },
            {
                text: '设置回原位',
                value: Triggered.SET_TO_ORG
            },
            {
                text: '缓动回原位',
                value: Triggered.RETURN_TO_ORG
            }
        ], { bind: 'triggered' }), //绑定属性
        gui.text(''),
        gui.text('隐藏'),
        gui.checkBox({ selected: target.triggerHide, bind: 'triggerHide' })
    ]);

    // 是否拖拽时置顶
    var DragSpace = { World: 'World', Local: 'Local' }
    
    gui.columnWidths = ['60+0.1', '120+0.2'];
    gui.line([
        gui.text('是否拖拽时置顶'),
        gui.dropDownList({
            items: [
                { label: '是', value: DragSpace.World },
                { label: '否', value: DragSpace.Local },
            ],
            bind: 'dragSpace'
        })
    ]);

    // 标题分割线-end
    gui.columnWidths = ['60+0.1', '60+0.1', '60+0.1'];
    gui.line([
        gui.divider({ color: "#333333" }, { colspan: 3 })
    ]);
});