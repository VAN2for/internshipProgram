/**
 * 拖拽组件 - 编辑器菜单拓展
 * @author JingBin
 * @argument 第一个参数为自定义的脚本组件类名
 * @argument 第二个参数为重载的绘制函数
 */
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

    gui.columnWidths = ['60+0.1', '120+0.2'];
    gui.line([
        gui.text('缓动动画耗时(ms)'),
        gui.intInput({ bind: 'returnAnimDuration' })
    ]);

    gui.columnWidths = ['60+0.1', '120+0.2'];
    gui.line([
        gui.text('拖拽时x偏移值'),
        gui.intInput({ bind: 'diffX' }),
    ]);

    gui.columnWidths = ['60+0.1', '120+0.2'];
    gui.line([
        gui.text('拖拽时y偏移值'),
        gui.intInput({ bind: 'diffY' }),
    ]);

    gui.columnWidths = ['60+0.1', '120+0.2'];
    gui.line([
        gui.text('拖拽时缩放倍数'),
        gui.numberInput({ bind: 'diffS' }),
    ]);

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
        gui.checkBox({ bind: 'triggerHide' })
    ]);

    // 错过目标后的操作
    var Missed = {
        NORMAL: 0, //无操作
        SET_TO_ORG: 1, //设置回原位
        RETURN_TO_ORG: 2, //缓动回原位
    }

    gui.columnWidths = ['100+0.1', '120+0.2', '1+0.01', '5+0.1', '5+0.1'];
    gui.line([
        gui.text('错过目标后：'),
        gui.buttonGroup([
            {
                text: '无操作',
                value: Missed.NORMAL
            },
            {
                text: '设置回原位',
                value: Missed.SET_TO_ORG
            },
            {
                text: '缓动回原位',
                value: Missed.RETURN_TO_ORG
            }
        ], { bind: 'missed' }), //绑定属性
        gui.text(''),
        gui.text('隐藏'),
        gui.checkBox({ bind: 'missHide' })
    ]);

    // 是否拖拽时置顶
    var DragSpace = { World: 'World', Local: 'Local' }

    gui.columnWidths = ['60+0.1', '60+0.1', '60+0.1', '60+0.1'];
    var dlDragSpace;
    var oiWorldObjTxt;
    var oiWorldObj;
    gui.line([
        gui.text('是否在顶层拖拽'),
        dlDragSpace = gui.dropDownList({
            items: [
                { label: '是', value: DragSpace.World },
                { label: '否', value: DragSpace.Local },
            ],
            bind: 'dragSpace'
        }),
        oiWorldObjTxt = gui.text('在哪拖拽'),
        oiWorldObj = gui.objectInput({ objectType: 'node', target, bind: 'worldObj' })
    ]);
    dlDragSpace.onValueChanged = function (value) {
        var display = value === DragSpace.World ? "none" : "block";
        oiWorldObjTxt.view.style.display = display;
        oiWorldObj.view.style.display = display;
    };

    gui.columnWidths = ['120+0.2', '60+0.1'];
    gui.line([
        gui.text('目标对象（用于缓动或设置到目标的对象）'),
        gui.objectInput({ objectType: 'node', target, bind: 'targetObj' })
    ]);

    // 标题分割线-end
    gui.columnWidths = ['60+0.1', '60+0.1', '60+0.1'];
    gui.line([
        gui.divider({ color: "#333333" }, { colspan: 3 })
    ]);
});